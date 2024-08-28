import { getFileName, getFiles, readFile, getSourceFile } from "@utils/cli";
import { annotationMap } from "@cli/constants/maps";
import { toPascalCase } from '@utils/cli';
import path from "path";
import ts from 'typescript';

interface IFileBase {
    originName: string;
    filePath: string;
    content: string;
}

export interface IAnnotatedFile extends IFileBase {
    destinationName: string;
    annotations: string[];
    imports: string[];
    finalImports: string[];
    finalPath: string;
    prefix: 'client' | 'server' | 'shared' | 'module';
}

export interface IFile extends IFileBase {
}

export interface IFileData {
    annotatedFiles: IAnnotatedFile[];
    files: IFile[];
}

export default class FileData {
    private annotatedFiles: IAnnotatedFile[] = [];
    private files: IFile[] = [];


    constructor(private rootDir: string, private outputDir: string) {
        this.rootDir = rootDir;
        this.outputDir = outputDir;
    }

    perform(): IFileData {
        this.annotatedFiles = this.getAnnotatedFiles();
        this.files = this.getUnannotatedFiles();
        return {
            annotatedFiles: this.annotatedFiles,
            files: this.files
        }
    }

    private getAnnotatedFiles(): IAnnotatedFile[] {
        const files = getFiles(this.rootDir);
        const annotatedFiles: IAnnotatedFile[] = [];

        for (const file of files) {
            const content = readFile(file);
            const annotations = this.getAnnotations(content);
            if (annotations.length > 0) {

                const destination = this.getDestination(content);
                const prefix = annotationMap[annotations[0]].prefix;
                const destinationName = toPascalCase(getFileName(file).split('.')[0]) + `${prefix == 'module' ? '' : `.${prefix}`}.ts`;
                const originName = getFileName(file);
                const destinationPath = path.resolve(process.cwd(), this.outputDir, destination, destinationName);
                const imports = this.getImports(file);

                annotatedFiles.push({
                    originName,
                    destinationName,
                    filePath: file,
                    content,
                    annotations,
                    finalPath: destinationPath,
                    imports,
                    finalImports: [''],
                    prefix
                });
            }
        }

        this.annotatedFiles = annotatedFiles;

        for (const annotatedFile of annotatedFiles) {
            const finalImports = this.getFinalImports(annotatedFile.imports, annotatedFile.finalPath);
            annotatedFile.finalImports = finalImports;
        }

        return annotatedFiles;
    }

    private getAnnotations(content: string): string[] {
        return this.extractAnnotations(content);
    }

    private getDestination(content: string): string {
        const annotations = this.extractAnnotations(content);
        if (annotations.length > 0) {
            return annotationMap[annotations[0]].location;
        }
        return '';
    }

    private extractAnnotations(content: string): string[] {
        const annotations: string[] = [];
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') continue; // Ignora linhas vazias
            if (trimmedLine.startsWith("'") && trimmedLine.endsWith("'")) {
                const annotation = trimmedLine.slice(1, -1);
                if (annotationMap[annotation]) {
                    annotations.push(annotation);
                }
            } else {
                break; // Para de procurar ao encontrar a primeira linha que não é um annotation
            }
        }
        return annotations;
    }

    private getUnannotatedFiles(): IFile[] {
        const files = getFiles(this.rootDir);
        const unannotatedFiles: IFile[] = [];

        for (const file of files) {
            if (!this.annotatedFiles.some(annotatedFile => annotatedFile.filePath === file)) {
                unannotatedFiles.push({
                    originName: getFileName(file),
                    filePath: file,
                    content: readFile(file)
                });
            }
        }

        return unannotatedFiles;
    }

    private getImports(filePath: string): string[] {
        const sourceFile = getSourceFile(filePath);
        const imports: string[] = [];

        sourceFile.statements.forEach(statement => {
            if (statement.kind === ts.SyntaxKind.ImportDeclaration) {
                imports.push(statement.getText());
            }
        });

        return imports;
    }

    private getFinalImports(imports: string[], currentFilePath: string): string[] {
        const finalImports: string[] = [];

        for (const importLine of imports) {
            const importPathMatch = importLine.match(/from\s+['"](.+?)['"]/);
            if (importPathMatch) {
                const importPath = importPathMatch[1];
                const resolvedPath = path.resolve(this.rootDir, importPath);

                if (this.isValidImport(resolvedPath)) {
                    const annotatedFile = this.annotatedFiles.find(file => file.filePath === resolvedPath + ".ts");
                    if (annotatedFile) {
                        let newImportPath = path.relative(path.dirname(currentFilePath), annotatedFile.finalPath);
                        newImportPath = newImportPath.replace(/\\/g, '/'); // Corrige barras invertidas
                        newImportPath = newImportPath.replace(/\.ts$/, ''); // Remove ".ts" do final
                        if (!newImportPath.startsWith('..')) {
                            newImportPath = './' + newImportPath; // Adiciona "./" se não começar com ".."
                        }
                        const newImportLine = importLine.replace(importPath, newImportPath);
                        finalImports.push(newImportLine);
                    } else {
                        finalImports.push(importLine);
                    }
                }
            }
        }

        return finalImports;
    }

    private isValidImport(importPath: string): boolean {
        // Verifica se o caminho do import é válido
        try {
            require.resolve(importPath);
            return true;
        } catch (e) {
            return false;
        }
    }

    // ... código existente ...
}
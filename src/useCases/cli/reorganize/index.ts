import path from 'path';
import ts from 'typescript';
import {
    annotationMap,
    getFileMap,
    getImportMap,
    setFileMap,
    setImportMap
} from "@cli/constants/maps";
import {
    copyFile,
    createDirectory,
    directoryExists,
    getFiles,
    getModifiedImports,
    getRelativePaths,
    getSourceFile,
    isFile,
    readFile,
    writeFile
} from '@utils/cli';

export default class Reorganize {
    constructor(private rootDir: string, private outputDir: string) { }

    public async perform() {
        await new Promise(resolve => {
            const files = getFiles(this.rootDir);
            files.forEach(file => this.processFile(file));
            files.forEach(file => this.processFile(file, true));
            this.copyFiles();
            this.updateImports();

            resolve(true);
        })
    }

    private processFile(filePath: string, extractImports: boolean = false) {
        if (!isFile(filePath)) return;

        const sourceFile = getSourceFile(filePath);
        const newFilePath = this.determineNewFilePath(sourceFile, filePath);

        if (newFilePath) {
            if (extractImports) {
                this.extractImports(sourceFile, filePath);
            }
            else {
                setFileMap(filePath, newFilePath)
            }
        }
    }

    private determineNewFilePath(sourceFile: ts.SourceFile, filePath: string): string | null {
        const annotations = this.extractAnnotations(sourceFile);

        if (annotations.length > 0) {
            const annotation = annotations[0];
            const directory = annotationMap[annotation];

            if (directory) {
                const newPath = path.join(this.outputDir, directory, path.basename(filePath));
                return newPath;
            }
        }

        return null;
    }

    private extractAnnotations(sourceFile: ts.SourceFile): string[] {
        const annotations: string[] = [];
        sourceFile.statements.forEach(statement => {
            if (ts.isExpressionStatement(statement)) {
                const expression = statement.expression;

                if (ts.isStringLiteral(expression)) {
                    annotations.push(expression.text);
                }
            }
        });

        return annotations;
    }

    private extractImports(sourceFile: ts.SourceFile, filePath: string): void {
        const imports: string[] = [];
        sourceFile.statements.forEach(statement => {
            if (ts.isImportDeclaration(statement)) {
                const moduleSpecifier = statement.moduleSpecifier;

                if (ts.isStringLiteral(moduleSpecifier)) {
                    const importPath = moduleSpecifier.text;
                    const resolvePath = path.resolve(path.dirname(filePath), importPath + '.ts');
                    const fileMap = getFileMap();
                    if (fileMap instanceof Map && fileMap.has(resolvePath)) {
                        imports.push(resolvePath);
                    }
                }
            }
        });

        if (imports.length > 0) {
            setImportMap(filePath, imports);
        }
    }

    private copyFiles(): void {
        const fileMap = getFileMap();
        if (!(fileMap instanceof Map)) return;

        fileMap.forEach((newFilePath, oldFilePath) => {
            const newDir = path.dirname(newFilePath);

            if (!directoryExists(newDir)) {
                createDirectory(newDir, true);
            }

            copyFile(oldFilePath, newFilePath);
        });
    }

    private updateImports(): void {
        const fileMap = getFileMap();
        const importMap = getImportMap();
        if (!(fileMap instanceof Map)) return;
        if (!(importMap instanceof Map)) return;

        fileMap.forEach((newFilePath, oldFilePath) => {
            let content = readFile(newFilePath);
            let newContent = content;
            let importModifieds: [string, string][] = [];

            importMap.get(oldFilePath)?.forEach(importPath => {
                const newImportPath = fileMap.get(importPath);

                if (newImportPath) {
                    const [formattedOldPath, formattedNewPath] = getRelativePaths(oldFilePath, newFilePath, importPath, newImportPath);

                    // WARNING: This is a very naive implementation. It will only replace the first occurrence of the import.
                    importModifieds = getModifiedImports(content, formattedOldPath, formattedNewPath);

                    if (newContent !== content) {
                        writeFile(newFilePath, newContent);
                    }
                }
            });

            importModifieds.forEach(([oldLine, newLine]) => {
                newContent = newContent.replace(oldLine, newLine);
            })

            if (newContent !== content) {
                writeFile(newFilePath, newContent);
            }
        });
    }
}
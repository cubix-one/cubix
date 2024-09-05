import ts from 'typescript';
import path from 'node:path';
import { CoreAnnotationsMap, type ICubixConfig } from '@/types/cubixConfig';
import FileManager, { FileManagerOptions } from '@/core/fileManagement';
import { updateImports } from './updateImports';

export interface IFile {
  name: string;
  path: string;
  content: string;
}

export interface IImport {
  filePath: string;
  line: string;
}

export interface IAnnotatedFile extends IFile {
  newName: string;
  annotations: string[];
  imports: IImport[];
  newImports: string[];
  newPath: string;
  prefix: 'client' | 'server' | 'shared' | 'module';
}

export interface IDataFiles {
  annotatedFiles: IAnnotatedFile[];
  files: IFile[];
}

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export async function getDataFiles(cubixConfig: ICubixConfig): Promise<IDataFiles> {
  let annotatedFiles = await getAnnotatedFiles(cubixConfig);
  annotatedFiles = await updateImports(cubixConfig.rootDir, annotatedFiles);

  const files = await getFiles(cubixConfig, annotatedFiles);

  return {
    annotatedFiles,
    files,
  };
}

async function getAnnotatedFiles(cubixConfig: ICubixConfig): Promise<IAnnotatedFile[]> {
  const files = await fs.readFiles(cubixConfig.rootDir);
  const annotatedFiles: IAnnotatedFile[] = [];

  if (files.length === 0) return [];

  for (const file of files) {
    const content = (await fs.readFile(file)) as string;
    const annotations = extractAnnotations(content);

    if (annotations.length > 0) {
      const name = await fs.fileName(file);
      const newName = getNewName(name.replace('.ts', ''), annotations);
      const imports = await getImports(file);
      const newPath = path.resolve(process.cwd(), cubixConfig.outDir, getNewPath(content), newName);

      annotatedFiles.push({
        name,
        path: file,
        content,
        newName,
        annotations,
        imports,
        newImports: [],
        newPath,
        prefix: CoreAnnotationsMap[annotations[0] as keyof typeof CoreAnnotationsMap].prefix,
      });
    }
  }

  return annotatedFiles;
}

function extractAnnotations(content: string): string[] {
  const lines = content.split('\n');
  const annotations: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith("'") || !trimmedLine.endsWith("'")) break;

    const annotation = trimmedLine.slice(1, -1);
    if (Object.keys(CoreAnnotationsMap).includes(annotation)) {
      annotations.push(annotation);
    }
  }

  return annotations;
}

function getNewName(name: string, annotations: string[]): string {
  if (annotations.length === 0) return '';
  let newName = '';

  if (Object.keys(CoreAnnotationsMap).includes(annotations[0])) {
    const prefix = CoreAnnotationsMap[annotations[0] as keyof typeof CoreAnnotationsMap].prefix;
    newName = `${name}${prefix === 'module' ? '' : `.${prefix}`}.ts`;
  }

  return newName;
}

async function getImports(filePath: string): Promise<IImport[]> {
  const sourceFile = await fs.getSourceFile(filePath);
  const imports: IImport[] = [];

  for (const statement of sourceFile.statements) {
    if (statement.kind === ts.SyntaxKind.ImportDeclaration) {
      const importText = statement.getText();
      const match = importText.match(/from\s+['"](.+?)['"]/);
      if (match) {
        const relativePath = match[1];
        const line = path.resolve(path.dirname(filePath), relativePath);

        // Adiciona a extensão .ts se não estiver presente
        const fullPath = line.endsWith('.ts') ? line : `${line}.ts`;
        imports.push({ filePath: fullPath, line: importText });
      }
    }
  }

  return imports;
}

function getNewPath(content: string): string {
  const annotation = extractAnnotations(content);
  if (annotation.length > 0) {
    return CoreAnnotationsMap[annotation[0] as keyof typeof CoreAnnotationsMap].location;
  }

  return '';
}

async function getFiles(cubixConfig: ICubixConfig, annotatedFiles: IAnnotatedFile[]): Promise<IFile[]> {
  const allFiles = await fs.readFiles(cubixConfig.rootDir);
  const annotatedPaths = new Set(annotatedFiles.map((file) => file.path));

  return Promise.all(
    allFiles
      .filter((file) => !annotatedPaths.has(file))
      .map(async (file) => ({
        name: await fs.fileName(file),
        path: file,
        content: (await fs.readFile(file)) as string,
      })),
  ) as Promise<IFile[]>;
}

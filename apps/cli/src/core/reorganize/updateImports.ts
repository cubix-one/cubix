import path from 'node:path';
import type { IAnnotatedFile } from './dataFiles';
import FileManager, { FileManagerOptions } from '@core/fileManagement';

const fs = FileManager(FileManagerOptions.LOCAL);

export async function updateImports(rootDir: string, annotatedFiles: IAnnotatedFile[]) {
  const files = annotatedFiles.map((annotatedFile) => {
    const { imports, newPath, path } = annotatedFile;
    const newImports = updateImportsFields(imports, newPath, rootDir, annotatedFiles);
    const newContent = updateImportLineOnContent(imports, newImports, path);

    return { ...annotatedFile, newImports, content: newContent };
  });

  return files;
}

function updateImportsFields(oldImports: string[], newPath: string, rootDir: string, annotatedFiles: IAnnotatedFile[]): string[] {
  const importRegex = /from\s+['"](.+?)['"]/;

  return oldImports.map((importLine) => {
    const importPathMatch = importLine.match(importRegex);
    if (!importPathMatch) return importLine;

    const importPath = importPathMatch[1];
    const resolvedPath = path.resolve(rootDir, importPath);

    if (!isValidImportPath(resolvedPath)) return importLine;

    const annotatedFile = annotatedFiles.find((file) => file.path === `${resolvedPath}.ts`);

    if (!annotatedFile) return importLine;

    const newImportPath = getNewImportPath(newPath, annotatedFile.newPath);
    return importLine.replace(importPath, newImportPath);
  });
}

function getNewImportPath(currentPath: string, targetPath: string): string {
  let newImportPath = path.relative(path.dirname(currentPath), targetPath);
  newImportPath = newImportPath.replace(/\\/g, '/').replace(/\.ts$/, '');
  return newImportPath.startsWith('..') ? newImportPath : `./${newImportPath}`;
}

function isValidImportPath(importPath: string): boolean {
  try {
    require.resolve(importPath);
    return true;
  } catch (error) {
    return false;
  }
}

function updateImportLineOnContent(oldImports: string[], newImports: string[], filePath: string): string {
  const sourceFile = fs.getSourceFile(filePath);
  let updatedContent = sourceFile.getText();

  oldImports.forEach((oldImport, index) => {
    const oldImportPath = extractImportPath(oldImport);
    const newImport = newImports[index];
    const newImportPath = extractImportPath(newImport);

    if (oldImportPath && newImportPath) {
      const regex = new RegExp(`from\\s+['"]${oldImportPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
      updatedContent = updatedContent.replace(regex, `from '${newImportPath}'`);
    }
  });

  return updatedContent;
}

function extractImportPath(importStatement: string): string | null {
  const match = importStatement.match(/from\s+['"](.+?)['"]/);
  return match ? match[1] : null;
}

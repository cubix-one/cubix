import path from 'node:path';
import type { IAnnotatedFile, IImport } from './dataFiles';
import FileManager, { FileManagerOptions } from '@core/fileManagement';

const fs = FileManager(FileManagerOptions.LOCAL);

export async function updateImports(rootDir: string, annotatedFiles: IAnnotatedFile[]) {
  const files = annotatedFiles.map((annotatedFile) => {
    const newImports = updatedImportsFields(annotatedFile, annotatedFiles);
    const newContent = updateImportLineOnContent(annotatedFile.imports, newImports, annotatedFile.path);

    return { ...annotatedFile, newImports, content: newContent };
  });

  return files;
}

function updatedImportsFields(currentAnnotatedFile: IAnnotatedFile, allAnnotatedFiles: IAnnotatedFile[]): string[] {
  const importRegex = /from\s+['"](.+?)['"]/;

  return currentAnnotatedFile.imports.map((importTo: IImport) => {
    const importPathMatch = importTo.line.match(importRegex);
    if (!importPathMatch) return importTo.line;

    const internalImportPath = importPathMatch[1];
    const fileImportedNewPath = allAnnotatedFiles.find((file) => file.path === importTo.filePath)?.newPath as string;

    // Calcular o caminho relativo corretamente
    const currentDir = path.dirname(currentAnnotatedFile.newPath);
    const targetDir = path.dirname(fileImportedNewPath);
    const resolvedPath = path.relative(currentDir, targetDir);

    // Ajustar o caminho relativo
    let newImportPath = path.join(resolvedPath, path.basename(fileImportedNewPath, '.ts'));
    newImportPath = newImportPath.replace(/\\/g, '/');
    newImportPath = newImportPath.startsWith('.') ? newImportPath : `./${newImportPath}`;

    return importTo.line.replace(internalImportPath, newImportPath);
  });
}

function updateImportLineOnContent(oldImports: IImport[], newImports: string[], filePath: string): string {
  const sourceFile = fs.getSourceFile(filePath);
  let updatedContent = sourceFile.getText();

  oldImports.forEach((oldImport, index) => {
    const oldImportPath = extractImportPath(oldImport.line);
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

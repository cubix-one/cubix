import ts from 'typescript';
import path from 'path';
import { readFile } from './fileSystem';

export const getSourceFile = (filePath: string, encoding: BufferEncoding = 'utf8'): ts.SourceFile => {
    const sourceCode = readFile(filePath, encoding);
    return ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.ES2020, true);
}

export const getRelativePaths = (oldFilePath: string, newFilePath: string, importPath: string, newImportPath: string): [string, string] => {
    const relativeOldPath = path.relative(path.dirname(oldFilePath), importPath).replace(".ts", "");
    const relativeNewPath = path.relative(path.dirname(newFilePath), newImportPath).replace(".ts", "");

    const formattedOldPath = relativeOldPath.startsWith('.') ? `${relativeOldPath}` : `./${relativeOldPath}`;
    const formattedNewPath = relativeNewPath.startsWith('.') ? `${relativeNewPath}` : `./${relativeNewPath}`;

    return [formattedOldPath, formattedNewPath];
}

export const getModifiedImports = (content: string, formattedOldPath: string, formattedNewPath: string): [string, string][] => {
    const importModifieds: [string, string][] = [];

    content.split('\n').map(line => {
        if (line.trim().startsWith('import ')) {
            const importPath = line.match(/from\s+['"]([^'"]+)['"]/)?.[1];
            if (importPath && importPath === formattedOldPath) {
                importModifieds.push([line, line.replace(formattedOldPath, formattedNewPath)]);
            }
        }
    });

    return importModifieds;
}
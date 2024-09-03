import * as ts from 'typescript';
import { readFile as readFileAsync } from '../fs/fileSystemAsync';
import { readFile } from '../fs/fileSystem';

export async function getSourceFileAsync(filePath: string, encoding: BufferEncoding = 'utf8', scriptTarget: ts.ScriptTarget = ts.ScriptTarget.ES2020): Promise<ts.SourceFile> {
  const sourceCode = (await readFileAsync(filePath, encoding)) as string;
  return ts.createSourceFile(filePath, sourceCode, scriptTarget, true);
}

export function getSourceFile(filePath: string, encoding: BufferEncoding = 'utf8', scriptTarget: ts.ScriptTarget = ts.ScriptTarget.ES2020): ts.SourceFile {
  const sourceCode = readFile(filePath, encoding) as string;
  return ts.createSourceFile(filePath, sourceCode, scriptTarget, true);
}

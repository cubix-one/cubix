import type ts from 'typescript';

export interface FileSystemStrategyAsync {
  readFilesByExtension(contentPath: string, extension?: string): Promise<string[]>;
  readFiles(contentPath: string | null): Promise<string[]>;
  readFile(filePath: string, encoding?: BufferEncoding): Promise<string | null>;
  isFile(filePath: string): Promise<boolean>;
  writeFile(filePath: string, content: string, encoding?: BufferEncoding): Promise<boolean>;
  fileExists(path: string): Promise<boolean>;
  fileName(filePath: string): Promise<string>;
  copyFile(source: string, destination: string): Promise<boolean>;
  deleteFile(filePath: string): Promise<boolean>;
  isDirectory(filePath: string): Promise<boolean>;
  isSymbolicLink(filePath: string): Promise<boolean>;
  directoryExists(path: string): Promise<boolean>;
  createDirectory(path: string, recursive?: boolean): Promise<boolean>;
  deleteDirectory(path: string): Promise<boolean>;
  getPathDiffLevel(hightLevelPath: string, lowLevelPath: string): Promise<string>;
  getSourceFile(filePath: string, encoding?: BufferEncoding, scriptTarget?: ts.ScriptTarget): Promise<ts.SourceFile>;
}

export interface FileSystemStrategy {
  readFilesByExtension(contentPath: string, extension?: string): string[];
  readFiles(contentPath: string | null): string[];
  readFile(filePath: string, encoding?: BufferEncoding): string | null;
  isFile(filePath: string): boolean;
  writeFile(filePath: string, content: string, encoding?: BufferEncoding): boolean;
  fileExists(path: string): boolean;
  fileName(filePath: string): string;
  copyFile(source: string, destination: string): boolean;
  deleteFile(filePath: string): boolean;
  isDirectory(filePath: string): boolean;
  isSymbolicLink(filePath: string): boolean;
  directoryExists(path: string): boolean;
  createDirectory(path: string, recursive?: boolean): boolean;
  deleteDirectory(path: string): boolean;
  getPathDiffLevel(hightLevelPath: string, lowLevelPath: string): string;
  getSourceFile(filePath: string, encoding?: BufferEncoding, scriptTarget?: ts.ScriptTarget): ts.SourceFile;
}

export enum FileManagerOptions {
  LOCAL = 'local',
  LOCAL_ASYNC = 'local-async',
  MEMORY = 'memory',
  MEMORY_ASYNC = 'memory-async',
}

export type FileManagerReturnType = {
  [FileManagerOptions.LOCAL]: FileSystemStrategy;
  [FileManagerOptions.LOCAL_ASYNC]: FileSystemStrategyAsync;
  [FileManagerOptions.MEMORY]: FileSystemStrategy;
  [FileManagerOptions.MEMORY_ASYNC]: FileSystemStrategyAsync;
};

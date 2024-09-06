import ts from 'typescript';
import { RealFileSystemStrategyAsync } from '../strategies/RealFileSystemStrategyAsync';
import { FileManagerOptions, type FileSystemStrategyAsync } from '../types';

export default class FileManagerAsync {
  private fileSystem: FileSystemStrategyAsync;

  constructor(options: FileManagerOptions, debug = false) {
    if (options === FileManagerOptions.LOCAL) {
      this.fileSystem = new RealFileSystemStrategyAsync(debug);
    } else {
      this.fileSystem = new RealFileSystemStrategyAsync(debug);
    }
  }

  public async readFilesByExtension(contentPath: string, extension = 'ts'): Promise<string[]> {
    return this.fileSystem.readFilesByExtension(contentPath, extension);
  }

  public async readFiles(contentPath: string): Promise<string[]> {
    return this.fileSystem.readFiles(contentPath);
  }

  public async readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): Promise<string | null> {
    return this.fileSystem.readFile(filePath, encoding);
  }

  public async isFile(filePath: string): Promise<boolean> {
    return this.fileSystem.isFile(filePath);
  }

  public async writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf-8'): Promise<boolean> {
    return this.fileSystem.writeFile(filePath, content, encoding);
  }

  public async fileExists(filePath: string): Promise<boolean> {
    return this.fileSystem.fileExists(filePath);
  }

  public async fileName(filePath: string): Promise<string> {
    return this.fileSystem.fileName(filePath);
  }

  public async copyFile(source: string, destination: string): Promise<boolean> {
    return this.fileSystem.copyFile(source, destination);
  }

  public async deleteFile(filePath: string): Promise<boolean> {
    return this.fileSystem.deleteFile(filePath);
  }

  public async isDirectory(filePath: string): Promise<boolean> {
    return this.fileSystem.isDirectory(filePath);
  }

  public async isSymbolicLink(filePath: string): Promise<boolean> {
    return this.fileSystem.isSymbolicLink(filePath);
  }

  public async directoryExists(dirPath: string): Promise<boolean> {
    return this.fileSystem.directoryExists(dirPath);
  }

  public async createDirectory(dirPath: string, recursive?: boolean): Promise<boolean> {
    return this.fileSystem.createDirectory(dirPath, recursive);
  }

  public async deleteDirectory(dirPath: string): Promise<boolean> {
    return this.fileSystem.deleteDirectory(dirPath);
  }

  public async getPathDiffLevel(hightLevelPath: string, lowLevelPath: string): Promise<string> {
    return this.fileSystem.getPathDiffLevel(hightLevelPath, lowLevelPath);
  }

  public async getSourceFile(filePath: string, encoding: BufferEncoding = 'utf-8', scriptTarget: ts.ScriptTarget = ts.ScriptTarget.ES2020): Promise<ts.SourceFile> {
    return this.fileSystem.getSourceFile(filePath, encoding, scriptTarget);
  }
}

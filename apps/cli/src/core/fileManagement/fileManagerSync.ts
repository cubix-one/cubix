import type { FileSystemStrategy } from '../../types/strategies';
import { RealFileSystemStrategy } from '@/strategies/RealFileSystemStrategy';
import { FileManagerOptions } from './index';

export default class FileManagerSync {
  private fileSystem: FileSystemStrategy;

  constructor(options: FileManagerOptions) {
    switch (options) {
      case FileManagerOptions.LOCAL:
        this.fileSystem = new RealFileSystemStrategy();
        break;
      case FileManagerOptions.MEMORY:
        this.fileSystem = new RealFileSystemStrategy();
        break;
      default:
        this.fileSystem = new RealFileSystemStrategy();
        break;
    }
  }

  public readFilesByExtension(contentPath: string, extension = 'ts'): string[] {
    return this.fileSystem.readFilesByExtension(contentPath, extension);
  }

  public readFiles(contentPath: string): string[] {
    return this.fileSystem.readFiles(contentPath);
  }

  public readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): string | null {
    return this.fileSystem.readFile(filePath, encoding);
  }

  public isFile(filePath: string): boolean {
    return this.fileSystem.isFile(filePath);
  }

  public writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf-8'): boolean {
    return this.fileSystem.writeFile(filePath, content, encoding);
  }

  public fileExists(filePath: string): boolean {
    return this.fileSystem.fileExists(filePath);
  }

  public fileName(filePath: string): string {
    return this.fileSystem.fileName(filePath);
  }

  public copyFile(source: string, destination: string): boolean {
    return this.fileSystem.copyFile(source, destination);
  }

  public deleteFile(filePath: string): boolean {
    return this.fileSystem.deleteFile(filePath);
  }

  public isDirectory(filePath: string): boolean {
    return this.fileSystem.isDirectory(filePath);
  }

  public isSymbolicLink(filePath: string): boolean {
    return this.fileSystem.isSymbolicLink(filePath);
  }

  public directoryExists(dirPath: string): boolean {
    return this.fileSystem.directoryExists(dirPath);
  }

  public createDirectory(dirPath: string, recursive?: boolean): boolean {
    return this.fileSystem.createDirectory(dirPath, recursive);
  }

  public deleteDirectory(dirPath: string): boolean {
    return this.fileSystem.deleteDirectory(dirPath);
  }
}

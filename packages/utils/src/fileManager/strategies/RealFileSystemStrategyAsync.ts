import path from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import ts from 'typescript';

import type { FileSystemStrategyAsync } from '../types';

export class RealFileSystemStrategyAsync implements FileSystemStrategyAsync {
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  async readFilesByExtension(contentPath: string, extension = 'ts'): Promise<string[]> {
    try {
      const files = await glob(`${contentPath}/**/*.${extension}`);
      return files.map((file) => path.resolve(file));
    } catch {
      return [];
    }
  }

  async readFiles(contentPath: string): Promise<string[]> {
    try {
      const files = await glob(`${contentPath}/**/*`, {
        dot: true,
        nodir: true,
        ignore: ['**/node_modules/**', '**/.git/**', '**/.vscode/**'],
      });
      return files.map((file) => path.resolve(file));
    } catch {
      return [];
    }
  }

  async readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | null> {
    return fs.readFile(filePath, encoding).catch(() => null);
  }

  async isFile(filePath: string): Promise<boolean> {
    const stats = await fs.stat(filePath).catch(() => null);
    return stats?.isFile() ?? false;
  }

  async writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
    return fs
      .writeFile(filePath, content, encoding)
      .then(() => true)
      .catch(() => false);
  }

  async deleteFile(filePath: string): Promise<boolean> {
    return fs
      .remove(filePath)
      .then(() => true)
      .catch(() => false);
  }

  async fileExists(filePath: string): Promise<boolean> {
    const resolvedPath = path.resolve(filePath);
    return await fs.pathExists(resolvedPath);
  }

  async fileName(filePath: string): Promise<string> {
    return path.basename(filePath);
  }

  async copyFile(source: string, destination: string): Promise<boolean> {
    return fs
      .copy(source, destination)
      .then(() => true)
      .catch(() => false);
  }

  async isDirectory(dirPath: string): Promise<boolean> {
    const stats = await fs.stat(dirPath).catch(() => null);
    return stats?.isDirectory() ?? false;
  }

  async isSymbolicLink(filePath: string): Promise<boolean> {
    const stats = await fs.lstat(filePath).catch(() => null);
    return stats?.isSymbolicLink() ?? false;
  }

  async directoryExists(dirPath: string): Promise<boolean> {
    const resolvedPath = path.resolve(dirPath);
    return await fs.pathExists(resolvedPath);
  }

  async createDirectory(contentPath: string, recursive = false): Promise<boolean> {
    const resolvedPath = path.resolve(contentPath);
    return fs
      .mkdir(resolvedPath, { recursive })
      .then(() => true)
      .catch(() => false);
  }

  async deleteDirectory(dirPath: string): Promise<boolean> {
    const resolvedPath = path.resolve(dirPath);
    return fs
      .remove(resolvedPath)
      .then(() => true)
      .catch(() => false);
  }

  async getPathDiffLevel(hightLevelPath: string, lowLevelPath: string): Promise<string> {
    const hightLevel = await Promise.resolve(path.resolve(hightLevelPath));
    const lowLevel = await Promise.resolve(path.resolve(lowLevelPath));
    const relativePath = await Promise.resolve(path.relative(hightLevel, lowLevel));
    return Promise.resolve(relativePath);
  }

  async getSourceFile(filePath: string, encoding: BufferEncoding, scriptTarget: ts.ScriptTarget): Promise<ts.SourceFile> {
    const sourceCode = (await this.readFile(filePath, encoding)) as string;
    return ts.createSourceFile(filePath, sourceCode, scriptTarget, true);
  }
}

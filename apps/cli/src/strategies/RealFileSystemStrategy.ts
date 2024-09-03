import ts from 'typescript';
import fs from 'fs-extra';
import path from 'node:path';
import { globSync } from 'glob';

import type { FileSystemStrategy } from '@/types/strategies';

export class RealFileSystemStrategy implements FileSystemStrategy {
  readFilesByExtension(contentPath: string, extension = 'ts'): string[] {
    try {
      const files = globSync(`${contentPath}/**/*.${extension}`);
      return files.map((file) => path.resolve(file));
    } catch {
      return [];
    }
  }

  readFiles(contentPath: string): string[] {
    try {
      const files = globSync(`${contentPath}/**/*`, {
        dot: true,
        nodir: true,
        ignore: ['**/node_modules/**', '**/.git/**', '**/.vscode/**'],
      });
      return files.map((file) => path.resolve(file));
    } catch {
      return [];
    }
  }

  readFile(filePath: string, encoding: BufferEncoding = 'utf8'): string | null {
    try {
      return fs.readFileSync(filePath, encoding);
    } catch {
      return null;
    }
  }

  isFile(filePath: string): boolean {
    try {
      const stats = fs.statSync(filePath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): boolean {
    try {
      fs.writeFileSync(filePath, content, encoding);
      return true;
    } catch {
      return false;
    }
  }

  deleteFile(filePath: string): boolean {
    try {
      fs.removeSync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  fileExists(filePath: string): boolean {
    const resolvedPath = path.resolve(filePath);
    return fs.pathExistsSync(resolvedPath);
  }

  fileName(filePath: string): string {
    return path.basename(filePath);
  }

  copyFile(source: string, destination: string): boolean {
    try {
      fs.copySync(source, destination);
      return true;
    } catch {
      return false;
    }
  }

  isDirectory(dirPath: string): boolean {
    try {
      const stats = fs.statSync(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  isSymbolicLink(filePath: string): boolean {
    try {
      const stats = fs.lstatSync(filePath);
      return stats.isSymbolicLink();
    } catch {
      return false;
    }
  }

  directoryExists(dirPath: string): boolean {
    const resolvedPath = path.resolve(dirPath);
    return fs.pathExistsSync(resolvedPath);
  }

  createDirectory(contentPath: string, recursive = false): boolean {
    const resolvedPath = path.resolve(contentPath);
    try {
      fs.mkdirSync(resolvedPath, { recursive });
      return true;
    } catch {
      return false;
    }
  }

  deleteDirectory(dirPath: string): boolean {
    const resolvedPath = path.resolve(dirPath);
    try {
      fs.removeSync(resolvedPath);
      return true;
    } catch {
      return false;
    }
  }

  getPathDiffLevel(hightLevelPath: string, lowLevelPath: string): string {
    const hightLevel = path.resolve(hightLevelPath);
    const lowLevel = path.resolve(lowLevelPath);
    const relativePath = path.relative(hightLevel, lowLevel);
    return relativePath;
  }

  getSourceFile(filePath: string, encoding: BufferEncoding, scriptTarget: ts.ScriptTarget): ts.SourceFile {
    const sourceCode = this.readFile(filePath, encoding) as string;
    return ts.createSourceFile(filePath, sourceCode, scriptTarget, true);
  }
}

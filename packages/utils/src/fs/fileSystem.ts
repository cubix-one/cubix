import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

// Funções relacionadas a diretórios e caminhos
export function isDirectory(dirPath: string): boolean {
  try {
    return fs.lstatSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

export function directoryExists(dirPath: string): boolean {
  const resolvedPath = path.resolve(dirPath);
  return fs.existsSync(resolvedPath);
}

export function createDirectory(dirPath: string, recursive = false): boolean {
  try {
    const resolvedPath = path.resolve(dirPath);
    fs.mkdirSync(resolvedPath, { recursive });
    return true;
  } catch {
    return false;
  }
}

export function deleteDirectory(dirPath: string, recursive = true): boolean {
  try {
    const resolvedPath = path.resolve(dirPath);
    fs.rmdirSync(resolvedPath, { recursive });
    return true;
  } catch {
    return false;
  }
}

export function getFilesByExtension(dirPath: string, extension = 'ts'): string[] {
  try {
    return globSync(`${dirPath}/**/*.${extension}`).map((file) => path.resolve(file));
  } catch {
    return [];
  }
}

// Funções relacionadas a arquivos
export function isFile(filePath: string): boolean {
  try {
    return fs.lstatSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function isSymbolicLink(filePath: string): boolean {
  try {
    return fs.lstatSync(filePath).isSymbolicLink();
  } catch {
    return false;
  }
}

export function fileExists(filePath: string): boolean {
  const resolvedPath = path.resolve(filePath);
  return fs.existsSync(resolvedPath);
}

export function readFile(filePath: string, encoding: BufferEncoding = 'utf8'): string | null {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch {
    return null;
  }
}

export function writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): boolean {
  try {
    fs.writeFileSync(filePath, content, encoding);
    return true;
  } catch {
    return false;
  }
}

export function createFile(filePath: string, content: string): boolean {
  try {
    fs.writeFileSync(filePath, content);
    return true;
  } catch {
    return false;
  }
}

export function copyFile(oldFilePath: string, newFilePath: string): boolean {
  try {
    fs.copyFileSync(oldFilePath, newFilePath);
    return true;
  } catch {
    return false;
  }
}

export function deleteFile(filePath: string): boolean {
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getAllFilesInDirectory(rootDir: string): string[] {
  try {
    return globSync(`${rootDir}/**/*`, {
      dot: true,
      nodir: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/.vscode/**'],
    }).map((file) => path.resolve(file));
  } catch {
    return [];
  }
}

export function getFileName(filePath: string): string {
  return path.basename(filePath);
}

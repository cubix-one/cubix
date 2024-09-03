import fs from 'fs-extra';
import path from 'node:path';
import { glob } from 'glob';

// Funções relacionadas a diretórios e caminhos
export async function isDirectory(filePath: string): Promise<boolean> {
  const stats = await fs.stat(filePath).catch(() => null);
  return stats?.isDirectory() ?? false;
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  const resolvedPath = path.resolve(dirPath);
  return fs.pathExists(resolvedPath);
}

export async function createDirectory(filePath: string, recursive = false): Promise<boolean> {
  const resolvedPath = path.resolve(filePath);
  return fs
    .mkdir(resolvedPath, { recursive })
    .then(() => true)
    .catch(() => false);
}

export async function deleteDirectory(directoryPath: string, recursive = true): Promise<boolean> {
  const resolvedPath = path.resolve(directoryPath);
  return fs
    .remove(resolvedPath)
    .then(() => true)
    .catch(() => false);
}

export async function getFilesByExtension(rootDir: string, extension = 'ts'): Promise<string[]> {
  try {
    const files = await glob(`${rootDir}/**/*.${extension}`);
    return files.map((file) => path.resolve(file));
  } catch {
    return [];
  }
}

// Funções relacionadas a arquivos
export async function isFile(filePath: string): Promise<boolean> {
  const stats = await fs.stat(filePath).catch(() => null);
  return stats?.isFile() ?? false;
}

export async function isSymbolicLink(filePath: string): Promise<boolean> {
  const stats = await fs.lstat(filePath).catch(() => null);
  return stats?.isSymbolicLink() ?? false;
}

export async function fileExists(filePath: string): Promise<boolean> {
  const resolvedPath = path.resolve(filePath);
  return fs.pathExists(resolvedPath);
}

export async function readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string | null> {
  return fs.readFile(filePath, encoding).catch(() => null);
}

export async function writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): Promise<boolean> {
  return fs
    .writeFile(filePath, content, encoding)
    .then(() => true)
    .catch(() => false);
}

export async function createFile(filePath: string, content: string): Promise<boolean> {
  return fs
    .writeFile(filePath, content)
    .then(() => true)
    .catch(() => false);
}

export async function copyFile(oldFilePath: string, newFilePath: string): Promise<boolean> {
  return fs
    .copy(oldFilePath, newFilePath)
    .then(() => true)
    .catch(() => false);
}

export async function deleteFile(filePath: string): Promise<boolean> {
  return fs
    .remove(filePath)
    .then(() => true)
    .catch(() => false);
}

export async function getAllFiles(dirPath: string): Promise<string[]> {
  try {
    const files = await glob(`${dirPath}/**/*`, {
      dot: true,
      nodir: true,
      ignore: ['**/node_modules/**', '**/.git/**', '**/.vscode/**'],
    });
    return files.map((file) => path.resolve(file));
  } catch {
    return [];
  }
}

import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

export const getFiles = (rootDir: string, extension: string = 'ts'): string[] => {
    return globSync(`${rootDir}/**/*.${extension}`).map(file => path.resolve(file));
}

export const getAllFiles = (rootDir: string): string[] => {
    const normalFiles = globSync(`${rootDir}/**/*`, { dot: true, nodir: true });
    const hiddenFiles = globSync(`${rootDir}/**/.*`, { dot: true, nodir: true });

    return [...new Set([...normalFiles, ...hiddenFiles])]
        .filter(file => !path.basename(file).startsWith('.git/'));
}

export const getFileName = (filePath: string): string => {
    return path.basename(filePath);
}

export function readFile(filePath: string, encoding: BufferEncoding = 'utf8'): string {
    return fs.readFileSync(filePath, encoding);
}

export function writeFile(filePath: string, content: string, encoding: BufferEncoding = 'utf8'): void {
    fs.writeFileSync(filePath, content, encoding);
}

export function isFile(filePath: string): boolean {
    return fs.lstatSync(filePath).isFile();
}

export function isDirectory(filePath: string): boolean {
    return fs.lstatSync(filePath).isDirectory();
}

export function isSymbolicLink(filePath: string): boolean {
    return fs.lstatSync(filePath).isSymbolicLink();
}

export function directoryExists(filePath: string): boolean {
    const resolvedPath = path.resolve(filePath);
    return fs.existsSync(resolvedPath);
}

export function fileExists(filePath: string): boolean {
    const resolvedPath = path.resolve(filePath);
    return fs.existsSync(resolvedPath);
}

export function createDirectory(filePath: string, recursive: boolean = false): void {
    const resolvedPath = path.resolve(filePath);
    fs.mkdirSync(resolvedPath, { recursive });
}

export function createFile(filePath: string, content: string): void {
    fs.writeFileSync(filePath, content);
}

export function copyFile(oldFilePath: string, newFilePath: string): void {
    fs.copyFileSync(oldFilePath, newFilePath);
}

export function deleteFile(filePath: string): void {
    fs.unlinkSync(filePath);
}

export function deleteDirectory(filePath: string, recursive: boolean = true): void {
    const resolvedPath = path.resolve(filePath);
    fs.rmdirSync(resolvedPath, { recursive });
}
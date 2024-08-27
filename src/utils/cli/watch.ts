import crypto from 'crypto';
import { fileExists, readFile } from './fileSystem';
import path from 'path';

export interface IJsonConfig {
    compilerOptions: {
        rootDir: string;
        outDir: string;
    };
}

export function calculateFileHash(filePath: string): string {
    const fileContent = readFile(filePath);
    return crypto.createHash('md5').update(fileContent).digest('hex');
}

export function readJsonConfig(cubixConfigName: string, defaultConfigName: string): IJsonConfig {
    const cubixConfigPath = path.resolve(process.cwd(), cubixConfigName);
    if (!fileExists(cubixConfigPath)) {
        console.error('Cubix config file not found');
        process.exit(1);
    }

    const defaultConfigPath = path.resolve(process.cwd(), defaultConfigName);

    if (!fileExists(defaultConfigPath)) {
        console.error('Cubix config file not found');
        process.exit(1);
    }

    const cubixConfig: IJsonConfig = JSON.parse(readFile(cubixConfigPath));
    const defaultConfig: IJsonConfig = JSON.parse(readFile(defaultConfigPath));

    return {
        compilerOptions: {
            rootDir: cubixConfig.compilerOptions.rootDir,
            outDir: defaultConfig.compilerOptions.outDir.split('/')[0]
        }
    } as IJsonConfig;
}
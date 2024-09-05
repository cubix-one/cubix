import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

async function copyBin() {
  const sourceFile = join(__dirname, '..', 'bin', 'rojo.exe');
  const destFile = join(__dirname, '..', '..', '..', 'dist', 'apps', 'cli', 'rojo.exe');

  try {
    await copyFile(sourceFile, destFile);
    console.log('rojo.exe copied successfully.');
  } catch (error) {
    console.error('Error copying the rojo.exe file:', error);
    process.exit(1);
  }
}

copyBin();

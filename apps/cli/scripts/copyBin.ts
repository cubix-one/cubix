import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

async function copyBin() {
  const sourceFile = join(__dirname, '..', 'bin', 'rojo.exe');
  const destFile = join(__dirname, '..', '..', '..', 'dist', 'apps', 'cli', 'rojo.exe');

  try {
    await copyFile(sourceFile, destFile);
    console.log('Arquivo rojo.exe copiado com sucesso.');
  } catch (error) {
    console.error('Erro ao copiar o arquivo:', error);
    process.exit(1);
  }
}

copyBin();

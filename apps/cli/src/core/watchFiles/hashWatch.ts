import chokidar from 'chokidar';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import type { WatchFilesProps } from '@core/watchFiles';

interface FileHash {
  [filePath: string]: string;
}

export default function hashWatch(props: WatchFilesProps, callback: (event: string, filePath: string) => Promise<void>) {
  const { path: watchPath, extensions, exclude, events } = props;
  const fileHashes: FileHash = {};

  // Cria o padrão de exclusão
  const ignored = [/(^|[\/\\])\../, ...exclude.map((dir) => `**/${dir}/**`)];

  // Cria o padrão de extensões
  const extensionPattern = extensions.length > 0 ? `**/*.+(${extensions.map((ext) => `${ext}`).join('|')})` : '**/*';
  const watcher = chokidar.watch(extensionPattern, {
    cwd: watchPath,
    ignored,
    persistent: true,
  });

  // Função para calcular o hash do arquivo
  async function calculateHash(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, { encoding: 'utf-8' });
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // Função para verificar se o hash mudou
  async function hasHashChanged(filePath: string): Promise<boolean> {
    const fullPath = `${watchPath}/${filePath}`;
    const newHash = await calculateHash(fullPath);
    const oldHash = fileHashes[filePath];
    fileHashes[filePath] = newHash;
    return newHash !== oldHash;
  }

  // Determina quais eventos observar
  const eventsToWatch = events.length > 0 ? events : ['change'];

  for (const event of eventsToWatch) {
    watcher.on(event, async (filePath) => {
      if (await hasHashChanged(filePath)) {
        await callback(event, filePath);
      }
    });
  }

  // Tratamento de sinais para encerramento gracioso
  process.on('SIGINT', () => {
    console.log('Encerrando o watcher...');
    watcher.close().then(() => {
      console.log('Watcher encerrado. Saindo...');
      process.exit(0);
    });
  });

  return watcher;
}

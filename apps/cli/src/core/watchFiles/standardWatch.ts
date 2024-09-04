import chokidar from 'chokidar';
import * as p from '@clack/prompts';
import type { WatchFilesProps } from '@core/watchFiles';

export default function standardWatch(props: WatchFilesProps, callback: (event: string, filePath: string) => Promise<void>) {
  const { path: watchPath, extensions, exclude, events } = props;

  // Cria o padrão de exclusão
  const ignored = [
    /(^|[\/\\])\../, // ignora arquivos ocultos
    ...exclude.map((dir) => `**/${dir}/**`), // ignora as pastas especificadas em qualquer nível
  ];

  // Cria o padrão de extensões
  const extensionPattern = extensions.length > 0 ? `**/*.+(${extensions.map((ext) => `${ext}`).join('|')})` : '**/*';
  const watcher = chokidar.watch(extensionPattern, {
    cwd: watchPath,
    ignored,
    persistent: true,
  });

  // Determina quais eventos observar
  const eventsToWatch = events.length > 0 ? events : ['change'];

  for (const event of eventsToWatch) {
    watcher.on(event, async (filePath) => {
      await callback(event, filePath);
    });
  }

  process.on('SIGINT', () => {
    const spinner = p.spinner();
    spinner.start('Closing Watcher...');
    watcher.close().then(() => {
      spinner.stop('Watcher closed. Exit...');
      process.exit(0);
    });
  });

  return watcher;
}

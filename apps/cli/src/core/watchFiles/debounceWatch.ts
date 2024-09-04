import chokidar from 'chokidar';
import type { WatchFilesProps } from '@core/watchFiles';

export default function debounceWatch(props: WatchFilesProps, callback: (event: string, filePath: string) => Promise<void>) {
  const { path: watchPath, extensions, exclude, events, debounceTime } = props;

  // Cria o padrão de exclusão
  const ignored = [/(^|[\/\\])\../, ...exclude.map((dir) => `**/${dir}/**`)];

  // Cria o padrão de extensões
  const extensionPattern = extensions.length > 0 ? `**/*.+(${extensions.map((ext) => `${ext}`).join('|')})` : '**/*';
  const watcher = chokidar.watch(extensionPattern, {
    cwd: watchPath,
    ignored,
    persistent: true,
  });

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function (this: unknown, ...args: unknown[]) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait) as NodeJS.Timeout;
    };
  }

  // Cria uma versão debounced do callback
  const debouncedCallback = debounce(async (event: string, filePath: string) => {
    await callback(event, filePath);
  }, debounceTime);

  // Determina quais eventos observar
  const eventsToWatch = events.length > 0 ? events : ['change'];

  for (const event of eventsToWatch) {
    watcher.on(event, (filePath) => {
      debouncedCallback(event, filePath);
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

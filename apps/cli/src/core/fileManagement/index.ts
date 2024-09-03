import type { FileSystemStrategy, FileSystemStrategyAsync } from '@/types/strategies';
import FileManagerSync from './fileManagerSync';
import FileManagerAsync from './fileManagerAsync';

export enum FileManagerOptions {
  LOCAL = 'local',
  LOCAL_ASYNC = 'local-async',
  MEMORY = 'memory',
  MEMORY_ASYNC = 'memory-async',
}

type FileManagerReturnType = {
  [FileManagerOptions.LOCAL]: FileSystemStrategy;
  [FileManagerOptions.LOCAL_ASYNC]: FileSystemStrategyAsync;
  [FileManagerOptions.MEMORY]: FileSystemStrategy;
  [FileManagerOptions.MEMORY_ASYNC]: FileSystemStrategyAsync;
};

export default function FileManager<T extends FileManagerOptions>(options: T): FileManagerReturnType[T] {
  const managers = {
    [FileManagerOptions.LOCAL]: () => new FileManagerSync(FileManagerOptions.LOCAL),
    [FileManagerOptions.LOCAL_ASYNC]: () => new FileManagerAsync(FileManagerOptions.LOCAL_ASYNC),
    [FileManagerOptions.MEMORY]: () => {
      throw new Error('MEMORY option not implemented');
    },
    [FileManagerOptions.MEMORY_ASYNC]: () => {
      throw new Error('MEMORY_ASYNC option not implemented');
    },
  };

  const manager = managers[options] || managers[FileManagerOptions.LOCAL_ASYNC];
  return manager() as unknown as FileManagerReturnType[T];
}

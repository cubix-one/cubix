import FileManagerAsync from './implementations/fileManagerAsync';
import FileManagerSync from './implementations/fileManagerSync';
import { FileManagerOptions, type FileManagerReturnType } from './types';

export function FileManager<T extends FileManagerOptions>(options: T): FileManagerReturnType[T] {
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

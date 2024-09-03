import type { ICubixConfig } from '@/types/cubixConfig';
import { getDataFiles } from './dataFiles';
import FileManager, { FileManagerOptions } from '@/core/fileManagement';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export default async function Reorganize(cubixConfig: ICubixConfig) {
  const dataFiles = await getDataFiles(cubixConfig);

  for (const file of dataFiles.annotatedFiles) {
    await fs.writeFile(file.newPath, file.content);
  }
}

import path from 'node:path';
import { execa } from 'execa';
import { getCubixConfig } from './getCubixConfig';
import { buildRojoProjectConfig } from './buildRojoProjectConfig';
import { buildInternalTsConfig } from './buildInternalTsConfig';
import FileManager, { FileManagerOptions } from '@core/fileManagement';
import Reorganize from '@core/reorganize';
import { CoreAnnotationsMap } from '@/types/cubixConfig';
import * as p from '@clack/prompts';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export default async function BuildProject() {
  const cubixConfig = await getCubixConfig();
  const internalTsConfigObj = await buildInternalTsConfig(cubixConfig.outDir);
  const internalRojoConfigObj = await buildRojoProjectConfig(cubixConfig);

  const internalTsConfig = JSON.stringify(internalTsConfigObj, null, 2);
  const internalRojoConfig = JSON.stringify(internalRojoConfigObj, null, 2);

  const outDirPath = path.join(process.cwd(), cubixConfig.outDir);

  await deleteOutDir(outDirPath);
  await createOutDir(outDirPath);
  await writeInternalTsConfig(`${outDirPath}/tsconfig.json`, internalTsConfig);
  await writeInternalRojoConfig(`${outDirPath}/default.project.json`, internalRojoConfig);

  for (const annotation of Object.values(CoreAnnotationsMap)) {
    await fs.createDirectory(path.join(outDirPath, annotation.location), true);
  }

  await Reorganize(cubixConfig);
  await execa('rbxtsc', ['-p', cubixConfig.outDir], { cwd: process.cwd() });
}

const deleteOutDir = async (outDir: string) => await fs.deleteDirectory(outDir);
const createOutDir = async (outDir: string) => await fs.createDirectory(outDir);
const writeInternalTsConfig = async (outDir: string, content: string) => await fs.writeFile(outDir, content);
const writeInternalRojoConfig = async (outDir: string, content: string) => await fs.writeFile(outDir, content);

import path from 'node:path';
import { execa } from 'execa';
import { getCubixConfig } from './getCubixConfig';
import { buildRojoProjectConfig } from './buildRojoProjectConfig';
import { buildInternalTsConfig } from './buildInternalTsConfig';
import { FileManager, FileManagerOptions } from '@cubix-one/utils';
import Reorganize from '@core/reorganize';
import { CoreAnnotationsMap } from '@/types/cubixConfig';
import * as p from '@clack/prompts';
import color from 'picocolors';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export default async function BuildProject(deleteAll = true): Promise<boolean> {
  const cubixConfig = await getCubixConfig();
  const srcFiles = await fs.readFilesByExtension(`${cubixConfig.rootDir}`, 'ts');
  if (srcFiles.length <= 0) {
    p.log.warn(`No project files found in ${color.inverse(`./${cubixConfig.rootDir}`)}, please create your first script before building.`);
    process.exit(0);
  }

  const internalTsConfigObj = await buildInternalTsConfig(cubixConfig.outDir);
  const internalRojoConfigObj = await buildRojoProjectConfig(cubixConfig);

  const internalTsConfig = JSON.stringify(internalTsConfigObj, null, 2);
  const internalRojoConfig = JSON.stringify(internalRojoConfigObj, null, 2);

  const outDirPath = path.join(process.cwd(), cubixConfig.outDir);

  deleteAll ? await deleteOutDir(outDirPath) : await deleteOutDir(path.join(outDirPath, 'cubix'));

  if (deleteAll) await createOutDir(outDirPath);

  if (!deleteAll) {
    if (!(await fs.fileExists(`${outDirPath}/tsconfig.json`))) {
      await writeInternalTsConfig(`${outDirPath}/tsconfig.json`, internalTsConfig);
    }
    if (!(await fs.fileExists(`${outDirPath}/default.project.json`))) {
      await writeInternalRojoConfig(`${outDirPath}/default.project.json`, internalRojoConfig);
    }
  } else {
    await writeInternalTsConfig(`${outDirPath}/tsconfig.json`, internalTsConfig);
    await writeInternalRojoConfig(`${outDirPath}/default.project.json`, internalRojoConfig);
  }

  for (const annotation of Object.values(CoreAnnotationsMap)) {
    await fs.createDirectory(path.join(outDirPath, annotation.location), true);
  }

  await Reorganize(cubixConfig);

  try {
    await execa('rbxtsc', ['-p', cubixConfig.outDir], { cwd: process.cwd() });
    if (!deleteAll) p.log.success('🚀 Project compiled successfully');
    return true;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    p.log.error(`❌ Error compiling project: ${error.message}`);
    return false;
  }
}

const deleteOutDir = async (outDir: string) => await fs.deleteDirectory(outDir);
const createOutDir = async (outDir: string) => await fs.createDirectory(outDir);
const writeInternalTsConfig = async (outDir: string, content: string) => await fs.writeFile(outDir, content);
const writeInternalRojoConfig = async (outDir: string, content: string) => await fs.writeFile(outDir, content);

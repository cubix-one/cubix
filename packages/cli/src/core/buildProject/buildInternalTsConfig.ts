import { FileManager, FileManagerOptions } from '@cubix-one/utils';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export interface IInternalTsConfig {
  extends: string;
  compilerOptions: {
    rootDir: string;
    baseUrl: string;
    outDir: string;
    tsBuildInfoFile: string;
  };
  include: string[];
}

export async function buildInternalTsConfig(outDir: string): Promise<IInternalTsConfig> {
  const dotsLevel = await fs.getPathDiffLevel(`${process.cwd()}/${outDir}`, process.cwd());
  // TODO: Refactoring this code mainting just the last replace
  const formattedDotsLevel = dotsLevel
    .replace(/^\.\.(?:\/\.\.)*$/, '$&/') // Add '/' at the end if it ends with '..'
    .replace(/^\.?$/, './') // Replace '.' or empty string with './'
    .replace(/^(\.\.\/)+$/, '$&') // Keep '../' or '../../' etc. as is
    .replace(/[^/]$/, '$&/') // Add '/' at the end if it doesn't end with '/'
    .replace(/\\/g, '/'); // Replace backslashes with forward slashes

  return {
    extends: `${formattedDotsLevel}tsconfig.json`,
    compilerOptions: {
      rootDir: './cubix',
      baseUrl: './cubix',
      outDir: './roblox',
      tsBuildInfoFile: './roblox/tsconfig.tsbuildinfo',
    },
    include: ['./cubix/**/*'],
  };
}

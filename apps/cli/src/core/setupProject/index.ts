import path from 'node:path';
import type * as p from '@clack/prompts';
import color from 'picocolors';
import { devDependencies } from '@cubix-one/definitions/src/index';
import simpleGit from 'simple-git';
import { execa } from 'execa';

import { ErrorCode } from '@/types/errors';
import { handleError } from '@core/handleError';

import FileManager, { FileManagerOptions } from '@core/fileManagement';
import type { PromptOptions } from '@actions/init/prompt';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);
let spinner: ReturnType<typeof p.spinner>;

export async function setupProject(options: PromptOptions, spinnerReference: ReturnType<typeof p.spinner>) {
  spinner = spinnerReference;
  spinner.start('Creating project directory...');

  const projectDir = path.join(process.cwd(), options.projectName);
  await fs.createDirectory(projectDir);

  await cloneTemplate(projectDir);
  await fs.createDirectory(path.join(projectDir, options.rootDir));
  await updateFlags(projectDir, options);
  await installDependencies(projectDir, options);
}

async function cloneTemplate(projectDir: string) {
  spinner.message('Cloning template repository...');
  await simpleGit()
    .clone('https://github.com/cubix-one/template.git', projectDir, {
      '--branch': 'main',
    })
    .catch((error) => {
      handleError(ErrorCode.CLONE_TEMPLATE_ERROR, { outputError: error.message, exitProcess: true });
    });
  spinner.message('Template repository cloned successfully');
}

async function updateFlags(projectDir: string, options: PromptOptions) {
  const flags = ['::PROJECT_NAME::', '::ROOT_DIR::', '::OUT_DIR::'];
  const values = [options.projectName, options.rootDir, options.outputDir];
  const files = await fs.readFiles(projectDir);

  spinner.message('Updating flags...');

  for (const file of files) {
    let content = (await fs.readFile(file)) as string;
    flags.forEach((flag, index) => {
      const value = values[index];
      content = content.replaceAll(flag, value);
    });
    await fs.writeFile(file, content);
  }

  spinner.message('Flags updated successfully');
}

async function installDependencies(projectDir: string, options: PromptOptions) {
  const { projectName, packageManager } = options;

  spinner.message('Installing dependencies...');

  if (!(await fs.fileExists(path.join(projectDir, 'package.json')))) {
    handleError(ErrorCode.PACKAGE_JSON_NOT_FOUND, { exitProcess: true });
  }

  const command = getPackageManagerCommand(packageManager);

  try {
    await execa(packageManager, ['install'], { cwd: projectDir });
    await execa(packageManager, [...command, ...devDependencies], {
      cwd: projectDir,
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    handleError(ErrorCode.INSTALL_DEPENDENCIES_ERROR, { outputError: error.message, exitProcess: true });
  }
}

function getPackageManagerCommand(packageManager: string): string[] {
  switch (packageManager) {
    case 'npm':
      return ['install', '--save-dev'];
    case 'yarn':
      return ['add', '--dev'];
    case 'pnpm':
      return ['add', '--save-dev'];
    case 'bun':
      return ['add', '--dev'];
    default:
      handleError(ErrorCode.UNSUPPORTED_PACKAGE_MANAGER, { outputError: color.inverse(packageManager), exitProcess: true });
      return [];
  }
}

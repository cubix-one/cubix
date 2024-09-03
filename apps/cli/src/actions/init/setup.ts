import path from 'node:path';
import type * as p from '@clack/prompts';
import color from 'picocolors';
import { devDependencies } from '@cubix-one/definitions/src/index';
import simpleGit from 'simple-git';
import { execa } from 'execa';

import FileManager, { FileManagerOptions } from '@core/fileManagement';
import type { PromptOptions } from './prompt';

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
      console.error(`[ERROR] - Failed to clone template repository: ${error.message}`);
      process.exit(1);
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
    console.error(`[ERROR] - ${color.inverse(projectName)} does not contain a ${color.inverse('package.json')} file`);
    process.exit(1);
  }

  const command = getPackageManagerCommand(packageManager);

  try {
    await execa(packageManager, ['install'], { cwd: projectDir });
    await execa(packageManager, [...command, ...devDependencies], {
      cwd: projectDir,
    });
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error(`Failed to install dependencies: ${error.message}`);
    process.exit(1);
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
      console.error(`Unsupported package manager: ${color.inverse(packageManager)}`);
      return [];
  }
}

async function directoryExists(projectName: string): Promise<boolean> {
  if (await fs.directoryExists(projectName)) {
    console.error(`[ERROR] - ${color.inverse(projectName)} already exists in the current directory`);
    return true;
  }
  return false;
}

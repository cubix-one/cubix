import * as p from '@clack/prompts';
import color from 'picocolors';
import FileManager, { FileManagerOptions } from '@core/fileManagement';

export interface PromptOptions {
  projectName: string;
  packageManager: string;
  rootDir: string;
  outputDir: string;
  template: 'eslint_prettier' | 'biome';
}

const fs = FileManager(FileManagerOptions.LOCAL);

export async function initPrompt(projectName: string): Promise<PromptOptions> {
  process.stdout.write('\x1Bc');
  p.intro(color.bgCyan(color.bold(' 🧊 CREATE CUBIX PROJECT 🧊 ')));

  return (await p.group(
    {
      projectName: () => promptProjectName(projectName),
      packageManager: promptPackageManager,
      rootDir: promptRootDir,
      outputDir: promptOutputDir,
      template: promptTemplate,
    },
    { onCancel: promptOnCancel },
  )) as PromptOptions;
}

async function promptProjectName(projectName: string): Promise<string | symbol> {
  return await p.text({
    message: '✍️  project name',
    placeholder: 'my-project',
    initialValue: projectName,
    validate: (value: string) => {
      const validProjectNameRegex = /^[a-z]+(?:[-_][a-z]+)*$/;
      if (value.length === 0) {
        return 'Project name is required';
      }
      if (!validProjectNameRegex.test(value)) {
        return 'Project name must contain only lowercase letters, separated by "-" or "_"';
      }
      if (fs.directoryExists(value)) {
        return `Directory ${color.inverse(value)} already exists`;
      }
      return;
    },
  });
}

async function promptPackageManager() {
  return await p.select({
    message: '🔗 package manager',
    options: [
      { value: 'bun', label: 'bun', hint: 'recommended' },
      { value: 'npm', label: 'npm' },
      { value: 'yarn', label: 'yarn' },
      { value: 'pnpm', label: 'pnpm' },
    ],
    initialValue: 'bun',
  });
}

async function promptTemplate() {
  return await p.select({
    message: '📄 template',
    options: [
      { value: 'biome', label: 'Biome', hint: 'recommended' },
      { value: 'eslint_prettier', label: 'ESLint + Prettier' },
    ],
    initialValue: 'biome',
  });
}

const promptRootDir = () => promptText('📁 root directory', 'src');
const promptOutputDir = () => promptText('📂 output directory', 'out');

const promptText = (message: string, initialValue: string) => p.text({ message, placeholder: initialValue, initialValue });

async function promptOnCancel(): Promise<void> {
  p.cancel('Operation cancelled');
  process.exit(0);
}

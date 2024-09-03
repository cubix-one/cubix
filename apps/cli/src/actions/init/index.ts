import color from 'picocolors';
import * as p from '@clack/prompts';
import FileManager, { FileManagerOptions } from '@core/fileManagement';
import { initPrompt } from './prompt';
import { setupProject } from './setup';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);
const spinner = p.spinner();

export default async function InitAction(projectName: string) {
  if (await fs.directoryExists(projectName)) process.exit(1);

  const options = await initPrompt(projectName);

  p.log.info('🚀 Initializing Setup');
  await setupProject(options, spinner);
  spinner.stop();

  const message = `
        ${color.bgCyan(color.reset(' 🧊 Project created successfully! 🧊 '))}
        To start the project, run: ${options.packageManager} run watch
        To build the project, run: ${options.packageManager} run build
    `;

  p.note(message);
  p.outro(`for more information, visit ${color.cyan(color.bold(color.underline('https://github.com/cubix-one/cubix')))}`);
}

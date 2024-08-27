

import * as p from '@clack/prompts';
import color from 'picocolors';
import CreateProject from '@useCases/cli/createProject';
import { directoryExists } from '@utils/cli';

export class Build {
    projectName: string;
    packageManager: string;
    outputDir: string;
    rootDir: string;

    constructor(projectName?: string) {
        this.projectName = projectName || '';
        this.packageManager = '';
        this.outputDir = '';
        this.rootDir = '';

        if (this.projectName.length > 0) {
            this.validatePathExists();
        }
    }

    public async perform() {
        await this.Prompt();
        await this.createProject();
        this.finalMessage();
        process.exit(0);
    }

    private async Prompt() {
        process.stdout.write('\x1Bc');
        console.log("");
        p.intro(color.bgCyan(color.bold(' 🧊 CREATE CUBIX PROJECT 🧊 ')));

        const { projectName, packageManager, rootDir, outputDir } = await p.group({
            projectName: async () => await p.text({
                message: '✍️  project name',
                placeholder: 'my-project',
                initialValue: this.projectName ? this.projectName : '',
                validate: (value: string) => {
                    const validProjectNameRegex = /^[a-z]+(?:[-_][a-z]+)*$/;
                    if (value.length === 0) {
                        return 'Project name is required';
                    }
                    if (!validProjectNameRegex.test(value)) {
                        return 'Project name must contain only lowercase letters, separated by "-" or "_"';
                    }
                    if (this.validatePathExists(value, false)) {
                        return 'Directory already exists';
                    }
                    return;
                }
            }),

            packageManager: async () => await p.select({
                message: '🔗 package manager',
                options: [
                    { value: 'bun', label: 'bun', hint: 'recommended' },
                    { value: 'npm', label: 'npm' },
                    { value: 'yarn', label: 'yarn' },
                    { value: 'pnpm', label: 'pnpm' }
                ],
                initialValue: 'bun'
            }),

            rootDir: async () => await p.text({
                message: '📂 root directory',
                placeholder: 'src',
                initialValue: 'src'
            }),

            outputDir: async () => await p.text({
                message: '📂 output directory',
                placeholder: 'out',
                initialValue: 'out'
            }),
        }, { onCancel: () => { p.cancel('Operation cancelled'); process.exit(0); } });

        p.log.info('🚀 Initializing Setup')

        process.stdout.write('\r\x1b[K');

        this.projectName = projectName;
        this.packageManager = packageManager;
        this.rootDir = rootDir;
        this.outputDir = outputDir;
    }

    private async createProject() {
        const spinner = p.spinner();
        const createProject = new CreateProject({
            projectName: this.projectName,
            packageManager: this.packageManager,
            outputDir: this.outputDir,
            rootDir: this.rootDir,
        }, spinner);


        await createProject.perform();
        spinner.stop(color.bgGreen(color.bold(' ✅ COMPLETED ✅ ')));
    }

    private validatePathExists(projectName: string = this.projectName, show_error: boolean = true): boolean {
        if (directoryExists(`${process.cwd()}/${projectName}`)) {
            if (show_error) {
                console.error(`Directory ${projectName} exists already!`);
                process.exit(1);
            }

            return true;
        }

        return false;
    }

    private finalMessage() {
        const message = `
        ${color.bgCyan(color.reset(' 🧊 Project created successfully! 🧊 '))}\n
        To start the project, run: ${this.packageManager} run watch\n
        To build the project, run: ${this.packageManager} run build\n
        `

        p.note(message);
        p.outro(`for more information, visit ${color.cyan(color.bold(color.underline('https://github.com/cubix-one/cubix')))}`);
    }
}
import simpleGit, { SimpleGit } from 'simple-git';
import { createDirectory, fileExists, getFiles, readFile, writeFile } from "@utils/cli";
import { devDependencies } from '@cli/constants/packages'
import { execa } from 'execa';
import path from 'path';

interface ISpinner {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
}

interface ICreateProjectOptions {
    projectName: string;
    packageManager: string;
    outputDir: string;
    rootDir: string;
}

export default class CreateProject {
    private readonly spinner: ISpinner;
    private readonly git: SimpleGit;

    constructor(private readonly options: ICreateProjectOptions, spinner: ISpinner) {
        this.options = options;
        this.spinner = spinner;
        this.git = simpleGit();
    }

    public async perform() {
        this.spinner.start('Creating project Folder...');
        this.createProjectFolder();
        await this.downloadTemplate();
        this.createRootDir();
        this.updateStringFlags();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.installDependencies();
    }

    private createProjectFolder() {
        const { projectName } = this.options;
        createDirectory(`${process.cwd()}/${projectName}`, true);
    }

    private async downloadTemplate() {
        const { projectName } = this.options;
        const repoUrl = "https://github.com/cubix-one/template.git";
        const destPath = `${process.cwd()}/${projectName}`;

        this.spinner.message('Cloning template repository...');
        await this.git
            .clone(repoUrl, destPath,)
            .then(() => this.spinner.message('Template repository cloned successfully'))
            .catch((err) => {
                console.error('failed to clone template repository: ', err);
                process.exit(1);
            });
    }

    private createRootDir() {
        const { projectName, rootDir } = this.options;
        createDirectory(`${process.cwd()}/${projectName}/${rootDir}`, true);
    }

    private async updateStringFlags() {
        const flags = ['::PROJECT_NAME::', '::ROOT_DIR::', '::OUT_DIR::'];
        const values = [this.options.projectName, this.options.rootDir, this.options.outputDir];

        const files = getFiles(`${process.cwd()}/${this.options.projectName}`, '*');

        this.spinner.message('Updating flags...');
        files.forEach(file => {
            let content = readFile(file);
            flags.forEach((flag, index) => {
                const value = values[index];
                content = content.replaceAll(flag, value);
            });
            writeFile(file, content);
        });
    }

    private async installDependencies() {
        const { projectName, packageManager } = this.options;
        const projectPath = path.join(process.cwd(), projectName);
        const command = `${packageManager} install`;

        this.spinner.message('Installing dependencies...');
        try {
            if (!fileExists(path.join(projectPath, 'package.json'))) {
                console.error('package.json not found');
                process.exit(1);
            }

            await execa(command, { cwd: projectPath });

            const devDeps = devDependencies.join(' ');
            await execa(`${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} ${devDeps}`, { cwd: projectPath });
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}
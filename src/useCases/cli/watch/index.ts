import chokidar from 'chokidar';
import colors from 'picocolors';
import * as p from '@clack/prompts';
import { calculateFileHash, readJsonConfig, IJsonConfig } from "@utils/cli";
import CreateDirectories from '@useCases/cli/crateDirectories';
import ClearOutput from '@useCases/cli/clearOutput';
import Reorganize from '@useCases/cli/reorganize';
import { execa } from 'execa';



export default class Watch {
    jsonConfig: IJsonConfig;
    rootDir: string;
    outDir: string;
    fileHashes: Map<string, string>;
    clearUsecase: ClearOutput;
    createDirectoriesUsecase: CreateDirectories;
    reorganizeUsecase: Reorganize;

    constructor() {
        this.jsonConfig = readJsonConfig('cubix.tsconfig.json', 'tsconfig.json');
        this.rootDir = this.jsonConfig.compilerOptions.rootDir;
        this.outDir = this.jsonConfig.compilerOptions.outDir;
        this.fileHashes = new Map();
        this.clearUsecase = new ClearOutput(`${process.cwd()}/${this.outDir}`);
        this.createDirectoriesUsecase = new CreateDirectories(`${process.cwd()}/${this.outDir}`);
        this.reorganizeUsecase = new Reorganize(this.rootDir, this.outDir);
    }

    public async perform() {
        if (this.rootDir) {
            await this.watching();
        } else {
            p.log.error(`${colors.red(colors.bold('rootDir'))} not specified in cubix.tsconfig.json`);
            process.exit(1);
        }
    }

    private async watching() {
        const watcher = chokidar.watch(this.rootDir, {
            ignored: /(^|[\/\\])\..|.*~$/, // ignore dotfiles e arquivos temporários
            persistent: true,
            ignoreInitial: true
        });

        watcher.on('change', async (filePath) => {
            await this.handleFileChange(filePath);
        });

        p.intro(colors.bgGreen(` 👀 Watching for changes in ${colors.bgBlue(`[📂 ${colors.white(this.rootDir)}] `)}`));
        this.performUsecases();
    }

    private async handleFileChange(filePath: string) {
        const newHash = calculateFileHash(filePath);
        const oldHash = this.fileHashes.get(filePath);

        if (newHash !== oldHash) {
            this.fileHashes.set(filePath, newHash);
            p.log.info(colors.green(`📝 File ${colors.bold(colors.underline(filePath))} has been changed`));
            await this.performUsecases();
        }
    }

    private async performUsecases() {
        this.clearUsecase.perform();
        this.createDirectoriesUsecase.perform();
        await this.reorganizeUsecase.perform();

        try {
            await execa(`rbxtsc -i ${this.outDir}/roblox`, { cwd: process.cwd() });
            p.log.success('🚀 Project compiled successfully');
        } catch (error: any) {
            p.log.error(`❌ Error compiling project: ${error.message}`);
        }
    }
}
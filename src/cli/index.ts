#!/usr/bin/env bun

import { Build } from "@useCases/cli/build";
import Watch from "@useCases/cli/watch";

import { Command } from 'commander';
const program = new Command();

program
    .name('cubix')
    .description('Cubix a Roblox Framework')
    .version('0.0.1');

program
    .command('init [projectName]')
    .description('Initialize a new project')
    .allowUnknownOption(true)
    .action(async (projectName) => {
        const build = new Build(projectName);
        await build.perform();
    });

program
    .option('-r, --rootDir <dir>', 'Root directory')
    .option('-o, --outputDir <dir>', 'Output directory')
    .option('-w, --watch', 'Watch for file changes');

// Adiciona um comando padrão para lidar com opções sem comandos específicos
program
    .action(async () => {
        const options = program.opts();

        if (options.watch) {
            const watchUseCase = new Watch();
            await watchUseCase.perform();
        }
    });

program.parse(process.argv);
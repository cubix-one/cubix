import * as p from "@clack/prompts"
import color from 'picocolors'
import { createFile } from "@utils/cli";
import FileData, { IFileData } from "../fileData";

export default class Reorganize {
    private fileDataUseCase: FileData;

    constructor(private rootDir: string, private outputDir: string) {
        this.fileDataUseCase = new FileData(rootDir, outputDir);
    }

    public async perform() {
        const fileData = this.fileDataUseCase.perform();
        await this.validateUnannotatedFiles(fileData);
        this.updateImports(fileData);
        this.createFiles(fileData);
    }

    private updateImports(fileData: IFileData) {
        for (const file of fileData.annotatedFiles) {
            if (file.imports.length > 0 && file.finalImports.length > 0) {
                file.content = file.content.replace(file.imports.join('\n'), file.finalImports.join('\n'));
            }
        }
    }

    private createFiles(fileData: IFileData) {
        for (const file of fileData.annotatedFiles) {
            createFile(file.finalPath, file.content);
        }
    }

    private async validateUnannotatedFiles(fileData: IFileData) {
        if (fileData.files.length > 0) {
            const title = color.bold(color.inverse(' Missing annotations '));
            const files = fileData.files.map(file => `-> ${color.underline(file.originName)}\n`).join("");
            const message = `The files below have missing annotations:\n${files}`;
            p.note(message, title);

            p.select({
                message: 'Waiting for changes...',
                options: [
                    { value: 'yes', label: '' },
                ]
            });
            await new Promise(resolve => setInterval(resolve, 60 * 1000 * 60));
        }
    }
}
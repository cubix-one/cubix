import { deleteDirectory, directoryExists } from "@utils/cli";
import * as p from "@clack/prompts";
import colors from "picocolors";

export default class ClearOutput {
    constructor(private readonly outputDir: string) {
        this.outputDir = outputDir;
    }

    public async perform() {
        if (this.directoryExists()) {
            this.deleteDirectory();
        }
    }

    private directoryExists(): boolean {
        return directoryExists(`${this.outputDir}/cubix`);
    }

    private deleteDirectory() {
        //p.log.success(`🗑️  Cleaning ${colors.green(`${this.outputDir}\\cubix`)}`);
        deleteDirectory(`${this.outputDir}\\cubix`);
    }
}
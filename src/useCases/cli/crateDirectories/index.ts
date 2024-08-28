import * as p from "@clack/prompts";
import { annotationMap, IAnnotationMap } from "@cli/constants/maps";
import { createDirectory } from "@utils/cli";

export default class CreateDirectories {
    constructor(private readonly outputDir: string) {
        this.outputDir = outputDir;
    }

    public async perform() {
        Object.values(annotationMap).forEach((value: IAnnotationMap) => {
            createDirectory(`${this.outputDir}/${value.location}`, true);
        });
        //p.log.success('📁 Directories created');
    }
}
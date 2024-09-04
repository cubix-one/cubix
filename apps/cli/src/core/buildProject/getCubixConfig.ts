import path from 'node:path';
import { type IAnnotationInfo, IAnnotationPrefix, ICoreAnnotation, type ICubixConfig, IRobloxLocation } from '@/types/cubixConfig';
import FileManager, { FileManagerOptions } from '@core/fileManagement';
import color from 'picocolors';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

const queueErrorMessages: string[] = [];
const addErrorMessage = (message: string) => queueErrorMessages.push(message);

export async function getCubixConfig(): Promise<ICubixConfig> {
  const configFile = await getCubixConfigFile();
  const configObject = JSON.parse(configFile) as ICubixConfig;

  await validations(configObject);

  return configObject;
}

async function getCubixConfigFile() {
  const configPath = path.join(process.cwd(), 'cubix.config.json');
  if (!(await fs.fileExists(configPath))) {
    addErrorMessage(`${color.inverse('cubix.config.json')} does not exist`);
    doError();
  }
  const configFile = (await fs.readFile(configPath)) as string;
  return configFile;
}

async function validations(config: ICubixConfig) {
  await validationRequiredFields(config.rootDir, 'rootDir', true);
  await validationRequiredFields(config.outDir, 'outDir');
  await validationAnnotationOverrides(config.annotationOverrides as { [key in ICoreAnnotation]?: IAnnotationInfo | undefined });

  if (queueErrorMessages.length > 0) {
    doError();
  }
}

async function validationRequiredFields(fieldValue: string, fieldName: string, validateDirectory = false) {
  if (!fieldValue) {
    addErrorMessage(`${fieldName} is required`);
  } else {
    if (fieldValue === '') {
      addErrorMessage(`${fieldName} cannot be empty`);
    }
    if (validateDirectory) {
      const directoryExists = await fs.directoryExists(path.resolve(process.cwd(), fieldValue));
      if (!directoryExists) {
        addErrorMessage(`${fieldName} ${color.inverse(fieldValue)} does not exist`);
      }
    }
  }
}

async function validationAnnotationOverrides(annotationOverrides: { [key in ICoreAnnotation]?: IAnnotationInfo | undefined }) {
  if (annotationOverrides) {
    const annotationKeys = Object.keys(annotationOverrides);
    const annotationValues = Object.values(annotationOverrides);

    for (const annotation of annotationKeys) {
      if (!ICoreAnnotation.includes(annotation as ICoreAnnotation)) {
        addErrorMessage(`${color.inverse(annotation)} is not a core valid annotation to override. A valid annotation is \n\n-> ${ICoreAnnotation.join('\n-> ')}`);
      }
    }

    for (const annotation of annotationValues) {
      if (annotation) {
        if (annotation.prefix) {
          const validAnnotationPrefixes = Object.values(IAnnotationPrefix);
          if (!validAnnotationPrefixes.includes(annotation.prefix as IAnnotationPrefix)) {
            addErrorMessage(`${color.inverse(annotation.prefix)} is not a valid prefix. A valid prefix is \n\n-> ${validAnnotationPrefixes.join('\n-> ')}`);
          }
        }

        if (annotation.robloxLocation) {
          const validRobloxLocations = Object.values(IRobloxLocation);
          if (!validRobloxLocations.includes(annotation.robloxLocation as IRobloxLocation)) {
            addErrorMessage(`${color.inverse(annotation.robloxLocation)} is not a valid Roblox location. A valid location is \n\n-> ${validRobloxLocations.join('\n-> ')}`);
          }
        }
      }
    }
  }
}

function doError() {
  for (const message of queueErrorMessages) {
    console.error(`[ERROR] (${color.bold('cubix.config.json')})\n[MESSAGE] - ${message}`);
  }
  process.exit(1);
}

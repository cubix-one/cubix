import path from 'node:path';
import color from 'picocolors';
import { type IAnnotationInfo, IAnnotationPrefix, ICoreAnnotation, type ICubixConfig, IRobloxLocation } from '@/types/cubixConfig';
import FileManager, { FileManagerOptions } from '@core/fileManagement';
import { handleError } from '@core/handleError';
import { ErrorCode } from '@/types/errors';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

const queueErrorMessages: { code: ErrorCode; message?: string; dataList?: string[] }[] = [];
const addErrorMessage = (code: ErrorCode, message?: string, dataList?: string[]) => queueErrorMessages.push({ code, message: message || '', dataList: dataList || [] });

export async function getCubixConfig(): Promise<ICubixConfig> {
  const configFile = await getCubixConfigFile();
  const configObject = JSON.parse(configFile) as ICubixConfig;

  await validations(configObject);

  return configObject;
}

async function getCubixConfigFile() {
  const configPath = path.join(process.cwd(), 'cubix.config.json');
  if (!(await fs.fileExists(configPath))) {
    handleError(ErrorCode.CUBIX_CONFIG_NOT_FOUND, { outputError: color.inverse('cubix.config.json'), exitProcess: true });
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
    addErrorMessage(ErrorCode.CUBIX_CONFIG_REQUIRED_FIELD, `${fieldName} is required`);
  } else {
    if (fieldValue === '') {
      addErrorMessage(ErrorCode.CUBIX_CONFIG_REQUIRED_FIELD, `${fieldName} cannot be empty`);
    }
    if (validateDirectory) {
      const directoryExists = await fs.directoryExists(path.resolve(process.cwd(), fieldValue));
      if (!directoryExists) {
        addErrorMessage(ErrorCode.CUBIX_CONFIG_REQUIRED_FIELD, `${fieldName} ${color.inverse(fieldValue)} does not exist`);
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
        addErrorMessage(ErrorCode.CUBIX_CONFIG_INVALID_ANNOTATION_OVERRIDE, `${color.inverse(annotation)} is not a valid core annotation to override. A valid annotation is`, Object.values(ICoreAnnotation));
      }
    }

    for (const annotation of annotationValues) {
      if (annotation) {
        if (annotation.prefix) {
          const validAnnotationPrefixes = Object.values(IAnnotationPrefix);
          if (!validAnnotationPrefixes.includes(annotation.prefix as IAnnotationPrefix)) {
            addErrorMessage(ErrorCode.CUBIX_CONFIG_INVALID_ANNOTATION_PREFIX, `${color.inverse(annotation.prefix)} is not a valid prefix. A valid prefix is`, validAnnotationPrefixes);
          }
        }

        if (annotation.robloxLocation) {
          const validRobloxLocations = Object.values(IRobloxLocation);
          if (!validRobloxLocations.includes(annotation.robloxLocation as IRobloxLocation)) {
            addErrorMessage(ErrorCode.CUBIX_CONFIG_INVALID_ROBLOX_LOCATION, `${color.inverse(annotation.robloxLocation)} is not a valid Roblox location. A valid location is`, validRobloxLocations);
          }
        }
      }
    }
  }
}

function doError() {
  for (const message of queueErrorMessages) {
    handleError(message.code, { customMessage: message.message, listData: message.dataList });
  }
  process.exit(1);
}

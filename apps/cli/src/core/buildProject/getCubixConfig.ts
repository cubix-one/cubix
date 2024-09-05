import path from 'node:path';
import color from 'picocolors';
import { type IAnnotationInfo, IAnnotationPrefix, ICoreAnnotation, type ICubixConfig, IRobloxLocation, type IWatchConfig, WatchEvent, WatchType } from '@/types/cubixConfig';
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
  await validationWatchConfig(config.watch as IWatchConfig);

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

async function validationWatchConfig(watch: IWatchConfig) {
  if (watch) {
    if (watch.type) {
      const validWatchTypes = Object.values(WatchType);
      if (!validWatchTypes.includes(watch.type as WatchType)) {
        addErrorMessage(ErrorCode.CUBIX_CONFIG_INVALID_WATCH_TYPE, `${color.inverse(watch.type)} is not a valid watch type. A valid watch type is`, validWatchTypes);
      }

      if (watch.type === WatchType.Debounce) {
        if (watch.debounceTime && typeof watch.debounceTime !== 'number') {
          addErrorMessage(ErrorCode.WATCH_INVALID_DEBOUNCE_TIME, `${color.inverse(watch.debounceTime)} is not a valid debounce time. A valid debounce time is a number`);
        }
        if (watch.debounceTime && !Number.isInteger(watch.debounceTime)) {
          addErrorMessage(ErrorCode.WATCH_INVALID_DEBOUNCE_TIME, `${color.inverse(watch.debounceTime)} is not a valid debounce time. The debounce time must be an integer`);
        }

        if (!watch.debounceTime || watch.debounceTime <= 0) {
          addErrorMessage(ErrorCode.WATCH_INVALID_DEBOUNCE_TIME, 'debounceTime is required when watch type is debounce');
        }
      }
    }

    if (watch.extensions) {
      if (!Array.isArray(watch.extensions)) {
        addErrorMessage(ErrorCode.WATCH_INVALID_EXTENSIONS, `${color.inverse(watch.extensions)} is not a valid extensions. The extensions must be provided as an array of strings`);
      } else {
        const validExtensions = watch.extensions.map((extension) => extension.toLowerCase());
        const invalidExtensions = validExtensions.filter((extension) => extension.startsWith('.'));
        if (invalidExtensions.length > 0) {
          addErrorMessage(ErrorCode.WATCH_INVALID_EXTENSIONS, `${color.inverse(invalidExtensions.join(', '))} are not valid extensions. Extension must not start with a dot (.)`);
        }
      }
    }

    if (watch.events) {
      if (!Array.isArray(watch.events)) {
        addErrorMessage(ErrorCode.WATCH_INVALID_EVENTS, `${color.inverse(watch.events)} is not a valid events. The events must be provided as an array of strings`);
      } else {
        const validEvents = Object.values(WatchEvent);
        const invalidEvents = watch.events.filter((event) => !validEvents.includes(event as WatchEvent));
        if (invalidEvents.length > 0) {
          addErrorMessage(ErrorCode.WATCH_INVALID_EVENTS, `${color.inverse(invalidEvents.join(', '))} are not valid events. A valid event is`, validEvents);
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

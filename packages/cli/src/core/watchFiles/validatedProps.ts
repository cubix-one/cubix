import path from 'node:path';
import color from 'picocolors';
import { FileManager, FileManagerOptions } from '@cubix-one/utils';
import { handleError } from '@core/handleError';
import type { WatchFilesProps } from '@core/watchFiles';
import { ErrorCode } from '@/types/errors';
import { WatchEvent, WatchType } from '@/types/cubixConfig';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export async function getValidatedProps(props: WatchFilesProps): Promise<WatchFilesProps> {
  return {
    path: props.path ? await getPath(props.path) : '',
    extensions: props.extensions ? getExtensions(props.extensions.toString()) : [],
    exclude: props.exclude ? getExclude(props.exclude.toString()) : [],
    server: props.server || false,
    type: props.type ? getType(props.type, props.debounceTime) : WatchType.Standard,
    events: props.events ? getEvents(props.events.toString()) : [],
    debounceTime: props.debounceTime,
  };
}

async function getPath(currentPath: string): Promise<string> {
  let result = currentPath;

  if (currentPath) {
    const isDirectory = await fs.isDirectory(path.join(process.cwd(), currentPath));
    if (!isDirectory) {
      handleError(ErrorCode.WATCH_PATH_NOT_FOUND, { customMessage: `Path ${color.inverse(currentPath)} is not a valid directory`, exitProcess: true });
    }
    result = path.relative(process.cwd(), currentPath);
  }
  return result;
}

function getExtensions(extensions: string): string[] {
  let result: string[] = [];

  if (extensions) {
    if (extensions.endsWith(',')) {
      handleError(ErrorCode.WATCH_INVALID_EXTENSIONS, {
        customMessage: `Invalid extensions pattern [${color.inverse(extensions)}]. Please, check if you have added a comma at the end of the extensions.`,
        exitProcess: true,
      });
    }

    if (extensions.includes('.')) {
      handleError(ErrorCode.WATCH_INVALID_EXTENSIONS, {
        customMessage: `Invalid extensions pattern [${color.inverse(extensions)}]. Use comma to separate extensions.`,
        exitProcess: true,
      });
    }

    result = extensions.split(',');
  }
  return result;
}

function getExclude(excludes: string): string[] {
  let result: string[] = [];

  if (excludes) {
    if (excludes.endsWith(',')) {
      handleError(ErrorCode.WATCH_INVALID_EXCLUDE, {
        customMessage: `Invalid extensions pattern [${color.inverse(excludes)}]. Please, check if you have added a comma at the end of the extensions.`,
        exitProcess: true,
      });
    }

    result = excludes.split(',');
  }
  return result;
}

function getType(type: string, debounceTime: number): WatchType {
  const validWatchTypes = Object.values(WatchType);

  if (!validWatchTypes.includes(type as WatchType)) {
    handleError(ErrorCode.CUBIX_CONFIG_INVALID_WATCH_TYPE, {
      customMessage: `${color.inverse(type)} is not a valid watch type. A valid watch type is`,
      listData: validWatchTypes,
      exitProcess: true,
    });
  }

  if (type === WatchType.Debounce) {
    if (debounceTime && typeof debounceTime !== 'number') {
      handleError(ErrorCode.WATCH_INVALID_DEBOUNCE_TIME, {
        customMessage: `${color.inverse(debounceTime)} is not a valid debounce time. A valid debounce time is a number`,
        exitProcess: true,
      });
    }

    if (debounceTime && !Number.isInteger(debounceTime)) {
      handleError(ErrorCode.WATCH_INVALID_DEBOUNCE_TIME, {
        customMessage: `${color.inverse(debounceTime)} is not a valid debounce time. The debounce time must be an integer`,
        exitProcess: true,
      });
    }

    if (!debounceTime || debounceTime <= 0) {
      handleError(ErrorCode.WATCH_INVALID_DEBOUNCE_TIME, {
        customMessage: 'debounceTime is required when watch type is debounce',
        exitProcess: true,
      });
    }
  }

  return type as WatchType;
}

function getEvents(events: string): string[] {
  if (events) {
    const validEvents = Object.values(WatchEvent);
    const invalidEvents = events.split(',').filter((event) => !validEvents.includes(event as WatchEvent));
    if (invalidEvents.length > 0) {
      handleError(ErrorCode.WATCH_INVALID_EVENTS, {
        customMessage: `${color.inverse(invalidEvents.join(', '))} are not valid events. A valid event is`,
        listData: validEvents,
        exitProcess: true,
      });
    }
  }

  return events.split(',');
}

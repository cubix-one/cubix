import * as p from '@clack/prompts';
import color from 'picocolors';

import { ErrorMessages, type ErrorCode, type ErrorStructure } from '@/types/errors';

interface IErrorOptions {
  customMessage?: string;
  outputError?: string;
  listData?: string[];
  exitProcess?: boolean;
}

export function handleError(errorCode: ErrorCode, options?: IErrorOptions) {
  const { customMessage, exitProcess = false, outputError = '', listData = [] } = options || {};

  const errorStructure: ErrorStructure = {
    code: errorCode,
    message: customMessage || ErrorMessages[errorCode],
  };

  errorStructure.message = outputError ? `${errorStructure.message} -> ${outputError}` : errorStructure.message;

  p.log.error(color.red(`[ERROR] - ${errorStructure.code}: ${errorStructure.message}`));

  if (listData.length > 0) {
    console.error(`-> ${listData.join('\n-> ')}`);
  }

  if (exitProcess) {
    process.exit(1);
  }

  throw new Error(JSON.stringify(errorStructure));
}

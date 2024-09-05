export enum ErrorCode {
  CLONE_TEMPLATE_ERROR = 'E001',
  FILE_NOT_FOUND = 'E002',
  PACKAGE_JSON_NOT_FOUND = 'E003',
  INSTALL_DEPENDENCIES_ERROR = 'E004',
  UNSUPPORTED_PACKAGE_MANAGER = 'E005',
  DIRECTORY_ALREADY_EXISTS = 'E006',
  CUBIX_CONFIG_NOT_FOUND = 'E007',
  CUBIX_CONFIG_REQUIRED_FIELD = 'E008',
  CUBIX_CONFIG_INVALID_ANNOTATION_OVERRIDE = 'E009',
  CUBIX_CONFIG_INVALID_ANNOTATION_PREFIX = 'E010',
  CUBIX_CONFIG_INVALID_ROBLOX_LOCATION = 'E011',
  CUBIX_CONFIG_INVALID_WATCH_TYPE = 'E012',
  ROJO_SERVER_STDOUT_ERROR = 'E013',
  ROJO_SERVER_TIMEOUT_ERROR = 'E014',
  WATCH_PATH_NOT_FOUND = 'E015',
  WATCH_INVALID_EXTENSIONS = 'E016',
  WATCH_INVALID_EXCLUDE = 'E017',
  WATCH_INVALID_DEBOUNCE_TIME = 'E018',
  WATCH_INVALID_EVENTS = 'E019',
  ROJO_SERVER_NOT_FOUND_ERROR = 'E020',
  UNKNOWN_ERROR = 'E999',
}

export interface ErrorStructure {
  code: ErrorCode;
  message: string;
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.CLONE_TEMPLATE_ERROR]: 'Error when cloning template repository.',
  [ErrorCode.FILE_NOT_FOUND]: 'File or directory not found.',
  [ErrorCode.PACKAGE_JSON_NOT_FOUND]: 'Package.json not found.',
  [ErrorCode.INSTALL_DEPENDENCIES_ERROR]: 'Error when installing dependencies.',
  [ErrorCode.UNSUPPORTED_PACKAGE_MANAGER]: 'Unsupported package manager.',
  [ErrorCode.DIRECTORY_ALREADY_EXISTS]: 'Directory already exists.',
  [ErrorCode.CUBIX_CONFIG_NOT_FOUND]: 'Cubix config file not found.',
  [ErrorCode.CUBIX_CONFIG_REQUIRED_FIELD]: 'Missing required field in Cubix config file.',
  [ErrorCode.CUBIX_CONFIG_INVALID_ANNOTATION_OVERRIDE]: 'Invalid annotation override.',
  [ErrorCode.CUBIX_CONFIG_INVALID_ANNOTATION_PREFIX]: 'Invalid annotation prefix.',
  [ErrorCode.CUBIX_CONFIG_INVALID_ROBLOX_LOCATION]: 'Invalid Roblox location.',
  [ErrorCode.CUBIX_CONFIG_INVALID_WATCH_TYPE]: 'Invalid watch type.',
  [ErrorCode.ROJO_SERVER_STDOUT_ERROR]: 'Error when capturing Rojo stdout.',
  [ErrorCode.ROJO_SERVER_TIMEOUT_ERROR]: 'Limit time of 10 seconds exceeded for Rojo server.',
  [ErrorCode.WATCH_PATH_NOT_FOUND]: 'Path not found.',
  [ErrorCode.WATCH_INVALID_EXTENSIONS]: 'Invalid extensions.',
  [ErrorCode.WATCH_INVALID_EXCLUDE]: 'Invalid exclude.',
  [ErrorCode.WATCH_INVALID_DEBOUNCE_TIME]: 'Invalid debounce time.',
  [ErrorCode.WATCH_INVALID_EVENTS]: 'Invalid events.',
  [ErrorCode.ROJO_SERVER_NOT_FOUND_ERROR]: 'Rojo server not found. Please install cubix-one in your project.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred.',
};

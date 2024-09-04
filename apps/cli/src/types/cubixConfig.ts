/**
 * Enumeration that represents the possible locations in Roblox.
 */
export enum IRobloxLocation {
  ReplicatedStorage = 'ReplicatedStorage',
  ServerStorage = 'ServerStorage',
  StarterPack = 'StarterPack',
  StarterPlayer = 'StarterPlayer',
  StarterPlayerScripts = 'StarterPlayerScripts',
  StarterCharacterScripts = 'StarterCharacterScripts',
  StarterCharacter = 'StarterCharacter',
  StarterOutfit = 'StarterOutfit',
}

/**
 * Enumeration that represents the possible prefixes for annotations.
 */
export enum IAnnotationPrefix {
  Client = 'client',
  Server = 'server',
  Shared = 'shared',
}

/**
 * Enumeration that represents the possible core annotations.
 */
export const CoreAnnotationsMap = {
  client_controller: { location: 'cubix/client/controllers', prefix: 'client' },
  client_component: { location: 'cubix/client/components', prefix: 'client' },
  client_module: { location: 'cubix/client/modules', prefix: 'module' },
  ui_component: { location: 'cubix/client/ui', prefix: 'client' },
  server_controller: { location: 'cubix/server/controllers', prefix: 'server' },
  server_component: { location: 'cubix/server/components', prefix: 'server' },
  server_module: { location: 'cubix/server/modules', prefix: 'module' },
  event_handlers: { location: 'cubix/server/eventHandlers', prefix: 'server' },
  shared_constants: { location: 'cubix/shared/constants', prefix: 'shared' },
  shared_types: { location: 'cubix/shared/types', prefix: 'shared' },
  shared_utils: { location: 'cubix/shared/utils', prefix: 'shared' },
  shared_module: { location: 'cubix/shared/modules', prefix: 'module' },
} as const;

export type ICoreAnnotation = keyof typeof CoreAnnotationsMap;
export const ICoreAnnotation = Object.keys(CoreAnnotationsMap) as ICoreAnnotation[];

export const ICoreAnnotationLocation: Record<ICoreAnnotation, string> = Object.fromEntries(Object.entries(CoreAnnotationsMap).map(([key, value]) => [key, value.location])) as Record<ICoreAnnotation, string>;

export const ICoreAnnotationPrefix: Record<ICoreAnnotation, string> = Object.fromEntries(Object.entries(CoreAnnotationsMap).map(([key, value]) => [key, value.prefix])) as Record<ICoreAnnotation, string>;

/**
 * Interface that represents the information for an annotation.
 */
export interface IAnnotationInfo {
  /**
   * The name of the annotation.
   */
  name: string;
  /**
   * The location of the annotation.
   * This is the path to the folder where the script will be created.
   */
  location: string;
  /**
   * The prefix of the annotation.
   */
  prefix: IAnnotationPrefix;
  /**
   * The Roblox location of the annotation.
   * This is the path to the folder where the script will be created in Roblox Studio.
   */
  robloxLocation?: IRobloxLocation;
}

/**
 * Type that represents the annotations.
 * This is the configuration for the annotations.
 */
export type IAnnotations = {
  /**
   * The key is the annotation name.
   * The value is the annotation information.
   */
  [key in ICoreAnnotation]: IAnnotationInfo;
};

/**
 * Interface that represents the information of the project.
 */
export interface IProjectInfo {
  /** The name of the project.
   *  @default "cubix-game"
   */
  name?: string;
  /** The version of the project.
   *  @default "1.0.0"
   */
  version?: string;
  /** The description of the project.
   *  @default "A new Cubix project."
   */
  description?: string;
  /** The author of the project.
   *  @default "game made by cubix framework"
   */
  author?: string;
  /** The license of the project.
   *  @default "MIT"
   */
  license?: string;
}

/**
 * Enumeration that represents the available watch types.
 */
export enum WatchType {
  /**
   * Watch all files in the directory.
   */
  Standard = 'standard',
  /**
   * Watch all files in the outDir directory and generate a hash of the file content. to detect changes.
   */
  Hash = 'hash',
  /**
   * Watch all files in the directory with a debounce time.
   */
  Debounce = 'debounce',
}

/**
 * Enumeration that represents the available watch events.
 */
export enum WatchEvent {
  /**
   * Watch for all file events.
   */
  All = 'all',
  /**
   * Watch for file additions.
   */
  Add = 'add',

  /**
   * Watch for directory additions.
   */
  AddDir = 'addDir',

  /**
   * Watch for errors.
   */
  Error = 'error',

  /**
   * Watch for raw events.
   */
  Raw = 'raw',

  /**
   * Watch for the ready event.
   */
  Ready = 'ready',

  /**
   * Watch for file changes.
   */
  Change = 'change',
  /**
   * Watch for file deletions.
   */
  Unlink = 'unlink',

  /**
   * Watch for directory deletions.
   */
  UnlinkDir = 'unlinkDir',
}

/**
 * Interface that represents the watch configuration. this overrides the cli default watch configuration.
 */
export interface IWatchConfig {
  /**
   * The type of watch to be used.
   */
  type: WatchType;

  /**
   * The file extensions to be watched.
   */
  extensions?: string[];

  /**
   * The debounce time in milliseconds.
   * Only used when the type is Debounce.
   */
  debounceTime?: number;

  /**
   * The paths to be excluded from the watch.
   */
  exclude?: string[];

  /**
   * The events to be watched.
   */
  events?: WatchEvent[];
}

/**
 * Represents the configuration Json Schema for the Cubix CLI.
 */
export interface ICubixConfig {
  /** The information of the project. */
  projectInfo?: IProjectInfo;
  /** The root code directory of the project. */
  rootDir: string;
  /** The output directory of the project. */
  outDir: string;

  /** Override the default annotations for a custom annotation. */
  annotationOverrides?: {
    [key in ICoreAnnotation]?: IAnnotationInfo | undefined;
  };

  /** Watch configuration. */
  watch?: IWatchConfig;
}

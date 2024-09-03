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
}

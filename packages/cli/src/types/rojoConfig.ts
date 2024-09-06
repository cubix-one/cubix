export interface IRojoProjectConfig {
  name: string;
  globIgnorePaths: string[];
  tree: IRojoDataModel;
}

export interface IRojoDataModel {
  $className: string;
  ServerScriptService: IRojoServiceConfig;
  ReplicatedStorage: IRojoReplicatedStorageConfig;
  StarterPlayer: IRojoStarterPlayerConfig;
  StarterGui: IRojoServiceConfig;
  Workspace: IRojoServiceConfig;
  HttpService: IRojoServiceConfig;
  SoundService: IRojoServiceConfig;
}

export interface IRojoServiceConfig {
  $className: string;
  TS?: IRojoPathConfig;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  $properties?: Record<string, any>;
}

export interface IRojoPathConfig {
  $path: string;
}

export interface IRojoReplicatedStorageConfig extends IRojoServiceConfig {
  rbxts_include: IRojoRbxtsIncludeConfig;
}

export interface IRojoRbxtsIncludeConfig {
  $path: string;
  node_modules: IRojoNodeModulesConfig;
}

export interface IRojoNodeModulesConfig {
  $className: string;
  '@rbxts': IRojoPathConfig;
}

export interface IRojoStarterPlayerConfig {
  $className: string;
  StarterPlayerScripts: IRojoServiceConfig;
}

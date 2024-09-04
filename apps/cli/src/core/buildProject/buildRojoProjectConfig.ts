import type { ICubixConfig } from '@/types/cubixConfig';
import type { IRojoDataModel, IRojoProjectConfig, IRojoReplicatedStorageConfig, IRojoServiceConfig, IRojoStarterPlayerConfig } from '@/types/rojoConfig';
import FileManager, { FileManagerOptions } from '@/core/fileManagement';

const fs = FileManager(FileManagerOptions.LOCAL_ASYNC);

export async function buildRojoProjectConfig(cubixConfig: ICubixConfig): Promise<IRojoProjectConfig> {
  return {
    name: cubixConfig.projectInfo?.name || 'cubix-game',
    globIgnorePaths: ['**/package.json', '**/tsconfig.json'],
    tree: await buildTree(cubixConfig),
  };
}

async function buildTree(cubixConfig: ICubixConfig): Promise<IRojoDataModel> {
  return {
    $className: 'DataModel',
    ServerScriptService: buildServerScriptService(),
    ReplicatedStorage: await buildReplicatedStorage(cubixConfig),
    StarterPlayer: buildStarterPlayer(),
    StarterGui: buildStarterGui(),
    Workspace: buildWorkspace(),
    HttpService: buildHttpService(),
    SoundService: buildSoundService(),
  };
}

function buildServerScriptService(): IRojoServiceConfig {
  return {
    $className: 'ServerScriptService',
    TS: {
      $path: 'roblox/server',
    },
  };
}

async function buildReplicatedStorage(cubixConfig: ICubixConfig): Promise<IRojoReplicatedStorageConfig> {
  const dotsLevel = await fs.getPathDiffLevel(`${process.cwd()}/${cubixConfig.outDir}`, process.cwd());
  // TODO: Refactoring this code mainting just the last replace
  const formattedDotsLevel = dotsLevel
    .replace(/^\.\.(?:\/\.\.)*$/, '$&/') // Add '/' at the end if it ends with '..'
    .replace(/^\.?$/, './') // Replace '.' or empty string with './'
    .replace(/^(\.\.\/)+$/, '$&') // Keep '../' or '../../' etc. as is
    .replace(/[^/]$/, '$&/') // Add '/' at the end if it doesn't end with '/'
    .replace(/\\/g, '/'); // Replace backslashes with forward slashes

  return {
    $className: 'ReplicatedStorage',
    rbxts_include: {
      $path: 'include',
      node_modules: {
        $className: 'Folder',
        '@rbxts': {
          $path: `${formattedDotsLevel}node_modules/@rbxts`,
        },
      },
    },
    TS: {
      $path: 'roblox/shared',
    },
  };
}

function buildStarterPlayer(): IRojoStarterPlayerConfig {
  return {
    $className: 'StarterPlayer',
    StarterPlayerScripts: {
      $className: 'StarterPlayerScripts',
      TS: {
        $path: 'roblox/client',
      },
    },
  };
}

function buildStarterGui(): IRojoServiceConfig {
  return {
    $className: 'StarterGui',
    TS: {
      $path: 'roblox/client/ui',
    },
  };
}

function buildWorkspace(): IRojoServiceConfig {
  return {
    $className: 'Workspace',
    $properties: {
      FilteringEnabled: true,
    },
  };
}

function buildHttpService(): IRojoServiceConfig {
  return {
    $className: 'HttpService',
    $properties: {
      HttpEnabled: true,
    },
  };
}

function buildSoundService(): IRojoServiceConfig {
  return {
    $className: 'SoundService',
    $properties: {
      RespectFilteringEnabled: true,
    },
  };
}

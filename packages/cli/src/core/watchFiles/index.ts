import { WatchEvent, WatchType } from '@/types/cubixConfig';
import { getCubixConfig } from '@core/buildProject/getCubixConfig';
import BuildProject from '@core/buildProject';
import { getValidatedProps } from './validatedProps';
import standardWatch from './standardWatch';
import hashWatch from './hashWatch';
import debounceWatch from './debounceWatch';
import * as p from '@clack/prompts';
import color from 'picocolors';
import RojoServer from '@core/rojoServer';

export interface WatchFilesProps {
  path: string;
  extensions: string[];
  exclude: string[];
  server: boolean;
  type: string;
  events: string[];
  debounceTime: number;
}

const icones = {
  debounce: '⏳',
  hash: '🔒',
  standard: '🔄',
};

export default async function WatchFiles(props: WatchFilesProps) {
  const validatedProps = await getValidatedProps(props);
  const overridedProps = await getOverridedProps(validatedProps);
  const cubixConfig = await getCubixConfig();

  const typeIcon = icones[overridedProps.type as keyof typeof icones];

  p.intro(color.bgGreen(`[${typeIcon} ${overridedProps.type}] 👀 Watching for changes in ${color.bgBlue(`[📂 ${color.white(overridedProps.path)}] `)}`));

  const buildSuccess = await BuildProject();

  if (overridedProps.server && buildSuccess) {
    p.log.info(`${color.bold('🚀 Starting Rojo Server...')}`);
    const { ip, port: finalPort } = await RojoServer(cubixConfig.outDir);

    p.log.success(`📡 Rojo Server initialized on: ${color.bold(ip)}:${color.bold(finalPort)}`);
    p.note(`You can access the server monitoring page at: ${color.bold(color.underline(`http://${ip}:${finalPort}/`))}`);
  } else {
    p.log.success('🚀 Project compiled successfully');
  }

  switch (overridedProps.type) {
    case WatchType.Standard:
      standardWatch(overridedProps, performAction);
      break;
    case WatchType.Hash:
      hashWatch(overridedProps, performAction);
      break;
    case WatchType.Debounce:
      debounceWatch(overridedProps, performAction);
      break;
  }
}

async function getOverridedProps(props: WatchFilesProps): Promise<WatchFilesProps> {
  const cubixConfig = await getCubixConfig();

  const path = cubixConfig.rootDir || props.path;
  const type = cubixConfig.watch?.type || props.type || WatchType.Standard;
  const events = cubixConfig.watch?.events || props.events || [WatchEvent.All];
  const extensions = cubixConfig.watch?.extensions || (props.extensions.length === 0 ? ['ts', 'js'] : props.extensions);
  const exclude = cubixConfig.watch?.exclude || (props.exclude.length === 0 ? ['node_modules', 'dist', cubixConfig.outDir] : props.exclude);
  const debounceTime = cubixConfig.watch?.debounceTime || props.debounceTime || 1000;

  return {
    path,
    type,
    events,
    extensions,
    exclude,
    debounceTime,
    server: props.server,
  } as WatchFilesProps;
}

async function performAction(event: string, filePath: string) {
  p.log.info(color.green(`📝 File ${event}: ${color.bold(color.underline(filePath))}`));
  await BuildProject(false);
}

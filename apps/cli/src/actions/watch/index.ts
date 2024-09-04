import WatchFiles, { type WatchFilesProps } from '@core/watchFiles';

export default async function WatchAction(props: WatchFilesProps) {
  await WatchFiles(props);
}

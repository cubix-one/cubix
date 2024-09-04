import RojoServer from '@core/rojoServer';
import * as p from '@clack/prompts';
import color from 'picocolors';

export default async function ServeAction(projectPath: string, port: number, address: string) {
  p.intro(`${color.inverse('🚀 Starting Rojo Server...')}`);
  const { ip, port: finalPort } = await RojoServer(projectPath, port, address);

  p.log.success(`📡 Rojo Server initialized on: ${color.bold(ip)}:${color.bold(finalPort)}`);
  p.note(`You can access the server monitoring page at: ${color.bold(color.underline(`http://${ip}:${finalPort}/`))}`);
}

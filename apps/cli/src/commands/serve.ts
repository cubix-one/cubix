import { Command } from 'commander';
import color from 'picocolors';
import ServeAction from '@actions/serve';

const description = `
\u250C ${color.bgBlack(color.bold('📡 Start Rojo Server'))}
\u251C ${color.bold('This command will:')}
\u2514 ${color.blue('Start Rojo Server')}
`;

const serveCommand = new Command('serve')
  .option('-p, --port <port>', 'The port to run the server on\nIf no port is provided, the default port will be 34872.')
  .option('-a, --address <address>', 'The IP address to listen on. Defaults to `127.0.0.1`')
  .argument('[projectPath]', 'The path to the project\nIf no path is provided, the [cubix.config.json]\n outDir directory will be used.')
  .description(description)
  .action(ServeAction);

export default serveCommand;

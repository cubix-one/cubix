import { Command } from 'commander';
import color from 'picocolors';
import WatchAction from '@actions/watch';

const description = `
\u250C ${color.bgBlack(color.bold('👀 Watch changes in the project'))}
\u251C ${color.bold('This command will:')}
\u251C ${color.blue('Watch changes in the project')}
\u251C ${color.blue('Automatically build the project')}
\u2514 ${color.blue('Automatically run Rojo server')}
`;

const watchCommand = new Command('watch')
  .option('-p --path <path>', 'Path to the project, default is cubix outDir')
  .option('-e --extensions <extensions>', 'Extensions to watch. Ex: -e ts,lua,json')
  .option('-x --exclude <exclude>', 'Exclude paths. Ex: -x node_modules,dist')
  .option('-s --server', 'Start Rojo server parallel to watch changes server')
  .option('-t --type <type>', 'Type of watch to be used. Options: [standard, hash, debounce], default is standard')
  .option('-v --events <events>', 'Events to watch. Options: [all, add, change, unlink], default is change')
  .option<number>('-d --debounceTime <debounceTime>', 'Debounce time in milliseconds, default is 1000', Number)
  .description(description)
  .action(WatchAction);

export default watchCommand;

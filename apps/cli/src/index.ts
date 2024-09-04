import { Command } from 'commander';
import initCommand from '@commands/init';
import buildCommand from '@commands/build';
import watchCommand from '@commands/watch';

import color from 'picocolors';
import serveCommand from './commands/serve';

const program = new Command();

const { version } = require('../package.json');

const description = `
\u250C ${color.bgBlack(color.bold('🧊 Cubix CLI 🧊'))}
\u251C ${color.bold('In this CLI you can:')}
\u251C ${color.blue('🚀 Initialize a new project')}
\u251C ${color.blue('🔨 Build the project')}
\u251C ${color.blue('📡 Start a Rojo Server')}
\u2514 ${color.blue('👀 Watch changes in the project with auto build')}
`;

program.name('cubix').version(version).description(description);

program.addCommand(initCommand);
program.addCommand(buildCommand);
program.addCommand(watchCommand);
program.addCommand(serveCommand);

program.parse(process.argv);

import { Command } from 'commander';
import color from 'picocolors'


const description = `
\u250C ${color.bgBlack(color.bold('🚀 Initialize a new project'))}
\u251C ${color.bold('This command will:')}
\u251C ${color.blue('Download the base template from GitHub')}
\u251C ${color.blue('Set up the project')}
\u2514 ${color.blue('Install dependencies')}
`;

const initCommand = new Command('init')
  .description(description)
  .action(() => {
    console.log('init');
  });

export default initCommand;
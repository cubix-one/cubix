import { Command } from 'commander';
import color from 'picocolors';
import InitAction from '@actions/init';

const description = `
\u250C ${color.bgBlack(color.bold('🚀 Initialize a new project'))}
\u251C ${color.bold('This command will:')}
\u251C ${color.blue('Download the base template from GitHub')}
\u251C ${color.blue('Set up the project')}
\u2514 ${color.blue('Install dependencies')}
`;

const initCommand = new Command('init')
  .argument('[projectName]', 'The name of the project')
  .description(description)
  .action((projectName: string) => {
    InitAction(projectName);
  });

export default initCommand;

import { Command } from 'commander';
import color from 'picocolors'

const description = `
\u250C ${color.bgBlack(color.bold('👀 Watch changes in the project'))}
\u251C ${color.bold('This command will:')}
\u251C ${color.blue('Watch changes in the project')}
\u2514 ${color.blue('Automatically build the project')}
`;

const watchCommand = new Command('watch')
  .description(description)
  .action(() => {
    console.log('watch');
  });

export default watchCommand;
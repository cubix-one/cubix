import { Command } from 'commander';
import color from 'picocolors';

const description = `
\u250C ${color.bgBlack(color.bold('🔨 Build the project'))}
\u251C ${color.bold('This command will:')}
\u251C ${color.blue('Build the project')}
\u2514 ${color.blue('The project output will be in the output configured folder')}
`;

const buildCommand = new Command('build').description(description).action(() => {
  console.log('build');
});

export default buildCommand;

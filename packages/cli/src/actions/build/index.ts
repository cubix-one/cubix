import * as p from '@clack/prompts';
import color from 'picocolors';
import BuildProject from '@core/buildProject';
import { getCubixConfig } from '@core/buildProject/getCubixConfig';

export default async function BuildAction() {
  const cubixConfig = await getCubixConfig();
  p.intro(color.inverse('⏳ Building project...'));
  await BuildProject();
  p.log.success('📦 Project compiled successfully!');
  p.note(`🎉 Project compiled successfully in your ${color.underline(cubixConfig.outDir)} folder`);
}

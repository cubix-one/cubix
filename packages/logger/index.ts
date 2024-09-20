import * as p from '@clack/prompts';
import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';
import { start } from 'src/formats/start';
import { createAnimatedGradientText, createGradientText, interpolateColor } from './src/utils';

// Exemplo de uso:
console.log('Logs anteriores...');

const animText = createAnimatedGradientText(' 🧊 Cubix One ', { arrayColors: ['#3498db', '#ea00fe', '#3498db', '#ffffff'], fps: 30, useBG: false });
animText.start();

// Simula logs adicionais aparecendo depois
setTimeout(() => {
  console.log('Novo log aparecendo...');
}, 2000);

setTimeout(() => {
  console.log('Mais um log...');
  const animText2 = createAnimatedGradientText(' 🧊 Cubix Two', { arrayColors: ['#3498db', '#ea00fe', '#3498db', '#ffffff'], fps: 30, useBG: false });
  animText2.start();
}, 4000);

// Para a animação após 10 segundos
setTimeout(() => {
  //stopAnimation();
  console.log('Animação parada.');
}, 10000);

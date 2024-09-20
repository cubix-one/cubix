import chalk from 'chalk';
import * as emoji from 'node-emoji';

interface AnimatedGradientText {
  start: () => void;
  stop: () => void;
}

interface GradientProps {
  arrayColors: string[];
  useBG?: boolean;
  fps?: number;
}

const smallSymbols: { [key: string]: string } = {
  a: 'ᵃ',
  b: 'ᵇ',
  c: 'ᶜ',
  d: 'ᵈ',
  e: 'ᵉ',
  f: 'ᶠ',
  g: 'ᵍ',
  h: 'ʰ',
  i: 'ⁱ',
  j: 'ʲ',
  k: 'ᵏ',
  l: 'ˡ',
  m: 'ᵐ',
  n: 'ⁿ',
  o: 'ᵒ',
  p: 'ᵖ',
  q: 'q',
  r: 'ʳ',
  s: 'ˢ',
  t: 'ᵗ',
  u: 'ᵘ',
  v: 'ᵛ',
  w: 'ʷ',
  x: 'ˣ',
  y: 'ʸ',
  z: 'ᶻ',
  A: 'ᴬ',
  B: 'ᴮ',
  C: 'ᶜ',
  D: 'ᴰ',
  E: 'ᴱ',
  F: 'ᶠ',
  G: 'ᴳ',
  H: 'ᴴ',
  I: 'ᴵ',
  J: 'ᴶ',
  K: 'ᴷ',
  L: 'ᴸ',
  M: 'ᴹ',
  N: 'ᴺ',
  O: 'ᴼ',
  P: 'ᴾ',
  Q: 'Q',
  R: 'ᴿ',
  S: 'ˢ',
  T: 'ᵀ',
  U: 'ᵁ',
  V: 'ⱽ',
  W: 'ᵂ',
  X: 'ˣ',
  Y: 'ʸ',
  Z: 'ᶻ',
  ' ': ' ',
};

export function textToSmall(text: string): string {
  return text
    .split('')
    .map((char) => smallSymbols[char] || char)
    .join('');
}

export function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = Number.parseInt(color1.slice(1, 3), 16);
  const g1 = Number.parseInt(color1.slice(3, 5), 16);
  const b1 = Number.parseInt(color1.slice(5, 7), 16);

  const r2 = Number.parseInt(color2.slice(1, 3), 16);
  const g2 = Number.parseInt(color2.slice(3, 5), 16);
  const b2 = Number.parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function createGradientText(text: string, props: GradientProps): string {
  const { arrayColors, useBG = false } = props;
  const emojiText = emoji.emojify(text);

  return Array.from(emojiText)
    .map((char, index) => {
      const progress = index / (emojiText.length - 1);
      const colorIndex = Math.floor(progress * (arrayColors.length - 1));
      const colorProgress = (progress * (arrayColors.length - 1)) % 1;

      const color = interpolateColor(arrayColors[colorIndex], arrayColors[colorIndex + 1] || arrayColors[colorIndex], colorProgress);

      return useBG ? chalk.bgHex(color)(char) : chalk.hex(color)(char);
    })
    .join('');
}

export function createAnimatedGradientText(text: string, props: GradientProps): AnimatedGradientText {
  const { arrayColors, useBG = false, fps = 30 } = props;
  let progress = 0;
  let logPosition = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let isRunning = false;

  const animate = () => {
    const gradientColors = arrayColors.map((_, index) => {
      const colorIndex = (index + Math.floor(progress * arrayColors.length)) % arrayColors.length;
      const nextColorIndex = (colorIndex + 1) % arrayColors.length;
      const interpolationFactor = (progress * arrayColors.length) % 1;
      return interpolateColor(arrayColors[colorIndex], arrayColors[nextColorIndex], interpolationFactor);
    });

    const gradientText = createGradientText(text, { arrayColors: gradientColors, useBG });

    process.stdout.write(`\x1B[${logPosition}A\x1B[2K\r${gradientText}\x1B[${logPosition}B\r`);

    progress = (progress + 0.01) % 1;
  };

  const updateLogPosition = () => {
    if (isRunning) {
      logPosition++;
    }
  };

  const originalConsoleLog = console.log;

  const start = () => {
    if (isRunning) return;

    isRunning = true;
    console.log(createGradientText(text, { arrayColors, useBG }));
    logPosition = 1;

    console.log = (...args) => {
      updateLogPosition();
      originalConsoleLog(...args);
    };

    intervalId = setInterval(animate, 1000 / fps);
  };

  const stop = () => {
    if (!isRunning) return;

    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    console.log = originalConsoleLog;

    // Opcional: imprimir uma versão estática do texto ao parar a animação
    console.log(createGradientText(text, { arrayColors, useBG }));
  };

  return { start, stop };
}

import isUnicodeSupported from 'is-unicode-supported';
import chalk from 'chalk';

const unicode = isUnicodeSupported();
const s = (c: string, fallback: string) => (unicode ? c : fallback);

export const STEP_SYMBOLS = {
  S_STEP_ACTIVE: s('◆', '*'),
  S_STEP_CANCEL: s('■', 'x'),
  S_STEP_ERROR: s('▲', 'x'),
  S_STEP_SUBMIT: s('◇', 'o'),
};

export const BOX_SYMBOLS = {
  ROUNDED: {
    S_CORNER_TOP_RIGHT: s('╮', '+'),
    S_CORNER_TOP_LEFT: s('╭', '+'),
    S_CORNER_BOTTOM_RIGHT: s('╯', '+'),
    S_CORNER_BOTTOM_LEFT: s('╰', '+'),
    S_HORIZONTAL_LINE: s('─', '-'),
    S_VERTICAL_LINE: s('│', '|'),
    S_VERTICAL_LINE_LEFT: s('├', '|'),
    S_VERTICAL_LINE_RIGHT: s('┤', '|'),
  },
};

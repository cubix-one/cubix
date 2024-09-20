import { BOX_SYMBOLS } from '../symbols';

export interface StartOptions {
  subTitle?: string;
}

export function start(title: string, options: StartOptions = {}) {
  let width = title.length + 4;
  if (options.subTitle && options.subTitle.length > title.length) {
    width = options.subTitle.length + 4;
  }
  const lines = [];
  const B_T_LEFT = BOX_SYMBOLS.ROUNDED.S_CORNER_TOP_LEFT;
  const B_T_RIGHT = BOX_SYMBOLS.ROUNDED.S_CORNER_TOP_RIGHT;
  const B_H_LINE = BOX_SYMBOLS.ROUNDED.S_HORIZONTAL_LINE;
  const B_V_LINE_LEFT = BOX_SYMBOLS.ROUNDED.S_VERTICAL_LINE_LEFT;
  const B_V_LINE_RIGHT = BOX_SYMBOLS.ROUNDED.S_VERTICAL_LINE_RIGHT;
  const B_B_LEFT = BOX_SYMBOLS.ROUNDED.S_CORNER_BOTTOM_LEFT;
  const B_B_RIGHT = BOX_SYMBOLS.ROUNDED.S_CORNER_BOTTOM_RIGHT;

  const topLine = B_T_LEFT + B_H_LINE.repeat(width - 2) + B_T_RIGHT;
  const bottomLine = B_B_LEFT + B_H_LINE.repeat(width - 2) + B_B_RIGHT;

  const titleLineLeft = `${B_V_LINE_LEFT} ${title}`;
  const titleLineRight = `${' '.repeat(topLine.length - title.length - 4)} ${B_V_LINE_RIGHT}`;
  const titleLine = titleLineLeft + titleLineRight;

  if (options.subTitle) {
    const subTitleLineLeft = `${B_V_LINE_LEFT} ${options.subTitle}`;
    const subTitleLineRight = `${' '.repeat(topLine.length - options.subTitle?.length - 4)} ${B_V_LINE_RIGHT}`;
    const subTitleLine = subTitleLineLeft + subTitleLineRight;

    lines.push(topLine);
    lines.push(titleLine);
    lines.push(subTitleLine);
    lines.push(bottomLine);
  } else {
    lines.push(topLine);
    lines.push(titleLine);
    lines.push(bottomLine);
  }

  console.log(lines.join('\n'));
}

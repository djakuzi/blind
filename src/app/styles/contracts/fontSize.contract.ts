export const FONT_SIZE_TOKENS = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
] as const;

export type tFontSizeToken = (typeof FONT_SIZE_TOKENS)[number];

export type tFontSizeValue =
  | tFontSizeToken
  | `var(--${string})`
  | `${number}px`
  | `${number}rem`
  | `${number}em`
  | `${number}%`
  | `calc(${string})`
  | 'inherit'
  | 'initial'
  | 'unset'
  | (string & {});

const FONT_SIZE_TOKEN_SET = new Set<string>(FONT_SIZE_TOKENS);

export function isFontSizeToken(value: string): value is tFontSizeToken {
  return FONT_SIZE_TOKEN_SET.has(value);
}

export function fontSizeTokenVar(token: tFontSizeToken): `var(--app-font-size-${tFontSizeToken})` {
  return `var(--app-font-size-${token})`;
}

export function resolveFontSizeValue(fontSize?: tFontSizeValue) {
  if (!fontSize) {
    return undefined;
  }

  return isFontSizeToken(fontSize) ? fontSizeTokenVar(fontSize) : fontSize;
}

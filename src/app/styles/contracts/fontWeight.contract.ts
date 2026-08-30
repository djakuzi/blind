export const FONT_WEIGHT_TOKENS = [
  'regular',
  'medium',
  'semibold',
  'bold',
] as const;

export type tFontWeightToken = (typeof FONT_WEIGHT_TOKENS)[number];

export type tFontWeightValue =
  | tFontWeightToken
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 'normal'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | 'inherit'
  | 'initial'
  | 'unset';

const FONT_WEIGHT_TOKEN_SET = new Set<string>(FONT_WEIGHT_TOKENS);

export function isFontWeightToken(value: string): value is tFontWeightToken {
  return FONT_WEIGHT_TOKEN_SET.has(value);
}

export function fontWeightTokenVar(token: tFontWeightToken): `var(--app-font-weight-${tFontWeightToken})` {
  return `var(--app-font-weight-${token})`;
}

export function resolveFontWeightValue(fontWeight?: tFontWeightValue) {
  if (!fontWeight) {
    return undefined;
  }

  return typeof fontWeight === 'string' && isFontWeightToken(fontWeight)
    ? fontWeightTokenVar(fontWeight)
    : fontWeight;
}

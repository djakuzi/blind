export const PADDING_TOKENS = [0, 1, 2, 3, 4, 5, 6] as const;

export type tPaddingToken = (typeof PADDING_TOKENS)[number];

export type tPaddingValue =
  | tPaddingToken
  | `var(--${string})`
  | `${number}px`
  | `${number}rem`
  | `${number}%`
  | `calc(${string})`
  | 'inherit'
  | 'initial'
  | 'unset'
  | (string & {});

const PADDING_TOKEN_SET = new Set<number>(PADDING_TOKENS);

export function isPaddingToken(value: number): value is tPaddingToken {
  return PADDING_TOKEN_SET.has(value);
}

export function paddingTokenVar(token: tPaddingToken): `var(--app-padding-${tPaddingToken})` {
  return `var(--app-padding-${token})`;
}

export function resolvePaddingValue(padding?: tPaddingValue) {
  if (padding === undefined || padding === null) {
    return undefined;
  }

  return typeof padding === 'number' && isPaddingToken(padding)
    ? paddingTokenVar(padding)
    : padding;
}

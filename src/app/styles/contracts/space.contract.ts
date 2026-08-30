export const SPACE_TOKENS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  10,
  12,
  14,
  16,
  20,
  24,
] as const;

export type tSpaceToken = (typeof SPACE_TOKENS)[number];

export type tSpaceValue =
  | tSpaceToken
  | `var(--${string})`
  | `${number}px`
  | `${number}rem`
  | `${number}%`
  | `calc(${string})`
  | 'auto'
  | 'inherit'
  | 'initial'
  | 'unset'
  | (string & {});

const SPACE_TOKEN_SET = new Set<number>(SPACE_TOKENS);

export function isSpaceToken(value: number): value is tSpaceToken {
  return SPACE_TOKEN_SET.has(value);
}

export function spaceTokenVar(token: tSpaceToken): `var(--app-space-${tSpaceToken})` {
  return `var(--app-space-${token})`;
}

export function resolveSpaceValue(space?: tSpaceValue) {
  if (space === undefined || space === null) {
    return undefined;
  }

  return typeof space === 'number' && isSpaceToken(space) ? spaceTokenVar(space) : space;
}

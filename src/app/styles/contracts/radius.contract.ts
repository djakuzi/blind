export const RADIUS_TOKENS = [
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'full',
] as const;

export type tRadiusToken = (typeof RADIUS_TOKENS)[number];

export type tRadiusValue =
  | tRadiusToken
  | `var(--${string})`
  | `${number}px`
  | `${number}rem`
  | `${number}%`
  | `calc(${string})`
  | 'inherit'
  | 'initial'
  | 'unset'
  | (string & {});

const RADIUS_TOKEN_SET = new Set<string>(RADIUS_TOKENS);

export function isRadiusToken(value: string): value is tRadiusToken {
  return RADIUS_TOKEN_SET.has(value);
}

export function radiusTokenVar(token: tRadiusToken): `var(--app-radius-${tRadiusToken})` {
  return `var(--app-radius-${token})`;
}

export function resolveRadiusValue(radius?: tRadiusValue) {
  if (!radius) {
    return undefined;
  }

  return isRadiusToken(radius) ? radiusTokenVar(radius) : radius;
}

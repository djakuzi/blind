export const BRAND_COLOR_TOKENS = [
  'primary',
  'primary-hover',
  'primary-pressed',
  'on-primary',
  'success',
  'warning',
  'error',
  'info',
] as const;

export const SURFACE_COLOR_TOKENS = [
  'background',
  'surface-primary',
  'surface-secondary',
  'surface-elevated',
  'surface-interactive',
] as const;

export const BORDER_COLOR_TOKENS = [
  'border-subtle',
  'border-default',
  'border-strong',
] as const;

export const TEXT_COLOR_TOKENS = [
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-disabled',
] as const;

export const ICON_COLOR_TOKENS = [
  'icon-primary',
  'icon-secondary',
  'icon-muted',
  'icon-disabled',
  'icon-accent',
] as const;

export const STATUS_COLOR_TOKENS = [
  'success-text',
  'success-background',
  'warning-text',
  'warning-background',
  'error-text',
  'error-background',
  'info-text',
  'info-background',
] as const;

export const COLOR_TOKENS = [
  ...BRAND_COLOR_TOKENS,
  ...SURFACE_COLOR_TOKENS,
  ...BORDER_COLOR_TOKENS,
  ...TEXT_COLOR_TOKENS,
  ...ICON_COLOR_TOKENS,
  ...STATUS_COLOR_TOKENS,
] as const;

export type tBrandColorToken = (typeof BRAND_COLOR_TOKENS)[number];
export type tSurfaceColorToken = (typeof SURFACE_COLOR_TOKENS)[number];
export type tBorderColorToken = (typeof BORDER_COLOR_TOKENS)[number];
export type tTextColorToken = (typeof TEXT_COLOR_TOKENS)[number];
export type tIconColorToken = (typeof ICON_COLOR_TOKENS)[number];
export type tStatusColorToken = (typeof STATUS_COLOR_TOKENS)[number];

export type tColorToken =
  | tBrandColorToken
  | tSurfaceColorToken
  | tBorderColorToken
  | tTextColorToken
  | tIconColorToken
  | tStatusColorToken;

export type tColorValue =
  | tColorToken
  | `var(--${string})`
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`
  | `color-mix(${string})`
  | 'currentColor'
  | 'transparent'
  | 'inherit'
  | 'initial'
  | 'unset'
  | (string & {});

const COLOR_TOKEN_SET = new Set<string>(COLOR_TOKENS);

export function isColorToken(value: string): value is tColorToken {
  return COLOR_TOKEN_SET.has(value);
}

export function colorTokenVar(token: tColorToken): `var(--app-color-${tColorToken})` {
  return `var(--app-color-${token})`;
}

export function resolveColorValue(color?: tColorValue) {
  if (!color) {
    return undefined;
  }

  return isColorToken(color) ? colorTokenVar(color) : color;
}

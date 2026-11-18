export const LINE_HEIGHT_TOKENS = ['tight', 'display', 'heading', 'control', 'body', 'relaxed'] as const;

export type tLineHeightValue = (typeof LINE_HEIGHT_TOKENS)[number];

export function resolveLineHeightValue(value: tLineHeightValue) {
  return `var(--app-line-height-${value})`;
}

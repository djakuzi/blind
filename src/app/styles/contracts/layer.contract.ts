export const LAYER_TOKENS = [
  'base',
  'raised',
  'sticky',
  'overlay',
  'modal',
  'toast',
] as const;

export type tLayerToken = (typeof LAYER_TOKENS)[number];

export type tLayerValue =
  | tLayerToken
  | `var(--${string})`
  | number
  | `${number}`
  | 'auto'
  | 'inherit'
  | 'initial'
  | 'unset'
  | (string & {});

const LAYER_TOKENS_SET = new Set<string>(LAYER_TOKENS);

export function isLayerToken(value: string): value is tLayerToken {
  return LAYER_TOKENS_SET.has(value);
}

export function layerTokenVar(token: tLayerToken): `var(--app-layer-${tLayerToken})` {
  return `var(--app-layer-${token})`;
}

export function resolveLayerValue(value?: tLayerValue) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'string' && isLayerToken(value) ? layerTokenVar(value) : value;
}

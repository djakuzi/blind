import type { tAdapterRegistry } from './type';

export function resolveAdapter<TKey extends string, TAdapter>(
  adapters: tAdapterRegistry<TKey, TAdapter>,
  key: TKey,
): TAdapter {
  return adapters[key];
}

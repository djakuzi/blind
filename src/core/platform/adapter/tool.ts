import type { iAdapterResolverOptions, tAdapterRegistry } from './type';

export function resolveAdapter<TKey extends string, TAdapter>(
  adapters: tAdapterRegistry<TKey, TAdapter>,
  key: TKey,
): TAdapter {
  const adapter = adapters[key];

  if (adapter === undefined) {
    throw new Error(`Adapter is not registered for key: ${key}`);
  }

  return adapter;
}

export function createAdapterResolver<TKey extends string, TAdapter>(
  options: iAdapterResolverOptions<TKey, TAdapter>,
) {
  return () => resolveAdapter(options.adapters, options.getKey());
}

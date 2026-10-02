export type tAdapterRegistry<TKey extends string, TAdapter> = Partial<Record<TKey, TAdapter>>;

export interface iAdapterResolverOptions<TKey extends string, TAdapter> {
  getKey: () => TKey;
  adapters: tAdapterRegistry<TKey, TAdapter>;
}

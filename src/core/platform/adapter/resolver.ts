import { PlatformRuntime } from '../runtime';
import type { tAppRuntime } from '../runtime';
import type { tAdapterRegistry } from './type';

export function resolveAdapter<TKey extends string, TAdapter>(
  adapters: tAdapterRegistry<TKey, TAdapter>,
  key: TKey,
): TAdapter {
  return adapters[key];
}

export function resolveRuntimeAdapter<TAdapter>(
  adapters: tAdapterRegistry<tAppRuntime, TAdapter>,
): TAdapter {
  return resolveAdapter(adapters, PlatformRuntime.getRuntime());
}

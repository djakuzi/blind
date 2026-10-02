import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopStorageAdapter } from './adapters/desktop.adapter';
import { MobileStorageAdapter } from './adapters/mobile.adapter';
import { WebStorageAdapter } from './adapters/web.adapter';
import { HelperCache } from './helpers/cache.helper';
import type { iTimedStorageEntry } from './type';

export type { iStorageAdapter, iStorageValue, iTimedStorageEntry } from './type';

const StorageAdapter = resolveAdapter(
  {
    web: WebStorageAdapter,
    mobile: MobileStorageAdapter,
    desktop: DesktopStorageAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  setItem,
  getItem,
  removeItem,
} = StorageAdapter;

export async function setJson<T>(key: string, value: T) {
  const data = JSON.stringify(value);

  if (data === undefined) {
    throw new Error('Storage value is not JSON serializable');
  }

  await setItem(key, data);
}

export async function getJson<T>(key: string) {
  const { value } = await getItem(key);

  if (value === null) {
    return {
      value: null,
    };
  }

  return {
    value: JSON.parse(value) as T,
  };
}

export async function loadTimedJsonCache<T>(key: string, ttlMs: number) {
  const { value } = await getJson<unknown>(key);

  if (!HelperCache.isTimedStorageEntry<T>(value) || Date.now() - value.timestamp > ttlMs) {
    await removeItem(key);

    return {
      value: null,
    };
  }

  return {
    value: value.value,
  };
}

export async function saveTimedJsonCache<T>(key: string, value: T) {
  await setJson<iTimedStorageEntry<T>>(key, {
    timestamp: Date.now(),
    value,
  });
}

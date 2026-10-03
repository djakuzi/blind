import { HelperCache } from './helpers/cache.helper';
import type { iStorageAdapter, iTimedStorageEntry } from './type';

export function createStorageService(adapter: iStorageAdapter) {
  const {
    setItem,
    getItem,
    removeItem,
  } = adapter;

  async function setJson<T>(key: string, value: T) {
    const data = JSON.stringify(value);

    if (data === undefined) {
      throw new Error('Storage value is not JSON serializable');
    }

    await setItem(key, data);
  }

  async function getJson<T>(key: string) {
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

  async function loadTimedJsonCache<T>(key: string, ttlMs: number) {
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

  async function saveTimedJsonCache<T>(key: string, value: T) {
    await setJson<iTimedStorageEntry<T>>(key, {
      timestamp: Date.now(),
      value,
    });
  }

  return {
    setItem,
    getItem,
    removeItem,
    setJson,
    getJson,
    loadTimedJsonCache,
    saveTimedJsonCache,
  };
}

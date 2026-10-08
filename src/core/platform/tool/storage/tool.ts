import { HelperJson } from '../../runtime/shared/helpers/json.helper';
import { HelperCache } from './helpers/cache.helper';
import type { iStorageAdapter, iTimedStorageEntry } from './type';

function validateKey(key: string) {
  if (!key) {
    throw new Error('Storage key is required');
  }
}

export function createStorageTool(adapter: iStorageAdapter) {
  async function setItem(key: string, value: string) {
    validateKey(key);
    await adapter.setItem(key, value);
  }

  async function getItem(key: string) {
    validateKey(key);

    return adapter.getItem(key);
  }

  async function removeItem(key: string) {
    validateKey(key);
    await adapter.removeItem(key);
  }

  async function setJson<T>(key: string, value: T) {
    await setItem(key, HelperJson.serialize(value));
  }

  async function getJson<T>(key: string) {
    const { value } = await getItem(key);

    if (value === null) {
      return {
        value: null,
      };
    }

    return {
      value: HelperJson.parse<T>(value),
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

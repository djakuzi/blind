import { Preferences } from '@capacitor/preferences'

export interface TimedStorageEntry<T> {
  timestamp: number
  value: T
}

const helpers = {
    isTimedStorageEntry: function <T>(value: unknown): value is TimedStorageEntry<T> {
        if (!value || typeof value !== 'object') {
        return false
        }

        const entry = value as Record<string, unknown>

        return typeof entry.timestamp === 'number' && 'value' in entry
    },
}

async function setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value })
}

async function getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key })
    return value ?? null
}

async function removeValue(key: string): Promise<void> {
    await Preferences.remove({ key })
}

async function setJson<T>(key: string, value: T): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    })
}

async function getJson<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key })

    if (!value) {
      return null
    }

    return JSON.parse(value) as T  
}

async function loadTimedJsonCache<T>(key: string, ttlMs: number): Promise<T | null> {
    const value = await getJson<unknown>(key)

    if (!helpers.isTimedStorageEntry<T>(value) || Date.now() - value.timestamp > ttlMs) {
        await removeValue(key)
        return null
    }

    return value.value
}

async function saveTimedJsonCache<T>(key: string, value: T): Promise<void> {
    await setJson<TimedStorageEntry<T>>(key, {
        timestamp: Date.now(),
        value,
    })
}

export const moduleStorage = {
  setItem,
  getItem,
  removeValue,
  setJson,
  getJson,
  loadTimedJsonCache,
  saveTimedJsonCache,
};


import { Preferences } from '@capacitor/preferences'
import type { TimedStorageEntry } from './type'
import * as helpers from './helpers'

export async function setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value })
}

export async function getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key })
    return value ?? null
}

export async function removeValue(key: string): Promise<void> {
    await Preferences.remove({ key })
}

export async function setJson<T>(key: string, value: T): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    })
}

export async function getJson<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key })

    if (!value) {
      return null
    }

    return JSON.parse(value) as T  
}

export async function loadTimedJsonCache<T>(key: string, ttlMs: number): Promise<T | null> {
    const value = await getJson<unknown>(key)

    if (!helpers.isTimedStorageEntry<T>(value) || Date.now() - value.timestamp > ttlMs) {
        await removeValue(key)
        return null
    }

    return value.value
}

export async function saveTimedJsonCache<T>(key: string, value: T): Promise<void> {
    await setJson<TimedStorageEntry<T>>(key, {
        timestamp: Date.now(),
        value,
    })
}


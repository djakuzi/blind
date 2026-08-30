import type { TimedStorageEntry } from "./type"

export function isTimedStorageEntry<T>(value: unknown): value is TimedStorageEntry<T> {
    if (!value || typeof value !== 'object') {
        return false
    }

    const entry = value as Record<string, unknown>

    return typeof entry.timestamp === 'number' && 'value' in entry
}
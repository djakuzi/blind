import type { iTimedStorageEntry } from '../type';

function isTimedStorageEntry<T>(value: unknown): value is iTimedStorageEntry<T> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return typeof entry.timestamp === 'number' && 'value' in entry;
}

export const HelperCache = {
  isTimedStorageEntry,
};

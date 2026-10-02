import type { iPlatformValue } from '../../type';

export interface iStorageAdapter {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<iPlatformValue<string | null>>;
  removeItem(key: string): Promise<void>;
}

export interface iTimedStorageEntry<T> {
  timestamp: number;
  value: T;
}

export interface iStorageValue<T> {
  value: T | null;
}

export interface iStorageAdapter {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<iStorageValue<string>>;
  removeItem(key: string): Promise<void>;
}

export interface iTimedStorageEntry<T> {
  timestamp: number;
  value: T;
}

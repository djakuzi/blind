export interface iElectronStorageValue {
  value: string | null;
}

export interface iElectronStoragePlugin {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<iElectronStorageValue>;
  removeItem(key: string): Promise<void>;
}

export interface iElectronFilesystemValue {
  value: string | null;
}

export interface iElectronFilesystemPlugin {
  writeFile(path: string, data: string): Promise<void>;
  readFile(path: string): Promise<iElectronFilesystemValue>;
  removeFile(path: string): Promise<void>;
}

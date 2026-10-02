export interface iFilesystemValue<T> {
  value: T | null;
}

export interface iFilesystemAdapter {
  writeFile(path: string, data: string): Promise<void>;
  readFile(path: string): Promise<iFilesystemValue<string>>;
  removeFile(path: string): Promise<void>;
}

import type { iPlatformValue } from '../../type';

export interface iFilesystemAdapter {
  writeFile(path: string, data: string): Promise<void>;
  readFile(path: string): Promise<iPlatformValue<string | null>>;
  removeFile(path: string): Promise<void>;
}

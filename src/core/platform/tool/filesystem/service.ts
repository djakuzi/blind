import { HelperPath } from './helpers/path.helper';
import type { iFilesystemAdapter } from './type';

export function createFilesystemService(adapter: iFilesystemAdapter) {
  async function setJson<T>(path: string, value: T) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);
    const data = JSON.stringify(value);

    if (data === undefined) {
      throw new Error('Filesystem value is not JSON serializable');
    }

    await adapter.writeFile(normalizedPath, data);
  }

  async function getJson<T>(path: string) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    try {
      const { value } = await adapter.readFile(normalizedPath);

      if (value === null) {
        return { value: null };
      }

      return { value: JSON.parse(value) as T };
    } catch {
      return { value: null };
    }
  }

  async function remove(path: string) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    try {
      await adapter.removeFile(normalizedPath);
    } catch {
      return;
    }
  }

  return { setJson, getJson, remove };
}

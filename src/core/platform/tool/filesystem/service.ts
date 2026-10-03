import { HelperPath } from './helpers/path.helper';
import type { iFilesystemAdapter } from './type';

export function createFilesystemService(adapter: iFilesystemAdapter) {
  function normalizePath(path: string) {
    return HelperPath.normalizePath(path).path;
  }

  async function setJson<T>(path: string, value: T) {
    const data = JSON.stringify(value);

    if (data === undefined) {
      throw new Error('Filesystem value is not JSON serializable');
    }

    await adapter.writeFile(normalizePath(path), data);
  }

  async function getJson<T>(path: string) {
    try {
      const { value } = await adapter.readFile(normalizePath(path));

      if (value === null) {
        return { value: null };
      }

      return { value: JSON.parse(value) as T };
    } catch {
      return { value: null };
    }
  }

  async function remove(path: string) {
    try {
      await adapter.removeFile(normalizePath(path));
    } catch {
      return;
    }
  }

  return {
    setJson,
    getJson,
    remove,
  };
}

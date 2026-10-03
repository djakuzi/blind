import type { iFilesystemAdapter } from './type';

export function createFilesystemService(adapter: iFilesystemAdapter) {
  async function setJson<T>(path: string, value: T) {
    const data = JSON.stringify(value);

    if (data === undefined) {
      throw new Error('Filesystem value is not JSON serializable');
    }

    await adapter.writeFile(path, data);
  }

  async function getJson<T>(path: string) {
    try {
      const { value } = await adapter.readFile(path);

      if (value === null) {
        return {
          value: null,
        };
      }

      return {
        value: JSON.parse(value) as T,
      };
    } catch {
      return {
        value: null,
      };
    }
  }

  async function remove(path: string) {
    try {
      await adapter.removeFile(path);
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

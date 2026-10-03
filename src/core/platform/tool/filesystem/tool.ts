import { HelperJson } from '../shared/helpers/json.helper';
import { HelperPath } from './helpers/path.helper';
import type { iFilesystemAdapter } from './type';

export function createFilesystemTool(adapter: iFilesystemAdapter) {
  function normalizePath(path: string) {
    return HelperPath.normalizePath(path).path;
  }

  async function setJson<T>(path: string, value: T) {
    await adapter.writeFile(
      normalizePath(path),
      HelperJson.serialize(value),
    );
  }

  async function getJson<T>(path: string) {
    try {
      const { value } = await adapter.readFile(normalizePath(path));

      if (value === null) {
        return {
          value: null,
        };
      }

      return {
        value: HelperJson.parse<T>(value),
      };
    } catch {
      return {
        value: null,
      };
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

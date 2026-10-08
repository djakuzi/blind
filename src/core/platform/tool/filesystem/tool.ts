import { HelperJson } from '../../runtime/shared/helpers/json.helper';
import { HelperPath } from './helpers/path.helper';
import type { iFilesystemAdapter } from './type';

export function createFilesystemTool(adapter: iFilesystemAdapter) {
  function normalizePath(path: string) {
    return HelperPath.normalizePath(path).path;
  }

  async function setJson<T>(path: string, value: T) {
    await adapter.writeFile(normalizePath(path), HelperJson.serialize(value));
  }

  async function getJson<T>(path: string) {
    const { value } = await adapter.readFile(normalizePath(path));

    if (value === null) {
      return {
        value: null,
      };
    }

    return {
      value: HelperJson.parse<T>(value),
    };
  }

  async function remove(path: string) {
    await adapter.removeFile(normalizePath(path));
  }

  return {
    setJson,
    getJson,
    remove,
  };
}

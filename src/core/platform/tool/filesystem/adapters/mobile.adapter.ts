import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { HelperPath } from '../helpers/path.helper';
import type { iFilesystemAdapter } from '../type';

export const MobileFilesystemAdapter: iFilesystemAdapter = {
  async writeFile(path, data) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    await Filesystem.writeFile({
      path: normalizedPath,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
      data,
      recursive: true,
    });
  },

  async readFile(path) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    try {
      const { data } = await Filesystem.readFile({
        path: normalizedPath,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      return {
        value: typeof data === 'string' ? data : await data.text(),
      };
    } catch {
      return {
        value: null,
      };
    }
  },

  async removeFile(path) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    try {
      await Filesystem.deleteFile({
        path: normalizedPath,
        directory: Directory.Data,
      });
    } catch {
      return;
    }
  },
};

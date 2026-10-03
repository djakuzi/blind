import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import type { iFilesystemAdapter } from '../../../tool/filesystem/type';

export const RuntimeMobileFilesystem: iFilesystemAdapter = {
  async writeFile(path, data) {
    await Filesystem.writeFile({
      path,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
      data,
      recursive: true,
    });
  },

  async readFile(path) {
    try {
      const { data } = await Filesystem.readFile({
        path,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      return {
        value: typeof data === 'string' ? data : await data.text(),
      };
    } catch {
      return { value: null };
    }
  },

  async removeFile(path) {
    try {
      await Filesystem.deleteFile({
        path,
        directory: Directory.Data,
      });
    } catch {
      return;
    }
  },
};

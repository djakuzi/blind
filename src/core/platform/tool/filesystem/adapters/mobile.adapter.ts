import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import type { iFilesystemAdapter } from '../type';

const FILE_NOT_FOUND_ERROR_CODE = 'OS-PLUG-FILE-0008';

function isFileNotFoundError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === FILE_NOT_FOUND_ERROR_CODE
  );
}

export const MobileFilesystemAdapter: iFilesystemAdapter = {
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
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return {
          value: null,
        };
      }

      throw error;
    }
  },

  async removeFile(path) {
    try {
      await Filesystem.deleteFile({
        path,
        directory: Directory.Data,
      });
    } catch (error) {
      if (!isFileNotFoundError(error)) {
        throw error;
      }
    }
  },
};

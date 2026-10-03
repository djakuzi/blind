import type { iFilesystemAdapter } from '../../../tool/filesystem/type';

function isNotFoundError(error: unknown) {
  return error instanceof DOMException && error.name === 'NotFoundError';
}

async function getRoot() {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) {
    throw new Error('Origin private filesystem is not available');
  }

  return navigator.storage.getDirectory();
}

async function getParentDirectory(path: string, create: boolean) {
  const segments = path.split('/');
  const fileName = segments.at(-1);

  if (!fileName) {
    throw new Error('Filesystem file name is missing');
  }

  let directory = await getRoot();

  for (const segment of segments.slice(0, -1)) {
    directory = await directory.getDirectoryHandle(segment, { create });
  }

  return { directory, fileName };
}

export const RuntimeWebFilesystem: iFilesystemAdapter = {
  async writeFile(path, data) {
    const { directory, fileName } = await getParentDirectory(path, true);
    const fileHandle = await directory.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();

    try {
      await writable.write(data);
    } finally {
      await writable.close();
    }
  },

  async readFile(path) {
    try {
      const { directory, fileName } = await getParentDirectory(path, false);
      const fileHandle = await directory.getFileHandle(fileName);
      const file = await fileHandle.getFile();

      return { value: await file.text() };
    } catch (error) {
      if (isNotFoundError(error)) {
        return { value: null };
      }

      throw error;
    }
  },

  async removeFile(path) {
    try {
      const { directory, fileName } = await getParentDirectory(path, false);
      await directory.removeEntry(fileName);
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }
  },
};

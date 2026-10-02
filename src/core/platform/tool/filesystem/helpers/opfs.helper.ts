import { HelperPath } from './path.helper';

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
  const { segments } = HelperPath.normalizePath(path);
  const fileName = segments.at(-1);

  if (!fileName) {
    throw new Error('Filesystem file name is missing');
  }

  let directory = await getRoot();

  for (const segment of segments.slice(0, -1)) {
    directory = await directory.getDirectoryHandle(segment, { create });
  }

  return {
    directory,
    fileName,
  };
}

async function writeFile(path: string, data: string) {
  const { directory, fileName } = await getParentDirectory(path, true);
  const fileHandle = await directory.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();

  try {
    await writable.write(data);
  } finally {
    await writable.close();
  }
}

async function readFile(path: string) {
  try {
    const { directory, fileName } = await getParentDirectory(path, false);
    const fileHandle = await directory.getFileHandle(fileName);
    const file = await fileHandle.getFile();

    return {
      value: await file.text(),
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        value: null,
      };
    }

    throw error;
  }
}

async function removeFile(path: string) {
  try {
    const { directory, fileName } = await getParentDirectory(path, false);

    await directory.removeEntry(fileName);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }
}

export const HelperOpfs = {
  writeFile,
  readFile,
  removeFile,
};

import { app, ipcMain } from 'electron';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { ELECTRON_CONFIG } from '../../config';
import { FILESYSTEM_CHANNEL } from './channel';

function getFilesystemRoot() {
  return resolve(app.getPath('userData'), ELECTRON_CONFIG.filesystem.directory);
}

function resolveFilesystemPath(path: string) {
  if (typeof path !== 'string' || !path || path.includes('\0') || isAbsolute(path)) {
    throw new Error('Invalid filesystem path');
  }

  const root = getFilesystemRoot();
  const target = resolve(root, path);
  const relativePath = relative(root, target);
  const isOutsideRoot = relativePath === '..' || relativePath.startsWith(`..${sep}`);

  if (!relativePath || isOutsideRoot || isAbsolute(relativePath)) {
    throw new Error('Filesystem path is outside application data directory');
  }

  return target;
}

function isFileNotFoundError(error: unknown) {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

export function registerFilesystemPlugin() {
  ipcMain.removeHandler(FILESYSTEM_CHANNEL.writeFile);
  ipcMain.removeHandler(FILESYSTEM_CHANNEL.readFile);
  ipcMain.removeHandler(FILESYSTEM_CHANNEL.removeFile);

  ipcMain.handle(FILESYSTEM_CHANNEL.writeFile, async (_event, path: string, data: string) => {
    if (typeof data !== 'string') {
      throw new Error('Invalid filesystem data');
    }

    const target = resolveFilesystemPath(path);

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, data, 'utf8');
  });

  ipcMain.handle(FILESYSTEM_CHANNEL.readFile, async (_event, path: string) => {
    const target = resolveFilesystemPath(path);

    try {
      return {
        value: await readFile(target, 'utf8'),
      };
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return {
          value: null,
        };
      }

      throw error;
    }
  });

  ipcMain.handle(FILESYSTEM_CHANNEL.removeFile, async (_event, path: string) => {
    const target = resolveFilesystemPath(path);

    try {
      await rm(target);
    } catch (error) {
      if (!isFileNotFoundError(error)) {
        throw error;
      }
    }
  });
}

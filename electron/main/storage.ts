import { app, ipcMain } from 'electron';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { ELECTRON_STORAGE_IPC } from '../ipc/storage.ipc';

type tStorageData = Record<string, string>;

let mutationQueue: Promise<void> = Promise.resolve();

function getStoragePath() {
  return join(app.getPath('userData'), 'storage', 'preferences.json');
}

function isFileNotFoundError(error: unknown) {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function isStorageData(value: unknown): value is tStorageData {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === 'string');
}

async function readStorage(): Promise<tStorageData> {
  try {
    const content = await readFile(getStoragePath(), 'utf8');
    const value = JSON.parse(content) as unknown;

    return isStorageData(value) ? value : {};
  } catch (error) {
    if (isFileNotFoundError(error) || error instanceof SyntaxError) {
      return {};
    }

    throw error;
  }
}

async function writeStorage(value: tStorageData) {
  const path = getStoragePath();

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value), 'utf8');
}

function enqueueMutation(action: () => Promise<void>) {
  const operation = mutationQueue.then(action);

  mutationQueue = operation.catch(() => undefined);

  return operation;
}

function validateKey(key: string) {
  if (typeof key !== 'string' || !key) {
    throw new Error('Invalid storage key');
  }
}

export function registerStorageIpc() {
  ipcMain.removeHandler(ELECTRON_STORAGE_IPC.setItem);
  ipcMain.removeHandler(ELECTRON_STORAGE_IPC.getItem);
  ipcMain.removeHandler(ELECTRON_STORAGE_IPC.removeItem);

  ipcMain.handle(ELECTRON_STORAGE_IPC.setItem, async (_event, key: string, value: string) => {
    validateKey(key);

    if (typeof value !== 'string') {
      throw new Error('Invalid storage value');
    }

    await enqueueMutation(async () => {
      const storage = await readStorage();

      storage[key] = value;

      await writeStorage(storage);
    });
  });

  ipcMain.handle(ELECTRON_STORAGE_IPC.getItem, async (_event, key: string) => {
    validateKey(key);
    await mutationQueue;

    const storage = await readStorage();

    return {
      value: storage[key] ?? null,
    };
  });

  ipcMain.handle(ELECTRON_STORAGE_IPC.removeItem, async (_event, key: string) => {
    validateKey(key);

    await enqueueMutation(async () => {
      const storage = await readStorage();

      delete storage[key];

      await writeStorage(storage);
    });
  });
}

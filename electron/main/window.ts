import { BrowserWindow } from 'electron';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CURRENT_DIRECTORY = dirname(fileURLToPath(import.meta.url));

export async function createMainWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    show: false,
    webPreferences: {
      preload: join(CURRENT_DIRECTORY, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    await window.loadURL(devServerUrl);
    return window;
  }

  await window.loadFile(join(CURRENT_DIRECTORY, '../dist/index.html'));

  return window;
}

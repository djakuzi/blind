import { app, BrowserWindow } from 'electron';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerFilesystemIpc } from './main/filesystem';
import { registerStorageIpc } from './main/storage';

const CURRENT_DIRECTORY = dirname(fileURLToPath(import.meta.url));

async function createMainWindow() {
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
    return;
  }

  await window.loadFile(join(CURRENT_DIRECTORY, '../dist/index.html'));
}

app
  .whenReady()
  .then(async () => {
    registerFilesystemIpc();
    registerStorageIpc();

    await createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow().catch((error) => {
          console.error('Failed to create Electron window:', error);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start Electron application:', error);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

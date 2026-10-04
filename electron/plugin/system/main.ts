import { app, BrowserWindow, ipcMain, screen } from 'electron';
import type { WebContents } from 'electron';
import { SYSTEM_CHANNEL } from './channel';

function getWindow(webContents: WebContents) {
  const window = BrowserWindow.fromWebContents(webContents);

  if (!window) {
    throw new Error('Electron window is not available');
  }

  return window;
}

function getSystemLanguage() {
  const [language] = app.getPreferredSystemLanguages();

  return language || app.getLocale();
}

export function registerSystemPlugin() {
  ipcMain.removeHandler(SYSTEM_CHANNEL.getLanguage);
  ipcMain.removeHandler(SYSTEM_CHANNEL.getScale);

  ipcMain.handle(SYSTEM_CHANNEL.getLanguage, () => {
    return {
      value: getSystemLanguage(),
    };
  });

  ipcMain.handle(SYSTEM_CHANNEL.getScale, (event) => {
    const window = getWindow(event.sender);
    const display = screen.getDisplayMatching(window.getBounds());

    return {
      value: display.scaleFactor,
    };
  });
}

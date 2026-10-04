import {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  screen,
} from 'electron';
import type { WebContents } from 'electron';
import { SYSTEM_CHANNEL } from './channel';
import type { tElectronSystemThemeSource } from './type';

const THEME_SOURCE_LIST = ['system', 'light', 'dark'] as const;

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

function isThemeSource(value: unknown): value is tElectronSystemThemeSource {
  return (
    typeof value === 'string' &&
    THEME_SOURCE_LIST.includes(value as tElectronSystemThemeSource)
  );
}

export function registerSystemPlugin() {
  ipcMain.removeHandler(SYSTEM_CHANNEL.getLanguage);
  ipcMain.removeHandler(SYSTEM_CHANNEL.getScale);
  ipcMain.removeHandler(SYSTEM_CHANNEL.setThemeSource);

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

  ipcMain.handle(
    SYSTEM_CHANNEL.setThemeSource,
    (_event, themeSource: unknown) => {
      if (!isThemeSource(themeSource)) {
        throw new Error('Invalid system theme source');
      }

      nativeTheme.themeSource = themeSource;
    },
  );
}

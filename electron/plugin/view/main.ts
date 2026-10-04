import { BrowserWindow, ipcMain } from 'electron';
import type { WebContents } from 'electron';
import { VIEW_CHANNEL } from './channel';

function getWindow(webContents: WebContents) {
  const window = BrowserWindow.fromWebContents(webContents);

  if (!window) {
    throw new Error('Electron window is not available');
  }

  return window;
}

async function setFullscreen(window: BrowserWindow, value: boolean) {
  if (window.isFullScreen() === value) {
    return {
      isHandled: true,
    };
  }

  await new Promise<void>((resolve) => {
    let isResolved = false;

    const finish = () => {
      if (isResolved) {
        return;
      }

      isResolved = true;
      clearTimeout(timeout);

      if (value) {
        window.removeListener('enter-full-screen', finish);
      } else {
        window.removeListener('leave-full-screen', finish);
      }

      resolve();
    };

    const timeout = setTimeout(finish, 1500);

    if (value) {
      window.once('enter-full-screen', finish);
    } else {
      window.once('leave-full-screen', finish);
    }

    window.setFullScreen(value);
  });

  return {
    isHandled: window.isFullScreen() === value,
  };
}

export function registerViewPlugin() {
  ipcMain.removeHandler(VIEW_CHANNEL.isFullscreen);
  ipcMain.removeHandler(VIEW_CHANNEL.enterFullscreen);
  ipcMain.removeHandler(VIEW_CHANNEL.exitFullscreen);

  ipcMain.handle(VIEW_CHANNEL.isFullscreen, (event) => {
    return {
      value: getWindow(event.sender).isFullScreen(),
    };
  });

  ipcMain.handle(VIEW_CHANNEL.enterFullscreen, (event) => {
    return setFullscreen(getWindow(event.sender), true);
  });

  ipcMain.handle(VIEW_CHANNEL.exitFullscreen, (event) => {
    return setFullscreen(getWindow(event.sender), false);
  });
}

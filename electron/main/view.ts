import { BrowserWindow, ipcMain } from 'electron';
import type { WebContents } from 'electron';
import { ELECTRON_VIEW_IPC } from '../ipc/view.ipc';

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

  const eventName = value ? 'enter-full-screen' : 'leave-full-screen';

  await new Promise<void>((resolve) => {
    let isResolved = false;

    const finish = () => {
      if (isResolved) {
        return;
      }

      isResolved = true;
      clearTimeout(timeout);
      window.removeListener(eventName, finish);
      resolve();
    };

    const timeout = setTimeout(finish, 1500);

    window.once(eventName, finish);
    window.setFullScreen(value);
  });

  return {
    isHandled: window.isFullScreen() === value,
  };
}

export function registerViewIpc() {
  ipcMain.removeHandler(ELECTRON_VIEW_IPC.isFullscreen);
  ipcMain.removeHandler(ELECTRON_VIEW_IPC.enterFullscreen);
  ipcMain.removeHandler(ELECTRON_VIEW_IPC.exitFullscreen);

  ipcMain.handle(ELECTRON_VIEW_IPC.isFullscreen, (event) => {
    return {
      value: getWindow(event.sender).isFullScreen(),
    };
  });

  ipcMain.handle(ELECTRON_VIEW_IPC.enterFullscreen, (event) => {
    return setFullscreen(getWindow(event.sender), true);
  });

  ipcMain.handle(ELECTRON_VIEW_IPC.exitFullscreen, (event) => {
    return setFullscreen(getWindow(event.sender), false);
  });
}

import { contextBridge, ipcRenderer } from 'electron';
import { ELECTRON_FILESYSTEM_IPC } from './ipc/filesystem.ipc';
import { ELECTRON_STORAGE_IPC } from './ipc/storage.ipc';
import { ELECTRON_VIEW_IPC } from './ipc/view.ipc';
import type { iElectronBridge, tElectronPlatform } from './type';

function getDesktopPlatform(): tElectronPlatform {
  switch (process.platform) {
    case 'darwin':
      return 'macos';
    case 'win32':
      return 'windows';
    case 'linux':
      return 'linux';
    default:
      throw new Error(`Unsupported Electron platform: ${process.platform}`);
  }
}

const bridge = {
  runtime: {
    runtime: 'desktop',
    platform: getDesktopPlatform(),
  },

  filesystem: {
    writeFile(path, data) {
      return ipcRenderer.invoke(ELECTRON_FILESYSTEM_IPC.writeFile, path, data);
    },

    readFile(path) {
      return ipcRenderer.invoke(ELECTRON_FILESYSTEM_IPC.readFile, path);
    },

    removeFile(path) {
      return ipcRenderer.invoke(ELECTRON_FILESYSTEM_IPC.removeFile, path);
    },
  },

  storage: {
    setItem(key, value) {
      return ipcRenderer.invoke(ELECTRON_STORAGE_IPC.setItem, key, value);
    },

    getItem(key) {
      return ipcRenderer.invoke(ELECTRON_STORAGE_IPC.getItem, key);
    },

    removeItem(key) {
      return ipcRenderer.invoke(ELECTRON_STORAGE_IPC.removeItem, key);
    },
  },

  view: {
    isFullscreen() {
      return ipcRenderer.invoke(ELECTRON_VIEW_IPC.isFullscreen);
    },

    enterFullscreen() {
      return ipcRenderer.invoke(ELECTRON_VIEW_IPC.enterFullscreen);
    },

    exitFullscreen() {
      return ipcRenderer.invoke(ELECTRON_VIEW_IPC.exitFullscreen);
    },
  },
} satisfies iElectronBridge;

contextBridge.exposeInMainWorld('blind', bridge);

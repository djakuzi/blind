import { contextBridge, ipcRenderer } from 'electron';
import { ELECTRON_FILESYSTEM_IPC } from './ipc/filesystem.ipc';
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
} satisfies iElectronBridge;

contextBridge.exposeInMainWorld('blind', bridge);

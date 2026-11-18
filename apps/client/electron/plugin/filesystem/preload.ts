import { ipcRenderer } from 'electron';
import { FILESYSTEM_CHANNEL } from './channel';
import type { iElectronFilesystemPlugin } from './type';

export const FilesystemPreloadPlugin: iElectronFilesystemPlugin = {
  writeFile(path, data) {
    return ipcRenderer.invoke(FILESYSTEM_CHANNEL.writeFile, path, data);
  },

  readFile(path) {
    return ipcRenderer.invoke(FILESYSTEM_CHANNEL.readFile, path);
  },

  removeFile(path) {
    return ipcRenderer.invoke(FILESYSTEM_CHANNEL.removeFile, path);
  },
};

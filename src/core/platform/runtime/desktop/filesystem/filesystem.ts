import type { iFilesystemAdapter } from '../../../tool/filesystem/type';
import { HelperBridge } from '../helpers/bridge.helper';

export const RuntimeDesktopFilesystem: iFilesystemAdapter = {
  writeFile(path, data) {
    return HelperBridge.getCapability('filesystem').writeFile(path, data);
  },

  readFile(path) {
    return HelperBridge.getCapability('filesystem').readFile(path);
  },

  removeFile(path) {
    return HelperBridge.getCapability('filesystem').removeFile(path);
  },
};

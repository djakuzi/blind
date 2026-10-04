import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iFilesystemAdapter } from '../type';

export const DesktopFilesystemAdapter: iFilesystemAdapter = {
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

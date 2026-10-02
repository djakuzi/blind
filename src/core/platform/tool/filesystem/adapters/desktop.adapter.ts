import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperPath } from '../helpers/path.helper';
import type { iFilesystemAdapter } from '../type';

export const DesktopFilesystemAdapter: iFilesystemAdapter = {
  writeFile(path, data) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    return HelperBridge.getCapability('filesystem').writeFile(normalizedPath, data);
  },

  readFile(path) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    return HelperBridge.getCapability('filesystem').readFile(normalizedPath);
  },

  removeFile(path) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    return HelperBridge.getCapability('filesystem').removeFile(normalizedPath);
  },
};

import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperPath } from '../helpers/path.helper';
import type { iFilesystemAdapter } from '../type';

function getFilesystemBridge() {
  const bridge = HelperBridge.getDesktopBridge();

  if (!bridge) {
    throw new Error('Desktop filesystem bridge is not available');
  }

  return bridge.filesystem;
}

export const DesktopFilesystemAdapter: iFilesystemAdapter = {
  writeFile(path, data) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    return getFilesystemBridge().writeFile(normalizedPath, data);
  },

  readFile(path) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    return getFilesystemBridge().readFile(normalizedPath);
  },

  removeFile(path) {
    const { path: normalizedPath } = HelperPath.normalizePath(path);

    return getFilesystemBridge().removeFile(normalizedPath);
  },
};

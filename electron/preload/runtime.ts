import type { iElectronRuntimeBridge } from '../type';
import type { tElectronPlatform } from '../type';

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

export function createRuntimeBridge(): iElectronRuntimeBridge {
  return {
    runtime: 'desktop',
    platform: getDesktopPlatform(),
  };
}

import { contextBridge } from 'electron';
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
} satisfies iElectronBridge;

contextBridge.exposeInMainWorld('blind', bridge);

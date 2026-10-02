import { contextBridge } from 'electron';
import type { iBlindBridge, tDesktopAppPlatform } from '../src/core/tool/runtime/type';

function getDesktopPlatform(): tDesktopAppPlatform {
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
    runtime: 'electron',
    platform: getDesktopPlatform(),
  },
} satisfies iBlindBridge;

contextBridge.exposeInMainWorld('blind', bridge);

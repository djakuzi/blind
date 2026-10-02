import { ipcMain, net } from 'electron';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ELECTRON_AUDIO_IPC } from '../ipc/audio.ipc';

function isOutsideRoot(root: string, target: string) {
  const relativePath = relative(root, target);

  return relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath);
}

function resolveAssetUrl(rendererUrl: string, src: string) {
  if (typeof src !== 'string' || !src) {
    throw new Error('Invalid audio asset source');
  }

  const baseUrl = new URL(rendererUrl);

  if (baseUrl.protocol === 'file:') {
    const root = dirname(fileURLToPath(baseUrl));
    const target = resolve(root, src.replace(/^\/+/, ''));

    if (isOutsideRoot(root, target)) {
      throw new Error('Audio asset is outside renderer directory');
    }

    return pathToFileURL(target).toString();
  }

  if (baseUrl.protocol === 'http:' || baseUrl.protocol === 'https:') {
    const targetUrl = new URL(src, baseUrl);

    if (targetUrl.origin !== baseUrl.origin) {
      throw new Error('Cross-origin audio assets are not allowed');
    }

    return targetUrl.toString();
  }

  throw new Error(`Unsupported renderer protocol: ${baseUrl.protocol}`);
}

export function registerAudioIpc() {
  ipcMain.removeHandler(ELECTRON_AUDIO_IPC.loadAsset);

  ipcMain.handle(ELECTRON_AUDIO_IPC.loadAsset, async (event, src: string) => {
    const url = resolveAssetUrl(event.sender.getURL(), src);
    const response = await net.fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load audio asset: ${src}`);
    }

    return {
      data: await response.arrayBuffer(),
    };
  });
}

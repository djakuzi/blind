import { ipcMain, net } from 'electron';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isPathOutsideRoot } from '../../shared/helpers/path.helper';
import { AUDIO_CHANNEL } from './channel';

function resolveFileAssetUrl(baseUrl: URL, src: string) {
  baseUrl.hash = '';
  baseUrl.search = '';

  const root = dirname(fileURLToPath(baseUrl));
  const targetUrl = src.startsWith('file:')
    ? new URL(src)
    : new URL(src.startsWith('/') ? `.${src}` : src, baseUrl);

  targetUrl.hash = '';
  targetUrl.search = '';

  if (targetUrl.protocol !== 'file:') {
    throw new Error('Desktop audio asset must use the file protocol');
  }

  const target = fileURLToPath(targetUrl);

  if (isPathOutsideRoot(root, target)) {
    throw new Error('Audio asset is outside renderer directory');
  }

  return pathToFileURL(target).toString();
}

function resolveAssetUrl(rendererUrl: string, src: string) {
  if (typeof src !== 'string' || !src) {
    throw new Error('Invalid audio asset source');
  }

  const baseUrl = new URL(rendererUrl);

  if (baseUrl.protocol === 'file:') {
    return resolveFileAssetUrl(baseUrl, src);
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

export function registerAudioPlugin() {
  ipcMain.removeHandler(AUDIO_CHANNEL.loadAsset);

  ipcMain.handle(AUDIO_CHANNEL.loadAsset, async (event, src: string) => {
    const url = resolveAssetUrl(event.sender.getURL(), src);
    const response = await net.fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load audio asset: ${src}`);
    }

    return { data: await response.arrayBuffer() };
  });
}

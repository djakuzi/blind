import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ELECTRON_CONFIG } from '../../config';
import { isPathOutsideRoot } from './path.helper';

function getRendererRootDirectory(appPath: string) {
  return join(appPath, ELECTRON_CONFIG.renderer.directory);
}

function getRendererEntryUrl() {
  const { scheme, host } = ELECTRON_CONFIG.renderer.protocol;

  return `${scheme}://${host}/${ELECTRON_CONFIG.renderer.entryFile}`;
}

function isRendererUrl(url: URL) {
  const { scheme, host } = ELECTRON_CONFIG.renderer.protocol;

  return url.protocol === `${scheme}:` && url.host === host;
}

function resolveRendererFileUrl(rootDirectory: string, input: string | URL) {
  const url = typeof input === 'string' ? new URL(input) : input;

  if (!isRendererUrl(url)) {
    throw new Error(`Unsupported renderer URL: ${url.toString()}`);
  }

  const pathname = decodeURIComponent(url.pathname);
  const relativePath =
    pathname.replace(/^\/+/, '') || ELECTRON_CONFIG.renderer.entryFile;

  if (relativePath.includes('\0')) {
    throw new Error('Renderer path contains an invalid null byte');
  }

  const targetPath = join(rootDirectory, relativePath);

  if (isPathOutsideRoot(rootDirectory, targetPath)) {
    throw new Error('Renderer asset is outside renderer directory');
  }

  return pathToFileURL(targetPath).toString();
}

export const HelperRenderer = {
  getRendererRootDirectory,
  getRendererEntryUrl,
  isRendererUrl,
  resolveRendererFileUrl,
};

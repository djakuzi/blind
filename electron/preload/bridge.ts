import type { iElectronBridge } from '../type';
import { AudioPreloadPlugin } from '../plugin/audio/preload';
import { FilesystemPreloadPlugin } from '../plugin/filesystem/preload';
import { StoragePreloadPlugin } from '../plugin/storage/preload';
import { ViewPreloadPlugin } from '../plugin/view/preload';
import { createRuntimeBridge } from './runtime';

export function createElectronBridge(): iElectronBridge {
  return {
    runtime: createRuntimeBridge(),
    audio: AudioPreloadPlugin,
    filesystem: FilesystemPreloadPlugin,
    storage: StoragePreloadPlugin,
    view: ViewPreloadPlugin,
  };
}

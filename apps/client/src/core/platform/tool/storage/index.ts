import { resolveRuntimeAdapter } from '../../adapter';
import { DesktopStorageAdapter } from './adapters/desktop.adapter';
import { MobileStorageAdapter } from './adapters/mobile.adapter';
import { WebStorageAdapter } from './adapters/web.adapter';
import { createStorageTool } from './tool';

export type { iStorageAdapter, iTimedStorageEntry } from './type';

const StorageAdapter = resolveRuntimeAdapter({
  web: WebStorageAdapter,
  mobile: MobileStorageAdapter,
  desktop: DesktopStorageAdapter,
});

export const { setItem, getItem, removeItem, setJson, getJson, loadTimedJsonCache, saveTimedJsonCache } = createStorageTool(StorageAdapter);

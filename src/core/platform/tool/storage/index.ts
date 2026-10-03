import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopStorageAdapter } from './adapters/desktop.adapter';
import { MobileStorageAdapter } from './adapters/mobile.adapter';
import { WebStorageAdapter } from './adapters/web.adapter';
import { createStorageService } from './service';

export type { iStorageAdapter, iTimedStorageEntry } from './type';

const StorageAdapter = resolveAdapter(
  {
    web: WebStorageAdapter,
    mobile: MobileStorageAdapter,
    desktop: DesktopStorageAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  setItem,
  getItem,
  removeItem,
  setJson,
  getJson,
  loadTimedJsonCache,
  saveTimedJsonCache,
} = createStorageService(StorageAdapter);

import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopFilesystemAdapter } from './adapters/desktop.adapter';
import { MobileFilesystemAdapter } from './adapters/mobile.adapter';
import { WebFilesystemAdapter } from './adapters/web.adapter';
import { createFilesystemService } from './service';

export type { iFilesystemAdapter } from './type';

const FilesystemAdapter = resolveAdapter(
  {
    web: WebFilesystemAdapter,
    mobile: MobileFilesystemAdapter,
    desktop: DesktopFilesystemAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  setJson,
  getJson,
  remove,
} = createFilesystemService(FilesystemAdapter);

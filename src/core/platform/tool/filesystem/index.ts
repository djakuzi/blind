import { resolveRuntimeAdapter } from '../../adapter';
import { DesktopFilesystemAdapter } from './adapters/desktop.adapter';
import { MobileFilesystemAdapter } from './adapters/mobile.adapter';
import { WebFilesystemAdapter } from './adapters/web.adapter';
import { createFilesystemTool } from './tool';

export type { iFilesystemAdapter } from './type';

const FilesystemAdapter = resolveRuntimeAdapter({
  web: WebFilesystemAdapter,
  mobile: MobileFilesystemAdapter,
  desktop: DesktopFilesystemAdapter,
});

export const { setJson, getJson, remove } = createFilesystemTool(FilesystemAdapter);

import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopFilesystemAdapter } from './adapters/desktop.adapter';
import { MobileFilesystemAdapter } from './adapters/mobile.adapter';
import { WebFilesystemAdapter } from './adapters/web.adapter';

export type { iFilesystemAdapter, iFilesystemValue } from './type';

const FilesystemAdapter = resolveAdapter(
  {
    web: WebFilesystemAdapter,
    mobile: MobileFilesystemAdapter,
    desktop: DesktopFilesystemAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export async function setJson<T>(path: string, value: T) {
  await FilesystemAdapter.writeFile(path, JSON.stringify(value));
}

export async function getJson<T>(path: string) {
  const { value } = await FilesystemAdapter.readFile(path);

  if (value === null) {
    return {
      value: null,
    };
  }

  return {
    value: JSON.parse(value) as T,
  };
}

export async function remove(path: string) {
  await FilesystemAdapter.removeFile(path);
}

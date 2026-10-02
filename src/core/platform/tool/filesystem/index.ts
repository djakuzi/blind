import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopFilesystemAdapter } from './adapters/desktop.adapter';
import { MobileFilesystemAdapter } from './adapters/mobile.adapter';
import { WebFilesystemAdapter } from './adapters/web.adapter';

export type { iFilesystemAdapter } from './type';

const FilesystemAdapter = resolveAdapter(
  {
    web: WebFilesystemAdapter,
    mobile: MobileFilesystemAdapter,
    desktop: DesktopFilesystemAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export async function setJson<T>(path: string, value: T) {
  const data = JSON.stringify(value);

  if (data === undefined) {
    throw new Error('Filesystem value is not JSON serializable');
  }

  await FilesystemAdapter.writeFile(path, data);
}

export async function getJson<T>(path: string) {
  try {
    const { value } = await FilesystemAdapter.readFile(path);

    if (value === null) {
      return {
        value: null,
      };
    }

    return {
      value: JSON.parse(value) as T,
    };
  } catch {
    return {
      value: null,
    };
  }
}

export async function remove(path: string) {
  try {
    await FilesystemAdapter.removeFile(path);
  } catch {
    return;
  }
}

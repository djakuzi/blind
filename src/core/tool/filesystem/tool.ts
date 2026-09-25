import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export async function setJson<T>(path: string, value: T): Promise<void> {
  await Filesystem.writeFile({
    path,
    directory: Directory.Data,
    encoding: Encoding.UTF8,
    data: JSON.stringify(value),
    recursive: true,
  });
}

export async function getJson<T>(path: string): Promise<T | null> {
  try {
    const { data } = await Filesystem.readFile({
      path,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const content = typeof data === 'string' ? data : await data.text();

    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export async function remove(path: string): Promise<void> {
  try {
    await Filesystem.deleteFile({
      path,
      directory: Directory.Data,
    });
  } catch {
    // файла может не быть
  }
}

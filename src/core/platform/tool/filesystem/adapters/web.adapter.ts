import { HelperOpfs } from '../helpers/opfs.helper';
import type { iFilesystemAdapter } from '../type';

export const WebFilesystemAdapter: iFilesystemAdapter = {
  writeFile: HelperOpfs.writeFile,
  readFile: HelperOpfs.readFile,
  removeFile: HelperOpfs.removeFile,
};

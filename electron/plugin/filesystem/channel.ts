import { createElectronChannel } from '../../config';

export const FILESYSTEM_CHANNEL = {
  writeFile: createElectronChannel('filesystem', 'write-file'),
  readFile: createElectronChannel('filesystem', 'read-file'),
  removeFile: createElectronChannel('filesystem', 'remove-file'),
} as const;

export const ELECTRON_CONFIG = {
  bridgeKey: 'blind',
  ipcPrefix: 'blind',

  filesystem: {
    directory: 'data',
  },

  storage: {
    directory: 'storage',
    fileName: 'preferences.json',
  },
} as const;

export function createElectronChannel(plugin: string, action: string) {
  return `${ELECTRON_CONFIG.ipcPrefix}:${plugin}:${action}`;
}

export const ELECTRON_CONFIG = {
  bridgeKey: 'blind',
  ipcPrefix: 'blind',

  renderer: {
    directory: 'dist',
    entryFile: 'index.html',
    protocol: {
      scheme: 'blind',
      host: 'app',
    },
  },

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

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blind.game',
  appName: 'blind',
  webDir: 'dist',
  ios: {
    preferredContentMode: 'mobile',
  },
};

export default config;

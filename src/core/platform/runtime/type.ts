export type tAppRuntime = 'web' | 'capacitor' | 'electron';

export type tAppPlatform = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type tDesktopAppPlatform = Extract<tAppPlatform, 'windows' | 'macos' | 'linux'>;

export interface iBlindRuntimeBridge {
  runtime: 'electron';
  platform: tDesktopAppPlatform;
}

export interface iBlindBridge {
  runtime: iBlindRuntimeBridge;
}

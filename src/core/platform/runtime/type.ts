export type tAppRuntime = 'web' | 'mobile' | 'desktop';

export type tAppPlatform = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type tMobileAppPlatform = Extract<tAppPlatform, 'android' | 'ios'>;
export type tDesktopAppPlatform = Extract<tAppPlatform, 'windows' | 'macos' | 'linux'>;

export interface iBlindRuntimeBridge {
  runtime: 'desktop';
  platform: tDesktopAppPlatform;
}

export interface iBlindBridge {
  runtime: iBlindRuntimeBridge;
}

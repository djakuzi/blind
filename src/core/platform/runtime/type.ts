export type tAppRuntime = 'web' | 'mobile' | 'desktop';

export type tAppPlatform = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type tMobileAppPlatform = Extract<tAppPlatform, 'android' | 'ios'>;

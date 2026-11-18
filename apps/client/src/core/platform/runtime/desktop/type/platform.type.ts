import type { tElectronPlatform } from '../../../../../../electron/type';
import type { tAppPlatform } from '../../type';

export type tDesktopAppPlatform = Extract<tAppPlatform, tElectronPlatform>;

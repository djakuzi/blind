import type {
  tAppRootFontSize,
  tAppScaleMode,
} from '@/app/styles/contracts/appScale.contract';
import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract';

export interface iSettingsState {
  appRootFontSize: tAppRootFontSize
  appScaleMode: tAppScaleMode
  appThemeMode: tAppThemeMode
}

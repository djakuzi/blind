import type { tAppScaleMode } from '@/app/styles/contracts/appScale.contract';
import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract';

export interface iSettingsState {
  appScaleMode: tAppScaleMode
  appThemeMode: tAppThemeMode
}

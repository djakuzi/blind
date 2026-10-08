import type { tAppScaleMode } from '@/app/shared/styles/contracts/appScale.contract';
import type { tAppThemeMode } from '@/app/shared/styles/contracts/appTheme.contract';

export interface iSettingsState {
  appScaleMode: tAppScaleMode;
  appThemeMode: tAppThemeMode;
  soundEnabled: boolean;
}

import type { tAppScalePresetMode } from '@/app/styles/contracts/appScale.contract';
import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract';

export interface LocaleSettings {
  theme: Record<tAppThemeMode, string>
  scale: Record<tAppScalePresetMode, string>
}

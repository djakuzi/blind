import type { tAppScalePresetMode } from '@/app/shared/styles/contracts/appScale.contract';
import type { tAppThemeMode } from '@/app/shared/styles/contracts/appTheme.contract';

export interface LocaleSettings {
  theme: Record<tAppThemeMode, string>;
  scale: Record<tAppScalePresetMode, string>;
  sound: Record<'on' | 'off', string>;
}

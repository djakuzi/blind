import type { tAppScaleMode } from '@/app/styles/contracts/appScale.contract.ts';
import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract.ts';

type tSettingsThemeMode = tAppThemeMode;

type tSettingsScaleMode =
  Exclude<tAppScaleMode, 'system'>;

export const SETTINGS_THEME_VALUES = [
  'light',
  'dark',
  'system',
] satisfies tSettingsThemeMode[];

export const SETTINGS_SCALE_VALUES = [
  'small',
  'default',
  'large',
] satisfies tSettingsScaleMode[];

import type { tAppScaleMode } from '@/app/styles/contracts/appScale.contract.ts';
import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract.ts';

type tSettingsOption<TValue extends string> = {
  label: string
  value: TValue
  disabled?: boolean
};

type tSettingsThemeMode = tAppThemeMode;

type tSettingsScaleMode =
  Exclude<tAppScaleMode, 'system'>;

export const SETTINGS_THEME_OPTIONS = [
  {
    label: 'Светлая',
    value: 'light',
  },
  {
    label: 'Тёмная',
    value: 'dark',
  },
  {
    label: 'Система',
    value: 'system',
  },
] satisfies tSettingsOption<tSettingsThemeMode>[];

export const SETTINGS_SCALE_OPTIONS = [
  {
    label: 'S',
    value: 'small',
  },
  {
    label: 'M',
    value: 'default',
  },
  {
    label: 'L',
    value: 'large',
  },
] satisfies tSettingsOption<tSettingsScaleMode>[];
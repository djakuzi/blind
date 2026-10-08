import { ICONS_ASSETS } from './const';
import type { tIconGroup, tIconName, tIconTheme } from './type';

export function getIcon<TGroup extends tIconGroup>(group: TGroup, icon: tIconName<TGroup>, theme: tIconTheme): string {
  const groupAssets = ICONS_ASSETS[group] as Record<string, string>;
  const themeSuffix = theme === 'dark' ? 'Dark' : 'Light';
  const themedIconName = `${icon}${themeSuffix}`;

  return groupAssets[themedIconName] ?? groupAssets[icon] ?? '';
}

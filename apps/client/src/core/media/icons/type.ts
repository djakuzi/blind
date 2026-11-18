import type { ICONS_ASSETS } from './const';

export type tIconGroup = keyof typeof ICONS_ASSETS;
export type tIconTheme = 'light' | 'dark';

type tResolveIconName<TName extends string> = TName extends `${infer TIconName}Dark`
  ? TIconName
  : TName extends `${infer TIconName}Light`
    ? TIconName
    : TName;

export type tIconName<TGroup extends tIconGroup> = TGroup extends tIconGroup
  ? tResolveIconName<Extract<keyof (typeof ICONS_ASSETS)[TGroup], string>>
  : never;

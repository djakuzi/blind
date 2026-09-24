import type { LocaleCommon } from './common';
import type { LocaleConnectionTypes } from './connectionTypes';
import type { LocaleGame } from './game';
import type { LocaleSettings } from './settings';
import type { LocaleViews } from './views';

export interface Locale {
  common: LocaleCommon
  views: LocaleViews
  game: LocaleGame
  connectionTypes: LocaleConnectionTypes
  settings: LocaleSettings
}

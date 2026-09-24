import type { LocaleConnectionTypes } from './connectionTypes';
import type { LocaleGame } from './game';
import type { LocaleViews } from './views';

export interface Locale {
  views: LocaleViews
  game: LocaleGame
  connectionTypes: LocaleConnectionTypes
}

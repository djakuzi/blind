import type { LocaleViewMenu } from './menu';
import type { LocaleViewLobby } from './lobby';
import type { LocaleViewSettings } from './settings';

export interface LocaleViews {
  menu: LocaleViewMenu;
  lobby: LocaleViewLobby;
  settings: LocaleViewSettings;
}

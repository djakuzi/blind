import type { LocaleViewMenuSettings } from './settings';

export interface LocaleViewMenu {
    index: {
        play: string
        settings: string
    }

    settings: LocaleViewMenuSettings
}
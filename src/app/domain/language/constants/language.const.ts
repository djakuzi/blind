export interface DataLanguage {
    name: string
}

export const LANGUAGE = {
    en: {
        name: 'English',
    },
    ru: {
        name: 'Русский',
    },
} as const satisfies Record<string, DataLanguage>;

export type tLanguage = typeof LANGUAGE;
export type tKeyLanguage = keyof typeof LANGUAGE;
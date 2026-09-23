import imgEn from '@/assets/images/language/en.png';
import imgRu from '@/assets/images/language/ru.png';

export interface DataLanguage {
  name: string
  img?: string
  version: string
  isDefault: boolean
}

export const LANGUAGE = {
  en: {
    name: 'English',
    img: imgEn,
    version: '1',
    isDefault: true,
  },

  ru: {
    name: 'Русский',
    img: imgRu,
    version: '1',
    isDefault: false,
  },
} as const satisfies Record<string, DataLanguage>;

export type tLanguage = typeof LANGUAGE;
export type tKeyLanguage = keyof typeof LANGUAGE;
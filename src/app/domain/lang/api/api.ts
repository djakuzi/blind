import {
  LANGUAGE,
  type tKeyLanguage,
} from '../constants/language.const';

import {
  localeEn,
} from '../languages/en';

import {
  localeRu,
} from '../languages/ru';

import type { Locale } from '../locale';

import {
  ModelLanguage,
} from '../models/Language.model';

const LANGUAGE_INTERFACE = {
  en: localeEn,
  ru: localeRu,
} satisfies Record<tKeyLanguage, Locale>;

export class ApiLanguage {
  async getLanguages(): Promise<ModelLanguage[]> {
    const keys =
      Object.keys(LANGUAGE) as tKeyLanguage[];

    return keys.map((key) =>
      new ModelLanguage({
        key,
        ...LANGUAGE[key],
      }),
    );
  }

  async getLanguageCodes(): Promise<tKeyLanguage[]> {
    return Object.keys(LANGUAGE) as tKeyLanguage[];
  }

  async getLanguageInterface(
    code: tKeyLanguage,
  ): Promise<Locale> {
    return LANGUAGE_INTERFACE[code];
  }
}

export const apiLanguage = new ApiLanguage();
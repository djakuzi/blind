import { LANGUAGE, type tKeyLanguage } from '../constants/language.const';
import { localeEn } from '../languages/en';
import { localeRu } from '../languages/ru';
import type { Locale } from '../locale';
import { ModelLanguage } from '../models/Language.model';

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

  async getDefaultLanguage(): Promise<ModelLanguage> {
    const defaultKey =
      Object.keys(LANGUAGE).find((key) =>
        LANGUAGE[key as tKeyLanguage].isDefault,
      ) as tKeyLanguage | undefined;

    const key =
      defaultKey ?? Object.keys(LANGUAGE)[0] as tKeyLanguage;

    return new ModelLanguage({
      key,
      ...LANGUAGE[key],
    });
  }

  async getDefaultLanguageInterface(): Promise<Locale> {
    const language =
      await this.getDefaultLanguage();

    return LANGUAGE_INTERFACE[language.key];
  }
}

export const apiLanguage = new ApiLanguage();

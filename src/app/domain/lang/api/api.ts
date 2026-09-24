import { publicClient } from '@/app/shared/api';
import type { Locale } from '../locale';
import { ModelLanguage } from '../models/Language.model';

interface iResponseLanguage {
  key: string
  name: string
  img?: string
  version: string
  isDefault: boolean
}

export class ApiLanguage {
  async getLanguages(): Promise<ModelLanguage[]> {
    const languages =
      await publicClient.get<iResponseLanguage[]>(
        '/lang/languages.json',
      );

    return languages.map((language) =>
      new ModelLanguage(language),
    );
  }

  async getLanguageCodes(): Promise<string[]> {
    const languages =
      await this.getLanguages();

    return languages.map((language) =>
      language.key,
    );
  }

  async getLanguageInterface(
    code: string,
  ): Promise<Locale> {
    return publicClient.get<Locale>(
      `/lang/${code}.json`,
    );
  }

  async getDefaultLanguage(): Promise<ModelLanguage> {
    const languages =
      await this.getLanguages();

    const language =
      languages.find((item) =>
        item.isDefault,
      ) ?? languages[0];

    if (!language) {
      throw new Error('Language API returned an empty language list');
    }

    return language;
  }

  async getDefaultLanguageInterface(): Promise<Locale> {
    const language =
      await this.getDefaultLanguage();

    return this.getLanguageInterface(
      language.key,
    );
  }
}

export const apiLanguage = new ApiLanguage();

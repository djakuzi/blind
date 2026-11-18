import { apiClient } from '@/app/shared/api';
import { ModelLanguage } from '../models/Language.model';
import type { iResponseLanguage, iResponseLanguageInterface } from '../type/api/res';

export class ApiLanguage {
  async getLanguages(): Promise<ModelLanguage[]> {
    const languages = await apiClient.get<iResponseLanguage[]>('/lang/languages.json');

    return languages.map((language) => new ModelLanguage(language));
  }

  async getLanguageCodes(): Promise<string[]> {
    const languages = await this.getLanguages();

    return languages.map((language) => language.key);
  }

  async getLanguageInterface(code: string): Promise<iResponseLanguageInterface> {
    return apiClient.get<iResponseLanguageInterface>(`/lang/${code}.json`);
  }

  async getDefaultLanguage(): Promise<ModelLanguage> {
    const languages = await this.getLanguages();

    const language = languages.find((item) => item.isDefault) ?? languages[0];

    if (!language) {
      throw new Error('Language API returned an empty language list');
    }

    return language;
  }

  async getDefaultLanguageInterface(): Promise<iResponseLanguageInterface> {
    const language = await this.getDefaultLanguage();

    return this.getLanguageInterface(language.key);
  }
}

export const apiLanguage = new ApiLanguage();

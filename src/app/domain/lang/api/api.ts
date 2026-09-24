import type { Locale } from '../locale';
import { ModelLanguage } from '../models/Language.model';

interface iResponseLanguage {
  key: string
  name: string
  img?: string
  version: string
  isDefault: boolean
}

async function fetchJson<TResponse>(
  url: string,
): Promise<TResponse> {
  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(`Language API request failed: ${url}`);
  }

  return await response.json() as TResponse;
}

export class ApiLanguage {
  async getLanguages(): Promise<ModelLanguage[]> {
    const languages =
      await fetchJson<iResponseLanguage[]>(
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
    return await fetchJson<Locale>(
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

    return await this.getLanguageInterface(
      language.key,
    );
  }
}

export const apiLanguage = new ApiLanguage();

import { apiLanguage } from '@/app/domain/lang/api/api';
import { ModelLanguage } from '@/app/domain/lang/models/Language.model';
import { ToolFilesystem } from '@/core/tool/filesystem';
import { ToolStorage } from '@/core/tool/storage';
import { ToolSystem } from '@/core/tool/system';
import { LANGUAGE_FILE_DIR, LANGUAGE_LIST_STORAGE_KEY } from '../language.const';
import type { Locale } from '@/app/domain/lang/locale';
import type { iLanguageFile } from '../language.type';

type tStoredLanguage = ConstructorParameters<typeof ModelLanguage>[0];

function getLanguageFilePath(
  code: string,
) {
  return `${LANGUAGE_FILE_DIR}/${code}.json`;
}

export function saveDocumentLanguage(
  code: string,
) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = code;
}

export function normalizeLanguageCodes(
  code: string,
) {
  const normalizedCode =
    code.trim().replaceAll('_', '-').toLowerCase();

  const baseCode =
    normalizedCode.split('-')[0] ?? normalizedCode;

  return {
    exact: normalizedCode,
    base: baseCode,
  };
}

export function findLanguageByCode(
  languages: ModelLanguage[],
  code: string | null,
) {
  if (!code) {
    return null;
  }

  const normalizedCodes =
    normalizeLanguageCodes(code);

  return languages.find((language) =>
    language.key.toLowerCase() === normalizedCodes.exact,
  ) ?? languages.find((language) =>
    language.key.toLowerCase() === normalizedCodes.base,
  ) ?? null;
}

export function findDefaultLanguage(
  languages: ModelLanguage[],
) {
  return languages.find((language) =>
    language.isDefault,
  ) ?? languages[0] ?? null;
}

export async function getFallbackLanguages() {
  const cachedLanguages =
    await ToolStorage.getJson<tStoredLanguage[]>(
      LANGUAGE_LIST_STORAGE_KEY,
    );

  if (!cachedLanguages?.length) {
    return [
      await apiLanguage.getDefaultLanguage(),
    ];
  }

  return cachedLanguages.map((language) =>
    new ModelLanguage(language),
  );
}

export async function loadLanguages() {
  try {
    const languages =
      await apiLanguage.getLanguages();

    await ToolStorage.setJson<tStoredLanguage[]>(
      LANGUAGE_LIST_STORAGE_KEY,
      languages,
    );

    return languages;
  } catch {
    return getFallbackLanguages();
  }
}

export async function resolveInitialLanguage(
  languages: ModelLanguage[],
  savedCode: string | null,
) {
  const savedLanguage =
    findLanguageByCode(languages, savedCode);

  if (savedLanguage) {
    return savedLanguage;
  }

  let systemCode: string | null;

  try {
    systemCode =
      await ToolSystem.getSystemLanguage();
  } catch {
    systemCode = null;
  }

  return findLanguageByCode(
    languages,
    systemCode,
  ) ?? findDefaultLanguage(languages);
}

export async function loadDefaultLanguageFallback() {
  const language =
    await apiLanguage.getDefaultLanguage();

  const locale =
    await apiLanguage.getDefaultLanguageInterface();

  return {
    language,
    locale,
  };
}

export async function loadLanguageLocale(
  language: ModelLanguage,
): Promise<Locale> {
  const path =
    getLanguageFilePath(language.key);

  const languageFile =
    await ToolFilesystem.getJson<iLanguageFile>(path);

  if (
    languageFile
    && languageFile.version === language.version
  ) {
    return languageFile.locale;
  }

  const locale =
    await apiLanguage.getLanguageInterface(language.key);

  await ToolFilesystem.setJson<iLanguageFile>(
    path,
    {
      version: language.version,
      locale,
    },
  );

  return locale;
}

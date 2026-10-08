function getLanguageDisplayName(languageCode: string, displayLanguageCode: string): string | null {
  if (typeof Intl.DisplayNames === 'undefined') {
    return null;
  }

  try {
    return (
      new Intl.DisplayNames([displayLanguageCode], {
        type: 'language',
      }).of(languageCode) ?? null
    );
  } catch {
    return null;
  }
}

export const moduleLanguage = {
  getLanguageDisplayName,
};

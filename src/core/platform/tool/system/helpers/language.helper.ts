function getBrowserLanguage() {
  if (typeof navigator === 'undefined' || !navigator.language) {
    throw new Error('System language is not available');
  }

  return navigator.language;
}

export const HelperLanguage = {
  getBrowserLanguage,
};

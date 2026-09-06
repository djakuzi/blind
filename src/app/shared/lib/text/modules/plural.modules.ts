export interface iTextPluralForms {
  one: string
  few: string
  many: string
}

function resolvePluralWord(
  count: number,
  forms: iTextPluralForms,
): string {
  const normalizedCount =
    Math.abs(Math.trunc(count));

  const lastTwoDigits =
    normalizedCount % 100;

  const lastDigit =
    normalizedCount % 10;

  if (
    lastTwoDigits >= 11
    && lastTwoDigits <= 14
  ) {
    return forms.many;
  }

  if (lastDigit === 1) {
    return forms.one;
  }

  if (
    lastDigit >= 2
    && lastDigit <= 4
  ) {
    return forms.few;
  }

  return forms.many;
}

function formatPluralCount(
  count: number,
  forms: iTextPluralForms,
): string {
  return `${count} ${resolvePluralWord(
    count,
    forms,
  )}`;
}

export const modulePlural = {
  resolvePluralWord,
  formatPluralCount,
};
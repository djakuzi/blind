export type tTextPluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type tTextPluralForms = Partial<Record<tTextPluralCategory, string>> & {
  other: string;
};

function formatPluralCount(count: number, languageCode: string, forms: tTextPluralForms): string {
  const category = new Intl.PluralRules(languageCode).select(count);

  const template = forms[category] ?? forms.other;

  return template.replace(/\{count\}/g, String(count));
}

export const modulePlural = {
  formatPluralCount,
};

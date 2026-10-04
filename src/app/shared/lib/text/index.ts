import { moduleLanguage } from './modules/language.modules';
import { modulePlural } from './modules/plural.modules';
import type { tTextPluralCategory, tTextPluralForms } from './modules/plural.modules';

export type { tTextPluralCategory, tTextPluralForms };

export const LibText = {
  ...moduleLanguage,
  ...modulePlural,
};

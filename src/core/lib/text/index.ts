import { moduleGroup } from './modules/group.modules';
import { moduleLanguage } from './modules/language.modules';
import { modulePlural } from './modules/plural.modules';
import type { tTextPluralCategory, tTextPluralForms } from './modules/plural.modules';

export type { tTextPluralCategory, tTextPluralForms };

export const LibText = {
  ...moduleGroup,
  ...moduleLanguage,
  ...modulePlural,
};

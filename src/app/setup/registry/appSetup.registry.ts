import type { Pinia } from 'pinia';
import { createLanguageSetup } from '../modules/language.setup';
import { createScaleSetup } from '../modules/scale.setup';
import { createThemeSetup } from '../modules/theme.setup';
import { createViewSetup } from '../modules/view.setup';

export function createAppSetupRegistry(pinia: Pinia) {
  return [createViewSetup(), createLanguageSetup(pinia), createScaleSetup(pinia), createThemeSetup(pinia)];
}

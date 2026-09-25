import type { Pinia } from 'pinia';
import { createLanguageSetup } from './interface/language.setup';
import { createScaleSetup } from './interface/scale.setup';
import { createThemeSetup } from './interface/theme.setup';
import { createViewSetup } from './platform/view.setup';

export function createAppSetupRegistry(pinia: Pinia) {
  return [createViewSetup(), createLanguageSetup(pinia), createScaleSetup(pinia), createThemeSetup(pinia)];
}

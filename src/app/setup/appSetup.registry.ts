import type { Pinia } from 'pinia';
import { createAudioSetup } from './interface/audio.setup';
import { createLanguageSetup } from './interface/language.setup';
import { createScaleSetup } from './interface/scale.setup';
import { createThemeSetup } from './interface/theme.setup';
import { createViewSetup } from './platform/view.setup';

export function createAppSetupRegistry(pinia: Pinia) {
  return [
    createViewSetup(),
    createAudioSetup(pinia),
    createLanguageSetup(pinia),
    createScaleSetup(pinia),
    createThemeSetup(pinia),
  ];
}

import type { Pinia } from 'pinia';
import { createAudioSetup } from './interface/audio.setup';
import { createGameModesSetup } from './interface/gameModes.setup';
import { createLanguageSetup } from './interface/language.setup';
import { createScaleSetup } from './interface/scale.setup';
import { createThemeSetup } from './interface/theme.setup';
import { createViewSetup } from './platform/view.setup';

export function createAppSetupRegistry(pinia: Pinia) {
  return [
    createViewSetup(),
    createThemeSetup(pinia),
    createScaleSetup(pinia),
    createLanguageSetup(pinia),
    createAudioSetup(pinia),
    createGameModesSetup(pinia),
  ];
}

import type { iApiGameModeData, iApiGameModesResourceData } from './common';

export interface iResponseGameModes {
  modes: iApiGameModeData[];
  data: iApiGameModesResourceData;
}

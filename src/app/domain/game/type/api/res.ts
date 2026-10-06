import type { iApiGameModeData, iApiGameModesMedia } from './common';

export interface iResponseGameModes {
  modes: iApiGameModeData[];
  media: iApiGameModesMedia;
}

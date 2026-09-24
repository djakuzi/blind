import type { tKeyGameMode } from '../../constants/gameMode.const';
import type { iApiGameModeData } from './common';

export interface iResponseGameMode extends iApiGameModeData {
  key: tKeyGameMode
}

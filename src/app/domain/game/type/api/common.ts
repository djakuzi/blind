import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tOptionGameMode } from '@/game/types/gameMode.types';

export interface iApiGameModeImage {
  dark: string
  light: string
}

export interface iApiGameModeData {
  img: iApiGameModeImage
  options: tOptionGameMode
  typeConnection: tKeyTypeConnection[]
}

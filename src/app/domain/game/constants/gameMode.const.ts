import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tOptionGameMode } from '@/game/types/gameMode.types';

export type tKeyGameMode =
  | 'DUEL'
  | 'COMBAT'
  | 'CLASH'
  | 'BATTLE';

export interface DataGameMode {
  img: {
    dark: string
    light: string
  }
  options: tOptionGameMode
  typeConnection: tKeyTypeConnection[]
}

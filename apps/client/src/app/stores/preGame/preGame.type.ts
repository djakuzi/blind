import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameModeKey } from '@/game/types/gameMode.types';

export interface iPreGameSelection {
  mode: tGameModeKey | null;
  players: string | null;
  connection: tKeyTypeConnection | null;
}

export type iPreGameState = iPreGameSelection;

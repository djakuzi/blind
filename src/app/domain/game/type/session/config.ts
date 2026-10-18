import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameModeKey, tOptionGameMode } from '@/game/types/gameMode.types';

export interface iGameSessionSelection {
  readonly mode: tGameModeKey | null;
  readonly players: string | null;
  readonly connection: tKeyTypeConnection | null;
}

export interface iGameSessionConfig extends tOptionGameMode {
  readonly format: string;
  readonly teamSize: number;
  readonly connection: tKeyTypeConnection;
}

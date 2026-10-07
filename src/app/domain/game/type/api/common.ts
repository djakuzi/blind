import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameModeKey } from '@/game/types/gameMode.types';

export interface iApiThemeMedia {
  dark: string;
  light: string;
}

export interface iApiGameModeData {
  key: tGameModeKey;
  name: string;
  rounds: number;
  options: string[];
  locked: boolean;
  lockedText: string | null;
}

export interface iApiGameModeResourceData {
  image: iApiThemeMedia;
}

export interface iApiGameModePlayerData {
  players: number;
  teamSize: number;
  connections: tKeyTypeConnection[];
  icon: iApiThemeMedia;
}

export interface iApiGameModesResourceData {
  modes: Record<tGameModeKey, iApiGameModeResourceData>;
  players: Record<string, iApiGameModePlayerData>;
}

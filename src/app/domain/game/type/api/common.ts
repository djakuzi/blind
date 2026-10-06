import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameModeKey } from '@/game/types/gameMode.types';

export interface iApiThemeMedia {
  dark: string;
  light: string;
}

export interface iApiGameModePlayerOption {
  key: string;
  players: number;
  teamSize: number;
  connections: tKeyTypeConnection[];
}

export interface iApiGameModeData {
  key: tGameModeKey;
  name: string;
  description: string;
  rounds: number;
  playerOptions: iApiGameModePlayerOption[];
  locked: boolean;
  lockedText: string | null;
}

export interface iApiGameModeMedia {
  image: iApiThemeMedia;
}

export interface iApiGameModePlayerMedia {
  icon: iApiThemeMedia;
}

export interface iApiGameModeLockedMedia {
  icon: iApiThemeMedia;
}

export interface iApiGameModesMedia {
  modes: Record<tGameModeKey, iApiGameModeMedia>;
  players: Record<string, iApiGameModePlayerMedia>;
  locked: iApiGameModeLockedMedia;
}

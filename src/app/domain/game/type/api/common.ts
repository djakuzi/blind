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
  keyOptions: string[];
  locked: boolean;
}

export interface iApiGameModeResourceData {
  image: iApiThemeMedia;
}

export interface iApiGameModeOptionData {
  players: number;
  teamSize: number;
  connections: tKeyTypeConnection[];
  icon: iApiThemeMedia;
}

export interface iApiGameModesResourceData {
  modes: Record<tGameModeKey, iApiGameModeResourceData>;
  options: Record<string, iApiGameModeOptionData>;
}

import type { iGameSessionConfig } from './config';

export type tGameSessionStatus = 'lobby' | 'playing' | 'closed';
export type tGameSessionTeam = 0 | 1;

export interface iGameSessionPlayer {
  readonly id: string;
  readonly team: tGameSessionTeam;
  readonly characterId: string | null;
  readonly isReady: boolean;
}

export interface iGameSessionData {
  readonly id: string;
  readonly ownerId: string | null;
  readonly config: iGameSessionConfig;
  readonly status: tGameSessionStatus;
  readonly players: readonly iGameSessionPlayer[];
}

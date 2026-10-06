export type tGameModeKey = 'single-hit' | 'health';

export type tGameModeWinCondition = tGameModeKey;

export type tOptionGameMode = {
  readonly players: number;
  readonly teamSize?: number;
  readonly rounds: number;
  readonly winCondition: tGameModeWinCondition;
};

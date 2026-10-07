export type tPlayableGameModeKey = 'single-hit' | 'health';
export type tGameModeKey = tPlayableGameModeKey | 'survival';

export type tGameModeWinCondition = tPlayableGameModeKey;

export type tOptionGameMode = {
  readonly players: number;
  readonly teamSize?: number;
  readonly rounds: number;
  readonly winCondition: tGameModeWinCondition;
};

export const GAME_MODE_WIN_CONDITION = {
  SINGLE_HIT: 'single-hit',
  HEALTH: 'health',
} as const;

export const GAME_MODE = {
  DUEL: {
    title: 'DUEL',
    description: 'Одно попадание — одна жизнь',
    players: 2,
    rounds: 3,
    winCondition: GAME_MODE_WIN_CONDITION.SINGLE_HIT,
  },
  COMBAT: {
    title: 'COMBAT',
    description: 'Сражайся, пока здоровье не закончится',
    players: 2,
    rounds: 3,
    winCondition: GAME_MODE_WIN_CONDITION.HEALTH,
  },
} as const;

export type tGameMode = typeof GAME_MODE;
export type tKeyGameMode = keyof typeof GAME_MODE;
export type tGameModeWinCondition = typeof GAME_MODE_WIN_CONDITION;
export type tKeyGameModeWinCondition = keyof typeof GAME_MODE_WIN_CONDITION;
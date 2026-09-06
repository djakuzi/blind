export const GAME_MODE = {
  COMBAT: {
    title: 'COMBAT',
    description: 'Сражайся, пока здоровье не закончится',
    players: 2,
    rounds: 3,
    winCondition: 'health',
  },
  DUEL: {
    title: 'DUEL',
    description: 'Одно попадание — одна жизнь',
    players: 2,
    rounds: 3,
    winCondition: 'single-hit',
  }
} as const;

export type tGameMode = typeof GAME_MODE;
export type tKeyGameMode = keyof typeof GAME_MODE;
import type { tOptionGameMode } from "@/game/types/gameMode.types";
import imgDuel from "@/assets/images/gameMode/duel.png";
import imgCombat from "@/assets/images/gameMode/combat.png";

export interface DataGameMode {
    title: string;
    description: string;
    img: string;
    options: tOptionGameMode;
}

export const GAME_MODE: Record<string, DataGameMode> = {
  DUEL: {
    title: 'DUEL',
    description: 'Одно попадание — одна жизнь',
    img: imgDuel,
    options: {
      players: 2,
      rounds: 3,
      winCondition: 'single-hit',
    },
  },
  COMBAT: {
    title: 'COMBAT',
    description: 'Сражайся, пока здоровье не закончится',
    img: imgCombat,
    options: {
      players: 2,
      rounds: 3,
      winCondition: 'health',
    },
  },
} as const;

export type tGameMode = typeof GAME_MODE;
export type tKeyGameMode = keyof typeof GAME_MODE;
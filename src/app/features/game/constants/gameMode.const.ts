import type { tOptionGameMode } from "@/game/types/gameMode.types";
import imgDuel from "@/assets/images/gameMode/duel.png";
import imgCombat from "@/assets/images/gameMode/combat.png";
import imgClash from "@/assets/images/gameMode/clash.png";

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
        teamSize: 1,
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
        teamSize: 1,
      players: 2,
      rounds: 3,
      winCondition: 'health',
    },
  },
  CLASH: {
    title: 'CLASH',
    description: 'Одна жизнь. Одна команда.',
    img: imgClash,
    options: {
        teamSize: 2,
      players: 4,
      rounds: 3,
      winCondition: 'single-hit',
    },
  },
  BATTLE: {
    title: 'BATTLE',
    description: 'Командный бой до последнего выжившего',
    img: imgCombat,
    options: {
        teamSize: 2,
      players: 4,
      rounds: 3,
      winCondition: 'health',
    },
  },
} as const;

export type tGameMode = typeof GAME_MODE;
export type tKeyGameMode = keyof typeof GAME_MODE;
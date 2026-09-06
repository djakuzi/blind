import type { tOptionGameMode } from "@/game/types/gameMode.types";
import imgDuelDark from "@/assets/images/gameMode/duel-dark.png";
import imgCombatDark from "@/assets/images/gameMode/combat-dark.png";
import imgClashDark from "@/assets/images/gameMode/clash-dark.png";
import imgBattleDark from "@/assets/images/gameMode/battle-dark.png";
import imgDuelLight from "@/assets/images/gameMode/duel-light.png";
import imgCombatLight from "@/assets/images/gameMode/combat-light.png";
import imgClashLight from "@/assets/images/gameMode/clash-light.png";
import imgBattleLight from "@/assets/images/gameMode/battle-light.png";
import type { tKeyTypeConection } from "@/app/shared/constants/game/typeConnection.conts";

export interface DataGameMode {
    title: string;
    description: string;
    img: {
        dark: string;
        light: string;
    },
    options: tOptionGameMode;
    typeConnection: tKeyTypeConection[];
}

export const GAME_MODE: Record<string, DataGameMode> = {
  DUEL: {
    title: 'DUEL',
    description: 'Одно попадание — одна жизнь',
    img: {
        dark: imgDuelDark,
        light: imgDuelLight,
    },
    options: {
        teamSize: 1,
      players: 2,
      rounds: 3,
      winCondition: 'single-hit',
    },
    typeConnection: ['BLUETOOTH', 'LAN', 'ONLINE'],
  },
  COMBAT: {
    title: 'COMBAT',
    description: 'Сражайся, пока здоровье не закончится',
    img: {
        dark: imgCombatDark,
        light: imgCombatLight,
    },
    options: {
        teamSize: 1,
      players: 2,
      rounds: 3,
      winCondition: 'health',
    },
    typeConnection: ['BLUETOOTH', 'LAN', 'ONLINE'],
  },
  CLASH: {
    title: 'CLASH',
    description: 'Одна жизнь. Одна команда.',
    img: {
        dark: imgClashDark,
        light: imgClashLight,
    },
    options: {
        teamSize: 2,
      players: 4,
      rounds: 3,
      winCondition: 'single-hit',
    },
    typeConnection: ['LAN', 'ONLINE'],
  },
  BATTLE: {
    title: 'BATTLE',
    description: 'Командный бой до последнего выжившего',
    img: {
        dark: imgBattleDark,
        light: imgBattleLight,
    },
    options: {
        teamSize: 2,
      players: 4,
      rounds: 3,
      winCondition: 'health',
    },
    typeConnection: ['LAN', 'ONLINE'],
  },
} as const;

export type tGameMode = typeof GAME_MODE;
export type tKeyGameMode = keyof typeof GAME_MODE;
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameModeWinCondition, tOptionGameMode } from '@/game/types/gameMode.types';
import type {
  iApiGameModeData,
  iApiGameModePlayerOption,
  iApiThemeMedia,
} from '../type/api/common';

export interface iGameMode {
  readonly key: iApiGameModeData['key'];
  readonly name: string;
  readonly description: string;
  readonly rounds: number;
  readonly playerOptions: iApiGameModePlayerOption[];
  readonly locked: boolean;
  readonly lockedText: string | null;
  readonly img: iApiThemeMedia;
  readonly options: tOptionGameMode;
  readonly typeConnection: tKeyTypeConnection[];
}

export interface iPayloadModelGameMode extends iApiGameModeData {
  image: iApiThemeMedia;
}

export class ModelGameMode implements iGameMode {
  readonly key: iApiGameModeData['key'];
  readonly name: string;
  readonly description: string;
  readonly rounds: number;
  readonly playerOptions: iApiGameModePlayerOption[];
  readonly locked: boolean;
  readonly lockedText: string | null;

  private readonly image: iApiThemeMedia;

  constructor(payload: iPayloadModelGameMode) {
    this.key = payload.key;
    this.name = payload.name;
    this.description = payload.description;
    this.rounds = payload.rounds;
    this.playerOptions = payload.playerOptions;
    this.locked = payload.locked;
    this.lockedText = payload.lockedText;
    this.image = payload.image;
  }

  get img(): iApiThemeMedia {
    return this.image;
  }

  get options(): tOptionGameMode {
    const option = this.getDefaultPlayerOption();

    return {
      players: option.players,
      teamSize: option.teamSize,
      rounds: this.rounds,
      winCondition: this.getWinCondition(),
    };
  }

  get typeConnection(): tKeyTypeConnection[] {
    return this.getDefaultPlayerOption().connections;
  }

  private getDefaultPlayerOption(): iApiGameModePlayerOption {
    const option = this.playerOptions[0];

    if (!option) {
      throw new Error(`Game mode "${this.key}" has no player options`);
    }

    return option;
  }

  private getWinCondition(): tGameModeWinCondition {
    if (this.key === 'single-hit' || this.key === 'health') {
      return this.key;
    }

    throw new Error(`Game mode "${this.key}" has no playable win condition`);
  }
}

import type {
  iApiGameModeData,
  iApiThemeMedia,
} from '../type/api/common';

export interface iGameMode {
  readonly key: iApiGameModeData['key'];
  readonly name: string;
  readonly rounds: number;
  readonly options: string[];
  readonly locked: boolean;
  readonly lockedText: string | null;
  readonly img: iApiThemeMedia;
}

export interface iPayloadModelGameMode extends iApiGameModeData {
  image: iApiThemeMedia;
}

export class ModelGameMode implements iGameMode {
  readonly key: iApiGameModeData['key'];
  readonly name: string;
  readonly rounds: number;
  readonly options: string[];
  readonly locked: boolean;
  readonly lockedText: string | null;

  private readonly image: iApiThemeMedia;

  constructor(payload: iPayloadModelGameMode) {
    this.key = payload.key;
    this.name = payload.name;
    this.rounds = payload.rounds;
    this.options = payload.options;
    this.locked = payload.locked;
    this.lockedText = payload.lockedText;
    this.image = payload.image;
  }

  get img(): iApiThemeMedia {
    return this.image;
  }
}

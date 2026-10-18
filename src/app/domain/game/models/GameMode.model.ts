import type { iApiGameModeData, iApiThemeMedia } from '../type/api/common';

export interface iGameMode {
  readonly key: iApiGameModeData['key'];
  readonly name: string;
  readonly rounds: number;
  readonly keyOptions: string[];
  readonly locked: boolean;
  readonly img: iApiThemeMedia;
}

export interface iPayloadModelGameMode extends iApiGameModeData {
  image: iApiThemeMedia;
}

export class ModelGameMode implements iGameMode {
  readonly key: iApiGameModeData['key'];
  readonly name: string;
  readonly rounds: number;
  readonly keyOptions: string[];
  readonly locked: boolean;

  private readonly image: iApiThemeMedia;

  constructor(payload: iPayloadModelGameMode) {
    this.key = payload.key;
    this.name = payload.name;
    this.rounds = payload.rounds;
    this.keyOptions = payload.keyOptions;
    this.locked = payload.locked;
    this.image = payload.image;
  }

  get img(): iApiThemeMedia {
    return this.image;
  }
}

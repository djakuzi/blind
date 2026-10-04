import type { iApiGameModeData } from '../type/api/common';

export interface iPayloadModelGameMode extends iApiGameModeData {
  key: string;
}

export class ModelGameMode {
  readonly key: string;
  readonly img: iApiGameModeData['img'];
  readonly options: iApiGameModeData['options'];
  readonly typeConnection: iApiGameModeData['typeConnection'];

  constructor(payload: iPayloadModelGameMode) {
    this.key = payload.key;
    this.img = payload.img;
    this.options = payload.options;
    this.typeConnection = payload.typeConnection;
  }
}

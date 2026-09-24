import type { DataGameMode, tKeyGameMode } from '../constants/gameMode.const';

export interface iPayloadModelGameMode
  extends DataGameMode {
  key: tKeyGameMode
}

export class ModelGameMode {
  readonly key: tKeyGameMode;
  readonly img: DataGameMode['img'];
  readonly options: DataGameMode['options'];
  readonly typeConnection: DataGameMode['typeConnection'];

  constructor(
    payload: iPayloadModelGameMode,
  ) {
    this.key = payload.key;
    this.img = payload.img;
    this.options = payload.options;
    this.typeConnection = payload.typeConnection;
  }
}

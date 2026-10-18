import type { iApiGameModeOptionData } from '../type/api/common';

export interface iGameModeOption extends iApiGameModeOptionData {
  readonly key: string;
}

export interface iPayloadModelGameModeOption extends iApiGameModeOptionData {
  key: string;
}

export class ModelGameModeOption implements iGameModeOption {
  readonly key: string;
  readonly players: number;
  readonly teamSize: number;
  readonly connections: iApiGameModeOptionData['connections'];
  readonly icon: iApiGameModeOptionData['icon'];

  constructor(payload: iPayloadModelGameModeOption) {
    this.key = payload.key;
    this.players = payload.players;
    this.teamSize = payload.teamSize;
    this.connections = payload.connections;
    this.icon = payload.icon;
  }
}

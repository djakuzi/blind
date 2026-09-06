import {
  GAME_MODE,
  type tKeyGameMode,
} from '../constants/gameMode.const';
import {
  ModelGameMode,
} from '../models/GameMode.model';

export class ApiGame {
  async getModes(): Promise<ModelGameMode[]> {
    const modeKeys =
      Object.keys(GAME_MODE) as tKeyGameMode[];

    return modeKeys.map((key) =>
      new ModelGameMode({
        key,
        ...GAME_MODE[key],
      }),
    );
  }
}

export const apiGame = new ApiGame();
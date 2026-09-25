import { publicClient } from '@/app/shared/api';
import { ModelGameMode } from '../models/GameMode.model';
import type { iResponseGameMode } from '../type/api/res';

export class ApiGame {
  async getModes(): Promise<ModelGameMode[]> {
    const modes = await publicClient.get<iResponseGameMode[]>('/game/gameModes.json');

    return modes.map((mode) => new ModelGameMode(mode));
  }
}

export const apiGame = new ApiGame();

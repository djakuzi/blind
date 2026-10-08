import { apiClient } from '@/app/shared/api';
import { ModelGameMode } from '../models/GameMode.model';
import type { iApiGameModesResourceData } from '../type/api/common';
import type { iResponseGameModes } from '../type/api/res';

export interface iGameModesData {
  modes: ModelGameMode[];
  data: iApiGameModesResourceData;
}

export class ApiGame {
  async getModes(): Promise<iGameModesData> {
    const response = await apiClient.get<iResponseGameModes>('/game/gameModes.json');

    const modes = response.modes.map((mode) => {
      const modeData = response.data.modes[mode.key];

      return new ModelGameMode({
        ...mode,
        image: modeData.image,
      });
    });

    return {
      modes,
      data: response.data,
    };
  }
}

export const apiGame = new ApiGame();

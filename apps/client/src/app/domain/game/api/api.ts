import { apiClient } from '@/app/shared/api';
import { ModelGameMode } from '../models/GameMode.model';
import { ModelGameModeOption } from '../models/GameModeOption.model';
import type { iResponseGameModes } from '../type/api/res';

export interface iGameModesData {
  modes: ModelGameMode[];
  options: Record<string, ModelGameModeOption>;
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

    const options = Object.fromEntries(
      Object.entries(response.data.options).map(([key, option]) => [key, new ModelGameModeOption({ key, ...option })]),
    );

    return {
      modes,
      options,
    };
  }
}

export const apiGame = new ApiGame();

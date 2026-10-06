import { apiClient } from '@/app/shared/api';
import { ModelGameMode } from '../models/GameMode.model';
import type { iApiGameModesMedia } from '../type/api/common';
import type { iResponseGameModes } from '../type/api/res';

export interface iGameModesData {
  modes: ModelGameMode[];
  media: iApiGameModesMedia;
}

export class ApiGame {
  async getModes(): Promise<iGameModesData> {
    const response = await apiClient.get<iResponseGameModes>('/game/gameModes.json');

    const modes = response.modes.map((mode) => {
      const modeMedia = response.media.modes[mode.key];

      return new ModelGameMode({
        ...mode,
        image: modeMedia.image,
      });
    });

    return {
      modes,
      media: response.media,
    };
  }
}

export const apiGame = new ApiGame();

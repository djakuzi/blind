import { publicClient } from '@/app/shared/api';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tOptionGameMode } from '@/game/types/gameMode.types';
import type { tKeyGameMode } from '../constants/gameMode.const';
import { ModelGameMode } from '../models/GameMode.model';

interface iResponseGameMode {
  key: tKeyGameMode
  img: {
    dark: string
    light: string
  }
  options: tOptionGameMode
  typeConnection: tKeyTypeConnection[]
}

export class ApiGame {
  async getModes(): Promise<ModelGameMode[]> {
    const modes =
      await publicClient.get<iResponseGameMode[]>(
        '/game/gameModes.json',
      );

    return modes.map((mode) =>
      new ModelGameMode(mode),
    );
  }
}

export const apiGame = new ApiGame();

import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModesMedia } from '@/app/domain/game/type/api/common';

export interface iGameState {
  modes: iGameMode[];
  media: iApiGameModesMedia | null;
}

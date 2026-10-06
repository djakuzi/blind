import type { ModelGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModesMedia } from '@/app/domain/game/type/api/common';

export interface iGameState {
  modes: ModelGameMode[];
  media: iApiGameModesMedia | null;
}

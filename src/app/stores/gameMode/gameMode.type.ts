import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModesResourceData } from '@/app/domain/game/type/api/common';

export interface iGameModeState {
  modes: iGameMode[];
  data: iApiGameModesResourceData | null;
}

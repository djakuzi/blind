import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iGameModeOption } from '@/app/domain/game/models/GameModeOption.model';

export interface iGameModeState {
  modes: iGameMode[];
  options: Record<string, iGameModeOption> | null;
}

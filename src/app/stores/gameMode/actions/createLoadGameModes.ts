import { apiGame } from '@/app/domain/game/api/api';
import type { iGameModeState } from '../gameMode.type';

export function createLoadGameModes() {
  return async function loadGameModes(this: iGameModeState) {
    const result = await apiGame.getModes();

    this.modes = result.modes;
    this.data = result.data;

    return result;
  };
}

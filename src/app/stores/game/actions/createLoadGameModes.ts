import { apiGame } from '@/app/domain/game/api/api';
import type { iGameState } from '../game.type';

export function createLoadGameModes() {
  return async function loadGameModes(this: iGameState) {
    const result = await apiGame.getModes();

    this.modes = result.modes;
    this.data = result.data;

    return result;
  };
}

import { apiGame } from '@/app/domain/game/api/api';
import type { iGameState } from '../game.type';

export function createLoadGameModes() {
  return async function loadGameModes(this: iGameState) {
    const modes = await apiGame.getModes();

    this.modes = modes;

    return modes;
  };
}

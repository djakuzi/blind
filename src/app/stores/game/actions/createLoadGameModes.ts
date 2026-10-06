import { apiGame } from '@/app/domain/game/api/api';
import type { iGameState } from '../game.type';

export function createLoadGameModes() {
  return async function loadGameModes(this: iGameState) {
    const data = await apiGame.getModes();

    this.modes = data.modes;
    this.media = data.media;

    return data;
  };
}

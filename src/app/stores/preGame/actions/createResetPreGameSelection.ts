import type { iPreGameState } from '../preGame.type';

export function createResetPreGameSelection() {
  return function resetPreGameSelection(this: iPreGameState) {
    this.mode = null;
    this.players = null;
    this.connection = null;
  };
}

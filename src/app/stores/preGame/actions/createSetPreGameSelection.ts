import type { iPreGameSelection, iPreGameState } from '../preGame.type';

export function createSetPreGameSelection() {
  return function setPreGameSelection(
    this: iPreGameState,
    selection: iPreGameSelection,
  ) {
    this.mode = selection.mode;
    this.players = selection.players;
    this.connection = selection.connection;
  };
}

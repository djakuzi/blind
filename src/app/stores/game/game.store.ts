import { defineStore } from 'pinia';
import { createLoadGameModes } from './actions/createLoadGameModes';
import type { iGameState } from './game.type';

export const useGameStore = defineStore('game', {
  state: (): iGameState => ({
    modes: [],
  }),

  actions: {
    loadGameModes: createLoadGameModes(),
  },
});

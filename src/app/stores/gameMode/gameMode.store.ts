import { defineStore } from 'pinia';
import { createLoadGameModes } from './actions/createLoadGameModes';
import type { iGameModeState } from './gameMode.type';

export const useGameModeStore = defineStore('gameMode', {
  state: (): iGameModeState => ({
    modes: [],
    data: null,
  }),

  actions: {
    loadGameModes: createLoadGameModes(),
  },
});

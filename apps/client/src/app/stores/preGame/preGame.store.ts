import { defineStore } from 'pinia';
import { createResetPreGameSelection } from './actions/createResetPreGameSelection';
import { createSetPreGameSelection } from './actions/createSetPreGameSelection';
import type { iPreGameState } from './preGame.type';

export const usePreGameStore = defineStore('preGame', {
  state: (): iPreGameState => ({
    mode: null,
    players: null,
    connection: null,
  }),

  actions: {
    setSelection: createSetPreGameSelection(),
    reset: createResetPreGameSelection(),
  },
});

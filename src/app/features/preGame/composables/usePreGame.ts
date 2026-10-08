import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import type { LocationQueryRaw } from 'vue-router';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';
import { usePreGameStore } from '@/app/stores/preGame/preGame.store';
import type { iPreGameSelection } from '@/app/stores/preGame/preGame.type';
import type { tGameModeKey } from '@/game/types/gameMode.types';
import {
  createPreGameSelectionQuery,
  isPreGameSelectionQueryCurrent,
  normalizePreGameSelection,
  readPreGameQueryValue,
} from '../helpers/preGameSelection.helper';
import type { iPreGameSelectionInput } from '../helpers/preGameSelection.helper';

export interface iPreGameSelectionPatch {
  mode?: tGameModeKey;
  players?: string;
  connection?: tKeyTypeConnection;
}

export function usePreGame() {
  const route = useRoute();
  const router = useRouter();
  const gameModeStore = useGameModeStore();
  const preGameStore = usePreGameStore();

  const { mode, players, connection } = storeToRefs(preGameStore);

  let isWritingQuery = false;
  let updateQueue = Promise.resolve();
  let latestUpdate = Promise.resolve();

  const selectionQuery = computed<LocationQueryRaw>(() =>
    createPreGameSelectionQuery({
      mode: mode.value,
      players: players.value,
      connection: connection.value,
    }),
  );

  function getNormalizedSelection(input: iPreGameSelectionInput) {
    return normalizePreGameSelection(input, gameModeStore.modes, gameModeStore.data);
  }

  function createCurrentRouteQuery(selection: iPreGameSelection): LocationQueryRaw {
    const nextQuery: LocationQueryRaw = {
      ...route.query,
    };

    delete nextQuery.mode;
    delete nextQuery.players;
    delete nextQuery.connection;

    return {
      ...nextQuery,
      ...createPreGameSelectionQuery(selection),
    };
  }

  async function writeSelectionQuery(selection: iPreGameSelection) {
    if (isPreGameSelectionQueryCurrent(route.query, selection)) {
      return;
    }

    isWritingQuery = true;

    try {
      await router.replace({
        query: createCurrentRouteQuery(selection),
      });
    } finally {
      isWritingQuery = false;
    }
  }

  function enqueueUpdate(operation: () => Promise<void>) {
    const operationPromise = updateQueue.then(operation);

    latestUpdate = operationPromise;
    updateQueue = operationPromise.catch((error) => {
      console.error('Failed to update pre-game selection:', error);
    });

    return operationPromise;
  }

  function syncFromQuery() {
    if (!gameModeStore.modes.length || !gameModeStore.data) {
      return Promise.resolve();
    }

    return enqueueUpdate(async () => {
      const selection = getNormalizedSelection({
        mode: readPreGameQueryValue(route.query.mode) ?? preGameStore.mode,
        players: readPreGameQueryValue(route.query.players) ?? preGameStore.players,
        connection: readPreGameQueryValue(route.query.connection) ?? preGameStore.connection,
      });

      await writeSelectionQuery(selection);
      preGameStore.setSelection(selection);
    });
  }

  function setSelection(patch: iPreGameSelectionPatch) {
    return enqueueUpdate(async () => {
      const selection = getNormalizedSelection({
        mode: patch.mode ?? preGameStore.mode,
        players: patch.players ?? preGameStore.players,
        connection: patch.connection ?? preGameStore.connection,
      });

      await writeSelectionQuery(selection);
      preGameStore.setSelection(selection);
    });
  }

  function flushSelection() {
    return latestUpdate;
  }

  watch(
    [() => route.query.mode, () => route.query.players, () => route.query.connection, () => gameModeStore.modes, () => gameModeStore.data],
    () => {
      if (!isWritingQuery) {
        syncFromQuery();
      }
    },
    { immediate: true },
  );

  return {
    mode,
    players,
    connection,
    selectionQuery,
    setSelection,
    syncFromQuery,
    flushSelection,
  };
}

import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { LocationQueryRaw } from 'vue-router';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';
import { usePreGameStore } from '@/app/stores/preGame/preGame.store';
import type { iPreGameSelection } from '@/app/stores/preGame/preGame.type';
import type { tGameModeKey } from '@/game/types/gameMode.types';

export interface iPreGameSelectionPatch {
  mode?: tGameModeKey | null;
  players?: string | null;
  connection?: tKeyTypeConnection | null;
}

interface iPreGameSelectionInput {
  mode?: string | null;
  players?: string | null;
  connection?: string | null;
}

export function usePreGame() {
  const route = useRoute();
  const router = useRouter();
  const gameModeStore = useGameModeStore();
  const preGameStore = usePreGameStore();

  let isWritingQuery = false;
  let updateQueue = Promise.resolve();

  const mode = computed(() => preGameStore.mode);
  const players = computed(() => preGameStore.players);
  const connection = computed(() => preGameStore.connection);

  const query = computed<LocationQueryRaw>(() => createSelectionQuery({
    mode: mode.value,
    players: players.value,
    connection: connection.value,
  }));

  function readQueryValue(value: unknown): string | null {
    if (Array.isArray(value)) {
      const firstValue = value[0];

      return typeof firstValue === 'string' ? firstValue : null;
    }

    return typeof value === 'string' ? value : null;
  }

  function resolveModeKey(value: string | null | undefined): tGameModeKey | null {
    const mode = gameModeStore.modes.find((item) => item.key === value);

    return mode?.key ?? gameModeStore.modes[0]?.key ?? null;
  }

  function resolvePlayersKey(
    modeKey: tGameModeKey | null,
    value: string | null | undefined,
  ): string | null {
    const mode = gameModeStore.modes.find((item) => item.key === modeKey);

    if (!mode) {
      return null;
    }

    const availablePlayers = mode.options.filter(
      (key) => gameModeStore.data?.players[key] !== undefined,
    );

    if (value && availablePlayers.includes(value)) {
      return value;
    }

    return availablePlayers[0] ?? null;
  }

  function resolveConnectionType(
    playersKey: string | null,
    value: string | null | undefined,
  ): tKeyTypeConnection | null {
    if (!playersKey) {
      return null;
    }

    const availableConnections =
      gameModeStore.data?.players[playersKey]?.connections ?? [];

    return (
      availableConnections.find((connectionType) => connectionType === value) ??
      availableConnections[0] ??
      null
    );
  }

  function normalizeSelection(
    input: iPreGameSelectionInput,
  ): iPreGameSelection {
    const mode = resolveModeKey(input.mode);
    const players = resolvePlayersKey(mode, input.players);
    const connection = resolveConnectionType(players, input.connection);

    return {
      mode,
      players,
      connection,
    };
  }

  function createSelectionQuery(
    selection: iPreGameSelection,
  ): LocationQueryRaw {
    const nextQuery: LocationQueryRaw = {
      ...route.query,
    };

    if (selection.mode) {
      nextQuery.mode = selection.mode;
    } else {
      delete nextQuery.mode;
    }

    if (selection.players) {
      nextQuery.players = selection.players;
    } else {
      delete nextQuery.players;
    }

    if (selection.connection) {
      nextQuery.connection = selection.connection;
    } else {
      delete nextQuery.connection;
    }

    return nextQuery;
  }

  function isSelectionQueryCurrent(selection: iPreGameSelection) {
    return (
      readQueryValue(route.query.mode) === selection.mode &&
      readQueryValue(route.query.players) === selection.players &&
      readQueryValue(route.query.connection) === selection.connection
    );
  }

  async function writeSelectionQuery(selection: iPreGameSelection) {
    if (isSelectionQueryCurrent(selection)) {
      return;
    }

    isWritingQuery = true;

    try {
      await router.replace({
        query: createSelectionQuery(selection),
      });
    } finally {
      isWritingQuery = false;
    }
  }

  function enqueueUpdate(operation: () => Promise<void>) {
    updateQueue = updateQueue
      .then(operation)
      .catch((error) => {
        console.error('Failed to update pre-game selection:', error);
      });

    return updateQueue;
  }

  function syncFromQuery() {
    if (!gameModeStore.modes.length || !gameModeStore.data) {
      return Promise.resolve();
    }

    return enqueueUpdate(async () => {
      const selection = normalizeSelection({
        mode: readQueryValue(route.query.mode) ?? preGameStore.mode,
        players: readQueryValue(route.query.players) ?? preGameStore.players,
        connection:
          readQueryValue(route.query.connection) ?? preGameStore.connection,
      });

      await writeSelectionQuery(selection);
      preGameStore.setSelection(selection);
    });
  }

  function setSelection(patch: iPreGameSelectionPatch) {
    return enqueueUpdate(async () => {
      const selection = normalizeSelection({
        mode: patch.mode ?? preGameStore.mode,
        players: patch.players ?? preGameStore.players,
        connection: patch.connection ?? preGameStore.connection,
      });

      await writeSelectionQuery(selection);
      preGameStore.setSelection(selection);
    });
  }

  function flushSelection() {
    return updateQueue;
  }

  watch(
    [
      () => route.query.mode,
      () => route.query.players,
      () => route.query.connection,
      () => gameModeStore.modes,
      () => gameModeStore.data,
    ],
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
    query,
    setSelection,
    syncFromQuery,
    flushSelection,
  };
}

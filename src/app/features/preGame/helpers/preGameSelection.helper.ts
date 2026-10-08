import type { LocationQueryRaw } from 'vue-router';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModesResourceData } from '@/app/domain/game/type/api/common';
import type { iPreGameSelection } from '@/app/stores/preGame/preGame.type';

export interface iPreGameSelectionInput {
  mode?: string | null;
  players?: string | null;
  connection?: string | null;
}

export function readPreGameQueryValue(value: unknown): string | null {
  if (Array.isArray(value)) {
    const firstValue = value[0];

    return typeof firstValue === 'string' ? firstValue : null;
  }

  return typeof value === 'string' ? value : null;
}

export function normalizePreGameSelection(
  input: iPreGameSelectionInput,
  modes: iGameMode[],
  data: iApiGameModesResourceData | null,
): iPreGameSelection {
  const mode = modes.find((item) => item.key === input.mode) ?? modes[0] ?? null;
  const availablePlayers = mode?.options.filter((key) => data?.players[key] !== undefined) ?? [];

  const players = input.players && availablePlayers.includes(input.players) ? input.players : (availablePlayers[0] ?? null);

  const availableConnections = players ? (data?.players[players]?.connections ?? []) : [];

  const connection = availableConnections.find((connectionType) => connectionType === input.connection) ?? availableConnections[0] ?? null;

  return {
    mode: mode?.key ?? null,
    players,
    connection,
  };
}

export function createPreGameSelectionQuery(selection: iPreGameSelection): LocationQueryRaw {
  const query: LocationQueryRaw = {};

  if (selection.mode) {
    query.mode = selection.mode;
  }

  if (selection.players) {
    query.players = selection.players;
  }

  if (selection.connection) {
    query.connection = selection.connection;
  }

  return query;
}

export function isPreGameSelectionQueryCurrent(query: Record<string, unknown>, selection: iPreGameSelection) {
  return (
    readPreGameQueryValue(query.mode) === selection.mode &&
    readPreGameQueryValue(query.players) === selection.players &&
    readPreGameQueryValue(query.connection) === selection.connection
  );
}

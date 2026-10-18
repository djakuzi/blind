import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { iGameMode } from '../models/GameMode.model';
import type { iApiGameModesResourceData } from '../type/api/common';
import type { tGameSessionEntryAction } from '../type/session/action';
import type { iGameSessionConfig, iGameSessionSelection } from '../type/session/config';

const SESSION_ENTRY_ACTIONS = {
  [TYPE_CONNECTION.BLUETOOTH]: ['create', 'join'],
  [TYPE_CONNECTION.LAN]: ['create', 'join'],
  [TYPE_CONNECTION.ONLINE]: ['create', 'join', 'quickMatch'],
} as const satisfies Record<tKeyTypeConnection, readonly tGameSessionEntryAction[]>;

export class ServiceGameSession {
  getConfig(
    selection: iGameSessionSelection,
    modes: readonly iGameMode[],
    data: iApiGameModesResourceData | null,
  ): iGameSessionConfig | null {
    if (!selection.mode || !selection.players || !selection.connection || !data) {
      return null;
    }

    const mode = modes.find((item) => item.key === selection.mode);

    if (!mode || mode.locked || (mode.key !== 'single-hit' && mode.key !== 'health') || !mode.options.includes(selection.players)) {
      return null;
    }

    const playerOption = data.players[selection.players];

    if (
      !playerOption ||
      !playerOption.connections.includes(selection.connection) ||
      !Number.isInteger(playerOption.players) ||
      !Number.isInteger(playerOption.teamSize) ||
      !Number.isInteger(mode.rounds) ||
      playerOption.players <= 0 ||
      playerOption.teamSize <= 0 ||
      mode.rounds <= 0 ||
      playerOption.players !== playerOption.teamSize * 2
    ) {
      return null;
    }

    return {
      format: selection.players,
      connection: selection.connection,
      players: playerOption.players,
      teamSize: playerOption.teamSize,
      rounds: mode.rounds,
      winCondition: mode.key,
    };
  }

  getEntryActions(config: iGameSessionConfig): readonly tGameSessionEntryAction[] {
    return SESSION_ENTRY_ACTIONS[config.connection];
  }
}

export const serviceGameSession = new ServiceGameSession();

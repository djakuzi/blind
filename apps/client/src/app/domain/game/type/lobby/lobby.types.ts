import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameModeKey } from '@/game/types/gameMode.types';

export interface iCreateLobbyOptions {
  mode: tGameModeKey;
  players: string;
  connection: tKeyTypeConnection;
}

export type tFindLobbyQuery = { connection: 'BLUETOOTH' } | { connection: 'LAN' | 'ONLINE'; code: string };

export type tLobbyTarget = { connection: 'BLUETOOTH'; deviceId: string } | { connection: 'LAN' | 'ONLINE'; code: string };

export interface iLobby {
  connection: tKeyTypeConnection;
}

export type tLobbyOperationResult<T> = { status: 'success'; value: T } | { status: 'unavailable' };

export interface iLobbyService {
  create(options: iCreateLobbyOptions): Promise<tLobbyOperationResult<iLobby>>;
  find(query: tFindLobbyQuery): Promise<tLobbyOperationResult<tLobbyTarget[]>>;
  join(target: tLobbyTarget): Promise<tLobbyOperationResult<iLobby>>;
}

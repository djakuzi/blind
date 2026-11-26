import type {
  iCreateLobbyOptions,
  iLobby,
  iLobbyService,
  tFindLobbyQuery,
  tLobbyOperationResult,
  tLobbyTarget,
} from '../type/lobby/lobby.types';

export class ServiceLobby implements iLobbyService {
  async create(_options: iCreateLobbyOptions): Promise<tLobbyOperationResult<iLobby>> {
    return { status: 'unavailable' };
  }

  async find(_query: tFindLobbyQuery): Promise<tLobbyOperationResult<tLobbyTarget[]>> {
    return { status: 'unavailable' };
  }

  async join(_target: tLobbyTarget): Promise<tLobbyOperationResult<iLobby>> {
    return { status: 'unavailable' };
  }
}

export const serviceLobby = new ServiceLobby();

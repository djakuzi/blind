import type {
  iCreateLobbyOptions,
  iLobby,
  iLobbyService,
  tFindLobbyQuery,
  tLobbyOperationResult,
  tLobbyTarget,
} from '@/app/domain/game/type/lobby/lobby.types';

// Temporary local implementation for navigating the lobby flow without a transport.
class MockLobbyService implements iLobbyService {
  async create(options: iCreateLobbyOptions): Promise<tLobbyOperationResult<iLobby>> {
    return { status: 'success', value: { connection: options.connection } };
  }

  async find(query: tFindLobbyQuery): Promise<tLobbyOperationResult<tLobbyTarget[]>> {
    if (query.connection === 'BLUETOOTH') {
      return { status: 'success', value: [{ connection: 'BLUETOOTH', deviceId: 'demo-device' }] };
    }
    return { status: 'success', value: [{ connection: query.connection, code: query.code }] };
  }

  async join(target: tLobbyTarget): Promise<tLobbyOperationResult<iLobby>> {
    return { status: 'success', value: { connection: target.connection } };
  }
}

export const mockLobbyService: iLobbyService = new MockLobbyService();

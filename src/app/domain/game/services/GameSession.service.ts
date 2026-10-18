import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import { SESSION_ENTRY_ACTIONS } from '../constants/sessionEntryActions.const';
import type { tGameSessionEntryAction } from '../type/session/action';

export class ServiceGameSession {
  getEntryActions(connection: tKeyTypeConnection): readonly tGameSessionEntryAction[] {
    return SESSION_ENTRY_ACTIONS[connection];
  }
}

export const serviceGameSession = new ServiceGameSession();

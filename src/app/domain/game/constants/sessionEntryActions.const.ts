import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import type { tGameSessionEntryAction } from '../type/session/action';

export const SESSION_ENTRY_ACTIONS = {
  [TYPE_CONNECTION.BLUETOOTH]: ['create', 'join'],
  [TYPE_CONNECTION.LAN]: ['create', 'join'],
  [TYPE_CONNECTION.ONLINE]: ['create', 'join', 'quickMatch'],
} as const satisfies Record<tKeyTypeConnection, readonly tGameSessionEntryAction[]>;

import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

export const SESSION_ENTRY_ACTION = {
  CREATE: 'create',
  JOIN: 'join',
  QUICK_MATCH: 'quickMatch',
} as const;

export type tGameSessionEntryAction = (typeof SESSION_ENTRY_ACTION)[keyof typeof SESSION_ENTRY_ACTION];

export const SESSION_ENTRY_ACTIONS = {
  [TYPE_CONNECTION.BLUETOOTH]: [SESSION_ENTRY_ACTION.CREATE, SESSION_ENTRY_ACTION.JOIN],
  [TYPE_CONNECTION.LAN]: [SESSION_ENTRY_ACTION.CREATE, SESSION_ENTRY_ACTION.JOIN],
  [TYPE_CONNECTION.ONLINE]: [SESSION_ENTRY_ACTION.CREATE, SESSION_ENTRY_ACTION.JOIN, SESSION_ENTRY_ACTION.QUICK_MATCH],
} as const satisfies Record<tKeyTypeConnection, readonly tGameSessionEntryAction[]>;

export const TYPE_CONNECTION = {
  BLUETOOTH: 'BLUETOOTH',
  LAN: 'LAN',
  ONLINE: 'ONLINE',
} as const;

export type tTypeConnection = typeof TYPE_CONNECTION;
export type tKeyTypeConnection = keyof typeof TYPE_CONNECTION;

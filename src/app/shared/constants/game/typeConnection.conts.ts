export const TYPE_CONNECTION = {
  BLUETOOTH: {
    name: 'BLUETOOTH',
    title: 'Bluetooth',
    description: 'Игрок поблизости'
  },
  LAN: {
    name: 'LAN',
    title: 'Локальная сеть',
    description: 'Одна сеть Wi-fi'
  },
  ONLINE: {
    name: 'ONLINE',
    title: 'Онлайн',
    description: 'Играй по сети'
  },

} as const;




export type tTypeConection = typeof TYPE_CONNECTION;
export type tKeyTypeConection = keyof typeof TYPE_CONNECTION;
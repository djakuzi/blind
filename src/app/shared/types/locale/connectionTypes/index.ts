import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

interface iLocaleConnectionType {
  title: string
  description: string
}

export type LocaleConnectionTypes =
  Record<tKeyTypeConnection, iLocaleConnectionType>;

import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import BluetoothDark from '@/assets/icons/connectionType/bluetooth-dark.svg?url';
import BluetoothLight from '@/assets/icons/connectionType/bluetooth-light.svg?url';
import LanDark from '@/assets/icons/connectionType/lan-dark.svg?url';
import LanLight from '@/assets/icons/connectionType/lan-light.svg?url';
import OnlineDark from '@/assets/icons/connectionType/online-dark.svg?url';
import OnlineLight from '@/assets/icons/connectionType/online-light.svg?url';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import type { iAppSegmentedCardOption, iAppSegmentedCardOptionImage } from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

const CONNECTION_IMAGES: Record<tKeyTypeConnection, iAppSegmentedCardOptionImage> = {
  BLUETOOTH: { light: BluetoothLight, dark: BluetoothDark },
  LAN: { light: LanLight, dark: LanDark },
  ONLINE: { light: OnlineLight, dark: OnlineDark },
};

export function useGameModeConnectionOptions(
  connections: MaybeRefOrGetter<readonly tKeyTypeConnection[]> = Object.values(TYPE_CONNECTION),
  availableConnections?: MaybeRefOrGetter<readonly tKeyTypeConnection[]>,
) {
  const connectionLocale = useLocale((locale) => locale.connectionTypes);

  const connectionOptions = computed<iAppSegmentedCardOption[]>(() => {
    const available = availableConnections === undefined ? null : toValue(availableConnections);

    return toValue(connections).map((connection) => ({
      value: connection,
      label: connectionLocale.value[connection].title,
      image: CONNECTION_IMAGES[connection],
      ...(available === null ? {} : { disabled: !available.includes(connection) }),
    }));
  });

  return { connectionOptions };
}

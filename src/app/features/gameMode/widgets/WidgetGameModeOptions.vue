<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BluetoothDark from '@/assets/icons/connectionType/bluetooth-dark.svg?url';
import BluetoothLight from '@/assets/icons/connectionType/bluetooth-light.svg?url';
import LanDark from '@/assets/icons/connectionType/lan-dark.svg?url';
import LanLight from '@/assets/icons/connectionType/lan-light.svg?url';
import OnlineDark from '@/assets/icons/connectionType/online-dark.svg?url';
import OnlineLight from '@/assets/icons/connectionType/online-light.svg?url';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModePlayerData } from '@/app/domain/game/type/api/common';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import type {
  iAppSegmentedCardOption,
  iAppSegmentedCardOptionImage,
} from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';

export interface PropsWidgetGameModeOptions {
  mode: iGameMode;
  players?: string | null;
  connection?: tKeyTypeConnection | null;
}

export type iWidgetGameModeOptionsSelection =
  | {
      key: 'players';
      value: string;
    }
  | {
      key: 'connection';
      value: tKeyTypeConnection;
    };

interface iResolvedPlayerOption extends iApiGameModePlayerData {
  key: string;
}

const CONNECTION_IMAGES: Record<tKeyTypeConnection, iAppSegmentedCardOptionImage> = {
  BLUETOOTH: {
    light: BluetoothLight,
    dark: BluetoothDark,
  },
  LAN: {
    light: LanLight,
    dark: LanDark,
  },
  ONLINE: {
    light: OnlineLight,
    dark: OnlineDark,
  },
};

const props = withDefaults(defineProps<PropsWidgetGameModeOptions>(), {
  players: null,
  connection: null,
});

const emit = defineEmits<{
  select: [selection: iWidgetGameModeOptionsSelection];
}>();

const gameModeStore = useGameModeStore();
const preGameLocale = useLocale((locale) => locale.views.preGame.index.ui);
const connectionLocale = useLocale((locale) => locale.connectionTypes);

const selectedPlayerOptionKey = ref('');
const selectedConnectionType = ref<tKeyTypeConnection | ''>('');

function resolvePlayerOption(key: string): iResolvedPlayerOption | null {
  if (!props.mode.options.includes(key)) {
    return null;
  }

  const option = gameModeStore.data?.players[key];

  return option
    ? {
        key,
        ...option,
      }
    : null;
}

const resolvedPlayerOptions = computed(() =>
  props.mode.options
    .map(resolvePlayerOption)
    .filter((option): option is iResolvedPlayerOption => option !== null),
);

const selectedPlayerOption = computed(
  () =>
    resolvePlayerOption(selectedPlayerOptionKey.value) ??
    resolvedPlayerOptions.value[0] ??
    null,
);

const availableConnections = computed(() => selectedPlayerOption.value?.connections ?? []);

const playerOptions = computed<iAppSegmentedCardOption[]>(() =>
  resolvedPlayerOptions.value.map((option) => ({
    value: option.key,
    label: formatPlayerOption(option),
    image: {
      light: option.icon.light,
      dark: option.icon.dark,
    },
  })),
);

const connectionTypes = computed(() => [
  ...new Set(resolvedPlayerOptions.value.flatMap((option) => option.connections)),
]);

const connectionOptions = computed<iAppSegmentedCardOption[]>(() =>
  connectionTypes.value.map((connectionType) => ({
    value: connectionType,
    label: connectionLocale.value[connectionType].title,
    image: CONNECTION_IMAGES[connectionType],
    disabled: !availableConnections.value.includes(connectionType),
  })),
);

function formatPlayerOption({ players, teamSize }: iApiGameModePlayerData) {
  if (players <= 0 || teamSize <= 0) {
    return String(players);
  }

  const teamCount = players / teamSize;

  if (!Number.isInteger(teamCount) || teamCount < 2) {
    return String(players);
  }

  return Array(teamCount).fill(teamSize).join(' VS ');
}

function syncSelections() {
  const playerOption =
    resolvePlayerOption(props.players ?? '') ??
    resolvedPlayerOptions.value[0] ??
    null;

  selectedPlayerOptionKey.value = playerOption?.key ?? '';

  const connections = playerOption?.connections ?? [];

  selectedConnectionType.value =
    props.connection && connections.includes(props.connection)
      ? props.connection
      : connections[0] ?? '';
}

function handlePlayerOptionChange(value: string) {
  const playerOption = resolvePlayerOption(value);

  if (!playerOption) {
    return;
  }

  selectedPlayerOptionKey.value = playerOption.key;

  if (!playerOption.connections.includes(selectedConnectionType.value as tKeyTypeConnection)) {
    selectedConnectionType.value = playerOption.connections[0] ?? '';
  }

  emit('select', {
    key: 'players',
    value: playerOption.key,
  });
}

function handleConnectionChange(value: string) {
  const connectionType = value as tKeyTypeConnection;

  if (!availableConnections.value.includes(connectionType)) {
    return;
  }

  selectedConnectionType.value = connectionType;

  emit('select', {
    key: 'connection',
    value: connectionType,
  });
}

watch(
  () => [props.mode.key, props.players, props.connection],
  syncSelections,
  { immediate: true },
);
</script>

<template>
  <AppFlex class="widget-game-mode-options" direction="column" align="center" width="100%" :gap="12">
    <AppFlex
      class="widget-game-mode-options__group"
      direction="column"
      align="center"
      width="100%"
      :gap="6"
      role="group"
      :aria-label="preGameLocale.players"
    >
      <AppTitle
        :text="preGameLocale.players"
        tag="h3"
        font-size="lg"
        font-weight="medium"
      />

      <AppSegmentedCard
        :model-value="selectedPlayerOptionKey"
        :options="playerOptions"
        :disabled="mode.locked"
        size="big"
        min-width="60rem"
        max-width="100%"
        @update:model-value="handlePlayerOptionChange"
      />
    </AppFlex>

    <AppFlex
      class="widget-game-mode-options__group"
      direction="column"
      align="center"
      width="100%"
      :gap="6"
      role="group"
      :aria-label="preGameLocale.connection"
    >
      <AppTitle
        :text="preGameLocale.connection"
        tag="h3"
        font-size="lg"
        font-weight="medium"
      />

      <AppSegmentedCard
        :model-value="selectedConnectionType"
        :options="connectionOptions"
        :disabled="mode.locked"
        size="big"
        max-width="100%"
        :equal-width="false"
        @update:model-value="handleConnectionChange"
      />
    </AppFlex>
  </AppFlex>
</template>

<style scoped>
.widget-game-mode-options,
.widget-game-mode-options__group {
  min-width: 0;
}
</style>

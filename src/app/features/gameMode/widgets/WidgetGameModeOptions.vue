<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BluetoothDark from '@/assets/icons/connectionType/bluetooth-dark.svg?url';
import BluetoothLight from '@/assets/icons/connectionType/bluetooth-light.svg?url';
import LanDark from '@/assets/icons/connectionType/lan-dark.svg?url';
import LanLight from '@/assets/icons/connectionType/lan-light.svg?url';
import OnlineDark from '@/assets/icons/connectionType/online-dark.svg?url';
import OnlineLight from '@/assets/icons/connectionType/online-light.svg?url';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModePlayerOption } from '@/app/domain/game/type/api/common';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import type {
  iAppSegmentedCardOption,
  iAppSegmentedCardOptionImage,
} from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import { useGameStore } from '@/app/stores/game/game.store';

export interface PropsWidgetGameModeOptions {
  mode: iGameMode;
}

export type tWidgetGameModeOptionParameter = 'players' | 'connection';

export interface iWidgetGameModeOptionsSelection {
  parameter: tWidgetGameModeOptionParameter;
  playerOptionKey: string;
  connectionType: tKeyTypeConnection | null;
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

const props = defineProps<PropsWidgetGameModeOptions>();

const emit = defineEmits<{
  select: [selection: iWidgetGameModeOptionsSelection];
}>();

const gameStore = useGameStore();
const preGameLocale = useLocale((locale) => locale.views.preGame.index.ui);
const connectionLocale = useLocale((locale) => locale.connectionTypes);

const selectedPlayerOptionKey = ref('');
const selectedConnectionType = ref<tKeyTypeConnection | ''>('');

function findPlayerOption(key: string) {
  return props.mode.playerOptions.find((option) => option.key === key);
}

const selectedPlayerOption = computed(
  () => findPlayerOption(selectedPlayerOptionKey.value) ?? props.mode.playerOptions[0] ?? null,
);

const availableConnections = computed(() => selectedPlayerOption.value?.connections ?? []);

const playerOptions = computed<iAppSegmentedCardOption[]>(() =>
  props.mode.playerOptions.map((option) => {
    const icon = gameStore.media?.players[option.key]?.icon;

    return {
      value: option.key,
      label: formatPlayerOption(option),
      image: icon
        ? {
            light: icon.light,
            dark: icon.dark,
          }
        : undefined,
    };
  }),
);

const connectionTypes = computed(() => [
  ...new Set(props.mode.playerOptions.flatMap((option) => option.connections)),
]);

const connectionOptions = computed<iAppSegmentedCardOption[]>(() =>
  connectionTypes.value.map((connectionType) => ({
    value: connectionType,
    label: connectionLocale.value[connectionType].title,
    image: CONNECTION_IMAGES[connectionType],
    disabled: !availableConnections.value.includes(connectionType),
  })),
);

function formatPlayerOption({ players, teamSize }: iApiGameModePlayerOption) {
  if (players <= 0 || teamSize <= 0) {
    return String(players);
  }

  const teamCount = players / teamSize;

  if (!Number.isInteger(teamCount) || teamCount < 2) {
    return String(players);
  }

  return Array(teamCount).fill(teamSize).join(' VS ');
}

function syncConnectionSelection(playerOption = selectedPlayerOption.value) {
  const connections = playerOption?.connections ?? [];

  if (
    selectedConnectionType.value &&
    connections.includes(selectedConnectionType.value)
  ) {
    return;
  }

  selectedConnectionType.value = connections[0] ?? '';
}

function syncSelections() {
  const playerOption =
    findPlayerOption(selectedPlayerOptionKey.value) ??
    props.mode.playerOptions[0] ??
    null;

  selectedPlayerOptionKey.value = playerOption?.key ?? '';
  syncConnectionSelection(playerOption);
}

function emitSelection(parameter: tWidgetGameModeOptionParameter) {
  emit('select', {
    parameter,
    playerOptionKey: selectedPlayerOptionKey.value,
    connectionType: selectedConnectionType.value || null,
  });
}

function handlePlayerOptionChange(value: string) {
  const playerOption = findPlayerOption(value);

  if (!playerOption) {
    return;
  }

  selectedPlayerOptionKey.value = playerOption.key;
  syncConnectionSelection(playerOption);
  emitSelection('players');
}

function handleConnectionChange(value: string) {
  const connectionType = value as tKeyTypeConnection;

  if (!availableConnections.value.includes(connectionType)) {
    return;
  }

  selectedConnectionType.value = connectionType;
  emitSelection('connection');
}

watch(() => props.mode.key, syncSelections, { immediate: true });
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

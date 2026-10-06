<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModePlayerOption } from '@/app/domain/game/type/api/common';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import type { iAppSegmentedCardOption } from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
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

const props = defineProps<PropsWidgetGameModeOptions>();

const emit = defineEmits<{
  select: [selection: iWidgetGameModeOptionsSelection];
}>();

const gameStore = useGameStore();
const locale = useLocale();
const preGameLocale = computed(() => locale.value.views.preGame.index.ui);

const selectedPlayerOptionKey = ref('');
const selectedConnectionType = ref<tKeyTypeConnection | ''>('');

const selectedPlayerOption = computed(
  () =>
    props.mode.playerOptions.find((option) => option.key === selectedPlayerOptionKey.value) ??
    props.mode.playerOptions[0] ??
    null,
);

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

const connectionTypes = computed<tKeyTypeConnection[]>(() => {
  const connectionTypes = new Set<tKeyTypeConnection>();

  for (const option of props.mode.playerOptions) {
    for (const connectionType of option.connections) {
      connectionTypes.add(connectionType);
    }
  }

  return Array.from(connectionTypes);
});

const connectionOptions = computed<iAppSegmentedCardOption[]>(() => {
  const availableConnections = selectedPlayerOption.value?.connections ?? [];

  return connectionTypes.value.map((connectionType) => ({
    value: connectionType,
    label: locale.value.connectionTypes[connectionType].title,
    disabled: !availableConnections.includes(connectionType),
  }));
});

function formatPlayerOption(option: iApiGameModePlayerOption) {
  const { players, teamSize } = option;

  if (players <= 0 || teamSize <= 0 || players % teamSize !== 0) {
    return String(players);
  }

  const teamCount = players / teamSize;

  if (teamCount < 2) {
    return String(players);
  }

  return Array.from({ length: teamCount }, () => teamSize).join(' VS ');
}

function syncConnectionSelection() {
  const availableConnections = selectedPlayerOption.value?.connections ?? [];

  if (
    selectedConnectionType.value &&
    availableConnections.includes(selectedConnectionType.value)
  ) {
    return;
  }

  selectedConnectionType.value = availableConnections[0] ?? '';
}

function emitSelection(parameter: tWidgetGameModeOptionParameter) {
  emit('select', {
    parameter,
    playerOptionKey: selectedPlayerOptionKey.value,
    connectionType: selectedConnectionType.value || null,
  });
}

function resetSelections() {
  selectedPlayerOptionKey.value = props.mode.playerOptions[0]?.key ?? '';
  selectedConnectionType.value = '';
  syncConnectionSelection();
}

function handlePlayerOptionChange(value: string) {
  if (!props.mode.playerOptions.some((option) => option.key === value)) {
    return;
  }

  selectedPlayerOptionKey.value = value;
  syncConnectionSelection();
  emitSelection('players');
}

function handleConnectionChange(value: string) {
  const connectionType = value as tKeyTypeConnection;

  if (!selectedPlayerOption.value?.connections.includes(connectionType)) {
    return;
  }

  selectedConnectionType.value = connectionType;
  emitSelection('connection');
}

watch(
  () => props.mode.key,
  () => {
    resetSelections();
  },
  { immediate: true },
);
</script>

<template>
  <AppFlex class="widget-game-mode-options" direction="column" align="center" width="100%" :gap="8">
    <AppFlex
      class="widget-game-mode-options__group"
      direction="column"
      align="center"
      width="100%"
      :gap="3"
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
        width="60rem"
        max-width="100%"
        @update:model-value="handlePlayerOptionChange"
      />
    </AppFlex>

    <AppFlex
      class="widget-game-mode-options__group"
      direction="column"
      align="center"
      width="100%"
      :gap="3"
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
        width="80rem"
        max-width="100%"
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

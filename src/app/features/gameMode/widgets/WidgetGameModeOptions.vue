<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iApiGameModePlayerOption } from '@/app/domain/game/type/api/common';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppMarqueeText from '@/app/shared/components/ui/text/AppMarqueeText.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import type { iAppSegmentedControlOption } from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

export interface PropsWidgetGameModeOptions {
  mode: iGameMode;
}

const props = defineProps<PropsWidgetGameModeOptions>();

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

const playerOptions = computed<iAppSegmentedControlOption[]>(() =>
  props.mode.playerOptions.map((option) => ({
    value: option.key,
    label: formatPlayerOption(option),
  })),
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

const connectionOptions = computed<iAppSegmentedControlOption[]>(() => {
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
}

function handleConnectionChange(value: string) {
  const connectionType = value as tKeyTypeConnection;

  if (!selectedPlayerOption.value?.connections.includes(connectionType)) {
    return;
  }

  selectedConnectionType.value = connectionType;
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
  <div class="widget-game-mode-options">
    <div class="widget-game-mode-options__group">
      <AppMarqueeText
        :text="preGameLocale.players"
        font-size="lg"
        font-weight="medium"
        :uppercase="true"
      />

      <div role="group" :aria-label="preGameLocale.players">
        <AppSegmentedControl
          :model-value="selectedPlayerOptionKey"
          :options="playerOptions"
          :disabled="mode.locked"
          size="big"
          width="60rem"
          max-width="100%"
          @update:model-value="handlePlayerOptionChange"
        />
      </div>
    </div>

    <div class="widget-game-mode-options__group">
      <AppMarqueeText
        :text="preGameLocale.connection"
        font-size="lg"
        font-weight="medium"
        :uppercase="true"
      />

      <div role="group" :aria-label="preGameLocale.connection">
        <AppSegmentedControl
          :model-value="selectedConnectionType"
          :options="connectionOptions"
          :disabled="mode.locked"
          size="big"
          width="80rem"
          max-width="100%"
          @update:model-value="handleConnectionChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-game-mode-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: var(--app-space-8);
}

.widget-game-mode-options__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: var(--app-space-3);
}
</style>

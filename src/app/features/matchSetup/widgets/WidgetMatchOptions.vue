<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import { useConnectionTypeOptions } from '@/app/features/matchSetup/composables/useConnectionTypeOptions';
import { useMatchPlayerOptions } from '@/app/features/matchSetup/composables/useMatchPlayerOptions';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';

export interface PropsWidgetMatchOptions {
  mode: iGameMode;
  players?: string | null;
  connection?: tKeyTypeConnection | null;
}

export type iWidgetMatchOptionsSelection =
  | {
      key: 'players';
      value: string;
    }
  | {
      key: 'connection';
      value: tKeyTypeConnection;
    };

const props = withDefaults(defineProps<PropsWidgetMatchOptions>(), {
  players: null,
  connection: null,
});

const emit = defineEmits<{
  select: [selection: iWidgetMatchOptionsSelection];
}>();

const matchSetupLocale = useLocale((locale) => locale.views.menu.index.ui.matchSetup);

const selectedPlayerOptionKey = ref('');
const selectedConnectionType = ref<tKeyTypeConnection | ''>('');

const { resolvePlayerOption, resolvedPlayerOptions, selectedPlayerOption, playerOptions } = useMatchPlayerOptions(
  () => props.mode,
  selectedPlayerOptionKey,
);

const availableConnections = computed(() => selectedPlayerOption.value?.connections ?? []);
const connectionTypes = computed(() => [...new Set(resolvedPlayerOptions.value.flatMap((option) => option.connections))]);

const { connectionOptions } = useConnectionTypeOptions(connectionTypes, availableConnections);

function syncSelections() {
  const playerOption = resolvePlayerOption(props.players ?? '') ?? resolvedPlayerOptions.value[0] ?? null;

  selectedPlayerOptionKey.value = playerOption?.key ?? '';

  const connections = playerOption?.connections ?? [];

  selectedConnectionType.value = props.connection && connections.includes(props.connection) ? props.connection : (connections[0] ?? '');
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

watch(() => [props.mode.key, props.players, props.connection], syncSelections, { immediate: true });
</script>

<template>
  <AppFlex class="widget-match-options" direction="row" align="end" justify="around" width="100%">
    <AppFlex
      class="widget-match-options__group"
      direction="column"
      align="center"
      :gap="6"
      role="group"
      :aria-label="matchSetupLocale.players"
    >
      <AppTitle :text="matchSetupLocale.players" tag="h3" font-size="lg" font-weight="medium" />

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
      class="widget-match-options__group"
      direction="column"
      align="center"
      :gap="6"
      role="group"
      :aria-label="matchSetupLocale.connection"
    >
      <AppTitle :text="matchSetupLocale.connection" tag="h3" font-size="lg" font-weight="medium" />

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
.widget-match-options,
.widget-match-options__group {
  min-width: 0;
}

.widget-match-options {
  gap: var(--app-space-12);
}

.widget-match-options__group {
  flex: 0 0 auto;
  width: max-content;
}
</style>

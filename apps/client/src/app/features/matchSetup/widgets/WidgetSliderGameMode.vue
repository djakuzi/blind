<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Locale } from '@/app/shared/types/locale';
import UiCardGameMode from '@/app/features/matchSetup/ui/UiCardGameMode.vue';
import AppSlider from '@/app/shared/components/interaction/slider/AppSlider.vue';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';
import type { tGameModeKey } from '@/game/types/gameMode.types';

export interface iWidgetSliderGameModeSelection {
  key: 'mode';
  value: tGameModeKey;
}

export interface PropsWidgetSliderGameMode {
  locale: {
    matchSetup: Locale['views']['menu']['index']['ui']['matchSetup'];
    modes: Locale['game']['modes'];
  };
}

const props = defineProps<PropsWidgetSliderGameMode>();

const emit = defineEmits<{
  select: [selection: iWidgetSliderGameModeSelection];
  complete: [];
}>();

const gameModeStore = useGameModeStore();

const activeIndex = defineModel<number>({ default: 0 });

const modes = computed(() => gameModeStore.modes);
const activeMode = computed(() => modes.value[activeIndex.value] ?? null);

function formatItemAccessibilityLabel(index: number, count: number) {
  return props.locale.matchSetup.itemAccessibilityLabel.replace('{current}', String(index + 1)).replace('{total}', String(count));
}

function handleModeComplete() {
  emit('complete');
}

watch(
  () => activeMode.value?.key,
  (modeKey) => {
    if (modeKey) {
      emit('select', {
        key: 'mode',
        value: modeKey,
      });
    }
  },
);
</script>

<template>
  <AppSlider
    v-if="modes.length"
    v-model="activeIndex"
    :count="modes.length"
    width="100%"
    max-width="100%"
    :options-item="{
      width: '70rem',
      maxWidth: '70rem',
      gap: 8,
      inactiveScale: 0.88,
      inactiveOpacity: 0.42,
    }"
    size="big"
    viewport-bleed="8rem"
    :accessibility-label="locale.matchSetup.accessibilityLabel"
    :item-accessibility-label="formatItemAccessibilityLabel"
  >
    <template #item="{ index, active }">
      <UiCardGameMode
        v-if="modes[index]"
        :mode="modes[index]"
        :locale-mode="locale.modes[modes[index].key]"
        :active="active"
        :disabled="!active"
        :options-image="{
          loading: active ? 'eager' : 'lazy',
          fetchPriority: active ? 'high' : 'low',
          shouldLoad: Math.abs(index - activeIndex) <= 1,
        }"
        :mode-options-accessibility-label="locale.matchSetup.modeOptionsAccessibilityLabel"
        :connection-types-accessibility-label="locale.matchSetup.connectionTypesAccessibilityLabel"
        @complete="handleModeComplete"
      />
    </template>
  </AppSlider>
</template>

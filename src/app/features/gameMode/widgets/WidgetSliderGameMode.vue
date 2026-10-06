<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import UiCardGameMode from '@/app/features/gameMode/ui/UiCardGameMode.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppSlider from '@/app/shared/components/interaction/slider/AppSlider.vue';
import { useGameStore } from '@/app/stores/game/game.store';

const router = useRouter();
const gameStore = useGameStore();

const activeIndex = defineModel<number>({ default: 0 });

const modes = computed(() => gameStore.modes);

const preGameLocale = useLocale((locale) => locale.views.preGame.index.ui);

function formatItemAccessibilityLabel(index: number, count: number) {
  return preGameLocale.value.itemAccessibilityLabel.replace('{current}', String(index + 1)).replace('{total}', String(count));
}

function handleModeComplete() {
  router.push({
    name: KEY_ROUTE.preGame.typeConnection,
  });
}
</script>

<template>
  <div class="widget-slider-game-mode">
    <AppSlider
      v-if="modes.length"
      v-model="activeIndex"
      :count="modes.length"
      width="100%"
      max-width="100%"
      item-width="40%"
      item-max-width="120rem"
      :item-gap="8"
      size="big"
      :inactive-scale="0.88"
      :inactive-opacity="0.42"
      viewport-bleed="8rem"
      :accessibility-label="preGameLocale.accessibilityLabel"
      :item-accessibility-label="formatItemAccessibilityLabel"
    >
      <template #item="{ index, active }">
        <UiCardGameMode
          v-if="modes[index]"
          :mode="modes[index]"
          :active="active"
          :disabled="!active"
          :image-loading="active ? 'eager' : 'lazy'"
          :image-fetch-priority="active ? 'high' : 'low'"
          :image-should-load="Math.abs(index - activeIndex) <= 1"
          :options-accessibility-label="preGameLocale.modeOptionsAccessibilityLabel"
          :connection-types-accessibility-label="preGameLocale.connectionTypesAccessibilityLabel"
          @complete="handleModeComplete"
        />
      </template>
    </AppSlider>
  </div>
</template>

<style scoped>
.widget-slider-game-mode {
  width: 100%;
  min-width: 0;
}
</style>

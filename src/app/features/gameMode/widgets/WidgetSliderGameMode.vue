<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import UiCardGameMode from '@/app/features/game/ui/UiCardGameMode.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppSlider from '@/app/shared/components/interaction/slider/AppSlider.vue';
import AppHoldHint from '@/app/shared/components/ui/hint/AppHoldHint.vue';
import { useGameStore } from '@/app/stores/game/game.store';

const router = useRouter();
const gameStore = useGameStore();

const modes = computed(() => gameStore.modes);
const activeIndex = ref(0);

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
      item-width="90%"
      item-max-width="120rem"
      :item-gap="8"
      size="big"
      :inactive-scale="0.88"
      :inactive-opacity="0.42"
      :accessibility-label="preGameLocale.accessibilityLabel"
      :item-accessibility-label="formatItemAccessibilityLabel"
    >
      <template #item="{ index, active }">
        <UiCardGameMode
          v-if="modes[index]"
          :mode="modes[index]"
          :disabled="!active"
          :image-loading="active ? 'eager' : 'lazy'"
          :image-fetch-priority="active ? 'high' : 'low'"
          :image-should-load="Math.abs(index - activeIndex) <= 1"
          :options-accessibility-label="preGameLocale.modeOptionsAccessibilityLabel"
          :connection-types-accessibility-label="preGameLocale.connectionTypesAccessibilityLabel"
          @complete="handleModeComplete"
        />
      </template>

      <template #hint>
        <AppHoldHint
          :text="preGameLocale.holdHint"
          :fine-pointer-items="[preGameLocale.desktopWheelHint, preGameLocale.desktopSelectHint]"
          direction="column"
          fine-pointer-direction="column"
          size="middle"
          max-width="100%"
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

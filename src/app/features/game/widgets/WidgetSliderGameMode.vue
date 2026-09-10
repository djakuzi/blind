<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { apiGame } from '@/app/domain/game/api/api';
import type { ModelGameMode } from '@/app/domain/game/models/GameMode.model';
import UiCardGameMode from '@/app/features/game/ui/UiCardGameMode.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppSlider from '@/app/shared/components/interaction/slider/AppSlider.vue';
import AppHoldHint from '@/app/shared/components/ui/hint/AppHoldHint.vue';

const router = useRouter();

const modes = ref<ModelGameMode[]>([]);
const activeIndex = ref(0);
const isLoading = ref(false);
const hasLoadError = ref(false);

async function loadModes() {
  isLoading.value = true;
  hasLoadError.value = false;

  try {
    modes.value = await apiGame.getModes();
    activeIndex.value = 0;
  }
  catch (error) {
    modes.value = [];
    hasLoadError.value = true;
    console.error('Failed to load game modes:', error);
  }
  finally {
    isLoading.value = false;
  }
}

function handleModeComplete() {
  void router.push({
    name: KEY_ROUTE.preGame.typeConnection,
  });
}

onMounted(() => {
  void loadModes();
});
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
      accessibility-label="Выбор режима игры"
    >
      <template #item="{ index, active }">
        <UiCardGameMode
          v-if="modes[index]"
          :mode="modes[index]"
          :disabled="!active"
          @complete="handleModeComplete"
        />
      </template>

      <template #hint>
        <AppHoldHint
          :items="[
            'Удерживайте карточку, чтобы выбрать режим',
          ]"
          :desktop-items="[
            'Колесо мыши — сменить режим',
            'Удерживайте карточку — выбрать',
          ]"
          direction="column"
          desktop-direction="column"
          size="middle"
          max-width="100%"
        />
      </template>
    </AppSlider>

    <div
      v-else-if="hasLoadError"
      class="widget-slider-game-mode__state"
    >
      Не удалось загрузить режимы игры
    </div>

    <div
      v-else-if="isLoading"
      class="widget-slider-game-mode__state"
    >
      Загрузка...
    </div>
  </div>
</template>

<style scoped>
.widget-slider-game-mode {
  width: 100%;
  min-width: 0;
}

.widget-slider-game-mode__state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 20rem;
  color: var(--app-color-text-secondary);
  font-size: var(--app-font-size-xl);
  text-align: center;
}
</style>
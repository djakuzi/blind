<script setup lang="ts">
import { computed, ref } from 'vue';
import WidgetGameModeOptions from '@/app/features/gameMode/widgets/WidgetGameModeOptions.vue';
import WidgetSliderGameMode from '@/app/features/gameMode/widgets/WidgetSliderGameMode.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { useGameStore } from '@/app/stores/game/game.store';

const gameStore = useGameStore();

const activeModeIndex = ref(0);

const activeMode = computed(() => gameStore.modes[activeModeIndex.value] ?? null);
</script>

<template>
  <ViewLayout class="view-game-mode" align="center" justify="center" padding="none" overflow="hidden" bleed="horizontal">
    <div class="view-game-mode__content">
      <WidgetSliderGameMode v-model="activeModeIndex" />

      <WidgetGameModeOptions v-if="activeMode" :mode="activeMode" />
    </div>
  </ViewLayout>
</template>

<style scoped>
.view-game-mode {
  position: relative;
}

.view-game-mode__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: var(--app-space-8);
}
</style>

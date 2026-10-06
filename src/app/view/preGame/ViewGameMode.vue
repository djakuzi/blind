<script setup lang="ts">
import { computed, ref } from 'vue';
import WidgetGameModeOptions from '@/app/features/gameMode/widgets/WidgetGameModeOptions.vue';
import WidgetSliderGameMode from '@/app/features/gameMode/widgets/WidgetSliderGameMode.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';

const gameModeStore = useGameModeStore();

const activeModeIndex = ref(0);

const activeMode = computed(() => gameModeStore.modes[activeModeIndex.value] ?? null);
</script>

<template>
  <ViewLayout class="view-game-mode" align="center" justify="center" padding="none" overflow="hidden" bleed="horizontal">
    <AppFlex
      class="view-game-mode__content"
      direction="column"
      align="center"
      width="100%"
      :gap="8"
    >
      <WidgetSliderGameMode v-model="activeModeIndex" />

      <WidgetGameModeOptions v-if="activeMode" :mode="activeMode" />
    </AppFlex>
  </ViewLayout>
</template>

<style scoped>
.view-game-mode {
  position: relative;
}

.view-game-mode__content {
  min-width: 0;
}
</style>

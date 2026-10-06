<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import WidgetGameModeOptions from '@/app/features/gameMode/widgets/WidgetGameModeOptions.vue';
import type { iWidgetGameModeOptionsSelection } from '@/app/features/gameMode/widgets/WidgetGameModeOptions.vue';
import WidgetSliderGameMode from '@/app/features/gameMode/widgets/WidgetSliderGameMode.vue';
import type { iWidgetSliderGameModeSelection } from '@/app/features/gameMode/widgets/WidgetSliderGameMode.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';
import type { tGameModeKey } from '@/game/types/gameMode.types';

const router = useRouter();
const gameModeStore = useGameModeStore();

const activeModeIndex = ref(0);
const selectedModeKey = ref<tGameModeKey | null>(null);
const selectedPlayersKey = ref<string | null>(null);
const selectedConnectionType = ref<tKeyTypeConnection | null>(null);

const activeMode = computed(() => gameModeStore.modes[activeModeIndex.value] ?? null);

function handleModeSelect(selection: iWidgetSliderGameModeSelection) {
  selectedModeKey.value = selection.value;
}

function handleOptionSelect(selection: iWidgetGameModeOptionsSelection) {
  if (selection.key === 'players') {
    selectedPlayersKey.value = selection.value;
    return;
  }

  selectedConnectionType.value = selection.value;
}

function handleModeComplete() {
  if (
    !selectedModeKey.value ||
    !selectedPlayersKey.value ||
    !selectedConnectionType.value
  ) {
    return;
  }

  router.push({
    name: KEY_ROUTE.preGame.typeConnection,
    query: {
      mode: selectedModeKey.value,
      players: selectedPlayersKey.value,
      connection: selectedConnectionType.value,
    },
  });
}
</script>

<template>
  <ViewLayout class="view-game-mode" align="center" justify="center" padding="none" overflow="hidden" bleed="horizontal">
    <AppFlex
      class="view-game-mode__content"
      direction="column"
      align="center"
      width="100%"
      :gap="12"
    >
      <WidgetSliderGameMode
        v-model="activeModeIndex"
        @select="handleModeSelect"
        @complete="handleModeComplete"
      />

      <WidgetGameModeOptions
        v-if="activeMode"
        :mode="activeMode"
        @select="handleOptionSelect"
      />
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import WidgetGameModeLocked from '@/app/features/gameMode/widgets/WidgetGameModeLocked.vue';
import WidgetGameModeOptions from '@/app/features/gameMode/widgets/WidgetGameModeOptions.vue';
import type { iWidgetGameModeOptionsSelection } from '@/app/features/gameMode/widgets/WidgetGameModeOptions.vue';
import WidgetSliderGameMode from '@/app/features/gameMode/widgets/WidgetSliderGameMode.vue';
import type { iWidgetSliderGameModeSelection } from '@/app/features/gameMode/widgets/WidgetSliderGameMode.vue';
import { usePreGame } from '@/app/features/preGame/composables/usePreGame';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';
import { SPACE_TOKENS, spaceTokenVar } from '@/app/styles/contracts/space.contract';

const router = useRouter();
const gameModeStore = useGameModeStore();
const {
  mode,
  players,
  connection,
  selectionQuery,
  setSelection,
  flushSelection,
} = usePreGame();

const activeModeIndex = ref(0);

const activeMode = computed(() => gameModeStore.modes[activeModeIndex.value] ?? null);

function handleModeSelect(selection: iWidgetSliderGameModeSelection) {
  setSelection({
    mode: selection.value,
  });
}

function handleOptionSelect(selection: iWidgetGameModeOptionsSelection) {
  if (selection.key === 'players') {
    setSelection({
      players: selection.value,
    });
    return;
  }

  setSelection({
    connection: selection.value,
  });
}

async function handleModeComplete() {
  await flushSelection();

  if (!mode.value || !players.value || !connection.value) {
    return;
  }

  await router.push({
    name: KEY_ROUTE.preGame.typeConnection,
    query: selectionQuery.value,
  });
}

watch(
  mode,
  (modeKey) => {
    if (!modeKey) {
      return;
    }

    const modeIndex = gameModeStore.modes.findIndex(
      (gameMode) => gameMode.key === modeKey,
    );

    if (modeIndex >= 0 && activeModeIndex.value !== modeIndex) {
      activeModeIndex.value = modeIndex;
    }
  },
  { immediate: true },
);
</script>

<template>
  <ViewLayout class="view-game-mode" align="center" justify="start" padding="none" overflow="hidden" bleed="horizontal">
    <AppFlex
      class="view-game-mode__content"
      direction="column"
      align="center"
      width="100%"
      :margin="spaceTokenVar(14) + '0 0 0'"
      :gap="12"
    >
      <WidgetSliderGameMode
        v-model="activeModeIndex"
        @select="handleModeSelect"
        @complete="handleModeComplete"
      />

      <WidgetGameModeLocked
        v-if="activeMode?.locked"
        :mode="activeMode"
      />

      <WidgetGameModeOptions
        v-else-if="activeMode"
        :mode="activeMode"
        :players="players"
        :connection="connection"
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

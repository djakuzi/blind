<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import WidgetGameModeLocked from '@/app/features/matchSetup/widgets/WidgetGameModeLocked.vue';
import WidgetMatchOptions from '@/app/features/matchSetup/widgets/WidgetMatchOptions.vue';
import type { iWidgetMatchOptionsSelection } from '@/app/features/matchSetup/widgets/WidgetMatchOptions.vue';
import WidgetSliderGameMode from '@/app/features/matchSetup/widgets/WidgetSliderGameMode.vue';
import type { iWidgetSliderGameModeSelection } from '@/app/features/matchSetup/widgets/WidgetSliderGameMode.vue';
import { usePreGame } from '@/app/features/preGame/composables/usePreGame';
import { useHeaderActions } from '@/app/layouts/composables/common/useHeaderActions';
import { useSessionJoinOverlay } from '@/app/overlay/sessionJoin/composables/useSessionJoinOverlay';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import UiContainer from '@/app/layouts/components/containers/UiContainer.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppSwapTransition from '@/app/shared/components/effects/transition/AppSwapTransition.vue';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';

const router = useRouter();
const gameModeStore = useGameModeStore();
const { mode, players, connection, selectionQuery, setSelection, flushSelection } = usePreGame();

const activeModeIndex = ref(0);

const activeMode = computed(() => gameModeStore.modes[activeModeIndex.value] ?? null);
const activeModeStateKey = computed(() => (activeMode.value?.locked ? 'locked' : 'options'));
const { open: openSessionJoin } = useSessionJoinOverlay();
const menuLocale = useLocale((locale) => locale.views.menu.index.ui);

function handleModeSelect(selection: iWidgetSliderGameModeSelection) {
  setSelection({
    mode: selection.value,
  });
}

function handleOptionSelect(selection: iWidgetMatchOptionsSelection) {
  if (selection.key === 'players') {
    setSelection({
      players: selection.value,
    });
    return;
  }

  if (selection.key === 'connection') {
    setSelection({
      connection: selection.value,
    });
    return;
  }
}

async function handleModeComplete() {
  await flushSelection();

  if (!mode.value || !players.value || !connection.value) {
    return;
  }

  await router.push({
    name: KEY_ROUTE.lobby.index,
    query: selectionQuery.value,
  });
}

function handleSettings() {
  router.push({ name: KEY_ROUTE.settings.index });
}

watch(
  mode,
  (modeKey) => {
    if (!modeKey) {
      return;
    }

    const modeIndex = gameModeStore.modes.findIndex((gameMode) => gameMode.key === modeKey);

    if (modeIndex >= 0 && activeModeIndex.value !== modeIndex) {
      activeModeIndex.value = modeIndex;
    }
  },
  { immediate: true },
);

useHeaderActions(
  computed(() => [
    {
      key: 'connection',
      text: menuLocale.value.header.connection,
      onClick: openSessionJoin,
    },
    {
      key: 'settings',
      text: menuLocale.value.header.settings,
      onClick: handleSettings,
    },
  ]),
);
</script>

<template>
  <ViewLayout class="view-menu" align="center" padding="none" overflow="visible">
    <AppFlex class="view-menu__slider" align="center" justify="center" width="100%">
      <UiContainer bleed="horizontal">
        <WidgetSliderGameMode v-model="activeModeIndex" @select="handleModeSelect" @complete="handleModeComplete" />
      </UiContainer>
    </AppFlex>

    <AppSwapTransition class="view-menu__locked-slot" :transition-key="activeMode?.locked ? 'locked' : 'locked-empty'">
      <WidgetGameModeLocked v-if="activeMode?.locked" :mode="activeMode" />
    </AppSwapTransition>

    <AppSwapTransition class="view-menu__state-slot" :transition-key="activeMode && !activeMode.locked ? 'options' : 'options-empty'">
      <WidgetMatchOptions
        v-if="activeMode && !activeMode.locked"
        :mode="activeMode"
        :players="players"
        :connection="connection"
        @select="handleOptionSelect"
      />
    </AppSwapTransition>
  </ViewLayout>
</template>

<style scoped>
.view-menu__slider {
  margin-top: 14rem;
}

.view-menu__locked-slot,
.view-menu__state-slot {
  width: 100%;
  min-width: 0;
}

.view-menu__locked-slot {
  margin-top: var(--app-space-24);
}

.view-menu__state-slot {
  margin-top: auto;
}
</style>

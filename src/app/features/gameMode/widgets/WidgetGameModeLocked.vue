<script setup lang="ts">
import { computed } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';

export interface PropsWidgetGameModeLocked {
  mode: iGameMode;
}

const props = defineProps<PropsWidgetGameModeLocked>();

const modeLocale = useLocale((locale) => locale.game.modes[props.mode.key]);

const lockedTitle = computed(() => modeLocale.value?.locked?.title ?? '');
const lockedDescription = computed(() => modeLocale.value?.locked?.description ?? '');
</script>

<template>
  <AppFlex
    class="widget-game-mode-locked"
    direction="column"
    align="center"
    justify="center"
    width="100%"
    :gap="4"
    role="status"
  >
    <AppTitle
      :text="lockedTitle"
      tag="h3"
      color="error-text"
      font-size="xl"
      font-weight="medium"
    />

    <AppText
      class="widget-game-mode-locked__description"
      :text="lockedDescription"
      color="text-secondary"
      font-size="md"
      font-weight="medium"
      :uppercase="true"
      :ellipsis="true"
      :max-lines="2"
    />
  </AppFlex>
</template>

<style scoped>
.widget-game-mode-locked {
  min-width: 0;
  min-height: 30rem;
  text-align: center;
}

.widget-game-mode-locked__description {
  max-width: min(70rem, 90%);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppIcon from '@/app/shared/components/atoms/media/AppIcon.vue';
import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppFillAware from '@/app/shared/components/effects/fill/AppFillAware.vue';
import AppCardHold from '@/app/shared/components/ui/card/AppCardHold.vue';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';

export interface PropsUiCardGameMode {
  mode: iGameMode;
  optionsAccessibilityLabel: string;
  connectionTypesAccessibilityLabel: string;
  active?: boolean;
  disabled?: boolean;
  imageLoading?: 'eager' | 'lazy';
  imageFetchPriority?: 'high' | 'low' | 'auto';
  imageShouldLoad?: boolean;
}

const props = withDefaults(defineProps<PropsUiCardGameMode>(), {
  active: false,
  disabled: false,
  imageLoading: 'lazy',
  imageFetchPriority: 'low',
  imageShouldLoad: true,
});

const emit = defineEmits<{
  complete: [];
}>();

const { resolvedThemeMode } = useAppThemeMode();
const modeLocale = useLocale((locale) => locale.game.modes[props.mode.key]);

const imageSource = computed(() => props.mode.img[resolvedThemeMode.value]);
const modeDescription = computed(() => modeLocale.value?.description ?? '');
const isDisabled = computed(() => props.disabled || props.mode.locked);

function handleComplete() {
  if (isDisabled.value) {
    return;
  }

  emit('complete');
}
</script>

<template>
  <AppCardHold
    class="ui-card-game-mode"
    :class="{
      'ui-card-game-mode--active': active && !mode.locked,
      'ui-card-game-mode--locked': mode.locked,
    }"
    :disabled="isDisabled"
    width="100%"
    max-width="100%"
    size="big"
    background-color="surface-primary"
    border-color="border-contrast"
    border-width="thick"
    border-radius="lg"
    overflow="hidden"
    :initial-progress="0"
    @complete="handleComplete"
  >
    <AppFlex
      class="ui-card-game-mode__main"
      direction="column"
      align="center"
      justify="space-evenly"
      width="100%"
    >
      <AppFillAware color="text-primary" filled-color="on-primary">
        <AppTitle :text="mode.name" tag="h2" color="inherit" font-size="3xl" font-weight="bold" />
      </AppFillAware>

      <AppImage
        class="ui-card-game-mode__image"
        :src="imageSource"
        :alt="mode.name"
        width="15rem"
        max-width="30%"
        height="auto"
        object-fit="contain"
        aspect-ratio="1 / 1"
        :loading="imageLoading"
        :fetch-priority="imageFetchPriority"
        :should-load="imageShouldLoad"
      />

      <AppFillAware class="ui-card-game-mode__description" color="text-secondary" filled-color="on-primary">
        <AppText
          :text="modeDescription"
          color="inherit"
          font-size="lg"
          font-weight="medium"
          :uppercase="true"
          :ellipsis="true"
          :max-lines="1"
        />
      </AppFillAware>
    </AppFlex>

    <div
      v-if="mode.locked"
      class="ui-card-game-mode__locked-overlay"
      aria-hidden="true"
    />

    <AppPosition
      v-if="mode.locked"
      class="ui-card-game-mode__locked-icon"
      type="absolute"
      center="xy"
      layer="raised"
    >
      <AppIcon
        group="locked"
        icon="lock"
        width="8rem"
        height="8rem"
      />
    </AppPosition>
  </AppCardHold>
</template>

<style scoped>
.ui-card-game-mode :deep(.app-card-hold) {
  height: 100%;
  transition:
    border-color var(--app-motion-duration-medium) var(--app-motion-ease-default),
    box-shadow var(--app-motion-duration-medium) var(--app-motion-ease-default),
    background-color var(--app-motion-duration-medium) var(--app-motion-ease-default);
}

.ui-card-game-mode--active :deep(.app-card-hold) {
  border-color: var(--app-color-primary);
  box-shadow:
    0 0 0 var(--app-border-width-medium) color-mix(in srgb, var(--app-color-primary) 34%, transparent),
    0 0 1.5rem color-mix(in srgb, var(--app-color-primary) 34%, transparent),
    0 0 5rem color-mix(in srgb, var(--app-color-primary) 18%, transparent),
    0 1rem 5rem color-mix(in srgb, var(--app-color-primary) 16%, transparent);
}

@media (hover: hover) and (pointer: fine) {
  .ui-card-game-mode:not(.ui-card-game-mode--active):not(.ui-card-game-mode--locked) :deep(.app-card-hold:not(.app-card-hold--disabled):hover) {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 var(--app-border-width-medium) color-mix(in srgb, var(--app-color-primary) 18%, transparent);
  }
}

.ui-card-game-mode :deep(.app-card-hold__content) {
  height: 100%;
}

.ui-card-game-mode__main {
  height: 100%;
  min-width: 0;
  min-height: 0;
  text-align: center;
}

.ui-card-game-mode__description {
  max-width: 100%;
}

.ui-card-game-mode__image {
  flex: 0 1 auto;
  pointer-events: none;
}

.ui-card-game-mode__locked-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: color-mix(in srgb, var(--app-color-surface-primary) 48%, transparent);
  backdrop-filter: blur(0.6rem) contrast(0.72);
  pointer-events: none;
}

.ui-card-game-mode__locked-icon {
  pointer-events: none;
}
</style>

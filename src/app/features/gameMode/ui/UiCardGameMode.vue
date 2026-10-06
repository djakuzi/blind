<script setup lang="ts">
import { computed } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import { useLocale } from '@/app/features/locale/composables/useLocale';
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
const locale = useLocale();

const imageSource = computed(() => props.mode.img[resolvedThemeMode.value]);
const modeLocale = computed(() => locale.value.game.modes[props.mode.key]);
const modeTitle = computed(() => modeLocale.value?.title ?? props.mode.name);
const modeDescription = computed(() => modeLocale.value?.description ?? props.mode.description);
const displayedDescription = computed(() =>
  props.mode.locked
    ? props.mode.lockedText ?? modeDescription.value
    : modeDescription.value,
);

function handleComplete() {
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
    :disabled="disabled || mode.locked"
    width="100%"
    max-width="100%"
    size="big"
    background-color="surface-primary"
    border-color="border-contrast"
    border-width="thick"
    border-radius="xl"
    overflow="hidden"
    :initial-progress="0"
    @complete="handleComplete"
  >
    <div class="ui-card-game-mode__layout">
      <div class="ui-card-game-mode__main">
        <div class="ui-card-game-mode__image-wrap">
          <AppImage
            class="ui-card-game-mode__image"
            :class="{ 'ui-card-game-mode__image--locked': mode.locked }"
            :src="imageSource"
            :alt="modeTitle"
            width="15rem"
            max-width="30%"
            height="auto"
            object-fit="contain"
            aspect-ratio="1 / 1"
            :loading="imageLoading"
            :fetch-priority="imageFetchPriority"
            :should-load="imageShouldLoad"
          />

          <AppPosition
            v-if="mode.locked"
            type="absolute"
            center="xy"
            layer="raised"
          >
            <AppIcon
              group="locked"
              icon="lock"
              width="5rem"
            />
          </AppPosition>
        </div>

        <div
          class="ui-card-game-mode__body"
          :class="{ 'ui-card-game-mode__body--locked': mode.locked }"
        >
          <AppFillAware color="text-primary" filled-color="on-primary">
            <AppTitle
              :text="modeTitle"
              tag="h2"
              color="inherit"
              font-size="3xl"
              font-weight="bold"
            />
          </AppFillAware>

          <AppFillAware
            class="ui-card-game-mode__description"
            color="text-secondary"
            filled-color="on-primary"
          >
            <AppText
              :text="displayedDescription"
              color="inherit"
              font-size="lg"
              font-weight="medium"
              :uppercase="true"
              :ellipsis="true"
              :max-lines="1"
            />
          </AppFillAware>
        </div>
      </div>
    </div>
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

.ui-card-game-mode--locked :deep(.app-card-hold) {
  border-color: var(--app-color-border-default);
  box-shadow: none;
}

@media (hover: hover) and (pointer: fine) {
  .ui-card-game-mode:not(.ui-card-game-mode--active):not(.ui-card-game-mode--locked)
    :deep(.app-card-hold:not(.app-card-hold--disabled):hover) {
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 var(--app-border-width-medium) color-mix(in srgb, var(--app-color-primary) 18%, transparent);
  }
}

.ui-card-game-mode :deep(.app-card-hold__content) {
  height: 100%;
}

.ui-card-game-mode__layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
}

.ui-card-game-mode__main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-width: 0;
  min-height: 0;
}

.ui-card-game-mode__image-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-card-game-mode__image {
  flex: 0 1 auto;
  pointer-events: none;
  transition:
    opacity var(--app-motion-duration-medium) var(--app-motion-ease-default),
    filter var(--app-motion-duration-medium) var(--app-motion-ease-default);
}

.ui-card-game-mode__image--locked {
  opacity: 0.18;
  filter: grayscale(1);
}

.ui-card-game-mode__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  text-align: center;
  transition: opacity var(--app-motion-duration-medium) var(--app-motion-ease-default);
}

.ui-card-game-mode__body--locked {
  opacity: 0.45;
}

.ui-card-game-mode__description {
  max-width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .ui-card-game-mode__image,
  .ui-card-game-mode__body {
    transition: none;
  }
}
</style>

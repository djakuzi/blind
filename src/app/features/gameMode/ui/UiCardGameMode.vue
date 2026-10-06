<script setup lang="ts">
import { computed } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import { useLocale } from '@/app/features/locale/composables/useLocale';
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

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppCardHold
    class="ui-card-game-mode"
    :class="{ 'ui-card-game-mode--active': active }"
    :disabled="disabled"
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

        <div class="ui-card-game-mode__body">
          <AppFillAware color="text-primary" filled-color="on-primary">
            <AppTitle :text="mode.name" tag="h2" color="inherit" font-size="3xl" font-weight="bold" />
          </AppFillAware>

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

@media (hover: hover) and (pointer: fine) {
  .ui-card-game-mode:not(.ui-card-game-mode--active) :deep(.app-card-hold:not(.app-card-hold--disabled):hover) {
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

.ui-card-game-mode__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  text-align: center;
}

.ui-card-game-mode__description {
  max-width: 100%;
}

.ui-card-game-mode__image {
  flex: 0 1 auto;
  pointer-events: none;
}
</style>

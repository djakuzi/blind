<script setup lang="ts">
import { computed } from 'vue';

import AppHoldAction from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import AppBloodFill from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

type tAppButtonVariant = 'primary';
type tAppButtonSizeValue = number | string;

interface iAppButtonActions {
  complete?: () => void
}

interface Props {
  actions?: iAppButtonActions
  disabled?: boolean
  bloodFlowFrontDuration?: number
  duration?: number
  fillDuration?: number
  initialProgress?: number
  releaseDuration?: number
  size?: tBaseSizeVariant
  maxWidth?: tAppButtonSizeValue
  width?: tAppButtonSizeValue
  variant?: tAppButtonVariant
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  actions: undefined,
  disabled: false,
  bloodFlowFrontDuration: 1200,
  duration: 650,
  fillDuration: undefined,
  initialProgress: 15,
  releaseDuration: 140,
  size: 'middle',
  maxWidth: '100%',
  width: '100%',
  variant: 'primary',
  text: undefined,
});

const emit = defineEmits<{
  complete: []
}>();

function resolveSizeValue(value?: tAppButtonSizeValue) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

const buttonClass = computed(() => [
  'app-button',
  `app-button--${props.variant}`,
  `app-button--size-${props.size}`,
]);

const buttonBaseStyle = computed(() => ({
  '--cp-button-width': resolveSizeValue(props.width) ?? 'auto',
  '--cp-button-max-width': resolveSizeValue(props.maxWidth) ?? 'none',
}));

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppHoldAction
    :actions="actions"
    :disabled="disabled"
    :duration="duration"
    :fill-duration="fillDuration"
    :initial-progress="initialProgress"
    :release-duration="releaseDuration"
    @complete="handleComplete"
  >
    <template #default="{ progressRatio, isProgressActive }">
      <button
        :class="buttonClass"
        :style="buttonBaseStyle"
        :disabled="disabled"
        type="button"
      >
        <AppBloodFill
          :flow-front-duration="bloodFlowFrontDuration"
          :is-active="isProgressActive"
          :progress-ratio="progressRatio"
        />
        <span class="app-button__content">
          <slot>{{ text }}</slot>
        </span>
      </button>
    </template>
  </AppHoldAction>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: var(--cp-button-width);
  max-width: var(--cp-button-max-width);
  min-width: 0;
  box-sizing: border-box;
  border: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-text-primary);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  font-family: inherit;
  font-weight: var(--app-font-weight-medium);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-wider);
  text-align: center;
  text-transform: uppercase;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  appearance: none;
}

.app-button:disabled {
  color: var(--app-color-text-disabled);
  cursor: default;
}

.app-button__content {
  position: relative;
  z-index: 1;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-button--size-small {
  min-height: var(--app-space-12);
  padding: var(--app-space-3) var(--app-space-8);
  font-size: var(--app-font-size-md);
}

.app-button--size-middle {
  min-height: var(--app-space-16);
  padding: var(--app-space-4) var(--app-space-10);
  font-size: var(--app-font-size-xl);
}

.app-button--size-big {
  min-height: var(--app-space-20);
  padding: var(--app-space-5) var(--app-space-12);
  font-size: var(--app-font-size-2xl);
}
</style>

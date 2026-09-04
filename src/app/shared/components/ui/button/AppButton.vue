<script setup lang="ts">
import { computed } from 'vue';

import AppHoldAction from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

type tAppButtonVariant = 'primary';
type tAppButtonSizeValue = number | string;

interface iAppButtonActions {
  complete?: () => void
}

interface Props {
  actions?: iAppButtonActions
  disabled?: boolean
  duration?: number
  size?: tBaseSizeVariant
  maxWidth?: tAppButtonSizeValue
  width?: tAppButtonSizeValue
  variant?: tAppButtonVariant
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  actions: undefined,
  disabled: false,
  duration: 900,
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

function normalizeProgress(progress: number) {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, progress));
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

function getButtonStyle(progress: number) {
  return {
    ...buttonBaseStyle.value,
    '--cp-button-progress': normalizeProgress(progress) / 100,
  };
}

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppHoldAction
    :actions="actions"
    :disabled="disabled"
    :duration="duration"
    @complete="handleComplete"
  >
    <template #default="{ progress }">
      <button
        :class="buttonClass"
        :style="getButtonStyle(progress)"
        :disabled="disabled"
        type="button"
      >
        <span class="app-button__fill" />
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
  touch-action: manipulation;
  appearance: none;
}

.app-button:disabled {
  color: var(--app-color-text-disabled);
  cursor: default;
}

.app-button__fill {
  position: absolute;
  inset: auto 0 0;
  height: 100%;
  background: var(--app-color-primary);
  transform: scaleY(var(--cp-button-progress));
  transform-origin: center bottom;
  transition: transform 80ms linear;
  pointer-events: none;
}

.app-button__content {
  position: relative;
  z-index: 1;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-button--primary {
  box-shadow: inset 0 -0.625rem 0 var(--app-color-primary);
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

<script setup lang="ts">
import { computed } from 'vue';

import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

import {
  resolveColorValue,
  type tColorValue,
} from '@/app/styles/contracts/color.contract';

import {
  resolveRadiusValue,
  type tRadiusValue,
} from '@/app/styles/contracts/radius.contract';

interface Props {
  modelValue: boolean
  ariaLabel: string
  disabled?: boolean
  size?: tBaseSizeVariant
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  borderRadius?: tRadiusValue
  thumbBorderRadius?: tRadiusValue
  activeColor?: tColorValue
  inactiveColor?: tColorValue
  thumbColor?: tColorValue
  borderColor?: tColorValue
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'middle',
  width: undefined,
  maxWidth: '100%',
  borderRadius: 'full',
  thumbBorderRadius: 'full',
  activeColor: 'primary',
  inactiveColor: 'surface-interactive',
  thumbColor: 'on-primary',
  borderColor: 'border-strong',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const SWITCH_WIDTH_MAP: Record<tBaseSizeVariant, string> = {
  small: '10rem',
  middle: '12rem',
  big: '14rem',
};

const switchWidth = computed(() =>
  LibStyle.toSizeValue(
    props.width ?? SWITCH_WIDTH_MAP[props.size],
  ),
);

const switchMaxWidth = computed(() =>
  LibStyle.toSizeValue(props.maxWidth),
);

const switchBorderRadius = computed(() =>
  resolveRadiusValue(props.borderRadius),
);

const switchThumbBorderRadius = computed(() =>
  resolveRadiusValue(props.thumbBorderRadius),
);

const switchActiveColor = computed(() =>
  resolveColorValue(props.activeColor),
);

const switchInactiveColor = computed(() =>
  resolveColorValue(props.inactiveColor),
);

const switchThumbColor = computed(() =>
  resolveColorValue(props.thumbColor),
);

const switchBorderColor = computed(() =>
  resolveColorValue(props.borderColor),
);

function handleToggle() {
  if (props.disabled) {
    return;
  }

  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button
    class="app-switch"
    :class="{
      'app-switch--active': modelValue,
      'app-switch--disabled': disabled,
    }"
    type="button"
    role="switch"
    :aria-label="ariaLabel"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="handleToggle"
  >
    <span
      class="app-switch__thumb"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.app-switch {
  position: relative;
  display: block;
  flex: 0 0 auto;
  width: v-bind(switchWidth);
  max-width: v-bind(switchMaxWidth);
  min-width: 0;
  aspect-ratio: 2 / 1;

  padding: 0;
  border:
    var(--app-border-width-medium)
    var(--app-border-style-solid)
    v-bind(switchBorderColor);

  border-radius: v-bind(switchBorderRadius);
  background: v-bind(switchInactiveColor);

  overflow: hidden;
  cursor: pointer;
  appearance: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    opacity 160ms ease;

  &--active {
    background: v-bind(switchActiveColor);
  }

  &--disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:focus-visible {
    outline:
      var(--app-border-width-medium)
      var(--app-border-style-solid)
      var(--app-color-primary);
    outline-offset: 2px;
  }
}

.app-switch__thumb {
  position: absolute;
  top: 14%;
  left: 7%;
  width: 36%;
  aspect-ratio: 1;
  border-radius: v-bind(switchThumbBorderRadius);
  background: v-bind(switchThumbColor);
  pointer-events: none;
  transition:
    left 180ms ease,
    background-color 160ms ease;
}

.app-switch--active .app-switch__thumb {
  left: 57%;
}

@media (prefers-reduced-motion: reduce) {
  .app-switch,
  .app-switch__thumb {
    transition: none;
  }
}
</style>
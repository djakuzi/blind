<script setup lang="ts">
import { computed } from 'vue';

import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import {
  resolvePaddingValue,
  type tPaddingValue,
} from '@/app/styles/contracts/padding.contract';
import {
  resolveRadiusValue,
  type tRadiusValue,
} from '@/app/styles/contracts/radius.contract';

interface iAppSegmentedControlOption {
  label: string
  value: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  options: iAppSegmentedControlOption[]
  disabled?: boolean
  size?: tBaseSizeVariant
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  paddingX?: tPaddingValue
  paddingY?: tPaddingValue
  borderRadius?: tRadiusValue
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  borderRadius: 'lg',
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const SIZE_PADDING_MAP: Record<
  tBaseSizeVariant,
  {
    x: tPaddingValue
    y: tPaddingValue
  }
> = {
  small: {
    x: 3,
    y: 2,
  },
  middle: {
    x: 5,
    y: 3,
  },
  big: {
    x: 6,
    y: 4,
  },
};

const controlWidth = computed(() =>
  LibStyle.toSizeValue(props.width),
);

const controlMaxWidth = computed(() =>
  LibStyle.toSizeValue(props.maxWidth),
);

const controlBorderRadius = computed(() =>
  resolveRadiusValue(props.borderRadius),
);

const itemPaddingX = computed(() =>
  resolvePaddingValue(
    props.paddingX
      ?? SIZE_PADDING_MAP[props.size].x,
  ),
);

const itemPaddingY = computed(() =>
  resolvePaddingValue(
    props.paddingY
      ?? SIZE_PADDING_MAP[props.size].y,
  ),
);

function handleSelect(option: iAppSegmentedControlOption) {
  if (
    props.disabled
    || option.disabled
    || option.value === props.modelValue
  ) {
    return;
  }

  emit('update:modelValue', option.value);
}
</script>

<template>
  <div
    class="app-segmented-control"
    :class="[
      `app-segmented-control--size-${size}`,
      {
        'app-segmented-control--disabled': disabled,
      },
    ]"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="option.value"
      class="app-segmented-control__item"
      :class="{
        'app-segmented-control__item--active':
          option.value === modelValue,
      }"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :disabled="disabled || option.disabled"
      @click="handleSelect(option)"
    >
      <AppText
        class="app-segmented-control__text"
        :text="option.label"
        tag="span"
        color="inherit"
        font-size="inherit"
        font-weight="bold"
        line-height="var(--app-line-height-tight)"
        letter-spacing="var(--app-letter-spacing-wide)"
        :uppercase="true"
        :ellipsis="true"
        :max-lines="1"
      />
    </button>
  </div>
</template>

<style scoped>
.app-segmented-control {
  display: inline-flex;
  width: v-bind(controlWidth);
  max-width: v-bind(controlMaxWidth);
  min-width: 0;
  border:
    var(--app-border-width-thick)
    var(--app-border-style-solid)
    var(--app-color-border-contrast);
  border-radius: v-bind(controlBorderRadius);
  overflow: hidden;
}

.app-segmented-control__item {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding:
    v-bind(itemPaddingY)
    v-bind(itemPaddingX);
  border: 0;
  border-right:
    var(--app-border-width-medium)
    var(--app-border-style-solid)
    var(--app-color-border-contrast);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  cursor: pointer;
  appearance: none;

  &:last-child {
    border-right: 0;
  }

  &.app-segmented-control__item--active {
    background: var(--app-color-primary);
    color: var(--app-color-on-primary);
  }

  &:disabled {
    color: var(--app-color-text-disabled);
    cursor: default;
  }
}

.app-segmented-control__text {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.app-segmented-control--size-small {
  font-size: var(--app-font-size-md);
}

.app-segmented-control--size-middle {
  font-size: var(--app-font-size-xl);
}

.app-segmented-control--size-big {
  font-size: var(--app-font-size-2xl);
}
</style>
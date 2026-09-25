<script setup lang="ts">
import { computed } from 'vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppInteractionScale from '@/app/shared/components/effects/interaction/AppInteractionScale.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { resolveBorderStyleValue, resolveBorderWidthValue, type tBorderStyleValue, type tBorderWidthValue } from '@/app/styles/contracts/border.contract';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import { resolveFontSizeValue, type tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue, type tRadiusValue } from '@/app/styles/contracts/radius.contract';

export type tAppButtonVariant = 'primary' | 'secondary' | 'danger';

export interface PropsAppButton {
  text: string;
  variant?: tAppButtonVariant;
  size?: tBaseSizeVariant;
  width?: tStyleSizeValue;
  maxWidth?: tStyleSizeValue;
  disabled?: boolean;
  backgroundColor?: tColorValue;
  borderColor?: tColorValue;
  textColor?: tColorValue;
  borderWidth?: tBorderWidthValue;
  borderStyle?: tBorderStyleValue;
  borderRadius?: tRadiusValue;
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
  uppercase?: boolean;
}

const props = withDefaults(defineProps<PropsAppButton>(), {
  variant: 'primary',
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  disabled: false,
  backgroundColor: undefined,
  borderColor: undefined,
  textColor: undefined,
  borderWidth: 'medium',
  borderStyle: 'solid',
  borderRadius: 'md',
  paddingX: undefined,
  paddingY: undefined,
  fontSize: undefined,
  fontWeight: 'medium',
  uppercase: true,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const VARIANT_MAP: Record<
  tAppButtonVariant,
  {
    backgroundColor: tColorValue;
    borderColor: tColorValue;
    textColor: tColorValue;
  }
> = {
  primary: {
    backgroundColor: 'primary',
    borderColor: 'primary',
    textColor: 'on-primary',
  },
  secondary: {
    backgroundColor: 'surface-primary',
    borderColor: 'border-contrast',
    textColor: 'text-primary',
  },
  danger: {
    backgroundColor: 'error-background',
    borderColor: 'error',
    textColor: 'error-text',
  },
};

const SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    paddingX: tPaddingValue;
    paddingY: tPaddingValue;
    fontSize: tFontSizeValue;
  }
> = {
  small: {
    paddingX: 6,
    paddingY: 3,
    fontSize: 'lg',
  },
  middle: {
    paddingX: 8,
    paddingY: 4,
    fontSize: 'xl',
  },
  big: {
    paddingX: 10,
    paddingY: 5,
    fontSize: '2xl',
  },
};

const variantConfig = computed(() => VARIANT_MAP[props.variant]);
const sizeConfig = computed(() => SIZE_MAP[props.size]);

const buttonBackgroundColor = computed(() => resolveColorValue(props.backgroundColor ?? variantConfig.value.backgroundColor));
const buttonBorderColor = computed(() => resolveColorValue(props.borderColor ?? variantConfig.value.borderColor));
const buttonTextColor = computed(() => resolveColorValue(props.textColor ?? variantConfig.value.textColor));
const buttonBorderWidth = computed(() => resolveBorderWidthValue(props.borderWidth));
const buttonBorderStyle = computed(() => resolveBorderStyleValue(props.borderStyle));
const buttonBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));
const buttonPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX));
const buttonPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY));
const buttonFontSize = computed(() => resolveFontSizeValue(props.fontSize ?? sizeConfig.value.fontSize));

const interactionStyle = computed(() => ({
  width: LibStyle.toSizeValue(props.width),
  maxWidth: LibStyle.toSizeValue(props.maxWidth),
}));

const buttonStyle = computed(() => ({
  '--cp-button-background-color': buttonBackgroundColor.value,
  '--cp-button-border-color': buttonBorderColor.value,
  '--cp-button-text-color': buttonTextColor.value,
  '--cp-button-border-width': buttonBorderWidth.value,
  '--cp-button-border-style': buttonBorderStyle.value,
  '--cp-button-border-radius': buttonBorderRadius.value,
  '--cp-button-padding-x': buttonPaddingX.value,
  '--cp-button-padding-y': buttonPaddingY.value,
  '--cp-button-font-size': buttonFontSize.value,
}));
</script>

<template>
  <AppInteractionScale :disabled="disabled" :style="interactionStyle">
    <button class="app-button" :style="buttonStyle" :disabled="disabled" type="button" @click="$emit('click', $event)">
      <AppText
        class="app-button__text"
        :text="text"
        tag="span"
        color="inherit"
        font-size="inherit"
        :font-weight="fontWeight"
        :uppercase="uppercase"
        :ellipsis="true"
        :max-lines="1"
      />
    </button>
  </AppInteractionScale>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: var(--cp-button-padding-y) var(--cp-button-padding-x);
  border: var(--cp-button-border-width) var(--cp-button-border-style) var(--cp-button-border-color);
  border-radius: var(--cp-button-border-radius);
  background: var(--cp-button-background-color);
  color: var(--cp-button-text-color);
  font-size: var(--cp-button-font-size);
  line-height: var(--app-line-height-control);
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .app-button:not(:disabled):hover {
    background: color-mix(in srgb, var(--cp-button-background-color) 90%, var(--cp-button-border-color));
    box-shadow: 0 0 0 var(--app-border-width-medium) color-mix(in srgb, var(--cp-button-border-color) 16%, transparent);
  }
}

.app-button:not(:disabled):active {
  background: color-mix(in srgb, var(--cp-button-background-color) 82%, var(--cp-button-border-color));
}

.app-button:focus-visible {
  outline: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-primary);
  outline-offset: 2px;
}

.app-button:disabled {
  border-color: var(--app-color-border-default);
  background: var(--app-color-surface-secondary);
  color: var(--app-color-text-disabled);
  cursor: default;
}

.app-button__text {
  min-width: 0;
  max-width: 100%;
}
</style>

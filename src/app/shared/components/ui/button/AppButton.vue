<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsPadding } from '@/app/shared/types/props/spacing.props';
import type { PropsSurface } from '@/app/shared/types/props/surface.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsFont, PropsUppercase } from '@/app/shared/types/props/typography.props';
import type { PropsDisabled } from '@/app/shared/types/props/interaction.props';
import { computed } from 'vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppInteractionScale from '@/app/shared/components/effects/interaction/AppInteractionScale.vue';
import { useControlSize } from '@/app/shared/composables/style/useControlSize';
import { LibStyle } from '@/core/lib/style';

import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import { resolveColorValue, type tColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveFontSizeValue } from '@/app/shared/styles/contracts/fontSize.contract';
import type { iControlSizePreset } from '@/app/shared/styles/presets/control.preset';
import { resolveSurface } from '@/app/shared/styles/helpers/resolveSurface.helper';

export type tAppButtonVariant = 'primary' | 'secondary' | 'danger';

export interface PropsAppButton extends PropsWidth, PropsPadding, PropsSurface, PropsSizeVariant, PropsFont, PropsUppercase, PropsDisabled {
  text: string;
  variant?: tAppButtonVariant;
  textColor?: tColorValue;
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

const BUTTON_SIZE_PRESET: Record<tBaseSizeVariant, iControlSizePreset> = {
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
const { paddingX: buttonPaddingX, paddingY: buttonPaddingY, fontSize } = useControlSize(props, BUTTON_SIZE_PRESET);

const buttonSurface = computed(() => resolveSurface({
  backgroundColor: props.backgroundColor ?? variantConfig.value.backgroundColor,
  borderColor: props.borderColor ?? variantConfig.value.borderColor,
  borderWidth: props.borderWidth,
  borderStyle: props.borderStyle,
  borderRadius: props.borderRadius,
}));
const buttonTextColor = computed(() => resolveColorValue(props.textColor ?? variantConfig.value.textColor));
const buttonFontSize = computed(() => resolveFontSizeValue(fontSize.value));

const interactionStyle = computed(() => ({
  width: LibStyle.toSizeValue(props.width),
  maxWidth: LibStyle.toSizeValue(props.maxWidth),
}));

const buttonStyle = computed(() => ({
  '--cp-button-background-color': buttonSurface.value.backgroundColor,
  '--cp-button-border-color': buttonSurface.value.borderColor,
  '--cp-button-text-color': buttonTextColor.value,
  '--cp-button-border-width': buttonSurface.value.borderWidth,
  '--cp-button-border-style': buttonSurface.value.borderStyle,
  '--cp-button-border-radius': buttonSurface.value.borderRadius,
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
    background-color var(--app-motion-duration-base) var(--app-motion-ease-default),
    border-color var(--app-motion-duration-base) var(--app-motion-ease-default),
    color var(--app-motion-duration-base) var(--app-motion-ease-default),
    box-shadow var(--app-motion-duration-base) var(--app-motion-ease-default);
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

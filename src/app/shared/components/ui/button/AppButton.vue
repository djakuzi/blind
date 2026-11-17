<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsPadding } from '@/app/shared/types/props/spacing.props';
import type { PropsSurface } from '@/app/shared/types/props/surface.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsAppText } from '@/app/shared/components/elements/typography/AppText.vue';
import type { PropsDisabled } from '@/app/shared/types/props/interaction.props';
import { computed } from 'vue';
import AppText from '@/app/shared/components/elements/typography/AppText.vue';
import AppIcon from '@/app/shared/components/elements/media/AppIcon.vue';
import type { PropsAppIcon } from '@/app/shared/components/elements/media/AppIcon.vue';
import AppInteractionScale from '@/app/shared/components/effects/interaction/AppInteractionScale.vue';
import { useControlSize } from '@/app/shared/composables/style/useControlSize';
import { LibStyle } from '@/core/lib/style';

import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import { resolveColorValue, type tColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveFontSizeValue } from '@/app/shared/styles/contracts/fontSize.contract';
import type { iControlSizePreset } from '@/app/shared/styles/presets/control.preset';
import { resolveSurface } from '@/app/shared/styles/helpers/resolveSurface.helper';
import type { tIconGroup, tIconName } from '@/core/media/icons';

export type tAppButtonVariant = 'primary' | 'secondary' | 'danger';

export type tAppButtonIconOptions = {
  [TGroup in tIconGroup]: {
    group: TGroup;
    icon: tIconName<TGroup>;
    position?: 'start' | 'end';
    width?: PropsAppIcon<TGroup>['width'];
    height?: PropsAppIcon<TGroup>['height'];
  };
}[tIconGroup];

export type tAppButtonTextOptions = Pick<PropsAppText, 'text' | 'color' | 'fontSize' | 'fontWeight' | 'uppercase' | 'lineHeight'>;

export interface PropsAppButton extends PropsWidth, PropsPadding, PropsSurface, PropsSizeVariant, PropsDisabled {
  optionsText?: tAppButtonTextOptions;
  optionsIcon?: tAppButtonIconOptions;
  textColor?: tColorValue;
  ariaLabel?: string;
  variant?: tAppButtonVariant;
}

const props = withDefaults(defineProps<PropsAppButton>(), {
  optionsText: undefined,
  optionsIcon: undefined,
  textColor: undefined,
  ariaLabel: undefined,
  variant: 'primary',
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  backgroundColor: undefined,
  borderColor: undefined,
  borderWidth: 'medium',
  borderStyle: 'solid',
  borderRadius: 'md',
  disabled: false,
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
    paddingY: 4,
    fontSize: 'lg',
  },
  middle: {
    paddingX: 8,
    paddingY: 5,
    fontSize: 'xl',
  },
  big: {
    paddingX: 10,
    paddingY: 6,
    fontSize: '2xl',
  },
};

const variantConfig = computed(() => VARIANT_MAP[props.variant]);
const { paddingX: buttonPaddingX, paddingY: buttonPaddingY, fontSize } = useControlSize(props, BUTTON_SIZE_PRESET);

const buttonSurface = computed(() =>
  resolveSurface({
    backgroundColor: props.backgroundColor ?? variantConfig.value.backgroundColor,
    borderColor: props.borderColor ?? variantConfig.value.borderColor,
    borderWidth: props.borderWidth,
    borderStyle: props.borderStyle,
    borderRadius: props.borderRadius,
  }),
);
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

const iconStyle = computed<Pick<PropsAppIcon, 'height'>>(() => ({
  height: props.optionsIcon?.height ?? resolveFontSizeValue(fontSize.value),
}));

const buttonClass = computed(() => [
  'app-button',
  {
    'app-button--icon-only': !props.optionsText?.text && Boolean(props.optionsIcon),
    'app-button--icon-end': props.optionsIcon?.position === 'end',
  },
]);
</script>

<template>
  <AppInteractionScale :disabled="disabled" :style="interactionStyle">
    <button
      :class="buttonClass"
      :style="buttonStyle"
      :disabled="disabled"
      :aria-label="ariaLabel"
      type="button"
      @click="$emit('click', $event)"
    >
      <span class="app-button__content">
        <AppIcon v-if="optionsIcon" class="app-button__icon" :group="optionsIcon.group" :icon="optionsIcon.icon" v-bind="iconStyle" />

        <AppText
          v-if="optionsText?.text"
          class="app-button__text"
          :text="optionsText.text"
          tag="span"
          :color="optionsText?.color ?? 'inherit'"
          :font-size="optionsText?.fontSize ?? 'inherit'"
          :font-weight="optionsText?.fontWeight ?? 'medium'"
          :uppercase="optionsText?.uppercase ?? true"
          :ellipsis="true"
          :max-lines="1"
          :line-height="optionsText?.lineHeight ?? 'tight'"
        />
      </span>
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
  cursor: var(--app-cursor-pointer);
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
  cursor: var(--app-cursor-disabled);
}

.app-button__text {
  min-width: 0;
  max-width: 100%;
}

.app-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  gap: var(--app-space-3);
}

.app-button--icon-end .app-button__content {
  flex-direction: row-reverse;
}

.app-button--icon-only {
  aspect-ratio: 1;
  padding: var(--cp-button-padding-y);
}

.app-button__icon {
  flex: 0 0 auto;
  max-width: 100%;
  max-height: 100%;
}
</style>

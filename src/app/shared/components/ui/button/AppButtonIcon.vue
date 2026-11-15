<script setup lang="ts" generic="TGroup extends tIconGroup">
import type { PropsWidth, PropsHeight } from '@/app/shared/types/props/dimensions.props';
import type { PropsDisabled } from '@/app/shared/types/props/interaction.props';
import type { PropsPadding } from '@/app/shared/types/props/spacing.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import { computed } from 'vue';
import AppIcon from '@/app/shared/components/atoms/media/AppIcon.vue';
import type { PropsAppIcon } from '@/app/shared/components/atoms/media/AppIcon.vue';
import AppInteractionScale from '@/app/shared/components/effects/interaction/AppInteractionScale.vue';
import { LibStyle } from '@/core/lib/style';
import { resolvePaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import type { tPaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import type { tStyleSizeValue } from '@/core/lib/style';
import type { tIconGroup, tIconName } from '@/core/media/icons';

interface iIconButtonSizePreset {
  paddingX: tPaddingValue;
  paddingY: tPaddingValue;
  width: tStyleSizeValue;
  height: tStyleSizeValue;
}

const ICON_BUTTON_SIZE_PRESET: Record<tBaseSizeVariant, iIconButtonSizePreset> = {
  small: {
    paddingX: 3,
    paddingY: 3,
    width: 'calc(var(--app-padding-4) * 2 + var(--app-font-size-lg) * var(--app-line-height-tight))',
    height: 'calc(var(--app-padding-4) * 2 + var(--app-font-size-lg) * var(--app-line-height-tight))',
  },
  middle: {
    paddingX: 4,
    paddingY: 4,
    width: 'calc(var(--app-padding-5) * 2 + var(--app-font-size-xl) * var(--app-line-height-tight))',
    height: 'calc(var(--app-padding-5) * 2 + var(--app-font-size-xl) * var(--app-line-height-tight))',
  },
  big: {
    paddingX: 5,
    paddingY: 5,
    width: 'calc(var(--app-padding-6) * 2 + var(--app-font-size-2xl) * var(--app-line-height-tight))',
    height: 'calc(var(--app-padding-6) * 2 + var(--app-font-size-2xl) * var(--app-line-height-tight))',
  },
};

interface Props extends PropsWidth, Pick<PropsHeight, 'height'>, PropsPadding, PropsSizeVariant, PropsDisabled {
  group: TGroup;
  icon: tIconName<TGroup>;
  width?: PropsWidth['width'];
  framed?: boolean;
  optionsIcon?: Partial<Pick<PropsAppIcon<TGroup>, 'width' | 'height'>>;
  ariaLabel: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: undefined,
  size: 'middle',
  paddingX: undefined,
  paddingY: undefined,
  framed: false,
  optionsIcon: undefined,
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const iconProps = computed<Pick<PropsAppIcon<TGroup>, 'width' | 'height'>>(() => ({
  width: props.optionsIcon?.width ?? ICON_BUTTON_SIZE_PRESET[props.size ?? 'middle'].width,
  height: props.optionsIcon?.height ?? ICON_BUTTON_SIZE_PRESET[props.size ?? 'middle'].height,
}));

const buttonStyle = computed(() => ({
  '--cp-button-icon-width': LibStyle.toSizeValue(props.width ?? ICON_BUTTON_SIZE_PRESET[props.size ?? 'middle'].width) ?? 'auto',
  '--cp-button-icon-height': LibStyle.toSizeValue(props.height ?? ICON_BUTTON_SIZE_PRESET[props.size ?? 'middle'].height) ?? 'auto',
  '--cp-button-icon-padding-x': props.framed
    ? resolvePaddingValue(props.paddingX ?? ICON_BUTTON_SIZE_PRESET[props.size ?? 'middle'].paddingX)
    : '0px',
  '--cp-button-icon-padding-y': props.framed
    ? resolvePaddingValue(props.paddingY ?? ICON_BUTTON_SIZE_PRESET[props.size ?? 'middle'].paddingY)
    : '0px',
}));
</script>

<template>
  <AppInteractionScale :disabled="disabled">
    <button
      class="app-button-icon"
      :class="{ 'app-button-icon--framed': props.framed }"
      type="button"
      :style="buttonStyle"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @click="$emit('click', $event)"
    >
      <AppIcon :group="group" :icon="icon" v-bind="iconProps" />
    </button>
  </AppInteractionScale>
</template>

<style scoped>
.app-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--cp-button-icon-width);
  height: var(--cp-button-icon-height);
  padding: var(--cp-button-icon-padding-y) var(--cp-button-icon-padding-x);
  border: 0;
  background: transparent;
  cursor: var(--app-cursor-pointer);
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.app-button-icon--framed {
  border: var(--app-border-width-medium) solid var(--app-color-border-contrast);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface-primary);
}

.app-button-icon :deep(svg) {
  max-width: 100%;
  max-height: 100%;
}

.app-button-icon:disabled {
  cursor: var(--app-cursor-disabled);
}
</style>

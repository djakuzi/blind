<script setup lang="ts">
import { computed, useSlots } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppCard from '@/app/shared/components/atoms/card/AppCard.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tAppStatus } from '@/app/shared/types/status';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { BASE_SIZE_FONT_PRESET } from '@/app/styles/presets/base.preset';
import type { tBorderStyleValue, tBorderWidthValue } from '@/app/styles/contracts/border.contract';
import type { tColorValue } from '@/app/styles/contracts/color.contract';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';
import type { tPaddingValue } from '@/app/styles/contracts/padding.contract';
import type { tRadiusValue } from '@/app/styles/contracts/radius.contract';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';

export type tAppStatusBlockAlign = 'left' | 'center' | 'right';

export interface PropsAppStatusBlock {
  text: string;
  variant?: tAppStatus;
  size?: tBaseSizeVariant;
  width?: tStyleSizeValue;
  maxWidth?: tStyleSizeValue;
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
  gap?: tSpaceValue;
  backgroundColor?: tColorValue;
  borderColor?: tColorValue;
  borderWidth?: tBorderWidthValue;
  borderStyle?: tBorderStyleValue;
  borderRadius?: tRadiusValue;
  textColor?: tColorValue;
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
  textAlign?: tAppStatusBlockAlign;
  actionAlign?: tAppStatusBlockAlign;
  uppercase?: boolean;
}

const props = withDefaults(defineProps<PropsAppStatusBlock>(), {
  variant: 'info',
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  gap: undefined,
  backgroundColor: undefined,
  borderColor: undefined,
  borderWidth: 'medium',
  borderStyle: 'solid',
  borderRadius: 'lg',
  textColor: undefined,
  fontSize: undefined,
  fontWeight: 'medium',
  textAlign: 'center',
  actionAlign: undefined,
  uppercase: true,
});

const slots = useSlots();

const VARIANT_MAP: Record<
  tAppStatus,
  {
    backgroundColor: tColorValue;
    borderColor: tColorValue;
    textColor: tColorValue;
  }
> = {
  info: {
    backgroundColor: 'info-background',
    borderColor: 'info',
    textColor: 'info-text',
  },
  success: {
    backgroundColor: 'success-background',
    borderColor: 'success',
    textColor: 'success-text',
  },
  warning: {
    backgroundColor: 'warning-background',
    borderColor: 'warning',
    textColor: 'warning-text',
  },
  error: {
    backgroundColor: 'error-background',
    borderColor: 'error',
    textColor: 'error-text',
  },
};

const SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    gap: tSpaceValue;
  }
> = {
  small: {
    gap: 3,
  },
  middle: {
    gap: 4,
  },
  big: {
    gap: 5,
  },
};

const variantConfig = computed(() => VARIANT_MAP[props.variant]);
const sizeConfig = computed(() => SIZE_MAP[props.size]);

const hasAction = computed(() => Boolean(slots.action));

const statusBackgroundColor = computed(() => props.backgroundColor ?? variantConfig.value.backgroundColor);
const statusBorderColor = computed(() => props.borderColor ?? variantConfig.value.borderColor);
const statusTextColor = computed(() => props.textColor ?? variantConfig.value.textColor);
const statusGap = computed(() => props.gap ?? sizeConfig.value.gap);
const statusFontSize = computed(() => props.fontSize ?? BASE_SIZE_FONT_PRESET[props.size]);

const statusRole = computed(() => (props.variant === 'error' || props.variant === 'warning' ? 'alert' : 'status'));

const resolvedActionAlign = computed(() => props.actionAlign ?? props.textAlign);

const actionJustify = computed(() => {
  if (resolvedActionAlign.value === 'left') {
    return 'flex-start';
  }

  if (resolvedActionAlign.value === 'right') {
    return 'flex-end';
  }

  return 'center';
});
</script>

<template>
  <AppCard
    class="app-status-block"
    :size="size"
    :width="width"
    :max-width="maxWidth"
    :padding-x="paddingX"
    :padding-y="paddingY"
    :background-color="statusBackgroundColor"
    :border-color="statusBorderColor"
    :border-width="borderWidth"
    :border-style="borderStyle"
    :border-radius="borderRadius"
    :role="statusRole"
  >
    <AppFlex direction="column" :gap="statusGap" width="100%">
      <AppText
        class="app-status-block__text"
        :text="text"
        :color="statusTextColor"
        :font-size="statusFontSize"
        :font-weight="fontWeight"
        :uppercase="uppercase"
      />

      <div v-if="hasAction" class="app-status-block__action">
        <slot name="action" />
      </div>
    </AppFlex>
  </AppCard>
</template>

<style scoped>
.app-status-block {
  box-sizing: border-box;
}

.app-status-block__text {
  width: 100%;
  text-align: v-bind(textAlign);
}

.app-status-block__action {
  display: flex;
  justify-content: v-bind(actionJustify);
  width: 100%;
  min-width: 0;
}
</style>

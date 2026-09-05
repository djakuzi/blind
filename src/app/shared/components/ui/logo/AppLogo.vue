<script setup lang="ts">
import { computed } from 'vue';

import AppIcon from '@/app/shared/components/atoms/media/AppIcon.vue';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

type tAppLogoVariant =
  | 'blind'
  | 'blindTextBottom'
  | 'blindTextRight';

type tAppLogoSizeValue = number | string;

interface Props {
  size?: tBaseSizeVariant
  logo?: tAppLogoVariant
  width?: tAppLogoSizeValue
  height?: tAppLogoSizeValue
  maxWidth?: tAppLogoSizeValue
}

const props = withDefaults(defineProps<Props>(), {
  size: 'middle',
  logo: 'blindTextRight',
  width: undefined,
  height: undefined,
  maxWidth: '100%',
});

const LOGO_SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    width: string
    height: string
  }
> = {
  small: {
    width: '7.5rem',
    height: '2.5rem',
  },
  middle: {
    width: '22.5rem',
    height: '7.5rem',
  },
  big: {
    width: '32.5rem',
    height: '10.875rem',
  },
};

const resolvedWidth = computed(() => {
  return props.width
    ?? (props.height ? 'auto' : LOGO_SIZE_MAP[props.size].width);
});

const resolvedHeight = computed(() => {
  return props.height
    ?? (props.width ? 'auto' : LOGO_SIZE_MAP[props.size].height);
});
</script>

<template>
  <AppIcon
    class="app-logo"
    group="logo"
    :icon="logo"
    :width="resolvedWidth"
    :height="resolvedHeight"
    :max-width="maxWidth"
    alt="Blind"
  />
</template>
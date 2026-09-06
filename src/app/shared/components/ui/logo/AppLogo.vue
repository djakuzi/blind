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
  blur?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'middle',
  logo: 'blindTextRight',
  width: undefined,
  height: undefined,
  maxWidth: '100%',
  blur: false,
});

const LOGO_SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    width: string
  }
> = {
  small: {
    width: '20rem',
  },
  middle: {
    width: '30rem',
  },
  big: {
    width: '40rem',
  },
};

const resolvedWidth = computed(() => {
  return props.width
    ?? (props.height ? 'auto' : LOGO_SIZE_MAP[props.size].width);
});

const resolvedHeight = computed(() => {
  return props.height
    ?? (props.width ? 'auto' : 'auto');
});

const blurClass = computed(() => [
  'app-logo',
  props.blur ? 'app-logo--blur' : '',
]);
</script>

<template>
  <AppIcon
    :class="blurClass"
    group="logo"
    :icon="logo"
    :width="resolvedWidth"
    :height="resolvedHeight"
    :max-width="maxWidth"
    alt="Blind"
  />
</template>

<style scoped lang="css">
.app-logo {
  transform: scale(1);
  will-change: transform;

  &.app-logo--blur {
    filter: blur(1px);
    --webkit-filter: blur(1px);
  }
}
</style>

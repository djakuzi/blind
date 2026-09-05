<script setup lang="ts">
import { computed } from 'vue';

import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { ICONS_ASSETS } from '@/core/media/assets';
import { ToolSystem } from '@/core/tool/system';

type tAppLogoVariant = 'blind' | 'blindTextBottom' | 'blindTextRight';
type tAppLogoSizeValue = number | string;
type tLogoAssetKey = keyof typeof ICONS_ASSETS.logo;

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

const { resolvedThemeMode } = useAppThemeMode();

const LOGO_SIZE_MAP: Record<tBaseSizeVariant, { width: string, height: string }> = {
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

const LOGO_ASSET_MAP: Record<tAppLogoVariant, Record<ToolSystem.tSystemThemeMode, tLogoAssetKey>> = {
  blind: {
    dark: 'blindDark',
    light: 'blindLight',
  },
  blindTextBottom: {
    dark: 'blindTextBottomDark',
    light: 'blindTextBottomLight',
  },
  blindTextRight: {
    dark: 'blindTextRightDark',
    light: 'blindTextRightLight',
  },
};

const logoSrc = computed(() => {
  const logoKey = LOGO_ASSET_MAP[props.logo][resolvedThemeMode.value];

  return ICONS_ASSETS.logo[logoKey];
});

const resolvedWidth = computed(() => {
  return props.width ?? (props.height ? 'auto' : LOGO_SIZE_MAP[props.size].width);
});

const resolvedHeight = computed(() => {
  return props.height ?? (props.width ? 'auto' : LOGO_SIZE_MAP[props.size].height);
});
</script>

<template>
  <AppImage
    class="app-logo"
    :src="logoSrc"
    alt="Blind"
    :width="resolvedWidth"
    :height="resolvedHeight"
    :max-width="maxWidth"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import type {
  PropsAppImage,
} from '@/app/shared/components/atoms/media/AppImage.vue';

import {
  useAppThemeMode,
} from '@/app/shared/composables/system/useAppThemeMode';

export interface iAppImageModeImages {
  light: string
  dark: string
}

export interface PropsAppImageMode
  extends Omit<PropsAppImage, 'src'> {
  img: iAppImageModeImages
}

const props = defineProps<PropsAppImageMode>();

const { resolvedThemeMode } =
  useAppThemeMode();

const imageSource = computed(() =>
  props.img[resolvedThemeMode.value],
);

const imageProps = computed(() => {
  const {
    img: _img,
    ...appImageProps
  } = props;

  return appImageProps;
});
</script>

<template>
  <AppImage
    v-bind="imageProps"
    :src="imageSource"
  />
</template>
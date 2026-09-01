<script setup lang="ts">
import { computed } from 'vue';

import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';

type tAppImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

interface Props {
  src: string
  alt?: string
  maxWidth?: PropsAppBlock['maxWidth']
  width?: PropsAppBlock['width']
  height?: PropsAppBlock['height']
  objectFit?: tAppImageFit
  display?: PropsAppBlock['display']
  aspectRatio?: string
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'sync' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  maxWidth: '100%',
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  display: 'block',
  aspectRatio: undefined,
  loading: 'eager',
  decoding: 'async',
});

const imageStyle = computed(() => ({
  '--cp-image-aspect-ratio': props.aspectRatio ?? 'auto',
  '--cp-image-object-fit': props.objectFit,
}));
</script>

<template>
  <AppBlock
    class="app-image"
    :display="display"
    :width="width"
    :max-width="maxWidth"
    :height="height"
    :style="imageStyle"
  >
    <img
      class="app-image__media"
      :src="src"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
    >
  </AppBlock>
</template>

<style scoped>
.app-image {
  flex-shrink: 0;
  aspect-ratio: var(--cp-image-aspect-ratio);
}

.app-image__media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: var(--cp-image-object-fit);
}
</style>

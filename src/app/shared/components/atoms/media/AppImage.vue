<script setup lang="ts">
import { computed } from 'vue';

import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';

type tAppImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
type tAppImageSizeValue = number | string;

interface Props {
  src: string
  alt?: string
  maxWidth?: tAppImageSizeValue
  width?: tAppImageSizeValue
  height?: tAppImageSizeValue
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

function resolveSizeValue(value: tAppImageSizeValue) {
  return typeof value === 'number' ? `${value}px` : value;
}

const imageClass = computed(() => [
  'app-image__media',
  `app-image__media--fit-${props.objectFit}`,
]);

const imageWidth = computed(() => resolveSizeValue(props.width));
const imageMaxWidth = computed(() => resolveSizeValue(props.maxWidth));
const imageHeight = computed(() => resolveSizeValue(props.height));
const imageAspectRatio = computed(() => props.aspectRatio);
</script>

<template>
  <AppBlock
    class="app-image"
    :display="display"
    :width="imageWidth"
    :max-width="imageMaxWidth"
    :height="imageHeight"
  >
    <img
      :class="imageClass"
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
  aspect-ratio: v-bind(imageAspectRatio);
}

.app-image__media {
  display: block;
  width: 100%;
  height: 100%;
}

.app-image__media--fit-contain {
  object-fit: contain;
}

.app-image__media--fit-cover {
  object-fit: cover;
}

.app-image__media--fit-fill {
  object-fit: fill;
}

.app-image__media--fit-none {
  object-fit: none;
}

.app-image__media--fit-scale-down {
  object-fit: scale-down;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';

type tAppImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
type tAppImageFetchPriority = 'high' | 'low' | 'auto';

export interface PropsAppImage {
  src: string;
  alt?: string;
  maxWidth?: PropsAppBlock['maxWidth'];
  width?: PropsAppBlock['width'];
  height?: PropsAppBlock['height'];
  objectFit?: tAppImageFit;
  display?: PropsAppBlock['display'];
  aspectRatio?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  fetchPriority?: tAppImageFetchPriority;
  shouldLoad?: boolean;
}

const props = withDefaults(defineProps<PropsAppImage>(), {
  alt: '',
  maxWidth: '100%',
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  display: 'block',
  aspectRatio: undefined,
  loading: 'eager',
  decoding: 'async',
  fetchPriority: 'auto',
  shouldLoad: true,
});

const emit = defineEmits<{
  load: [event: Event];
  aspectRatioChange: [aspectRatio: string];
}>();

const naturalAspectRatio = ref<string>();

const resolvedAspectRatio = computed(() => props.aspectRatio ?? naturalAspectRatio.value ?? 'auto');

const imageStyle = computed(() => ({
  '--cp-image-aspect-ratio': resolvedAspectRatio.value,
  '--cp-image-object-fit': props.objectFit,
}));

function handleLoad(event: Event) {
  const image = event.currentTarget;

  if (image instanceof HTMLImageElement && image.naturalWidth > 0 && image.naturalHeight > 0) {
    const aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;

    naturalAspectRatio.value = aspectRatio;
    emit('aspectRatioChange', aspectRatio);
  }

  emit('load', event);
}
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
      v-if="shouldLoad"
      class="app-image__media"
      :src="src"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchPriority"
      @load="handleLoad"
    />
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

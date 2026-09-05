<script setup lang="ts">
import { computed } from 'vue';

import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { ICONS_ASSETS } from '@/core/media/assets';

type tIconGroup = keyof typeof ICONS_ASSETS;
type tIconAssets = Record<string, string>;

interface Props {
  group: tIconGroup
  icon: string
  width: PropsAppBlock['width']
  height?: PropsAppBlock['height']
  maxWidth?: PropsAppBlock['maxWidth']
  display?: PropsAppBlock['display']
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
  maxWidth: '100%',
  display: 'block',
  alt: '',
});

const { resolvedThemeMode } = useAppThemeMode();

const iconSvg = computed(() => {
  const groupAssets = ICONS_ASSETS[props.group] as tIconAssets;

  const themeSuffix = resolvedThemeMode.value === 'dark'
    ? 'Dark'
    : 'Light';

  const themedIconName = `${props.icon}${themeSuffix}`;

  return groupAssets[themedIconName]
    ?? groupAssets[props.icon]
    ?? '';
});
</script>

<template>
  <AppBlock
    class="app-icon"
    :display="display"
    :width="width"
    :max-width="maxWidth"
    :height="height"
    role="img"
    :aria-label="alt || undefined"
    :aria-hidden="alt ? undefined : true"
  >
    <span
      class="app-icon__media"
      v-html="iconSvg"
    />
  </AppBlock>
</template>

<style scoped>
.app-icon {
  flex-shrink: 0;
}

.app-icon__media {
  display: block;
  width: 100%;
  height: 100%;
}

.app-icon__media :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
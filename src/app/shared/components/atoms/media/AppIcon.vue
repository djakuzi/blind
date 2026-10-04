<script setup lang="ts" generic="TGroup extends tIconGroup">
import { computed } from 'vue';
import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { MediaIcons, type tIconGroup, type tIconName } from '@/core/media/icons';

export interface PropsAppIcon<TGroup extends tIconGroup = tIconGroup> {
  group: TGroup;
  icon: tIconName<TGroup>;
  width: PropsAppBlock['width'];
  height?: PropsAppBlock['height'];
  maxWidth?: PropsAppBlock['maxWidth'];
  display?: PropsAppBlock['display'];
  alt?: string;
}

const props = withDefaults(defineProps<PropsAppIcon<TGroup>>(), {
  height: 'auto',
  maxWidth: '100%',
  display: 'block',
  alt: '',
});

const { resolvedThemeMode } = useAppThemeMode();

const iconSvg = computed(() => MediaIcons.getIcon(props.group, props.icon, resolvedThemeMode.value));
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
    <span class="app-icon__media" v-html="iconSvg" />
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

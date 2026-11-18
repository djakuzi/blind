<script setup lang="ts">
import { computed } from 'vue';

type tUiContainerBleed = 'none' | 'horizontal' | 'vertical' | 'all';

interface Props {
  bleed?: tUiContainerBleed;
}

const props = withDefaults(defineProps<Props>(), {
  bleed: 'none',
});

const containerStyle = computed(() => ({
  '--cp-container-bleed-horizontal':
    props.bleed === 'horizontal' || props.bleed === 'all' ? 'var(--cp-layout-padding-horizontal, 0px)' : '0px',
  '--cp-container-bleed-vertical': props.bleed === 'vertical' || props.bleed === 'all' ? 'var(--cp-layout-padding-vertical, 0px)' : '0px',
}));
</script>

<template>
  <div class="ui-container" :style="containerStyle">
    <slot />
  </div>
</template>

<style scoped>
.ui-container {
  width: calc(100% + var(--cp-container-bleed-horizontal) * 2);
  margin-inline: calc(var(--cp-container-bleed-horizontal) * -1);
  min-width: 0;
  height: calc(100% + var(--cp-container-bleed-vertical) * 2);
  margin-block: calc(var(--cp-container-bleed-vertical) * -1);
}
</style>

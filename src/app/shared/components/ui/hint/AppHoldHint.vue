<script setup lang="ts">
import AppPulseAttention from '@/app/shared/components/effects/attention/AppPulseAttention.vue';

interface Props {
  text: string
}

defineProps<Props>();
</script>

<template>
  <AppPulseAttention
    :duration="2600"
    :scale="1.025"
  >
    <span class="app-hold-hint">
      <slot>{{ text }}</slot>
    </span>
  </AppPulseAttention>
</template>

<style scoped>
.app-hold-hint {
  display: inline-block;
  color: var(--app-color-text-secondary);
  font-size: var(--app-font-size-md);
  font-weight: var(--app-font-weight-medium);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-wider);
  text-align: center;
  text-transform: uppercase;
  user-select: none;
}
</style>

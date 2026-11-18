<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { ToolPower } from '@/core/platform';

onMounted(async () => {
  await ToolPower.keepAwake();
});

onBeforeUnmount(async () => {
  await ToolPower.allowSleep();
});
</script>

<template>
  <ViewLayout> fgdfg </ViewLayout>
</template>

<style scoped></style>

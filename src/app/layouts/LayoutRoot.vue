<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppLayoutBackground from '@/app/layouts/components/background/AppLayoutBackground.vue';
</script>

<template>
  <div class="layout-root">
    <AppLayoutBackground />
    <RouterView />
  </div>
</template>

<style scoped>
.layout-root {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 100dvh;
  max-height: 100dvh;
  background: var(--app-color-background);
  overflow: hidden;
}
</style>

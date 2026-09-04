<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="layout">
    <RouterView />
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: 100dvh;
  max-height: 100dvh;
}
</style>

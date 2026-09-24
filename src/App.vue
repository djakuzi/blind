<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppBootstrap } from '@/app/bootstrap/composables/useAppBootstrap';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import '@/app/styles/index.css';

const bootstrap =
  useAppBootstrap();
</script>

<template>
  <RouterView
    v-if="bootstrap.isReady.value"
    key="app-router"
  />
  <ProviderLoaderApp />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import '@/app/styles/index.css';
</script>

<template>
  <RouterView key="app-router" />
  <ProviderLoaderApp />
</template>

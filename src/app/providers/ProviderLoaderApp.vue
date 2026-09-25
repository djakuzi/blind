<script setup lang="ts">
import { useLoaderProvider } from '@/app/overlay/loader/composables/useLoaderProvider';
import WidgetLoaderApp from '@/app/overlay/loader/widgets/WidgetLoaderApp.vue';

const loader = useLoaderProvider();
</script>

<template>
  <WidgetLoaderApp
    :is-active="loader.isActive.value"
    :progress="loader.progress.value"
    :text="loader.text.value"
    :error="loader.error.value"
    @hidden="loader.handleHidden"
  />
</template>

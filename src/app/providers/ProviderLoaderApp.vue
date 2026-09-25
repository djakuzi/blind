<script setup lang="ts">
import { useLoaderProvider } from '@/app/overlay/loader/composables/useLoaderProvider';
import WidgetLoaderApp from '@/app/overlay/loader/widgets/WidgetLoaderApp.vue';

const loader = useLoaderProvider();
</script>

<template>
  <WidgetLoaderApp
    :is-loading="loader.isLoading.value"
    :progress="loader.progress.value"
    :text="loader.text.value"
    @hidden="loader.handleHidden"
  />
</template>

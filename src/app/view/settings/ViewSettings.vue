<script setup lang="ts">
import WidgetSettingsPanel from '@/app/features/settings/widgets/WidgetSettingsPanel.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
</script>

<template>
  <ViewLayout class="view-settings" align="center" justify="center" padding="none" overflow="auto">
    <WidgetSettingsPanel />
  </ViewLayout>
</template>

<style scoped>
.view-settings {
  position: relative;
  scrollbar-gutter: stable;
}
</style>

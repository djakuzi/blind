<script setup lang="ts">
import WidgetSettingsPanel from '@/app/features/settings/widgets/WidgetSettingsPanel.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
</script>

<template>
  <ViewLayout
    class="view-settings"
    align="center"
    justify="center"
    padding="none"
    overflow="auto"
  >
    <AppFlex
      class="view-settings__content"
      direction="column"
      align="center"
      width="100%"
      :gap="12"
    >
      <AppTitle text="Настройки" />

      <WidgetSettingsPanel />
    </AppFlex>
  </ViewLayout>
</template>

<style scoped>
.view-settings {
  position: relative;
}

.view-settings__content {
  padding-block:
    var(--app-space-8)
    var(--app-space-16);
}
</style>
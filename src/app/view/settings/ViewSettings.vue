<script setup lang="ts">
import { computed } from 'vue';
import WidgetSettingsPanel from '@/app/features/settings/widgets/WidgetSettingsPanel.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import { useLanguageStore } from '@/app/stores/language/language.store';

const languageStore = useLanguageStore();

const settingsLocale = computed(() =>
  languageStore.locale?.views.menu.settings.index,
);
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
      <AppTitle :text="settingsLocale?.title ?? ''" />

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

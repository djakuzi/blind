<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppLanguage } from '@/app/features/locale/composables/useAppLanguage';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import WidgetSettingsPanel from '@/app/features/settings/widgets/WidgetSettingsPanel.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { useLoaderRegistry } from '@/app/overlay/loader/composables/useLoaderRegistry';

const loader = useLoaderRegistry();
const locale = useLocale();
const { languages, currentLanguage, setAppLanguage } = useAppLanguage();
const localeLanguageModal = computed(() => locale.value.views.settings.index.modals.changeLanguage);
const isLanguagePickerOpen = ref(false);
const isLanguageChangeRunning = ref(false);

type tSettingsOperation =
  | { key: string; state: 'start'; title: string }
  | { key: string; state: 'success' }
  | { key: string; state: 'error'; title: string; retryTitle: string; cancelTitle: string; retry: () => Promise<void> };

function handleOperation(operation: tSettingsOperation) {
  const scopeKey = `settings-${operation.key}`;
  const resource = { scopeKey, resourceKey: operation.key };

  if (operation.state === 'start') {
    loader.registerScope({
      scopeKey,
      title: operation.title,
      progressMode: 'indeterminate',
      resources: { [operation.key]: 'pending' },
    });
    return;
  }

  if (operation.state === 'success') {
    loader.setResourceLoaded(resource);
    return;
  }

  loader.setResourceError({
    ...resource,
    error: {
      title: operation.title,
      actions: [
        { title: operation.retryTitle, callback: operation.retry },
        { title: operation.cancelTitle, callback: () => loader.clearScope(scopeKey) },
      ],
    },
  });
}

async function handleLanguageChange(code: string) {
  if (isLanguageChangeRunning.value) return;
  isLanguageChangeRunning.value = true;
  handleOperation({ key: 'language', state: 'start', title: localeLanguageModal.value.loading });

  try {
    await setAppLanguage(code);
    isLanguagePickerOpen.value = false;
    handleOperation({ key: 'language', state: 'success' });
  } catch {
    handleOperation({
      key: 'language',
      state: 'error',
      title: localeLanguageModal.value.loadError,
      retryTitle: localeLanguageModal.value.retry,
      cancelTitle: localeLanguageModal.value.cancel,
      retry: () => handleLanguageChange(code),
    });
  } finally {
    isLanguageChangeRunning.value = false;
  }
}
</script>

<template>
  <ViewLayout class="view-settings" align="center" justify="center" padding="none" overflow="auto">
    <WidgetSettingsPanel
      v-model:language-picker-open="isLanguagePickerOpen"
      :locale="{ settings: locale.settings, ui: locale.views.settings.index.ui, languageModal: localeLanguageModal }"
      :languages="languages"
      :current-language="currentLanguage"
      @select-language="handleLanguageChange"
    />
  </ViewLayout>
</template>

<style scoped>
.view-settings {
  position: relative;
  scrollbar-gutter: stable;
}
</style>

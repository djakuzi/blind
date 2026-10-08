import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';

export function useLayoutHeader() {
  const route = useRoute();
  const locale = useLocale();

  const headerConfig = computed(() => {
    const header = route.meta.layout?.header;

    return typeof header === 'object' ? header : null;
  });

  const hasLayoutHeader = computed(() => route.meta.layout?.header !== false);

  const hasLayoutHeaderTitle = computed(() => headerConfig.value?.title !== undefined);

  const layoutHeaderTitle = computed(() => headerConfig.value?.title?.(locale.value) ?? '');

  const hasLayoutHeaderLogo = computed(() => !hasLayoutHeaderTitle.value && headerConfig.value?.logo === true);

  return {
    hasLayoutHeader,
    hasLayoutHeaderTitle,
    layoutHeaderTitle,
    hasLayoutHeaderLogo,
  };
}

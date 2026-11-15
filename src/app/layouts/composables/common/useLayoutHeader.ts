import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useLayoutHeader() {
  const route = useRoute();

  const hasLayoutHeader = computed(() => route.meta.layout?.header !== false);
  const hasLayoutBack = computed(() => route.meta.layout?.back !== false);

  return {
    hasLayoutHeader,
    hasLayoutBack,
  };
}

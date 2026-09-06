import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useLayoutVersion() {
    const route = useRoute();

    const hasLayoutVersion = computed(() =>
        route.meta.layout?.version === true,
    );

    return {
        hasLayoutVersion,
    };
}
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { LOADER_MIN_VISIBLE_DURATION_MS, LOADER_PROGRESS_MODE_DEFAULT } from '@/app/stores/loader/loader.const';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import type {
  iLoaderResourceError,
  iLoaderScope,
  tLoaderProgressMode,
} from '@/app/stores/loader/loader.type';

function hasScopeState(scope: iLoaderScope, states: readonly string[]) {
  return Object.values(scope.resources).some((resource) => states.includes(resource.state));
}

export function useLoaderProvider() {
  const loaderStore = useLoaderStore();
  const { errorResourcesCount, pendingResourcesCount, progress, scopesList, totalResourcesCount } = storeToRefs(loaderStore);

  const isStoreActive = computed(() => {
    return totalResourcesCount.value > 0 && (pendingResourcesCount.value > 0 || errorResourcesCount.value > 0);
  });

  const activeScopes = computed(() => {
    return scopesList.value.filter((scope) => hasScopeState(scope, ['pending', 'error']));
  });

  const pendingScopes = computed(() => {
    return activeScopes.value.filter((scope) => hasScopeState(scope, ['pending']));
  });

  const activeProgressMode = computed<tLoaderProgressMode>(() => {
    return activeScopes.value.some((scope) => scope.progressMode === 'indeterminate') ? 'indeterminate' : 'determinate';
  });

  const currentText = computed(() => pendingScopes.value[0]?.title ?? '');

  const currentError = computed<iLoaderResourceError | undefined>(() => {
    for (const scope of scopesList.value) {
      const errorResource = Object.values(scope.resources).find((resource) => resource.state === 'error' && resource.error);

      if (errorResource?.error) {
        return errorResource.error;
      }
    }

    return undefined;
  });

  const isVisible = ref(false);
  const hasVisualSession = ref(false);
  const presentationText = ref('');
  const presentationError = ref<iLoaderResourceError>();
  const sessionProgressMode = ref<tLoaderProgressMode>(LOADER_PROGRESS_MODE_DEFAULT);

  let visibleStartedAt = 0;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const isInputBlocked = computed(() => isStoreActive.value || hasVisualSession.value);

  function clearHideTimer() {
    if (!hideTimer) {
      return;
    }

    clearTimeout(hideTimer);
    hideTimer = null;
  }

  function syncPresentationContent() {
    if (currentText.value) {
      presentationText.value = currentText.value;
    }

    if (currentError.value) {
      presentationError.value = currentError.value;
    } else if (isStoreActive.value) {
      presentationError.value = undefined;
    }

    if (activeProgressMode.value === 'indeterminate') {
      sessionProgressMode.value = 'indeterminate';
    }
  }

  function showVisualNow() {
    clearHideTimer();

    if (!hasVisualSession.value) {
      hasVisualSession.value = true;
      visibleStartedAt = Date.now();
      sessionProgressMode.value = activeProgressMode.value;
    }

    syncPresentationContent();
    isVisible.value = true;
  }

  function hideVisualWhenAllowed() {
    if (!hasVisualSession.value) {
      loaderStore.clearCompletedScopes();
      presentationText.value = '';
      presentationError.value = undefined;
      return;
    }

    if (!isVisible.value || hideTimer) {
      return;
    }

    if (presentationError.value) {
      isVisible.value = false;
      return;
    }

    const visibleDuration = Date.now() - visibleStartedAt;
    const remainingDuration = Math.max(0, LOADER_MIN_VISIBLE_DURATION_MS - visibleDuration);

    if (remainingDuration === 0) {
      isVisible.value = false;
      return;
    }

    hideTimer = setTimeout(() => {
      hideTimer = null;

      if (!isStoreActive.value) {
        isVisible.value = false;
      }
    }, remainingDuration);
  }

  function syncPresentation() {
    if (!isStoreActive.value) {
      hideVisualWhenAllowed();
      return;
    }

    clearHideTimer();
    showVisualNow();
  }

  function handleHidden() {
    clearHideTimer();

    hasVisualSession.value = false;
    isVisible.value = false;
    visibleStartedAt = 0;
    presentationText.value = '';
    presentationError.value = undefined;
    sessionProgressMode.value = LOADER_PROGRESS_MODE_DEFAULT;

    loaderStore.clearCompletedScopes();

    if (isStoreActive.value) {
      syncPresentation();
    }
  }

  watch([isStoreActive, currentError, currentText, activeProgressMode], syncPresentation, {
    immediate: true,
  });

  onBeforeUnmount(() => {
    clearHideTimer();
  });

  return {
    error: presentationError,
    handleHidden,
    isInputBlocked,
    isVisible,
    progress,
    progressMode: sessionProgressMode,
    text: presentationText,
  };
}

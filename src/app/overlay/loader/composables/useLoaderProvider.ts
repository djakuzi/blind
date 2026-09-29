import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  LOADER_MIN_VISIBLE_DURATION_MS,
  LOADER_PROGRESS_MODE_DEFAULT,
  LOADER_SHOW_DELAY_MS,
} from '@/app/stores/loader/loader.const';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import type {
  iLoaderResourceError,
  iLoaderScope,
  tLoaderDisplayMode,
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

  const activeDisplayMode = computed<tLoaderDisplayMode>(() => {
    return pendingScopes.value.some((scope) => scope.displayMode === 'immediate') ? 'immediate' : 'delayed';
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
  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const isInteractionBlocked = computed(() => isStoreActive.value && !isVisible.value);

  function clearShowTimer() {
    if (!showTimer) {
      return;
    }

    clearTimeout(showTimer);
    showTimer = null;
  }

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
    clearShowTimer();
    clearHideTimer();

    if (!hasVisualSession.value) {
      hasVisualSession.value = true;
      visibleStartedAt = Date.now();
      sessionProgressMode.value = activeProgressMode.value;
    }

    syncPresentationContent();
    isVisible.value = true;
  }

  function scheduleVisualShow() {
    if (showTimer || hasVisualSession.value) {
      return;
    }

    showTimer = setTimeout(() => {
      showTimer = null;

      if (isStoreActive.value) {
        showVisualNow();
      }
    }, LOADER_SHOW_DELAY_MS);
  }

  function hideVisualWhenAllowed() {
    clearShowTimer();

    if (!hasVisualSession.value) {
      loaderStore.clearCompletedScopes();
      presentationText.value = '';
      presentationError.value = undefined;
      return;
    }

    if (!isVisible.value || hideTimer) {
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
      clearHideTimer();
      hideVisualWhenAllowed();
      return;
    }

    clearHideTimer();
    syncPresentationContent();

    if (hasVisualSession.value) {
      isVisible.value = true;
      return;
    }

    if (currentError.value || activeDisplayMode.value === 'immediate') {
      showVisualNow();
      return;
    }

    scheduleVisualShow();
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

  watch([isStoreActive, currentError, currentText, activeDisplayMode, activeProgressMode], syncPresentation, {
    immediate: true,
  });

  onBeforeUnmount(() => {
    clearShowTimer();
    clearHideTimer();
  });

  return {
    error: presentationError,
    handleHidden,
    isInteractionBlocked,
    isVisible,
    progress,
    progressMode: sessionProgressMode,
    text: presentationText,
  };
}

import { onBeforeUnmount, onMounted, ref } from 'vue';

import {
  APP_THEME_ATTRIBUTE_NAME,
} from '@/app/styles/contracts/appTheme.contract';
import { ToolSystem } from '@/core/tool/system';

const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function useAppThemeMode() {
  const resolvedThemeMode = ref<ToolSystem.tSystemThemeMode>(ToolSystem.getPreferredThemeMode());
  let themeMediaQueryList: MediaQueryList | undefined;
  let themeObserver: MutationObserver | undefined;

  function getResolvedThemeMode(): ToolSystem.tSystemThemeMode {
    if (typeof document === 'undefined') {
      return ToolSystem.getPreferredThemeMode();
    }

    const colorScheme = getComputedStyle(document.documentElement).colorScheme;

    if (colorScheme === 'dark') {
      return 'dark';
    }

    if (colorScheme === 'light') {
      return 'light';
    }

    return ToolSystem.getPreferredThemeMode();
  }

  function updateResolvedThemeMode() {
    resolvedThemeMode.value = getResolvedThemeMode();
  }

  onMounted(() => {
    updateResolvedThemeMode();

    if (typeof MutationObserver !== 'undefined') {
      themeObserver = new MutationObserver(updateResolvedThemeMode);
      themeObserver.observe(document.documentElement, {
        attributeFilter: [APP_THEME_ATTRIBUTE_NAME],
      });
    }

    if (typeof globalThis.matchMedia !== 'function') {
      return;
    }

    themeMediaQueryList = globalThis.matchMedia(THEME_MEDIA_QUERY);
    themeMediaQueryList.addEventListener('change', updateResolvedThemeMode);
  });

  onBeforeUnmount(() => {
    themeMediaQueryList?.removeEventListener('change', updateResolvedThemeMode);
    themeObserver?.disconnect();
  });

  return {
    resolvedThemeMode,
  };
}

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppGrid from '@/app/shared/components/atoms/block/AppGrid.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import AppLineLoader from '@/app/shared/components/ui/loader/AppLineLoader.vue';
import type { tAppLineLoaderMode } from '@/app/shared/components/ui/loader/AppLineLoader.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppStatusBlock from '@/app/shared/components/ui/status/AppStatusBlock.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';
import type { iLoaderErrorAction, iLoaderResourceError } from '@/app/stores/loader/loader.type';

type tWidgetLoaderPhase = 'loading' | 'completing' | 'leaving';

interface Props {
  isVisible?: boolean;
  progress?: number;
  progressMode?: tAppLineLoaderMode;
  text: string;
  error?: iLoaderResourceError;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  progress: 0,
  progressMode: 'determinate',
  error: undefined,
});

const emit = defineEmits<{
  hidden: [];
}>();

const LEAVE_DURATION = 1900;

const isRendered = ref(props.isVisible);
const isActionRunning = ref(false);
const isProgressComplete = ref(false);
const phase = ref<tWidgetLoaderPhase>('loading');
let leaveTimer: ReturnType<typeof setTimeout> | undefined;

const loaderClass = computed(() => ['widget-loader-app', `widget-loader-app--${phase.value}`]);

watch(
  () => props.isVisible,
  (isVisible) => {
    if (!isVisible) {
      if (!isRendered.value) {
        return;
      }

      if (props.progressMode === 'determinate' && props.progress >= 100 && !props.error) {
        phase.value = isProgressComplete.value ? 'leaving' : 'completing';

        return;
      }

      phase.value = 'leaving';

      return;
    }

    clearLeaveTimer();
    isRendered.value = true;
    isProgressComplete.value = false;
    phase.value = 'loading';
  },
  { immediate: true },
);

watch(phase, (currentPhase) => {
  if (currentPhase !== 'leaving') {
    return;
  }

  clearLeaveTimer();
  leaveTimer = setTimeout(finishLeaving, LEAVE_DURATION);
});

watch(
  () => props.error,
  () => {
    isActionRunning.value = false;
  },
);

onBeforeUnmount(clearLeaveTimer);

function clearLeaveTimer() {
  if (leaveTimer === undefined) {
    return;
  }

  clearTimeout(leaveTimer);
  leaveTimer = undefined;
}

function finishLeaving() {
  clearLeaveTimer();

  if (phase.value !== 'leaving') {
    return;
  }

  isRendered.value = false;
  emit('hidden');
}

function handleLoaderProgressComplete() {
  isProgressComplete.value = true;

  if (!props.isVisible && phase.value === 'completing') {
    phase.value = 'leaving';
  }
}

async function handleErrorAction(action: iLoaderErrorAction) {
  if (isActionRunning.value) {
    return;
  }

  isActionRunning.value = true;

  try {
    await action.callback();
  } catch {
    // The resource callback owns its error state.
  } finally {
    isActionRunning.value = false;
  }
}
</script>

<template>
  <AppPosition
    :is-show="isRendered"
    data-app-loader-root
    tabindex="-1"
    type="fixed"
    layer="loader"
    :position="{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }"
  >
    <AppGrid :class="loaderClass" place-items="center" min-height="100dvh">
      <AppFlex class="widget-loader-app__content" direction="column" align="center" max-width="100%" width="100%">
        <AppLogo class="widget-loader-app__wordmark" logo="blindTextRight" width="100rem" height="auto" />

        <AppStatusBlock
          v-if="error"
          class="widget-loader-app__status"
          :text="error.title"
          variant="error"
          size="big"
          width="70rem"
          max-width="100%"
        >
          <template v-if="error.actions?.length" #action>
            <AppFlex align="center" justify="center" wrap="wrap" :gap="3" width="100%">
              <AppButton
                v-for="(action, index) in error.actions"
                :key="`${action.title}-${index}`"
                :text="action.title"
                :variant="index === 0 ? 'primary' : 'secondary'"
                :disabled="isActionRunning"
                size="small"
                @click="handleErrorAction(action)"
              />
            </AppFlex>
          </template>
        </AppStatusBlock>

        <AppLineLoader
          v-else
          class="widget-loader-app__status"
          :mode="progressMode"
          :progress="progress"
          :text="text"
          size="big"
          width="70rem"
          max-width="100%"
          @complete="handleLoaderProgressComplete"
        />
      </AppFlex>

      <AppLogo class="widget-loader-app__exit-logo" logo="blind" width="58rem" height="58rem" />

      <AppPosition
        class="widget-loader-app__version"
        type="absolute"
        :position="{
          right: 'horizontal',
          bottom: 'vertical',
        }"
      >
        <AppVersion size="big" />
      </AppPosition>
    </AppGrid>
  </AppPosition>
</template>

<style scoped>
.widget-loader-app {
  position: relative;
  overflow: hidden;
  padding: var(--app-safe-area-vertical) var(--app-safe-area-horizontal);
  background: var(--app-color-background);
  --widget-loader-app-leave-duration: 1900ms;
}

.widget-loader-app--leaving {
  pointer-events: none;
  animation: widget-loader-app-background-leave var(--widget-loader-app-leave-duration) ease-out forwards;
}

.widget-loader-app__content {
  gap: var(--app-space-5);
  transform: translateY(-2dvh);
}

.widget-loader-app__exit-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.72);
  will-change: transform, opacity;
}

.widget-loader-app--leaving .widget-loader-app__wordmark,
.widget-loader-app--leaving .widget-loader-app__status,
.widget-loader-app--leaving .widget-loader-app__version {
  animation: widget-loader-app-content-leave 240ms ease-out forwards;
}

.widget-loader-app--leaving .widget-loader-app__exit-logo {
  animation: widget-loader-app-logo-leave 1750ms 100ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes widget-loader-app-content-leave {
  to {
    opacity: 0;
  }
}


@keyframes widget-loader-app-logo-leave {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.72);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.02);
  }

  26% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  60% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.84);
  }
}

@keyframes widget-loader-app-background-leave {
  0%,
  55% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .widget-loader-app--leaving {
    animation: widget-loader-app-reduced-leave 200ms ease-out forwards;
  }

  .widget-loader-app--leaving .widget-loader-app__status,
  .widget-loader-app--leaving .widget-loader-app__version,
  .widget-loader-app--leaving .widget-loader-app__wordmark,
  .widget-loader-app--leaving .widget-loader-app__exit-logo {
    animation: none;
  }

  @keyframes widget-loader-app-reduced-leave {
    to {
      opacity: 0;
    }
  }
}
</style>

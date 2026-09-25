<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppGrid from '@/app/shared/components/atoms/block/AppGrid.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import AppLineLoader from '@/app/shared/components/ui/loader/AppLineLoader.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppStatusBlock from '@/app/shared/components/ui/status/AppStatusBlock.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';
import type { iLoaderResourceError } from '@/app/stores/loader/loader.type';

type tWidgetLoaderPhase = 'loading' | 'complete' | 'leaving';

interface Props {
  isActive?: boolean;
  progress?: number;
  text: string;
  error?: iLoaderResourceError;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  progress: 0,
  error: undefined,
});

const emit = defineEmits<{
  hidden: [];
}>();

const isRendered = ref(props.isActive);
const isActionRunning = ref(false);
const phase = ref<tWidgetLoaderPhase>('loading');

const loaderClass = computed(() => ['widget-loader-app', `widget-loader-app--${phase.value}`]);

watch(
  () => props.isActive,
  (isActive) => {
    if (!isActive) {
      phase.value = 'complete';

      return;
    }

    isRendered.value = true;
    phase.value = 'loading';
  },
  { immediate: true },
);

watch(
  () => props.error,
  () => {
    isActionRunning.value = false;
  },
);

function handleLoaderProgressComplete() {
  if (props.isActive || phase.value !== 'complete') {
    return;
  }

  phase.value = 'leaving';
}

async function handleErrorAction() {
  const action = props.error?.action;

  if (!action || isActionRunning.value) {
    return;
  }

  isActionRunning.value = true;

  try {
    await action.callback();
  } finally {
    isActionRunning.value = false;
  }
}

function handleLoaderAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget || phase.value !== 'leaving') {
    return;
  }

  isRendered.value = false;
  emit('hidden');
}
</script>

<template>
  <AppPosition
    :is-show="isRendered"
    type="fixed"
    layer="overlay"
    :position="{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }"
  >
    <AppGrid :class="loaderClass" place-items="center" min-height="100dvh" @animationend="handleLoaderAnimationEnd">
      <AppFlex class="widget-loader-app__content" direction="column" align="center" max-width="100%" width="100%">
        <AppLogo logo="blindTextRight" width="100rem" height="auto" />

        <AppStatusBlock
          v-if="error"
          :text="error.title"
          variant="error"
          size="big"
          width="70rem"
          max-width="100%"
        >
          <template v-if="error.action" #action>
            <AppButton
              :text="error.action.title"
              :disabled="isActionRunning"
              size="small"
              @click="handleErrorAction"
            />
          </template>
        </AppStatusBlock>

        <AppLineLoader
          v-else
          :progress="progress"
          :text="text"
          size="big"
          width="70rem"
          max-width="100%"
          @complete="handleLoaderProgressComplete"
        />
      </AppFlex>

      <AppPosition
        type="absolute"
        :position="{
          right: 'horizontal',
          bottom: 'vertical',
        }"
      >
        <AppVersion class="widget-loader-app__version" size="big" />
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
}

.widget-loader-app--leaving {
  animation: widget-loader-app-leave var(--app-motion-duration-slower) var(--app-motion-ease-default) forwards;
}

.widget-loader-app__content {
  gap: var(--app-space-5);
  transform: translateY(-2dvh);
}

@keyframes widget-loader-app-leave {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>

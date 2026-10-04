<script setup lang="ts">
import AppCard from '@/app/shared/components/atoms/card/AppCard.vue';
import type { PropsAppCard } from '@/app/shared/components/atoms/card/AppCard.vue';
import AppBloodFill from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import type { PropsAppBloodFill } from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import AppHoldAction from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import type { PropsAppHoldAction } from '@/app/shared/components/interaction/hold/AppHoldAction.vue';

export type PropsAppCardHold = PropsAppCard &
  PropsAppHoldAction &
  Omit<PropsAppBloodFill, 'isActive' | 'progressRatio'>;

withDefaults(defineProps<PropsAppCardHold>(), {
  tag: 'div',
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  backgroundColor: 'transparent',
  borderColor: 'border-contrast',
  borderWidth: 'thick',
  borderStyle: 'solid',
  borderRadius: 'lg',
  overflow: 'hidden',
  actions: undefined,
  disabled: false,
  flowFrontDuration: 1200,
  waveHeight: 'clamp(3.5rem, 12%, 6rem)',
  waveLengthScale: 1.3,
  duration: 650,
  fillDuration: undefined,
  holdStartDelay: 40,
  initialProgress: 15,
  releaseDuration: 140,
  progressSound: 'sfx.interaction.hold-progress',
  sound: 'sfx.interaction.hold-complete',
  startSound: 'sfx.interaction.hold-start',
  vibrationDuration: 45,
});

const emit = defineEmits<{
  complete: [];
}>();

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppHoldAction
    :actions="actions"
    :disabled="disabled"
    :duration="duration"
    :fill-duration="fillDuration"
    :hold-start-delay="holdStartDelay"
    :initial-progress="initialProgress"
    :move-cancel-threshold="moveCancelThreshold"
    :release-duration="releaseDuration"
    :progress-sound="progressSound"
    :sound="sound"
    :start-sound="startSound"
    :vibration-duration="vibrationDuration"
    :width="width"
    :max-width="maxWidth"
    @complete="handleComplete"
  >
    <template #default="{ isProgressActive, isHolding, isComplete }">
      <AppCard
        class="app-card-hold"
        :class="{
          'app-card-hold--disabled': disabled,
          'app-card-hold--holding': isHolding,
          'app-card-hold--complete': isComplete,
        }"
        :tag="tag"
        :size="size"
        width="100%"
        max-width="100%"
        :padding-x="paddingX"
        :padding-y="paddingY"
        :background-color="backgroundColor"
        :border-color="borderColor"
        :border-width="borderWidth"
        :border-style="borderStyle"
        :border-radius="borderRadius"
        :overflow="overflow"
      >
        <AppBloodFill
          :flow-front-duration="flowFrontDuration"
          :is-active="isProgressActive"
          :wave-height="waveHeight"
          :wave-length-scale="waveLengthScale"
        />

        <div class="app-card-hold__content">
          <slot :is-holding="isHolding" :is-complete="isComplete" />
        </div>
      </AppCard>
    </template>
  </AppHoldAction>
</template>

<style scoped>
.app-card-hold {
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.app-card-hold__content {
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
}

.app-card-hold--disabled {
  cursor: default;
}
</style>

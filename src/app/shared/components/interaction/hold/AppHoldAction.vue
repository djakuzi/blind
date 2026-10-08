<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsDisabled } from '@/app/shared/types/props/interaction.props';
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue';
import { FILL_CONTEXT } from '@/app/shared/context/fill/fill.context';
import { LibStyle } from '@/app/shared/lib/style';

import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { LibNumber } from '@/core/lib/number';
import { LibScheduler } from '@/core/lib/scheduler';
import type { tAudioId } from '@/core/media/audio';
import { ToolInput, ToolVibration } from '@/core/platform';

interface iAppHoldActionActions {
  complete?: () => void;
}

export interface PropsAppHoldAction extends PropsWidth, PropsDisabled {
  actions?: iAppHoldActionActions;
  duration?: number;
  fillDuration?: number;
  holdStartDelay?: number;
  initialProgress?: number;
  moveCancelThreshold?: number;
  releaseDuration?: number;
  progressSound?: tAudioId | null;
  sound?: tAudioId | null;
  startSound?: tAudioId | null;
  vibrationDuration?: number;
}

const props = withDefaults(defineProps<PropsAppHoldAction>(), {
  actions: undefined,
  disabled: false,
  duration: 650,
  fillDuration: undefined,
  holdStartDelay: 0,
  initialProgress: 15,
  maxWidth: '100%',
  moveCancelThreshold: 6,
  releaseDuration: 140,
  progressSound: 'sfx.interaction.hold-progress',
  sound: 'sfx.interaction.hold-complete',
  startSound: 'sfx.interaction.hold-start',
  vibrationDuration: 45,
  width: '100%',
});

const emit = defineEmits<{
  complete: [];
}>();

const { play, loop, setLoopVolume, stop } = useAudio();

const PROGRESS_SOUND_START_DELAY = 0;
const PROGRESS_SOUND_START_VOLUME = 0.1;
const PROGRESS_SOUND_END_VOLUME = 0.48;
const PROGRESS_SOUND_RELEASE_DURATION = 22;

const isHolding = ref(false);
const isProgressActive = ref(false);
const hasCompleted = ref(false);
const progress = ref(0);
const rootElement = ref<HTMLElement | null>(null);

let holdStartedAt = 0;
let holdDuration = 0;
let holdStartX = 0;
let holdStartY = 0;
const progressFrame = LibScheduler.createAnimationFrame();
const holdStartTimer = LibScheduler.createTimeout();
const holdCompleteTimer = LibScheduler.createTimeout();
const progressSoundStartTimer = LibScheduler.createTimeout();
const progressSoundFadeTimer = LibScheduler.createTimeout();
const progressSoundStopTimer = LibScheduler.createTimeout();

let progressSoundSession = 0;
let activeProgressSoundId: tAudioId | undefined;

let activePointerId: number | undefined;
let activePointerTarget: HTMLElement | undefined;
let activeTouchId: number | undefined;

function getCurrentTime(): number {
  return performance.now();
}

function setHoldStartPosition(x: number, y: number) {
  holdStartX = x;
  holdStartY = y;
}

function hasExceededMoveThreshold(x: number, y: number): boolean {
  const threshold = Math.max(0, props.moveCancelThreshold);

  return Math.hypot(x - holdStartX, y - holdStartY) >= threshold;
}

const normalizedInitialProgress = computed(() => LibNumber.clampFinite(props.initialProgress, 0, 100, 0));
const normalizedFillDuration = computed(() => Math.max(1, props.fillDuration ?? props.duration));
const normalizedHoldStartDelay = computed(() => Math.max(0, props.holdStartDelay));
const normalizedReleaseDuration = computed(() => Math.max(0, props.releaseDuration));
const normalizedProgress = computed(() => LibNumber.clampFinite(progress.value, 0, 100, 0));
const progressRatio = computed(() => normalizedProgress.value / 100);

provide(FILL_CONTEXT, {
  rootElement,
  progressRatio,
  isActive: isProgressActive,
});

const holdActionStyle = computed(() => ({
  '--cp-hold-action-width': LibStyle.toSizeValue(props.width) ?? 'auto',
  '--cp-hold-action-max-width': LibStyle.toSizeValue(props.maxWidth) ?? 'none',
  '--cp-hold-initial-progress-offset': `${100 - normalizedInitialProgress.value}%`,
}));

function setProgress(value: number) {
  const nextProgress = LibNumber.clampFinite(value, 0, 100, 0);

  progress.value = nextProgress;
  rootElement.value?.style.setProperty('--cp-hold-progress-offset', `${100 - nextProgress}%`);
}

setProgress(normalizedInitialProgress.value);

watch(normalizedInitialProgress, (initialProgress) => {
  if (isHolding.value) {
    return;
  }

  setProgress(initialProgress);
});

function runAudioRequest(request: Promise<void>, action: string) {
  request.catch((error) => {
    console.error(`Failed to ${action} hold progress audio:`, error);
  });
}

async function startProgressSound() {
  const soundId = props.progressSound;

  if (soundId === null || !isHolding.value) {
    return;
  }

  const session = ++progressSoundSession;

  await loop(soundId, {
    volume: PROGRESS_SOUND_START_VOLUME,
  });

  if (
    session !== progressSoundSession ||
    !isHolding.value ||
    props.progressSound !== soundId
  ) {
    return;
  }

  activeProgressSoundId = soundId;

  const rampDuration = Math.max(
    0,
    holdDuration -
      PROGRESS_SOUND_START_DELAY -
      PROGRESS_SOUND_RELEASE_DURATION,
  );

  await setLoopVolume(soundId, {
    volume: PROGRESS_SOUND_END_VOLUME,
    duration: rampDuration / 1000,
  });
}

function fadeProgressSoundForComplete() {
  const soundId = activeProgressSoundId;

  if (soundId === undefined) {
    return;
  }

  runAudioRequest(
    setLoopVolume(soundId, {
      volume: 0,
      duration: PROGRESS_SOUND_RELEASE_DURATION / 1000,
    }),
    'fade before complete',
  );
}

function scheduleProgressSound() {
  progressSoundStartTimer.cancel();
  progressSoundFadeTimer.cancel();
  progressSoundStopTimer.cancel();

  if (props.progressSound === null) {
    return;
  }

  const delay = Math.min(PROGRESS_SOUND_START_DELAY, holdDuration);

  if (delay === 0) {
    runAudioRequest(startProgressSound(), 'start');
  } else {
    progressSoundStartTimer.start(() => {
      runAudioRequest(startProgressSound(), 'start');
    }, delay);
  }

  const fadeDelay = Math.max(
    0,
    holdDuration - PROGRESS_SOUND_RELEASE_DURATION,
  );

  progressSoundFadeTimer.start(
    fadeProgressSoundForComplete,
    fadeDelay,
  );
}

function stopProgressSound(isImmediate = false) {
  progressSoundSession += 1;
  progressSoundStartTimer.cancel();
  progressSoundFadeTimer.cancel();
  progressSoundStopTimer.cancel();

  const soundId = activeProgressSoundId ?? props.progressSound;

  activeProgressSoundId = undefined;

  if (soundId === null) {
    return;
  }

  if (isImmediate || PROGRESS_SOUND_RELEASE_DURATION <= 0) {
    runAudioRequest(stop(soundId), 'stop');
    return;
  }

  runAudioRequest(
    setLoopVolume(soundId, {
      volume: 0,
      duration: PROGRESS_SOUND_RELEASE_DURATION / 1000,
    }),
    'fade',
  );

  progressSoundStopTimer.start(() => {
    runAudioRequest(stop(soundId), 'stop');
  }, PROGRESS_SOUND_RELEASE_DURATION);
}

function stopProgressSoundForComplete() {
  progressSoundSession += 1;
  progressSoundStartTimer.cancel();
  progressSoundFadeTimer.cancel();
  progressSoundStopTimer.cancel();

  const soundId = activeProgressSoundId ?? props.progressSound;

  activeProgressSoundId = undefined;

  if (soundId === null) {
    return;
  }

  runAudioRequest(stop(soundId), 'stop before complete');
}

function completeHold() {
  if (hasCompleted.value || !isHolding.value) {
    return;
  }

  holdCompleteTimer.cancel();
  progressFrame.cancel();
  stopProgressSoundForComplete();

  ToolVibration.vibrate({
    duration: props.vibrationDuration,
  });

  if (props.sound !== null) {
    play(props.sound);
  }

  hasCompleted.value = true;
  setProgress(100);

  props.actions?.complete?.();
  emit('complete');
}

function updateHoldProgress() {
  if (!isHolding.value) {
    return;
  }

  const elapsed = getCurrentTime() - holdStartedAt;
  const initialProgress = normalizedInitialProgress.value;
  const nextProgress = Math.min(
    100,
    initialProgress + (elapsed / holdDuration) * (100 - initialProgress),
  );

  setProgress(nextProgress);

  if (nextProgress >= 100) {
    return;
  }

  progressFrame.request(updateHoldProgress);
}

function beginHold() {
  if (isHolding.value) {
    return;
  }

  progressFrame.cancel();

  isHolding.value = true;
  isProgressActive.value = true;
  hasCompleted.value = false;
  setProgress(normalizedInitialProgress.value);
  holdStartedAt = getCurrentTime();
  holdDuration = normalizedFillDuration.value;

  if (props.startSound !== null) {
    play(props.startSound);
  }

  scheduleProgressSound();
  holdCompleteTimer.start(completeHold, holdDuration);
  progressFrame.request(updateHoldProgress);
}

function scheduleHold() {
  holdStartTimer.cancel();

  const delay = normalizedHoldStartDelay.value;

  if (delay === 0) {
    beginHold();
    return;
  }

  holdStartTimer.start(beginHold, delay);
}

function animateReleaseProgress() {
  const startProgress = normalizedProgress.value;
  const finishProgress = normalizedInitialProgress.value;
  const duration = normalizedReleaseDuration.value;

  if (startProgress <= finishProgress || duration <= 0) {
    setProgress(finishProgress);
    isProgressActive.value = false;
    return;
  }

  const releaseStartedAt = getCurrentTime();

  function updateReleaseProgress() {
    const elapsed = getCurrentTime() - releaseStartedAt;
    const releaseProgress = Math.min(1, elapsed / duration);
    const nextProgress = finishProgress + (startProgress - finishProgress) * (1 - releaseProgress);

    setProgress(nextProgress);

    if (releaseProgress >= 1) {
      setProgress(finishProgress);
      isProgressActive.value = false;
      return;
    }

    progressFrame.request(updateReleaseProgress);
  }

  progressFrame.request(updateReleaseProgress);
}

function releasePointerCapture() {
  const pointerId = activePointerId;
  const pointerTarget = activePointerTarget;

  activePointerId = undefined;
  activePointerTarget = undefined;

  if (
    pointerId === undefined ||
    pointerTarget === undefined ||
    typeof pointerTarget.hasPointerCapture !== 'function' ||
    typeof pointerTarget.releasePointerCapture !== 'function'
  ) {
    return;
  }

  if (!pointerTarget.hasPointerCapture(pointerId)) {
    return;
  }

  pointerTarget.releasePointerCapture(pointerId);
}

function resetHoldState(isImmediate = false) {
  const wasCompleted = hasCompleted.value;
  const shouldAnimateRelease =
    !isImmediate &&
    !wasCompleted &&
    progress.value > normalizedInitialProgress.value;

  holdStartTimer.cancel();
  holdCompleteTimer.cancel();
  progressFrame.cancel();
  stopProgressSound(isImmediate);

  isHolding.value = false;
  activeTouchId = undefined;

  releasePointerCapture();

  if (wasCompleted) {
    isProgressActive.value = false;
    return;
  }

  hasCompleted.value = false;

  if (shouldAnimateRelease) {
    animateReleaseProgress();
    return;
  }

  setProgress(normalizedInitialProgress.value);
  isProgressActive.value = false;
}

function isHoldPointer(event: PointerEvent): boolean {
  if (!event.isPrimary) {
    return false;
  }

  if (event.pointerType === 'mouse') {
    return event.button === 0;
  }

  return true;
}

function capturePointer(event: PointerEvent) {
  const target = event.currentTarget;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (typeof target.setPointerCapture === 'function') {
    target.setPointerCapture(event.pointerId);
  }

  activePointerId = event.pointerId;
  activePointerTarget = target;
}

function startPointerHold(event: PointerEvent) {
  if (props.disabled || !isHoldPointer(event)) {
    return;
  }

  event.preventDefault();

  setHoldStartPosition(event.clientX, event.clientY);
  capturePointer(event);
  scheduleHold();
}

function movePointerHold(event: PointerEvent) {
  if (activePointerId === undefined || event.pointerId !== activePointerId) {
    return;
  }

  if (hasExceededMoveThreshold(event.clientX, event.clientY)) {
    resetHoldState();
  }
}

function resetPointerHold(event?: PointerEvent) {
  if (event !== undefined && activePointerId !== undefined && event.pointerId !== activePointerId) {
    return;
  }

  resetHoldState();
}

function getActiveChangedTouch(event: TouchEvent): Touch | undefined {
  if (activeTouchId === undefined) {
    return undefined;
  }

  return Array.from(event.changedTouches).find((touch) => touch.identifier === activeTouchId);
}

function getActiveTouch(event: TouchEvent): Touch | undefined {
  if (activeTouchId === undefined) {
    return undefined;
  }

  return Array.from(event.touches).find((touch) => touch.identifier === activeTouchId);
}

function startTouchHold(event: TouchEvent) {
  if (ToolInput.supportsPointerEvents().value || props.disabled) {
    return;
  }

  const touch = event.changedTouches.item(0);

  if (touch === null) {
    return;
  }

  event.preventDefault();

  activeTouchId = touch.identifier;
  setHoldStartPosition(touch.clientX, touch.clientY);
  scheduleHold();
}

function moveTouchHold(event: TouchEvent) {
  if (ToolInput.supportsPointerEvents().value) {
    return;
  }

  const touch = getActiveTouch(event);

  if (touch !== undefined && hasExceededMoveThreshold(touch.clientX, touch.clientY)) {
    resetHoldState();
  }
}

function resetTouchHold(event: TouchEvent) {
  if (ToolInput.supportsPointerEvents().value) {
    return;
  }

  if (activeTouchId === undefined || getActiveChangedTouch(event) === undefined) {
    return;
  }

  event.preventDefault();
  resetHoldState();
}

function startMouseHold(event: MouseEvent) {
  if (ToolInput.supportsPointerEvents().value || props.disabled || event.button !== 0) {
    return;
  }

  event.preventDefault();

  setHoldStartPosition(event.clientX, event.clientY);
  scheduleHold();
}

function moveMouseHold(event: MouseEvent) {
  if (ToolInput.supportsPointerEvents().value || activeTouchId !== undefined) {
    return;
  }

  if (hasExceededMoveThreshold(event.clientX, event.clientY)) {
    resetHoldState();
  }
}

function resetMouseHold() {
  if (ToolInput.supportsPointerEvents().value || activeTouchId !== undefined) {
    return;
  }

  resetHoldState();
}

onMounted(() => {
  setProgress(progress.value);
});

onBeforeUnmount(() => {
  resetHoldState(true);
});
</script>

<template>
  <div
    ref="rootElement"
    class="app-hold-action"
    :style="holdActionStyle"
    @pointerdown="startPointerHold"
    @pointermove="movePointerHold"
    @pointerup="resetPointerHold"
    @pointercancel="resetPointerHold"
    @lostpointercapture="resetPointerHold"
    @touchstart="startTouchHold"
    @touchmove="moveTouchHold"
    @touchend="resetTouchHold"
    @touchcancel="resetTouchHold"
    @mousedown="startMouseHold"
    @mousemove="moveMouseHold"
    @mouseup="resetMouseHold"
    @mouseleave="resetMouseHold"
    @contextmenu.prevent
  >
    <slot
      :is-holding="isHolding"
      :is-progress-active="isProgressActive"
      :is-complete="hasCompleted"
    />
  </div>
</template>

<style scoped>
.app-hold-action {
  --cp-hold-progress-offset: var(--cp-hold-initial-progress-offset, 100%);

  display: inline-flex;
  width: var(--cp-hold-action-width);
  max-width: var(--cp-hold-action-max-width);
  min-width: 0;
  touch-action: none;
  -webkit-touch-callout: none;
}
</style>

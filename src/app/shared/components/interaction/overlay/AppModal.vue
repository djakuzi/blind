<script setup lang="ts">
import type { PropsWidth, PropsHeight } from '@/app/shared/types/props/dimensions.props';
import type { PropsPadding } from '@/app/shared/types/props/spacing.props';
import type { PropsSurface } from '@/app/shared/types/props/surface.props';
import type { PropsAccessibility } from '@/app/shared/types/props/accessibility.props';
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { useEventListener } from '@/app/shared/composables/dom/useEventListener';
import { LibStyle } from '@/core/lib/style';

import { resolveColorValue, type tColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveLayerValue, type tLayerValue } from '@/app/shared/styles/contracts/layer.contract';
import { resolvePaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import { resolveSurface } from '@/app/shared/styles/helpers/resolveSurface.helper';

type tAppModalLayoutOptions = PropsWidth & Pick<PropsHeight, 'maxHeight'>;
type tAppModalSurfaceOptions = PropsSurface & { backdropColor?: tColorValue };
type tAppModalBehaviorOptions = {
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
};

export interface PropsAppModal {
  modelValue: boolean;
  cornerStyle?: 'rounded' | 'angular';
  layer?: tLayerValue;
  optionsLayout?: tAppModalLayoutOptions;
  optionsSurface?: tAppModalSurfaceOptions;
  optionsHeader?: PropsPadding;
  optionsBody?: PropsPadding;
  optionsFooter?: PropsPadding;
  optionsBehavior?: tAppModalBehaviorOptions;
  optionsAccessibility?: PropsAccessibility;
}

const props = withDefaults(defineProps<PropsAppModal>(), {
  cornerStyle: 'angular',
  layer: 'modal',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const slots = useSlots();
const modalPanelRef = ref<HTMLElement | null>(null);
const elementToRestoreFocus = ref<HTMLElement | null>(null);
const previousBodyOverflow = ref<string | null>(null);
const isScrollLocked = ref(false);

const hasHeaderSlot = computed(() => Boolean(slots.header));
const hasFooterSlot = computed(() => Boolean(slots.footer));
const modalSurface = computed(() =>
  resolveSurface({
    backgroundColor: props.optionsSurface?.backgroundColor ?? 'surface-elevated',
    borderColor: props.optionsSurface?.borderColor ?? 'border-contrast',
    borderWidth: props.optionsSurface?.borderWidth ?? 'thick',
    borderStyle: props.optionsSurface?.borderStyle ?? 'solid',
    borderRadius: props.optionsSurface?.borderRadius ?? '2xl',
  }),
);

const modalClass = computed(() => ({
  'app-modal__panel--angular': props.cornerStyle === 'angular',
}));

const modalStyle = computed(() => ({
  '--cp-modal-layer': resolveLayerValue(props.layer),
  '--cp-modal-width': LibStyle.toSizeValue(props.optionsLayout?.width ?? '100%'),
  '--cp-modal-max-width': LibStyle.toSizeValue(props.optionsLayout?.maxWidth ?? '100rem'),
  '--cp-modal-max-height': LibStyle.toSizeValue(props.optionsLayout?.maxHeight ?? '100%'),
  '--cp-modal-backdrop-color': resolveColorValue(props.optionsSurface?.backdropColor ?? 'surface-overlay'),
  '--cp-modal-background-color': modalSurface.value.backgroundColor,
  '--cp-modal-border-color': modalSurface.value.borderColor,
  '--cp-modal-border-width': modalSurface.value.borderWidth,
  '--cp-modal-border-style': modalSurface.value.borderStyle,
  '--cp-modal-border-radius': modalSurface.value.borderRadius,
  '--cp-modal-header-padding-x': resolvePaddingValue(props.optionsHeader?.paddingX ?? 6),
  '--cp-modal-header-padding-y': resolvePaddingValue(props.optionsHeader?.paddingY ?? 5),
  '--cp-modal-body-padding-x': resolvePaddingValue(props.optionsBody?.paddingX ?? 6),
  '--cp-modal-body-padding-y': resolvePaddingValue(props.optionsBody?.paddingY ?? 5),
  '--cp-modal-footer-padding-x': resolvePaddingValue(props.optionsFooter?.paddingX ?? 6),
  '--cp-modal-footer-padding-y': resolvePaddingValue(props.optionsFooter?.paddingY ?? 5),
}));

function closeModal() {
  emit('update:modelValue', false);
}

function handleBackdropClick(event: MouseEvent) {
  if (!(props.optionsBehavior?.closeOnBackdrop ?? true) || event.target !== event.currentTarget) {
    return;
  }

  closeModal();
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.modelValue || !(props.optionsBehavior?.closeOnEscape ?? true) || event.key !== 'Escape') {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  closeModal();
}

function lockBodyScroll() {
  if (!(props.optionsBehavior?.lockScroll ?? true) || isScrollLocked.value) {
    return;
  }

  previousBodyOverflow.value = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  isScrollLocked.value = true;
}

function unlockBodyScroll() {
  if (!isScrollLocked.value) {
    return;
  }

  document.body.style.overflow = previousBodyOverflow.value ?? '';
  previousBodyOverflow.value = null;
  isScrollLocked.value = false;
}

const documentKeydownListener = useEventListener(document, 'keydown', handleKeydown, {
  autoStart: false,
});

async function handleOpen() {
  const activeElement = document.activeElement;
  const shouldSaveFocus = activeElement instanceof HTMLElement && !modalPanelRef.value?.contains(activeElement);

  if (shouldSaveFocus) {
    elementToRestoreFocus.value = activeElement;
  }

  if (!elementToRestoreFocus.value && activeElement instanceof HTMLElement) {
    elementToRestoreFocus.value = activeElement;
  }

  lockBodyScroll();
  documentKeydownListener.start();

  await nextTick();
  modalPanelRef.value?.focus({ preventScroll: true });
}

function restoreFocus() {
  if (props.modelValue) {
    return;
  }

  if (elementToRestoreFocus.value?.isConnected) {
    elementToRestoreFocus.value.focus({ preventScroll: true });
  }

  elementToRestoreFocus.value = null;
}

function handleAfterLeave() {
  restoreFocus();
}

function handleClose() {
  documentKeydownListener.stop();
  unlockBodyScroll();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      handleOpen();
      return;
    }

    handleClose();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  unlockBodyScroll();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal" @after-leave="handleAfterLeave">
      <div v-if="modelValue" class="app-modal" :style="modalStyle" @click="handleBackdropClick">
        <div
          ref="modalPanelRef"
          class="app-modal__panel"
          :class="modalClass"
          role="dialog"
          aria-modal="true"
          :aria-label="optionsAccessibility?.ariaLabel"
          :aria-labelledby="optionsAccessibility?.ariaLabelledby"
          :aria-describedby="optionsAccessibility?.ariaDescribedby"
          tabindex="-1"
        >
          <div class="app-modal__frame">
            <div class="app-modal__surface">
              <header v-if="hasHeaderSlot" class="app-modal__header">
                <slot name="header" />
              </header>

              <div class="app-modal__body">
                <slot />
              </div>

              <footer v-if="hasFooterSlot" class="app-modal__footer">
                <slot name="footer" />
              </footer>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-modal {
  position: fixed;
  z-index: var(--cp-modal-layer);
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  height: 100dvh;
  padding: var(--app-safe-area-top) var(--app-safe-area-right) var(--app-safe-area-bottom) var(--app-safe-area-left);
  box-sizing: border-box;
  background: var(--cp-modal-backdrop-color);
}

.app-modal__panel {
  display: flex;
  flex-direction: column;
  width: var(--cp-modal-width);
  max-width: var(--cp-modal-max-width);
  max-height: var(--cp-modal-max-height);
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  border: var(--cp-modal-border-width) var(--cp-modal-border-style) var(--cp-modal-border-color);
  border-radius: var(--cp-modal-border-radius);
  background: var(--cp-modal-background-color);
  overflow: hidden;
  transform: scale(1);

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-primary);
    outline-offset: 2px;
  }
}

.app-modal__frame,
.app-modal__surface {
  box-sizing: border-box;
  min-width: 0;
  height: 100%;
}

.app-modal__surface {
  display: flex;
  flex-direction: column;
}

.app-modal__panel--angular {
  padding: var(--cp-modal-border-width);
  border: 0;
  border-radius: 0;
  background: var(--cp-modal-border-color);
  clip-path: polygon(
    0 var(--cp-modal-border-radius),
    var(--cp-modal-border-radius) 0,
    calc(100% - var(--cp-modal-border-radius)) 0,
    100% var(--cp-modal-border-radius),
    100% calc(100% - var(--cp-modal-border-radius)),
    calc(100% - var(--cp-modal-border-radius)) 100%,
    var(--cp-modal-border-radius) 100%,
    0 calc(100% - var(--cp-modal-border-radius))
  );
}

.app-modal__panel--angular .app-modal__surface {
  border: 0;
  border-radius: 0;
  background: var(--cp-modal-background-color);
  clip-path: polygon(
    0 var(--cp-modal-border-radius),
    var(--cp-modal-border-radius) 0,
    calc(100% - var(--cp-modal-border-radius)) 0,
    100% var(--cp-modal-border-radius),
    100% calc(100% - var(--cp-modal-border-radius)),
    calc(100% - var(--cp-modal-border-radius)) 100%,
    var(--cp-modal-border-radius) 100%,
    0 calc(100% - var(--cp-modal-border-radius))
  );
}

.app-modal__header {
  flex: 0 0 auto;
  min-width: 0;
  padding: var(--cp-modal-header-padding-y) var(--cp-modal-header-padding-x);
  text-align: center;
}

.app-modal__body {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  padding: var(--cp-modal-body-padding-y) var(--cp-modal-body-padding-x);
  overflow-x: hidden;
  overflow-y: auto;
}

.app-modal__footer {
  flex: 0 0 auto;
  min-width: 0;
  padding: var(--cp-modal-footer-padding-y) var(--cp-modal-footer-padding-x);
}

.app-modal-enter-active,
.app-modal-leave-active {
  transition: opacity var(--app-motion-duration-medium) var(--app-motion-ease-default);

  .app-modal__panel {
    transition:
      opacity var(--app-motion-duration-medium) var(--app-motion-ease-default),
      transform var(--app-motion-duration-medium) var(--app-motion-ease-default);
  }
}

.app-modal-enter-from,
.app-modal-leave-to {
  opacity: 0;

  .app-modal__panel {
    opacity: 0;
    transform: scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-modal-enter-active,
  .app-modal-leave-active,
  .app-modal-enter-active .app-modal__panel,
  .app-modal-leave-active .app-modal__panel {
    transition: none;
  }
}
</style>

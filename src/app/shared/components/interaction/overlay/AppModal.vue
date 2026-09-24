<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import { resolveBorderStyleValue, resolveBorderWidthValue, type tBorderStyleValue, type tBorderWidthValue } from '@/app/styles/contracts/border.contract';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import { resolveLayerValue, type tLayerValue } from '@/app/styles/contracts/layer.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue, type tRadiusValue } from '@/app/styles/contracts/radius.contract';

export interface PropsAppModal {
  modelValue: boolean
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  maxHeight?: tStyleSizeValue
  layer?: tLayerValue
  backdropColor?: tColorValue
  backgroundColor?: tColorValue
  borderColor?: tColorValue
  borderWidth?: tBorderWidthValue
  borderStyle?: tBorderStyleValue
  borderRadius?: tRadiusValue
  headerPaddingX?: tPaddingValue
  headerPaddingY?: tPaddingValue
  bodyPaddingX?: tPaddingValue
  bodyPaddingY?: tPaddingValue
  footerPaddingX?: tPaddingValue
  footerPaddingY?: tPaddingValue
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  lockScroll?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<PropsAppModal>(), {
  width: '100%',
  maxWidth: '100rem',
  maxHeight: '100%',
  layer: 'modal',
  backdropColor: 'rgba(0, 0, 0, 0.6)',
  backgroundColor: 'surface-elevated',
  borderColor: 'border-contrast',
  borderWidth: 'thick',
  borderStyle: 'solid',
  borderRadius: '2xl',
  headerPaddingX: 6,
  headerPaddingY: 5,
  bodyPaddingX: 6,
  bodyPaddingY: 5,
  footerPaddingX: 6,
  footerPaddingY: 5,
  closeOnBackdrop: true,
  closeOnEscape: true,
  lockScroll: true,
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  ariaDescribedby: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const slots = useSlots();
const modalPanelRef = ref<HTMLElement | null>(null);
const elementToRestoreFocus = ref<HTMLElement | null>(null);
const previousBodyOverflow = ref<string | null>(null);
const isScrollLocked = ref(false);

const hasHeaderSlot = computed(() => Boolean(slots.header));
const hasFooterSlot = computed(() => Boolean(slots.footer));

const modalStyle = computed(() => ({
  '--cp-modal-layer': resolveLayerValue(props.layer),
  '--cp-modal-width': LibStyle.toSizeValue(props.width),
  '--cp-modal-max-width': LibStyle.toSizeValue(props.maxWidth),
  '--cp-modal-max-height': LibStyle.toSizeValue(props.maxHeight),
  '--cp-modal-backdrop-color': resolveColorValue(props.backdropColor),
  '--cp-modal-background-color': resolveColorValue(props.backgroundColor),
  '--cp-modal-border-color': resolveColorValue(props.borderColor),
  '--cp-modal-border-width': resolveBorderWidthValue(props.borderWidth),
  '--cp-modal-border-style': resolveBorderStyleValue(props.borderStyle),
  '--cp-modal-border-radius': resolveRadiusValue(props.borderRadius),
  '--cp-modal-header-padding-x': resolvePaddingValue(props.headerPaddingX),
  '--cp-modal-header-padding-y': resolvePaddingValue(props.headerPaddingY),
  '--cp-modal-body-padding-x': resolvePaddingValue(props.bodyPaddingX),
  '--cp-modal-body-padding-y': resolvePaddingValue(props.bodyPaddingY),
  '--cp-modal-footer-padding-x': resolvePaddingValue(props.footerPaddingX),
  '--cp-modal-footer-padding-y': resolvePaddingValue(props.footerPaddingY),
}));

function closeModal() {
  emit('update:modelValue', false);
}

function handleBackdropClick(event: MouseEvent) {
  if (!props.closeOnBackdrop || event.target !== event.currentTarget) {
    return;
  }

  closeModal();
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.modelValue || !props.closeOnEscape || event.key !== 'Escape') {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  closeModal();
}

function lockBodyScroll() {
  if (!props.lockScroll || isScrollLocked.value) {
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

function addDocumentListeners() {
  document.addEventListener('keydown', handleKeydown);
}

function removeDocumentListeners() {
  document.removeEventListener('keydown', handleKeydown);
}

async function handleOpen() {
  const activeElement = document.activeElement;
  const shouldSaveFocus = activeElement instanceof HTMLElement
    && !modalPanelRef.value?.contains(activeElement);

  if (shouldSaveFocus) {
    elementToRestoreFocus.value = activeElement;
  }

  if (!elementToRestoreFocus.value && activeElement instanceof HTMLElement) {
    elementToRestoreFocus.value = activeElement;
  }

  lockBodyScroll();
  addDocumentListeners();

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
  removeDocumentListeners();
  unlockBodyScroll();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      void handleOpen();
      return;
    }

    handleClose();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  removeDocumentListeners();
  unlockBodyScroll();
});
</script>

<template>
  <Teleport to="body">
    <Transition
      name="app-modal"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="modelValue"
        class="app-modal"
        :style="modalStyle"
        @click="handleBackdropClick"
      >
        <div
          ref="modalPanelRef"
          class="app-modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="ariaLabel"
          :aria-labelledby="ariaLabelledby"
          :aria-describedby="ariaDescribedby"
          tabindex="-1"
        >
          <header
            v-if="hasHeaderSlot"
            class="app-modal__header"
          >
            <slot name="header" />
          </header>

          <div class="app-modal__body">
            <slot />
          </div>

          <footer
            v-if="hasFooterSlot"
            class="app-modal__footer"
          >
            <slot name="footer" />
          </footer>
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
  padding:
    var(--app-safe-area-top)
    var(--app-safe-area-right)
    var(--app-safe-area-bottom)
    var(--app-safe-area-left);
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
  border:
    var(--cp-modal-border-width)
    var(--cp-modal-border-style)
    var(--cp-modal-border-color);
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

.app-modal__header {
  flex: 0 0 auto;
  min-width: 0;
  padding:
    var(--cp-modal-header-padding-y)
    var(--cp-modal-header-padding-x);
}

.app-modal__body {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  padding:
    var(--cp-modal-body-padding-y)
    var(--cp-modal-body-padding-x);
  overflow-x: hidden;
  overflow-y: auto;
}

.app-modal__footer {
  flex: 0 0 auto;
  min-width: 0;
  padding:
    var(--cp-modal-footer-padding-y)
    var(--cp-modal-footer-padding-x);
}

.app-modal-enter-active,
.app-modal-leave-active {
  transition: opacity 180ms ease;

  .app-modal__panel {
    transition:
      opacity 180ms ease,
      transform 180ms ease;
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

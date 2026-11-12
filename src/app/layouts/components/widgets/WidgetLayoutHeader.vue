<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { useHeaderActions } from '@/app/layouts/composables/common/useHeaderActions';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import AppButtonIcon from '@/app/shared/components/ui/button/AppButtonIcon.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';

const router = useRouter();
const { play } = useAudio();

const commonLocale = useLocale((locale) => locale.common);
const { actions } = useHeaderActions();

function handleBack() {
  play('sfx.navigation.back');
  router.back();
}
</script>

<template>
  <header class="layout-header">
    <AppFlex align="center" justify="between" :gap="4" width="100%">
      <AppFlex align="center" :gap="4">
        <AppButtonIcon
          group="back"
          icon="backArrow"
          width="var(--cp-layout-header-control-size)"
          height="var(--cp-layout-header-control-size)"
          :ariaLabel="commonLocale.navigation.back"
          @click="handleBack"
        />

        <AppLogo size="small" />
      </AppFlex>

      <TransitionGroup name="layout-header-action" tag="div" class="layout-header__actions">
        <AppButton
          v-for="action in actions"
          :key="action.key"
          variant="secondary"
          size="small"
          v-bind="action.optionsButton"
          :text="action.text"
          @click="action.onClick"
        />
      </TransitionGroup>
    </AppFlex>
  </header>
</template>

<style scoped>
.layout-header {
  --cp-layout-header-control-size: 6.5rem;

  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--app-safe-area-vertical) var(--app-safe-area-horizontal) var(--app-space-5);
}

.layout-header__actions {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  gap: var(--app-space-3);
}

.layout-header__actions :deep(.layout-header-action-enter-active),
.layout-header__actions :deep(.layout-header-action-leave-active) {
  transition: opacity var(--app-motion-duration-fast) var(--app-motion-ease-default);
}

.layout-header__actions :deep(.layout-header-action-enter-from),
.layout-header__actions :deep(.layout-header-action-leave-to) {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .layout-header__actions :deep(.layout-header-action-enter-active),
  .layout-header__actions :deep(.layout-header-action-leave-active) {
    transition: none;
  }
}
</style>

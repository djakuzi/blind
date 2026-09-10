<script setup lang="ts">
import { computed } from 'vue';

import type { ModelGameMode } from '@/app/domain/game/models/GameMode.model';
import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppFillAware from '@/app/shared/components/effects/fill/AppFillAware.vue';
import AppCardHold from '@/app/shared/components/ui/card/AppCardHold.vue';
import AppInfoRowList from '@/app/shared/components/ui/info/AppInfoRowList.vue';
import type { iAppInfoRowListItem } from '@/app/shared/components/ui/info/AppInfoRowList.vue';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';

export interface PropsUiCardGameMode {
  mode: ModelGameMode
  disabled?: boolean
}

const props = withDefaults(defineProps<PropsUiCardGameMode>(), {
  disabled: false,
});

const emit = defineEmits<{
  complete: []
}>();

const { resolvedThemeMode } = useAppThemeMode();

const imageSource = computed(() => props.mode.img[resolvedThemeMode.value]);

const optionItems = computed<iAppInfoRowListItem[]>(() => [
  {
    id: 'players',
    text: props.mode.getPlayersDescription(),
  },
  {
    id: 'rounds',
    text: props.mode.getRoundsDescription(),
  },
]);

const connectionItems = computed<iAppInfoRowListItem[]>(() =>
  props.mode.typeConnection.map((connectionType) => ({
    id: connectionType,
    text: TYPE_CONNECTION[connectionType].title,
  })),
);

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppCardHold
    class="ui-card-game-mode"
    :disabled="disabled"
    width="100%"
    max-width="100%"
    size="big"
    :padding-x="0"
    :padding-y="8"
    background-color="surface-primary"
    border-color="border-contrast"
    border-width="thick"
    border-radius="2xl"
    overflow="hidden"
    :initial-progress="20"
    @complete="handleComplete"
  >
    <div class="ui-card-game-mode__layout">
      <div class="ui-card-game-mode__main">
        <div class="ui-card-game-mode__header">
          <AppFillAware
            color="text-primary"
            filled-color="on-primary"
          >
            <AppTitle
              :text="mode.title"
              tag="h2"
              color="inherit"
              font-size="2xxl"
              font-weight="bold"
            />
          </AppFillAware>

          <AppFillAware
            class="ui-card-game-mode__description"
            color="text-secondary"
            filled-color="on-primary"
          >
            <AppText
              :text="mode.description"
              color="inherit"
              font-size="lg"
              font-weight="medium"
              :uppercase="true"
              :ellipsis="true"
              :max-lines="1"
            />
          </AppFillAware>
        </div>

        <AppImage
          class="ui-card-game-mode__image"
          :src="imageSource"
          :alt="mode.title"
          width="20rem"
          max-width="30%"
          height="auto"
          object-fit="contain"
          loading="eager"
        />
      </div>

      <div class="ui-card-game-mode__footer">
        <AppFillAware
          class="ui-card-game-mode__info"
          tag="div"
          color="text-primary"
          filled-color="on-primary"
          :initial-filled="true"
        >
          <AppInfoRowList
            :items="optionItems"
            width="auto"
            max-width="100%"
            size="big"
            text-color="inherit"
            divider-color="currentColor"
            font-weight="bold"
            accessibility-label="Параметры режима"
            :center-even="true"
          />
        </AppFillAware>

        <AppFillAware
          class="ui-card-game-mode__info"
          tag="div"
          color="text-primary"
          filled-color="on-primary"
          :initial-filled="true"
        >
          <AppInfoRowList
            :items="connectionItems"
            width="auto"
            max-width="100%"
            size="big"
            text-color="inherit"
            divider-color="currentColor"
            font-weight="medium"
            :center-even="false"
            :center-odd="false"
            accessibility-label="Доступные способы подключения"
          />
        </AppFillAware>
      </div>
    </div>
  </AppCardHold>
</template>

<style scoped>
.ui-card-game-mode :deep(.app-card-hold) {
  height: 100%;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .ui-card-game-mode :deep(.app-card-hold:not(.app-card-hold--disabled):hover) {
    border-color: var(--app-color-primary);
    box-shadow:
      0 0 0 var(--app-border-width-medium)
      color-mix(in srgb, var(--app-color-primary) 18%, transparent);
  }
}

.ui-card-game-mode :deep(.app-card-hold__content) {
  height: 100%;
}

.ui-card-game-mode__layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  gap: var(--app-space-12);
}

.ui-card-game-mode__main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-width: 0;
  min-height: 0;
  gap: var(--app-space-8);
}

.ui-card-game-mode__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: var(--app-space-12);
  text-align: center;
}

.ui-card-game-mode__description {
  max-width: 100%;
}

.ui-card-game-mode__image {
  flex: 0 1 auto;
  pointer-events: none;
}

.ui-card-game-mode__footer {
  display: flex;
  flex: 0 0 25%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  gap: var(--app-space-2);
}

.ui-card-game-mode__info {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 0;
}
</style>
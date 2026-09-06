<script setup lang="ts">
import { computed } from 'vue';
import type {
  ModelGameMode,
} from '@/app/domain/game/models/GameMode.model';
import {
  TYPE_CONNECTION,
} from '@/app/shared/constants/game/typeConnection.conts';
import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppCardHold from '@/app/shared/components/ui/card/AppCardHold.vue';
import AppInfoRowList from '@/app/shared/components/ui/info/AppInfoRowList.vue';
import type {
  iAppInfoRowListItem,
} from '@/app/shared/components/ui/info/AppInfoRowList.vue';
import {
  useAppThemeMode,
} from '@/app/shared/composables/system/useAppThemeMode';

export interface PropsUiCardGameMode {
  mode: ModelGameMode
  disabled?: boolean
}

const props = withDefaults(
  defineProps<PropsUiCardGameMode>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  complete: []
}>();

const {
  resolvedThemeMode,
} = useAppThemeMode();

const imageSource = computed(() =>
  props.mode.img[resolvedThemeMode.value],
);

const optionItems = computed<
  iAppInfoRowListItem[]
>(() => [
  {
    id: 'players',
    text: props.mode.getPlayersDescription(),
  },
  {
    id: 'rounds',
    text: props.mode.getRoundsDescription(),
  },
]);

const connectionItems = computed<
  iAppInfoRowListItem[]
>(() =>
  props.mode.typeConnection.map(
    (connectionType) => ({
      id: connectionType,
      text: TYPE_CONNECTION[
        connectionType
      ].title,
    }),
  ),
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
    :padding-y="0"
    background-color="surface-primary"
    border-color="border-contrast"
    border-width="thick"
    border-radius="xl"
    overflow="hidden"
    :initial-progress="25"
    @complete="handleComplete"
  >
    <div class="ui-card-game-mode__layout">
      <div class="ui-card-game-mode__main">
        <div class="ui-card-game-mode__header">
          <AppTitle
            :text="mode.title"
            tag="h2"
            color="text-primary"
            font-size="5xl"
            font-weight="bold"
          />

          <AppText
            class="ui-card-game-mode__description"
            :text="mode.description"
            color="text-secondary"
            font-size="xl"
            font-weight="medium"
            :uppercase="true"
            :ellipsis="true"
            :max-lines="1"
          />
        </div>

        <AppImage
          class="ui-card-game-mode__image"
          :src="imageSource"
          :alt="mode.title"
          width="9rem"
          max-width="25%"
          height="auto"
          object-fit="contain"
          loading="eager"
        />
      </div>

      <div class="ui-card-game-mode__footer">
        <AppInfoRowList
          :items="optionItems"
          width="auto"
          max-width="100%"
          size="middle"
          text-color="on-primary"
          divider-color="on-primary"
          font-weight="bold"
          accessibility-label="Параметры режима"
        />

        <AppInfoRowList
          :items="connectionItems"
          width="auto"
          max-width="100%"
          size="small"
          text-color="on-primary"
          divider-color="on-primary"
          font-weight="medium"
          accessibility-label="Доступные способы подключения"
        />
      </div>
    </div>
  </AppCardHold>
</template>

<style scoped>
.ui-card-game-mode {
  aspect-ratio: 1.9 / 1;
}

.ui-card-game-mode :deep(.app-card-hold) {
  height: 100%;
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
}

.ui-card-game-mode__main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  min-width: 0;
  min-height: 0;

  padding:
    var(--app-space-6)
    var(--app-space-8);
}

.ui-card-game-mode__header {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  min-width: 0;

  gap: var(--app-space-3);

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

  padding:
    var(--app-space-2)
    var(--app-space-6);
}

@media (max-width: 48rem) {
  .ui-card-game-mode {
    aspect-ratio: 1.7 / 1;
  }

  .ui-card-game-mode__main {
    padding:
      var(--app-space-4)
      var(--app-space-5);
  }

  .ui-card-game-mode__footer {
    padding-inline:
      var(--app-space-4);
  }
}
</style>
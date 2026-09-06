<script setup lang="ts">
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppCard from '@/app/shared/components/ui/card/AppCard.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import AppSwitch from '@/app/shared/components/ui/control/AppSwitch.vue';
import WidgetList from '@/app/shared/components/widgets/list/WidgetList.vue';
import {
  APP_SCALE_SYSTEM_MODE,
  isAppScaleMode,
} from '@/app/styles/contracts/appScale.contract';
import {
  isAppThemeMode,
} from '@/app/styles/contracts/appTheme.contract';
import {
  SETTINGS_SCALE_OPTIONS,
  SETTINGS_THEME_OPTIONS,
} from '../constants/settingsOptions.const';
import { useSettings } from '../composables/useSettings';

const SETTINGS_ITEMS = [
  {
    id: 'theme',
    text: 'Тема приложения',
  },
  {
    id: 'scale',
    text: 'Размер интерфейса',
  },
  {
    id: 'sound',
    text: 'Звук',
  },
] as const;

const {
  appThemeMode,
  appScaleMode,
  soundEnabled,
  setAppThemeMode,
  setAppScaleMode,
  setSoundEnabled,
} = useSettings();

async function handleThemeModeChange(
  value: string,
) {
  if (!isAppThemeMode(value)) {
    return;
  }

  await setAppThemeMode(value);
}

async function handleScaleModeChange(
  value: string,
) {
  if (
    !isAppScaleMode(value)
    || value === APP_SCALE_SYSTEM_MODE
  ) {
    return;
  }

  await setAppScaleMode(value);
}

function handleSoundEnabledChange(
  value: boolean,
) {
  setSoundEnabled(value);
}
</script>

<template>
  <AppCard
    class="widget-settings-panel"
    tag="section"
    width="100%"
    max-width="75rem"
    :padding-x="6"
    padding-y="0"
  >
    <WidgetList
      :items="SETTINGS_ITEMS"
      item-key="id"
      width="100%"
      padding-x="0"
      :padding-y="6"
      :row-gap="6"
      row-wrap="wrap"
      divider-color="border-default"
      divider-width="thin"
      accessibility-label="Настройки приложения"
    >
      <template #item="{ item }">
        <AppText
          class="widget-settings-panel__text"
          :text="item.text"
          tag="span"
          font-size="3xl"
          font-weight="medium"
          :uppercase="true"
          :ellipsis="true"
          :max-lines="1"
        />

        <AppFlex
          class="widget-settings-panel__control"
          align="center"
          justify="end"
          width="100%"
          max-width="35rem"
        >
          <AppSegmentedControl
            v-if="item.id === 'theme'"
            :model-value="appThemeMode"
            :options="SETTINGS_THEME_OPTIONS"
            size="big"
            width="100%"
            @update:model-value="handleThemeModeChange"
          />

          <AppSegmentedControl
            v-else-if="item.id === 'scale'"
            :model-value="appScaleMode"
            :options="SETTINGS_SCALE_OPTIONS"
            size="big"
            width="100%"
            @update:model-value="handleScaleModeChange"
          />

          <AppSwitch
            v-else
            :model-value="soundEnabled"
            accessibility-label="Звук"
            width="8rem"
            @update:model-value="handleSoundEnabledChange"
          />
        </AppFlex>
      </template>
    </WidgetList>
  </AppCard>
</template>

<style scoped>
.widget-settings-panel {
  margin-inline: auto;
}

.widget-settings-panel__text {
  flex: 1 1 20rem;
  min-width: 0;
}

.widget-settings-panel__control {
  min-width: 0;
  margin-left: auto;
}
</style>
<script lang="ts">
import type { CSSProperties } from 'vue';

import type { PropsAppText } from '@/app/shared/components/atoms/typography/AppText.vue';
import type { PropsAppSegmentedControl } from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import type { PropsAppSwitch } from '@/app/shared/components/ui/control/AppSwitch.vue';
import type { tStyleSizeValue } from '@/app/shared/lib/style';

import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

import type {
  tBorderStyleValue,
  tBorderWidthValue,
} from '@/app/styles/contracts/border.contract';

import type {
  tColorValue,
} from '@/app/styles/contracts/color.contract';

import type {
  tPaddingValue,
} from '@/app/styles/contracts/padding.contract';

import type {
  tSpaceValue,
} from '@/app/styles/contracts/space.contract';

export type tWidgetSettingsListTextProps =
  Partial<Omit<PropsAppText, 'text'>>;

export type tWidgetSettingsListSegmentedProps =
  Omit<PropsAppSegmentedControl, 'modelValue'>;

export type tWidgetSettingsListSwitchProps =
  Omit<
    PropsAppSwitch,
    'modelValue' | 'accessibilityLabel'
  > & {
    accessibilityLabel?: string
  };

export interface iWidgetSettingsListSegmentedControl {
  type: 'segmented'
  modelValue: string
  props: tWidgetSettingsListSegmentedProps
}

export interface iWidgetSettingsListSwitchControl {
  type: 'switch'
  modelValue: boolean
  props?: tWidgetSettingsListSwitchProps
}

export type tWidgetSettingsListControl =
  | iWidgetSettingsListSegmentedControl
  | iWidgetSettingsListSwitchControl;

export interface iWidgetSettingsListItem {
  id: string
  text: string
  textProps?: tWidgetSettingsListTextProps
  divider?: boolean
  control: tWidgetSettingsListControl
}

export interface PropsWidgetSettingsList {
  items: iWidgetSettingsListItem[]
  size?: tBaseSizeVariant

  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue

  controlWidth?: tStyleSizeValue
  controlMaxWidth?: tStyleSizeValue

  paddingX?: tPaddingValue
  paddingY?: tPaddingValue

  rowGap?: tSpaceValue
  rowWrap?: CSSProperties['flexWrap']

  dividerColor?: tColorValue
  dividerWidth?: tBorderWidthValue
  dividerStyle?: tBorderStyleValue

  textProps?: tWidgetSettingsListTextProps
}

export type tWidgetSettingsListChange =
  | {
    id: string
    type: 'segmented'
    value: string
  }
  | {
    id: string
    type: 'switch'
    value: boolean
  };
</script>

<script setup lang="ts">
import { computed } from 'vue';

import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import AppSwitch from '@/app/shared/components/ui/control/AppSwitch.vue';

import {
  resolveBorderStyleValue,
  resolveBorderWidthValue,
} from '@/app/styles/contracts/border.contract';

import {
  resolveColorValue,
} from '@/app/styles/contracts/color.contract';

import {
  resolvePaddingValue,
} from '@/app/styles/contracts/padding.contract';

const props = withDefaults(
  defineProps<PropsWidgetSettingsList>(),
  {
    size: 'middle',

    width: '100%',
    maxWidth: '100%',

    controlWidth: 'auto',
    controlMaxWidth: '100%',

    paddingX: 0,
    paddingY: undefined,

    rowGap: 6,
    rowWrap: 'nowrap',

    dividerColor: 'border-default',
    dividerWidth: 'thin',
    dividerStyle: 'solid',

    textProps: undefined,
  },
);

const emit = defineEmits<{
  change: [payload: tWidgetSettingsListChange]
}>();

const ROW_PADDING_Y_MAP: Record<
  tBaseSizeVariant,
  tPaddingValue
> = {
  small: 3,
  middle: 4,
  big: 5,
};

const rowPaddingX = computed(() =>
  resolvePaddingValue(props.paddingX),
);

const rowPaddingY = computed(() =>
  resolvePaddingValue(
    props.paddingY
      ?? ROW_PADDING_Y_MAP[props.size],
  ),
);

const dividerColor = computed(() =>
  resolveColorValue(props.dividerColor),
);

const dividerWidth = computed(() =>
  resolveBorderWidthValue(props.dividerWidth),
);

const dividerStyle = computed(() =>
  resolveBorderStyleValue(props.dividerStyle),
);

function resolveTextProps(
  item: iWidgetSettingsListItem,
): tWidgetSettingsListTextProps {
  return {
    tag: 'span',
    color: 'text-primary',
    fontSize: 'inherit',
    fontWeight: 'medium',
    uppercase: true,
    ellipsis: true,
    maxLines: 1,
    ...props.textProps,
    ...item.textProps,
  };
}

function hasDivider(
  item: iWidgetSettingsListItem,
  index: number,
) {
  return (
    index < props.items.length - 1
    && item.divider !== false
  );
}

function handleSegmentedChange(
  id: string,
  value: string,
) {
  emit('change', {
    id,
    type: 'segmented',
    value,
  });
}

function handleSwitchChange(
  id: string,
  value: boolean,
) {
  emit('change', {
    id,
    type: 'switch',
    value,
  });
}
</script>

<template>
  <AppFlex
    class="widget-settings-list"
    :class="`widget-settings-list--size-${size}`"
    direction="column"
    :width="width"
    :max-width="maxWidth"
  >
    <AppFlex
      v-for="(item, index) in items"
      :key="item.id"
      class="widget-settings-list__row"
      :class="{
        'widget-settings-list__row--divider':
          hasDivider(item, index),
      }"
      align="center"
      justify="between"
      :wrap="rowWrap"
      :gap="rowGap"
      width="100%"
    >
      <AppText
        class="widget-settings-list__text"
        v-bind="resolveTextProps(item)"
        :text="item.text"
      />

      <AppFlex
        class="widget-settings-list__control"
        align="center"
        justify="end"
        :width="controlWidth"
        :max-width="controlMaxWidth"
      >
        <AppSegmentedControl
          v-if="item.control.type === 'segmented'"
          v-bind="item.control.props"
          :model-value="item.control.modelValue"
          :size="item.control.props.size ?? size"
          @update:model-value="
            handleSegmentedChange(item.id, $event)
          "
        />

        <AppSwitch
          v-else
          v-bind="item.control.props ?? {}"
          :model-value="item.control.modelValue"
          :size="item.control.props?.size ?? size"
          :accessibility-label="
            item.control.props?.accessibilityLabel
              ?? item.text
          "
          @update:model-value="
            handleSwitchChange(item.id, $event)
          "
        />
      </AppFlex>
    </AppFlex>
  </AppFlex>
</template>

<style scoped>
.widget-settings-list {
  min-width: 0;
}

.widget-settings-list__row {
  min-width: 0;
  padding:
    v-bind(rowPaddingY)
    v-bind(rowPaddingX);

  &.widget-settings-list__row--divider {
    border-bottom:
      v-bind(dividerWidth)
      v-bind(dividerStyle)
      v-bind(dividerColor);
  }
}

.widget-settings-list__text {
  flex: 1 1 auto;
  min-width: 0;
}

.widget-settings-list__control {
  flex: 0 1 auto;
  min-width: 0;
  margin-left: auto;
}

.widget-settings-list--size-small {
  font-size: var(--app-font-size-xl);
}

.widget-settings-list--size-middle {
  font-size: var(--app-font-size-2xl);
}

.widget-settings-list--size-big {
  font-size: var(--app-font-size-3xl);
}
</style>

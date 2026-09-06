<script lang="ts">
import type { CSSProperties } from 'vue';

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

export type tWidgetListKey =
  | string
  | number;

export interface PropsWidgetList<
  TItem extends Record<string, unknown> = Record<string, unknown>,
> {
  items: readonly TItem[]

  itemKey?:
    | string
    | (
      (
        item: TItem,
        index: number,
      ) => tWidgetListKey
    )

  size?: tBaseSizeVariant

  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue

  gap?: tSpaceValue

  paddingX?: tPaddingValue
  paddingY?: tPaddingValue

  rowGap?: tSpaceValue

  rowAlign?:
    | CSSProperties['alignItems']
    | 'start'
    | 'end'

  rowJustify?:
    | CSSProperties['justifyContent']
    | 'start'
    | 'end'
    | 'between'

  rowWrap?: CSSProperties['flexWrap']

  divider?: boolean
  dividerColor?: tColorValue
  dividerWidth?: tBorderWidthValue
  dividerStyle?: tBorderStyleValue
  showLastDivider?: boolean

  accessibilityLabel?: string
}
</script>

<script
  setup
  lang="ts"
  generic="TItem extends Record<string, unknown>"
>
import { computed } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
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
  defineProps<PropsWidgetList<TItem>>(),
  {
    itemKey: undefined,
    size: 'middle',
    width: '100%',
    maxWidth: '100%',
    gap: 0,
    paddingX: 0,
    paddingY: undefined,
    rowGap: 0,
    rowAlign: 'center',
    rowJustify: 'between',
    rowWrap: 'nowrap',
    divider: true,
    dividerColor: 'border-default',
    dividerWidth: 'thin',
    dividerStyle: 'solid',
    showLastDivider: false,
    accessibilityLabel: undefined,
  },
);

defineSlots<{
  item(props: {
    item: TItem
    index: number
    isFirst: boolean
    isLast: boolean
  }): unknown

  empty?(): unknown
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

const listDividerColor = computed(() =>
  resolveColorValue(props.dividerColor),
);

const listDividerWidth = computed(() =>
  resolveBorderWidthValue(props.dividerWidth),
);

const listDividerStyle = computed(() =>
  resolveBorderStyleValue(props.dividerStyle),
);

function resolveItemKey(
  item: TItem,
  index: number,
): tWidgetListKey {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index);
  }

  if (typeof props.itemKey === 'string') {
    const value = item[props.itemKey];

    if (
      typeof value === 'string'
      || typeof value === 'number'
    ) {
      return value;
    }
  }

  return index;
}

function hasDivider(index: number) {
  if (!props.divider) {
    return false;
  }

  const isLast = index === props.items.length - 1;

  return !isLast || props.showLastDivider;
}
</script>

<template>
  <AppFlex
    class="widget-list"
    direction="column"
    :width="width"
    :max-width="maxWidth"
    :gap="gap"
    role="list"
    :aria-label="accessibilityLabel"
  >
    <template v-if="items.length">
      <AppFlex
        v-for="(item, index) in items"
        :key="resolveItemKey(item, index)"
        class="widget-list__row"
        :class="{
          'widget-list__row--divider':
            hasDivider(index),
        }"
        :align="rowAlign"
        :justify="rowJustify"
        :wrap="rowWrap"
        :gap="rowGap"
        width="100%"
        role="listitem"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :is-first="index === 0"
          :is-last="index === items.length - 1"
        />
      </AppFlex>
    </template>

    <slot
      v-else
      name="empty"
    />
  </AppFlex>
</template>

<style scoped>
.widget-list {
  min-width: 0;
}

.widget-list__row {
  min-width: 0;
  padding:
    v-bind(rowPaddingY)
    v-bind(rowPaddingX);
}

.widget-list__row--divider {
  border-bottom:
    v-bind(listDividerWidth)
    v-bind(listDividerStyle)
    v-bind(listDividerColor);
}
</style>
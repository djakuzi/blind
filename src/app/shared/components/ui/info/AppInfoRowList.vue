<script setup lang="ts">
import { computed } from 'vue';

import AppIcon from '@/app/shared/components/atoms/media/AppIcon.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';

import { LibStyle } from '@/app/shared/lib/style';
import type {
  tStyleSizeValue,
} from '@/app/shared/lib/style';

import type {
  tBaseSizeVariant,
} from '@/app/styles/contracts/base';

import {
  resolveBorderWidthValue,
  type tBorderWidthValue,
} from '@/app/styles/contracts/border.contract';

import {
  resolveColorValue,
  type tColorValue,
} from '@/app/styles/contracts/color.contract';

import type {
  tFontSizeValue,
} from '@/app/styles/contracts/fontSize.contract';

import type {
  tFontWeightValue,
} from '@/app/styles/contracts/fontWeight.contract';

import {
  resolvePaddingValue,
  type tPaddingValue,
} from '@/app/styles/contracts/padding.contract';
import {
  resolveSpaceValue,
  type tSpaceValue,
} from '@/app/styles/contracts/space.contract';
import type {
  tIconGroup,
  tIconName,
} from '@/core/media/assets';

export type tAppInfoRowListItemIcon = {
  [TGroup in tIconGroup]: {
    group: TGroup
    icon: tIconName<TGroup>
    alt?: string
  }
}[tIconGroup];

export interface iAppInfoRowListItem {
  id: string | number
  text: string
  icon?: tAppInfoRowListItemIcon
}

export interface PropsAppInfoRowList {
  items: readonly iAppInfoRowListItem[]
  size?: tBaseSizeVariant
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  paddingX?: tPaddingValue
  paddingY?: tPaddingValue
  iconWidth?: tStyleSizeValue
  iconGap?: tSpaceValue
  dividerGap?: tSpaceValue
  dividerHeight?: tStyleSizeValue
  dividerWidth?: tBorderWidthValue
  dividerColor?: tColorValue
  fontSize?: tFontSizeValue
  fontWeight?: tFontWeightValue
  textColor?: tColorValue
  uppercase?: boolean
  accessibilityLabel?: string
}

const props = withDefaults(
  defineProps<PropsAppInfoRowList>(),
  {
    size: 'middle',
    width: 'auto',
    maxWidth: '100%',
    paddingX: 0,
    paddingY: 0,
    iconWidth: undefined,
    iconGap: undefined,
    dividerGap: undefined,
    dividerHeight: undefined,
    dividerWidth: 'thin',
    dividerColor: 'currentColor',
    fontSize: undefined,
    fontWeight: 'medium',
    textColor: 'inherit',
    uppercase: true,
    accessibilityLabel: undefined,
  },
);

const SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    fontSize: tFontSizeValue
    iconWidth: tStyleSizeValue
    iconGap: tSpaceValue
    dividerGap: tSpaceValue
    dividerHeight: tStyleSizeValue
  }
> = {
  small: {
    fontSize: 'sm',
    iconWidth: '2rem',
    iconGap: 2,
    dividerGap: 4,
    dividerHeight: '2rem',
  },

  middle: {
    fontSize: 'md',
    iconWidth: '2.5rem',
    iconGap: 3,
    dividerGap: 5,
    dividerHeight: '2.5rem',
  },

  big: {
    fontSize: 'xl',
    iconWidth: '3rem',
    iconGap: 4,
    dividerGap: 6,
    dividerHeight: '3rem',
  },
};

const sizeConfig = computed(() =>
  SIZE_MAP[props.size],
);

const listWidth = computed(() =>
  LibStyle.toSizeValue(props.width),
);

const listMaxWidth = computed(() =>
  LibStyle.toSizeValue(props.maxWidth),
);

const listPaddingX = computed(() =>
  resolvePaddingValue(props.paddingX),
);

const listPaddingY = computed(() =>
  resolvePaddingValue(props.paddingY),
);

const itemFontSize = computed(() =>
  props.fontSize
    ?? sizeConfig.value.fontSize,
);

const itemIconWidth = computed(() =>
  LibStyle.toSizeValue(
    props.iconWidth
      ?? sizeConfig.value.iconWidth,
  ),
);

const itemIconGap = computed(() =>
  resolveSpaceValue(
    props.iconGap
      ?? sizeConfig.value.iconGap,
  ),
);

const itemDividerGap = computed(() =>
  resolveSpaceValue(
    props.dividerGap
      ?? sizeConfig.value.dividerGap,
  ),
);

const itemDividerHeight = computed(() =>
  LibStyle.toSizeValue(
    props.dividerHeight
      ?? sizeConfig.value.dividerHeight,
  ),
);

const itemDividerWidth = computed(() =>
  resolveBorderWidthValue(
    props.dividerWidth,
  ),
);

const itemDividerColor = computed(() =>
  resolveColorValue(
    props.dividerColor,
  ),
);
</script>

<template>
  <div
    class="app-info-row-list"
    role="list"
    :aria-label="accessibilityLabel"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="app-info-row-list__item"
      role="listitem"
    >
      <div class="app-info-row-list__content">
        <AppIcon
          v-if="item.icon"
          class="app-info-row-list__icon"
          :group="item.icon.group"
          :icon="item.icon.icon"
          :alt="item.icon.alt ?? ''"
          :width="itemIconWidth"
          height="auto"
        />

        <AppText
          class="app-info-row-list__text"
          :text="item.text"
          tag="span"
          :color="textColor"
          :font-size="itemFontSize"
          :font-weight="fontWeight"
          :uppercase="uppercase"
          :ellipsis="true"
          :max-lines="1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-info-row-list {
  display: flex;
  align-items: center;

  width: v-bind(listWidth);
  max-width: v-bind(listMaxWidth);
  min-width: 0;

  padding:
    v-bind(listPaddingY)
    v-bind(listPaddingX);

  overflow: hidden;
}

.app-info-row-list__item {
  display: flex;
  flex: 0 1 auto;
  align-items: center;

  min-width: 0;

  &:not(:last-child)::after {
    content: '';

    flex: 0 0 auto;

    width: v-bind(itemDividerWidth);
    height: v-bind(itemDividerHeight);

    margin-inline: v-bind(itemDividerGap);

    background: v-bind(itemDividerColor);
  }
}

.app-info-row-list__content {
  display: flex;
  align-items: center;

  min-width: 0;
}

.app-info-row-list__icon {
  flex: 0 0 auto;
  margin-right: v-bind(itemIconGap);
}

.app-info-row-list__text {
  min-width: 0;
  max-width: 100%;
}
</style>
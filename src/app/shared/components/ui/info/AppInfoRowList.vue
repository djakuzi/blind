<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from '@/app/shared/components/atoms/media/AppIcon.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppDistributedRow from '@/app/shared/components/layout/row/AppDistributedRow.vue';
import type { PropsAppDistributedRow } from '@/app/shared/components/layout/row/AppDistributedRow.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { BASE_SIZE_FONT_PRESET, BASE_SIZE_MEDIA_WIDTH_PRESET, BASE_SIZE_SPACE_PRESET } from '@/app/styles/presets/base.preset';
import { resolveBorderWidthValue, type tBorderWidthValue } from '@/app/styles/contracts/border.contract';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';
import type { tIconGroup, tIconName } from '@/core/media/assets';

export type tAppInfoRowListItemIcon = {
  [TGroup in tIconGroup]: {
    group: TGroup;
    icon: tIconName<TGroup>;
    alt?: string;
  };
}[tIconGroup];

export interface iAppInfoRowListItem {
  id: string | number;
  text: string;
  icon?: tAppInfoRowListItemIcon;
}

export interface PropsAppInfoRowList extends Omit<PropsAppDistributedRow, 'count'> {
  items: readonly iAppInfoRowListItem[];
  size?: tBaseSizeVariant;
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
  iconWidth?: tStyleSizeValue;
  iconGap?: tSpaceValue;
  dividerHeight?: tStyleSizeValue;
  dividerWidth?: tBorderWidthValue;
  dividerColor?: tColorValue;
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
  textColor?: tColorValue;
  uppercase?: boolean;
  accessibilityLabel?: string;
}

const props = withDefaults(defineProps<PropsAppInfoRowList>(), {
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  separatorGap: undefined,
  centerEven: true,
  centerOdd: true,
  overflow: 'hidden',
  paddingX: 0,
  paddingY: 0,
  iconWidth: undefined,
  iconGap: undefined,
  dividerHeight: undefined,
  dividerWidth: 'thin',
  dividerColor: 'currentColor',
  fontSize: undefined,
  fontWeight: 'medium',
  textColor: 'inherit',
  uppercase: true,
  accessibilityLabel: undefined,
});

const SEPARATOR_GAP_PRESET: Record<tBaseSizeVariant, tSpaceValue> = {
  small: 4,
  middle: 5,
  big: 6,
};

const listPaddingX = computed(() => resolvePaddingValue(props.paddingX));
const listPaddingY = computed(() => resolvePaddingValue(props.paddingY));

const itemFontSize = computed(() => props.fontSize ?? BASE_SIZE_FONT_PRESET[props.size]);
const itemIconWidth = computed(() => LibStyle.toSizeValue(props.iconWidth ?? BASE_SIZE_MEDIA_WIDTH_PRESET[props.size]));
const itemIconGap = computed(() => resolveSpaceValue(props.iconGap ?? BASE_SIZE_SPACE_PRESET[props.size]));

const rowSeparatorGap = computed(() => props.separatorGap ?? SEPARATOR_GAP_PRESET[props.size]);
const itemDividerHeight = computed(() => LibStyle.toSizeValue(props.dividerHeight ?? BASE_SIZE_MEDIA_WIDTH_PRESET[props.size]));
const itemDividerWidth = computed(() => resolveBorderWidthValue(props.dividerWidth));
const itemDividerColor = computed(() => resolveColorValue(props.dividerColor));

function getItem(index: number): iAppInfoRowListItem {
  return props.items[index] as iAppInfoRowListItem;
}
</script>

<template>
  <AppDistributedRow
    class="app-info-row-list"
    :count="items.length"
    :width="width"
    :max-width="maxWidth"
    :separator-gap="rowSeparatorGap"
    :center-even="centerEven"
    :center-odd="centerOdd"
    :overflow="overflow"
    role="list"
    :aria-label="accessibilityLabel"
  >
    <template #item="{ index }">
      <div class="app-info-row-list__item" role="listitem">
        <AppIcon
          v-if="getItem(index).icon"
          class="app-info-row-list__icon"
          :group="getItem(index).icon!.group"
          :icon="getItem(index).icon!.icon"
          :alt="getItem(index).icon!.alt ?? ''"
          :width="itemIconWidth"
          height="auto"
        />

        <AppText
          class="app-info-row-list__text"
          :text="getItem(index).text"
          tag="span"
          :color="textColor"
          :font-size="itemFontSize"
          :font-weight="fontWeight"
          :uppercase="uppercase"
          :ellipsis="true"
          :max-lines="1"
        />
      </div>
    </template>

    <template #separator>
      <span class="app-info-row-list__divider" />
    </template>
  </AppDistributedRow>
</template>

<style scoped>
.app-info-row-list {
  box-sizing: border-box;
  padding: v-bind(listPaddingY) v-bind(listPaddingX);
}

.app-info-row-list__item {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.app-info-row-list__icon {
  flex: 0 0 auto;
  margin-right: v-bind(itemIconGap);
}

.app-info-row-list__text {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}

.app-info-row-list__divider {
  display: block;
  width: v-bind(itemDividerWidth);
  height: v-bind(itemDividerHeight);
  background: v-bind(itemDividerColor);
}
</style>

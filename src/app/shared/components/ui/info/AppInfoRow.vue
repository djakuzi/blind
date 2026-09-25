<script setup lang="ts">
import { computed, useSlots } from 'vue';
import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import type { PropsAppImage } from '@/app/shared/components/atoms/media/AppImage.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';

export interface iAppInfoRowImage extends Pick<PropsAppImage, 'loading' | 'decoding' | 'objectFit' | 'aspectRatio'> {
  src: string;
  alt?: string;
}

export type tAppInfoRowMediaPosition = 'left' | 'right';

export interface PropsAppInfoRow {
  text: string;
  image?: iAppInfoRowImage;
  mediaPosition?: tAppInfoRowMediaPosition;
  size?: tBaseSizeVariant;
  width?: tStyleSizeValue;
  maxWidth?: tStyleSizeValue;
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
  mediaWidth?: tStyleSizeValue;
  mediaHeight?: tStyleSizeValue;
  mediaGap?: tSpaceValue;
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
  textColor?: tColorValue;
  uppercase?: boolean;
  ellipsis?: boolean;
  maxLines?: number;
}

const props = withDefaults(defineProps<PropsAppInfoRow>(), {
  image: undefined,
  mediaPosition: 'left',
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  paddingX: 0,
  paddingY: 0,
  mediaWidth: undefined,
  mediaHeight: 'auto',
  mediaGap: undefined,
  fontSize: undefined,
  fontWeight: 'medium',
  textColor: 'inherit',
  uppercase: false,
  ellipsis: true,
  maxLines: 1,
});

const slots = useSlots();

const SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    fontSize: tFontSizeValue;
    mediaWidth: tStyleSizeValue;
    mediaGap: tSpaceValue;
  }
> = {
  small: {
    fontSize: 'sm',
    mediaWidth: '2rem',
    mediaGap: 2,
  },
  middle: {
    fontSize: 'md',
    mediaWidth: '2.5rem',
    mediaGap: 3,
  },
  big: {
    fontSize: 'lg',
    mediaWidth: '3rem',
    mediaGap: 4,
  },
};

const sizeConfig = computed(() => SIZE_MAP[props.size]);
const hasMedia = computed(() => Boolean(slots.media || props.image));

const rowClass = computed(() => [
  'app-info-row',
  {
    'app-info-row--media-right': props.mediaPosition === 'right',
    'app-info-row--with-media': hasMedia.value,
  },
]);

const rowStyle = computed(() => ({
  '--cp-info-row-width': LibStyle.toSizeValue(props.width),
  '--cp-info-row-max-width': LibStyle.toSizeValue(props.maxWidth),
  '--cp-info-row-padding-x': resolvePaddingValue(props.paddingX),
  '--cp-info-row-padding-y': resolvePaddingValue(props.paddingY),
  '--cp-info-row-media-width': LibStyle.toSizeValue(props.mediaWidth ?? sizeConfig.value.mediaWidth),
  '--cp-info-row-media-height': LibStyle.toSizeValue(props.mediaHeight),
  '--cp-info-row-media-gap': resolveSpaceValue(props.mediaGap ?? sizeConfig.value.mediaGap),
  '--cp-info-row-text-color': resolveColorValue(props.textColor),
}));

const rowFontSize = computed(() => props.fontSize ?? sizeConfig.value.fontSize);
</script>

<template>
  <div :class="rowClass" :style="rowStyle">
    <div v-if="hasMedia" class="app-info-row__media">
      <slot name="media">
        <AppImage
          v-if="image"
          :src="image.src"
          :alt="image.alt ?? ''"
          :width="mediaWidth ?? sizeConfig.mediaWidth"
          :height="mediaHeight"
          :loading="image.loading"
          :decoding="image.decoding"
          :object-fit="image.objectFit"
          :aspect-ratio="image.aspectRatio"
        />
      </slot>
    </div>

    <AppText
      class="app-info-row__text"
      :text="text"
      tag="span"
      :color="textColor"
      :font-size="rowFontSize"
      :font-weight="fontWeight"
      :uppercase="uppercase"
      :ellipsis="ellipsis"
      :max-lines="maxLines"
    />
  </div>
</template>

<style scoped>
.app-info-row {
  display: flex;
  align-items: center;
  width: var(--cp-info-row-width);
  max-width: var(--cp-info-row-max-width);
  min-width: 0;
  box-sizing: border-box;
  padding: var(--cp-info-row-padding-y) var(--cp-info-row-padding-x);
  color: var(--cp-info-row-text-color);
}

.app-info-row--with-media {
  gap: var(--cp-info-row-media-gap);
}

.app-info-row--media-right {
  flex-direction: row-reverse;
}

.app-info-row__media {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--cp-info-row-media-width);
  height: var(--cp-info-row-media-height);
  min-width: 0;
}

.app-info-row__text {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}
</style>

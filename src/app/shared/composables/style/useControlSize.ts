import { computed } from 'vue';
import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsPadding } from '@/app/shared/types/props/spacing.props';
import type { PropsFont } from '@/app/shared/types/props/typography.props';
import { resolvePaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import { CONTROL_SIZE_PRESET, type iControlSizePreset } from '@/app/shared/styles/presets/control.preset';

type tControlSizeProps = PropsSizeVariant & PropsPadding & Pick<PropsFont, 'fontSize'>;

export function useControlSize(props: tControlSizeProps, preset: Record<tBaseSizeVariant, iControlSizePreset> = CONTROL_SIZE_PRESET) {
  const sizeConfig = computed(() => preset[props.size ?? 'middle']);

  const paddingX = computed(() => resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX));
  const paddingY = computed(() => resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY));
  const fontSize = computed(() => props.fontSize ?? sizeConfig.value.fontSize);

  return { paddingX, paddingY, fontSize };
}

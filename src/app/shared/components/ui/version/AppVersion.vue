<script setup lang="ts">
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsTypography } from '@/app/shared/types/props/typography.props';
import { computed } from 'vue';

import { resolveFontSizeValue } from '@/app/shared/styles/contracts/fontSize.contract';
import { config } from '@/config';

type tAppVersionVariant = 'primary';

interface Props extends PropsSizeVariant, Pick<PropsTypography, 'fontSize'> {
  variant?: tAppVersionVariant;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'middle',
  fontSize: undefined,
  variant: 'primary',
});

const versionLabel = computed(() => {
  const version = config.app.version.startsWith('v') ? config.app.version : `v${config.app.version}`;

  return version;
});

const versionClass = computed(() => [
  'app-version',
  `app-version--${props.variant}`,
  props.fontSize ? 'app-version--size-custom' : `app-version--size-${props.size}`,
]);

const versionFontSize = computed(() => resolveFontSizeValue(props.fontSize));
</script>

<template>
  <span :class="versionClass">
    {{ versionLabel }}
  </span>
</template>

<style scoped>
.app-version {
  display: inline-block;
  color: var(--app-color-text-secondary);
  font-weight: var(--app-font-weight-medium);
  line-height: var(--app-line-height-control);
}

.app-version--primary {
  color: var(--app-color-text-secondary);
}

.app-version--size-small {
  font-size: var(--app-font-size-xs);
}

.app-version--size-middle {
  font-size: var(--app-font-size-sm);
}

.app-version--size-big {
  font-size: var(--app-font-size-md);
}

.app-version--size-custom {
  font-size: v-bind(versionFontSize);
}
</style>

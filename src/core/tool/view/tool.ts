import { Capacitor } from '@capacitor/core';

import * as viewFeature from './features/view';
import type {
  iSetupViewOptions,
} from './type';

export type {
  iSetupViewOptions,
  tViewOrientation,
} from './type';

export function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return 1;
  }

  return window.innerWidth / window.innerHeight;
}

export async function setupView(options: iSetupViewOptions) {
  if (Capacitor.isNativePlatform()) {
    await viewFeature.setupNativeView(options);

    return;
  }

  await viewFeature.setupWebView(options);
}

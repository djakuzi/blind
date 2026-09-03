import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';

export async function setupNativeView() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await ScreenOrientation.lock({
    orientation: 'landscape',
  });

  await StatusBar.setOverlaysWebView({
    overlay: true,
  });

  await StatusBar.hide();
}

import { Capacitor } from '@capacitor/core';
import { TextZoom } from '@capacitor/text-zoom';

export function canUseTextZoom() {
  return Capacitor.isPluginAvailable('TextZoom');
}

export async function getCurrentTextZoomValue() {
  return TextZoom.get();
}

export async function getPreferredTextZoomValue() {
  return TextZoom.getPreferred();
}

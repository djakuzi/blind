export type {
  tSystemThemeMode,
} from './type';
import { Capacitor } from '@capacitor/core';
import { TextZoom } from '@capacitor/text-zoom';
import { DEFAULT_SCALE_VALUE } from './const';
import * as helpers from './helpers';
import type { tSystemThemeMode } from './type';

export function getPlatform() {
  return Capacitor.getPlatform();
}

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

export async function getCurrentScale() {
  if (!isNativePlatform()) {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }

  try {
    const { value } = await TextZoom.get();
    return {
      value: helpers.normalizeScaleValue(value),
    };
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }
}

export async function getPreferredScale() {
  if (!isNativePlatform()) {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }

  try {
    const { value } = await TextZoom.getPreferred();
    return {
      value: helpers.normalizeScaleValue(value),
    };
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }
}

export async function getSystemScale() {
  return getPreferredScale();
}

export function getPreferredThemeMode(): tSystemThemeMode {
  if (typeof globalThis.matchMedia !== 'function') {
    return 'light';
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

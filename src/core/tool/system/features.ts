import { Capacitor } from '@capacitor/core'
import { TextZoom } from '@capacitor/text-zoom'

import * as helpers from './helpers'
const DEFAULT_SCALE_VALUE = 1

export function getPlatform() {
  return Capacitor.getPlatform()
}

export async function getCurrentScale() {
  if (getPlatform() === 'web' || !Capacitor.isPluginAvailable('TextZoom')) {
    return {
      value: DEFAULT_SCALE_VALUE,
    }
  }

  try {
    const { value } = await TextZoom.get()
    return {
      value: helpers.normalizeScaleValue(value),
    }
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    }
  }
}

export async function getPreferredScale() {
  if (getPlatform() === 'web' || !Capacitor.isPluginAvailable('TextZoom')) {
    return {
      value: DEFAULT_SCALE_VALUE,
    }
  }

  try {
    const { value } = await TextZoom.getPreferred()
    return {
      value: helpers.normalizeScaleValue(value),
    }
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    }
  }
}

export async function getSystemScale() {
  return getPreferredScale()
}

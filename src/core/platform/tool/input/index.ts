import { resolveRuntimeAdapter } from '../../adapter';
import { BrowserInputAdapter } from './adapters/browser.adapter';
import { createInputTool } from './tool';

export type { iInputAdapter, tInputMediaQueryChangeCallback } from './type';

const InputAdapter = resolveRuntimeAdapter({
  web: BrowserInputAdapter,
  mobile: BrowserInputAdapter,
  desktop: BrowserInputAdapter,
});

export const { supportsPointerEvents, canHover, hasFinePointer, hasFineHoverPointer, isPrimaryPointerFine, onFineHoverPointerChange } =
  createInputTool(InputAdapter);

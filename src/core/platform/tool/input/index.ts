import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopInputAdapter } from './adapters/desktop.adapter';
import { MobileInputAdapter } from './adapters/mobile.adapter';
import { WebInputAdapter } from './adapters/web.adapter';

export type {
  iInputAdapter,
  iInputSubscription,
  iInputValue,
  tInputMediaQueryChangeCallback,
} from './type';

const InputAdapter = resolveAdapter(
  {
    web: WebInputAdapter,
    mobile: MobileInputAdapter,
    desktop: DesktopInputAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  supportsPointerEvents,
  canHover,
  hasFinePointer,
  hasFineHoverPointer,
  isPrimaryPointerFine,
  onFineHoverPointerChange,
} = InputAdapter;

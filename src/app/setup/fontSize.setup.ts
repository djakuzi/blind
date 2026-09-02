import {
  APP_ROOT_FONT_SIZE_BASE_VALUE,
  APP_ROOT_FONT_SIZE_CSS_VARIABLE_NAME,
  APP_SCALE_CSS_VARIABLE_NAME,
} from '@/app/styles/contracts/appScale.contract';
import { DomProperty } from '@/core/dom/property';
import { ToolSystem } from '@/core/tool/system';

export function setupFontSize() {
  const viewportRatio = ToolSystem.getViewportRatio();
  const rootFontSize = Math.round(APP_ROOT_FONT_SIZE_BASE_VALUE * viewportRatio);

  DomProperty.setProperty(
    APP_ROOT_FONT_SIZE_CSS_VARIABLE_NAME,
    `calc(${rootFontSize}px * var(${APP_SCALE_CSS_VARIABLE_NAME}))`,
  );
}

import * as ToolFilesystem from './tool/filesystem';
import * as ToolStorage from './tool/storage';
import * as ToolSystem from './tool/system';
import * as ToolVibration from './tool/vibration';

export { PlatformRuntime } from './runtime';
export { ToolFilesystem, ToolStorage, ToolSystem, ToolVibration };
export type {
  tAppPlatform,
  tAppRuntime,
  tDesktopAppPlatform,
  tMobileAppPlatform,
} from './runtime';

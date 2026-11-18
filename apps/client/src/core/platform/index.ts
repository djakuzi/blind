import * as ToolAudio from './tool/audio';
import * as ToolFilesystem from './tool/filesystem';
import * as ToolInput from './tool/input';
import * as ToolPower from './tool/power';
import * as ToolStorage from './tool/storage';
import * as ToolSystem from './tool/system';
import * as ToolVibration from './tool/vibration';
import * as ToolView from './tool/view';

export { PlatformRuntime } from './runtime';
export { ToolAudio, ToolFilesystem, ToolInput, ToolPower, ToolStorage, ToolSystem, ToolVibration, ToolView };
export type { tAppPlatform, tAppRuntime, tDesktopAppPlatform, tMobileAppPlatform } from './runtime';
export type { iPlatformActionResult, iPlatformSubscription, iPlatformValue } from './type';

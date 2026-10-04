import { registerAudioPlugin } from '../plugin/audio/main';
import { registerFilesystemPlugin } from '../plugin/filesystem/main';
import { registerPowerPlugin } from '../plugin/power/main';
import { registerStoragePlugin } from '../plugin/storage/main';
import { registerSystemPlugin } from '../plugin/system/main';
import { registerViewPlugin } from '../plugin/view/main';

export function registerElectronPlugins() {
  registerAudioPlugin();
  registerFilesystemPlugin();
  registerPowerPlugin();
  registerStoragePlugin();
  registerSystemPlugin();
  registerViewPlugin();
}

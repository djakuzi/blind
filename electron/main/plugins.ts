import { registerAudioPlugin } from '../plugin/audio/main';
import { registerFilesystemPlugin } from '../plugin/filesystem/main';
import { registerStoragePlugin } from '../plugin/storage/main';
import { registerViewPlugin } from '../plugin/view/main';

export function registerElectronPlugins() {
  registerAudioPlugin();
  registerFilesystemPlugin();
  registerStoragePlugin();
  registerViewPlugin();
}

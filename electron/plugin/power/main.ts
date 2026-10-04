import { ipcMain, powerSaveBlocker } from 'electron';
import { POWER_CHANNEL } from './channel';

let blockerId: number | undefined;

function keepAwake() {
  if (
    blockerId !== undefined &&
    powerSaveBlocker.isStarted(blockerId)
  ) {
    return;
  }

  blockerId = powerSaveBlocker.start('prevent-display-sleep');
}

function allowSleep() {
  if (blockerId === undefined) {
    return;
  }

  if (powerSaveBlocker.isStarted(blockerId)) {
    powerSaveBlocker.stop(blockerId);
  }

  blockerId = undefined;
}

export function registerPowerPlugin() {
  ipcMain.removeHandler(POWER_CHANNEL.keepAwake);
  ipcMain.removeHandler(POWER_CHANNEL.allowSleep);

  ipcMain.handle(POWER_CHANNEL.keepAwake, () => {
    keepAwake();
  });

  ipcMain.handle(POWER_CHANNEL.allowSleep, () => {
    allowSleep();
  });
}

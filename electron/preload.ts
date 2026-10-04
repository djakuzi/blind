import { contextBridge } from 'electron';
import { ELECTRON_CONFIG } from './config';
import { createElectronBridge } from './preload/bridge';

contextBridge.exposeInMainWorld(
  ELECTRON_CONFIG.bridgeKey,
  createElectronBridge(),
);

import { BrowserWindow, screen } from 'electron';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HelperRenderer } from '../shared/helpers/renderer.helper';

const CURRENT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const WINDOWED_SCALE = 0.9;

function setWindowedBounds(window: BrowserWindow) {
  const display = screen.getDisplayMatching(window.getBounds());
  const { x, y, width, height } = display.workArea;

  const windowWidth = Math.round(width * WINDOWED_SCALE);
  const windowHeight = Math.round(height * WINDOWED_SCALE);

  window.setBounds({
    x: x + Math.round((width - windowWidth) / 2),
    y: y + Math.round((height - windowHeight) / 2),
    width: windowWidth,
    height: windowHeight,
  });
}

export async function createMainWindow() {
  const window = new BrowserWindow({
    fullscreen: true,
    show: false,
    webPreferences: {
      preload: join(CURRENT_DIRECTORY, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  window.on('leave-full-screen', () => {
    setWindowedBounds(window);
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    await window.loadURL(devServerUrl);
    return window;
  }

  await window.loadURL(HelperRenderer.getRendererEntryUrl());

  return window;
}

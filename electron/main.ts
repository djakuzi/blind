import { app, BrowserWindow } from 'electron';
import { registerElectronPlugins } from './main/plugins';
import { createMainWindow } from './main/window';

app
  .whenReady()
  .then(async () => {
    registerElectronPlugins();
    await createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow().catch((error) => {
          console.error('Failed to create Electron window:', error);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start Electron application:', error);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

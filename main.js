const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

require('@electron/remote/main').initialize();

autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
const gotTheLock = app.requestSingleInstanceLock();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      symbolColor: '#20b2aa',
      color: '#1f1f1f',
      height: 30,
    },
    backgroundColor: '#1f1f1f',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: !isDev,
    },
  });

  require('@electron/remote/main').enable(mainWindow.webContents);

  if (!isDev) {
    mainWindow.loadURL(`file://${path.join(__dirname, './dist/vue/index.html')}`);
  } else {
    mainWindow.loadURL('http://localhost:5173/');
    // mainWindow.loadURL(`file://D:\\JS-TS\\Apps\\wave\\dist\\vue\\index.html`);
  }
}

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    autoUpdater.checkForUpdates();
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 600000);

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

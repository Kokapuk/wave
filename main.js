const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

require('@electron/remote/main').initialize();

autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
let forceQuit = false;
const gotTheLock = app.requestSingleInstanceLock();

function showOrRestore() {
  if (!mainWindow.isVisible()) mainWindow.show();
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
}

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
    roundedCorners: false,
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
  }
}

function createTray() {
  const iconPath = path.join(__dirname, './dist/vue/favicon.ico');
  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Wave', icon: nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 }), enabled: false },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        forceQuit = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Wave');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    showOrRestore();
  });
}

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      showOrRestore();
    }
  });

  app.whenReady().then(() => {
    autoUpdater.checkForUpdates();
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 600000);

    createWindow();
    createTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    mainWindow.on('close', (event) => {
      if (!forceQuit) {
        event.preventDefault();
        mainWindow.hide();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

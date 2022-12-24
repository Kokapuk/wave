const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

require('@electron/remote/main').initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    transparent: true,
    frame: false,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   symbolColor: '#20b2aa',
    //   color: '#1f1f1f',
    //   height: 30,
    // },
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

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

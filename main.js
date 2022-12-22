const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      symbolColor: '#b4fe17',
      color: '#1f1f1f',
      height: 30,
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: !isDev,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173/');
  } else {
    mainWindow.loadFile(path.join(__dirname, './dist/vue/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  mainWindow.openDevTools();

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

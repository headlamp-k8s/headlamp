const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const url = require('url');
let mainWindow;

const isDev = process.mainModule.filename.indexOf('app.asar') === -1 ||
    process.mainModule.filename.indexOf('app') === -1;

function createWindow () {
  let serverFilePath;
  if (!isDev) {
    serverFilePath = path.join(process.resourcesPath, './electron/server');
    spawn(serverFilePath);
  }

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

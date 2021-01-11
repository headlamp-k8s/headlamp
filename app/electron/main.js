const { app, BrowserWindow, Menu } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const url = require('url');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

const isMac = process.platform === 'darwin';

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Open an issue',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/kinvolk/headlamp/issues');
        }
      },
      {
        label: 'About',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/kinvolk/headlamp');
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const isDev = process.mainModule.filename.indexOf('app.asar') === -1 ||
    process.mainModule.filename.indexOf('app') === -1;

let serverProcess = null;
let intentionalQuit = false;
let serverProcessQuit = false;

/**
 * add some error handlers to the serverProcess.
 * @param  {ChildProcess} serverProcess to attach the error handlers to.
 */
function attachServerEventHandlers (serverProcess) {
  serverProcess.on('error', (err) => {
    log.error(`server process failed to start: ${err}`);
  });
  serverProcess.stdout.on('data', (data) => {
    log.info(`server process stdout: ${data}`);
  });
  serverProcess.stderr.on('data', (data) => {
    const sterrMessage = `server process stderr: ${data}`;
    if (data && data.indexOf && data.indexOf("Requesting") !== -1) {
      // The server prints out urls it's getting, which aren't errors.
      log.info(sterrMessage);
    } else {
      log.error(sterrMessage);
    }
  });
  serverProcess.on('close', (code, signal) => {
    const closeMessage = `server process process exited with code:${code} signal:${signal}`;
    if (!intentionalQuit) {
      // @todo: message mainWindow, or loadURL to an error url?
      log.error(closeMessage);
    } else {
      log.info(closeMessage);
    }
    serverProcessQuit = true;
  });
}

function createWindow () {
  let serverFilePath;
  if (!isDev) {
    serverFilePath = path.join(process.resourcesPath, './electron/server');
    serverProcess = spawn(serverFilePath, {shell: true});
    attachServerEventHandlers(serverProcess);
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
  autoUpdater.checkForUpdatesAndNotify();
}

autoUpdater.autoDownload = true;

function sendStatusToWindow(text) {
  log.info(`Sending status to window: ${text}`);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', () => {
  sendStatusToWindow('Update is available');
});

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded');
});

app.on('ready', createWindow);

app.on('quit', function () {
  if (serverProcess) {
    if (serverProcessQuit) {
      log.error('server process already not running');
    } else {
      intentionalQuit = true;
      log.info('stopping server process...');
      serverProcess.stdin.pause();
      // @todo: should we try and end the process a bit more gracefully?
      //       What happens if the kill signal doesn't kill it?
      serverProcess.kill();
    }
    serverProcess = null;
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.once('window-all-closed', app.quit);

app.once('before-quit', () => {
  mainWindow.removeAllListeners('close');
});

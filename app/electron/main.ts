import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { app, BrowserWindow, Menu, MenuItem, screen } from 'electron';
import { MenuItemConstructorOptions } from 'electron/main';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import open from 'open';
import path from 'path';
import url from 'url';
import yargs from 'yargs';

const args = yargs
  .option('headless', {
    describe: 'Open Headlamp in the default web browser instead of its app window',
  })
  .parse();
const isHeadlessMode = args.headless;
const defaultPort = 4466;

function startServer(flags: string[] = []): ChildProcessWithoutNullStreams {
  const serverFilePath = path.join(process.resourcesPath, './server');
  return spawn(serverFilePath, [...flags], { shell: true });
}

let serverProcess: ChildProcessWithoutNullStreams | null;
let intentionalQuit: boolean;
let serverProcessQuit: boolean;

function startElecron() {
  log.transports.file.level = 'info';
  log.info('App starting...');

  let mainWindow: BrowserWindow | null;

  const isMac = process.platform === 'darwin';

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
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
              { role: 'quit' },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
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
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
      ],
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
        { role: 'togglefullscreen' },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Open an issue',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/kinvolk/headlamp/issues');
          },
        },
        {
          label: 'About',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/kinvolk/headlamp');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template as (MenuItemConstructorOptions | MenuItem)[]);
  Menu.setApplicationMenu(menu);

  const isDev = process.env.ELECTRON_DEV || false;

  function createWindow() {
    const startUrl =
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(process.resourcesPath, 'frontend', 'index.html'),
        protocol: 'file:',
        slashes: true,
      });
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({ width, height });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
    autoUpdater.checkForUpdatesAndNotify();

    if (!isDev) {
      serverProcess = startServer();
      attachServerEventHandlers(serverProcess);
    }
  }
  autoUpdater.autoDownload = true;

  function sendStatusToWindow(text: string) {
    log.info(`Sending status to window: ${text}`);
    if (mainWindow) {
      mainWindow.webContents.send('message', text);
    }
  }

  autoUpdater.on('update-not-available', info => {
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
  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.once('window-all-closed', app.quit);

  app.once('before-quit', () => {
    if (mainWindow) {
      mainWindow.removeAllListeners('close');
    }
  });
}

app.on('quit', function () {
  if (serverProcess) {
    if (serverProcessQuit) {
      log.error('server process already not running');
    } else {
      intentionalQuit = true;
      log.info('stopping server process...');
      serverProcess.stdin.destroy();
      // @todo: should we try and end the process a bit more gracefully?
      //       What happens if the kill signal doesn't kill it?
      serverProcess.kill();
    }
    serverProcess = null;
  }
});

/**
 * add some error handlers to the serverProcess.
 * @param  {ChildProcess} serverProcess to attach the error handlers to.
 */
function attachServerEventHandlers(serverProcess: ChildProcessWithoutNullStreams) {
  serverProcess.on('error', err => {
    log.error(`server process failed to start: ${err}`);
  });
  serverProcess.stdout.on('data', data => {
    log.info(`server process stdout: ${data}`);
  });
  serverProcess.stderr.on('data', data => {
    const sterrMessage = `server process stderr: ${data}`;
    if (data && data.indexOf && data.indexOf('Requesting') !== -1) {
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

if (isHeadlessMode) {
  serverProcess = startServer(['-html-static-dir', path.join(process.resourcesPath, './frontend')]);
  attachServerEventHandlers(serverProcess);
  (async () => {
    await open(`http://localhost:${defaultPort}`);
  })();
} else {
  startElecron();
}

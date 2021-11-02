import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { app, BrowserWindow, ipcMain, Menu, MenuItem, screen, shell } from 'electron';
import { IpcMainEvent, MenuItemConstructorOptions } from 'electron/main';
import log from 'electron-log';
import fs from 'fs';
import { i18n as I18n } from 'i18next';
import open from 'open';
import os from 'os';
import path from 'path';
import url from 'url';
import yargs from 'yargs';
import i18n from './i18next.config';

const args = yargs
  .command('$0 [kubeconfig]', '', yargs => {
    yargs
      .option('headless', {
        describe: 'Open Headlamp in the default web browser instead of its app window',
      })
      .option('disable-gpu', {
        describe: 'Disable use of GPU. For people who may have buggy graphics drivers',
      })
      .positional('kubeconfig', {
        describe:
          'Path to the kube config file (uses the default kube config location if not specified)',
        type: 'string',
      });
  })
  .help().argv;
const isHeadlessMode = args.headless;
const disableGPU = args['disable-gpu'];
const defaultPort = 4466;

const isDev = process.env.ELECTRON_DEV || false;
const useExternalServer = process.env.EXTERNAL_SERVER || false;

function startServer(flags: string[] = []): ChildProcessWithoutNullStreams {
  const serverFilePath = isDev
    ? path.resolve('../backend/server')
    : path.join(process.resourcesPath, './server');

  const options = { shell: true, detached: false };
  if (process.platform !== 'win32' && !isDev) {
    // This makes the child processes a separate group, for easier killing.
    options.detached = true;
  }

  let serverArgs = [];
  if (!!args.kubeconfig || !!process.env.KUBECONFIG) {
    let fullPath = args.kubeconfig || process.env.KUBECONFIG;

    // Resolve home dir if needed.
    if (process.platform !== 'win32' && fullPath[0] === '~') {
      fullPath = path.join(os.homedir(), fullPath.slice(1));
    }

    fullPath = path.resolve(fullPath);

    if (!fs.existsSync(fullPath)) {
      log.error(`Error reading kube config ${fullPath}: does not exist`);
      process.exit(1);
    }
    serverArgs = serverArgs.concat(['--kubeconfig', fullPath]);
  }

  serverArgs.concat(flags);

  return spawn(serverFilePath, serverArgs, options);
}

let serverProcess: ChildProcessWithoutNullStreams | null;
let intentionalQuit: boolean;
let serverProcessQuit: boolean;

function quitServerProcess() {
  if (!serverProcess || serverProcessQuit) {
    log.error('server process already not running');
    return;
  }

  intentionalQuit = true;
  log.info('stopping server process...');
  if (process.platform !== 'win32') {
    // Negative pid because it should kill the whole group of processes:
    //    https://azimi.me/2014/12/31/kill-child_process-node-js.html
    process.kill(-serverProcess.pid);
  }

  serverProcess.stdin.destroy();
  // @todo: should we try and end the process a bit more gracefully?
  //       What happens if the kill signal doesn't kill it?
  serverProcess.kill();

  serverProcess = null;
}

function setMenu(i18n: I18n) {
  const isMac = process.platform === 'darwin';

  const sep = { type: 'separator' };
  const aboutMenu = {
    label: i18n.t('About'),
    role: 'about',
  };
  const quitMenu = {
    label: i18n.t('Quit'),
    role: 'quit',
  };
  const selectAllMenu = {
    label: i18n.t('Select All'),
    role: 'selectAll',
  };
  const deleteMenu = {
    label: i18n.t('Delete'),
    role: 'delete',
  };

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              aboutMenu,
              sep,
              {
                label: i18n.t('Services'),
                role: 'services',
              },
              sep,
              {
                label: i18n.t('Hide Headlamp'),
                role: 'hide',
              },
              {
                label: i18n.t('Hide Others'),
                role: 'hideothers',
              },
              {
                label: i18n.t('Show All'),
                role: 'unhide',
              },
              sep,
              quitMenu,
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: i18n.t('File'),
      submenu: [
        isMac
          ? {
              label: i18n.t('Close'),
              role: 'close',
            }
          : quitMenu,
      ],
    },
    // { role: 'editMenu' }
    {
      label: i18n.t('Edit'),
      submenu: [
        {
          label: i18n.t('Cut'),
          role: 'cut',
        },
        {
          label: i18n.t('Copy'),
          role: 'copy',
        },
        {
          label: i18n.t('Paste'),
          role: 'paste',
        },
        ...(isMac
          ? [
              {
                label: i18n.t('Paste and Match Style'),
                role: 'pasteAndMatchStyle',
              },
              deleteMenu,
              selectAllMenu,
              sep,
              {
                label: i18n.t('Speech'),
                submenu: [
                  {
                    label: i18n.t('Start Speaking'),
                    role: 'startspeaking',
                  },
                  {
                    label: i18n.t('Stop Speaking'),
                    role: 'stopspeaking',
                  },
                ],
              },
            ]
          : [deleteMenu, sep, selectAllMenu]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: i18n.t('View'),
      submenu: [
        {
          label: i18n.t('Reload'),
          role: 'forcereload',
        },
        {
          label: i18n.t('Toggle Developer Tools'),
          role: 'toggledevtools',
        },
        sep,
        {
          label: i18n.t('Reset Zoom'),
          role: 'resetzoom',
        },
        {
          label: i18n.t('Zoom In'),
          role: 'zoomin',
        },
        {
          label: i18n.t('Zoom Out'),
          role: 'zoomout',
        },
        sep,
        {
          label: i18n.t('Toogle Fullscreen'),
          role: 'togglefullscreen',
        },
      ],
    },
    {
      label: i18n.t('Window'),
      submenu: [
        {
          label: i18n.t('Minimize'),
          role: 'minimize',
        },
        ...(isMac
          ? [
              sep,
              {
                label: i18n.t('Bring All to Front'),
                role: 'front',
              },
              sep,
              {
                label: i18n.t('Window'),
                role: 'window',
              },
            ]
          : [
              {
                label: i18n.t('Close'),
                role: 'close',
              },
            ]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: i18n.t('Documentation'),
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://kinvolk.io/docs/headlamp/latest');
          },
        },
        {
          label: i18n.t('Open an Issue'),
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/kinvolk/headlamp/issues');
          },
        },
        {
          label: i18n.t('About'),
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
}

function calculateWindowSize() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const [maxWidth, maxHeight] = [1920, 1080];
  const pixelRatio = screen.getPrimaryDisplay().scaleFactor;

  switch (pixelRatio) {
    case 1:
      if (width / pixelRatio > 1920) {
        return { width: maxWidth, height: maxHeight };
      }
    case 2:
      if (width / pixelRatio > 1000) {
        return { width: maxWidth, height: maxHeight };
      }
  }
  return { width, height };
}

function startElecron() {
  log.transports.file.level = 'info';
  log.info('App starting...');

  let mainWindow: BrowserWindow | null;

  let appVersion: string;
  if (isDev && process.env.HEADLAMP_APP_VERSION) {
    appVersion = process.env.HEADLAMP_APP_VERSION;
    console.debug(`Overridding app version to ${appVersion}`);
  } else {
    appVersion = app.getVersion();
  }

  setMenu(i18n);

  function createWindow() {
    let frontendPath = '';
    if (isDev) {
      frontendPath = path.resolve('..', 'frontend', 'build', 'index.html');
    } else {
      frontendPath = path.join(process.resourcesPath, 'frontend', 'index.html');
    }

    const startUrl =
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: frontendPath,
        protocol: 'file:',
        slashes: true,
      });
    const { width, height } = calculateWindowSize();
    mainWindow = new BrowserWindow({
      width,
      height,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: `${__dirname}/preload.js`,
      },
    });
    mainWindow.loadURL(startUrl);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      // allow all urls starting with app startUrl to open in electron
      if (url.startsWith(startUrl)) {
        return { action: 'allow' };
      }
      // otherwise open url in a browser and prevent default
      shell.openExternal(url);
      return { action: 'deny' };
    });

    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.webContents.send('appVersion', appVersion);
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    i18n.on('languageChanged', () => {
      setMenu(i18n);
    });

    ipcMain.on('locale', (event: IpcMainEvent, newLocale: string) => {
      if (!!newLocale && i18n.language !== newLocale) {
        i18n.changeLanguage(newLocale);
      }
    });

    if (!useExternalServer) {
      serverProcess = startServer();
      attachServerEventHandlers(serverProcess);
    }
  }

  if (disableGPU) {
    log.info('Disabling GPU hardware acceleration.');
    app.disableHardwareAcceleration();
  }

  app.on('ready', createWindow);
  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.once('window-all-closed', app.quit);

  app.once('before-quit', () => {
    i18n.off('languageChanged');
    if (mainWindow) {
      mainWindow.removeAllListeners('close');
    }
  });
}

app.on('quit', quitServerProcess);

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

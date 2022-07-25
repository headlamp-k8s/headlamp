import { ChildProcessWithoutNullStreams, execSync, spawn } from 'child_process';
import dotenv from 'dotenv';
import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem, screen, shell } from 'electron';
import { IpcMainEvent, MenuItemConstructorOptions } from 'electron/main';
import log from 'electron-log';
import find_process from 'find-process';
import fs from 'fs';
import { i18n as I18n } from 'i18next';
import open from 'open';
import path from 'path';
import url from 'url';
import yargs from 'yargs';
import i18n from './i18next.config';
import windowSize from './windowSize';

dotenv.config({ path: path.join(process.resourcesPath, '.env') });

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
const shouldCheckForUpdates = process.env.HEADLAMP_CHECK_FOR_UPDATES !== 'false';

function startServer(flags: string[] = []): ChildProcessWithoutNullStreams {
  const serverFilePath = isDev
    ? path.resolve('../backend/headlamp-server')
    : path.join(process.resourcesPath, './headlamp-server');

  let serverArgs = [];
  if (!!args.kubeconfig) {
    serverArgs = serverArgs.concat(['--kubeconfig', args.kubeconfig]);
  }

  const bundledPlugins = path.join(process.resourcesPath, '.plugins');

  function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
  }

  if (fs.existsSync(bundledPlugins) && !isEmpty(bundledPlugins)) {
    serverArgs = serverArgs.concat(['-plugins-dir', bundledPlugins]);
  }

  serverArgs = serverArgs.concat(flags);
  console.log('arguments passed to backend server', serverArgs);

  // We run detached but not in shell, otherwise it's hard to make sure the
  // server process gets killed. When changing these options, please make sure
  // to test quitting the app in the different platforms and making sure the
  // server process has been correctly quit.
  const options = { detached: true };

  return spawn(serverFilePath, serverArgs, options);
}

/**
 * Are we running inside WSL?
 * @returns true if we are running inside WSL.
 */
function isWSL(): boolean {
  try {
    const data = fs.readFileSync('/proc/version', { encoding: 'utf8', flag: 'r' });
    return data.indexOf('icrosoft') !== -1;
  } catch {
    return false;
  }
}

let serverProcess: ChildProcessWithoutNullStreams | null;
let intentionalQuit: boolean;
let serverProcessQuit: boolean;

function quitServerProcess() {
  if ((!serverProcess || serverProcessQuit) && process.platform !== 'win32') {
    log.error('server process already not running');
    return;
  }

  intentionalQuit = true;
  log.info('stopping server process...');

  if (!serverProcess) {
    return;
  }

  serverProcess.stdin.destroy();
  // @todo: should we try and end the process a bit more gracefully?
  //       What happens if the kill signal doesn't kill it?
  serverProcess.kill();

  serverProcess = null;
}

function getDefaultAppMenu(i18n: I18n): AppMenu[] {
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

  const appMenu = [
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
          url: 'https://kinvolk.io/docs/headlamp/latest',
        },
        {
          label: i18n.t('Open an Issue'),
          url: 'https://github.com/kinvolk/headlamp/issues',
        },
        {
          label: i18n.t('About'),
          url: 'https://github.com/kinvolk/headlamp',
        },
      ],
    },
  ] as AppMenu[];

  return appMenu;
}

function setMenu(i18n: I18n) {
  const appMenu = getDefaultAppMenu(i18n);
  const menu = Menu.buildFromTemplate(
    menusToTemplate(null, appMenu) as (MenuItemConstructorOptions | MenuItem)[]
  );
  Menu.setApplicationMenu(menu);
}

export interface AppMenu extends Omit<Partial<MenuItemConstructorOptions>, 'click'> {
  /** A URL to open (if not starting with http, then it'll be opened in the external browser) */
  url?: string;
}

function menusToTemplate(mainWindow: BrowserWindow | null, menusFromPlugins: AppMenu[]) {
  return menusFromPlugins.map(appMenu => {
    const { url, ...otherProps } = appMenu;
    const menu: MenuItemConstructorOptions = otherProps;

    if (!!url) {
      menu.click = async () => {
        // Open external links in the external browser.
        if (!!mainWindow && !url.startsWith('http')) {
          mainWindow.webContents.loadURL(url);
        } else {
          await shell.openExternal(url);
        }
      };
    }

    // If the menu has a submenu, then recursively convert it.
    if (Array.isArray(otherProps.submenu)) {
      otherProps.submenu = menusToTemplate(mainWindow, otherProps.submenu);
    }

    return menu;
  });
}

async function getRunningHeadlampPIDs() {
  const processes = await find_process('name', 'headlamp-server.*');
  if (processes.length === 0) {
    return null;
  }

  return processes.map(pInfo => pInfo.pid);
}

function killProcess(pid: number) {
  if (process.platform === 'win32') {
    // Otherwise on Windows the process will stick around.
    execSync('taskkill /pid ' + pid + ' /T /F');
  } else {
    process.kill(pid, 'SIGHUP');
  }
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

  console.log('Check for updates: ', shouldCheckForUpdates);

  setMenu(i18n);

  async function createWindow() {
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

    // WSL has a problem with full size window placement, so make it smaller.
    const withMargin = isWSL();
    const { width, height } = windowSize(screen.getPrimaryDisplay().workAreaSize, withMargin);

    mainWindow = new BrowserWindow({
      width,
      height,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: `${__dirname}/preload.js`,
      },
    });

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
      mainWindow?.webContents.send('currentMenu', getDefaultAppMenu(i18n));
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    // Force Single Instance Application
    const gotTheLock = app.requestSingleInstanceLock();
    if (gotTheLock) {
      app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.focus();
        }
      });
    } else {
      app.quit();
      return;
    }

    /*
    if a library is trying to open a url other than app url in electron take it 
    to the default browser
    */
    mainWindow.webContents.on('will-navigate', (event, url) => {
      if (url.startsWith(startUrl)) {
        return;
      }
      shell.openExternal(url);
    });

    app.on('open-url', (event, url) => {
      mainWindow?.focus();
      let urlObj;
      try {
        urlObj = new URL(url);
      } catch (e) {
        dialog.showErrorBox(
          i18n.t('Invalid URL'),
          i18n.t('Application opened with an invalid URL: {{ url }}', { url })
        );
        return;
      }

      const urlParam = urlObj.hostname;
      let baseUrl = startUrl;
      // this check helps us to avoid adding multiple / to the startUrl when appending the incoming url to it
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, startUrl.length - 1);
      }
      // load the index.html from build and route to the hostname received in the protocol handler url
      mainWindow?.loadURL(baseUrl + '#' + urlParam + urlObj.search);
    });

    i18n.on('languageChanged', () => {
      setMenu(i18n);
    });

    ipcMain.on('appConfig', () => {
      mainWindow?.webContents.send('appConfig', {
        checkForUpdates: shouldCheckForUpdates,
        appVersion,
      });
    });

    ipcMain.on('setMenu', (event: IpcMainEvent, menus: any) => {
      if (!mainWindow) {
        return;
      }

      // We don't even process this call if we're running in headless mode.
      if (isHeadlessMode) {
        console.log('Ignoring menu change from plugins because of headless mode.');
        return;
      }

      // Ignore the menu change if we received null.
      if (!menus) {
        console.log('Ignoring menu change from plugins because null was sent.');
        return;
      }

      const template = menusToTemplate(mainWindow!, menus);
      let newMenus: Menu;
      try {
        newMenus = Menu.buildFromTemplate(template);
      } catch (e) {
        console.error(`Failed to build menus from template ${menus}:`, e);
        return;
      }

      Menu.setApplicationMenu(newMenus);
    });

    ipcMain.on('locale', (event: IpcMainEvent, newLocale: string) => {
      if (!!newLocale && i18n.language !== newLocale) {
        i18n.changeLanguage(newLocale);
      }
    });

    if (!useExternalServer) {
      const runningHeadlamp = await getRunningHeadlampPIDs();
      let shouldWaitForKill = true;

      if (!!runningHeadlamp) {
        const resp = dialog.showMessageBoxSync(mainWindow, {
          // Avoiding mentioning Headlamp here because it may run under a different name depending on branding (plugins).
          title: i18n.t('Another process is running'),
          message: i18n.t(
            'Looks like another process is already running. Continue by terminating that process automatically, or quit?'
          ),
          type: 'question',
          buttons: [i18n.t('Continue'), i18n.t('Quit')],
        });

        if (resp === 0) {
          runningHeadlamp.forEach(pid => {
            try {
              killProcess(pid);
            } catch (e) {
              console.log(`Failed to quit headlamp-servere:`, e.message);
              shouldWaitForKill = false;
            }
          });
        } else {
          mainWindow.close();
          return;
        }
      }

      // If we reach here, then we attempted to kill headlamp-server. Let's make sure it's killed
      // before starting our own, or else we may end up in a race condition (failing to start the
      // new one before the existing one is fully killed).
      if (!!runningHeadlamp && shouldWaitForKill) {
        let stillRunning = true;
        let timeWaited = 0;
        const maxWaitTime = 3000; // ms
        // @todo: Use an iterative back-off strategy for the wait (so we can start by waiting for shorter times).
        for (let tries = 1; timeWaited < maxWaitTime && stillRunning; tries++) {
          console.debug(
            `Checking if Headlamp is still running after we asked it to be killed; ${tries} ${timeWaited}/${maxWaitTime}ms wait.`
          );

          // Wait (10 * powers of 2) ms with a max of 250 ms
          const waitTime = Math.min(10 * tries ** 2, 250); // ms
          await new Promise(f => setTimeout(f, waitTime));

          timeWaited += waitTime;

          stillRunning = !!(await getRunningHeadlampPIDs());
          console.debug(stillRunning ? 'Still running...' : 'No longer running!');
        }
      }

      // If we couldn't kill the process, warn the user and quit.
      const processes = await getRunningHeadlampPIDs();
      if (!!processes) {
        dialog.showMessageBoxSync({
          type: 'warning',
          title: i18n.t('Failed to quit the other running process'),
          message: i18n.t(
            `Could not quit the other running process, PIDs: {{ process_list }}. Please stop that process and relaunch the app.`,
            { process_list: processes }
          ),
        });

        mainWindow.close();
        return;
      }

      serverProcess = startServer();
      attachServerEventHandlers(serverProcess);
    }

    // Finally load the frontend
    mainWindow.loadURL(startUrl);
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

import { test } from '@playwright/test';
import { _electron } from '@playwright/test';
import { headlampAppPage } from './demo-test';

const electron = _electron;
let electronApp;

test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    cwd: '/home/vtaylor/headlamp/app/electron',
    timeout: 0,
    args: ['main.js'],
  });
});

test('launch app / check homepage', async () => {
  // Launch Electron app.

  // note: may use .context() instead of .firstWindow()?
  // const context = await electronApp.context();

  // note: firstWindow returns a page object so we can replace the window object
  const page = await electronApp.firstWindow();
  const headlampPage = new headlampAppPage(page);

  await headlampPage.navHomepage();

  electronApp.close();
  // electronApp.on('window', async () => {
  //   await headlampPage.homepage();
  // });
});

test('launch app / check notifications', async () => {
  // Launch Electron app.
  // const electronApp = await electron.launch({
  //     cwd: '/home/vtaylor/headlamp/app/electron',
  //     timeout: 0,
  //     args: ['main.js'],
  // });

  const page = await electronApp.firstWindow();
  const headlampPage = new headlampAppPage(page);

  await headlampPage.navNotifactions();

  electronApp.close();
  // electronApp.on('window', async () => {
  //   await headlampPage.notifications();
  // });
});

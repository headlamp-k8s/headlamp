import { test } from '@playwright/test';
import path from 'path';
import { _electron, ElectronApplication, Page } from 'playwright';
import { headlampAppPage } from './demo-test';

const electron = _electron;
const appPath = path.resolve(__dirname, '../../../electron');
let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  // Launch Electron app.
  electronApp = await electron.launch({
    cwd: appPath,
    timeout: 0,
    args: ['main.js'],
  });

  // Get the first window.
  page = await electronApp.firstWindow();
});

test.afterAll(async () => {
  // Close the Electron app.
  await electronApp.close();
});

test('launch app / check homepage', async () => {
  const headlampPage = new headlampAppPage(page);
  await headlampPage.navHomepage();
});

test('launch app / check notifications', async () => {
  const headlampPage = new headlampAppPage(page);
  await headlampPage.navNotifactions();
});

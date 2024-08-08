import { test } from '@playwright/test';
import path from 'path';
import { _electron, Page } from 'playwright';
import { HeadlampAppPage } from './demo-test';

const electron = _electron;
const appPath = path.resolve(__dirname, '../../../');
let electronApp;
let page: Page;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    cwd: appPath,
    executablePath: './node_modules/.bin/electron',
    args: ['.'],
    env: {
      ...process.env,
      NODE_ENV: 'development',
      ELECTRON_DEV: 'true',
    },
  });

  page = await electronApp.firstWindow();
});

// test.afterAll(async () => {
//   // Close the Electron app.
//   await electronApp.close();
// });

//   // Start the frontend server
//   // await runCommand('npm', ['dev-only-app-cluster'], { cwd: scriptPath });

//   // Launch Electron app
//   const electronApp = await electron.launch({
//     cwd: appPath,
//     args: ['main.js'],
//   });

//   // Get the first window that the app opens, wait if necessary.
//   const window = await electronApp.firstWindow();
//   await window.waitForLoadState('domcontentloaded');

//   // Navigate to the start URL and click on a button
//   await window.goto('http://127.0.0.1:65098');
//   await window.getByRole('button', { name: 'Home' }).click();

//   // Direct Electron console to Node terminal.
//   window.on('console', console.log);

//   // Close the Electron app
//   await electronApp.close();
// });

// test('launch app / authenticate', async () => {
//   const headlampPage = new HeadlampAppPage(page);
//   await headlampPage.authenticate();
// });

test('launch app / check homepage', async () => {
  const headlampPage = new HeadlampAppPage(page);
  await headlampPage.navHomepage();
});

test('launch app / check namespaces', async () => {
  const headlampPage = new HeadlampAppPage(page);
  await headlampPage.navigateToNamespaces();
  await headlampPage.createNamespace('test-namespace');
  await headlampPage.deleteNamespace('test-namespace');
});

// test('launch app / check namespaces', async () => {
//   const headlampPage = new HeadlampAppPage(page);
//   await headlampPage.navigateToNamespaces();
// });

// test('launch app / create namespaces', async () => {
//   const headlampPage = new HeadlampAppPage(page);
//   await headlampPage.navigateToNamespaces();
//   await headlampPage.createNamespace('test-namespace');
// });

// test('launch app / delete namespaces', async () => {
//   const headlampPage = new HeadlampAppPage(page);
//   await headlampPage.navigateToNamespaces();
//   await headlampPage.deleteNamespace('test-namespace');
// });

test('launch app / check notifications', async () => {
  const headlampPage = new HeadlampAppPage(page);
  await headlampPage.navNotifactions();
});

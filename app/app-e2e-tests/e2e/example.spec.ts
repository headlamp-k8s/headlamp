import { expect, test } from '@playwright/test';

const { _electron: electron } = require('playwright');

// const app = await electron.launch({ args: ['main.js'] });

// app.process().stdout.on('data', (data) => console.log(`stdout: ${data}`));
// app.process().stderr.on('data', (error) => console.log`stderr: ${error}`));

// const electronApp = await electron.launch({ cwd: '/home/vtaylor/headlamp/app/electron', timeout: 0, args: ['main.js'] });
// electronApp.process().stdout.on('data', (data) => console.log(`stdout: ${data}`));
// electronApp.process().stderr.on('data', (error) => console.log(`stderr: ${error}`));

// test('launch app', async () => {
//   const electronApp = await _electron.launch({ cwd: '/home/vtaylor/headlamp/app/electron', args: ['main.js'] })
//   // close app
//   await electronApp.close()
// })

test('launch app', async () => {
  // const headlampPage = new HeadlampPage(page);
  // Launch Electron app.
  const electronApp = await electron.launch({
    cwd: '/home/vtaylor/headlamp/app/electron',
    timeout: 0,
    args: ['main.js'],
  });
  electronApp.process().stdout.on('data', data => console.log(`stdoutX: ${data}`));
  electronApp.process().stderr.on('data', error => console.log(`stderrX: ${error}`));
  // Evaluation expression in the Electron context.
  // const appPath = await electronApp.evaluate(async (electron) => {
  //   // This runs in the main Electron process, |electron| parameter
  //   // here is always the result of the require('electron') in the main
  //   // app script.
  //   // return electron.getAppPath();
  // });

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();
  // await window.goto('https://playwright.dev/');
  await window.waitForLoadState('domcontentloaded');

  // await window.goto('https://playwright.dev/');
  // await window.getByRole('link', { name: 'Get started' }).click();

  await window.goto('http://localhost:3000/');
  await window.getByRole('button', { name: 'Home' }).click();

  // await electronApp.browserWindow(page);
  // Print the title.
  // console.log(await window.title());
  // Capture a screenshot.
  // await window.screenshot({ path: 'intro.png' });

  // await headlampPage.authenticate();
  // await headlampPage.hasNetworkTab();
  // Direct Electron console to Node terminal.
  window.on('console', console.log);
  // Click button.
  // await window.click('text=Click me');
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

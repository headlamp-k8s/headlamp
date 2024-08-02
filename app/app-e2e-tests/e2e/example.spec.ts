import { expect, Page, test } from '@playwright/test';
import { _electron } from '@playwright/test';
import { spawn } from 'child_process';

const electron = _electron;
// const { _electron: electron } = require('playwright');

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

// Function to run a shell command and return a promise
async function runCommand(command: string, args: string[] = [], options = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { ...options, detached: true, stdio: 'ignore' });

    process.on('error', error => {
      console.error(`Error executing command: ${command}\n${error}`);
      reject(error);
    });

    process.on('close', code => {
      if (code !== 0) {
        console.error(`Command failed with exit code ${code}`);
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    // Detach the process and resolve immediately
    process.unref();
    resolve();
  });
}

test('launch app', async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({
    cwd: '/home/vtaylor/headlamp/app/electron',
    timeout: 0,
    args: ['main.js'],
  });
  // electronApp.process().stdout.on('data', data => console.log(`stdoutX: ${data}`));
  // electronApp.process().stderr.on('data', error => console.log(`stderrX: ${error}`));
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

class HeadlampPage {
  constructor(private page: Page) {}

  async homepage() {
    await this.page.goto('http://localhost:3000/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('button');
    await this.page.click('button');
  }
}

test('launch app w/page', async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({
    cwd: '/home/vtaylor/headlamp/app/electron',
    timeout: 0,
    args: ['main.js'],
  });

  // const context = await electronApp.context();
  const page = await electronApp.firstWindow();
  const headlampPage = new HeadlampPage(page);

  electronApp.on('window', async () => {
    await headlampPage.homepage();
  });
});

test('launch app with integrated shell commands', async () => {
  // Start the frontend server
  await runCommand('npm', ['start'], { cwd: '/home/vtaylor/headlamp/frontend' });
  await runCommand('make', ['run-backend'], { cwd: '/home/vtaylor/headlamp' });

  // Launch Electron app
  const electronApp = await electron.launch({
    cwd: '/home/vtaylor/headlamp/app/electron',
    args: ['main.js'],
  });
  // electronApp.process().stdout.on('data', data => console.log(`stdoutX: ${data}`));
  // electronApp.process().stderr.on('data', error => console.log(`stderrX: ${error}`));

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  // Navigate to the start URL and click on a button
  await window.goto('http://localhost:3000/');
  await window.getByRole('button', { name: 'Home' }).click();

  // Ensure that we are in the home context
  const title = await window.title();
  expect(title).not.toBe(null);
  expect(title).toBe('Choose a cluster');

  // Direct Electron console to Node terminal.
  window.on('console', console.log);

  // Close the Electron app
  await electronApp.close();
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

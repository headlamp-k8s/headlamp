import { test } from '@playwright/test';
import path from 'path';
import { _electron, Page } from 'playwright';
import { HeadlampPage } from './headlampPage';
import { NamespacesPage } from './namespacesPage';

const electronExecutable = process.platform === 'win32' ? 'electron.cmd' : 'electron';
const electronPath = path.resolve(__dirname, `../../app/node_modules/.bin/${electronExecutable}`);

const electron = _electron;
const appPath = path.resolve(__dirname, '../../app');
let electronApp;
let electronPage: Page;

if (process.env.PLAYWRIGHT_TEST_MODE === 'app') {
  console.log('app path');
  console.log(appPath);

  console.log('other path');
  console.log(electronPath);

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      cwd: appPath,
      executablePath: electronPath,
      args: ['.'],
      env: {
        ...process.env,
        NODE_ENV: 'development',
        ELECTRON_DEV: 'true',
      },
    });

    electronPage = await electronApp.firstWindow();
  });

  test.beforeEach(async ({ page }) => {
    if (process.env.PLAYWRIGHT_TEST_MODE === 'app') {
      page.close();
    }
  });
}

test('create a namespace with the minimal editor then delete it', async ({ page: browserPage }) => {
  const page = process.env.PLAYWRIGHT_TEST_MODE === 'app' ? electronPage : browserPage;
  const name = 'testing-e2e';
  const headlampPage = new HeadlampPage(page);
  // If we are running in cluster, we need to authenticate
  if (process.env.PLAYWRIGHT_TEST_MODE === 'incluster') {
    await headlampPage.authenticate();
    // If there's no namespaces permission, then we return
    const content = await page.content();
    if (!content.includes('Namespaces') || !content.includes('href="/c/main/namespaces')) {
      return;
    }
  }
  await headlampPage.startFromMainPage();
  const namespacesPage = new NamespacesPage(page);
  await namespacesPage.navigateToNamespaces();
  await namespacesPage.createNamespace(name);
  await namespacesPage.deleteNamespace(name);
});

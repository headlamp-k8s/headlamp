import { expect, test } from '@playwright/test';
import path from 'path';
import { _electron, Page } from 'playwright';
import { HeadlampPage } from './headlampPage';

// Electron setup
const electronExecutable = process.platform === 'win32' ? 'electron.cmd' : 'electron';
const electronPath = path.resolve(__dirname, `../../node_modules/.bin/${electronExecutable}`);
const appPath = path.resolve(__dirname, '../../');
let electronApp;
let electronPage: Page;

// Test configuration
const TEST_CONFIG = {
  originalName: 'minikube',
  newName: 'test-cluster',
  invalidName: 'Invalid Cluster!',
};

// Helper functions
async function navigateToSettings(page: Page) {
  await page.waitForLoadState('load');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.waitForLoadState('load');
}

async function verifyClusterName(page: Page, expectedName: string) {
  await navigateToSettings(page);
  await expect(page.locator('h2')).toContainText(`Cluster Settings (${expectedName})`);
}

async function renameCluster(
  page: Page,
  fromName: string,
  toName: string,
  confirm: boolean = true
) {
  await page.fill(`input[placeholder="${fromName}"]`, toName);
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: confirm ? 'Yes' : 'No' }).click();
}

// Setup
test.beforeAll(async () => {
  electronApp = await _electron.launch({
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
  page.close();
});

// Tests
test.describe('Cluster rename functionality', () => {
  test.beforeEach(() => {
    test.skip(process.env.PLAYWRIGHT_TEST_MODE !== 'app', 'These tests only run in app mode');
  });

  test('should rename cluster and verify changes', async ({ page: browserPage }) => {
    const page = process.env.PLAYWRIGHT_TEST_MODE === 'app' ? electronPage : browserPage;
    const headlampPage = new HeadlampPage(page);
    await headlampPage.authenticate();

    await navigateToSettings(page);
    await expect(page.locator('h2')).toContainText('Cluster Settings');

    // Test invalid inputs
    await page.fill('input[placeholder="minikube"]', TEST_CONFIG.invalidName);
    await expect(page.getByRole('button', { name: 'Apply' })).toBeDisabled();

    await page.fill('input[placeholder="minikube"]', '');
    await expect(page.getByRole('button', { name: 'Apply' })).toBeDisabled();

    // Test successful rename
    await renameCluster(page, TEST_CONFIG.originalName, TEST_CONFIG.newName);
    await verifyClusterName(page, TEST_CONFIG.newName);

    // Rename back to original
    await renameCluster(page, TEST_CONFIG.newName, TEST_CONFIG.originalName);
    await verifyClusterName(page, TEST_CONFIG.originalName);
  });

  test('should cancel rename operation', async ({ page: browserPage }) => {
    const page = process.env.PLAYWRIGHT_TEST_MODE === 'app' ? electronPage : browserPage;
    const headlampPage = new HeadlampPage(page);
    await headlampPage.authenticate();

    await navigateToSettings(page);
    await renameCluster(page, TEST_CONFIG.originalName, TEST_CONFIG.newName, false);
    await expect(page.getByText(`Cluster Settings (${TEST_CONFIG.originalName})`)).toBeVisible();
  });
});

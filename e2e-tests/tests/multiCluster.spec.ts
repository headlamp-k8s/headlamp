import { expect, test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';

test.describe('multi-cluster setup', () => {
  let headlampPage: HeadlampPage;
  const testToken = process.env.HEADLAMP_TEST_TOKEN;
  const test2Token = process.env.HEADLAMP_TEST2_TOKEN;

  test.beforeEach(async ({ page }) => {
    headlampPage = new HeadlampPage(page);

    await headlampPage.navigateTopage('/', /Choose a cluster/);
    await expect(page.locator('h1:has-text("Home")')).toBeVisible();
    await expect(page.locator('h2:has-text("All Clusters")')).toBeVisible();
  });

  test("home page should display two cluster selection buttons labeled 'test' and 'test2'", async ({
    page,
  }) => {
    const buttons = page.locator('button p');
    await expect(buttons).toHaveCount(2);
    await expect(page.locator('button p', { hasText: /^test$/ })).toBeVisible();
    await expect(page.locator('button p', { hasText: /^test2$/ })).toBeVisible();
  });

  test('home page should display a table containing exactly two rows, each representing a cluster entry', async ({
    page,
  }) => {
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).toHaveCount(2);
  });

  test("table should contain 'Name' and 'Status' column headers", async ({ page }) => {
    await expect(page.locator('th', { hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Status' })).toBeVisible();
  });

  test("table should list 'test' cluster and 'test2' cluster with an 'Active' status and valid links", async ({
    page,
  }) => {
    for (const clusterName of ['test', 'test2']) {
      const clusterAnchor = page.locator('table tbody tr td a', {
        hasText: new RegExp(`^${clusterName}$`),
      });
      await expect(clusterAnchor).toBeVisible();
      await expect(clusterAnchor).toHaveAttribute('href', `/c/${clusterName}/`);

      const clusterRow = clusterAnchor.locator('../../..');

      const clusterStatus = clusterRow.locator('td').nth(2).locator('p');
      await expect(clusterStatus).toHaveText('Active');
    }
  });

  test("user should be able to login to 'test' cluster, perform logout and return to cluster selection", async ({
    page,
  }) => {
    const testClusterAnchor = page.locator('table tbody tr td a', {
      hasText: /^test$/,
    });
    await expect(testClusterAnchor).toBeVisible();
    await expect(testClusterAnchor).toHaveAttribute('href', '/c/test/');

    await Promise.all([page.waitForNavigation(), testClusterAnchor.click()]);

    await headlampPage.authenticate(testToken);
    await headlampPage.pageLocatorContent(
      'button:has-text("Our Cluster Chooser button. Cluster: test")',
      'Our Cluster Chooser button. Cluster: test'
    );
    await headlampPage.logout();

    await page.waitForLoadState('load');
    await headlampPage.hasTitleContaining(/Choose a cluster/);
  });

  test("user should be able to login to 'test2' cluster, perform logout and return to cluster selection", async ({
    page,
  }) => {
    const test2ClusterAnchor = page.locator('table tbody tr td a', {
      hasText: /^test2$/,
    });
    await expect(test2ClusterAnchor).toBeVisible();
    await expect(test2ClusterAnchor).toHaveAttribute('href', '/c/test2/');

    await Promise.all([page.waitForNavigation(), test2ClusterAnchor.click()]);

    await headlampPage.authenticate(test2Token);
    await headlampPage.pageLocatorContent(
      'button:has-text("Our Cluster Chooser button. Cluster: test2")',
      'Our Cluster Chooser button. Cluster: test2'
    );
    await headlampPage.logout();

    await page.waitForLoadState('load');
    await headlampPage.hasTitleContaining(/Choose a cluster/);
  });

  test('react-hotkey to open cluster chooser', async ({ page }) => {
    const testClusterAnchor = page.locator('table tbody tr td a', {
      hasText: /^test$/,
    });
    await expect(testClusterAnchor).toBeVisible();
    await expect(testClusterAnchor).toHaveAttribute('href', '/c/test/');

    await Promise.all([page.waitForNavigation(), testClusterAnchor.click()]);

    await headlampPage.authenticate(testToken);
    await headlampPage.pageLocatorContent(
      'button:has-text("Our Cluster Chooser button. Cluster: test")',
      'Our Cluster Chooser button. Cluster: test'
    );

    await page.keyboard.press('Control+Shift+L');

    const chooseClusterLabel = page.getByLabel(/^Choose cluster$/);
    await expect(chooseClusterLabel).toBeVisible();

    const clusterNameInput = page.getByPlaceholder(/^Name$/);
    await expect(clusterNameInput).toBeVisible();
    await expect(clusterNameInput).toHaveValue(/^$/);
    await expect(clusterNameInput).toBeFocused();
  });
});

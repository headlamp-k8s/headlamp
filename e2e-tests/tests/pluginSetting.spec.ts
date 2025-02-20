import { test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';

let headlampPage: HeadlampPage;

test.beforeEach(async ({ page }) => {
  headlampPage = new HeadlampPage(page);

  await headlampPage.navigateToCluster('test', process.env.HEADLAMP_TEST_TOKEN);
});

test('plugin settings page should have a title', async () => {
  await headlampPage.navigateTopage('/settings/plugins', /Plugins/);
});

test('plugin settings page should have a table', async () => {
  const expectedHeaders = ['Name', 'Description', 'Origin', 'Status'];
  // note: Enable column is only there in app mode.

  await headlampPage.navigateTopage('/settings/plugins', /Plugins/);
  await headlampPage.tableHasHeaders('table', expectedHeaders);
});

test('pod counter plugin should have setting option', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const pluginName = 'headlamp-pod-counter';

  await headlampPage.navigateTopage('/settings/plugins', /Plugin/);
  await headlampPage.clickOnPlugin(pluginName);
  await headlampPage.checkPluginTitle(pluginName);
  await headlampPage.checkPageContent('Custom Error Message');
});

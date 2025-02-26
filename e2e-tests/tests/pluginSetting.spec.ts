import { test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';

test('plugin settings page should have a title', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.navigateTopage('/settings/plugins', /Plugins/);
});

test('plugin settings page should have a table', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const expectedHeaders = ['Name', 'Description', 'Origin', 'Status'];
  // note: Enable column is only there in app mode.

  await headlampPage.authenticate();
  await headlampPage.navigateTopage('/settings/plugins', /Plugins/);
  await headlampPage.tableHasHeaders('table', expectedHeaders);
});

// NOTE:
// - this test checks to see if the plugin details view has sub options
// - this test assumes that there is an installed headlamp-pod-counter plugin already within the builder, fails on local without plugin
// - when testing plugin names use the name that the plugin is displayed in the UI and not the package name, i.e. headlamp-pod-counter and not @kinvolk/headlamp-pod-counter
test('pod counter plugin should have setting option', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const pluginName = 'headlamp-pod-counter';

  await headlampPage.authenticate();
  await headlampPage.navigateTopage('/settings/plugins', /Plugin/);
  await headlampPage.clickOnPlugin(pluginName);
  await headlampPage.checkPluginTitle(pluginName);
  await headlampPage.checkPageContent('Custom Error Message');
});

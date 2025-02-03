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

// to do: fix this or remove this test all together to make compatiable with new plugin name print format (not including @kinvolk in name)
//  and the new format for storing plugin information in local storage
// - this test assumes that there is an installed headlamp-pod-counter plugin already within the builder, fails on local without plugin

// test('pod counter plugin should have setting option', async ({ page }) => {
//   const headlampPage = new HeadlampPage(page);
//   const pluginName = '@kinvolk/headlamp-pod-counter';

//   await headlampPage.authenticate();
//   await headlampPage.navigateTopage('/settings/plugins', /Plugin/);
//   await headlampPage.clickOnPlugin(pluginName);
//   await headlampPage.hasTitleContaining(/Plugin Details/);
//   await headlampPage.checkPageContent('Custom Error Message');
// });

import { test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';
import { NamespacesPage } from './namespacesPage';

test('create a namespace with the minimal editor then delete it', async ({ page }) => {
  const name = 'testing-e2e';
  const headlampPage = new HeadlampPage(page);
  await headlampPage.navigateToCluster('test', process.env.HEADLAMP_TEST_TOKEN);

  // If there's no namespaces permission, then we return
  const content = await page.content();
  if (!content.includes('Namespaces') || !content.includes('href="/c/test/namespaces')) {
    return;
  }

  const namespacesPage = new NamespacesPage(page);
  await namespacesPage.navigateToNamespaces();
  await namespacesPage.createNamespace(name);
  await namespacesPage.deleteNamespace(name);
});

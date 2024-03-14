import { test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';
import { NamespacesPage } from './namespacesPage';

test('create a namespace with the minimal editor then delete it', async ({ page }) => {
  const name = 'testing-e2e';
  const headlampPage = new HeadlampPage(page);
  await headlampPage.authenticate();

  // If there's no namespaces permission, then we return
  const content = await page.content();
  if (!content.includes('Namespaces') || !content.includes('href="/c/main/namespaces')) {
    return;
  }

  const namespacesPage = new NamespacesPage(page);
  await namespacesPage.navigateToNamespaces();
  await namespacesPage.createNamespace(name);
  await namespacesPage.deleteNamespace(name);
});

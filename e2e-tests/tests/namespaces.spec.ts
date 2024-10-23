import AxeBuilder from '@axe-core/playwright';
import { test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';
import { NamespacesPage } from './namespacesPage';

test.describe('create a namespace with the minimal editor', async () => {
  test.setTimeout(0);
  test('create a namespace with the minimal editor then delete it', async ({ page }) => {
    const name = 'testing-e2e';
    const headlampPage = new HeadlampPage(page);
    const namespacesPage = new NamespacesPage(page);

    await headlampPage.authenticate();

    // await headlampPage.navigateTopage('/c/main/namespaces',/Namespaces/);
    await namespacesPage.navigateToNamespaces();
    await namespacesPage.createNamespace(name);
    await namespacesPage.deleteNamespace(name);
  });
});

test('a11y namespace page', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  await headlampPage.authenticate();

  const namespacesPage = new NamespacesPage(page);
  await namespacesPage.navigateToNamespaces();

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  console.log(accessibilityScanResults.violations);
});

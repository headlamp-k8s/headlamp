import AxeBuilder from '@axe-core/playwright'; // 1
import {test } from '@playwright/test';
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

test.describe('namespace dashboard', () => {
  // 2
  test.setTimeout(0);
  test('create a namespace with the minimal editor then delete it', async ({ page }) => {
    const headlampPage = new HeadlampPage(page);
    // const namespacesPage = new NamespacesPage(page);

    await headlampPage.authenticate();

    const namespacesPage = new NamespacesPage(page);
    await namespacesPage.navigateToNamespaces();

    // await namespacesPage.navigateToNamespaces();
    // await headlampPage.navigateTopage('/c/minikube/namespaces');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    console.log('accessibilityScanResults: ', accessibilityScanResults); // 5

    // expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});

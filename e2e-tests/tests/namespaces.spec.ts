import { test } from '@playwright/test';
import { HeadlampPage } from './headlampPage';
import { NamespacesPage } from './namespacesPage';

test('create a namespace with the minimal editor then delete it', async ({ page }) => {
  const name = 'testing-e2e';
  const headlampPage = new HeadlampPage(page);
  // If we are running in cluster, we need to authenticate
  // if (process.env.PLAYWRIGHT_TEST_MODE === 'incluster') {
  //   await headlampPage.authenticate();
  //   // If there's no namespaces permission, then we return
  //   const content = await page.content();
  //   if (!content.includes('Namespaces') || !content.includes('href="/c/main/namespaces')) {
  //     return;
  //   }
  // }

  await headlampPage.authenticate();

  await headlampPage.startFromMainPage();

  const namespacesPage = new NamespacesPage(page);

  await namespacesPage.navigateToNamespaces();

  // If there's no namespaces permission, then we return
  const content = await page.content();
  if (!content.includes('Namespaces') || !content.includes('href="/c/main/namespaces')) {
    return;
  }

  await namespacesPage.createNamespace(name);

  await namespacesPage.deleteNamespace(name);
});

// to do: add test for 'create a namespace with the create namespace button then delete it'

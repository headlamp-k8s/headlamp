import { test, expect } from '@playwright/test';

test('headlamp is there and so is minikube', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Cluster/);

  // // Expects the URL to contain minikube.
  await expect(page).toHaveURL(/.*minikube/);
});

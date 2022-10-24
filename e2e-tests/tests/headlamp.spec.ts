import { test, expect } from "@playwright/test";

function clusterName() {
  return process.env.HEADLAMP_E2E_CLUSTER_NAME || 'minikube';
}

// async function handleAuth({ page }) {
//   // await page.goto('/');

//   const token = process.env.HEADLAMP_E2E_TOKEN || '';
//   if (token) {
//     // Expect a title "to contain" a substring.
//     await expect(page).toHaveTitle(/Token/);
//     await expect(page).toHaveURL(/.*token/);

//     expect(token).not.toBe('');
//     await page.locator('#token').fill(token);
//     await page.locator('#token').press('Enter');
//   } else {
//     throw "nooooo";
//   }

//   // await expect(page).toHaveURL(new RegExp(`.*${clusterName()}`));
// };

// test("root URL redirects to one with cluster view", async ({ page }) => {
//   await page.goto(`/c/${clusterName()}`);
//   await handleAuth({ page });
//   // await expect(page).toHaveURL(new RegExp(`/c/${clusterName()}`));
//   await expect(page).toHaveTitle(/Cluster/);
// });

async function handleAuth({ page }) {
  const token = process.env.HEADLAMP_E2E_TOKEN || '';
  if (token) {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Token/);

    // Expects the URL to contain c/main/token
    await expect(page).toHaveURL(/.*token/);

    await page.locator("#token").fill(token);
    await page.locator("#token").press("Enter");
  }
}

test("headlamp is there and so is minikube", async ({ page }) => {
  await page.goto("/");
  await handleAuth({ page });
  await expect(page).toHaveURL(new RegExp(`.*${clusterName()}`));

  await page.goto(`/c/${clusterName()}/namespaces`);
  await handleAuth({ page });
  // await expect(page).toHaveTitle(/Namespaces/);
  await expect(page).toHaveURL(/.*namespaces/);
});

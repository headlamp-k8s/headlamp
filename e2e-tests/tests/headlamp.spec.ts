import { test, expect } from "@playwright/test";

test("headlamp is there and so is minikube", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Token/);

  // Expects the URL to contain c/main/token
  await expect(page).toHaveURL(/.*token/);

  const token = process.env.HEADLAMP_TOKEN || '';
  expect(token).not.toBe('');
  await page.locator("#token").fill(token);
  await page.locator("#token").press("Enter");

  await expect(page).toHaveURL(/.*main/);
});

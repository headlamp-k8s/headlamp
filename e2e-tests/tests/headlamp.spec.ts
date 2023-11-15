import { test, expect } from "@playwright/test";
import helpers from "./helpers.spec";

test("headlamp is there and so is minikube", async ({ page }) => {
  await helpers.authenticate(page);

  await expect(page).toHaveURL(/.*main/);
});

test('GET /plugins/list returns plugins list', async ({ page }) => {
  const response = await page.goto('/plugins');
  expect(response).toBeTruthy();

  const json = await response.json();

  expect(json.length).toBeGreaterThan(0);
  expect(json.some(str => str.includes('plugins/app-menus'))).toBeTruthy();
});

test('main page should have Network tab', async ({ page }) => {
  await helpers.authenticate(page);

  const networkTab = page.locator('span:has-text("Network")').first();
  expect(await networkTab.textContent()).toBe('Network');
});


test('service page should have headlamp service', async ({ page }) => {
  await helpers.authenticate(page);

  await helpers.servicesPage(page);

  const pageContent = await page.content();
  expect(pageContent).toContain('headlamp');
});

test('headlamp service page should contain port', async ({ page }) => {
  await helpers.authenticate(page);

  await helpers.servicesPage(page);

  // Click on the "headlamp" link
  await page.click('a:has-text("headlamp")');

  await page.waitForLoadState('load');

  await page.waitForSelector('h1:has-text("Service")');

  const pageContent = await page.content();
  expect(pageContent).toContain('TCP');
});

test('main page should have Security tab', async ({ page }) => {
  await helpers.authenticate(page);

  const networkTab = page.locator('span:has-text("Security")').first();
  expect(await networkTab.textContent()).toBe('Security');
});

test('Service account tab should have headlamp-admin', async ({ page }) => {
  await helpers.authenticate(page);

  await helpers.serviceAccountPage(page)

  // Check if there is text "headlamp-admin" on the page
  const pageContent = await page.content();
  expect(pageContent).toContain('headlamp-admin');
});

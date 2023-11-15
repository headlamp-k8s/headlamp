import { expect } from "@playwright/test";

const authenticate = async (page) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Token/);

  // Expects the URL to contain c/main/token
  await expect(page).toHaveURL(/.*token/);

  const token = process.env.HEADLAMP_TOKEN || '';
  expect(token).not.toBe('');

  // Fill in the token
  await page.locator("#token").fill(token);

  // Click on the "Authenticate" button
  await page.click('button:has-text("Authenticate")');
  await page.waitForNavigation();
};

const servicesPage = async (page) => {
  // Click on the "Network" button
  await page.click('span:has-text("Network")');

  // Wait for the page to load
  await page.waitForLoadState('load');

  // Wait for the Services tab to load
  await page.waitForSelector('span:has-text("Services")');

  // Click on the "Services" section
  await page.click('span:has-text("Services")');

  // Wait for the page to load
  await page.waitForLoadState('load');
};

const serviceAccountPage = async (page) => {
  // Click on the "Security" button
  await page.click('span:has-text("Security")');

  // Wait for the page to load
  await page.waitForLoadState('load');

  // Wait for the Service Accounts tab to load
  await page.waitForSelector('span:has-text("Service Accounts")');

  // Click on the "Service Accounts" section
  await page.click('span:has-text("Service Accounts")');

  // Wait for the page to load
  await page.waitForLoadState('load');
};


const exportFunctions = {
  authenticate,
  servicesPage,
  serviceAccountPage
};

export default exportFunctions;

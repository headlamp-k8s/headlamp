import { test, expect } from '@playwright/test';
import { HeadlampPage } from './headlampPage';
import { ServicesPage } from './servicesPage';
import { SecurityPage } from './securityPage';

// --- Plugins tests start --- //
test('GET /plugins/list returns plugins list', async ({ page }) => {
  const response: any = await page.goto('/plugins');
  expect(response).toBeTruthy();

  const json = await response.json();
  expect(json.length).toBeGreaterThan(0);
  expect(json.some(str => str.includes('plugins/app-menus'))).toBeTruthy();
});
// --- Plugin tests end --- //

// --- Headlamp tests start --- //
test('headlamp is there and so is minikube', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.hasURLContaining(/.*main/);
});

test('main page should have Network tab', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.hasNetworkTab();
});

test('service page should have headlamp service', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const servicesPage = new ServicesPage(page);

  await headlampPage.authenticate();
  await servicesPage.navigateToServices();
  await servicesPage.clickOnServicesSection();

  // Check if there is text "headlamp" on the page
  await headlampPage.checkPageContent('headlamp');
});

test('headlamp service page should contain port', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const servicesPage = new ServicesPage(page);

  await headlampPage.authenticate();
  await servicesPage.navigateToServices();
  await servicesPage.clickOnServicesSection();
  await servicesPage.goToParticularService("headlamp");

  // Check if there is text "TCP" on the page
  await headlampPage.checkPageContent('TCP');
});

test('main page should have Security tab', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.hasSecurityTab();
});

test('Service account tab should have headlamp-admin', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const securityPage = new SecurityPage(page);

  await headlampPage.authenticate();
  await securityPage.navigateToSecurity();
  await securityPage.clickOnServiceAccountsSection();

  // Check if there is text "headlamp-admin" on the page
  await headlampPage.checkPageContent('headlamp-admin');
});
// // --- Headlamp tests end --- //

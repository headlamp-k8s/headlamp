import { test, expect } from "@playwright/test";
import { HeadlampPage } from "./headlampPage";
import { ServicesPage } from "./servicesPage";
import { SecurityPage } from "./securityPage";

// --- Plugins tests start --- //
test("GET /plugins/list returns plugins list", async ({ page }) => {
  const response: any = await page.goto("/plugins");
  expect(response).toBeTruthy();

  const json = await response.json();
  expect(json.length).toBeGreaterThan(0);
  expect(json.some((str) => str.includes("plugins/"))).toBeTruthy();
});
// --- Plugin tests end --- //

// --- Headlamp tests start --- //
test("headlamp is there and so is minikube", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.hasURLContaining(/.*main/);
});

test("main page should have Network tab", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.hasNetworkTab();
});

test("service page should have headlamp service", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const servicesPage = new ServicesPage(page);

  await headlampPage.authenticate();
  await servicesPage.navigateToServices();
  await servicesPage.clickOnServicesSection();

  // Check if there is text "headlamp" on the page
  await headlampPage.checkPageContent("headlamp");
});

test("headlamp service page should contain port", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const servicesPage = new ServicesPage(page);

  await headlampPage.authenticate();
  await servicesPage.navigateToServices();
  await servicesPage.clickOnServicesSection();
  await servicesPage.goToParticularService("headlamp");

  // Check if there is text "TCP" on the page
  await headlampPage.checkPageContent("TCP");
});

test("main page should have Security tab", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.hasSecurityTab();
});

test("Service account tab should have headlamp-admin", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  const securityPage = new SecurityPage(page);

  await headlampPage.authenticate();
  await securityPage.navigateToSecurity();
  await securityPage.clickOnServiceAccountsSection();

  // Check if there is text "headlamp-admin" on the page
  await headlampPage.checkPageContent("headlamp-admin");
});

test("Logout the user", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.logout();
});

test("404 page is present", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await headlampPage.navigateTopage(
    "/404test",
    /Whoops! This page doesn't exist/
  );
});

test("pagination goes to next page", async ({ page }) => {
  const headlampPage = new HeadlampPage(page);
  await headlampPage.authenticate();

  await page.click('span:has-text("Security")');
  await page.waitForLoadState("load");
  await page.waitForSelector('span:has-text("Service Accounts")');

  await page.click('span:has-text("Roles")');
  await page.waitForSelector('span:has-text("Roles")');
  await page.waitForSelector('p:has-text("Rows per page")');

  const paginationCaption = page.locator("p:has-text(' of ')");
  const captionText = await paginationCaption.textContent();

  const nextPageButton = page.getByTitle("Next page");
  await nextPageButton.click();
  const captionText2 = await paginationCaption.textContent();

  expect(captionText).not.toBe(captionText2);
});

// --- Headlamp tests end --- //

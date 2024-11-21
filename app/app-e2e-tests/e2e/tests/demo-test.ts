import { expect, Page } from '@playwright/test';

export class HeadlampAppPage {
  constructor(private page: Page) {}

  // TESTS FOR NAVIGATION FOR FRONTEND ONLY
  async navHomepage() {
    // await this.page.goto(`${process.env.HEADLAMP_TEST_URL}`);
    // await this.page.goto(`${process.env.HEADLAMP_TEST_URL}`);
    await expect(this.page.getByRole('button', { name: 'Home' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Home' }).click();
  }

  async navNotifactions() {
    // await this.page.goto(`${process.env.HEADLAMP_TEST_URL}`);
    await expect(this.page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Notifications' }).click();
    await expect(this.page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  }

  // TEST FOR IN CLUSTER

  async authenticate() {
    // this may need to be the url from the -n headlamp command
    // - launch headlamp addon
    // - get the url
    // - paste the url into this page.goto
    // await this.page.goto(`${process.env.HEADLAMP_TEST_URL}`);
    await this.page.waitForSelector('h1:has-text("Authentication")');

    // Expects the URL to contain c/main/token
    this.hasURLContaining(/.*token/);

    const token = process.env.HEADLAMP_TOKEN || '';
    this.hasToken(token);

    // Fill in the token
    await this.page.locator('#token').fill(token);

    // Click on the "Authenticate" button and wait for navigation
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click('button:has-text("Authenticate")'),
    ]);
  }

  // DEMO CREATE DELETE
  async navigateToNamespaces() {
    await this.page.getByRole('link', { name: 'minikube' }).click();
    await this.page.waitForSelector('span:has-text("Namespaces")');
    await this.page.click('span:has-text("Namespaces")');
    await this.page.waitForLoadState('load');
  }

  async createNamespace(name) {
    const yaml = `
    apiVersion: v1
    kind: Namespace
    metadata:
      name: ${name}
    `;
    const page = this.page;

    await page.waitForSelector('span:has-text("Namespaces")');
    await page.click('span:has-text("Namespaces")');
    await page.waitForLoadState('load');

    // If the namespace already exists, return.
    // This makes it a bit more resilient to flakiness.
    const pageContent = await this.page.content();
    if (pageContent.includes(name)) {
      throw new Error(`Test failed: Namespace "${name}" already exists.`);
    }
    // await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();

    // THIS IS THE NAME INPUT CREATE BUTTON
    // await page.getByLabel('Create', { exact: true }).click();

    // THIS IS THE SIDE BUTTON CREATE
    await page.getByText('Create', { exact: true }).click();

    await page.waitForLoadState('load');
    // may not work, this is a work around for the input button as there is no linked attribute
    const checkedSpan = await page.$('span.Mui-checked');

    if (!checkedSpan) {
      await expect(page.getByText('Use minimal editor')).toBeVisible();

      await page.getByText('Use minimal editor').click();
    }

    await page.waitForLoadState('load');

    await page.waitForSelector('textarea[aria-label="yaml Code"]', { state: 'visible' });

    await expect(page.getByRole('textbox', { name: 'yaml Code' })).toBeVisible();
    await page.fill('textarea[aria-label="yaml Code"]', yaml);

    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
    await page.getByRole('button', { name: 'Apply' }).click();

    await page.waitForSelector(`a:has-text("${name}")`);
    await expect(page.locator(`a:has-text("${name}")`)).toBeVisible();
  }

  async deleteNamespace(name) {
    const page = this.page;
    await page.click('span:has-text("Namespaces")');
    await page.waitForLoadState('load');

    await page.waitForSelector(`text=${name}`);
    await page.click(`a:has-text("${name}")`);

    await page.waitForSelector('button[aria-label="Delete"]');
    await page.click('button[aria-label="Delete"]');

    await page.waitForLoadState('load');

    await page.waitForSelector('text=Are you sure you want to delete this item?');
    await page.waitForSelector('button:has-text("Yes")');

    await page.waitForLoadState('load');

    await page.click('button:has-text("Yes")');

    await page.waitForSelector('h1:has-text("Namespaces")');
    await page.waitForSelector('td:has-text("Terminating")');

    await expect(page.locator(`a:has-text("${name}")`)).toBeHidden();
  }

  async hasURLContaining(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  async hasTitleContaining(pattern: RegExp) {
    await expect(this.page).toHaveTitle(pattern);
  }

  async hasToken(token: string) {
    expect(token).not.toBe('');
  }
}

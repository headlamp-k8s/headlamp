import { expect, Page } from '@playwright/test';

export class NamespacesPage {
  constructor(private page: Page) {}

  async navigateToNamespaces() {
    await this.page.click('span:has-text("Cluster")');
    await this.page.waitForLoadState('load');
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
      return;
    }

    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
    await page.getByRole('button', { name: 'Create' }).click();

    await page.waitForLoadState('load');

    await expect(page.getByText('Use minimal editor')).toBeVisible();
    await page.getByText('Use minimal editor').click();

    await page.waitForLoadState('load');
    await page.fill('textarea[aria-label="yaml Code"]', yaml);

    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
    await page.getByRole('button', { name: 'Apply' }).click();

    await page.waitForSelector(`text=Applied ${name}`);
  }

  async deleteNamespace(name) {
    const page = this.page;
    await page.click('span:has-text("Namespaces")');
    await page.waitForLoadState('load');
    await page.waitForSelector(`text=${name}`);
    await page.click(`a:has-text("${name}")`);
    await page.click('button[title="Delete"]');
    await page.waitForSelector('text=Are you sure you want to delete this item?');
    await page.click('button:has-text("Yes")');
    await page.waitForSelector(`text=Deleted item ${name}`);
  }
}

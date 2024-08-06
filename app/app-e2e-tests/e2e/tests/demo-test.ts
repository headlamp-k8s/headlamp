import { expect, Page } from '@playwright/test';

export class headlampAppPage {
  constructor(private page: Page) {}

  async navHomepage() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.goto('http://localhost:3000/');

    await expect(this.page.getByRole('button', { name: 'Home' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Home' }).click();
  }

  async navNotifactions() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.goto('http://localhost:3000/');

    await expect(this.page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Notifications' }).click();

    await expect(this.page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  }
}

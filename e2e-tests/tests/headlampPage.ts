import { Page, expect } from '@playwright/test';

export class HeadlampPage {
  constructor(private page: Page) { }

  async authenticate() {
    await this.page.goto('/');

    // Expect a title "to contain" a substring.
    this.hasTitleContaining(/Token/);

    // Expects the URL to contain c/main/token
    this.hasURLContaining(/.*token/);

    const token = process.env.HEADLAMP_TOKEN || '';
    this.hasToken(token);

    // Fill in the token
    await this.page.locator("#token").fill(token);

    // Click on the "Authenticate" button and wait for navigation
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click('button:has-text("Authenticate")'),
    ]);
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

  async hasNetworkTab() {
    const networkTab = this.page.locator('span:has-text("Network")').first();
    expect(await networkTab.textContent()).toBe('Network');
  }

  async hasSecurityTab() {
    const networkTab = this.page.locator('span:has-text("Security")').first();
    expect(await networkTab.textContent()).toBe('Security');
  }

  async checkPageContent(text: string) {
    const pageContent = await this.page.content();
    expect(pageContent).toContain(text);
  }
}

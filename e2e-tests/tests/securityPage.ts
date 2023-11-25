import { Page } from '@playwright/test';

export class SecurityPage {
  constructor(private page: Page) { }

  async navigateToSecurity() {
    // Click on the "Security" button
    await this.page.click('span:has-text("Security")');
    // Wait for the page to load
    await this.page.waitForLoadState('load');
  }

  async clickOnServiceAccountsSection() {
    // Wait for the Service Accounts tab to load
    await this.page.waitForSelector('span:has-text("Service Accounts")');
    // Click on the "Service Accounts" section
    await this.page.click('span:has-text("Service Accounts")');
    // Wait for the page to load
    await this.page.waitForLoadState('load');
  }
}

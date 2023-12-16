import { Page } from '@playwright/test';

export class ServicesPage {
  constructor(private page: Page) { }

  async navigateToServices() {
    // Click on the "Network" button
    await this.page.click('span:has-text("Network")');
    // Wait for the page to load
    await this.page.waitForLoadState('load');
  }

  async clickOnServicesSection() {
    // Wait for the Services tab to load
    await this.page.waitForSelector('span:has-text("Services")');
    // Click on the "Services" section
    await this.page.click('span:has-text("Services")');
    // Wait for the page to load
    await this.page.waitForLoadState('load');
  } 

  async goToParticularService(serviceName: string) {
    // Click on the particular service
    await this.page.click(`a:has-text("${serviceName}")`);
    // Wait for the page to load
    await this.page.waitForLoadState('load');
    // Wait for section to load
    await this.page.waitForSelector('h1:has-text("Service")');
  }
}

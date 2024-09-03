import AxeBuilder from '@axe-core/playwright';
import { expect,test } from '@playwright/test';
// to do: do we need this?

// run the following in the terminal to read the console log
// this will not print anything in the playwright ui
test.describe('homepage', () => {
  test('main homepage', async ({ page }) => {
    // seems to work with the page being used as the argument
    await page.goto('http://localhost:3000');
    const results = await new AxeBuilder({ page }).analyze();
    // console.log(results)
    console.log('printing', results.violations);
    expect(results.violations.length).toBe(0);
  });
});

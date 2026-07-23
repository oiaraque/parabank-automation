import { expect, Locator, Page } from '@playwright/test';

export class OpenAccountPage {
  readonly page: Page;
  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openButton: Locator;
  readonly successMessage: Locator;
  readonly newAccountId: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openButton = page.locator('input[value="Open New Account"]');
    this.successMessage = page.getByText('Congratulations, your account is now open.');
    this.newAccountId = page.locator('#newAccountId');
  }

  async selectAccountType(type: 'CHECKING' | 'SAVINGS') {
    await expect(this.accountTypeSelect).toBeVisible({ timeout: 10000 });
    await this.accountTypeSelect.selectOption(type === 'CHECKING' ? '0' : '1');
  }

  async openAccount() {
    await expect(this.openButton).toBeEnabled({ timeout: 10000 });
    const [response] = await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('createAccount') && resp.status() === 200, { timeout: 30000 }),
      this.openButton.click(),
    ]);
  }

  async expectSuccess(): Promise<string> {
    await expect.poll(
      async () => (await this.page.locator('#newAccountId').innerText()).trim(),
      { timeout: 30000, intervals: [500, 1000, 2000] }
    ).toBeTruthy();
    return (await this.page.locator('#newAccountId').innerText()).trim();
  }
}
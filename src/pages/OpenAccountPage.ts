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
    await this.openButton.click();
  }

  async expectSuccess(): Promise<string> {
    await expect(this.page.locator('#newAccountId')).toHaveCount(1, { timeout: 30000 });
    return (await this.page.locator('#newAccountId').innerText()).trim();
  }
}
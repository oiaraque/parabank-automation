import { expect, Locator, Page } from '@playwright/test';

export class TransferPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.successMessage = page.getByText('Transfer Complete!');
  }

  async transfer(amount: number) {
    await expect(this.amountInput).toBeVisible({ timeout: 10000 });
    await this.amountInput.fill(amount.toString());
    await expect(this.fromAccountSelect).toBeVisible({ timeout: 10000 });
    await expect(this.toAccountSelect).toBeVisible({ timeout: 10000 });
    await this.transferButton.click();
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
  }
}

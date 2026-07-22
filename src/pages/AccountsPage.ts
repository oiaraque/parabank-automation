import { expect, Locator, Page } from '@playwright/test';

export class AccountsPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly accountsTable: Locator;
  readonly openNewAccountLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('#showOverview h1.title');
    this.accountsTable = page.locator('#accountTable');
    this.openNewAccountLink = page.locator('a[href*="openaccount.htm"]');
    this.transferFundsLink = page.locator('a[href*="transfer.htm"]');
    this.billPayLink = page.locator('a[href*="billpay.htm"]');
    this.requestLoanLink = page.locator('a[href*="requestloan.htm"]');
    this.logoutLink = page.locator('a[href*="logout.htm"]');
  }

  async expectLoggedIn() {
    await expect(this.welcomeMessage).toBeVisible({ timeout: 15000 });
  }

  async getFirstAccountId(): Promise<string> {
    const link = this.page.locator('#accountTable a').first();
    await expect(link).toBeVisible({ timeout: 10000 });
    const text = await link.innerText();
    return text.trim();
  }

  async clickOpenNewAccount() {
    await this.openNewAccountLink.click();
  }

  async clickTransferFunds() {
    await this.transferFundsLink.click();
  }

  async clickBillPay() {
    await this.billPayLink.click();
  }

  async clickRequestLoan() {
    await this.requestLoanLink.click();
  }
}

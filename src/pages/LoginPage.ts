import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.errorMessage = page.locator('.error');
    this.registerLink = page.locator('a[href*="register.htm"]');
  }

  async goto() {
    await this.page.goto('/index.htm');
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async clickRegister() {
    await this.registerLink.click();
  }
}
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { RegisterPage } from '../../src/pages/RegisterPage.js';
import { AccountsPage } from '../../src/pages/AccountsPage.js';
import { OpenAccountPage } from '../../src/pages/OpenAccountPage.js';
import { TransferPage } from '../../src/pages/TransferPage.js';
import { users, generateUniqueUser, loginScenarios, transfer } from '../../src/data/testData.js';

test.describe('ParaBank UI — E2E Flows', { tag: '@smoke' }, () => {
  test.setTimeout(60000);

  test('TC-01: Login with valid credentials shows accounts overview', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountsPage = new AccountsPage(page);

    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await accountsPage.expectLoggedIn();
  });

  test('TC-02: Login with invalid credentials shows error', { tag: '@negative' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectError();
  });

  test('TC-03: Register new user successfully creates account', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = generateUniqueUser();

    await registerPage.goto();
    await registerPage.fillForm(user);
    await registerPage.submit();
    await registerPage.expectSuccess();
  });

  test('TC-04: Open new checking account from existing account', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountsPage = new AccountsPage(page);
    const openAccountPage = new OpenAccountPage(page);

    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await accountsPage.expectLoggedIn();

    await accountsPage.clickOpenNewAccount();
    await openAccountPage.selectAccountType('CHECKING');
    await openAccountPage.openAccount();
    const newId = await openAccountPage.expectSuccess();
    expect(newId).toBeTruthy();
  });

  test('TC-05: Transfer funds between accounts shows success', { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountsPage = new AccountsPage(page);
    const transferPage = new TransferPage(page);

    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await accountsPage.expectLoggedIn();

    await accountsPage.clickTransferFunds();
    await transferPage.transfer(transfer.validAmount);
    await transferPage.expectSuccess();
  });
});

test.describe('ParaBank UI — Data-Driven Login', { tag: '@data-driven' }, () => {
  for (const scenario of loginScenarios) {
    test(`TC-17: Login with ${scenario.label}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const accountsPage = new AccountsPage(page);

      await loginPage.goto();
      await loginPage.login(scenario.username, scenario.password);

      if (scenario.shouldPass) {
        await accountsPage.expectLoggedIn();
      } else {
        await loginPage.expectError();
      }
    });
  }
});
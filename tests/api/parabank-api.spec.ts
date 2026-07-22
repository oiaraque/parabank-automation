import { test, expect } from '@playwright/test';
import { ParaBankApi } from '../../src/api/ParaBankApi.js';
import { users, accounts, loan, billPay } from '../../src/data/testData.js';

let api: ParaBankApi;

test.beforeEach(async ({ request }) => {
  api = new ParaBankApi(request);
});

test.describe('ParaBank API — Core Operations', { tag: '@smoke' }, () => {

  test('TC-06: GET /login returns customer data for valid credentials', async () => {
    const response = await api.login(users.valid.username, users.valid.password);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(body.firstName).toBeTruthy();
    expect(body.lastName).toBeTruthy();
  });

  test('TC-07: POST /createAccount creates a new checking account', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    const customer = await loginRes.json();

    const accountsRes = await api.getCustomerAccounts(customer.id);
    const accountsList = await accountsRes.json();
    const fromAccountId = accountsList[0].id;

    const response = await api.createAccount(customer.id, 0, fromAccountId);
    expect(response.status()).toBe(200);

    const account = await response.json();
    expect(account.id).toBeTruthy();
    expect(account.type).toBe('CHECKING');
  });

  test('TC-08: GET /accounts/{id} returns account details', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    const customer = await loginRes.json();

    const accountsRes = await api.getCustomerAccounts(customer.id);
    const accountsList = await accountsRes.json();
    const accountId = accountsList[0].id;

    const response = await api.getAccount(accountId);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(accountId);
    expect(body.customerId).toBe(customer.id);
    expect(body.type).toBeTruthy();
    expect(body.balance).toBeDefined();
  });
});

test.describe('ParaBank API — Regression', { tag: '@regression' }, () => {

  test('TC-09: POST /customers/update updates customer information', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    const customer = await loginRes.json();

    const response = await api.updateCustomer(customer.id, {
      firstName: 'John',
      lastName: 'Updated',
      street: '789 Updated Street',
      city: 'UpdatedCity',
      state: 'NY',
      zipCode: '54321',
      phoneNumber: '5550001111',
      ssn: '111-22-3333',
      username: users.valid.username,
      password: users.valid.password,
    });
    expect(response.status()).toBe(200);

    const verifyRes = await api.getCustomer(customer.id);
    const updated = await verifyRes.json();
    expect(updated.lastName).toBe('Updated');
  });

  test('TC-10: Chained — create account, transfer funds, verify transaction', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    expect(loginRes.status()).toBe(200);
    const customer = await loginRes.json();

    const accountsRes = await api.getCustomerAccounts(customer.id);
    const accountsList = await accountsRes.json();
    const sourceAccountId = accountsList[0].id;

    const createRes = await api.createAccount(customer.id, 0, sourceAccountId);
    expect(createRes.status()).toBe(200);
    const newAccount = await createRes.json();
    expect(newAccount.id).toBeTruthy();

    const verifyRes = await api.getAccount(newAccount.id);
    expect(verifyRes.status()).toBe(200);
    const verified = await verifyRes.json();
    expect(verified.id).toBe(newAccount.id);

    const transferRes = await api.transfer(sourceAccountId, newAccount.id, 50);
    expect(transferRes.status()).toBe(200);

    const txRes = await api.getTransactions(newAccount.id);
    expect(txRes.status()).toBe(200);
    const transactions = await txRes.json();
    expect(transactions.length).toBeGreaterThan(0);
  });

  test('TC-11: POST /requestLoan returns loan response', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    const customer = await loginRes.json();

    const accountsRes = await api.getCustomerAccounts(customer.id);
    const accountsList = await accountsRes.json();
    const fromAccountId = accountsList[0].id;

    const response = await api.requestLoan(
      customer.id,
      loan.amount,
      loan.downPayment,
      fromAccountId
    );
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.approved).toBeDefined();
  });

  test('TC-12: GET /customers/{id}/accounts returns list of accounts', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    const customer = await loginRes.json();

    const response = await api.getCustomerAccounts(customer.id);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0].id).toBeTruthy();
    expect(body[0].customerId).toBe(customer.id);
  });

  test('TC-13: POST /billpay processes payment', async () => {
    const loginRes = await api.login(users.valid.username, users.valid.password);
    const customer = await loginRes.json();

    const accountsRes = await api.getCustomerAccounts(customer.id);
    const accountsList = await accountsRes.json();
    const accountId = accountsList[0].id;

    const response = await api.billPay(accountId, billPay.payee, billPay.amount);
    expect(response.status()).toBe(200);
  });
});

test.describe('ParaBank API — Negative Cases', { tag: '@negative' }, () => {

  test('TC-14: GET /accounts/{invalid} returns error for non-existent account', async () => {
    const response = await api.getAccount(accounts.invalidAccountId);
    expect(response.status()).not.toBe(200);
  });

  test('TC-15: POST /transfer with invalid account returns error', async () => {
    const response = await api.transfer(accounts.invalidAccountId, accounts.invalidAccountId, 100);
    expect(response.status()).not.toBe(200);
  });

  test('TC-16: GET /login with invalid credentials returns error', async () => {
    const response = await api.login(users.invalid.username, users.invalid.password);
    expect(response.status()).not.toBe(200);
  });
});

import { APIRequestContext } from '@playwright/test';

export class ParaBankApi {
  constructor(private request: APIRequestContext) {}

  async login(username: string, password: string) {
    return this.request.get(`login/${username}/${password}`);
  }

  async getCustomer(customerId: number) {
    return this.request.get(`customers/${customerId}`);
  }

  async getCustomerAccounts(customerId: number) {
    return this.request.get(`customers/${customerId}/accounts`);
  }

  async updateCustomer(
    customerId: number,
    data: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      phoneNumber: string;
      ssn: string;
      username: string;
      password: string;
    }
  ) {
    const params = new URLSearchParams(data as Record<string, string>);
    return this.request.post(`customers/update/${customerId}?${params}`);
  }

  async getAccount(accountId: number) {
    return this.request.get(`accounts/${accountId}`);
  }

  async createAccount(customerId: number, accountType: number, fromAccountId: number) {
    return this.request.post(
      `createAccount?customerId=${customerId}&newAccountType=${accountType}&fromAccountId=${fromAccountId}`
    );
  }

  async getTransactions(accountId: number) {
    return this.request.get(`accounts/${accountId}/transactions`);
  }

  async getTransaction(transactionId: number) {
    return this.request.get(`transactions/${transactionId}`);
  }

  async transfer(fromAccountId: number, toAccountId: number, amount: number) {
    return this.request.post(
      `transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}`
    );
  }

  async deposit(accountId: number, amount: number) {
    return this.request.post(`deposit?accountId=${accountId}&amount=${amount}`);
  }

  async withdraw(accountId: number, amount: number) {
    return this.request.post(`withdraw?accountId=${accountId}&amount=${amount}`);
  }

  async requestLoan(customerId: number, amount: number, downPayment: number, fromAccountId: number) {
    return this.request.post(
      `requestLoan?customerId=${customerId}&amount=${amount}&downPayment=${downPayment}&fromAccountId=${fromAccountId}`
    );
  }

  async billPay(
    accountId: number,
    payee: {
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      phone: string;
      accountNumber: number;
      verifyAccount: number;
    },
    amount: number
  ) {
    const params = new URLSearchParams({
      accountId: accountId.toString(),
      amount: amount.toString(),
    });
    return this.request.post(`billpay?${params}`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: payee.name,
        address: {
          street: payee.street,
          city: payee.city,
          state: payee.state,
          zipCode: payee.zipCode,
        },
        phoneNumber: payee.phone,
        accountNumber: payee.accountNumber,
      },
    });
  }

  async initializeDB() {
    return this.request.post('initializeDB');
  }

  async cleanDB() {
    return this.request.post('cleanDB');
  }
}
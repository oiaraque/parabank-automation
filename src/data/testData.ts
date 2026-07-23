export const users = {
  valid: {
    username: process.env.TEST_USERNAME || 'john',
    password: process.env.TEST_PASSWORD || 'demo',
  },
  invalid: {
    username: 'nonexistent_user',
    password: 'wrong_password',
  },
  empty: {
    username: '',
    password: '',
  },
  specialChars: {
    username: 'user@#$%&!',
    password: '!@#$%^&*()',
  },
} as const;

export const newUser = {
  firstName: 'QA',
  lastName: 'Automation',
  street: '123 Test Street',
  city: 'TestCity',
  state: 'TX',
  zipCode: '12345',
  phone: '5551234567',
  ssn: '123-45-6789',
  username: `qauser_${Date.now()}`,
  password: 'Test1234!',
};

export function generateUniqueUser() {
  const timestamp = Date.now();
  return {
    ...newUser,
    username: `qauser_${timestamp}`,
    ssn: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

export const accounts = {
  defaultAccountId: 12345,
  invalidAccountId: 99999,
} as const;

export const transfer = {
  validAmount: 100,
  invalidAmount: -50,
} as const;

export const loan = {
  amount: 500,
  downPayment: 100,
} as const;

export const billPay = {
  payee: {
    name: 'Test Payee',
    street: '456 Payee Ave',
    city: 'PayCity',
    state: 'CA',
    zipCode: '90210',
    phone: '5559876543',
    accountNumber: 12345,
    verifyAccount: 12345,
  },
  amount: 50,
} as const;

export const loginScenarios = [
  { label: 'valid credentials', ...users.valid, shouldPass: true },
  { label: 'invalid username', ...users.invalid, shouldPass: false },
  { label: 'empty credentials', ...users.empty, shouldPass: false },
  { label: 'special characters', ...users.specialChars, shouldPass: false },
] as const;

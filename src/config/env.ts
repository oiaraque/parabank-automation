import dotenv from 'dotenv';
dotenv.config();

export const env = {
  baseUrl: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank/',
  get apiBase() {
    return `${this.baseUrl}/services/bank`;
  },
  testUser: {
    username: process.env.TEST_USERNAME || 'john',
    password: process.env.TEST_PASSWORD || 'demo',
  },
} as const;
# ParaBank Test Automation Framework

Playwright + TypeScript automation framework for [ParaBank](https://parabank.parasoft.com/parabank) — covering UI E2E flows, REST API tests, negative cases, and data-driven scenarios.

## Quick Start

```bash
git clone https://github.com/oiaraque/parabank-automation.git
cd parabank-automation
npm install
npx playwright install chromium
npx playwright test
```

## Run Subsets

```bash
# UI tests only
npx playwright test --project=ui

# API tests only
npx playwright test --project=api

# By tag
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @negative
npx playwright test --grep @data-driven

# Parallel (4 workers)
npx playwright test --workers=4

# Headed (watch browser)
npx playwright test --project=ui --headed
```

## View Report

```bash
npx playwright show-report
```

## Environment Configuration

Copy `.env.example` to `.env` and adjust:

```
BASE_URL=https://parabank.parasoft.com/parabank
TEST_USERNAME=john
TEST_PASSWORD=demo
```

Running against a different base URL requires **no code changes** — only update the env var.

## Framework Structure

```
parabank-automation/
├── src/
│   ├── pages/              ← Page Objects (LoginPage, AccountsPage, etc.)
│   ├── api/                ← API client (ParaBankApi.ts)
│   ├── data/               ← Test data factory (testData.ts)
│   └── config/             ← Environment config (env.ts)
├── tests/
│   ├── ui/                 ← UI E2E specs
│   └── api/                ← API specs
├── playwright.config.ts    ← Projects, parallel, reporters
├── .github/workflows/      ← CI pipeline (GitHub Actions)
└── TECHNICAL_NOTES.md      ← Design decisions doc
```

## Design Pattern

**Page Object Model (POM)** with separation of concerns:

- **Pages** — locators + interactions per screen
- **API Client** — typed REST client wrapping Playwright's `request`
- **Data** — centralized test data factory, no hardcoded values in tests
- **Config** — environment-aware configuration via dotenv

## Tool Justification

**Playwright** — native API testing (`request`), auto-wait (no sleep), parallel execution, built-in reporters, screenshot on failure, multi-browser support.

**TypeScript** — type safety, IDE autocompletion, refactor-friendly, industry standard for modern QE.

## Test Coverage (17 tests)

| # | Test | Type | Tag |
|---|------|------|-----|
| 01 | Login happy path | UI E2E | @smoke |
| 02 | Login invalid credentials | UI Negative | @negative |
| 03 | Register new user | UI E2E | @smoke |
| 04 | Open new account | UI E2E | @regression |
| 05 | Transfer funds | UI E2E | @regression |
| 06 | API login | API | @smoke |
| 07 | API create account | API | @smoke |
| 08 | API get account | API | @smoke |
| 09 | API update customer | API | @regression |
| 10 | API chained (create→verify→transfer→transactions) | API Chain | @regression |
| 11 | API request loan | API | @regression |
| 12 | API customer accounts list | API | @regression |
| 13 | API bill pay | API | @regression |
| 14 | API get non-existent account | API Negative | @negative |
| 15 | API transfer invalid account | API Negative | @negative |
| 16 | API login invalid credentials | API Negative | @negative |
| 17 | Data-driven login (4 datasets) | UI Data-Driven | @data-driven |

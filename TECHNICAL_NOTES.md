# Technical Design Notes

## 1. Key Design Decisions

**POM + API Client separation.** UI tests use Page Objects; API tests use a typed `ParaBankApi` client. Both share the same data layer (`testData.ts`) but never cross concerns — a UI test doesn't call API methods, and vice versa. Trade-off: the chained API test (TC-10) is longer because it can't reuse UI shortcuts, but it validates the API contract independently of the UI.

**Single data factory, no scattered hardcoding.** All test data lives in `src/data/testData.ts` — users, accounts, amounts, payees. Tests import what they need. `generateUniqueUser()` uses timestamps to avoid collisions in parallel runs. Trade-off: slightly more imports per test, but changing a test credential is a one-line fix instead of a grep across 17 files.

**Two Playwright projects (ui / api) with shared config.** The `playwright.config.ts` defines separate projects with different `baseURL` values (`/parabank` for UI, `/parabank/services/bank` for API). Tests run in parallel by default. Trade-off: API tests don't get a browser instance (lighter, faster), but if you needed to mix UI and API in one test you'd use `request` from the page context instead.

## 2. Flakiness Prevention

- **No `sleep()` anywhere.** Playwright's auto-wait handles element readiness. Explicit `expect().toBeVisible({ timeout })` replaces arbitrary waits.
- **Unique test data per run.** `generateUniqueUser()` timestamps usernames and SSNs so parallel workers never collide on registration.
- **Independent tests.** Each test logs in fresh — no shared state between tests. A failure in TC-04 doesn't cascade into TC-05.
- **Resilient selectors.** Locators use `id`, `name`, `value` attributes and `getByText` — not CSS classes or XPath positions that break on styling changes.
- **Retry on CI.** Config sets `retries: 2` in CI to absorb transient network issues with the shared ParaBank instance.

## 3. Scaling to 500 Tests

If 3 engineers joined and the suite grew 30x, the first changes would be:

1. **Shared fixtures** — extract login-as-user into a Playwright fixture (`test.extend`) so every test that needs an authenticated session gets it without repeating login steps. Cuts boilerplate and speeds up execution.
2. **Test sharding** — split the suite across CI runners with `--shard=1/4` etc. Playwright supports this natively. At 500 tests with 4 shards, each runner handles ~125 tests.
3. **Data isolation** — each worker gets its own ParaBank user (created via API in `globalSetup`) to eliminate cross-worker data interference entirely.
4. **Tag-based pipeline stages** — `@smoke` runs on every PR (~30s), `@regression` runs on merge to main (~5min), full suite runs nightly.

## 4. What I'd Do Differently With 2 More Weeks

- **Visual regression** — add `toHaveScreenshot()` baselines for key pages (login, accounts, transfer) to catch CSS regressions.
- **API contract tests** — validate response schemas against the ParaBank OpenAPI spec using `zod` or `ajv`.
- **Global setup/teardown** — `initializeDB` before the full suite and `cleanDB` after, ensuring a known starting state regardless of previous runs.
- **Custom reporter** — Allure integration for richer reports with step annotations, attachments, and history trends.
- **Accessibility tests** — `@axe-core/playwright` scans on each page to catch WCAG violations as part of the regression suite.
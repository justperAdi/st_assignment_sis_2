import { defineConfig, devices } from '@playwright/test';

// All CI behaviour is switched on by one variable: GitHub Actions sets CI=true.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // --shard splits individual tests, not whole files
  forbidOnly: isCI, // a forgotten test.only fails CI
  retries: isCI ? 2 : 0, // a flaky test is reported as flaky, not red
  workers: isCI ? 2 : undefined, // GitHub runners have 2-4 vCPUs
  reporter: isCI
    ? [
        ['list'],
        ['blob'], // one blob per shard, merged by the merge-reports job
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test', // the site uses data-test, not data-testid
    trace: 'on-first-retry', // trace of exactly the failed attempt
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});

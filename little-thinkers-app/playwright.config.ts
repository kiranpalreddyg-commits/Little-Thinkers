import { defineConfig, devices } from '@playwright/test';

// PORT lets a second checkout run its own server without colliding with a dev server on 3000.
const PORT = process.env.PORT ?? '3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // 4 not 8: the runner has 4 cores, and at 8 the WebKit project timed out on interactive flows.
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    // CI runs the production build: the dev server compiles each route on first hit, and
    // under parallel workers that latency alone pushed WebKit past the 30s test timeout.
    command: process.env.CI
      ? 'NEXT_PUBLIC_USE_MOCK_API=true npm run build && NEXT_PUBLIC_USE_MOCK_API=true npm run start'
      : 'NEXT_PUBLIC_USE_MOCK_API=true npm run dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});

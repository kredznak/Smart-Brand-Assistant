import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: [
    { command: 'pnpm dev', port: 5173, timeout: 120_000, reuseExistingServer: !process.env.CI }
  ]
});


import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  // `testDir: './e2e'` collects smoke.spec.ts too, and those tests target the
  // deployed site. Without this, `pnpm test:e2e` would run them against
  // localhost:3100 and fail on an origin mismatch that means nothing.
  grepInvert: /@smoke/,
  globalSetup: './e2e/global-setup.ts',
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    // Production build: the dev overlay pollutes console checks and the
    // dev server renders differently. Port 3100 keeps clear of `pnpm dev`.
    command: 'pnpm build && pnpm start -p 3100',
    url: 'http://localhost:3100',
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
})

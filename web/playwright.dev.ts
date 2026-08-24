import { defineConfig } from '@playwright/test'

/**
 * The dev-server half of the console check (TD-35). Four deliberate differences
 * from `playwright.config.ts`:
 *
 *   1. `next dev`, not `pnpm build && pnpm start`. React's development
 *      validation exists only here, which is the entire point.
 *   2. Port 3101, clear of `pnpm dev`'s own 3200 and the audit's 3100, so this
 *      never shares a server with either.
 *   3. `reuseExistingServer: false`. A dev server is cheap to start, and a
 *      shared one reintroduces TD-27 in a different costume.
 *   4. No `globalSetup`. The freshness check reads `.next/BUILD_ID`, which a dev
 *      server does not produce, so running it here would fail for a reason that
 *      has nothing to do with what this config checks.
 *
 * The timeout is long because Turbopack compiles per route on first load and
 * this sweeps every audited URL cold.
 */
export default defineConfig({
  testDir: './e2e',
  grep: /@dev/,
  timeout: 600_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3101' },
  webServer: {
    command: 'pnpm exec next dev -p 3101',
    url: 'http://localhost:3101',
    timeout: 180_000,
    reuseExistingServer: false,
  },
})

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // Bumped from 60s (2026-09-14, stage 15 port): the full-sweep tests (WCAG
  // AA in both themes, the disclosure-open sweep) walk every page the site
  // has, and adding the 18th stage's pages pushed them past the old budget —
  // confirmed by retry, not a flake. The sweep only grows as stages ship.
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  // `testDir: './e2e'` collects smoke.spec.ts and dev-console.spec.ts too. The
  // first targets the deployed site; the second needs a dev server on 3101.
  // Without this, `pnpm test:e2e` would run both against localhost:3100 and
  // fail on mismatches that mean nothing.
  grepInvert: /@smoke|@dev/,
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

import { defineConfig } from '@playwright/test'

/**
 * Post-deployment verification, per docs/14. Three deliberate differences from
 * `playwright.config.ts`:
 *
 *   1. No `webServer`. There is nothing to start — the site is already running.
 *   2. `grep: /@smoke/`, so this runs the smoke file and not the 14-test audit.
 *   3. `retries: 2` always, where the local config retries only in CI. A remote
 *      host has network flake a localhost server does not, and a smoke test
 *      that cries wolf is a smoke test people stop reading.
 *
 * PROD_URL overrides the target. That is what lets the suite be teeth-checked
 * by pointing it at a host that is wrong.
 *
 * This origin is a second copy of the value in `src/lib/site.ts` — a real seam,
 * recorded in the spec. A Playwright config cannot import from `src/` without
 * dragging the app's module resolution into the runner. If the domain changes,
 * both move.
 */
export default defineConfig({
  testDir: './e2e',
  grep: /@smoke/,
  timeout: 60_000,
  retries: 2,
  use: {
    baseURL: process.env.PROD_URL ?? 'https://acp-dev-playbook.vercel.app',
    // A red run here is the hardest kind to reproduce — the target is remote
    // and its state is transient. Costs nothing on the green path.
    trace: 'retain-on-failure',
  },
})

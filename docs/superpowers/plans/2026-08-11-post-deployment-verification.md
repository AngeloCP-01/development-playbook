# Post-Deployment Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `pnpm test:prod` command that checks the deployed site, covering only what a local or CI build structurally cannot.

**Architecture:** A second Playwright config with no `webServer` and a remote `baseURL`, selecting tests by an `@smoke` tag. The default config gains `grepInvert` so `pnpm test:e2e` is unchanged and never reaches production. Five tests, each asserting against the origin it was pointed at rather than against a constant imported from the repo.

**Tech Stack:** Playwright 1.61.1, TypeScript, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-11-post-deployment-verification-design.md`

## Global Constraints

- All commands run from `web/`. Package manager is **pnpm**.
- **Every request is read-only** — `GET` only. Nothing in this suite may write, POST, or mutate. The site is static and public, so this holds by construction; keep it that way.
- **Assert against `baseURL`, never against `SITE_URL` imported from `src/`.** The whole point is to check the *deployed* origin. Importing the repo's constant would re-create the blind spot this closes, since local and production resolve it differently by design.
- The default origin is `https://acp-dev-playbook.vercel.app`, overridable by the `PROD_URL` environment variable. `PROD_URL` is what makes the teeth checks possible.
- Tests are selected by the tag `@smoke`, passed via Playwright's `tag` option — **not** appended to the test title. Titles encode rationale in this repo, and `@smoke` in a title is noise. Verified present in 1.61.1 (`types/test.d.ts:2694`).
- **Do not modify `web/e2e/audit.spec.ts`.** Its 14 tests stay exactly as they are.
- **Do not add a CI job.** Automating this is a recorded non-goal.
- **Do not add a build-stamp surface to the app.** Recorded non-goal.
- 19 public URLs: the index plus one per entry in `STAGES`.
- Conventional Commits, lowercase after the colon, trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Branch work merges to `develop`, never `main`, and **ask before merging** (`CLAUDE.md`, Git conventions).

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `web/playwright.prod.ts` | **Create.** Remote target, no server, `@smoke` only | 1 |
| `web/e2e/smoke.spec.ts` | **Create.** The five checks | 1, 2, 3 |
| `web/playwright.config.ts` | `grepInvert` so the local run excludes `@smoke` | 1 |
| `web/package.json` | The `test:prod` script | 1 |
| `docs/task.md`, `docs/tracker.md`, `CLAUDE.md`, `KICKOFF.md` | Records | 4 |

---

### Task 1: The harness, proved by the check that motivated it

**Files:**
- Create: `web/playwright.prod.ts`
- Create: `web/e2e/smoke.spec.ts`
- Modify: `web/playwright.config.ts` (the `defineConfig` object)
- Modify: `web/package.json` (scripts)

**Interfaces:**
- Produces: the `@smoke` tag convention and `pnpm test:prod`. Tasks 2 and 3 add tests to the same file and change no config.

**Background.** `robots.txt` is built from `SITE_URL`, which resolves `NEXT_PUBLIC_SITE_URL` in production and a hard-coded fallback everywhere else. That makes it the single artifact most worth checking against the live site: a missing or wrong env var cannot fail any existing gate, and it silently poisons every canonical URL.

- [ ] **Step 1: Write the failing test**

Create `web/e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

/**
 * Smoke tests against the deployed site. Read-only by construction: the site is
 * static and public, there is nothing to write to, and nothing here may
 * introduce a write. Run with `pnpm test:prod` after a promotion to `main`.
 *
 * The rule for what belongs here: a check earns its place only if a local or CI
 * build structurally cannot perform it. Contrast, overflow and panel weight are
 * properties of the built HTML and CSS — the bytes CI checked are the bytes
 * Vercel serves — so they stay in `audit.spec.ts` and are not repeated here.
 *
 * Everything asserts against `baseURL`, never against `SITE_URL` from `src/`.
 * Those two differ by design: production resolves NEXT_PUBLIC_SITE_URL and
 * everywhere else resolves a fallback. Importing the constant would make this
 * suite agree with the repo instead of checking the deployment.
 */

/** The origin under test, without a trailing slash. */
function origin(baseURL: string | undefined): string {
  if (!baseURL) throw new Error('no baseURL configured')
  return baseURL.replace(/\/$/, '')
}

test(
  'robots.txt allows indexing and names this deployment’s own origin, which is the one artifact no local build can get right',
  { tag: '@smoke' },
  async ({ request, baseURL }) => {
    const res = await request.get('/robots.txt')
    expect(res.status(), 'robots.txt did not return 200').toBe(200)

    const body = await res.text()
    expect(body).toMatch(/Allow:\s*\//i)
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/im)
    expect(
      body,
      `robots.txt does not name ${origin(baseURL)} — NEXT_PUBLIC_SITE_URL is probably wrong or unset`,
    ).toContain(`${origin(baseURL)}/sitemap.xml`)
  },
)
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm exec playwright test --config=playwright.prod.ts`

Expected: **FAIL** — `Cannot find module playwright.prod.ts` or an equivalent config-not-found error. The harness does not exist yet, which is what this task builds.

- [ ] **Step 3: Create the production config**

Create `web/playwright.prod.ts`:

```ts
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
  },
})
```

- [ ] **Step 4: Keep the local run out of production**

In `web/playwright.config.ts`, add `grepInvert` immediately after `retries`:

```ts
  retries: process.env.CI ? 1 : 0,
  // `testDir: './e2e'` collects smoke.spec.ts too, and those tests target the
  // deployed site. Without this, `pnpm test:e2e` would run them against
  // localhost:3100 and fail on an origin mismatch that means nothing.
  grepInvert: /@smoke/,
```

- [ ] **Step 5: Add the script**

In `web/package.json`, add after the `test:e2e` line:

```json
    "test:e2e": "playwright test",
    "test:prod": "playwright test --config=playwright.prod.ts",
```

- [ ] **Step 6: Run the smoke test against the live site**

Run: `pnpm test:prod`

Expected: **1 passed.**

- [ ] **Step 7: Confirm the local suite is untouched**

Run: `lsof -ti:3100 | xargs kill -9 2>/dev/null; sleep 1; pnpm test:e2e`

Expected: **14 passed** — exactly as before, with no attempt to reach production. If it reports 15, `grepInvert` is not matching and the tag option is not being considered by grep; switch the tag to a title suffix and note the deviation in the task report.

- [ ] **Step 8: Teeth-check it**

```bash
git add -A
PROD_URL=https://acp-development-playbook.vercel.app pnpm test:prod
```

That is the old wrong hostname, which 404s. Expected: **FAIL** on the status assertion — `robots.txt did not return 200`. A pass or an ambiguous error means the suite is not really reading the origin it was given.

Then, still pointed at the live site, temporarily change the assertion to expect a different origin (`.toContain('https://example.com/sitemap.xml')`) and confirm it fails on the named message. Revert.

Record both outputs in the task report.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
test(web): check robots.txt against the deployed site, not a local build

robots.txt is built from NEXT_PUBLIC_SITE_URL, which exists only in Vercel —
local and CI builds resolve the fallback in src/lib/site.ts instead. So the
one artifact whose correctness depends on the deployment environment is the
one no existing gate can check, and a wrong env var silently poisons every
canonical URL on the site.

playwright.prod.ts has no webServer, greps @smoke, and retries twice because
a remote host has flake a localhost server does not. The default config gains
grepInvert so pnpm test:e2e is unchanged at 14 tests and never reaches for
production.

Teeth-checked by pointing PROD_URL at the old wrong hostname and confirming
the suite fails rather than skipping.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The sitemap, and whether it is telling the truth

**Files:**
- Modify: `web/e2e/smoke.spec.ts` (append two tests)

**Interfaces:**
- Consumes: the `@smoke` tag and the `origin()` helper from Task 1.
- Produces: nothing later tasks use.

**Background.** Two distinct failures. The sitemap can carry the wrong origin, for the same env-var reason as `robots.txt`. And it can advertise URLs that do not resolve — which no unit test can see, because the unit test reads the same array the sitemap is generated from. Asking the edge is the only way to know.

- [ ] **Step 1: Write the failing tests**

Append to `web/e2e/smoke.spec.ts`:

```ts
test(
  'the sitemap lists all 19 public URLs on this deployment’s origin, since a sitemap built from the wrong origin is invisible to every local gate',
  { tag: '@smoke' },
  async ({ request, baseURL }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status(), 'sitemap.xml did not return 200').toBe(200)

    const locs = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1],
    )

    // 19 = the index plus one page per stage. A drop means a stage stopped
    // being generated; a rise means something is being advertised twice.
    expect(locs, `sitemap lists ${locs.length} URLs`).toHaveLength(19)
    for (const loc of locs) {
      expect(loc, `${loc} is not on ${origin(baseURL)}`).toContain(
        origin(baseURL),
      )
    }
  },
)

// The unit test for the sitemap reads the same STAGES array the sitemap is
// generated from, so it can only ever agree with itself. Whether the URLs
// actually resolve is a question for the edge.
test(
  'every URL the sitemap advertises actually resolves, because a sitemap that lies is a defect only production can reveal',
  { tag: '@smoke' },
  async ({ request }) => {
    const locs = [
      ...(await (await request.get('/sitemap.xml')).text()).matchAll(
        /<loc>([^<]+)<\/loc>/g,
      ),
    ].map((m) => m[1])
    expect(locs.length, 'no URLs to check').toBeGreaterThan(0)

    const broken: string[] = []
    for (const loc of locs) {
      // GET rather than HEAD: a host that answers 405 to HEAD would fail this
      // for a reason that has nothing to do with the page existing.
      const r = await request.get(loc)
      if (r.status() !== 200) broken.push(`${r.status()} ${loc}`)
    }
    expect(broken, broken.join('\n')).toEqual([])
  },
)
```

- [ ] **Step 2: Run them**

Run: `pnpm test:prod`

Expected: **3 passed.** These are new assertions over an already-correct site, so they pass on arrival — Step 3 is what proves they are not vacuous.

- [ ] **Step 3: Teeth-check both**

```bash
git add -A
```

Change `toHaveLength(19)` to `toHaveLength(20)`, run `pnpm test:prod`, and confirm **that test alone** fails reporting 19. Revert.

Then change the resolution loop's success condition to `r.status() !== 999`, run again, and confirm every one of the 19 URLs is reported broken — proving the loop is really fetching rather than short-circuiting. Revert.

Record both outputs.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
test(web): check the sitemap's origin and that its URLs resolve

Two failures a local build cannot see. The sitemap carries whatever origin
NEXT_PUBLIC_SITE_URL supplied, which is a different value in CI than in
production. And it can advertise URLs that do not resolve — invisible to the
unit test, which reads the same STAGES array the sitemap is generated from and
can only ever agree with itself.

Nineteen GETs against the edge is the cheapest way to know the sitemap is not
lying. GET rather than HEAD, so a host that answers 405 to HEAD does not fail
this for an unrelated reason.

Teeth-checked by asserting 20 entries, and by inverting the status condition to
confirm all 19 requests really happen.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Is it up, and is the real edge quiet

**Files:**
- Modify: `web/e2e/smoke.spec.ts` (append two tests)

**Interfaces:**
- Consumes: the `@smoke` tag from Task 1.
- Produces: nothing.

**Background.** `docs/14`'s minute 0–1 is *"Load the production URL. Not the deploy dashboard — the actual site."* That is this task. The console check belongs here rather than in `audit.spec.ts` because the edge differs from a localhost server in ways that matter: fonts come from Google, assets come off a CDN, and a Content-Security-Policy or a blocked request would show up here and nowhere else.

The title template is `%s · Development Playbook` (`src/app/layout.tsx`), so a stage page's title reads `03. Architecture · Development Playbook`. Asserting it proves the page rendered through the real layout rather than returning a shell.

- [ ] **Step 1: Write the failing tests**

Append to `web/e2e/smoke.spec.ts`:

```ts
test(
  'the home page and a stage page render through the real layout, which is docs/14’s minute-zero check automated',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page).toHaveTitle(/Development Playbook/)

    await page.goto('/stages/03-architecture', { waitUntil: 'networkidle' })
    // The title template lives in the root layout, so this failing means the
    // page returned something other than a fully rendered document.
    await expect(page).toHaveTitle('03. Architecture · Development Playbook')
    await expect(
      page.getByRole('heading', { level: 1 }),
    ).toBeVisible()
  },
)

test(
  'the deployed site logs no console errors, where fonts and assets come from the real network rather than a local server',
  { tag: '@smoke' },
  async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 120))
    })

    for (const path of ['/', '/stages/03-architecture']) {
      await page.goto(path, { waitUntil: 'networkidle' })
    }
    expect(errors, errors.join('\n')).toEqual([])
  },
)
```

- [ ] **Step 2: Run them**

Run: `pnpm test:prod`

Expected: **5 passed.**

- [ ] **Step 3: Teeth-check both**

```bash
git add -A
```

Change the expected title to `'04. Project Setup · Development Playbook'`, run, confirm that test alone fails. Revert.

For the console test, add `await page.evaluate(() => console.error('probe'))` after the first `goto`, run, and confirm it fails reporting `probe`. Remove it.

Record both outputs.

- [ ] **Step 4: Run the whole gate**

Run, from `web/`:

```bash
pnpm test:prod
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test
lsof -ti:3100 | xargs kill -9 2>/dev/null; sleep 1; pnpm test:e2e
```

Expected: 5 passed; all clean; **14 passed** and no production requests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
test(web): check the deployed site renders and its edge is quiet

docs/14's minute-zero check, automated: load the production URL, not the
deploy dashboard. The title assertion goes through the root layout's template,
so a page returning a shell instead of a rendered document fails here.

The console check earns its place separately from the one in audit.spec.ts.
That one runs against a localhost server; this one runs where fonts come from
Google and assets come off a CDN, which is where a blocked request or a CSP
problem would appear and nowhere else.

Teeth-checked by expecting the wrong stage title, and by injecting a
console.error and confirming it is caught.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Records

**Files:**
- Modify: `docs/task.md` (the W-5 block)
- Modify: `docs/tracker.md` (Completed table; the "Next up" W-5 bullet)
- Modify: `CLAUDE.md` (commands block)
- Modify: `KICKOFF.md` (project state)

- [ ] **Step 1: Close W-5's last checklist item in `docs/task.md`**

Replace the unchecked post-deployment line with:

```markdown
- [x] **Post-deployment verification per `docs/14`** — `pnpm test:prod` runs five `@smoke`
      checks against the deployed site: `robots.txt` and `sitemap.xml` carry the live origin,
      all 19 advertised URLs resolve, the home and a stage page render through the real
      layout, and the edge logs no console errors. Scoped to what a local build cannot do —
      contrast and overflow stay in `audit.spec.ts`, because the bytes CI checked are the
      bytes Vercel serves
```

Then change the W-5 heading's parenthetical from `post-deployment verification deferred` to
`post-deployment verification automated`, and the milestone table row at `:62` likewise.

- [ ] **Step 2: Add the tracker row**

Add above the `| 2026-08-11 | — | **TD-16 closed` row. Use the counts the runs actually print:

```markdown
| 2026-08-11 | W-5 (verify) | **Post-deployment verification**, closing W-5's last open item. `pnpm test:prod` and `playwright.prod.ts` — no `webServer`, remote `baseURL`, `@smoke` tag, `retries: 2` because a remote host flakes where a localhost server does not. Five checks, each chosen by one rule: it must test something a local or CI build structurally cannot. That excluded contrast, overflow and panel weight, since the bytes CI checked are the bytes Vercel serves | 3 commits. **5 passed** against the live site; `pnpm test:e2e` still **14 passed** and never reaches production, via `grepInvert`. Every check teeth-checked: `PROD_URL` pointed at the old wrong hostname, a 20-entry sitemap expectation, an inverted status condition proving all 19 requests happen, a wrong stage title, and an injected `console.error` | **Not automated in CI** — a push to `main` and a live deployment are not simultaneous, so it needs a wait-for-deployment step, which is the usual source of flake. **No deployed-commit check**: it needs a build-stamp surface and Vercel's system env vars exposed, and the sitemap-resolves check covers most of the risk for free. **No Sentry, error rates or latency baselines** — `docs/14` asks for all three and they belong to `15 — Observability`, which is unbuilt |
```

- [ ] **Step 3: Update the tracker's "Next up" W-5 bullet**

Replace it with:

```markdown
- ~~**`W-5` (deploy)**~~ — **complete 2026-08-11.** Live at
  `https://acp-dev-playbook.vercel.app`, and `pnpm test:prod` verifies the deployment itself.
  Automating that in CI is deferred: a push to `main` and a live build are not simultaneous.
```

- [ ] **Step 4: Add the command to `CLAUDE.md`**

In the commands block, after the `test:e2e` line:

```
pnpm test:prod    # playwright @smoke checks against the DEPLOYED site (docs/14)
```

And after the block's following paragraph, add:

```markdown
`pnpm test:prod` is not part of the pre-merge gate. It checks the deployed site, so a green
run says nothing about the working tree and a red one may have nothing to do with local
changes. Run it after a promotion to `main`.
```

- [ ] **Step 5: Update `KICKOFF.md`**

In the deploy bullet, append:

```markdown
  `pnpm test:prod` verifies the deployment itself — five `@smoke` checks covering what CI
  structurally cannot: the env-var-dependent `robots.txt` and `sitemap.xml`, whether the 19
  advertised URLs resolve, and the real edge's console.
```

- [ ] **Step 6: Run the gate and commit**

Run: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.

```bash
git add -A
git commit -m "$(cat <<'EOF'
docs(tracker): W-5 is complete — the deployment verifies itself

The last open item under W-5. pnpm test:prod is recorded with the rule that
scoped it: a check earns its place only by testing something a local or CI
build structurally cannot, which is why contrast and overflow stayed behind.

Three deferrals recorded rather than left as absences: no CI automation, since
a push to main and a live deployment are not simultaneous; no deployed-commit
check, since it needs a build-stamp surface the sitemap check largely
substitutes for; and no Sentry or latency baselines, which docs/14 asks for and
which belong to the unbuilt 15 — Observability.

CLAUDE.md says plainly that test:prod is not part of the pre-merge gate, since
a green run says nothing about the working tree.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification (after all tasks)

Run from `web/`. Every item is run, not reasoned about.

- [ ] `pnpm test:prod` — **5 passed** against the live site.
- [ ] `lsof -ti:3100 | xargs kill -9; sleep 1; pnpm test:e2e` — **14 passed**, unchanged.
- [ ] `pnpm test` — 331 passed, unchanged (this plan adds no unit tests).
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm format:check` — clean.
- [ ] `PROD_URL=https://acp-development-playbook.vercel.app pnpm test:prod` — **fails**, proving the suite reads the origin it is given rather than a constant.
- [ ] All six teeth checks executed, each failing test named, each revert confirmed.
- [ ] `git status --short` clean.
- [ ] `grep -rn "acp-dev-playbook" web/` returns exactly two files — `src/lib/site.ts` and `playwright.prod.ts` — and no more. A third means the origin is spreading.

**Watch for, and report rather than absorb:**

- **`pnpm test:e2e` reporting 15 tests.** Means `grepInvert` is not matching the `tag` option in this Playwright version. Fall back to a `@smoke` suffix in the test titles and say so — do not leave the smoke tests running against localhost.
- **Flake in the sitemap-resolution test.** Nineteen sequential requests against a CDN; if it flakes despite `retries: 2`, report the failure rate rather than raising retries again.
- **A red `test:prod` caused by infrastructure** rather than the site. Say which, explicitly. A smoke suite that cries wolf is one people stop reading, and that is the failure mode worth guarding.

# Quality Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tests, formatter, git hooks, a committed audit suite, and a CI gate for `web/`, resolving the ESLint-vs-Biome contradiction in ESLint's favour.

**Architecture:** Prettier joins ESLint (via `eslint-config-prettier`); Vitest covers the data layer with invariant tests; the session's throwaway browser audits become a `@playwright/test` suite running against a production build; Lefthook wires staged-file checks locally; one GitHub Actions workflow gates merges cheapest-first.

**Tech Stack:** Prettier 3, eslint-config-prettier, Vitest 4, @playwright/test 1.61, Lefthook 1, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-07-23-quality-gates-design.md`
**Branch:** `feat/quality-gates` (already exists, spec committed)

## Global Constraints

- All app commands run from `web/`; the git root is the repo root one level up.
- Prettier style matches the existing code: `singleQuote: true`, `semi: false`.
- The audit suite runs against `next build` + `next start` on port 3100, never `next dev`.
- Contrast checks resolve colours in-browser; anything `oklab()`-shaped is resolved to rgb via computed style, never regex-parsed (see `docs/learnings/stage-implementation-101.md`).
- TDD evidence for already-correct code = green run + teeth check (break source, watch only the new test fail, restore). Paste both outputs in the task report.
- Commit after every task. Do not push; the branch stays local until the user asks.
- Every commit carries the trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

## File Structure

```
.github/workflows/ci.yml          (new)  the merge gate
lefthook.yml                      (new)  git hooks, at the git root
web/.nvmrc                        (new)  "22"
web/.prettierrc                   (new)  format style
web/.prettierignore               (new)
web/vitest.config.ts              (new)  node env + @ alias
web/playwright.config.ts          (new)  webServer on :3100
web/e2e/audit.spec.ts             (new)  overflow / touch / contrast / console
web/src/lib/stages.test.ts        (new)
web/src/lib/terms.test.ts         (new)
web/package.json                  (mod)  scripts, packageManager, devDeps
web/eslint.config.mjs             (mod)  append prettier config
reference/stack.md                (mod)  ESLint+Prettier rows
docs/04-project-setup.md          (mod)  scaffold + linting section
CLAUDE.md, KICKOFF.md             (mod)  commands, no-test warning removed
docs/tracker.md, docs/task.md     (mod)  TD closes, decisions, statuses
```

---

### Task 1: Prettier + baseline format

**Files:**
- Create: `web/.prettierrc`, `web/.prettierignore`, `web/.nvmrc`
- Modify: `web/package.json` (scripts, packageManager), `web/eslint.config.mjs`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `pnpm format`, `pnpm format:check` scripts; a fully formatted tree later tasks build on

- [ ] **Step 1: Install**

```bash
cd web && pnpm add -D prettier eslint-config-prettier
```

- [ ] **Step 2: Write configs**

`web/.prettierrc`:
```json
{
  "singleQuote": true,
  "semi": false
}
```

`web/.prettierignore`:
```
.next
node_modules
pnpm-lock.yaml
```

`web/.nvmrc`:
```
22
```

- [ ] **Step 3: Add scripts + packageManager to `web/package.json`**

Replace the `"scripts"` block (currently lines 5–10) with:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "packageManager": "pnpm@10.33.0",
```

- [ ] **Step 4: Append prettier to `web/eslint.config.mjs`**

Replace the whole file with:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Turn off any ESLint rule that argues with Prettier. Must stay last.
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 5: Verify the checker fails before the baseline (RED)**

Run: `cd web && pnpm format:check`
Expected: FAIL — a list of unformatted files (at minimum `eslint.config.mjs`, configs, and any file prettier disagrees with). This is the failing state the baseline commit fixes.

- [ ] **Step 6: Format the tree (GREEN)**

```bash
cd web && pnpm format && pnpm format:check && pnpm lint && pnpm exec tsc --noEmit && pnpm build
```
Expected: `format:check` passes; lint, typecheck, build all green.

- [ ] **Step 7: Commit — configs and baseline separately**

```bash
git add web/.prettierrc web/.prettierignore web/.nvmrc web/package.json web/pnpm-lock.yaml web/eslint.config.mjs
git commit -m "build(web): add prettier + eslint-config-prettier, pin node and pnpm"
git add -A
git commit -m "style(web): prettier baseline — formatting only, no code changes"
```

---

### Task 2: Vitest + data-layer invariant tests

**Files:**
- Create: `web/vitest.config.ts`, `web/src/lib/stages.test.ts`, `web/src/lib/terms.test.ts`
- Modify: `web/package.json` (add `"test": "vitest run"` to scripts)

**Interfaces:**
- Consumes: `STAGES`, `STAGE_GROUPS`, `getStage`, `stagesByGroup` from `web/src/lib/stages.ts`; `TERMS`, `getTerm` from `web/src/lib/terms.ts`; `STAGE_CONTENT` from `web/src/features/stage-content.ts`
- Produces: `pnpm test` for Task 4's pre-push hook and Task 5's CI

- [ ] **Step 1: Install and configure**

```bash
cd web && pnpm add -D vitest
```

`web/vitest.config.ts`:
```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Mirrors tsconfig's "@/*" so importing STAGE_CONTENT (which pulls
    // component files) resolves.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

Add to `web/package.json` scripts, after `"lint"`:
```json
    "test": "vitest run",
```

- [ ] **Step 2: Write the stages tests**

`web/src/lib/stages.test.ts`:
```ts
import { describe, expect, test } from 'vitest'
import { STAGE_CONTENT } from '@/features/stage-content'
import { STAGES, STAGE_GROUPS, getStage, stagesByGroup } from './stages'

// These are the mistakes actually made while editing this file by hand:
// duplicated numbers, a slug that stopped matching its number, a stage
// flipped ready without being registered. W-3 edits it seventeen more times.

test('there are exactly 18 stages, because the playbook says so', () => {
  expect(STAGES).toHaveLength(18)
})

test('stage numbers are unique and zero-padded two digits', () => {
  const nums = STAGES.map((s) => s.num)
  expect(new Set(nums).size).toBe(18)
  for (const n of nums) expect(n).toMatch(/^\d{2}$/)
})

test('every slug is unique and starts with its own number', () => {
  const slugs = STAGES.map((s) => s.slug)
  expect(new Set(slugs).size).toBe(18)
  for (const s of STAGES) expect(s.slug.startsWith(`${s.num}-`)).toBe(true)
})

test('every stage carries a non-empty cadence, the title-block field', () => {
  for (const s of STAGES) expect(s.cadence.trim().length).toBeGreaterThan(0)
})

test('every group in STAGE_GROUPS has at least one stage', () => {
  for (const g of STAGE_GROUPS) {
    expect(stagesByGroup(g).length).toBeGreaterThan(0)
  }
})

test('stagesByGroup partitions all 18 stages with none lost or doubled', () => {
  const total = STAGE_GROUPS.flatMap((g) => stagesByGroup(g))
  expect(total).toHaveLength(18)
})

describe('getStage', () => {
  test('finds a stage by slug', () => {
    expect(getStage('01-product-discovery')?.title).toBe('Product Discovery')
  })
  test('returns undefined for an unknown slug instead of throwing', () => {
    expect(getStage('99-nope')).toBeUndefined()
  })
})

test('every ready stage is registered in STAGE_CONTENT, so no live route renders the placeholder', () => {
  for (const s of STAGES.filter((s) => s.ready)) {
    expect(STAGE_CONTENT[s.slug], `${s.slug} is ready but unregistered`).toBeDefined()
  }
})

test('every STAGE_CONTENT key is a real stage slug, so no dead registration lingers', () => {
  for (const key of Object.keys(STAGE_CONTENT)) {
    expect(getStage(key), `${key} registered but not a stage`).toBeDefined()
  }
})
```

- [ ] **Step 3: Write the terms tests**

`web/src/lib/terms.test.ts`:
```ts
import { expect, test } from 'vitest'
import { TERMS, getTerm } from './terms'

test('a known key returns its entry', () => {
  expect(getTerm('opportunity-solution-tree')?.short).toBeTruthy()
})

test('an unknown key returns undefined, because <Term> must degrade to plain text', () => {
  expect(getTerm('not-a-real-term')).toBeUndefined()
})

test('every term has a non-empty short and full definition', () => {
  for (const [key, t] of Object.entries(TERMS)) {
    expect(t.short.trim().length, `${key}.short`).toBeGreaterThan(0)
    expect(t.full.trim().length, `${key}.full`).toBeGreaterThan(0)
  }
})
```

- [ ] **Step 4: Run — expect GREEN (code already correct)**

Run: `cd web && pnpm test`
Expected: all tests pass. Paste the output.

- [ ] **Step 5: Teeth check — prove the tests bite**

In `web/src/lib/stages.ts`, temporarily change stage 01's `slug` to `'1-product-discovery'`. Run `pnpm test`.
Expected: exactly the slug test and the STAGE_CONTENT registration test fail; everything else passes. Restore the file, re-run, all green. Paste both outputs.

- [ ] **Step 6: Commit**

```bash
git add web/vitest.config.ts web/src/lib/stages.test.ts web/src/lib/terms.test.ts web/package.json web/pnpm-lock.yaml
git commit -m "test(web): vitest invariant tests over the stage and term data"
```

---

### Task 3: The audit suite

**Files:**
- Create: `web/playwright.config.ts`, `web/e2e/audit.spec.ts`
- Modify: `web/package.json` (swap `playwright` → `@playwright/test`, add `test:e2e`)

**Interfaces:**
- Consumes: the built app on `http://localhost:3100`
- Produces: `pnpm test:e2e` for Task 5's CI audit job

- [ ] **Step 1: Swap the dependency and add the script**

```bash
cd web && pnpm remove playwright && pnpm add -D @playwright/test
```

Add to scripts, after `"test"`:
```json
    "test:e2e": "playwright test",
```

- [ ] **Step 2: Write `web/playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
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
```

- [ ] **Step 3: Write `web/e2e/audit.spec.ts`**

```ts
import { expect, test } from '@playwright/test'

/**
 * The committed version of the audits that caught eleven bugs while stage 01
 * was built (docs/tracker.md, "Bugs found and fixed"). Four checks: overflow,
 * touch targets, contrast, console. Runs against a production build.
 */

const PAGES = [
  '/',
  '/stages/01-product-discovery#frame',
  '/stages/01-product-discovery#research',
  '/stages/01-product-discovery#ai',
  '/stages/01-product-discovery#talk',
  '/stages/01-product-discovery#decide',
  '/stages/01-product-discovery#record',
]

const WIDTHS = [320, 768, 1024, 1440, 2560]

// ── helpers ────────────────────────────────────────────────────────────────

function luminance([r, g, b]: number[]) {
  const lin = (c: number) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// ── overflow ───────────────────────────────────────────────────────────────

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px, because a field manual must never scroll sideways`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      const overflow = await page.evaluate(() => {
        const de = document.documentElement
        return de.scrollWidth - de.clientWidth
      })
      expect(overflow, `${path} @ ${width}px`).toBe(0)
    }
  })
}

// ── touch targets ──────────────────────────────────────────────────────────

test('interactive elements are at least 44px tall below lg', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
    const small = await page.evaluate(() => {
      const inScroller = (el: Element) => {
        let e = el.parentElement
        while (e) {
          const o = getComputedStyle(e).overflowX
          if (o === 'auto' || o === 'scroll') return true
          e = e.parentElement
        }
        return false
      }
      return [
        ...document.querySelectorAll('a,button,[role=tab],[role=radio],textarea'),
      ]
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return (
            b.width > 0 &&
            b.height > 0 &&
            b.height < 44 &&
            !String(el.className).includes('sr-only') &&
            !inScroller(el)
          )
        })
        .map((el) =>
          (el.textContent || el.getAttribute('aria-label') || '?').trim().slice(0, 30),
        )
    })
    expect(small, `${path}: ${small.join(', ')}`).toEqual([])
  }
})

// ── contrast ───────────────────────────────────────────────────────────────

for (const scheme of ['light', 'dark'] as const) {
  test(`every text/background pair passes WCAG AA in ${scheme} mode`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: scheme })
    const page = await context.newPage()
    const failures: string[] = []

    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      // Term definition panels are surfaces too; open them all first.
      await page.evaluate(() =>
        document
          .querySelectorAll<HTMLButtonElement>('button[aria-controls]')
          .forEach((b) => b.click()),
      )
      await page.waitForTimeout(150)

      const rows = await page.evaluate(() => {
        // Resolve any CSS colour (incl. oklab) to rgb via the browser itself —
        // regex-parsing oklab() produced a false 1.34:1 once. See
        // docs/learnings/stage-implementation-101.md.
        const parse = (c: string) => {
          const m = (c.match(/-?[\d.]+/g) || []).map(Number)
          return m.length >= 3 && !/okl|lab|lch/.test(c)
            ? { rgb: m.slice(0, 3), a: m[3] ?? 1 }
            : null
        }
        const out: {
          fg: number[]
          bg: number[]
          size: number
          weight: number
          sample: string
        }[] = []
        const seen = new Set<string>()
        for (const el of document.querySelectorAll('*')) {
          const t = el.textContent?.trim()
          if (!t || t.length < 3 || el.children.length) continue
          const cs = getComputedStyle(el)
          if (
            cs.visibility === 'hidden' ||
            cs.display === 'none' ||
            +cs.opacity < 0.5
          )
            continue
          const fg = parse(cs.color)
          if (!fg) continue
          let e: Element | null = el
          let bg: number[] | null = null
          while (e) {
            const c = parse(getComputedStyle(e).backgroundColor)
            if (c && c.a > 0.5) {
              bg = c.rgb
              break
            }
            e = e.parentElement
          }
          if (!bg) continue
          const key = `${fg.rgb}|${bg}|${Math.round(parseFloat(cs.fontSize))}`
          if (seen.has(key)) continue
          seen.add(key)
          out.push({
            fg: fg.rgb,
            bg,
            size: parseFloat(cs.fontSize),
            weight: parseInt(cs.fontWeight) || 400,
            sample: t.slice(0, 24),
          })
        }
        return out
      })

      for (const r of rows) {
        const large = r.size >= 24 || (r.size >= 18.66 && r.weight >= 700)
        const need = large ? 3 : 4.5
        const got = ratio(r.fg, r.bg)
        if (got < need)
          failures.push(
            `${path} ${got.toFixed(2)}:1 (need ${need}) @${Math.round(r.size)}px "${r.sample}"`,
          )
      }
    }

    await context.close()
    expect(failures, failures.join('\n')).toEqual([])
  })
}

// ── console ────────────────────────────────────────────────────────────────

test('zero console errors across every page and step', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 120))
  })
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
  }
  await context.close()
  expect(errors, errors.join('\n')).toEqual([])
})
```

- [ ] **Step 4: Install chromium and run — expect GREEN**

```bash
cd web && pnpm exec playwright install chromium && pnpm test:e2e
```
Expected: all tests pass (the app was verified with the ad-hoc versions of these same checks). Paste the output.

- [ ] **Step 5: Teeth check on the contrast test**

In `web/src/app/globals.css`, temporarily set light-mode `--faint: #556377` back to the old failing `#74849a` (both `:root` and `[data-theme='light']` blocks). Run `pnpm test:e2e --grep "light mode"`.
Expected: the light-mode contrast test fails naming real pairs. Restore, re-run, green. Paste both outputs.

- [ ] **Step 6: Commit**

```bash
git add web/playwright.config.ts web/e2e/audit.spec.ts web/package.json web/pnpm-lock.yaml
git commit -m "test(web): commit the browser audit suite — overflow, touch, contrast, console

The ad-hoc versions of these checks caught eleven real bugs during stage
01 (see docs/tracker.md). This closes TD-5: they are now repeatable."
```

---

### Task 4: Lefthook

**Files:**
- Create: `lefthook.yml` (repo root — hooks install into the git root)
- Modify: `web/package.json` (devDep + `prepare` script)

**Interfaces:**
- Consumes: `pnpm format`/`lint` (Task 1), `pnpm test` (Task 2)
- Produces: installed pre-commit and pre-push hooks

- [ ] **Step 1: Install**

```bash
cd web && pnpm add -D lefthook
```

- [ ] **Step 2: Write `lefthook.yml` at the repo root**

```yaml
# Git hooks. The app lives in web/, so every command roots there and
# receives only the staged files under it.
pre-commit:
  parallel: true
  commands:
    format:
      root: 'web/'
      glob: '*.{ts,tsx,mjs,css,json}'
      run: pnpm exec prettier --write {staged_files}
      stage_fixed: true
    lint:
      root: 'web/'
      glob: '*.{ts,tsx,mjs}'
      run: pnpm exec eslint {staged_files}

pre-push:
  commands:
    typecheck:
      root: 'web/'
      run: pnpm exec tsc --noEmit
    test:
      root: 'web/'
      run: pnpm test
```

- [ ] **Step 3: Add the prepare script and install hooks**

In `web/package.json` scripts, after `"test:e2e"`:
```json
    "prepare": "lefthook install",
```

Run: `cd web && pnpm exec lefthook install`
Expected: `sync hooks: ✔️ (pre-commit, pre-push)`.

- [ ] **Step 4: Teeth check — the hook rejects a bad commit**

```bash
cd web && printf 'const  x=1;;\n' > src/lib/hook-teeth.ts
git add src/lib/hook-teeth.ts && git commit -m "chore(TEMP): hook teeth check (revert after)"
```
Expected: prettier rewrites it (`stage_fixed`), then eslint FAILS the commit on the unused variable. Then clean up:
```bash
git restore --staged src/lib/hook-teeth.ts && rm src/lib/hook-teeth.ts
```
Paste the rejection output.

- [ ] **Step 5: Commit**

```bash
git add lefthook.yml web/package.json web/pnpm-lock.yaml
git commit -m "build: lefthook hooks — format+lint on commit, typecheck+test on push"
```

---

### Task 5: CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: every script from Tasks 1–3
- Produces: the required checks `verify` and `audit` for branch protection

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    working-directory: web

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          package_json_file: web/package.json
      - uses: actions/setup-node@v4
        with:
          node-version-file: web/.nvmrc
          cache: pnpm
          cache-dependency-path: web/pnpm-lock.yaml
      - run: pnpm install --frozen-lockfile
      # Cheapest failure first: format, lint, types, unit, build.
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm exec tsc --noEmit
      - run: pnpm test
      - run: pnpm build

  audit:
    needs: verify
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          package_json_file: web/package.json
      - uses: actions/setup-node@v4
        with:
          node-version-file: web/.nvmrc
          cache: pnpm
          cache-dependency-path: web/pnpm-lock.yaml
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: web/playwright-report/
          retention-days: 7
```

- [ ] **Step 2: Validate the workflow locally**

Run: `pnpm dlx @action-validator/cli .github/workflows/ci.yml || npx yaml-lint .github/workflows/ci.yml || python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/ci.yml')); print('yaml ok')"`
Expected: parses clean (any one of the three validators succeeding is enough).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: merge gate — format, lint, types, unit, build, then browser audit

Cheapest failure first per docs/11-ci-cd.md. The audit job runs the
committed Playwright suite against a production build and uploads the
report on failure."
```

---

### Task 6: Documentation reconciliation

**Files:**
- Modify: `reference/stack.md`, `docs/04-project-setup.md`, `CLAUDE.md`, `KICKOFF.md`, `docs/tracker.md`, `docs/task.md`

**Interfaces:**
- Consumes: everything shipped in Tasks 1–5
- Produces: docs that describe the repo as it now is

- [ ] **Step 1: `reference/stack.md` — replace the two Quality rows**

Replace:
```
| Linting & formatting | Biome | 2.x | One tool, one config, one pass. Replaces the ESLint + Prettier pair and their disagreements. |
| Git hooks | Lefthook | 1.x | Fast, single binary, config in one YAML file. |
```
with:
```
| Linting | ESLint (`eslint-config-next`) | 9.x | Next ships and maintains the config, and the react-hooks rule family has caught real bugs here that younger linters miss. |
| Formatting | Prettier | 3.x | Paired with `eslint-config-prettier` so the two never argue. |
| Git hooks | Lefthook | 1.x | Fast, single binary, config in one YAML file. |
```
And add under "When to deviate":
```
- **Biome** replaces the ESLint + Prettier pair with one faster binary and is a
  reasonable choice for projects that do not lean on the ESLint plugin
  ecosystem. On a Next.js app you would give up `eslint-config-next` and the
  react-hooks rules — the family that caught this repo's worst lint bug — for
  speed this size of project cannot feel.
```

- [ ] **Step 2: `docs/04-project-setup.md` — scaffold flag and section 3**

Change the scaffold command's `--eslint=false` to `--eslint`, and delete the sentence explaining it (`` `--eslint=false` because Biome replaces it (step 3). ``). Replace section `### 3. Linting and formatting` (the Biome install and `biome.json` block) with:

````markdown
### 3. Linting and formatting

`create-next-app` already wired ESLint with `eslint-config-next` — keep it. Its
react-hooks rules are the ones that catch real bugs (a setState-in-effect rule
found a cascading render in this playbook's own app). Add Prettier for
formatting, with the config that stops the two arguing:

```bash
pnpm add -D prettier eslint-config-prettier
```

`.prettierrc`:
```json
{
  "singleQuote": true,
  "semi": false
}
```

Append `eslint-config-prettier/flat` last in `eslint.config.mjs`, and add
`format` / `format:check` scripts. One tool lints, one tool formats, and
neither owns the other's job.
````

- [ ] **Step 3: `CLAUDE.md` — commands and the stale warning**

Replace the Commands code block and the warning under it:
```markdown
```bash
pnpm dev          # dev server on :3000 (Turbopack)
pnpm build        # production build; prerenders all 22 routes
pnpm lint         # eslint
pnpm format       # prettier --write (format:check in CI)
pnpm test         # vitest — data-layer invariant tests
pnpm test:e2e     # playwright audit suite against a production build on :3100
pnpm exec tsc --noEmit   # typecheck
```

Lefthook runs format+lint on commit and typecheck+test on push. CI
(`.github/workflows/ci.yml`) is the same gate, cheapest-first, plus the audit
suite.
```
Also update the "Verification expectations" section: replace "These scripts are currently written ad hoc and thrown away (TD-5)." with "These checks live in `web/e2e/audit.spec.ts` and run in CI; the cautions below still apply when extending them." Update the "Known contradiction" section to state it was resolved (ESLint kept, docs amended, TD-1 closed) rather than open.

- [ ] **Step 4: `KICKOFF.md` — environment notes**

Replace the line `` **There is no `pnpm test` yet.** `` with `` `pnpm test` (vitest) and `pnpm test:e2e` (playwright audit suite) exist; lefthook hooks run on commit and push. `` Remove W-4 from "This round's scope" candidates and the TD-4/TD-5/TD-6 "largest inconsistency" bullet from *Project state* (now closed).

- [ ] **Step 5: Correct `web/PATTERNS.md`'s quote caution**

Planning this round exposed an error: five term definitions legitimately contain
straight double quotes, and they are harmless — definitions render as text content.
The JSX-attribute hazard is real only for `Figure` captions. Replace, in the `Term`
section:

```
and definitions are `full` strings, so a
double-quote inside one breaks the attribute — use typographic quotes.
```
with:
```
Straight quotes inside
definitions are fine (they render as text); the JSX-attribute hazard applies to
`Figure` captions, where a straight double quote breaks the attribute — use
typographic quotes there.
```

- [ ] **Step 6: `docs/tracker.md` and `docs/task.md`**

- tracker: close TD-1, TD-4, TD-5, TD-6, TD-8 (strike-through style like TD-7, each citing the closing commit); add decisions `D-22` (ESLint kept over Biome — react-hooks caught a real bug here; Biome documented as non-Next alternative) and `D-23` (audit suite is a committed Playwright suite run in CI against a prod build); add a W-4 completed row with test counts and SHAs; update *Current phase* and *Next up* (next: W-3 stage 03, or W-5 deploy).
- task: mark `W-4` ☑ and `P-5` ☑ in the milestone tables; check off the W-4 and P-5 task-detail checklists (branch protection item noted as "GitHub-side, after push: require `verify` + `audit`, up-to-date branches").

- [ ] **Step 7: Verify every doc claim, then commit**

Run: `cd web && pnpm format:check && pnpm lint && pnpm test && pnpm build` — all green (final whole-tree sanity).
Check: every command named in CLAUDE.md exists in `web/package.json` scripts; no doc still says "no test suite".

```bash
git add reference/stack.md docs/04-project-setup.md CLAUDE.md KICKOFF.md docs/tracker.md docs/task.md
git commit -m "docs: resolve TD-1 in ESLint's favour, close the quality-gate debts

ESLint stays: its react-hooks rule family caught this repo's worst lint
bug, and Next ships the config. Biome documented as the alternative for
projects off the ESLint plugin ecosystem. stack.md and doc 04 now match
the app; CLAUDE.md and KICKOFF.md describe the real commands; TD-1/4/5/6/8
closed with evidence; D-22 and D-23 recorded."
```

---

## Verification (after all tasks)

1. From `web/`: `pnpm format:check && pnpm lint && pnpm exec tsc --noEmit && pnpm test && pnpm build && pnpm test:e2e` — all green in one run.
2. Hook evidence exists: a rejected commit (Task 4 step 4) and both teeth-check outputs (Tasks 2, 3).
3. `git log --oneline main..HEAD` shows the spec, plan, and one commit per task.
4. After the user pushes: CI green on the branch; then branch protection on GitHub → require `verify` + `audit`, require branches up to date. Then, per `docs/11-ci-cd.md`, push a deliberately broken commit on a scratch branch once and watch CI go red before trusting it.

# Checks that cannot fail — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close TD-32, TD-27, TD-26 and TD-35, four High-severity debts that share one shape: a check that reports success without evaluating the thing it names.

**Architecture:** One doc correction with a data test behind it (TD-32); a build-freshness gate in Playwright's `globalSetup` built on a pure, unit-tested module (TD-27); the audit's one-shot expand replaced by a sequence of DOM states plus a property that fails when the sweep stops opening things (TD-26); and a second, narrow Playwright config running against `pnpm dev` so React's development warnings have somewhere to be caught (TD-35).

**Tech Stack:** Next 16, TypeScript, Vitest 4 (projects `unit` / `dom`), Playwright, Tailwind 4.

**Spec:** `docs/superpowers/specs/2026-08-20-checks-that-cannot-fail-design.md`

## Global constraints

- Branch is `fix/checks-that-cannot-fail`, cut from `develop`. It merges to `develop` and only when the user says so. Never to `main`.
- TDD is not optional. Every task writes the failing test first, runs it, and pastes the raw RED output into its report with a statement of why that failure was the right one.
- Every assertion this branch adds is teeth-checked: break the implementation, confirm that test and only that test fails, restore. A round about vacuous checks does not get to ship one.
- Commit trailer on every commit: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
- Conventional Commits, `type(scope): subject`, lowercase after the colon. Scopes in use here: `setup` (stage 04), `e2e`, `a11y`, `docs`, `tracker`, `task`, `spec`, `plan`.
- All `pnpm` commands run from `web/`. The repo root holds `docs/`, `reference/` and the records.
- Cite doc sections by heading, never by line number (D-42).
- Never hand-edit `reference/glossary.md` or `reference/cheatsheets.md`; both are generated.
- `pnpm typecheck` runs `next typegen` first. A bare `tsc --noEmit` passes locally off a stale `.next` and fails in CI.

## File structure

| File | Responsibility | Task |
|---|---|---|
| `docs/verification/td-32-env-restart.md` | Evidence that the 200-vs-500 behaviour reproduces | 1 |
| `docs/04-project-setup.md` | §5 gains the restart paragraph | 2 |
| `web/src/features/setup/artifacts.ts` | The `env` artifact's parse-line note gains the same reason | 2 |
| `web/src/features/setup/env-restart.test.ts` | Holds doc and app to it | 2 |
| `web/src/test/build-freshness.ts` | Pure freshness logic: newest source mtime, build-id presence | 3 |
| `web/src/test/build-freshness.test.ts` | Unit tests for the above | 3 |
| `web/e2e/global-setup.ts` | Runs the freshness check before the suite measures anything | 4 |
| `web/playwright.config.ts` | Wires `globalSetup`, excludes `@dev` | 4, 7 |
| `web/e2e/panel-states.ts` | Drives a step panel through every distinct open-state | 5 |
| `web/e2e/audit.spec.ts` | Contrast, touch targets and the new sweep-coverage property | 5, 6 |
| `web/e2e/count-expandables.mjs` | Its loop mirrors the sweep and moves with it | 5 |
| `web/playwright.dev.ts` | Dev-server config for the console spec | 7 |
| `web/e2e/dev-console.spec.ts` | React development warnings, tagged `@dev` | 7 |
| `web/package.json` | `test:dev-console` script | 7 |
| `docs/tracker.md`, `docs/task.md`, `CLAUDE.md`, `KICKOFF.md`, `docs/learnings/quality-gates-101.md` | Records | 8 |

---

### Task 1: Reproduce TD-32's mechanism before writing about it

TD-32's 200-vs-500 behaviour is recorded from stage 04's fix wave and has never been re-run. The tracker entry says so itself: *"Observed there and not re-run for this entry, which is why the restart is stated as the fix rather than as the only fix."* This round is about checks that cannot fail, so it does not get to write a verification ritual into a document on the strength of an assertion.

`web/` has no `env.ts` and no required environment variables, so the reproduction needs a throwaway scaffold. It is throwaway: it lives in the scratchpad and is never committed. Only the evidence file is committed.

**Files:**
- Create: `docs/verification/td-32-env-restart.md`
- Throwaway (do not commit): a scaffold under the session scratchpad directory

**Interfaces:**
- Produces: the two observed HTTP statuses and the exact error text, which Task 2's paragraph quotes.

- [ ] **Step 1: Scaffold a minimal Next app in the scratchpad**

```bash
cd "$SCRATCHPAD"
pnpm create next-app@latest env-probe --ts --app --no-eslint --no-tailwind --no-src-dir --use-pnpm --turbopack --import-alias '@/*'
cd env-probe
pnpm add zod
```

- [ ] **Step 2: Add the `env.ts` from stage 04 §5 and import it from the page**

```ts
// lib/env.ts
import { z } from 'zod'

const schema = z.object({
  SESSION_SECRET: z.string().min(32),
})

export const env = schema.parse(process.env)
```

```tsx
// app/page.tsx
import { env } from '@/lib/env'

export default function Home() {
  return <p>secret length: {env.SESSION_SECRET.length}</p>
}
```

```bash
printf 'SESSION_SECRET=%s\n' "$(openssl rand -base64 32)" > .env.local
```

- [ ] **Step 3: Start the dev server and record the healthy status**

```bash
pnpm dev -p 3399 &
sleep 8
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3399/
```

Expected: `200`. Record it.

- [ ] **Step 4: Blank the variable with the server still running, and record what happens**

```bash
printf 'SESSION_SECRET=\n' > .env.local
sleep 3
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3399/
```

Expected per TD-32: `200`, with the server log carrying `Reload env: .env.local`. **Record whatever actually happens, including if it contradicts the entry.** A result that disproves TD-32 is a finding, not a failure, and it changes Task 2's paragraph rather than being written around.

- [ ] **Step 5: Restart the server against the same blanked file, and record the status and error**

```bash
kill %1
pnpm dev -p 3399 &
sleep 8
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3399/
curl -s http://localhost:3399/ | grep -o 'too_small[^<]*' | head -1
```

Expected per TD-32: `500`, carrying Zod's `too_small`.

- [ ] **Step 6: Write the evidence file**

Create `docs/verification/td-32-env-restart.md` with: the Next and Zod versions used, the four measurements in a table (running/blanked, running/restarted), the raw error text, the date, and one sentence saying whether the tracker's account held. Follow the shape of `docs/verification/stage-04-doc-execution.md`.

- [ ] **Step 7: Tear down the scaffold**

```bash
kill %1 2>/dev/null
rm -rf "$SCRATCHPAD/env-probe"
```

- [ ] **Step 8: Commit**

```bash
git add docs/verification/td-32-env-restart.md
git commit -m "docs(setup): re-run TD-32's env-validation check rather than quoting it"
```

---

### Task 2: TD-32 — teach the restart, and the reason for it

**Files:**
- Modify: `docs/04-project-setup.md`, section `### 5. Environment variables, validated at boot`
- Modify: `web/src/features/setup/artifacts.ts`, the `env` artifact's final line note
- Create: `web/src/features/setup/env-restart.test.ts`

**Interfaces:**
- Consumes: `docSource` helpers already re-exported by `web/src/features/setup/doc-source.ts` as `{ DOC, section, h2, flat, fences }`.
- Consumes: Task 1's measured statuses and error text.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the failing test**

Create `web/src/features/setup/env-restart.test.ts`:

```ts
import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'
import { flat, section } from './doc-source'

const S5 = flat(section('5. Environment variables, validated at boot'))

/**
 * TD-32. §5's promise is that a missing variable stops the app, and the check a
 * reader will reach for — blank the value with `pnpm dev` still running — cannot
 * fail: Turbopack keeps serving the cached module and returns 200. A reader who
 * checks that way concludes the validation is wired when the only thing proved
 * is that a module was cached.
 */
test('§5 tells the reader to restart before re-testing the validation', () => {
  expect(S5).toMatch(/restart/i)
})

/**
 * The reason is the transferable half and the entry insists on it: the cheap
 * phrasing ("restart after editing `.env.local`") teaches a ritual that dies
 * with Turbopack. Assert the mechanism, not the word.
 */
test('§5 gives the reason, not just the ritual, since a ritual does not survive a change of bundler', () => {
  expect(S5).toMatch(/module evaluation/i)
})

/**
 * Both observed outcomes, so a reader knows which result means what. Without
 * the 200 the paragraph reads as a tip; with it, it names the false pass.
 */
test('§5 names both outcomes, because the passing one is the misleading one', () => {
  expect(S5).toMatch(/\b200\b/)
  expect(S5).toMatch(/\b500\b/)
})

/**
 * The app is hand-ported from the doc, and a correction that lands in one and
 * not the other is how the two drift. `env`'s last line is where module
 * evaluation happens, so the note belongs on it rather than in a new panel.
 */
test('the env artifact carries the same reason on the line that evaluates the module', () => {
  const parseLine = ARTIFACTS.env.lines.find((l) =>
    l.text.includes('schema.parse(process.env)'),
  )
  expect(parseLine?.note).toMatch(/restart/i)
  expect(parseLine?.note).toMatch(/module evaluation/i)
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd web && pnpm vitest run src/features/setup/env-restart.test.ts
```

Expected: four failures. The first three fail because §5 contains no `restart`, no `module evaluation` and neither status code; the fourth fails because the `env` artifact's parse-line note is about client components, not about re-testing. Paste the raw output. Confirm the failure is absence of the material, not a broken `section()` call: if `section()` throws `no level-3 section "..."`, the heading string is wrong and the test is measuring nothing.

- [ ] **Step 3: Write the paragraph into `docs/04-project-setup.md` §5**

Insert after the `NODE_ENV` paragraph and before the paragraph beginning `That pair, a schema of keys you can actually set`. Use Task 1's measured values; the numbers below are TD-32's and must be replaced if Task 1 measured otherwise.

```markdown
One thing to know before you test it, because the obvious test cannot fail. Blank
`SESSION_SECRET` in `.env.local` with `pnpm dev` still running and the page keeps
returning **200**. Turbopack logs `Reload env: .env.local` and goes on serving the
module it already evaluated. Restart the server against the same blanked file and
you get **HTTP 500**, carrying the Zod `too_small` thrown from `env.ts`. The second
result is the one that proves the schema is wired; the first proves only that a
module was cached.

The reason outlives the bundler, which is why it is worth more than the
instruction: `schema.parse(process.env)` runs once, when the module is first
evaluated, so the only way to re-test it is to cause another module evaluation.
Any check that does not restart something is reading a cached answer.
```

- [ ] **Step 4: Move the note onto the `env` artifact's parse line**

In `web/src/features/setup/artifacts.ts`, the `env` artifact's last line is:

```ts
{
  text: 'export const env = schema.parse(process.env)',
  note: "Import `env` everywhere instead of `process.env` — in server modules only, never in a `'use client'` file. `schema.parse(process.env)` is not a static read, so the browser gets an empty object and every key fails at once, on hydration, after a green build.",
},
```

Append to that `note` string, keeping the existing sentences intact:

```
 It also runs exactly once, at module evaluation. Blank a value with `pnpm dev` running and the page still returns 200 off the cached module; restart and it returns 500. Re-testing this validation means causing another module evaluation, whatever the bundler.
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd web && pnpm vitest run src/features/setup/env-restart.test.ts
```

Expected: 4 passed.

- [ ] **Step 6: Teeth-check both halves**

```bash
cd web
# Remove the word "restart" from the doc paragraph only.
# Expect: the §5 restart test and no other test fails.
pnpm vitest run src/features/setup/
# Restore, then blank the appended sentence on the artifact note.
# Expect: the artifact test and no other test fails.
pnpm vitest run src/features/setup/
```

Restore both. Paste both failure outputs into the report. A teeth check that reaches zero failures, or that fails more tests than the one being checked, has not proved what it claims.

- [ ] **Step 7: Run the wider gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 8: Commit**

```bash
git add docs/04-project-setup.md web/src/features/setup/artifacts.ts web/src/features/setup/env-restart.test.ts
git commit -m "fix(setup): close TD-32, a check §5 handed the reader that cannot fail"
```

---

### Task 3: TD-27 — the freshness logic, as a pure module with tests

The assertion has two parts and both are pure functions over a filesystem and a string, which is what makes them testable without a browser. Task 4 wires them.

**Files:**
- Create: `web/src/test/build-freshness.ts`
- Create: `web/src/test/build-freshness.test.ts`

**Interfaces:**
- Produces, for Task 4:
  - `newestSourceMtime(roots: string[]): { path: string; mtimeMs: number } | null`
  - `servedCarriesBuildId(html: string, buildId: string): boolean`
  - `hintServedBuildId(html: string): string | null`
  - `checkBuildFreshness(opts: { html: string; buildId: string; buildIdMtimeMs: number; roots: string[] }): string | null` — returns a human-readable failure message, or `null` when the served build is both the one on disk and newer than every source file.

- [ ] **Step 1: Write the failing test**

Create `web/src/test/build-freshness.test.ts`:

```ts
import { mkdtempSync, utimesSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import {
  checkBuildFreshness,
  hintServedBuildId,
  newestSourceMtime,
  servedCarriesBuildId,
} from './build-freshness'

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'freshness-'))
  mkdirSync(join(root, 'src'))
  mkdirSync(join(root, 'node_modules'))
  writeFileSync(join(root, 'src', 'a.ts'), 'a')
  writeFileSync(join(root, 'node_modules', 'huge.js'), 'x')
  return root
}

function setMtime(path: string, seconds: number) {
  utimesSync(path, seconds, seconds)
}

test('newestSourceMtime reports the newest file and names it, since the message is what makes the failure actionable', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  const newest = newestSourceMtime([join(root, 'src')])
  expect(newest?.path).toContain('a.ts')
  expect(newest?.mtimeMs).toBe(1000 * 1000)
})

test('newestSourceMtime ignores node_modules, whose mtimes say nothing about the working tree', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  setMtime(join(root, 'node_modules', 'huge.js'), 9000)
  const newest = newestSourceMtime([root])
  expect(newest?.path).toContain('a.ts')
})

test('servedCarriesBuildId is false for a page from a different build, which is the hand-started-server case', () => {
  expect(servedCarriesBuildId('...\\"b\\":\\"abc123\\"...', 'abc123')).toBe(true)
  expect(servedCarriesBuildId('...\\"b\\":\\"abc123\\"...', 'zzz999')).toBe(false)
})

test('hintServedBuildId pulls the id out of the flight payload so the message can name what was actually served', () => {
  expect(hintServedBuildId('x\\"b\\":\\"g2-pemUBl9fqzpomy2WPn\\"y')).toBe(
    'g2-pemUBl9fqzpomy2WPn',
  )
  expect(hintServedBuildId('nothing here')).toBe(null)
})

test('checkBuildFreshness passes when the served build is the one on disk and newer than every source file', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  expect(
    checkBuildFreshness({
      html: 'x\\"b\\":\\"abc\\"y',
      buildId: 'abc',
      buildIdMtimeMs: 2000 * 1000,
      roots: [join(root, 'src')],
    }),
  ).toBe(null)
})

test('checkBuildFreshness fails when a source file is newer than the build, which is TD-27 exactly', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 3000)
  const msg = checkBuildFreshness({
    html: 'x\\"b\\":\\"abc\\"y',
    buildId: 'abc',
    buildIdMtimeMs: 2000 * 1000,
    roots: [join(root, 'src')],
  })
  expect(msg).toContain('a.ts')
  expect(msg).toMatch(/newer than/i)
})

test('checkBuildFreshness fails when the served page is from another build, and names both ids', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  const msg = checkBuildFreshness({
    html: 'x\\"b\\":\\"served-one\\"y',
    buildId: 'on-disk-one',
    buildIdMtimeMs: 2000 * 1000,
    roots: [join(root, 'src')],
  })
  expect(msg).toContain('on-disk-one')
  expect(msg).toContain('served-one')
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd web && pnpm vitest run src/test/build-freshness.test.ts
```

Expected: FAIL with `Failed to resolve import "./build-freshness"`, which is an unresolved import rather than a failed assertion, because the module does not exist yet. Paste the raw output.

- [ ] **Step 3: Write the implementation**

Create `web/src/test/build-freshness.ts`:

```ts
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * TD-27. `playwright.config.ts` sets `reuseExistingServer: !process.env.CI`
 * against a `pnpm build && pnpm start` command, so the first run of a session
 * builds and every run after it reuses that server without rebuilding. A
 * session that runs the suite after each of eight tasks measures the first
 * task's build eight times, and the failure is silent and green: the numbers
 * look plausible and describe a tree that no longer exists. It cost the
 * doc-gaps round two panels sitting over threshold for five tasks.
 *
 * Reusing a server is what makes local iteration bearable, so the fix is not to
 * stop reusing it. It is to notice.
 *
 * Two questions, because either one alone leaves a hole. *Is this the build on
 * disk?* catches a `pnpm start` someone left running by hand, which no config
 * flag can see. *Is that build newer than the source?* catches the actual TD-27
 * failure, where nothing rebuilt because the server was already up.
 *
 * Pure on purpose: everything here takes a string or a path and returns a
 * value, so it is unit-testable without a browser or a build.
 */

/**
 * Directories whose mtimes say nothing about the working tree. `.next` is
 * excluded because it *is* the build, and including it would make the
 * comparison trivially true — a check that cannot fail, in the module written
 * to stop them.
 */
const IGNORED = new Set([
  '.next',
  'node_modules',
  'test-results',
  'playwright-report',
  '.turbo',
  '.git',
])

export function newestSourceMtime(
  roots: string[],
): { path: string; mtimeMs: number } | null {
  let newest: { path: string; mtimeMs: number } | null = null

  const consider = (path: string, mtimeMs: number) => {
    if (!newest || mtimeMs > newest.mtimeMs) newest = { path, mtimeMs }
  }

  const walk = (dir: string) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (IGNORED.has(entry.name)) continue
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.isFile()) consider(full, statSync(full).mtimeMs)
    }
  }

  for (const root of roots) {
    let stat
    try {
      stat = statSync(root)
    } catch {
      continue
    }
    if (stat.isDirectory()) walk(root)
    else consider(root, stat.mtimeMs)
  }

  return newest
}

/**
 * Next puts the build id in the RSC flight payload as `"b":"<id>"`. Asserting
 * containment rather than parsing that shape keeps the check working when the
 * payload changes; the parse below is only for the error message.
 */
export function servedCarriesBuildId(html: string, buildId: string): boolean {
  return html.includes(buildId)
}

/** Best effort, for the failure message only. Never gate on this. */
export function hintServedBuildId(html: string): string | null {
  const m = html.match(/\\?"b\\?":\\?"([A-Za-z0-9_-]{8,})\\?"/)
  return m ? m[1] : null
}

export function checkBuildFreshness(opts: {
  html: string
  buildId: string
  buildIdMtimeMs: number
  roots: string[]
}): string | null {
  if (!servedCarriesBuildId(opts.html, opts.buildId)) {
    const served = hintServedBuildId(opts.html) ?? 'unknown'
    return (
      `The server on this port is not serving the build in .next. ` +
      `.next/BUILD_ID is "${opts.buildId}"; the served page carries "${served}". ` +
      `Something else is listening — most likely a "pnpm start" left running ` +
      `from an earlier build. Kill it and let the suite start its own.`
    )
  }

  const newest = newestSourceMtime(opts.roots)
  if (newest && newest.mtimeMs > opts.buildIdMtimeMs) {
    return (
      `The served build predates the working tree (TD-27). ` +
      `${newest.path} is newer than .next/BUILD_ID, so this run would measure ` +
      `an earlier build and report plausible numbers about a tree that no ` +
      `longer exists. Stop the reused server on this port and run again, or ` +
      `run "pnpm build" first.`
    )
  }

  return null
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd web && pnpm vitest run src/test/build-freshness.test.ts
```

Expected: 7 passed.

- [ ] **Step 5: Teeth-check the ignore list**

Delete `'node_modules'` from `IGNORED`, re-run. Expected: the node_modules test and only that test fails. Restore. Paste the output. This one matters more than it looks: an ignore list that ignores nothing still passes every other test in the file.

- [ ] **Step 6: Commit**

```bash
git add web/src/test/build-freshness.ts web/src/test/build-freshness.test.ts
git commit -m "test(e2e): add the freshness logic TD-27 closes with, as a pure module"
```

---

### Task 4: TD-27 — wire the freshness check ahead of the suite

**Files:**
- Create: `web/e2e/global-setup.ts`
- Modify: `web/playwright.config.ts`

**Interfaces:**
- Consumes: `checkBuildFreshness` from `web/src/test/build-freshness.ts` (Task 3).
- Produces: a `globalSetup` that throws before any test runs.

- [ ] **Step 1: Establish the ordering empirically, before writing anything that depends on it**

The design assumes Playwright starts `webServer` before running `globalSetup`. Do not assume it. Write a throwaway `web/e2e/global-setup.ts` that only logs, wire it into the config, and run one test:

```ts
export default async function globalSetup() {
  const res = await fetch('http://localhost:3100/').catch((e) => e)
  console.log('[ordering probe] fetch result:', res?.status ?? String(res))
}
```

```bash
cd web && pnpm exec playwright test e2e/audit-pages.spec.ts --reporter=line
```

If it logs a status, `webServer` runs first and the design holds. If it logs a connection error, **stop and report it** — the fallback is a dedicated spec other audit tests depend on, and that is a design change the controller decides, not the implementer.

- [ ] **Step 2: Write the failing test**

There is no assertion to write in vitest here; the deliverable is the gate itself, and its RED is observable directly. Produce the failure first:

```bash
cd web
pnpm build
pnpm start -p 3100 &
sleep 5
touch src/lib/stages.ts          # a source edit with no rebuild — TD-27 exactly
```

Leave that server running for Step 4.

- [ ] **Step 3: Write the implementation**

Replace `web/e2e/global-setup.ts` with:

```ts
import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { checkBuildFreshness } from '../src/test/build-freshness'

/**
 * Runs before the suite measures anything, so a stale server fails loudly
 * instead of producing numbers about a tree that no longer exists (TD-27).
 *
 * Under CI `reuseExistingServer` is already false, so the build is always fresh
 * and this always passes. That makes CI the place this check is least useful
 * and the place it is most likely to be mistaken for coverage — it earns its
 * keep locally or not at all, and it was teeth-checked locally against a
 * genuinely stale server before it was believed.
 */
const web = (rel: string) => fileURLToPath(new URL(`../${rel}`, import.meta.url))

export default async function globalSetup() {
  const buildIdPath = web('.next/BUILD_ID')

  const buildId = readFileSync(buildIdPath, 'utf8').trim()
  const buildIdMtimeMs = statSync(buildIdPath).mtimeMs

  const res = await fetch('http://localhost:3100/')
  const html = await res.text()

  const problem = checkBuildFreshness({
    html,
    buildId,
    buildIdMtimeMs,
    roots: [
      web('src'),
      web('e2e'),
      web('playwright.config.ts'),
      web('next.config.ts'),
      web('package.json'),
    ],
  })

  if (problem) throw new Error(problem)
}
```

Wire it in `web/playwright.config.ts` by adding one key to the config object:

```ts
  globalSetup: './e2e/global-setup.ts',
```

- [ ] **Step 4: Run it against the stale server from Step 2 and verify it fails for the right reason**

```bash
cd web && pnpm exec playwright test e2e/audit-pages.spec.ts --reporter=line
```

Expected: the run aborts in globalSetup with `The served build predates the working tree (TD-27)` naming `src/lib/stages.ts`. Paste the raw output. A failure naming a missing `.next/BUILD_ID` instead means the build did not run, which is a different problem and does not count as RED for this.

- [ ] **Step 5: Rebuild and verify it goes green**

```bash
cd web
lsof -ti:3100 | xargs kill -9
pnpm exec playwright test e2e/audit-pages.spec.ts --reporter=line
```

Expected: PASS.

- [ ] **Step 6: Teeth-check the identity half separately**

The freshness half fired in Step 4. The identity half has not. Prove it:

```bash
cd web
pnpm build && pnpm start -p 3100 &   # server from build A
sleep 5
touch src/lib/stages.ts && pnpm build   # build B on disk, server still serving A
pnpm exec playwright test e2e/audit-pages.spec.ts --reporter=line
```

Expected: failure naming both build ids and the leftover `pnpm start`. Then kill the server and confirm green. Paste both. If this passes when it should fail, the identity check is decorative and the task is not done.

- [ ] **Step 7: Commit**

```bash
git add web/e2e/global-setup.ts web/playwright.config.ts
git commit -m "fix(e2e): close TD-27, the second test:e2e of a session measured a stale build"
```

---

### Task 5: TD-26 — the sweep becomes a state sequence, and gains a property

Three of TD-26's four open items follow from `openExpandables` opening everything in one pass and the checks measuring the result once: a single-open accordion group cannot be exhausted (clicking one closes the last), and `AuthPaths`' inner tabs use `aria-selected` rather than `aria-expanded` so two of its three panels are never opened at all.

**Files:**
- Create: `web/e2e/panel-states.ts`
- Modify: `web/e2e/audit.spec.ts` (replace `openExpandables`, lines 27–66; call sites in the touch-target test and both contrast tests; add the coverage property)
- Modify: `web/e2e/count-expandables.mjs` (its loop mirrors the sweep by design and its header says to move them together)

**Interfaces:**
- Produces, for the audit tests:
  - `forEachPanelState(page: Page, visit: () => Promise<void>): Promise<{ all: string[]; observed: string[] }>` — drives the current step panel through each distinct open-state, awaiting `visit()` in each, and reports every disclosure key it saw and which of them it observed open.

**Scope note for the reviewer:** the selector stays scoped to `[role=tabpanel]`. That was checked rather than assumed — the only `role="tabpanel"` in the app comes from `Stepper.tsx:149` and `AuthPaths.tsx:127`, and the reference sheets render no disclosures at all (`src/app/reference/[slug]/page.tsx` renders `CheatsheetView`, and the only `aria-expanded` outside a panel is `Sidebar.tsx:64`'s mobile drawer). So the twelve reference URLs sweep nothing today and that is correct, not a fifth hole.

- [ ] **Step 1: Write the failing test**

Add to `web/e2e/audit.spec.ts`, after the `openExpandables` helper is replaced in Step 3. Write it now, watch it fail, then implement:

```ts
/**
 * The test of the test (TD-26).
 *
 * The contrast gate spent three stages measuring one surface per stage while
 * reporting a clean pass: it opened expandables by clicking every
 * `button[aria-controls]`, and `Stepper` puts that attribute on all the rail
 * tabs, so the loop walked the rail and unmounted the panel it was about to
 * measure. Nothing noticed, because a sweep that opens nothing produces the
 * same green as a sweep that opens everything and finds no failures.
 *
 * TD-26's entry asks for a pinned count on a known page. That was rejected on
 * this repo's own evidence: `e2e/count-expandables.mjs` records 108 on
 * 2026-08-03 and 140 on 2026-08-13 with no defect in between, and says in its
 * header that the number is not a constant to assert against. A pinned count
 * stales the way a step name in prose stales, and the staling is silent.
 *
 * The property does not stale. Every disclosure the panel renders must be
 * observed open in at least one state, however many there are.
 */
test('the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass', async ({
  page,
}) => {
  const gaps: string[] = []

  for (const path of await auditPages(page)) {
    await page.goto(path, { waitUntil: 'networkidle' })
    const { all, observed } = await forEachPanelState(page, async () => {})
    const missed = all.filter((key) => !observed.includes(key))
    if (missed.length) gaps.push(`${path}: ${missed.join(', ')}`)
  }

  expect(gaps, gaps.join('\n')).toEqual([])
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
cd web && pnpm exec playwright test e2e/audit.spec.ts -g "observes every disclosure" --reporter=line
```

Expected: FAIL with `Cannot find name 'forEachPanelState'` or an unresolved import, because the module does not exist. That is the right RED for this step; the assertion failure comes later and is not what is being proved here.

- [ ] **Step 3: Write the implementation**

Create `web/e2e/panel-states.ts`:

```ts
import type { Page } from '@playwright/test'

/**
 * Disclosures inside the current step panel, in both the forms this app uses.
 *
 * `aria-expanded` covers `RevealList`, `TeamNotes` and `Term`. `aria-selected`
 * covers `AuthPaths`' inner tabs, which the old sweep never touched — two of
 * its three auth panels had never been contrast-checked (TD-26). Both carry
 * `aria-controls`, which is what makes one key work for both.
 */
const DISCLOSURE =
  '[role=tabpanel] button[aria-expanded], [role=tabpanel] [role=tab][aria-selected]'

type Snapshot = { all: string[]; open: string[] }

async function snapshot(page: Page): Promise<Snapshot> {
  return page.evaluate((sel) => {
    const nodes = [...document.querySelectorAll(sel)]
    const key = (n: Element) => n.getAttribute('aria-controls')
    const isOpen = (n: Element) =>
      n.getAttribute('aria-expanded') === 'true' ||
      n.getAttribute('aria-selected') === 'true'
    const keys = (list: Element[]) =>
      list.map(key).filter((k): k is string => Boolean(k))
    return { all: keys(nodes), open: keys(nodes.filter(isOpen)) }
  }, DISCLOSURE)
}

/**
 * Open as much as can be open at once. Re-queried between passes, because
 * opening one accordion reveals more of them, and marked, because clicking a
 * closed button in a single-open group closes its sibling and an unmarked
 * re-query oscillates instead of terminating. The pass cap is a backstop, not
 * the exit condition.
 */
async function openWhatever(page: Page) {
  for (let pass = 0; pass < 6; pass++) {
    const opened = await page.evaluate((sel) => {
      const closed = [...document.querySelectorAll(sel)].filter(
        (n) =>
          !n.hasAttribute('data-audit-opened') &&
          (n.getAttribute('aria-expanded') === 'false' ||
            n.getAttribute('aria-selected') === 'false'),
      )
      for (const n of closed) {
        n.setAttribute('data-audit-opened', '')
        ;(n as HTMLElement).click()
      }
      return closed.length
    }, DISCLOSURE)
    if (!opened) return
    await page.waitForTimeout(60)
  }
}

/**
 * Drive the current step panel through every state in which a different set of
 * disclosures is open, awaiting `visit` in each.
 *
 * The first state opens everything that can be open together. After that, any
 * disclosure still never seen open gets clicked directly and the panel is
 * visited again — which is how a single-open group contributes one state per
 * member, and how `AuthPaths` contributes one per tab. The loop stops when
 * nothing is left unobserved, or when a click fails to change that, and the
 * caller's property is what turns the second case into a failure rather than a
 * quiet exit.
 *
 * Known limit, stated because a silent one reads as full coverage: `all` is
 * taken from the first state, so a disclosure that only ever appears nested
 * inside a *later* state is not counted. Nothing in the app does that today.
 */
export async function forEachPanelState(
  page: Page,
  visit: () => Promise<void>,
): Promise<{ all: string[]; observed: string[] }> {
  await openWhatever(page)
  await page.waitForTimeout(150)

  const first = await snapshot(page)
  const all = first.all
  const observed = new Set(first.open)
  await visit()

  for (let round = 0; round < 40; round++) {
    const missing = all.find((key) => !observed.has(key))
    if (!missing) break

    const clicked = await page.evaluate(
      ([sel, target]) => {
        const node = [...document.querySelectorAll(sel)].find(
          (n) => n.getAttribute('aria-controls') === target,
        )
        if (!node) return false
        ;(node as HTMLElement).click()
        return true
      },
      [DISCLOSURE, missing] as const,
    )
    if (!clicked) break

    await page.waitForTimeout(120)
    const next = await snapshot(page)
    const before = observed.size
    for (const key of next.open) observed.add(key)
    await visit()

    // Clicking it did not open it. Stop rather than spin; the caller's property
    // reports `missing` as never observed, which is the honest outcome.
    if (observed.size === before) break
  }

  return { all, observed: [...observed] }
}
```

- [ ] **Step 4: Replace `openExpandables` at its three call sites**

In `web/e2e/audit.spec.ts`, delete the `openExpandables` helper (lines 27–66) and import the new module:

```ts
import { forEachPanelState } from './panel-states'
```

Touch-target test: wrap the existing collection in a visit callback. The `small` array becomes an accumulator across states:

```ts
    const small: string[] = []
    await forEachPanelState(page, async () => {
      small.push(...(await page.evaluate(() => { /* unchanged body */ })))
    })
    expect(small, `${path}: ${small.join(', ')}`).toEqual([])
```

Both contrast tests: same shape. `rows` accumulates across states, and the per-row assertion loop stays exactly as it is.

```ts
      const rows: {
        fg: number[]
        bg: number[]
        size: number
        weight: number
        sample: string
      }[] = []
      await forEachPanelState(page, async () => {
        rows.push(...(await page.evaluate(() => { /* unchanged body */ })))
      })
```

The `seen` Set inside the page evaluate is per-call, so the same pair can now arrive from several states. That is harmless: the assertion loop is idempotent per row, and the duplicate cost is a string compare.

- [ ] **Step 5: Run the property test to verify it now passes**

```bash
cd web && pnpm exec playwright test e2e/audit.spec.ts -g "observes every disclosure" --reporter=line
```

Expected: PASS. **If it fails, that is a finding rather than a bug in the test.** It means a disclosure the app renders genuinely cannot be opened by the sweep. Report the list before changing anything.

- [ ] **Step 6: Run the whole audit and record the before/after numbers**

```bash
cd web
lsof -ti:3100 | xargs kill -9
node e2e/count-expandables.mjs   # after the change
```

Compare against a run on `develop` from before this task. The count is expected to rise, because `AuthPaths` tabs and single-open group members now get opened. Record both numbers and the direction. An unexplained direction is a finding.

```bash
pnpm exec playwright test --reporter=line
```

**If this surfaces contrast or touch-target failures, stop and report the count.** Few get fixed here; many get a debt entry. That call is the user's.

- [ ] **Step 7: Update `count-expandables.mjs` to mirror the new sweep**

Its header says: *"The selector and the one-at-a-time loop mirror `openExpandables()` in `audit.spec.ts`. If that changes, change this with it, or the two stop measuring the same thing."* Update its selector to the `DISCLOSURE` pair and its loop to the same open-then-visit-missing shape, and correct the header sentence to name `panel-states.ts`.

- [ ] **Step 8: Teeth-check the property**

Break the sweep the way it was broken before: change `DISCLOSURE` in `panel-states.ts` to a selector that matches nothing (`'[role=tabpanel] button[data-nope]'`), re-run the property test. Expected: it fails, listing missed disclosures per page. Restore, confirm green. Paste both.

This is the check the whole task exists for. If a nulled selector still passes, the property is decorative and nothing here closed TD-26.

- [ ] **Step 9: Commit**

```bash
git add web/e2e/panel-states.ts web/e2e/audit.spec.ts web/e2e/count-expandables.mjs
git commit -m "fix(e2e): sweep every disclosure state, and prove the sweep still opens things"
```

---

### Task 6: TD-26 — measure colours set on containers

The contrast collector skips any element that has element children (`web/e2e/audit.spec.ts:267`), so a colour set on a container is only ever measured through its leaves. A container-level failure with correctly-coloured children is invisible.

The fix is not "measure containers too". A container whose children all override its colour shows that colour to nobody, and measuring it would invent failures. The precise question is whether the element has text of its own.

**Files:**
- Modify: `web/e2e/audit.spec.ts`, the general text loop inside the contrast tests

**Interfaces:**
- Consumes: `forEachPanelState` (Task 5). Nothing new is produced.

- [ ] **Step 1: Write the failing test**

Playwright has no fixture page here, so the RED is produced against the real app with a deliberately broken token. Add a container with own text and correctly-coloured children to a swept page, coloured below AA:

```tsx
// Temporary, in web/src/features/setup/Setup.tsx inside the first step's panel:
<p style={{ color: 'rgb(200,200,200)', background: 'rgb(210,210,210)' }}>
  own text <strong style={{ color: 'rgb(0,0,0)' }}>child text</strong>
</p>
```

- [ ] **Step 2: Run the contrast tests to verify they pass, which is the defect**

```bash
cd web && pnpm build && pnpm exec playwright test e2e/audit.spec.ts -g "WCAG AA in light" --reporter=line
```

Expected: PASS, despite a 1.06:1 pair being on the page. Paste it. **This inverted RED is the point.** The failure being fixed is a green result, so the evidence is a green run over a page that should fail.

- [ ] **Step 3: Write the implementation**

Replace the skip at `web/e2e/audit.spec.ts:267`:

```js
          const t = el.textContent?.trim()
          if (!t || t.length < 3 || el.children.length) continue
```

with:

```js
          // Own text, not descendant text. The old guard skipped any element
          // with element children, so a colour set on a container was only ever
          // measured through its leaves and a container-level failure with
          // correctly-coloured children was invisible (TD-26).
          //
          // "Measure containers too" would be wrong in the other direction: a
          // container whose children all override its colour shows that colour
          // to nobody, and flagging it would invent a failure. What matters is
          // whether the element renders text of its own.
          const t = [...el.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent ?? '')
            .join('')
            .trim()
          if (t.length < 3) continue
```

The rest of the loop already uses `t` for the `sample` field, so nothing else changes.

- [ ] **Step 4: Run the contrast tests to verify they now fail on the planted pair**

```bash
cd web && pnpm build && pnpm exec playwright test e2e/audit.spec.ts -g "WCAG AA in light" --reporter=line
```

Expected: FAIL, reporting roughly `1.06:1 (need 4.5) @16px "own text"`. Paste it.

- [ ] **Step 5: Remove the planted markup and confirm the suite is green**

```bash
cd web
git checkout src/features/setup/Setup.tsx
pnpm build && pnpm exec playwright test e2e/audit.spec.ts --reporter=line
```

**If removing the plant leaves real failures, stop and report the count** before fixing anything. Widening a sweep is how this repo found TD-16, and a pile of real failures is a decision, not a cleanup.

- [ ] **Step 6: Commit**

```bash
git add web/e2e/audit.spec.ts
git commit -m "fix(a11y): measure colours set on containers, not only through their leaves"
```

---

### Task 7: TD-35 — give React's development warnings somewhere to be caught

The audit's console check runs against a production build, deliberately, and React strips its development-mode validation from a production build. Missing-key warnings, invalid DOM nesting, `act()` warnings, hydration-mismatch detail and prop-type complaints are all invisible to it. `RevealList` warned on every `pnpm dev` load for the length of a branch, twice, while the suite reported 14/14.

By the user's decision this does **not** join `pnpm test:e2e` or CI. It gets its own command and the standing `pnpm test:prod` already has: a documented step in the stage-round checklist.

**Files:**
- Create: `web/playwright.dev.ts`
- Create: `web/e2e/dev-console.spec.ts`
- Modify: `web/package.json` (script)
- Modify: `web/playwright.config.ts` (`grepInvert`)

**Interfaces:**
- Consumes: `auditPages` from `web/e2e/audit-pages.ts`.
- Produces: `pnpm test:dev-console`.

- [ ] **Step 1: Write the failing test**

Create `web/e2e/dev-console.spec.ts`:

```ts
import { expect, test } from '@playwright/test'
import { auditPages } from './audit-pages'

/**
 * TD-35. `audit.spec.ts`'s console check runs against a production build, where
 * React has stripped its development validation, so a whole family of real
 * defects is invisible to it: missing keys, invalid DOM nesting, `act()`
 * warnings, hydration-mismatch detail, prop-type complaints.
 *
 * `RevealList` logged *Each child in a list should have a unique "key" prop* on
 * every `pnpm dev` load of `#ai` from `1772555` to `f1a23e7`, then on
 * `#tenancy`, `#trace` and `#indexes` for the rest of that branch, while the
 * audit reported 14/14 throughout. Both times it was found by someone opening
 * the dev server for an unrelated reason. That is luck, not process.
 *
 * Two things this had to get right. It loads *every* audited page, because what
 * let both instances survive was that every manual check loaded one page and
 * `#ai` exercises neither `header` nor `footer`. And it loads them cold: Fast
 * Refresh patching an already-open tab does not fire the warning, while a
 * settled reload fires it reliably, measured across three cold-server runs.
 *
 * Not part of `pnpm test:e2e` and not in CI, by decision. A dev server in the
 * merge gate costs a second build and brings the overlay's noise with it. This
 * runs per stage round, like `pnpm test:prod`.
 */
const REACT_WARNING =
  /(Each child in a list|unique "key" prop|Encountered two children with the same key|validateDOMNesting|cannot appear as a descendant|cannot be a descendant|Hydration failed|Text content does(?: not|n't) match|not wrapped in act|Invalid DOM property|Received `true` for a non-boolean attribute|Warning: )/

test('@dev no React development warnings on any audited page, which the production audit cannot see at all', async ({
  browser,
}) => {
  const context = await browser.newContext()
  const page = await context.newPage()

  const warnings: string[] = []
  const other: string[] = []

  page.on('pageerror', (e) => warnings.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return
    const text = m.text()
    if (REACT_WARNING.test(text)) warnings.push(text.slice(0, 200))
    else other.push(text.slice(0, 120))
  })

  for (const path of await auditPages(page)) {
    await page.goto(path, { waitUntil: 'networkidle' })
  }

  await context.close()

  // Printed, never asserted on. The prefix list above was tuned against real
  // dev output rather than guessed, and this is what makes the next person's
  // tuning possible instead of speculative. A warning sitting in here that
  // should be in `warnings` is a defect in the pattern, not in the app.
  if (other.length) {
    console.log(
      `[dev-console] ${other.length} console messages not matched as React warnings:\n` +
        [...new Set(other)].slice(0, 40).join('\n'),
    )
  }

  expect(warnings, warnings.join('\n')).toEqual([])
})
```

Create `web/playwright.dev.ts`:

```ts
import { defineConfig } from '@playwright/test'

/**
 * The dev-server half of the console check (TD-35). Four deliberate differences
 * from `playwright.config.ts`:
 *
 *   1. `pnpm dev`, not `pnpm build && pnpm start`. React's development
 *      validation exists only here, which is the entire point.
 *   2. Port 3101 — clear of `pnpm dev`'s own 3200 and the audit's 3100, so this
 *      never shares a server with either.
 *   3. `reuseExistingServer: false`. A dev server is cheap to start, and a
 *      shared one reintroduces TD-27 in a different costume.
 *   4. No `globalSetup`. The freshness check reads `.next/BUILD_ID`, which a dev
 *      server does not produce; running it here would fail for a reason that has
 *      nothing to do with what this config checks.
 *
 * Longer timeout because Turbopack compiles per route on first load and this
 * sweeps every audited URL cold.
 */
export default defineConfig({
  testDir: './e2e',
  grep: /@dev/,
  timeout: 300_000,
  retries: 0,
  use: { baseURL: 'http://localhost:3101' },
  webServer: {
    command: 'pnpm exec next dev -p 3101',
    url: 'http://localhost:3101',
    timeout: 180_000,
    reuseExistingServer: false,
  },
})
```

Add to `web/package.json` scripts:

```json
    "test:dev-console": "playwright test --config=playwright.dev.ts",
```

And in `web/playwright.config.ts`, widen the exclusion so `pnpm test:e2e` does not pick this up:

```ts
  // `testDir: './e2e'` collects smoke.spec.ts and dev-console.spec.ts too. The
  // first targets the deployed site; the second needs a dev server on 3101.
  // Without this, `pnpm test:e2e` would run both against localhost:3100 and
  // fail on mismatches that mean nothing.
  grepInvert: /@smoke|@dev/,
```

- [ ] **Step 2: Plant a real warning and run it, to verify it fails for the right reason**

```bash
cd web
```

In `web/src/components/RevealList.tsx`, delete the `key` prop from the row `map`. Then:

```bash
pnpm test:dev-console
```

Expected: FAIL listing `Each child in a list should have a unique "key" prop`, on more than one URL. Paste the raw output, and paste the `[dev-console]` diagnostic line too — it is what proves the pattern was tuned against real output rather than guessed.

**If it passes with the key removed, the spec is decorative.** Stop and report: either the pattern does not match React 19's actual text, or the pages are not loading cold.

- [ ] **Step 3: Restore the key and verify it goes green**

```bash
cd web && git checkout src/components/RevealList.tsx && pnpm test:dev-console
```

Expected: PASS. Record the wall-clock runtime. If it is bad enough that nobody will run it, say so in the report — that is a finding about the design, not a detail to absorb.

- [ ] **Step 4: Verify `pnpm test:e2e` still excludes it**

```bash
cd web && pnpm exec playwright test --list | grep -c "dev-console"
```

Expected: `0`. A `@dev` test running inside `test:e2e` would hit port 3100 and fail on a mismatch that means nothing, which is exactly the trap `grepInvert` already exists for.

- [ ] **Step 5: Run the whole gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
```

- [ ] **Step 6: Commit**

```bash
git add web/playwright.dev.ts web/e2e/dev-console.spec.ts web/package.json web/playwright.config.ts
git commit -m "fix(e2e): close TD-35, React's dev warnings now have somewhere to be caught"
```

---

### Task 8: Records — close four debts, and check two statuses nobody has

**Files:**
- Modify: `docs/tracker.md`, `docs/task.md`, `CLAUDE.md`, `KICKOFF.md`, `docs/learnings/quality-gates-101.md`

**Interfaces:**
- Consumes: every measured number from Tasks 1–7. Nothing is quoted from this plan; everything is re-derived.

- [ ] **Step 1: Verify the two statuses `KICKOFF.md` flags, before writing anything about them**

```bash
cd /Users/angelito/personal/Development-Playbook
# W-6: docs/task.md:685 says PAUSED, "resume after the stage 04 port". That port
# merged 2026-08-17 and stage 05's has since. The pause condition has expired twice.
git log --oneline --all --grep="W-6" | head
# W-3.1b: docs/task.md:238 says "app port pending W-3.2", but W-3.2 is ticked and
# merged 2026-08-03. Either its content shipped inside that port or it did not.
grep -n "resilience\|consistency\|evolution" docs/stage-03-status.md | head -20
```

Report what is actually true for each. **Do not report either way without looking.** The kickoff says nobody has checked, and repeating its guess would be this branch's own vacuous claim.

- [ ] **Step 2: Correct `docs/task.md`**

Update the W-6 status line and the W-3.1b heading to whatever Step 1 established. If W-3.1b's content did ship inside W-3.2, strike the pending note with a date rather than deleting it (`~~app port pending W-3.2~~ ✓ shipped in W-3.2, 2026-08-03`), per the repo's convention of superseding rather than editing.

- [ ] **Step 3: Close the four debts in `docs/tracker.md`**

Strike each heading (`### ~~TD-32~~ — … · **CLOSED 2026-08-20**`) and add a shipped row carrying evidence, not adjectives: commit SHAs, the re-derived test counts, the expandable count before and after, the dev-console runtime, and what each teeth check did when the implementation was broken.

Record the new decisions. At minimum:
- The property-over-count choice for TD-26, and that it contradicts TD-26's own `Closes with:` line on the evidence in `count-expandables.mjs`.
- `pnpm test:dev-console` standing outside the gate and why.
- The freshness assertion over `reuseExistingServer: false`.

Each entry carries a `Deferred:` list. TD-31's stale `@v4` pins in `docs/11-ci-cd.md` stay open and belong on it.

- [ ] **Step 4: Update `CLAUDE.md`**

Add `pnpm test:dev-console` to the commands block with a line saying it is not part of the gate, alongside the existing `test:prod` note. Amend the Verification expectations section: "Console — zero console errors in a clean browser context" is the wording TD-35 showed the production-only check does not meet. Say which build each console check covers.

- [ ] **Step 5: Add the transferable half to `docs/learnings/quality-gates-101.md`**

A section on the distinction this round turned on: a guard pinned to a **constant** stales silently and stops meaning anything, while a guard stated as a **property** keeps holding as content grows. Cite the concrete case — TD-26 asked for a count, `count-expandables.mjs` had already recorded 108 → 140 with no defect in between, and the property that replaced it fails when the selector is nulled.

- [ ] **Step 6: Run humanizer over the prose**

```
Skill: humanizer:humanizer
```

Over the learnings section and the `CLAUDE.md` edit. Skip it for tracker rows and terminal output, where the flagged patterns are not the problem.

- [ ] **Step 7: Refresh `KICKOFF.md`**

Update *Project state* and *Next round's scope*. Delete closed items rather than leaving them ticked. The four debts come out of the next-round table. Re-derive the git positions with `git fetch` first, per the file's own warning that every version of that paragraph has gone stale.

- [ ] **Step 8: Commit the records separately**

```bash
git add docs/task.md
git commit -m "docs(task): correct two statuses that had gone stale unverified"
git add docs/tracker.md
git commit -m "docs(tracker): close TD-32, TD-27, TD-26 and TD-35 with evidence"
git add CLAUDE.md docs/learnings/quality-gates-101.md KICKOFF.md
git commit -m "docs: record the property-over-constant lesson and the new dev-console command"
```

---

## Verification (after all tasks)

- [ ] `cd web && pnpm lint` exits 0
- [ ] `cd web && pnpm typecheck` exits 0
- [ ] `cd web && pnpm test` exits 0, with the file and test counts **re-derived and recorded**, not quoted. The last measured figure was 648 across 80 files; quoting it without running it would be this branch's own subject.
- [ ] `cd web && pnpm build` exits 0
- [ ] `cd web && pnpm test:e2e` exits 0 from a cold server, with the freshness check observed passing rather than assumed
- [ ] `cd web && pnpm test:dev-console` exits 0, runtime recorded
- [ ] `node e2e/count-expandables.mjs` run against a freshly built server; before and after numbers both recorded, with the direction explained
- [ ] Every teeth check in Tasks 2–7 re-run and its output pasted: TD-32's two halves, TD-27's freshness half and identity half separately, TD-26's nulled selector, TD-26's planted container pair, TD-35's removed `key`
- [ ] A whole-branch review before merge, not only the per-task ones. Every branch so far has found something the per-task reviews did not, including one review's own fix
- [ ] Branch state stated plainly at the end: commit count off `develop`, test counts, build and tree status, and whether it is merged and deployed. It is neither until the user says so

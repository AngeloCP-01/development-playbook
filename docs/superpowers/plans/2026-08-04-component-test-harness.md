# Component Test Harness (TD-17) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make it possible to render a React component in a test and assert on its output, and prove it against the two defects that opened TD-17.

**Architecture:** `web/vitest.config.ts` gains two vitest projects — `unit` (node, `*.test.ts`) and `dom` (jsdom, `*.test.tsx`) — so the file extension picks the environment and nothing has to be remembered. The 313 existing tests keep running under node. Two render tests prove the harness, each teeth-checked by injecting the exact defect it exists to catch.

**Tech Stack:** vitest 4, jsdom, `@testing-library/react` 16, React 19.2, Next 16, TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-04-component-test-harness-design.md`

## Global Constraints

- All commands run from `web/`. The package manager is **pnpm**.
- **Vitest 4 has removed `environmentMatchGlobs`.** Do not use it. Verified: the string appears nowhere in `node_modules/vitest/`.
- Each project entry sets **`extends: true`**, which the installed types document as *"If `true`, the project will inherit all options from the root config."* This is what keeps the root `resolve.alias` (`@/*` → `./src`) working in both projects. Without it the alias is not inherited and imports of `@/components/ui` fail.
- **Do not add `@testing-library/jest-dom`.** `getByText` throws when it finds nothing, so the query is the assertion. Spec non-goal.
- **Do not add `@vitejs/plugin-react`.** `tsconfig.json` sets `jsx: "react-jsx"`, so esbuild already emits the automatic runtime. Spec non-goal.
- **Do not delete or modify the behaviour of `web/src/test/localstorage-polyfill.ts`.** Its two importers (`src/lib/architecture-sheet.test.ts`, `src/lib/discovery-sheet.test.ts`) are `.test.ts` and stay in the node project. Only its docblock changes, in Task 3.
- **Do not touch `web/e2e/audit.spec.ts`.** The three Playwright stand-ins stay. Spec non-goal.
- A render test is named `Component.test.tsx` and sits beside `Component.tsx`.
- Commit messages follow Conventional Commits, `type(scope): subject`, lowercase after the colon, and carry the trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Every test name states the rationale, not the mechanic. `test('renders why')` is a plan failure; `test('shows the reasoning after a wrong answer, since ...')` is the form.
- **A teeth check is not optional.** Where a task says to inject a defect, run the suite, confirm the intended test fails *and no other test does*, then revert. Paste both outputs into the task report.
- Before teeth-checking, **stage your work** (`git add -A`). A previous round lost an implementation to `git checkout` on unstaged files during a teeth check.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `web/package.json` | Three new devDependencies | 1 |
| `web/vitest.config.ts` | The two-project split | 1 |
| `web/src/test/setup.ts` | **Create.** RTL cleanup between tests, nothing else | 1 |
| `web/src/features/architecture/ModelInterrogation.test.tsx` | **Create.** Proves the reasoning renders after a wrong answer | 1 |
| `web/src/features/architecture/SchemaInspector.test.tsx` | **Create.** Proves the private `fieldName()` through its only surface | 2 |
| `web/PATTERNS.md` | The convention: which components get a render test | 3 |
| `CLAUDE.md` | The `dom` project in commands; the rule in verification expectations | 3 |
| `web/src/test/localstorage-polyfill.ts` | Docblock only — its stated reason becomes false | 3 |
| `KICKOFF.md`, `docs/tracker.md` | Records; close TD-17 | 3 |

---

### Task 1: The harness, proved by the defect that opened TD-17

**Files:**
- Create: `web/src/features/architecture/ModelInterrogation.test.tsx`
- Create: `web/src/test/setup.ts`
- Modify: `web/vitest.config.ts` (whole file, currently 14 lines)
- Modify: `web/package.json` (devDependencies)

**Interfaces:**
- Consumes: `ModelInterrogation` (no props) from `./ModelInterrogation`; `INTERROGATIONS: Interrogation[]` and `judgeInterrogation(id: string, choice: string): { correct: boolean; why: string }` from `./scoring`.
- Produces: the `dom` vitest project. Any `src/**/*.test.tsx` file now runs under jsdom with RTL cleanup. Task 2 relies on this and adds no config.

**Background the implementer needs.** `ModelInterrogation` renders `INTERROGATIONS` as a list. Each question is a `role="radiogroup"` whose buttons are `role="radio"` labelled with `opt.label`. Committing an answer renders a verdict block: a headline reading `Correct` or `Not quite`, then a separate `<p>` holding `verdict.why`. The `why` is returned on **both** branches — `scoring.test.ts:120-131` holds `judgeInterrogation` to that, and the component's docblock says gating it on `correct` "would quietly undo that". Nothing currently holds the component to rendering it. That is the defect this task gates.

- [ ] **Step 1: Write the failing test**

Create `web/src/features/architecture/ModelInterrogation.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ModelInterrogation } from './ModelInterrogation'
import { INTERROGATIONS, judgeInterrogation } from './scoring'

// TD-17's original case, tested at the level it actually lives at.
// `scoring.test.ts` already proves judgeInterrogation returns `why` for a wrong
// answer; nothing proved the component puts it on screen. Gating that paragraph
// on `correct` would pass lint, typecheck, every unit test and the audit suite,
// while hiding the reasoning from exactly the readers who got it wrong.
test('shows the reasoning after a wrong answer, since an exercise that explains itself only when you are right teaches the readers who least need it', () => {
  const question = INTERROGATIONS[0]
  const wrong = question.options.find((o) => o.id !== question.answer)
  expect(wrong, 'the first interrogation has no wrong option').toBeDefined()

  render(<ModelInterrogation />)

  // fireEvent, not element.click(). RTL wraps the dispatch in act(), and a raw
  // .click() produces a React 19 act() warning — a warning the harness itself
  // emits is the kind that gets normalised.
  fireEvent.click(screen.getByRole('radio', { name: wrong!.label }))

  // The verdict has to be wrong, or the assertion below proves nothing: a test
  // that reads the `why` after a CORRECT answer passes against the defect.
  expect(screen.getByText('Not quite')).toBeDefined()

  const why = judgeInterrogation(question.id, wrong!.id).why
  expect(screen.getByText(why)).toBeDefined()
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

Run: `pnpm vitest run src/features/architecture/ModelInterrogation.test.tsx`

Expected: **FAIL.** The file does not match `include: ['src/**/*.test.ts']`, so vitest reports `No test files found`. That is the harness being absent, which is what this task builds. If instead it reports `document is not defined`, that is also a correct RED — either proves the point.

Paste the raw output into the task report.

- [ ] **Step 3: Install the dependencies**

```bash
pnpm add -D jsdom @testing-library/react @testing-library/dom
```

`@testing-library/dom` is a **peer** of `@testing-library/react@16`, not a transitive dependency, so it must be named explicitly. Do not add `@testing-library/jest-dom` or `@vitejs/plugin-react` — see Global Constraints.

- [ ] **Step 4: Create the setup file**

Create `web/src/test/setup.ts`:

```ts
/**
 * The `dom` vitest project's only setup: React Testing Library's cleanup
 * between tests, which unmounts anything a test rendered. Without it a second
 * `render()` in the same file finds two copies of every element and `getByText`
 * throws on the ambiguity rather than on the thing under test.
 *
 * One responsibility on purpose. If this file grows a second, that is a signal
 * about the tests rather than a convenience to accept — the one exception
 * anticipated in the spec is a `matchMedia` stub, which jsdom does not
 * implement, for the first component that needs one.
 */

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)
```

- [ ] **Step 5: Split the vitest config into two projects**

Replace the whole of `web/vitest.config.ts` with:

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Mirrors tsconfig's "@/*" so importing STAGE_CONTENT (which pulls
    // component files) resolves. `extends: true` on each project below is what
    // carries this into both of them.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    // Two environments, chosen by file extension rather than by a per-file
    // docblock. A docblock is something every new test file has to remember,
    // and a forgotten one surfaces as `document is not defined` — which reads
    // like a broken component rather than a missing comment. The extension is
    // structural, which is the same argument this stage's own soft-delete
    // section makes about filters.
    //
    // vitest 4 removed `environmentMatchGlobs`; `projects` is the mechanism.
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./src/test/setup.ts'],
        },
      },
    ],
  },
})
```

- [ ] **Step 6: Run the new test and confirm it passes**

Run: `pnpm vitest run src/features/architecture/ModelInterrogation.test.tsx`

Expected: **PASS**, 1 test, reported under the `dom` project.

- [ ] **Step 7: Run the whole suite and confirm nothing regressed**

Run: `pnpm test`

Expected: **314 passed** — the 313 existing under `unit`, the new one under `dom`. Both project names appear in the output. If any previously-passing test now fails, stop and report: the two most likely causes are the alias not being inherited (check `extends: true` is on both projects) and `src/lib/architecture-sheet.test.ts` / `discovery-sheet.test.ts` losing their polyfill (they are `.test.ts` and must stay in `unit`).

- [ ] **Step 8: Teeth-check the new test**

```bash
git add -A
```

Then in `web/src/features/architecture/ModelInterrogation.tsx`, gate the reasoning paragraph on `correct` — change:

```tsx
                    <p className="measure text-sm leading-6 text-muted">
                      {verdict.why}
                    </p>
```

to:

```tsx
                    {verdict.correct && (
                      <p className="measure text-sm leading-6 text-muted">
                        {verdict.why}
                      </p>
                    )}
```

Run: `pnpm test`

Expected: **exactly one failure** — the new test, on `screen.getByText(why)`. If it passes, the test is vacuous and must be rewritten before proceeding. If other tests fail, note which and why.

Revert with `git checkout -- src/features/architecture/ModelInterrogation.tsx`, re-run `pnpm test`, confirm 314 pass. Paste all three outputs into the task report.

- [ ] **Step 9: Verify the generated glossary still generates**

Run: `pnpm gen:glossary`, then `git status --short reference/glossary.md` from the repo root.

Expected: **no modification.** `reference/glossary.md` is a committed deliverable generated by a filename-filtered vitest run, and a project split is exactly the kind of change that could break the filter silently. If the file changed, stop and report the diff rather than committing it.

- [ ] **Step 10: Run the rest of the gate**

Run: `pnpm lint`, `pnpm typecheck`, `pnpm format:check`.

Expected: all clean. `.test.tsx` is inside `tsconfig.json`'s `include`, so testing-library's types have to compile — that is a real gate here, not a formality.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
test(web): add a component render harness, and gate the interrogation's reasoning

Two vitest projects rather than a per-file environment docblock: `unit` (node,
*.test.ts) and `dom` (jsdom, *.test.tsx), so the file extension picks the
environment and nothing has to be remembered. vitest 4 removed
environmentMatchGlobs, and `extends: true` is what carries the @/* alias into
both projects.

The first test is TD-17's own case. judgeInterrogation returns `why` on both
branches and scoring.test.ts holds it to that, but nothing held the component
to rendering it — gating that paragraph on `correct` would have passed lint,
typecheck, all 313 tests and the audit suite while hiding the reasoning from
the readers who got the answer wrong. Teeth-checked by making exactly that
change and confirming only this test fails.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Prove a module-private function through its only surface

**Files:**
- Create: `web/src/features/architecture/SchemaInspector.test.tsx`

**Interfaces:**
- Consumes: the `dom` project from Task 1 (no config changes in this task). `SchemaInspector({ lines, title, emptyHint? })` from `./SchemaInspector`; `SCHEMA_LINES: SchemaLine[]` from `./scoring`.
- Produces: nothing later tasks depend on.

**Background the implementer needs.** `SchemaInspector.tsx:33-36` holds `fieldName()`, which takes a DDL line and returns its leading identifier:

```ts
function fieldName(sql: string) {
  const first = sql.trim().split(/\s+/)[0] ?? sql
  return first.replace(/[(),]/g, '')
}
```

It is **not exported**, so no unit test can reach it. Its only surface is the badge rendered above the detail panel when an annotated line is selected (`SchemaInspector.tsx:131-133`). The relevant fixture is the real `SCHEMA_LINES` entry with id `owner-fk`, whose `sql` is `'owner_id     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,'` — so the badge must read `owner_id` and not the whole fragment.

Structural lines (no `note`) render as inert text and are not radios, so the row being clicked has to be an annotated one. `owner-fk` has a note.

- [ ] **Step 1: Write the failing test**

Create `web/src/features/architecture/SchemaInspector.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SchemaInspector } from './SchemaInspector'
import { SCHEMA_LINES } from './scoring'

// `fieldName()` is module-private, so the render is the only surface it has —
// which is the case for the harness in miniature. A data test cannot reach
// this function at all, and the badge reading the whole SQL fragment instead of
// the column name is a defect nothing else in the repo could see.
test('labels the detail panel with the column name rather than the whole line, since the badge is what the reader scans for', () => {
  const line = SCHEMA_LINES.find((l) => l.id === 'owner-fk')
  expect(line, 'the owner_id line is no longer in SCHEMA_LINES').toBeDefined()
  expect(line!.note, 'a line with no note is not selectable').toBeDefined()

  render(<SchemaInspector lines={SCHEMA_LINES} title="invoices" />)

  // fireEvent, not element.click() — RTL wraps the dispatch in act().
  fireEvent.click(screen.getByRole('radio', { name: /owner_id/ }))

  // Exact text match: the badge's whole content is the identifier. The row
  // above and the SQL echoed in the panel both CONTAIN "owner_id" inside a
  // longer string, so only the badge matches exactly.
  expect(screen.getByText('owner_id')).toBeDefined()
})
```

- [ ] **Step 2: Run it and confirm it passes**

Run: `pnpm vitest run src/features/architecture/SchemaInspector.test.tsx`

Expected: **PASS**, 1 test, under `dom`.

This test does not get its own RED against a missing harness — Task 1 built that. Its proof of non-vacuity is Step 3, and that step is what makes this task reviewable.

- [ ] **Step 3: Teeth-check it**

```bash
git add -A
```

In `web/src/features/architecture/SchemaInspector.tsx`, break `fieldName` so it returns the line unchanged:

```ts
function fieldName(sql: string) {
  return sql
}
```

Run: `pnpm test`

Expected: **exactly one failure** — this test, on `screen.getByText('owner_id')`, because the badge now holds the full SQL fragment and nothing has that exact text. If it passes, the assertion is not testing `fieldName` and must be rewritten.

Revert with `git checkout -- src/features/architecture/SchemaInspector.tsx`, re-run `pnpm test`, confirm 315 pass. Paste all three outputs into the task report.

- [ ] **Step 4: Run the gate**

Run: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`.

Expected: **315 passed**, everything else clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
test(web): cover fieldName through the only surface it has

fieldName() is module-private in SchemaInspector, so no unit test can reach
it and the rendered badge is its entire observable behaviour. That makes it
the harness's case in miniature: a defect here — the badge reading the whole
DDL line instead of the column name — is invisible to every other test in the
repo. Teeth-checked by making fieldName return its argument unchanged and
confirming only this test fails.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: The convention, the corrected docblock, and the records

**Files:**
- Modify: `web/PATTERNS.md` (append a section)
- Modify: `CLAUDE.md` (commands block; verification expectations)
- Modify: `web/src/test/localstorage-polyfill.ts` (docblock only, lines 1-14)
- Modify: `docs/tracker.md` (close TD-17; add the Completed row)
- Modify: `KICKOFF.md` (quality-gates line)

**Interfaces:**
- Consumes: the harness from Task 1 and both tests from Tasks 1-2. Nothing in this task changes behaviour.
- Produces: nothing.

**Why this is a task and not a footnote.** The spec's stated risk is a harness that is installed and unused. `docs/learnings/decisions-need-tests-101.md` is about that exact shape — D-38 was a recorded decision nothing enforced, it drifted, and D-52 had to replace it. The convention is the deliverable that makes TD-17 close as *done* rather than as *possible*.

- [ ] **Step 1: Write the convention into `web/PATTERNS.md`**

Append this section:

```markdown
## When a component gets a render test

Vitest runs two projects: `unit` (node, `*.test.ts`) and `dom` (jsdom,
`*.test.tsx`). The file extension picks the environment, so a render test is
`Component.test.tsx` beside `Component.tsx` and needs no configuration.

**The rule: a component that derives what it displays from data, rather than
displaying the data directly, gets a render test.**

Written against the failure it prevents. A data test proves the function
returns the right answer; it says nothing about whether the component shows it.
Both green, and the reader still sees nothing — which is how a passing suite
ships a broken lesson.

Three shapes that qualify:

- **A conditional render of something a data test guarantees.** The
  interrogation's reasoning is returned on both branches and asserted in
  `scoring.test.ts`. Gating it on `correct` in the component passes every data
  test and hides it from the readers who most need it.
- **A module-private helper.** `fieldName()` in `SchemaInspector` is not
  exported, so the render is its only surface.
- **An accessible name assembled in the component.** `BoundaryMap` once
  hardcoded "allowed" into a name while the visible badge derived from the
  data — a sighted reader and a screen-reader user were told opposite things,
  and nothing failed.

What does not need one: a component that renders a prop as text, a layout
wrapper, a component whose whole behaviour is already covered by the audit
suite driving the real page.
```

- [ ] **Step 2: Add the rule to `CLAUDE.md`**

In the commands block near the top, change the `pnpm test` line to:

```
pnpm test         # vitest — two projects: `unit` (node, data invariants) and `dom` (jsdom, render tests)
```

Then, in the **Verification expectations** section, after the three bullets (Contrast / Responsive / Console), add:

```markdown
A component that derives what it displays from data — a conditional render, a
module-private helper, an accessible name assembled from parts — also gets a
`*.test.tsx` render test. `web/PATTERNS.md` states the rule and why. A passing
data test plus a component that ignores the data is green and wrong, and that
combination is what TD-17 was opened for.
```

- [ ] **Step 3: Correct the polyfill's docblock**

`web/src/test/localstorage-polyfill.ts` currently justifies itself with *"Pulling in jsdom or happy-dom for one test file would add a dependency this project deliberately doesn't carry."* That is now false — jsdom is installed. Replace the whole docblock (lines 1-14, up to and including the closing `*/`) with:

```ts
/**
 * The `unit` vitest project runs under the `node` environment, so there is no
 * `window`, `localStorage`, or `Storage` global. `discovery-sheet.test.ts` and
 * `architecture-sheet.test.ts` need all three, including a real `Storage`
 * constructor, since they spy on `Storage.prototype`.
 *
 * jsdom IS available in this repository — the `dom` project uses it for
 * `*.test.tsx` render tests. This polyfill survives that change because both
 * importers test `lib/` modules rather than components, so moving them into
 * the `dom` project would mean renaming a module test to `.test.tsx` to buy a
 * DOM it does not otherwise need. This is the minimal Web Storage polyfill the
 * suite actually exercises: an in-memory, per-process store with the five
 * methods `Storage` defines.
 *
 * Imported for its side effects only, and deliberately not wired into
 * `setupFiles`, so no other suite in the `unit` project inherits a global
 * `window`.
 */
```

Do not change anything below the docblock.

- [ ] **Step 4: Verify the docblock edit changed nothing behavioural**

Run: `pnpm test`

Expected: **315 passed.** In particular `src/lib/discovery-sheet.test.ts` and `src/lib/architecture-sheet.test.ts` still pass, which is the point of the check.

- [ ] **Step 5: Close TD-17 in `docs/tracker.md`**

Change the heading at `docs/tracker.md:425` from:

```
### TD-17 — No component-test harness, so a class of regression is ungated · **Medium**
```

to:

```
### ~~TD-17~~ — No component-test harness, so a class of regression is ungated · **CLOSED 2026-08-04**
```

Then append to that entry, before the next `###`:

```markdown
**CLOSED 2026-08-04.** `vitest.config.ts` runs two projects — `unit` (node,
`*.test.ts`) and `dom` (jsdom, `*.test.tsx`) — so the file extension picks the
environment and no per-file docblock has to be remembered. jsdom and
`@testing-library/react` 16 are dev dependencies; `jest-dom` and
`@vitejs/plugin-react` were both deliberately not added, and the spec records
why.

Two render tests prove it, both aimed at this entry's own examples: the
interrogation's reasoning surviving a wrong answer, and `fieldName()` — which
is module-private, so the render is the only surface it has. Each was
teeth-checked by injecting exactly the defect it exists to catch and
confirming only that test failed.

**The convention is the half that makes this closed rather than possible.**
`web/PATTERNS.md` now states which components get a render test, and
`CLAUDE.md` carries it into the verification expectations. A capability with
no rule attached is what D-38 was, and D-52 had to replace it.

**Deferred:** no backfill across stage 03's other components, and the three
Playwright stand-ins at `e2e/audit.spec.ts:323`, `:360`, `:391` stay — deleting
a real-browser check because a jsdom one now exists is a trade with no evidence
behind it yet.
```

- [ ] **Step 6: Add the Completed row**

In `docs/tracker.md`, add a row at the top of the Completed table (immediately above the `| 2026-08-03 | W-3.3 |` row).

The counts below are **315 tests across 28 files** — 313 existing plus the two this round adds, in 26 existing files plus two new ones. Run `pnpm test` and use what it prints. If it disagrees with 315/28, the row takes the printed number and the disagreement goes in the task report, because it means something else changed.

```markdown
| 2026-08-04 | — | **Component test harness (TD-17).** `vitest.config.ts` split into two projects — `unit` (node, `*.test.ts`) and `dom` (jsdom, `*.test.tsx`) — so the extension picks the environment rather than a per-file docblock somebody has to remember. Three dev dependencies (`jsdom`, `@testing-library/react`, `@testing-library/dom`); `jest-dom` and `@vitejs/plugin-react` deliberately not added. A written convention in `web/PATTERNS.md` and `CLAUDE.md` says which components get one | 315 tests across 28 files, lint, typecheck and `format:check` clean, `pnpm gen:glossary` re-run with `reference/glossary.md` byte-identical, e2e still 14/14. Both render tests **teeth-checked by injecting the defect they exist to catch** — gating the interrogation's reasoning on `correct`, and making `fieldName` return its argument unchanged — each failing alone and reverted | No backfill across stage 03's remaining components; the three Playwright stand-ins in `audit.spec.ts` stay, since deleting a real-browser check on the strength of an hour-old jsdom one has no evidence behind it |
```

- [ ] **Step 7: Refresh `KICKOFF.md`**

Find the quality-gates line reading **"313 vitest tests across 26 files"** and update it to the count `pnpm test` actually printed (expected **315 across 28**), adding the project split:

```
  eslint at `--max-warnings 0`, **315 vitest tests across 28 files** in two projects — `unit`
  (node, data invariants) and `dom` (jsdom, render tests, `*.test.tsx`) — a **14-test playwright
  audit suite over 36 URLs**, lefthook hooks, and CI.
```

- [ ] **Step 8: Run the full gate**

From `web/`: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.

Then kill any server on port 3100 and run the audit suite — `playwright.config.ts` sets `reuseExistingServer: !process.env.CI`, so a second `test:e2e` in the same session silently measures the build from the first one (TD-27):

```bash
lsof -ti:3100 | xargs kill -9 2>/dev/null; sleep 1; pnpm test:e2e
```

Expected: **14 passed.**

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
docs(tracker): close TD-17 with the convention that makes it stick

The harness on its own closes TD-17 as "possible". PATTERNS.md and CLAUDE.md
now carry the rule — a component that derives what it displays from data,
rather than displaying it directly, gets a *.test.tsx — which is what makes it
closed. A capability with no rule attached is what D-38 was, and D-52 had to
replace it.

Also corrects the localStorage polyfill's docblock, which justified itself on
this project deliberately not carrying jsdom. It stays, because both importers
test lib/ modules rather than components and moving them would mean renaming a
module test to .test.tsx to buy a DOM it does not need — but the stated reason
had to stop being false.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification (after all tasks)

Run from `web/` unless stated. Every item is run, not reasoned about.

- [ ] `pnpm test` — both project names appear; the count is 313 + 2. No previously-passing test fails.
- [ ] `pnpm typecheck` — clean. `.test.tsx` is inside tsconfig's `include`, so testing-library's types compile or this fails.
- [ ] `pnpm lint` — zero warnings with the new files present.
- [ ] `pnpm format:check` — clean.
- [ ] `pnpm gen:glossary`, then `git status --short reference/glossary.md` from the repo root — **no modification**. The command filters by filename across projects, and it writes a committed deliverable.
- [ ] `lsof -ti:3100 | xargs kill -9; sleep 1; pnpm test:e2e` — 14 passed. Killing the server first is not optional (TD-27).
- [ ] Both teeth checks executed, each failing test named, each revert confirmed by a clean re-run. Raw output in the task reports.
- [ ] `git status --short` clean; `docs/tracker.md` no longer lists TD-17 as open.

**Watch for, and report rather than silence:**

- **React 19 `act()` warnings.** RTL 16's `fireEvent` wraps updates, so these should not appear. If one does, fix it — do not silence it. This repo's console standard is zero errors, and a warning produced by the harness itself is the kind that gets normalised.
- **Suite time.** The `dom` project adds jsdom startup to a suite that runs in about a second, on every push. If the total lands above roughly five seconds, say so in the report instead of absorbing it.
- **`matchMedia`.** jsdom does not implement it. Neither component in this plan uses it; the first one that does needs a stub in `src/test/setup.ts`. Expected, not a surprise.

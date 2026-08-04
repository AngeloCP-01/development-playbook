# Component test harness (TD-17) — design

**Status:** approved 2026-08-04
**Closes:** TD-17 (`docs/tracker.md`, "No component-test harness, so a class of regression is
ungated")
**Milestone:** none. This is debt paid down between rounds, before `W-5` and before the next
stage.

---

## Problem

`web/vitest.config.ts` sets `environment: 'node'` and `include: ['src/**/*.test.ts']`. Nothing
in this repository can render a component and assert on its output. Every one of the 313 tests
is module-level.

That leaves one failure shape completely ungated: **the data is right and the component ignores
it.** The case that opened the debt is still in the tree. `judgeInterrogation` returns `why` on
both the correct and the incorrect branch (`web/src/features/architecture/scoring.ts:206`), and
`scoring.test.ts:120-131` holds it to that with the rationale written into the test — *"an
exercise that explains itself only when you are right teaches the readers who least need it."*

Nothing holds `ModelInterrogation` to actually rendering it. Gating that paragraph on `correct`
would pass lint, typecheck, all 313 unit tests and the audit suite, while hiding the reasoning
from exactly the readers who got the answer wrong. The component's own docblock
(`ModelInterrogation.tsx:18-21`) says so out loud — *"gating it on `correct` here would quietly
undo that"* — which is a comment doing a test's job.

The same shape covers `fieldName()` (`SchemaInspector.tsx:33-36`), a module-private token parser
with no unit test and no way to reach it except through the render.

An interim gate landed instead: three Playwright tests (`e2e/audit.spec.ts:323`, `:360`, `:391`)
drive the real page and check that an exercise still explains itself after a wrong answer. Three
assertions covering two components, in a suite that takes a minute. It does not generalise, and
it is the wrong level for the question being asked.

**Why now.** Stage 03 added 42 components in `features/architecture` alone, 31 of them client
components, and every stage from here adds more. The cost of not having this rises with each one.

---

## Goals

1. A `*.test.tsx` file anywhere under `web/src/` renders a React component in a DOM and asserts
   on the output, run by the same `pnpm test` that CI and the pre-push hook already run.
2. The 313 existing tests keep running under `node`, unchanged, and do not pay for the DOM.
3. Two render tests prove the harness against the exact defect shape that opened TD-17, each
   teeth-checked by injecting that defect and confirming only the new test fails.
4. A written convention that says which components get a render test, so the capability does not
   sit unused.

## Non-goals

Each of these was considered and dropped, with the reason.

- **Backfilling render tests across stage 03's components.** Dropped as scope: the stage is
  merged, passing, and covered end to end by the audit suite. Backfilling it would make this
  round large enough to need its own review tier, and the value is in the floor for *future*
  stages, not in re-checking a finished one.
- **Retiring the three Playwright stand-ins** at `audit.spec.ts:323`, `:360`, `:391`. Dropped
  because deleting a real-browser check on the strength of a jsdom one that has existed for an
  hour is a trade with no evidence behind it. Revisit once the harness has caught something.
- **A test that fails when a feature directory has no `*.test.tsx`.** Dropped as a crude proxy:
  it is satisfied by one token test per directory, and it needs a definition of "interactive"
  that will argue with itself at every boundary. The convention is written down instead, and
  the per-task review is what enforces it.
- **`@testing-library/jest-dom`.** Dropped as unnecessary: `getByText` throws when it finds
  nothing, so the query *is* the assertion. The library buys `toBeInTheDocument()` phrasing,
  not coverage.
- **`@vitejs/plugin-react`.** Dropped as unnecessary: `tsconfig.json` sets `jsx: "react-jsx"`,
  so esbuild already emits the automatic runtime. The plugin's other job is fast refresh, which
  a test run has no use for.

---

## Constraints

- **Vitest 4 has removed `environmentMatchGlobs`.** Verified against the installed package:
  the string appears nowhere in `node_modules/vitest/`, while `projects?: TestProjectConfiguration[]`
  is in `dist/chunks/reporters.d.DtoKVV2s.d.ts:2859`. The per-file `// @vitest-environment`
  docblock still works. Any design that splits environments uses one of those two.
- **`@testing-library/react@16.3.2`** declares peers `react: ^18 || ^19` and
  `@testing-library/dom: ^10`. The DOM package is a peer, not a transitive dependency, so it is
  installed explicitly. The app is on React 19.2.4.
- **`.test.tsx` files fall inside `tsconfig.json`'s `include`** (`**/*.tsx`), so `pnpm typecheck`
  compiles them. Testing-library's types have to hold up, and that is a real gate.
- **`pnpm gen:glossary`** runs `vitest run src/lib/glossary.test.ts --update` and writes the
  generated `reference/glossary.md`. It must still work under a project split.
- **`lefthook.yml` pre-push** runs `pnpm typecheck` and `pnpm test`, so anything added here runs
  on every push.
- **`web/src/test/` is not empty.** It holds `localstorage-polyfill.ts`, imported for side effects
  by two `lib/` test files. Anything added to that directory has to leave those two working.

---

## Architecture

### Environment split — two vitest projects

`web/vitest.config.ts` gains a `projects` array. The root keeps `resolve.alias` so both projects
inherit the `@/*` mapping that lets `STAGE_CONTENT` resolve.

```ts
test: {
  projects: [
    {
      test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] },
    },
    {
      test: {
        name: 'dom',
        environment: 'jsdom',
        include: ['src/**/*.test.tsx'],
        setupFiles: ['./src/test/setup.ts'],
      },
    },
  ],
}
```

**The file extension picks the environment.** That is the whole point of choosing this over the
per-file docblock, and the reason is one this stage teaches about itself: a filter every query
must remember is a filter some query will forget, so the answer is structural rather than
cultural (`soft-delete.ts`, `FILTER_RULE`). A docblock is remembering. An extension is structure.

**Rejected: per-file `// @vitest-environment jsdom`.** Smaller diff — one line of config — but a
forgotten docblock surfaces as `document is not defined`, which reads like a broken component
rather than a missing comment. The failure mode is misleading, which is the expensive kind.

**Rejected: happy-dom in place of jsdom.** Roughly 2–3× faster startup, less spec-complete. The
suite runs in about a second, so there is no time to buy; and the components here lean on
`useSyncExternalStore`, hash-based routing and `matchMedia`, which is exactly the surface where
happy-dom's gaps appear — as a mysterious failure inside the harness installed to be trusted.

### Dependencies

Four dev dependencies, no runtime ones: `jsdom`, `@testing-library/react@^16`,
`@testing-library/dom@^10`. (`@types/react` and `@types/react-dom` are already present.)

### The existing `web/src/test/localstorage-polyfill.ts`

`src/test/` already exists, holding a hand-rolled Web Storage polyfill imported for side effects
by `architecture-sheet.test.ts` and `discovery-sheet.test.ts`. Its docblock justifies itself on a
premise this round removes: *"Pulling in jsdom or happy-dom for one test file would add a
dependency this project deliberately doesn't carry."*

**It stays, and its docblock is corrected.** Both importers are `.test.ts`, so they run in the
`unit` project under `node`, where there is still no `localStorage` and the polyfill still does
real work. What changes is why: it exists because those two suites are node-project tests, not
because a DOM is unavailable to the repository.

**Rejected: moving those two suites into the `dom` project to delete the polyfill.** They test
`lib/` modules, not components, and the extension convention would have to be broken to move
them — renaming a module test to `.test.tsx` to buy a DOM it does not otherwise need. The
polyfill is 40 lines and the deliberate choice it records is still the right one for node tests.

Leaving the docblock as written would be the more expensive option: a comment asserting the
project carries no DOM dependency, sitting two files from the one that installs it.

### `web/src/test/setup.ts`

One responsibility: RTL's cleanup between tests.

```ts
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)
```

If this file grows a second responsibility, that is a signal about the tests, not a convenience
to accept quietly. The one exception already anticipated is a `matchMedia` stub, and it belongs
here when the first component that needs it arrives — see Risks.

### File naming

A render test is `Component.test.tsx`, beside `Component.tsx`. This mirrors the existing
`data.ts` / `data.test.ts` pairing, so the file you want is where you would guess.

---

## Testing

### `ModelInterrogation.test.tsx`

Commit a **wrong** answer to one interrogation; assert the reasoning paragraph renders.

This is TD-17's original case, tested at the level it actually lives at. `scoring.test.ts:120-131`
already proves `judgeInterrogation` returns `why` for a wrong answer; this proves the component
puts it on screen.

**Teeth check:** gate the `why` paragraph on `correct` in `ModelInterrogation.tsx`, run the suite,
confirm this test fails and nothing else does. A test that survives that injection is a test that
would have let the original defect through.

### `SchemaInspector.test.tsx`

Select an annotated line; assert the field-name heading reads the identifier (`owner_id`) rather
than the whole SQL fragment.

`fieldName()` is module-private, so no unit test can reach it. The render is its only surface,
which makes it the cleanest illustration of what the harness is for.

**Teeth check:** make `fieldName` return `sql` unchanged; confirm this test fails and nothing
else does.

### How TDD applies, given neither test introduces production code

The RED is real and arrives for free. Written before the config change, both tests fail with
`document is not defined` — the harness being absent, which is the thing being built. The config
change is what turns them green.

The teeth checks above are what stop the tests being vacuous, and they are not optional: a green
render test that passes against the injected defect proves only that the file parses.

---

## Verification

Run against the tree, not asserted:

1. `pnpm test` — the 313 existing tests under `unit`, plus the two new ones under `dom`. Both
   project names appear in the output.
2. `pnpm typecheck` — `.test.tsx` compiles, testing-library's types included.
3. `pnpm lint` — zero warnings with the new files present.
4. `pnpm format:check` — clean.
5. `pnpm gen:glossary` re-run, and `reference/glossary.md` confirmed **byte-identical** to its
   committed state. Filename filters resolve across projects, but this command generates a
   committed deliverable, so it gets run rather than reasoned about.
6. `pnpm test:e2e` — still 14/14. Killing any server on `:3100` first, per TD-27.
7. Both teeth checks executed and their output pasted into the task report, including the
   confirmation that only the intended test failed.

---

## Documentation updates

- **`docs/tracker.md`** — close TD-17 with the evidence above. Add the round to Completed with
  its deferrals.
- **`web/PATTERNS.md`** — the convention: *a component that derives what it displays from data,
  rather than displaying the data directly, gets a `*.test.tsx`.* Written against the failure it
  prevents — a passing data test plus a component that ignores the data is green and wrong.
- **`CLAUDE.md`** — the `dom` project in the commands block, and the same rule in the
  verification-expectations section.
- **`KICKOFF.md`** — refresh the quality-gates line's test count and name the two projects, so a
  cold-started session knows a `.test.tsx` runs in a DOM without reading the config.
- **`web/src/test/localstorage-polyfill.ts`** — correct the docblock, per Architecture above.
  This is a documentation change, not a code one: the polyfill itself is unchanged.

---

## Risks

- **React 19 `act()` warnings.** State updates outside `act` produce console warnings. RTL 16's
  `fireEvent` wraps them, so this should not appear — but if it does it gets fixed, not silenced.
  This repo's console standard is zero errors, and a warning the harness itself produces is
  exactly the kind that gets normalised.
- **jsdom does not implement `matchMedia`.** Neither target component uses it. The first one that
  does will need a stub in `setup.ts`. Recorded here so it is expected rather than a surprise
  mid-task.
- **Suite time.** The DOM project adds jsdom startup to a suite that currently runs in about a
  second. It runs on every push. If it lands above roughly five seconds, that is worth a note in
  the task report rather than absorbing silently.
- **A harness that is installed and unused.** The real risk, and the reason the convention is in
  scope rather than deferred. `docs/learnings/decisions-need-tests-101.md` is about precisely
  this shape: D-38 was a recorded decision nothing enforced, and it drifted until D-52 replaced
  it. A capability with no rule attached is the same failure waiting.

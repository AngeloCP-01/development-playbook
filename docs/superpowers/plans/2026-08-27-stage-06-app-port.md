# Stage 06 — Testing: app port (W-3.6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `06-testing` renders as an interactive stage carrying every heading of
`docs/06-testing.md`, with the reader performing the doc's sorting question — *if this
breaks, how will I find out?* — rather than reading it stated.

**Architecture:** No extractions are needed; `AnnotatedArtifact` and `docSource` were both
made shared during stage 05. The route renders empty first so panels can be measured as
they fill. Then content arrives as doc-anchored data modules, then components, then seven
panels. Panels 3–5 carry one feature — discounted checkout — at three altitudes, so the
layers read as one thing at three heights rather than three unrelated snippets.

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript, Tailwind 4, Vitest (`unit` node +
`dom` jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-08-27-stage-06-testing-design.md`

## Global Constraints

- **Branch:** `feat/stage-06-testing`, already cut from `develop`. Never merge to `main`.
  **Ask before any merge**, including into `develop`. Run `git branch --show-current`
  before the first edit of every task — this bit twice in one recent session, the second
  time right after the first was written up.
- **Commit trailer, every commit:**
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
- **Conventional Commits**, `type(scope): subject`, lowercase after the colon. Scopes here:
  `web`, `testing`, `a11y`, `terms`, `test`, `tracker`, `task`, `plan`.
- **TDD is the iron law.** No production code without a failing test first. Paste **raw RED
  and GREEN terminal output** in the task report and state why the failure was the right
  one. A green test alone proves nothing.
- **No `@testing-library/jest-dom`. No `@testing-library/user-event`.** This project
  installs neither. Use `fireEvent` from `@testing-library/react` plus plain DOM assertions
  (`el.getAttribute(...)`, `(el as HTMLInputElement).checked`). Model:
  `src/components/RevealList.test.tsx`.
- **Never assert a rendered value against the data it came from.** A test shaped
  `expect(rendered).toBe(String(row.flag))` reads both sides off one row: flip the data and
  the expectation moves with it. Assert **literals**. This hole was found on a real stage 04
  render test.
- **Whole-fence equality for quoted code (D-66).** `artifacts.test.ts` asserts a block
  **equals** one of the doc's fences, never `toContain` — a substring is still contained, so
  containment cannot see an artifact that lost its last line.
- **Cite doc sections by heading, never by line number (D-42).** Go through `docSource`.
- **Pin a phrase from every sentence, not one phrase per passage.** Where a passage is two
  sentences, the pin from the **second** is mandatory. Stage 05 lost the second sentence
  three times, the third inside the fix wave built to close the first two.
- **Lift, do not retype.** `sed -n 'START,ENDp' docs/06-testing.md` and paste. Retyping is
  where clauses go.
- **Panel ceiling:** `PANEL_SCREENS_MAX = 4.0` at 1024×768, enforced in
  `web/e2e/audit.spec.ts`. This round targets **3.2**. **No new `PANEL_EXCEPTIONS` entry.**
- **No `setState` in an effect body.** `react-hooks/set-state-in-effect` is an error here.
- **Typecheck through `pnpm typecheck`**, never bare `tsc --noEmit` — route types come from
  `next typegen`.
- **`reference/glossary.md` is generated.** Never hand-edit. Run `pnpm gen:glossary`.
- All commands run from `web/`.

---

## File Structure

**Created — `src/features/testing/`:**

| Path | Responsibility |
|---|---|
| `steps.ts` | `STEP_IDS` tuple (7) + `StepId` type |
| `doc-source.ts` | `docSource('docs/06-testing.md')` re-export: `{ DOC, section, h2, flat, fences }` |
| `triage.ts` / `.test.ts` | Six changes, four shared options, answers, explanations — the spine's data |
| `teeth.ts` / `.test.ts` | Three (test, evidence) pairs; proven or not proven |
| `layers.ts` / `.test.ts` | F2: one feature, three tests, three altitudes |
| `probes.ts` / `.test.ts` | The six edge-case probes applied to `calculateTotal` |
| `artifacts.ts` / `.test.ts` | The doc's three fenced test files, verbatim and annotated |
| `checklist.ts` / `.test.ts` | The seven definition-of-done items |
| `traps.ts` / `.test.ts` | The doc's eight traps |
| `ai-plays.ts` / `.test.ts` | AI plays for this stage (D-35) |
| `prose.test.ts` | Markdown-link guard over every sibling module and this stage's `.tsx` prose |
| `TriageDrill.tsx` / `.test.tsx` | The spine. Six rows, four options, scored |
| `TeethCheck.tsx` / `.test.tsx` | Three rows, binary, scored |
| `LayerThread.tsx` / `.test.tsx` | F2's drawing |
| `TestingChecklist.tsx` / `.test.tsx` | Panel 7's definition of done |
| `AIPlays.tsx` / `.test.tsx` | Panel 7's AI plays |
| `Testing.tsx` | The seven panels, assembled through `Stepper` |

**Modified:**

| Path | Change |
|---|---|
| `src/lib/stages.ts` | `06-testing` → `ready: true` |
| `src/features/stage-content.ts` | Register `Testing` against `06-testing` |
| `src/lib/terms.ts` | Eight new terms |
| `src/lib/references.ts` | Stage 06 references |
| `reference/glossary.md` | Regenerated by `pnpm gen:glossary` |

**Created — repo root:**

| Path | Change |
|---|---|
| `docs/stage-06-status.md` | Coverage table + what was not ported, with reasons |

---

## Wave 0 — an empty route to measure into

### Task 1: `steps.ts`, an empty `Testing.tsx`, registered and ready

**Files:**
- Create: `web/src/features/testing/steps.ts`
- Create: `web/src/features/testing/steps.test.ts`
- Create: `web/src/features/testing/doc-source.ts`
- Create: `web/src/features/testing/Testing.tsx`
- Modify: `web/src/lib/stages.ts` (the `06-testing` entry, `ready: false` → `true`)
- Modify: `web/src/features/stage-content.ts`
- Modify: `web/src/features/step-ids.ts` (`STEP_IDS_BY_SLUG`)

**Interfaces:**
- Produces: `STEP_IDS` (a `readonly` tuple of seven ids), `type StepId`, and
  `{ DOC, section, h2, flat, fences }` from `./doc-source`. Every later task imports one or
  both.

The seven ids, fixed here and used by every assembly task:

```
'triage' · 'restraint' · 'unit' · 'integration' · 'e2e' · 'teeth' · 'done'
```

- [ ] **Step 1: Write the failing test**

Create `web/src/features/testing/steps.test.ts`:

```ts
import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

test('seven panels, in the order the doc builds its argument', () => {
  expect(STEP_IDS).toEqual([
    'triage',
    'restraint',
    'unit',
    'integration',
    'e2e',
    'teeth',
    'done',
  ])
})

test('ids are unique, because Stepper keys the URL hash on them', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})

/**
 * The three layer panels are consecutive and in ascending altitude. This is the
 * stage's one structural claim — panels 3-5 are one feature at three heights —
 * and it is asserted as literal index arithmetic rather than read off the data,
 * so reordering the tuple fails here rather than silently teaching three
 * unrelated snippets.
 */
test('unit, integration and e2e are consecutive and ascend', () => {
  const i = STEP_IDS.indexOf('unit')
  expect(STEP_IDS[i + 1]).toBe('integration')
  expect(STEP_IDS[i + 2]).toBe('e2e')
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/features/testing/steps.test.ts
```

Expected: FAIL — `Failed to resolve import "./steps"`. That is the right failure: the
module does not exist. A failure naming anything else means the test file is wrong.

- [ ] **Step 3: Write `steps.ts`**

```ts
/**
 * Stage 06's seven panels.
 *
 * `unit` → `integration` → `e2e` are deliberately consecutive: they carry one
 * feature — discounted checkout — at three altitudes, and the continuity is the
 * teaching. Three accurate snippets in isolation do not show a reader why the
 * layers are layers of one thing. `steps.test.ts` pins the adjacency.
 */
export const STEP_IDS = [
  'triage',
  'restraint',
  'unit',
  'integration',
  'e2e',
  'teeth',
  'done',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 4: Run it and confirm it passes**

```bash
cd web && pnpm vitest run src/features/testing/steps.test.ts
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Add `doc-source.ts`**

```ts
import { docSource } from '@/test/doc-source'

/** `docs/06-testing.md`. Tests only — it reads the filesystem at load. */
export const { DOC, section, h2, flat, fences } = docSource('docs/06-testing.md')
```

- [ ] **Step 6: Add an empty `Testing.tsx`**

Panels are placeholders here on purpose — the point of this task is a route that renders,
so later tasks can measure panel weight as they fill.

```tsx
import { Stepper, type Step } from '@/components/Stepper'
import { Prose, Section } from '@/components/ui'
import { type StepId } from './steps'

const STEPS: Step<StepId>[] = [
  { id: 'triage', label: 'If this breaks, how will I find out?' },
  { id: 'restraint', label: 'The tests not to write' },
  { id: 'unit', label: 'Underneath: the pure function' },
  { id: 'integration', label: 'One layer up: the action' },
  { id: 'e2e', label: 'On top: the money path' },
  { id: 'teeth', label: 'Proving a test bites' },
  { id: 'done', label: 'Done, and done on a team' },
].map((s) => ({
  ...s,
  body: (
    <Section>
      <Prose>Panel under construction.</Prose>
    </Section>
  ),
})) as Step<StepId>[]

export function Testing() {
  return <Stepper steps={STEPS} />
}
```

**Check `Step`'s actual shape before pasting this.** Read `src/components/Stepper.tsx` and
`src/features/development/Development.tsx`'s `STEPS` array; match the real field names
rather than the ones above if they differ. If they differ, say so in the task report — this
plan's version is written from stage 05 and could be stale.

- [ ] **Step 7: Register the stage — four files, not three**

`CLAUDE.md` describes a three-file trace. It is stale: TD-36 added a fourth, and
`src/features/rails.test.tsx:51` fails the build without it.

1. `src/lib/stages.ts`, the `06-testing` entry: `ready: false` → `ready: true`.
2. `src/features/stage-content.ts` — the import and the map entry:

```ts
import { Testing } from './testing/Testing'
```

```ts
  '06-testing': Testing,
```

3. `src/features/step-ids.ts` — the rail declaration:

```ts
import { STEP_IDS as TESTING } from './testing/steps'
```

```ts
  '06-testing': TESTING,
```

`STEP_IDS_BY_SLUG` is a *declaration*; `rails.test.tsx` and `e2e/audit-pages` are both
observations compared against it. That is why a third copy is not acceptable and why the file
exists at all — read its docblock before editing it.

Registering here also adds seven URLs to the audit sweep. That is expected, and it is why
Task 11 is the first task that runs `test:e2e`.

- [ ] **Step 8: Gate it**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test
```

Expected: all green. Report the test count — later tasks quote it as a baseline.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/testing web/src/lib/stages.ts web/src/features/stage-content.ts
git commit -m "feat(testing): render an empty stage 06 route to measure panels into

Seven panel ids fixed, with unit/integration/e2e pinned as consecutive and
ascending — the stage's one structural claim is that they are one feature at
three altitudes, so reordering them should fail a test rather than quietly
teach three unrelated snippets.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
## Wave 1 — the doc finishes, then content as data

### Task 2: `### AI in testing` — the section the doc is missing

**Files:**
- Modify: `docs/06-testing.md` (insert a new `###` section between "### Coverage" and the
  `---` that closes "## The work")

**Interfaces:**
- Produces: a `### AI in testing` section that `docSource`'s `section('AI in testing')` can
  cut, and that Task 7's `ai-plays.ts` reads. No code depends on it before Task 7.

**Why this task exists.** Stages 01–05 each carry an `### AI in <stage>` section
(`docs/01-product-discovery.md:114`, `02:170`, `03:1332`, `04:611`, `05:474`). Stage 06 has
none and does not mention AI once. D-35 makes AI plays a mandatory per-stage convention, and
the docs are the canonical deliverable — so the app cannot carry a panel the doc has no
source for. Found while planning this port, not by a reader.

**There is a failing test to write first, and it already exists.**
`src/lib/stage-metadata.test.ts:50` holds `AI_SECTION_STAGES`, an explicit slug list whose own
comment says it "grows by one slug per stage built... so the section lands with the doc
amendment at the start of a stage round rather than at the end when `ready` flips". That is
this task. So this is a normal red-green cycle, not the prose exception.

**Two constraints on this section, both binding, both because a later task depends on them:**

- **Exactly six bullets.** Task 7's `ai-plays.test.ts` counts them out of the doc. The
  humanizer pass may reword a bullet; it may not merge, split, add or remove one. If it
  proposes such a change, decline it and say so in the report.
- **No fenced code block.** Task 3 asserts the doc still has exactly three fences. A fourth
  would fail it.

- [ ] **Step 1: Confirm the insertion point**

```bash
grep -n "^### Coverage\|^## Artifacts" docs/06-testing.md
```

Expected: `### Coverage` around line 211, `## Artifacts` around line 223, with a `---` between
them. The new section goes **after** Coverage's last paragraph and **before** that `---`, so
it stays inside "## The work" — which is where every other stage puts it.

- [ ] **Step 2: Write the failing test**

Add `'06-testing'` to `AI_SECTION_STAGES` in `src/lib/stage-metadata.test.ts`, after
`'05-development'`.

```bash
cd web && pnpm vitest run src/lib/stage-metadata.test.ts
```

Expected: FAIL — `06-testing has no "### AI in ..." subsection`. That is the right failure.
Anything else means the list was edited in the wrong place.

- [ ] **Step 3: Write the section**

Insert verbatim:

```markdown
### AI in testing

Generating tests is the most tempting thing to hand over on this page and the most dangerous,
for one reason: the output is green either way. A test that cannot fail looks exactly like a
test that passes, and a suite grown that way gets larger without anyone's confidence growing
with it. The question to keep asking is not "did it write a test" but "has this test ever been
red".

Where it earns its place:

- **Enumerate the edge cases for a function you describe** (a saved command). Empty, zero,
  negative, very large, null, duplicates — producing the *list* is a different job from
  producing the assertions, and it is the half that gets skipped when you are tired.
- **Turn a bug report into a failing test before anything is fixed** (a skill).
  `test-driven-development` enforces the order, and a bug report is already a description of
  behaviour, which is the input that method wants.
- **Write the seeding and reset helpers** (a saved command). `src/test/helpers.ts` is
  mechanical once the schema exists, and mechanical translation is where models are reliable.
- **Turn a manual QA script into a Playwright spec** (a saved command). Ask for role and
  accessible-name selectors explicitly; left alone, a model will reach for the CSS class it
  can see in the markup.
- **Check a testing API against the version actually installed** (an MCP). This repository
  installs neither `@testing-library/jest-dom` nor `@testing-library/user-event`, and a model
  writing from memory reaches for `toBeInTheDocument` by default — about twenty tests in one
  stage's plan here were written that way and would have failed on `Invalid Chai property`
  rather than on anything real. `context7` reads the installed version instead of guessing.
- **Check what flaked before** (memory). `claude-mem` answers "have I seen this test go red
  intermittently, and what was it", which is the question a retry-rate dashboard answers on a
  team and nothing answers alone.

Named tools, so this is actionable: `test-driven-development` from the Superpowers plugin,
`context7` for version-accurate docs, `claude-mem` for what flaked before.

What none of this replaces: watching the test fail. A generated test that has never been red
is a decoration, and the teeth check above is the only thing that tells the two apart. Asking
for the failing run is cheap; assuming it happened is how a suite becomes ballast.
```

- [ ] **Step 4: Run the prose pass**

Invoke `humanizer:humanizer` over the new section only. Apply the fixes that make it clearer;
skip any that would flatten the voice the surrounding doc already has. Say in the report which
flags you accepted and which you declined, with a reason for each declined one.

- [ ] **Step 5: Check nothing downstream broke**

```bash
cd web && pnpm test
```

Expected: green, and **one more passing test than Task 1** — the `stage-metadata` case
added in Step 2 now passes rather than failing. Several stage-05 tests read
`docs/06-testing.md` indirectly through cross-stage link checks; a heading inserted in the
wrong place can move a section boundary. If the count changed, stop and report — that is a
real finding, not noise to push through.

- [ ] **Step 6: Commit**

```bash
git add docs/06-testing.md web/src/lib/stage-metadata.test.ts
git commit -m "docs(testing): add the AI in testing section stage 06 was missing

Stages 01-05 each carry an 'AI in <stage>' section; 06 did not mention AI at
all. D-35 makes the per-stage convention mandatory, and the docs are the
canonical deliverable, so the app cannot carry a panel with no doc source.

Leads on the failure mode specific to this stage rather than the generic
warning: generated tests are green either way, so the question is whether the
test has ever been red, not whether it exists.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `artifacts.ts` — the doc's three test files, lifted

**Files:**
- Create: `web/src/features/testing/artifacts.ts`
- Create: `web/src/features/testing/artifacts.test.ts`

**Interfaces:**
- Consumes: `fences` from `./doc-source` (Task 1).
- Produces: `ARTIFACTS: Record<string, Artifact>` with exactly the keys `pricing`,
  `actions`, `checkout`. Tasks 11 and 12 render them through `AnnotatedArtifact`.

**The type is already shared** — `import { type Artifact } from '@/components/artifact'`.
`ArtifactLine` is `{ text: string; note?: string; pivot?: boolean }`; `Artifact` is
`{ id, filename, language, lines }` with `language` one of
`'json' | 'jsonc' | 'yaml' | 'ts' | 'tsx' | 'bash'`. All three blocks here are `'ts'`.

- [ ] **Step 1: Lift the three blocks, do not retype them**

```bash
cd /Users/angelito/personal/Development-Playbook
sed -n '55,77p' docs/06-testing.md    # the pricing unit tests
sed -n '90,120p' docs/06-testing.md   # the updateInvoice integration tests
sed -n '134,146p' docs/06-testing.md  # the checkout E2E spec
```

Paste each into `lines[].text`, one array entry per line, blank lines included as
`{ text: '' }`. **Confirm the line ranges before trusting them** — this plan's numbers were
correct when it was written and Task 2 inserted a section above none of them, but check.

- [ ] **Step 2: Write the failing test**

Create `web/src/features/testing/artifacts.test.ts`:

```ts
import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'
import { fences } from './doc-source'

const BLOCKS = fences()

test('the doc still has the three blocks this module was cut from', () => {
  expect(BLOCKS).toHaveLength(3)
})

test('the key list is pinned, so a new doc block does not surface here on its own', () => {
  expect(Object.keys(ARTIFACTS)).toEqual(['pricing', 'actions', 'checkout'])
})

/**
 * `toContain` over the whole-block array, never a substring match against one
 * block (D-66). A substring of a block is still contained, so containment
 * cannot see an artifact that has lost its last line — and the last line is
 * where the closing brace lives. The reader is meant to paste these.
 */
test.each(Object.entries(ARTIFACTS))(
  '%s equals a whole fenced block from the doc, not a substring of one',
  (key, artifact) => {
    const text = artifact.lines.map((l) => l.text).join('\n')
    expect(BLOCKS, key).toContain(text)
  },
)

test('every artifact carries at most one pivot, since a pivot is the line the panel turns on', () => {
  for (const [key, artifact] of Object.entries(ARTIFACTS)) {
    expect(
      artifact.lines.filter((l) => l.pivot === true).length,
      key,
    ).toBeLessThanOrEqual(1)
  }
})

/**
 * The three pivots, pinned as literals rather than read off the data. A test
 * shaped `expect(pivot).toBe(artifact.lines.find(l => l.pivot).text)` reads
 * both sides off one row and proves nothing.
 *
 * Each is the line its panel's judgment turns on, and each is a different kind
 * of judgment: an edge case that returns zero rather than a negative, an
 * assertion that an attacker was refused, and an assertion selected by what the
 * user can actually see.
 */
const pivotText = (key: keyof typeof ARTIFACTS) =>
  ARTIFACTS[key].lines.find((l) => l.pivot === true)?.text

test('the unit panel pivots on the edge case, not the happy path', () => {
  expect(pivotText('pricing')).toContain('never returns a negative total')
})

test('the integration panel pivots on the refusal, which the doc calls the more valuable test', () => {
  expect(pivotText('actions')).toContain(
    'refuses to update an invoice owned by someone else',
  )
})

test('the e2e panel pivots on the role-and-name selector', () => {
  expect(pivotText('checkout')).toContain("getByRole('button', { name: 'Buy now' })")
})
```

- [ ] **Step 3: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/features/testing/artifacts.test.ts
```

Expected: FAIL — `Failed to resolve import "./artifacts"`. If instead it fails on
`toHaveLength(3)`, the doc has a different number of fences than this plan assumed: stop,
count them, and report the real number rather than editing the expectation to match.

- [ ] **Step 4: Write `artifacts.ts`**

Structure — the notes below are the authored half and are what the reader is actually here
for. Annotate **only lines that carry a decision**; leave imports and closing braces inert.

```ts
import { type Artifact } from '@/components/artifact'

/**
 * The three fenced blocks in `docs/06-testing.md`, quoted verbatim and
 * annotated.
 *
 * They are one feature at three altitudes — a discounted checkout, tested
 * underneath as a pure function, across the seam as a Server Action against a
 * real database, and end to end as the money path. The doc never says so out
 * loud; the panels do, because three snippets that happen to share a domain
 * teach less than one feature shown at three heights.
 *
 * `artifacts.test.ts` asserts each block **equals** one of the doc's fences
 * rather than being contained by one (D-66). The reader is meant to paste
 * these, so a block that drifts is worse than a diagram that drifts.
 */
export const ARTIFACTS: Record<string, Artifact> = {
  pricing: {
    id: 'pricing',
    filename: 'src/features/billing/pricing.test.ts',
    language: 'ts',
    lines: [
      // ...lifted lines, with notes on the decision-carrying ones
    ],
  },
  actions: { id: 'actions', filename: 'src/features/billing/actions.test.ts', language: 'ts', lines: [] },
  checkout: { id: 'checkout', filename: 'e2e/checkout.spec.ts', language: 'ts', lines: [] },
}
```

Notes to author, one per decision-carrying line. These are the annotations, not suggestions
for them — write these, adapting only where the lifted line differs from what this plan saw:

| Artifact | Line | Note |
|---|---|---|
| `pricing` | `expect(result).toBe(19_440)` | The arithmetic is in the doc's own trailing comment: 20000 less 10% is 18000, plus 8% is 19440. Money is in integer cents throughout, never floats — `0.1 + 0.2 !== 0.3` is a real bug that reaches real invoices. |
| `pricing` | `it('never returns a negative total', ...)` **pivot** | The more valuable of the two. Happy paths tend to work; edge cases are where bugs live. A 200% discount is not a realistic input, which is exactly why nobody wrote the branch that handles it. |
| `actions` | `beforeEach(async () => { await resetDb() })` | A real Postgres instance, not a mock. Mocking the database tests your mock — it cannot see a constraint violation, a transaction bug, or a malformed query. Docker locally, a service container in CI. |
| `actions` | `it('refuses to update an invoice owned by someone else', ...)` **pivot** | Write this second test for every action that touches user-owned data. Authorization bugs are the most damaging class in this kind of application and the easiest to introduce during a refactor, and a test proving an attacker is refused is worth more than a hundred tests of the happy path. |
| `actions` | `expect((await getInvoice(invoice.id, owner.id)).amount).toBe(100)` | The refusal is only half the assertion. This line proves nothing was written — an action that returns an error and mutates anyway would pass without it. |
| `checkout` | `await page.getByRole('button', { name: 'Buy now' }).click()` **pivot** | Role and accessible name, never a CSS class. This survives restyling and breaks only when the user-visible thing actually changes, which is when you want it to break. It also means an inaccessible UI produces failing tests, which is a useful accident. |
| `checkout` | `test('a user can complete a purchase @smoke', ...)` | The tag is what lets the critical few run against production after a deploy (stage 14). Five good E2E tests beat fifty mediocre ones; this is one of the five. |

- [ ] **Step 5: Run it and confirm it passes**

```bash
cd web && pnpm vitest run src/features/testing/artifacts.test.ts
```

Expected: PASS, 9 tests.

- [ ] **Step 6: Teeth check**

Delete the last line of the `checkout` artifact (the closing `})`), rerun, and confirm the
whole-block equality test fails. **Confirm the deletion actually landed in the file before
trusting the result** — a mutation that never applied reads exactly like a toothless test.
Restore, rerun, confirm green. Paste both runs and the `git diff` of the mutation.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/testing/artifacts.ts web/src/features/testing/artifacts.test.ts
git commit -m "feat(testing): lift the doc's three test files as annotated artifacts

One feature at three altitudes rather than three snippets that share a domain.
Each carries exactly one pivot, and the three pivots are different kinds of
judgment: an edge case that returns zero, an assertion that an attacker was
refused, and a selector chosen by what the user can see.

Whole-fence equality per D-66 — a substring match cannot see a block that lost
its last line, and the reader is meant to paste these.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
### Task 4: `triage.ts` — the spine's data

**Files:**
- Create: `web/src/features/testing/triage.ts`
- Create: `web/src/features/testing/triage.test.ts`

**Interfaces:**
- Consumes: `section` from `./doc-source` (Task 1).
- Produces:

```ts
export type TriageOption = { id: TriageAnswer; label: string }
export type TriageAnswer = 'unit' | 'integration' | 'e2e' | 'none'
export type Change = {
  id: string
  change: string
  options: TriageOption[]
  answer: TriageAnswer
  explanation: string
}
export const OPTIONS: TriageOption[]
export const CHANGES: Change[]
```

Task 8 (`TriageDrill`) is the only consumer.

- [ ] **Step 1: Write the failing test**

Create `web/src/features/testing/triage.test.ts`:

```ts
import { expect, test } from 'vitest'
import { CHANGES, OPTIONS } from './triage'
import { section } from './doc-source'

/**
 * The four options are the doc's four tiers, so the drill teaches the
 * distribution by making the reader place things into it rather than by
 * listing it. Pinned as literals: reading the labels off `OPTIONS` would let a
 * renamed tier move the expectation with it.
 */
test('the four options are the distribution, in descending volume', () => {
  expect(OPTIONS.map((o) => o.id)).toEqual([
    'unit',
    'integration',
    'e2e',
    'none',
  ])
})

test('every change offers the same four options, so the reader has to read the change', () => {
  for (const c of CHANGES) {
    expect(c.options, c.id).toBe(OPTIONS)
  }
})

test('six changes, unique ids, every answer a real option', () => {
  expect(CHANGES).toHaveLength(6)
  expect(new Set(CHANGES.map((c) => c.id)).size).toBe(6)
  const ids = OPTIONS.map((o) => o.id)
  for (const c of CHANGES) expect(ids, c.id).toContain(c.answer)
})

/**
 * The answer spread is itself the lesson: the shape of the set mirrors the
 * shape of a real suite. Asserted as a literal tally rather than "at least one
 * of each", which a set of six identical answers would also satisfy.
 */
test('the answers mirror the distribution the doc describes', () => {
  const tally = CHANGES.reduce<Record<string, number>>((acc, c) => {
    acc[c.answer] = (acc[c.answer] ?? 0) + 1
    return acc
  }, {})
  expect(tally).toEqual({ unit: 2, integration: 1, e2e: 1, none: 2 })
})

/**
 * Pins against the doc, one phrase per sentence.
 *
 * The first sentence of the doc's sorting question is the famous half and the
 * one a transcription keeps. The second is the half that makes it usable —
 * it names both branches and what each implies — and it is the half stage 05
 * lost three times over. Both are pinned; the second is why this test exists.
 */
test('the sorting question keeps both halves, not just the memorable one', () => {
  const s = section('The one question worth asking')
  expect(s).toMatch(/if this breaks, how will I find out/i)
  expect(s).toMatch(/a user emails me.{0,40}write a test/is)
  expect(s).toMatch(/the typechecker\s+catches it.{0,60}you already have that coverage for free/is)
})

/**
 * Each explanation says why a wrong reading was tempting, not only why the
 * right answer is right. Enforced structurally: a one-sentence explanation
 * cannot do both jobs, and the failure mode here is an explanation that
 * restates the answer.
 */
test('every explanation is at least two sentences, because one cannot both answer and account for the temptation', () => {
  for (const c of CHANGES) {
    const sentences = c.explanation.split(/(?<=[.?])\s+/).filter(Boolean)
    expect(sentences.length, `${c.id}: ${c.explanation}`).toBeGreaterThanOrEqual(2)
  }
})

test('the two "nothing" rows refuse for different reasons, or one of them is redundant', () => {
  const none = CHANGES.filter((c) => c.answer === 'none')
  expect(none.map((c) => c.id)).toEqual(['badge', 'route'])
  expect(none[0].explanation).toMatch(/typechecker/i)
  expect(none[1].explanation).toMatch(/framework|Next\.js routing/i)
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/features/testing/triage.test.ts
```

Expected: FAIL — `Failed to resolve import "./triage"`.

- [ ] **Step 3: Write `triage.ts`**

```ts
/**
 * The stage's spine: six changes, sorted by the doc's own question.
 *
 * "Not what is my coverage, but: if this breaks, how will I find out?" The four
 * options are the four tiers of the doc's distribution, so a reader learns the
 * shape by placing changes into it rather than by reading it listed.
 *
 * Every change offers the same four options. That is `blockers.ts`'s device
 * (`src/features/setup/blockers.ts`) and it is taken deliberately: a shared
 * option set means a reader who has learned the tiers still has to read the
 * change rather than recognise the shape of the list.
 *
 * Two of the six answer "nothing", for two different reasons — the typechecker
 * already proves it, and the framework's own behaviour is not yours to test.
 * A single "nothing" row would teach the exception; two teach that it has
 * grounds.
 */
export type TriageAnswer = 'unit' | 'integration' | 'e2e' | 'none'
export type TriageOption = { id: TriageAnswer; label: string }

export const OPTIONS: TriageOption[] = [
  { id: 'unit', label: 'A unit test over a pure function' },
  { id: 'integration', label: 'An integration test against a real database' },
  { id: 'e2e', label: 'An E2E test on the critical path' },
  { id: 'none', label: 'Nothing — that coverage is already free' },
]

export type Change = {
  id: string
  change: string
  options: TriageOption[]
  answer: TriageAnswer
  explanation: string
}

export const CHANGES: Change[] = [
  {
    id: 'discount',
    change: 'A new discount rule: a percentage off, applied before tax.',
    options: OPTIONS,
    answer: 'unit',
    explanation:
      'The calculation is a pure function of its inputs, so the cheapest place to catch it is also the most precise about what broke. If this is wrong a customer is overcharged and tells you before you notice, which is the doc’s own trigger for writing a test. Reaching for an E2E test here buys something slower and flakier that reports a wrong total without saying which branch produced it.',
  },
  {
    id: 'refusal',
    change:
      '`updateInvoice` gains an `amount` field. The `where` clause already scopes by owner.',
    options: OPTIONS,
    answer: 'integration',
    explanation:
      'The bug you are looking for is not inside the function, it is between the layers — an ORM that drops an unknown column, a constraint the schema has and the type does not. A unit test with a mocked database would test the mock and stay green through all of it. This is also the action that needs the refusal test: prove an attacker is turned away, because authorization is the most damaging omission on this page.',
  },
  {
    id: 'badge',
    change:
      "A presentational `<Badge>` gains a `tone` prop typed `'go' | 'warn' | 'danger'`.",
    options: OPTIONS,
    answer: 'none',
    explanation:
      'The typechecker already rejects every misuse this prop has, and a test that repeats a type-level guarantee is redundant the day it is written. What makes it tempting is that it is easy — which is exactly the property a coverage target rewards and risk does not.',
  },
  {
    id: 'provider',
    change:
      'Card payment moves to a different provider. The checkout page’s markup is unchanged.',
    options: OPTIONS,
    answer: 'e2e',
    explanation:
      'This is the money path, and its failure mode is that every layer passes its own tests while the purchase still does not complete. A unit test and an integration test would both be green against the new provider’s happy path; only a run through the real page catches a redirect that never comes back. Five good E2E tests beat fifty mediocre ones, and this is one of the five.',
  },
  {
    id: 'cents',
    change: 'Prices move from floats to integer cents across billing.',
    options: OPTIONS,
    answer: 'unit',
    explanation:
      'A refactor that is meant to change nothing is precisely what a unit test protects, because "nothing changed" is a claim and not an observation. Assert the edges rather than the happy path: `0.1 + 0.2 !== 0.3` reaches real invoices, and rounding surfaces on totals nobody thought to check.',
  },
  {
    id: 'route',
    change: 'A route moves from `/invoices` to `/billing/invoices`.',
    options: OPTIONS,
    answer: 'none',
    explanation:
      'Next.js routing works, and proving it is not your responsibility. What is worth a moment is whether anything still links to the old path — and that is a grep, not a test.',
  },
]
```

- [ ] **Step 4: Run it and confirm it passes**

```bash
cd web && pnpm vitest run src/features/testing/triage.test.ts
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Teeth check**

Change `badge`'s answer from `'none'` to `'unit'`. Rerun. **Two tests must fail** — the tally
test and the two-reasons test — and nothing else. Confirm the edit landed (`git diff`),
restore, rerun green. Paste both runs.

If only one fails, say so: it means the tally and the reasons test overlap more than intended
and one of them is not earning its place.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/testing/triage.ts web/src/features/testing/triage.test.ts
git commit -m "feat(testing): six changes to triage, sharing one option set

The four options are the doc's four tiers, so the reader learns the
distribution by placing changes into it rather than by reading it listed.
Every row offers the same four, which is blockers.ts's device: a reader who
has learned the tiers still has to read the change.

Two rows answer 'nothing' for two different reasons — a typechecker guarantee
and framework behaviour. One would teach the exception; two teach it has
grounds.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: `teeth.ts` — three tests, and whether they bite

**Files:**
- Create: `web/src/features/testing/teeth.ts`
- Create: `web/src/features/testing/teeth.test.ts`

**Interfaces:**
- Consumes: `section` from `./doc-source` (Task 1).
- Produces:

```ts
export type Case = {
  id: string
  title: string
  code: string        // the test, as written
  evidence: string    // what was offered as proof it bites
  proven: boolean
  verdict: string
}
export const CASES: Case[]
```

Task 9 (`TeethCheck`) is the only consumer.

**The three cases are this repository's own**, from
`docs/learnings/stage-implementation-101.md`. Two are the documented ways a teeth check lies;
the third is what a real one looks like.

- [ ] **Step 1: Write the failing test**

Create `web/src/features/testing/teeth.test.ts`:

```ts
import { expect, test } from 'vitest'
import { CASES } from './teeth'
import { section } from './doc-source'

/**
 * The verdict assertion is a literal, on purpose. A test shaped
 * `expect(rendered).toBe(String(c.proven))` reads both sides off the same row,
 * so flipping a case's verdict moves the expectation with it and the test
 * proves nothing — which is, with some irony, the exact failure this module
 * is about.
 */
test('exactly one of the three bites, and it is the literal-assertion case', () => {
  expect(CASES).toHaveLength(3)
  expect(CASES.filter((c) => c.proven).map((c) => c.id)).toEqual(['literal'])
})

test('the two failures are different failures, or the second teaches nothing new', () => {
  const notProven = CASES.filter((c) => !c.proven)
  expect(notProven.map((c) => c.id)).toEqual(['same-source', 'stray-mutation'])
  expect(notProven[0].verdict).toMatch(/same row|both sides/i)
  expect(notProven[1].verdict).toMatch(/never (landed|reached)|did not (land|apply)/i)
})

test('ids are unique, because the drill keys its state on them', () => {
  expect(new Set(CASES.map((c) => c.id)).size).toBe(CASES.length)
})

/**
 * Pins the doc's teeth-check section, one phrase per sentence.
 *
 * "Prove it bites" is the memorable half. "Both outputs go in the task report"
 * is the half that makes it a practice rather than a sentiment, and it is the
 * kind of trailing clause that goes missing in a transcription.
 */
test('the teeth-check section keeps the procedure and the reporting requirement', () => {
  const s = section('The teeth check')
  expect(s).toMatch(/green proves nothing, because the test never failed/i)
  expect(s).toMatch(/deliberately break the implementation/i)
  expect(s).toMatch(/and only that test.{0,20}fails/is)
  expect(s).toMatch(/Both outputs go in the task report/i)
})

/**
 * The doc grounds the section in this repo's own gate. That sentence is
 * evidence rather than decoration — it is what makes the section a report
 * instead of advice — so it is pinned separately.
 */
test('the section keeps the evidence that the gate passed a bad commit twice', () => {
  const s = section('The teeth check')
  expect(s).toMatch(/passed a deliberately bad commit twice/i)
  expect(s).toMatch(/eslint exits 0 on warnings/i)
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/features/testing/teeth.test.ts
```

Expected: FAIL — `Failed to resolve import "./teeth"`.

- [ ] **Step 3: Write `teeth.ts`**

```ts
/**
 * Three tests and the evidence offered that each one bites. The reader judges
 * whether the evidence actually proves anything.
 *
 * All three are this repository's, from
 * `docs/learnings/stage-implementation-101.md`. Two are the documented ways a
 * teeth check lies while looking exactly like a pass; the third is what a real
 * one looks like. They are in that order because recognising the lie is the
 * skill — a reader shown the good one first reads the other two as obviously
 * broken, which they were not to the people who wrote them.
 */
export type Case = {
  id: string
  title: string
  /** The test as written. */
  code: string
  /** What was offered as proof that it bites. */
  evidence: string
  proven: boolean
  verdict: string
}

export const CASES: Case[] = [
  {
    id: 'same-source',
    title: 'A render test over a data-driven badge',
    code: `const gate = GATES.find((g) => g.id === 'browser')!
render(<GateRow gate={gate} />)
expect(screen.getByTestId('catches').getAttribute('data-catches'))
  .toBe(String(gate.catchesIt))`,
    evidence:
      'The author flipped `catchesIt` to `false` in the data module, reran, and the test failed. Restored, and it passed again.',
    proven: false,
    verdict:
      'Both sides of the assertion come off the same row, so flipping the data moved the expectation along with the render and the test could not tell the difference. It failed for a reason that had nothing to do with the component — and it would stay green if the component ignored `catchesIt` entirely, which is the bug it was written to prevent. The fix is a literal: exactly one gate catches this, and it is the browser.',
  },
  {
    id: 'stray-mutation',
    title: 'A test over a type-role class name',
    code: `render(<TitleBlock stage={stage} />)
expect(screen.getByText('Testing').className).toContain('t-display')`,
    evidence:
      "The author ran `perl -0pi -e 's/className=\"t-data\"/className=\"x\"/'` against the component, reran, and reported the test failed as expected.",
    proven: false,
    verdict:
      'Without `/g`, that substitution replaces the first occurrence in the slurped file — which was a mention inside a docblock, not the JSX. The code the test covers never changed, so nothing was proven either way, and the run said what the author expected it to say. Confirm the mutation is actually in the file, with a diff, before trusting what the run reports.',
  },
  {
    id: 'literal',
    title: 'A test over which gate catches a warning',
    code: `render(<GateTable gates={GATES} />)
const caught = screen.getAllByRole('row')
  .filter((r) => r.getAttribute('data-catches') === 'true')
expect(caught).toHaveLength(1)
expect(caught[0].textContent).toContain('Browser')`,
    evidence:
      'The author deleted the `data-catches` attribute from the row component, confirmed the deletion with `git diff`, reran, and this test failed while the twelve others in the file passed. Restored, reran, all thirteen green.',
    proven: true,
    verdict:
      'The expectation is a literal the data cannot move: exactly one row, and it is the browser. The mutation was confirmed in the file rather than assumed, and only the test under examination failed — a mutation that takes down half the suite tells you the suite is coupled, not that this test bites.',
  },
]
```

- [ ] **Step 4: Run it and confirm it passes**

```bash
cd web && pnpm vitest run src/features/testing/teeth.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Teeth check**

Flip `literal`'s `proven` to `false`. Rerun: the first test must fail naming the id list.
Confirm the edit landed, restore, rerun green. Paste both runs.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/testing/teeth.ts web/src/features/testing/teeth.test.ts
git commit -m "feat(testing): three teeth checks, two of which lie

Both failure modes are this repo's own — an assertion reading both sides off
one data row, and a non-global perl substitution that mutated a docblock
instead of the JSX. The good one comes last on purpose: a reader shown it
first reads the other two as obviously broken, which they were not to the
people who wrote them.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
### Task 6: `layers.ts` and `probes.ts` — F2's data and the six edge cases

**Files:**
- Create: `web/src/features/testing/layers.ts`, `layers.test.ts`
- Create: `web/src/features/testing/probes.ts`, `probes.test.ts`

**Interfaces:**
- Consumes: `section`, `h2` from `./doc-source` (Task 1).
- Produces:

```ts
// layers.ts
export type Layer = {
  id: 'unit' | 'integration' | 'e2e'
  label: string
  target: string      // what it calls, in the running example
  volume: string      // the doc's own word: 'Many' | 'Some' | 'Few'
  speed: string
  proves: string
  blind: string       // what this layer cannot see — the reason the next one exists
}
export const LAYERS: Layer[]   // length 3, ascending

// probes.ts
export type Probe = { id: string; input: string; catches: string }
export const PROBES: Probe[]   // length 6
```

Consumers: `LayerThread` (Task 10) and the `unit` panel (Task 11).

**`blind` is the field that makes this a thread rather than a table.** Each layer's blind spot
is the next layer's reason to exist, so the three rows read as a chain. Without it F2 is three
independent definitions, which is exactly the shape the `sdlc` round was rewritten to escape.

- [ ] **Step 1: Write the failing tests**

`web/src/features/testing/layers.test.ts`:

```ts
import { expect, test } from 'vitest'
import { LAYERS } from './layers'
import { section } from './doc-source'

test('three layers, ascending, one feature', () => {
  expect(LAYERS.map((l) => l.id)).toEqual(['unit', 'integration', 'e2e'])
})

/**
 * The volumes are the doc's own words, pinned as literals. "Many / Some / Few"
 * is the distribution's whole claim compressed into three words, and a
 * paraphrase ("lots", "a handful") would keep the shape while losing the
 * doc's language.
 */
test("the volumes are the doc's, not a paraphrase", () => {
  expect(LAYERS.map((l) => l.volume)).toEqual(['Many', 'Some', 'Few'])
  const s = section('The distribution')
  expect(s).toMatch(/\*\*Many unit tests\*\*/)
  expect(s).toMatch(/\*\*Some integration tests\*\*/)
  expect(s).toMatch(/\*\*Few E2E tests\*\*/)
})

/**
 * The chain: each layer's blind spot is why the next one exists. Asserted as a
 * property of the set rather than by matching prose, so an editor who rewrites
 * a `blind` string still has to leave one there.
 */
test("every layer names what it cannot see, because that is the next layer's reason to exist", () => {
  for (const l of LAYERS) {
    expect(l.blind.length, l.id).toBeGreaterThan(30)
  }
})

test("the doc's claim about integration tests is carried, both halves", () => {
  const s = section('The distribution')
  expect(s).toMatch(/best value-per-test in the whole suite/i)
  expect(s).toMatch(/most real bugs live between the layers rather than inside them/i)
})
```

`web/src/features/testing/probes.test.ts`:

```ts
import { expect, test } from 'vitest'
import { PROBES } from './probes'
import { section } from './doc-source'

/**
 * The six are the doc's own list, in the doc's order, pinned as literals. The
 * sentence they come from is the second of a two-sentence passage — the first
 * says edge cases are where bugs live, the second is the list that makes it
 * something a reader can do. That is the half stage 05 lost three times.
 */
test("the six probes are the doc's list, in the doc's order", () => {
  expect(PROBES.map((p) => p.id)).toEqual([
    'empty',
    'zero',
    'negative',
    'large',
    'null',
    'duplicates',
  ])
  const s = section('Unit tests')
  expect(s).toMatch(/Happy paths tend to work; edge cases are where\s+bugs live/is)
  expect(s).toMatch(/empty input, zero, negative, very large, null,\s+duplicates/is)
})

test('every probe says what it would catch in the running example, not what it is', () => {
  for (const p of PROBES) {
    expect(p.catches, p.id).toMatch(/total|discount|tax|price|quantity|item/i)
  }
})

test('ids are unique', () => {
  expect(new Set(PROBES.map((p) => p.id)).size).toBe(PROBES.length)
})
```

- [ ] **Step 2: Run both and confirm they fail on the missing modules**

```bash
cd web && pnpm vitest run src/features/testing/layers.test.ts src/features/testing/probes.test.ts
```

Expected: FAIL — two unresolved imports.

- [ ] **Step 3: Write `layers.ts`**

```ts
/**
 * F2: one feature — a discounted checkout — carried at three altitudes.
 *
 * `blind` is what makes this a chain rather than a table. Each layer's blind
 * spot is the next layer's reason to exist, which is the claim the three
 * panels after this one are built on: they are one feature at three heights,
 * not three snippets that happen to share a domain.
 */
export type Layer = {
  id: 'unit' | 'integration' | 'e2e'
  label: string
  target: string
  volume: string
  speed: string
  proves: string
  blind: string
}

export const LAYERS: Layer[] = [
  {
    id: 'unit',
    label: 'Unit',
    target: 'calculateTotal()',
    volume: 'Many',
    speed: 'Milliseconds',
    proves:
      'That the arithmetic is right, including the inputs nobody expects — a 200% discount, an empty basket, a quantity of zero.',
    blind:
      'It never touches the database, so it cannot see a column the schema has and the type does not, or a write that silently updates nothing.',
  },
  {
    id: 'integration',
    label: 'Integration',
    target: 'updateInvoice()',
    volume: 'Some',
    speed: 'Seconds',
    proves:
      'That the action works end to end against a real Postgres — the query runs, the constraint holds, and an invoice belonging to someone else is refused.',
    blind:
      'It calls the action directly, so it cannot see a form that never submits, a button wired to the wrong handler, or a redirect that does not come back.',
  },
  {
    id: 'e2e',
    label: 'E2E',
    target: 'e2e/checkout.spec.ts',
    volume: 'Few',
    speed: 'Tens of seconds',
    proves:
      'That a person can actually buy the thing: the page renders, the form submits, the payment clears, the confirmation appears.',
    blind:
      'It is slow and inherently flakier, and when it fails it tells you the purchase broke without telling you which of the three layers below it did.',
  },
]
```

- [ ] **Step 4: Write `probes.ts`**

```ts
/**
 * The doc's six edge-case questions, applied to the running example.
 *
 * Source: `docs/06-testing.md`, "### Unit tests" — "For each function ask:
 * empty input, zero, negative, very large, null, duplicates." That sentence is
 * the second half of a two-sentence passage, and it is the half that makes the
 * first ("edge cases are where bugs live") into something a reader can do.
 *
 * `catches` is written against `calculateTotal` specifically rather than in
 * general, because "check for null" is advice and "a null discountPercent
 * makes the multiplication NaN and the invoice reads NaN" is a bug.
 */
export type Probe = { id: string; input: string; catches: string }

export const PROBES: Probe[] = [
  {
    id: 'empty',
    input: 'items: []',
    catches:
      'A total of zero, or a crash on reducing an empty array — and a checkout that lets someone pay for nothing.',
  },
  {
    id: 'zero',
    input: 'quantity: 0',
    catches:
      'A line item that contributes nothing but still appears on the invoice, which is a support ticket rather than an error.',
  },
  {
    id: 'negative',
    input: 'discountPercent: 200',
    catches:
      "A negative total. This is the doc's own second test, and it is the one that found the missing branch.",
  },
  {
    id: 'large',
    input: 'price: Number.MAX_SAFE_INTEGER',
    catches:
      'Integer overflow in the cents arithmetic, where the total silently stops being exact.',
  },
  {
    id: 'null',
    input: 'discountPercent: null',
    catches:
      'A NaN that propagates through tax and prints on the invoice as NaN, because nothing in the chain rejects it.',
  },
  {
    id: 'duplicates',
    input: 'the same item twice',
    catches:
      'Whether two lines of one item are summed or the second overwrites the first — a question the type signature does not answer.',
  },
]
```

- [ ] **Step 5: Run both and confirm they pass**

```bash
cd web && pnpm vitest run src/features/testing/layers.test.ts src/features/testing/probes.test.ts
```

Expected: PASS, 7 tests total.

- [ ] **Step 6: Teeth check**

Blank out the `blind` field on `integration` (`blind: ''`). Rerun: the chain test must fail
naming `integration`. Confirm the edit landed, restore, rerun green. Paste both runs.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/testing/layers.ts web/src/features/testing/layers.test.ts web/src/features/testing/probes.ts web/src/features/testing/probes.test.ts
git commit -m "feat(testing): F2's three layers and the six edge-case probes

Each layer carries what it cannot see, because that blind spot is the next
layer's reason to exist — without it F2 is three independent definitions,
which is the shape the sdlc sheet was rewritten to escape.

The probes are written against calculateTotal specifically: 'check for null'
is advice, 'a null discountPercent prints NaN on the invoice' is a bug.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: `checklist.ts`, `traps.ts`, `ai-plays.ts`, and the prose guard

**Files:**
- Create: `web/src/features/testing/checklist.ts`, `checklist.test.ts`
- Create: `web/src/features/testing/traps.ts`, `traps.test.ts`
- Create: `web/src/features/testing/ai-plays.ts`, `ai-plays.test.ts`
- Create: `web/src/features/testing/prose.test.ts`

**Interfaces:**
- Consumes: `h2`, `section`, `flat` from `./doc-source` (Task 1); the `### AI in testing`
  section from Task 2.
- Produces:

```ts
export type DoneItem = { id: string; label: string }
export const DONE: DoneItem[]            // 7, the doc's checkboxes verbatim
export const ARTIFACT_LIST: string[]     // 4, the doc's "## Artifacts" bullets
export type TeamNote = { id: string; title: string; body: string }
export const TEAM: TeamNote[]            // 4, from "## Scaling to a team"
export type Trap = { id: string; title: string; body: string }
export const TRAPS: Trap[]               // 8, from "## Traps"
export type Play = { id: string; title: string; kind: 'skill' | 'command' | 'mcp' | 'memory'; body: string }
export const AI_PREMISE: string
export const PLAYS: Play[]               // 6, from "### AI in testing"
```

`PLAYS` ids, in the doc's order — `ai-plays.test.ts` pins `installed-version` by id:
`edge-cases`, `bug-to-test`, `seed-helpers`, `qa-to-spec`, `installed-version`, `what-flaked`.

`checklist.ts` holds `DONE`, `ARTIFACT_LIST` and `TEAM` — three lists from three adjacent
closing sections, all consumed by panel 7 and by nothing else. Stage 05 groups them the same
way.

- [ ] **Step 1: Write the failing tests**

The load-bearing pattern for all three: **count the doc's own list rather than trusting a
number written into this plan.**

`checklist.test.ts`:

```ts
import { expect, test } from 'vitest'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'
import { h2 } from './doc-source'

const bullets = (s: string, marker: RegExp) =>
  s.split('\n').filter((l) => marker.test(l))

test('every definition-of-done box in the doc is carried, and no extra', () => {
  const boxes = bullets(h2('Definition of done'), /^- \[ \] /)
  expect(DONE).toHaveLength(boxes.length)
  expect(DONE.map((d) => d.label)).toEqual(
    boxes.map((b) => b.replace(/^- \[ \] /, '').trim()),
  )
})

test('the doc still has seven boxes, so a silent addition surfaces here', () => {
  expect(bullets(h2('Definition of done'), /^- \[ \] /)).toHaveLength(7)
})

test('every artifact bullet is carried verbatim', () => {
  const items = bullets(h2('Artifacts'), /^- /)
  expect(ARTIFACT_LIST).toHaveLength(items.length)
  expect(ARTIFACT_LIST).toHaveLength(4)
})

test('four team notes, each keeping the second sentence that makes it actionable', () => {
  expect(TEAM).toHaveLength(4)
  const flaky = TEAM.find((t) => t.id === 'flakiness')
  expect(flaky?.body).toMatch(/everyone\s+assumes someone else owns them/is)
  expect(flaky?.body).toMatch(/retry-rate dashboard/i)
  const docs = TEAM.find((t) => t.id === 'documentation')
  expect(docs?.body).toMatch(/how a new engineer learns intended behavior/i)
  expect(docs?.body).toMatch(/sentences describing the behavior, not `?test1`?/i)
})

test('ids are unique across all three lists', () => {
  const ids = [...DONE.map((d) => d.id), ...TEAM.map((t) => t.id)]
  expect(new Set(ids).size).toBe(ids.length)
})
```

`traps.test.ts`:

```ts
import { expect, test } from 'vitest'
import { TRAPS } from './traps'
import { h2 } from './doc-source'

/**
 * The doc's traps are bolded leads followed by a paragraph. Counting them out
 * of the doc rather than pinning 8 here is the point: stage 04's plan counted
 * nine where the doc had seven, because an unbounded `indexOf` had run the
 * slice past the section.
 */
test('every trap in the doc is carried, and the count comes from the doc', () => {
  const leads = h2('Traps')
    .split('\n')
    .filter((l) => /^\*\*.+\*\*/.test(l))
  expect(TRAPS).toHaveLength(leads.length)
  expect(TRAPS).toHaveLength(8)
})

test("titles are the doc's bold leads verbatim, trailing full stop included", () => {
  const leads = h2('Traps')
    .split('\n')
    .filter((l) => /^\*\*.+\*\*/.test(l))
    .map((l) => l.replace(/^\*\*/, '').replace(/\*\*.*$/, '').trim())
  expect(TRAPS.map((t) => t.title)).toEqual(leads)
})

test("the authorization trap keeps the doc's ranking of it", () => {
  const t = TRAPS.find((t) => t.id === 'no-authorization')
  expect(t?.body).toMatch(/most damaging omission in this doc/i)
})

test('the waitForTimeout trap keeps both the verdict and the mechanism', () => {
  const t = TRAPS.find((t) => t.id === 'wait-for-timeout')
  expect(t?.body).toMatch(/single largest source of E2E flakiness/i)
})
```

`ai-plays.test.ts`:

```ts
import { expect, test } from 'vitest'
import { AI_PREMISE, PLAYS } from './ai-plays'
import { section } from './doc-source'

test("every bullet in the doc's AI section is carried, and the count comes from the doc", () => {
  const bullets = section('AI in testing')
    .split('\n')
    .filter((l) => /^- \*\*/.test(l))
  expect(PLAYS).toHaveLength(bullets.length)
  expect(PLAYS).toHaveLength(6)
})

/**
 * The premise is lifted verbatim, both sentences. Stage 05 paraphrased its
 * equivalent straight into the component and silently dropped the concrete
 * half. The pin here is a phrase from the sentence that carries the test a
 * reader can apply — "has this test ever been red" — not from the memorable
 * opening.
 */
test('the premise keeps the question, not only the warning', () => {
  expect(AI_PREMISE).toMatch(/green either way/i)
  expect(AI_PREMISE).toMatch(/has this test ever been red/i)
  expect(section('AI in testing')).toContain(AI_PREMISE.split('\n')[0].slice(0, 60))
})

test('the jest-dom play keeps the specific number, which is what makes it evidence', () => {
  const p = PLAYS.find((p) => p.id === 'installed-version')
  expect(p?.kind).toBe('mcp')
  expect(p?.body).toMatch(/toBeInTheDocument/)
  expect(p?.body).toMatch(/Invalid Chai property/)
})

test('the closing claim survives: a generated test that has never been red is a decoration', () => {
  const s = section('AI in testing')
  expect(s).toMatch(/watching the test fail/i)
  expect(s).toMatch(/never been red is a decoration/i)
  expect(s).toMatch(/assuming it happened is how a suite becomes ballast/i)
})

test("kinds are drawn from the doc's own parenthetical, and every play has one", () => {
  for (const p of PLAYS) {
    expect(['skill', 'command', 'mcp', 'memory'], p.id).toContain(p.kind)
  }
})
```

`prose.test.ts` — **port `src/features/development/prose.test.ts` unedited except for the
docblock's stage references.** It discovers sibling modules structurally and scans this
directory's `.tsx` prose, so nothing in it needs to know which modules exist. Read it in full
before copying; if it turns out to hardcode a path or a stage slug beyond the docblock, say so
in the report rather than adapting it silently.

- [ ] **Step 2: Run all four and confirm they fail on missing modules**

```bash
cd web && pnpm vitest run src/features/testing/
```

Expected: FAIL — unresolved imports for `./checklist`, `./traps`, `./ai-plays`.

- [ ] **Step 3: Write the three modules**

Lift every string with `sed -n`. Four rules that apply to all three:

1. **`DONE` labels are the doc's checkboxes verbatim** — a reader works this list against
   their own repository, and a paraphrase is a different bar than the one the stage set.
2. **`TRAPS` titles keep the doc's trailing full stop**, because the doc bolds the whole
   sentence and `traps.test.ts` compares against exactly that.
3. **No markdown link syntax in any authored string.** `InlineCode` renders backticks and
   nothing else, so `([14](14-post-deployment-verification.md))` would print literally.
   Strip to the bare stage number — `(14)` — and carry the slug in a separate field if a
   panel needs a real link. `prose.test.ts` fails the build if you forget.
4. **Two sentences in, two sentences out.** Count at the boundary for every body you move.

- [ ] **Step 4: Run and confirm green**

```bash
cd web && pnpm vitest run src/features/testing/
```

Expected: PASS. Report the count.

- [ ] **Step 5: Teeth check**

Delete the last entry from `TRAPS`. Rerun: the count test must fail with `expected 7 to be 8`
— note that it fails against **the doc's count**, not against a literal. Confirm the edit
landed, restore, rerun green. Paste both runs.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/testing
git commit -m "feat(testing): the closing sections as data, counted out of the doc

Counts come from the doc's own lists rather than from numbers written into
the plan — stage 04's plan counted nine traps where the doc had seven,
because an unbounded indexOf ran the slice past the section.

The AI premise is lifted verbatim and pinned on its second sentence: stage 05
paraphrased its equivalent into a component and silently dropped the half
that made it actionable.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
## Wave 2 — components

### Task 8: `TriageDrill` — the spine

**Files:**
- Create: `web/src/features/testing/TriageDrill.tsx`
- Create: `web/src/features/testing/TriageDrill.test.tsx`

**Interfaces:**
- Consumes: `CHANGES`, `OPTIONS` from `./triage` (Task 4).
- Produces: `export function TriageDrill()`. Panel 1 (Task 11) is the only consumer.

**Read `src/features/setup/DeployBlockers.tsx` in full before writing this.** It is the same
component one subject over: `role="radio"` inside a per-row `role="radiogroup"`, the answer
locking on selection, `aria-live="polite"` on both the running score and each verdict, a
Reset button, and `min-h-11` (`lg:min-h-9`) on every control. Match it rather than inventing
a second idiom.

Three details from that file that are load-bearing and easy to lose:

- **A locked option keeps `text-subtle` and takes no opacity.** The `opacity-60` this
  originally carried composited to 2.62:1 in light and 3.21:1 in dark on 13px text, against a
  4.5:1 requirement. Locked options are content the reader re-reads beside the verdict, not
  unavailable controls. The whole-branch review found this because the audit only ever loads a
  panel's default state.
- **`plain()`** (`DeployBlockers.tsx:37`) strips backticks for the radiogroup's `aria-label`,
  because an accessible name cannot hold elements.
- **The lock lives in two places** — `commit` refuses a second write, and `disabled` on the
  button. The `disabled` is the one that holds in practice; the guard in `commit` covers the
  paths that are not a pointer press. Scoring a second guess scores hindsight.

- [ ] **Step 1: Write the failing test**

`web/src/features/testing/TriageDrill.test.tsx`:

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TriageDrill } from './TriageDrill'
import { CHANGES } from './triage'

// Every change offers the same four options, so an unscoped
// `getByRole('radio', { name })` matches six elements and throws. Each row is
// reached by the one thing that differs — its change text, which is also the
// radiogroup's accessible name.
const rowFor = (change: string) =>
  screen.getByRole('radiogroup', {
    name: new RegExp(
      change
        .replace(/`/g, '')
        .split(' ')
        .slice(0, 6)
        .join(' ')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ),
  })

const pick = (change: string, optionLabel: string) =>
  fireEvent.click(within(rowFor(change)).getByRole('radio', { name: optionLabel }))

test('renders one row per change, derived from the data rather than hardcoded', () => {
  render(<TriageDrill />)
  expect(screen.getAllByRole('radiogroup')).toHaveLength(CHANGES.length)
})

test('every row offers all four options, so the reader has to read the change', () => {
  render(<TriageDrill />)
  for (const c of CHANGES) {
    expect(within(rowFor(c.change)).getAllByRole('radio')).toHaveLength(4)
  }
})

/**
 * The score is asserted against literals, never against `CHANGES[i].answer`.
 * A test shaped `pick(c.change, labelFor(c.answer))` then expecting "1/1"
 * reads both sides off one row: change the answer in the data and the test
 * follows it, so it cannot see a component that scores against the wrong
 * field. These two name the change and the option in full.
 */
test('a pricing rule scored as a unit test is right', () => {
  render(<TriageDrill />)
  pick(
    'A new discount rule: a percentage off, applied before tax.',
    'A unit test over a pure function',
  )
  expect(screen.getByText('1/1 right')).toBeDefined()
})

test('a typed presentational prop scored as a unit test is wrong', () => {
  render(<TriageDrill />)
  pick(
    'A presentational <Badge> gains a tone prop typed',
    'A unit test over a pure function',
  )
  expect(screen.getByText('0/1 right')).toBeDefined()
})

test('the explanation is hidden until the reader commits, because a revealed answer teaches nothing', () => {
  render(<TriageDrill />)
  const c = CHANGES[0]
  expect(screen.queryByText(new RegExp(c.explanation.slice(0, 40)))).toBeNull()
  pick(c.change, 'A unit test over a pure function')
  expect(screen.getByText(new RegExp(c.explanation.slice(0, 40)))).toBeDefined()
})

test('a committed row locks, so a second guess cannot score hindsight', () => {
  render(<TriageDrill />)
  const change = 'A new discount rule: a percentage off, applied before tax.'
  pick(change, 'An E2E test on the critical path')
  expect(screen.getByText('0/1 right')).toBeDefined()

  pick(change, 'A unit test over a pure function')
  expect(screen.getByText('0/1 right')).toBeDefined()

  const radios = within(rowFor(change)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
})

test('the running score is announced, since it changes in place', () => {
  render(<TriageDrill />)
  pick(
    'A new discount rule: a percentage off, applied before tax.',
    'A unit test over a pure function',
  )
  const live = screen.getByText('1/1 right')
  expect(live.getAttribute('aria-live')).toBe('polite')
})

test('reset clears every answer and the score with it', () => {
  render(<TriageDrill />)
  pick(
    'A new discount rule: a percentage off, applied before tax.',
    'A unit test over a pure function',
  )
  fireEvent.click(screen.getByRole('button', { name: /reset/i }))
  expect(screen.queryByText(/right$/)).toBeNull()
  const radios = within(
    rowFor('A new discount rule: a percentage off, applied before tax.'),
  ).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(false)
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/features/testing/TriageDrill.test.tsx
```

Expected: FAIL — `Failed to resolve import "./TriageDrill"`.

- [ ] **Step 3: Write `TriageDrill.tsx`**

Clone `DeployBlockers.tsx`, substituting `CHANGES` for `BLOCKERS`, `c.change` for `b.symptom`,
and the module-level `OPTIONS` for `b.options`:

```tsx
'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { CHANGES, OPTIONS } from './triage'

/**
 * The stage's central exercise: six changes, sorted by the doc's own question —
 * "if this breaks, how will I find out?"
 *
 * Guess-then-reveal per `PATTERNS.md`: the answer locks before the verdict
 * shows, and the set is scored, because a revealed answer the reader did not
 * commit to teaches nothing.
 *
 * Structural reference: `DeployBlockers` (stage 04), which this clones one
 * subject over. Two differences. The option set is module-level rather than
 * per-row, because every change offers all four tiers. And two of the six
 * correct answers are "nothing" — so `go` marks a correct refusal exactly as it
 * marks a correct test, and nothing nudges the reader toward writing one.
 *
 * `brand` is never a verdict here. It means attention; `go` and `danger` carry
 * the meaning.
 */
function plain(text: string): string {
  return text.replace(/`/g, '')
}

export function TriageDrill() {
  const [choices, setChoices] = useState<Record<string, string>>({})

  const commit = (id: string, optionId: string) =>
    setChoices((prev) => (id in prev ? prev : { ...prev, [id]: optionId }))

  const answered = Object.keys(choices).length
  const correct = CHANGES.filter((c) => choices[c.id] === c.answer).length

  // Header: the prompt, the aria-live score, Reset.
  // Rows: the change via <InlineCode>; a role="radiogroup" labelled
  //   plain(c.change); four role="radio" buttons from OPTIONS; then an
  //   aria-live="polite" block rendering the verdict and explanation only
  //   once committed.
  // Footer: the Callout below.
}
```

The closing callout, which is the panel's parting line rather than decoration:

> **Two of these six need no test at all.** That is the point of asking the question rather
> than counting coverage: a percentage target is satisfied by whatever is easiest to test, and
> the two changes here that need nothing are also the two easiest to write a test for.

- [ ] **Step 4: Run it and confirm it passes**

```bash
cd web && pnpm vitest run src/features/testing/TriageDrill.test.tsx
```

Expected: PASS, 8 tests.

- [ ] **Step 5: Teeth check**

Delete `disabled={done}` from the option button. Rerun. **The lock test must fail and the
others must pass.** If the lock test still passes, the `commit` guard is carrying it alone —
report that, because it means the `disabled` attribute is untested and the assertion on
`.disabled` was the only thing checking it. Confirm the edit landed with `git diff`, restore,
rerun green. Paste both runs.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/testing/TriageDrill.tsx web/src/features/testing/TriageDrill.test.tsx
git commit -m "feat(testing): the triage drill, six changes against four tiers

A clone of DeployBlockers one subject over, with two differences that matter:
the option set is module-level because every change offers all four tiers, and
two of the six correct answers are 'nothing' — so a correct refusal reads as
go exactly like a correct test, and nothing nudges the reader toward writing
one.

Scores are asserted as literals naming the change and the option in full. A
test that picks CHANGES[i].answer reads both sides off one row and cannot see
a component scoring against the wrong field.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: `TeethCheck` — three tests, and whether the evidence proves anything

**Files:**
- Create: `web/src/features/testing/TeethCheck.tsx`
- Create: `web/src/features/testing/TeethCheck.test.tsx`

**Interfaces:**
- Consumes: `CASES` from `./teeth` (Task 5).
- Produces: `export function TeethCheck()`. Panel 6 (Task 12) is the only consumer.

**Structural reference: `src/features/development/AuthorizationDrill.tsx`** — a binary
radiogroup rather than a four-option one, two `role="radio"` buttons per row, scored across
the set. Read it in full first.

**Each row's code block gets its own `overflow-x-auto` container with `tabIndex={0}`.** Code
does not reflow the way prose does, and a keyboard user without a trackpad still has to reach
the scroll. `AuthorizationDrill` carries the same treatment for the same reason.

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TeethCheck } from './TeethCheck'
import { CASES } from './teeth'

const rowFor = (title: string) =>
  screen.getByRole('radiogroup', { name: new RegExp(title) })

test('renders one row per case', () => {
  render(<TeethCheck />)
  expect(screen.getAllByRole('radiogroup')).toHaveLength(CASES.length)
})

/**
 * Literal, not `String(c.proven)`. The whole subject of this component is a
 * test that reads both sides off one source, and shipping one here would be a
 * poor joke.
 */
test('the perl mutation case is not proven, and saying so scores', () => {
  render(<TeethCheck />)
  fireEvent.click(
    within(rowFor('A test over a type-role class name')).getByRole('radio', {
      name: 'Not proven',
    }),
  )
  expect(screen.getByText('1/1 right')).toBeDefined()
})

test('the literal-assertion case is proven, and saying it is not scores zero', () => {
  render(<TeethCheck />)
  fireEvent.click(
    within(rowFor('A test over which gate catches a warning')).getByRole('radio', {
      name: 'Not proven',
    }),
  )
  expect(screen.getByText('0/1 right')).toBeDefined()
})

test('the verdict is hidden until the reader commits', () => {
  render(<TeethCheck />)
  const c = CASES[0]
  expect(screen.queryByText(new RegExp(c.verdict.slice(0, 40)))).toBeNull()
  fireEvent.click(within(rowFor(c.title)).getByRole('radio', { name: 'Not proven' }))
  expect(screen.getByText(new RegExp(c.verdict.slice(0, 40)))).toBeDefined()
})

test('each code block is reachable by keyboard, since code does not reflow', () => {
  render(<TeethCheck />)
  const blocks = document.querySelectorAll('[data-teeth-code]')
  expect(blocks).toHaveLength(CASES.length)
  for (const b of blocks) expect(b.getAttribute('tabindex')).toBe('0')
})

test('a committed row locks', () => {
  render(<TeethCheck />)
  const c = CASES[0]
  fireEvent.click(within(rowFor(c.title)).getByRole('radio', { name: 'Proven' }))
  const radios = within(rowFor(c.title)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
})
```

The two radio labels must be exactly `Proven` and `Not proven` — testing library's `name`
matcher is exact, and `Proven` is a substring of nothing else here only because the labels
were chosen that way.

- [ ] **Step 2: Run it and confirm it fails on the missing module**

```bash
cd web && pnpm vitest run src/features/testing/TeethCheck.test.tsx
```

- [ ] **Step 3: Write `TeethCheck.tsx`**

Clone `AuthorizationDrill`'s shape. Each row renders, in order: the title; the test source in
a `data-teeth-code` block with `tabIndex={0}` and `overflow-x-auto`; the evidence, labelled so
it reads as a claim rather than a fact ("what the author reported"); two radios; then the
verdict in an `aria-live="polite"` region once committed.

Close the panel with:

> **Two of these three read as passes.** That is what makes the teeth check worth doing rather
> than assuming: a test that has never been red and a test that cannot be red produce the same
> terminal output, and the only difference is whether anyone looked.

- [ ] **Step 4: Run and confirm green.** Expected: PASS, 6 tests.

- [ ] **Step 5: Teeth check**

Remove `tabIndex={0}` from the code block. Rerun: the keyboard test must fail and nothing
else. Confirm the edit landed, restore, rerun green. Paste both runs.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/testing/TeethCheck.tsx web/src/features/testing/TeethCheck.test.tsx
git commit -m "feat(testing): a teeth-check drill whose own assertions are literals

The component is about tests that read both sides off one source, so its
render test names the case and the verdict in full rather than deriving the
expectation from CASES[i].proven.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: `LayerThread`, `TestingChecklist`, `AIPlays`

**Files:**
- Create: `web/src/features/testing/LayerThread.tsx`, `LayerThread.test.tsx`
- Create: `web/src/features/testing/TestingChecklist.tsx`, `TestingChecklist.test.tsx`
- Create: `web/src/features/testing/AIPlays.tsx`, `AIPlays.test.tsx`

**Interfaces:**
- Consumes: `LAYERS` (Task 6), `DONE` and `ARTIFACT_LIST` (Task 7), `AI_PREMISE` and `PLAYS`
  (Task 7).
- Produces: three components. `LayerThread` is F2 in panel 3; the other two are panel 7.

**Structural references, to read before writing:** `src/features/setup/SetupChecklist.tsx` and
`src/features/development/DevChecklist.tsx` for the checklist,
`src/features/development/AIPlays.tsx` for the plays. All three are per-stage instances of
existing shapes — do not invent a fourth idiom.

**`LayerThread` holds the one real design decision.** It draws three rows carrying `volume`,
`target`, `proves` and `blind`. The `blind` line is what turns a table into a chain, so it has
to read as continuous with the row below — a connector, an arrow, a "which is why the next
layer exists" lead-in. Colour-code the levels if you like, but **always add a second signal**;
colour is never the only cue.

- [ ] **Step 1: Write the three failing render tests**

Each derives what it displays from data, so each gets one. The assertions that matter:

```tsx
// LayerThread.test.tsx
test("renders all three layers with the doc's volumes as literals", () => {
  render(<LayerThread />)
  expect(screen.getByText('Many')).toBeDefined()
  expect(screen.getByText('Some')).toBeDefined()
  expect(screen.getByText('Few')).toBeDefined()
})

test('every layer shows what it cannot see, which is the chain', () => {
  render(<LayerThread />)
  for (const l of LAYERS) {
    expect(screen.getByText(new RegExp(l.blind.slice(0, 30)))).toBeDefined()
  }
})

test('the level coding is not carried by colour alone', () => {
  render(<LayerThread />)
  for (const l of LAYERS) {
    expect(screen.getByText(l.label)).toBeDefined()
  }
})
```

```tsx
// TestingChecklist.test.tsx
test('renders every done item as a real checkbox, derived from the data', () => {
  render(<TestingChecklist />)
  expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
})

test('ticking one item does not tick the rest', () => {
  render(<TestingChecklist />)
  const boxes = screen.getAllByRole('checkbox')
  fireEvent.click(boxes[0])
  expect((boxes[0] as HTMLInputElement).checked).toBe(true)
  expect((boxes[1] as HTMLInputElement).checked).toBe(false)
})

test('the four artifacts are listed, since the panel claims to name the outputs', () => {
  render(<TestingChecklist />)
  for (const a of ARTIFACT_LIST) {
    expect(
      screen.getByText(new RegExp(a.replace(/`/g, '').slice(0, 20))),
    ).toBeDefined()
  }
})
```

```tsx
// AIPlays.test.tsx
test('renders every play, derived from the data', () => {
  render(<AIPlays />)
  for (const p of PLAYS) {
    expect(screen.getByText(new RegExp(p.title.slice(0, 30)))).toBeDefined()
  }
})

/**
 * The premise's second sentence reaches the page, not only its first. This is
 * the exact loss stage 05 shipped: the component paraphrased the opening and
 * dropped the half that made it usable.
 */
test('the premise renders the question, not only the warning', () => {
  render(<AIPlays />)
  expect(screen.getByText(/has this test ever been red/i)).toBeDefined()
})
```

- [ ] **Step 2: Run all three, confirm they fail on missing modules**

```bash
cd web && pnpm vitest run src/features/testing/
```

- [ ] **Step 3: Write the three components**

- [ ] **Step 4: Run and confirm green.** Report the count.

- [ ] **Step 5: Teeth check**

On `AIPlays`, render only the premise's first sentence. Rerun: the second-sentence test must
fail and nothing else. Confirm the edit landed, restore, rerun green. Paste both runs. This is
the one teeth check in the round that targets the failure the whole pinning discipline exists
for — do not skip it.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/testing
git commit -m "feat(testing): F2's layer thread, the done checklist, and AI plays

LayerThread draws the blind spot on every row and connects it to the layer
below, because that continuity is the teaching — three layers with three
definitions and no chain is the shape the sdlc sheet was rewritten to escape.

AIPlays has a render test asserting the premise's second sentence reaches the
page, which is exactly the loss stage 05 shipped.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---
## Wave 3 — assembly

### Task 11: Panels 1–4 (`triage`, `restraint`, `unit`, `integration`)

**Files:**
- Modify: `web/src/features/testing/Testing.tsx` (replace four placeholder bodies)

**Interfaces:**
- Consumes: everything from Tasks 3–10.
- Produces: nothing new. Task 12 replaces the remaining three bodies.

**Read `src/features/development/Development.tsx` before starting.** It is the assembly
reference: how `Step` bodies are built, how `Figure` numbers are passed explicitly, how
`stageTitle(slug)` renders a cross-stage link without an `as` cast.

Panel contents:

**Panel 1 `triage`** — the epigraph, "when this actually happens", the two entry criteria and
the sentence that says the second is the real one, then `<TriageDrill />`, then F1.

F1 is the distribution as a shape: four tiers, descending volume, each with the doc's own
one-line characterisation. It comes **after** the drill, not before — the reader places six
changes first and then sees the shape they were placing them into. A reader shown the shape
first is pattern-matching, not judging.

**Panel 2 `restraint`** — the five things not to test as a `RevealList` (each row's summary is
the doc's bold lead; each body is the sentence that follows), then Coverage as a `Contrast`:
payment logic at 40% against a settings page at 40%. Close with the doc's own line — coverage
is useful as a diagnostic and useless as a target, and a blanket threshold is satisfied by
testing whatever is easiest, which is rarely whatever is riskiest.

**Panel 3 `unit`** — opens the running thread. F2 (`<LayerThread />`) draws the feature at
three altitudes, then `<AnnotatedArtifact artifact={ARTIFACTS.pricing} />`, then the integer-
cents rule, then the six `PROBES` as a `RevealList`.

**Panel 4 `integration`** — one line stitching back to F2 ("the same feature, one layer up"),
then `<AnnotatedArtifact artifact={ARTIFACTS.actions} />`, then the authorization-refusal
claim as a `Callout kind="danger"`, then the real-Postgres-over-mocks paragraph.

- [ ] **Step 1: Wrap every diagram in `Figure` and number it explicitly**

F1 in panel 1, F2 in panel 3. Numbers run across the whole stage, not per panel, and are
passed as props rather than derived.

- [ ] **Step 2: Assemble the four bodies**

- [ ] **Step 3: Measure the panels**

```bash
cd web && pnpm build && pnpm test:e2e
```

The audit measures panel weight at 1024×768 against `PANEL_SCREENS_MAX = 4.0`; this round
targets 3.2. Record each of the four panels' measured height in the task report.

**A panel measuring well under the target is a signal to go looking, not a compliment.** Stage
04's median came in at 1.74 screens against stage 03's 3.02, and that number was the first
visible symptom of five sections having gone missing. If one of these four is thin, name which
doc content it was supposed to carry and check it is actually there.

- [ ] **Step 4: Gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add web/src/features/testing/Testing.tsx
git commit -m "feat(testing): assemble panels 1-4, opening the running thread

F1 comes after the drill rather than before it: a reader shown the
distribution first is pattern-matching, not judging. F2 opens the billing
thread in panel 3, and panel 4 stitches back to it in a line rather than
redrawing it.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Panels 5–7 (`e2e`, `teeth`, `done`)

**Files:**
- Modify: `web/src/features/testing/Testing.tsx` (replace the last three placeholder bodies)

**Panel 5 `e2e`** — the stitch to F2 ("the same feature, on top"), then
`<AnnotatedArtifact artifact={ARTIFACTS.checkout} />`, then the selector lesson as a
`Contrast`: `.btn-primary-2` against `getByRole('button', { name: 'Buy now' })`. Both halves of
the doc's claim have to land — that role-and-name survives restyling, **and** that it breaks
only when the user-visible thing actually changes, which is when you want it to break. Then
`@smoke` (wrapping the existing `smoke-test` term on first appearance), then `waitForTimeout`
as a `Callout kind="trap"`: never use it, because Playwright's assertions auto-retry and an
arbitrary sleep is either too short or too long and usually manages both across different
machines.

**Panel 6 `teeth`** — test-first and its three "where it earns its keep" cases, then the one
place it is less useful (exploratory UI work: spike it, then write tests before it merges),
then `<TeethCheck />`, then the invariant-tests section. The invariant section is this repo
describing itself, so keep the number and the specificity: thirteen such tests guard this
playbook's stage registry, and a corrupted slug fails exactly four of them with messages
naming the slug.

**Panel 7 `done`** — `<TestingChecklist />` (the seven boxes plus the four artifacts), then
`<AIPlays />`, then the four team notes through `TeamNotes`, then the eight `TRAPS` as
`Callout kind="trap"`, then `<References />`.

- [ ] **Step 1: Assemble the three bodies**

- [ ] **Step 2: Measure all seven panels**

```bash
cd web && pnpm build && pnpm test:e2e
```

Record every panel's height and the median. **Compare the median to stage 05's**, which the
task report must state as a measured number rather than a remembered one — derive it from the
same audit output. If stage 06's median is well below stage 05's, that is the stage-04 signal;
say so in the report and go looking before Task 13.

- [ ] **Step 3: Gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test
```

- [ ] **Step 4: Commit**

```bash
git add web/src/features/testing/Testing.tsx
git commit -m "feat(testing): assemble panels 5-7, closing on the traps

Panel 6 pairs test-first with the teeth check because they are halves of one
claim: test-first means the test failed first, and the teeth check is what you
owe when it could not.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Terms, glossary, references

**Files:**
- Modify: `web/src/lib/terms.ts` (eight new entries)
- Modify: `web/src/lib/references.ts` (stage 06 references)
- Regenerate: `reference/glossary.md` via `pnpm gen:glossary`
- Modify: `web/src/features/testing/Testing.tsx` (wrap first appearances in `<Term>`)

**Interfaces:**
- Consumes: the assembled panels from Tasks 11–12.
- Produces: nothing later tasks depend on.

**`smoke-test` already exists** — reuse it, do not add a second entry. Check the full id list
before writing (`grep -nE "^  '[a-z0-9-]+': \{" src/lib/terms.ts`) so none of the eight below
duplicates something already defined under another name.

The eight, with `see: '06-testing'`:

| id | name | Definition must carry |
|---|---|---|
| `mock` | Mock | A stand-in for a real dependency that returns what you told it to. **So what:** mocking the database means your test asserts against your own instructions — it cannot see a constraint violation, a transaction bug, or a malformed query. |
| `test-fixture` | Test fixture | The known starting state a test runs against — seeded rows, a reset database. **So what:** without a reset between tests, tests pass in one order and fail in another, and the failure looks like a bug in the code. |
| `regression-test` | Regression test | A test written to reproduce a specific bug, which must fail before the fix and pass after. **So what:** skipping it means you cannot prove the fix works, and nothing stops the bug coming back. |
| `invariant-test` | Invariant test | A test asserting the *shape* of data rather than its values — counts, uniqueness, cross-references between files. **So what:** it fires exactly when a human is hand-editing a config or data file, which is the moment reviews are at their weakest. |
| `teeth-check` | Teeth check | Deliberately breaking the implementation to confirm a test fails, then restoring it. **So what:** a test written after the code it covers has never been red, so green proves nothing until you have seen it bite. |
| `code-coverage` | Code coverage | The percentage of lines or branches a test suite executes. **So what:** useful as a diagnostic, useless as a target — a blanket threshold is satisfied by testing whatever is easiest, which is rarely whatever is riskiest. |
| `flaky-test` | Flaky test | A test that passes and fails on the same code. **So what:** on a team it gets tolerated because everyone assumes someone else owns it, and once a suite is known to be unreliable a real failure stops being believed. |
| `accessible-name` | Accessible name | The name assistive technology reports for an element — usually its visible text or its label. **So what:** selecting by it in an E2E test means the test breaks when what the user sees changes and not when the styling does, and it makes an inaccessible UI produce failing tests. |

Definitions are written for someone meeting the idea for the first time: plain language, no
forward references, and the `soWhat` carries the part a dictionary would leave out. Use
typographic quotes inside definition strings — a straight double quote breaks the JSX attribute
where the term is consumed, and JSX also eats whitespace around inline components, so put an
explicit `{' '}` wherever a space must survive next to a `<Term>`.

- [ ] **Step 1: Write the failing test**

There is an existing `src/lib/term-usage.test.ts`. Read it first — it may already assert that
every term is used somewhere, in which case adding eight unused terms fails it and no new test
is needed. Say in the report which it was.

Add to `src/lib/terms.test.ts`:

```ts
test('stage 06 defines the vocabulary it introduces', () => {
  for (const id of [
    'mock',
    'test-fixture',
    'regression-test',
    'invariant-test',
    'teeth-check',
    'code-coverage',
    'flaky-test',
    'accessible-name',
  ]) {
    expect(TERMS[id], id).toBeDefined()
    expect(TERMS[id].see, id).toBe('06-testing')
    expect(TERMS[id].soWhat, id).toBeTruthy()
  }
})

test('smoke-test is reused rather than redefined', () => {
  expect(TERMS['smoke-test']).toBeDefined()
  expect(TERMS['smoke-test'].see).not.toBe('06-testing')
})
```

- [ ] **Step 2: Run it, confirm it fails naming the first missing term**

- [ ] **Step 3: Add the eight terms, wrap first appearances, add references**

- [ ] **Step 4: Regenerate the glossary**

```bash
cd web && pnpm gen:glossary
```

Never hand-edit `reference/glossary.md`. If the diff shows anything other than the eight new
entries, stop and report.

- [ ] **Step 5: Gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/terms.ts web/src/lib/references.ts web/src/features/testing/Testing.tsx reference/glossary.md
git commit -m "feat(terms): define stage 06's eight testing terms

smoke-test already existed and is reused rather than redefined. Every soWhat
carries the part a dictionary leaves out — mocking the database means
asserting against your own instructions, a coverage threshold is satisfied by
whatever is easiest to test.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Wave 4 — the walk, the gates, the record

### Task 14: The coverage walk, and the fix wave after it

**Files:**
- Create: `docs/stage-06-status.md`
- Modify: whatever the walk finds

**This task cannot be done by the session that built the panels.** The session that wrote them
is the worst reader of them, because it remembers intending to cover things. Stage 05's first
two coverage walks ran inside per-task reviews with full context and found nothing; a third,
starved of context, found ten real gaps against a green gate of 645 tests and fourteen closed
reviews.

- [ ] **Step 1: Dispatch the walk with the planning documents withheld by name**

The auditor gets exactly two things: `docs/06-testing.md` and `web/src/features/testing/`.

**Withheld by name, and named in the brief so the auditor knows to refuse them if offered:**
this plan, `docs/superpowers/specs/2026-08-27-stage-06-testing-design.md`, every task brief,
every task report, and any ledger of the round.

The brief: walk every heading of the doc, including `## Artifacts`, `## Definition of done`,
`## Scaling to a team` and `## Traps`. For each, name which panel carries it and what
specifically. Anything you cannot name goes in a "not ported" list with a reason. Two failure
shapes to look for by name, because both have shipped here before:

- The app tells the reader to run a script, or set a value, that it never shows them how to
  create.
- The app hands the reader a snippet the doc calls incomplete, without saying so.

- [ ] **Step 2: Write `docs/stage-06-status.md`**

The coverage table is its coverage section. Include what was deliberately not ported and why.

- [ ] **Step 3: Fix what the walk found**

**Budget a wave here; do not treat the walk as a signature.** Nine of stage 05's ten findings
were real. Each fix is a normal TDD cycle — failing test first.

**And check the fix wave itself for the second-sentence loss.** Stage 05's wave dropped a
sentence while closing two other sentence drops. Count sentences in and out on every passage
you touch.

- [ ] **Step 4: Verify each finding before fixing it**

A reviewer is expected to disprove as well as confirm. If a finding is wrong, record it as
disproved with the evidence rather than fixing something that was already right — and check any
finding that generalises from a single example against the numbered decisions in
`docs/tracker.md` before acting on it. One of stage 05's ten was deferred on three claims, all
three of which were wrong, and the decision that settled the question had already been made
months earlier.

- [ ] **Step 5: Commit the fixes and the status doc separately**

---

### Task 15: The full verification pass

- [ ] **Step 1: The gate, cheapest first**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```

- [ ] **Step 2: `pnpm test:dev-console`, once for the round**

```bash
cd web && pnpm test:dev-console
```

This is the only thing in the repo that can see React's development validation — missing keys,
invalid DOM nesting, `act()` warnings, hydration detail. A production build has stripped all of
it, so a green `test:e2e` says nothing about this family. Run it, and say which build each
console claim refers to.

- [ ] **Step 3: Contrast, both themes, every state**

Every distinct text/background pair, WCAG AA, in light and dark, on all seven panels — with
every `Term` panel expanded and **every drill row committed**, since a locked option and a
verdict are states the audit never loads. Compute ratios against the worst-case surface rather
than nudging hex values and re-screenshotting.

Two cautions: a checker reporting mass failures is usually the checker, and the colour parser
must handle `oklab()` — Tailwind emits it for alpha backgrounds and a naive parser reads it as
black and reports a false 1.34:1.

- [ ] **Step 4: Responsive, 320→2560px**

No horizontal overflow, no sub-44px touch target below `lg`. Stress cases: the longest option
label in `OPTIONS`, the widest line in each of the three artifacts, and the longest stage title
in the rail.

- [ ] **Step 5: Console, in a clean context**

Zero errors. Not a hot-reloaded page, which carries stale errors from mid-edit.

- [ ] **Step 6: The prose pass**

`humanizer:humanizer` over the panel prose and `docs/stage-06-status.md`. Skip it for terminal
output, code, tables and tracker entries. Apply what makes the writing clearer; decline what
would flatten the voice, and say which you declined and why.

- [ ] **Step 7: Report the branch state**

Format: `N commits off develop, X/X tests across Y files, build clean, audit 18/18, tree clean.
NOT merged, NOT deployed.`

---

### Task 16: Record the round

**Files:**
- Modify: `docs/tracker.md`, `docs/task.md`
- Modify: `web/PATTERNS.md` only if warranted

- [ ] **Step 1: `docs/tracker.md`**

A W-3.6 entry citing **evidence, not adjectives** — commit SHAs, the test count, what the
coverage walk found and how many of its findings survived verification, what the teeth checks
proved. Any new decisions get numbers and reasoning. Decisions are appended and superseded,
never edited.

The entry carries a **`Deferred:`** list. Known members before the round starts:

- the `testing` reference cheatsheet (the W-6 round D-88 puts after this one)
- `sql-reference` / `api-reference`, still parked and untracked
- attribution unrecorded on sources gathered in the previous session (real per D-63)
- `CLAUDE.md` still prescribes a `Claude Opus 4.8` commit trailer while the repo's practice is
  to name the model that did the work

- [ ] **Step 2: `docs/task.md`** — W-3 to 6/18.

- [ ] **Step 3: `web/PATTERNS.md`** — only if something genuinely new emerged. `TriageDrill`
and `TeethCheck` are both instances of the guess-then-reveal row that already exists, so the
expectation is a note naming them as instances, not a new row. Adding a row for a pattern that
already had one is how a catalog stops being usable.

- [ ] **Step 4: Commit records separately** with `docs(tracker)` and `docs(task)` scopes.

---

## Verification (after all tasks)

- [ ] `pnpm lint` — 0 errors, 0 warnings
- [ ] `pnpm typecheck` — clean, run through the script so typegen goes first
- [ ] `pnpm test` — both projects green; report the count and the file count
- [ ] `pnpm build` — every page prerenders, `/stages/06-testing` among them
- [ ] `pnpm test:e2e` — 18/18, no new `PANEL_EXCEPTIONS` entry
- [ ] `pnpm test:dev-console` — clean, run once for the round
- [ ] Contrast AA in both themes, all seven panels, drills committed and `Term` panels open
- [ ] No horizontal overflow and no sub-44px target, 320→2560px
- [ ] Zero console errors in a clean context
- [ ] `humanizer:humanizer` run over the panel prose and the status doc
- [ ] Every doc heading appears in `docs/stage-06-status.md`'s coverage table
- [ ] The coverage walk ran **without** this plan or the spec, and its findings were verified
      before being fixed
- [ ] Panel median measured and compared against stage 05's, with both numbers stated
- [ ] `git branch --show-current` is `feat/stage-06-testing`, and nothing was merged

**Then stop.** The branch is not merged. Ask before any merge, including into `develop`; the
`develop` → `main` promotion is the user's.

# Step panel weight (D-52) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace D-38's step-count ceiling with an enforced panel-weight rule, and reshape stage 03 so every panel satisfies it.

**Architecture:** A playwright assertion measures every step panel at 1024×768 and fails anything over four screens, with a baselined exception list. Stage 03's currently-oversized panels enter that list as explicit temporary debt, and each split task removes its own entry — so the list shrinks to the two permanent exceptions and the suite stays green throughout.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind 4, vitest, playwright.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-31-step-panel-weight-design.md`. Read it before Task 1.
- **Threshold:** a panel may not exceed **4.0 screens** measured at **1024×768**.
- **Re-baseline tolerance:** an exception measuring more than **0.5 screens** under its baseline fails and must be lowered.
- **TDD is not optional** (`CLAUDE.md`, the iron law). No production code without a failing test first. Task reports paste raw RED and GREEN output and state the failure was for the right reason.
- **D-49 holds:** the threshold is never met by teaching less. Content moves between steps or behind an expand-to-reveal; it does not get deleted.
- **D-35 holds:** the AI step stays, beyond the content steps.
- **D-42 holds:** cite doc sections by heading, never by line number. `source-citations.test.ts` enforces it.
- **D-47 holds:** when you fix a concept, grep `web/src/lib/terms.ts` for it too.
- **Every new step hash** is added by hand to `PAGES` in `web/e2e/audit.spec.ts` (**TD-12**). The guard added in `214bce0` will fail a hash that resolves to no step.
- **Commits:** Conventional Commits, lowercase subject, trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Run `pnpm typecheck` (not bare `tsc`) — it runs `next typegen` first.

## File structure

| File | Responsibility | Tasks |
|---|---|---|
| `web/src/components/Stepper.tsx` | Step rail and panel. Owns step numbering | 1 |
| `web/src/features/architecture/steps.ts` | Stage 03's step ids, in rail order. The list `TRACE_ROWS` and the audit resolve against | 3, and every split task |
| `web/e2e/audit.spec.ts` | All browser-verified invariants, including the new panel rule and `PAGES` | 2, and every split task |
| `web/src/features/architecture/Architecture.tsx` | Stage 03's `STEPS` array and all panel JSX | 3–11 |
| `web/src/features/architecture/*.ts` | Stage 03 content data (`scoring`, `sketch`, `schema-blocks`, `styles`, `contracts`) | 5–11 |
| `web/src/features/architecture/*.tsx` | Stage 03 interactive components | 5–11 |
| `web/src/lib/terms.ts` | Glossary, single-sourced (D-36) | 5–11 as terms arrive |
| `web/PATTERNS.md`, `docs/tracker.md`, `docs/stage-03-status.md`, `KICKOFF.md` | The written record | 12 |

---

### Task 1: Fix the step number at ten and beyond

`Stepper.tsx:128` renders the step index as `` `0${i + 1}` ``, which prints `010` for the tenth step. Stage 03 crosses ten in this plan, so this lands first — every later task would otherwise ship a visibly broken rail.

**Files:**
- Modify: `web/src/components/Stepper.tsx:128`
- Test: `web/src/components/stepper-numbering.test.ts` (create)

**Interfaces:**
- Produces: `stepNumber(i: number): string` exported from `web/src/components/Stepper.tsx`. Returns a zero-padded 1-based label: `stepNumber(0) === '01'`, `stepNumber(9) === '10'`.

- [ ] **Step 1: Write the failing test**

Create `web/src/components/stepper-numbering.test.ts`:

```ts
import { expect, test } from 'vitest'
import { stepNumber } from './Stepper'

// The rail template-literalled a leading zero onto the index, which is correct
// for exactly nine steps and silently wrong for the tenth. D-52 removes the
// step-count ceiling that had kept every stage under that limit by accident.
test('a single-digit step is zero-padded, which is the rail’s existing visual treatment', () => {
  expect(stepNumber(0)).toBe('01')
  expect(stepNumber(8)).toBe('09')
})

test('the tenth step reads 10 rather than 010, which is what the old template literal produced', () => {
  expect(stepNumber(9)).toBe('10')
  expect(stepNumber(13)).toBe('14')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && pnpm vitest run src/components/stepper-numbering.test.ts`
Expected: FAIL. The import does not resolve — `stepNumber` is not exported from `Stepper.tsx`. That is the right reason: the function does not exist yet.

- [ ] **Step 3: Write minimal implementation**

In `web/src/components/Stepper.tsx`, add above the `Stepper` component:

```ts
/**
 * Zero-padded to two digits and no further. The rail used a template literal
 * with a hardcoded leading zero, which was correct only while D-38 kept every
 * stage under ten steps.
 */
export function stepNumber(i: number): string {
  return String(i + 1).padStart(2, '0')
}
```

Then replace line 128, `` `0${i + 1}` ``, with:

```tsx
stepNumber(i)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && pnpm vitest run src/components/stepper-numbering.test.ts`
Expected: PASS, 2 tests.

Then `cd web && pnpm test` — the full suite stays green.

- [ ] **Step 5: Teeth check**

Change `padStart(2, '0')` to `padStart(3, '0')`. Run `pnpm vitest run src/components/stepper-numbering.test.ts`. Expected: both tests fail. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/Stepper.tsx web/src/components/stepper-numbering.test.ts
git commit -m "fix(stepper): number the tenth step 10 rather than 010

The rail built its label as \`0\${i + 1}\`, which is correct for exactly nine
steps. Nothing caught it because D-38's count ceiling had kept every stage
under ten by accident; D-52 removes the ceiling and stage 03 crosses it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Enforce the panel-weight rule

The rule from the spec, as a test, with stage 03's current panels baselined as explicit temporary debt so the suite is green from this commit forward.

**Files:**
- Modify: `web/e2e/audit.spec.ts` (append; `PAGES` already carries stage 03's nine hashes from `214bce0`)

**Interfaces:**
- Produces: `PANEL_SCREENS_MAX = 4.0` and `PANEL_EXCEPTIONS: Record<string, number>` in `web/e2e/audit.spec.ts`. Later tasks delete their own `PANEL_EXCEPTIONS` entry as the panel they own comes under threshold.

- [ ] **Step 1: Write the failing test**

Append to `web/e2e/audit.spec.ts`:

```ts
// ── D-52: a step holds one judgment, and its panel is not a scroll ─────────

/**
 * D-38 capped a dense stage at five content steps. Its stated reason was that
 * "a stepper stops being navigable when a step is a scroll" — a claim about
 * how much one panel holds, enforced by counting a different noun. The two
 * pull opposite ways: fewer steps for the same content means heavier panels.
 * Measured, stage 03's median panel was 5.3 screens against 2.4 and 2.5 for
 * stages 01 and 02, while sitting inside a rule that only knew about counts.
 *
 * Four screens is taken from the measurements: 01 and 02 both have a
 * next-heaviest panel at 3.2, so the threshold clears everything either stage
 * has except one panel each.
 */
const PANEL_VIEWPORT = { width: 1024, height: 768 }
const PANEL_SCREENS_MAX = 4.0

/**
 * Baselined, not exempt. Every entry is a panel the rule would fail, recorded
 * with a reason so the exemption is a decision rather than an oversight.
 *
 * Stage 01 and 02's two are permanent for now: splitting them changes step
 * hashes and reopens two reviewed stages (spec, Non-goals). The rule applies
 * to them the moment either is edited.
 *
 * Stage 03's are temporary debt, removed one at a time by the task that splits
 * each panel. When this list is down to two entries, the reshape is done.
 */
const PANEL_EXCEPTIONS: Record<string, number> = {
  '/stages/01-product-discovery#record': 6.7, // artifact gallery, one page by design
  '/stages/02-planning#horizon': 5.6, // three horizon bands, compared side by side

  // Temporary — D-52's reshape removes these. See docs/superpowers/plans/2026-07-31-step-panel-weight.md
  '/stages/03-architecture#model': 6.0,
  '/stages/03-architecture#shape': 7.1,
  '/stages/03-architecture#sketch': 6.1,
  '/stages/03-architecture#schema': 8.4,
  '/stages/03-architecture#contract': 5.3,
  '/stages/03-architecture#ai': 4.7,
}

/** Tolerance on the re-baseline check: panel height moves slightly with font
 *  loading and scrollbar width, and a rule that fires on noise gets suppressed. */
const REBASELINE_SLACK = 0.5

test('no step panel exceeds four screens, because a step that is a scroll is two steps', async ({
  page,
}) => {
  await page.setViewportSize(PANEL_VIEWPORT)
  const failures: string[] = []

  for (const path of PAGES.filter((p) => p.includes('#'))) {
    const id = path.split('#')[1]
    await page.goto(path, { waitUntil: 'networkidle' })
    const height = await page
      .locator(`#panel-${id}`)
      .evaluate((el) => el.getBoundingClientRect().height)
    const screens = height / PANEL_VIEWPORT.height
    const baseline = PANEL_EXCEPTIONS[path]

    if (baseline === undefined) {
      if (screens > PANEL_SCREENS_MAX) {
        failures.push(
          `${path} is ${screens.toFixed(1)} screens, over the ${PANEL_SCREENS_MAX} limit. ` +
            `Split it at a seam where the panel holds two judgments, or move elaboration ` +
            `behind an expand-to-reveal (D-52).`,
        )
      }
      continue
    }

    // A baselined panel that got better must say so, or the allowlist rots
    // upward and becomes what D-38 was: a number nothing enforces.
    if (screens < baseline - REBASELINE_SLACK) {
      failures.push(
        `${path} is now ${screens.toFixed(1)} screens against a baseline of ${baseline}. ` +
          `Lower it in PANEL_EXCEPTIONS, or delete the entry if it is under ${PANEL_SCREENS_MAX}.`,
      )
    }
  }

  expect(failures.join('\n')).toBe('')
})
```

- [ ] **Step 2: Run test to verify it fails**

First confirm the test can fail at all. Temporarily set `PANEL_SCREENS_MAX = 3.0`.

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: FAIL, listing `/stages/01-product-discovery#decide` (3.2) and `/stages/02-planning#write` (3.2) — panels that pass at 4.0 and fail at 3.0. That is the right reason: the measurement works and the threshold is the thing being applied.

Restore `PANEL_SCREENS_MAX = 4.0`.

- [ ] **Step 3: Run test to verify it passes**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. Every over-threshold panel is baselined; nothing is under its baseline by more than the slack.

- [ ] **Step 4: Teeth-check the re-baseline branch**

This branch is the one that stops the allowlist rotting, so prove it fires. Temporarily change `'/stages/03-architecture#contract': 5.3` to `9.9`.

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: FAIL with `contract is now 5.3 screens against a baseline of 9.9. Lower it in PANEL_EXCEPTIONS`. Restore `5.3`.

- [ ] **Step 5: Run the whole suite**

Run: `cd web && pnpm test:e2e`
Expected: 12 passed.

- [ ] **Step 6: Commit**

```bash
git add web/e2e/audit.spec.ts
git commit -m "test(web): enforce D-52 by measuring panel height, not counting steps

Every step panel is measured at 1024x768 and fails over four screens. Stage
01's \`record\` and 02's \`horizon\` are baselined permanently; stage 03's six
oversized panels are baselined as temporary debt, each removed by the task
that splits it. When the list is two entries long the reshape is finished.

The re-baseline branch is the load-bearing half: a panel that improves past
its baseline fails too, asking for the number to be lowered. Without it the
allowlist becomes what D-38 was, a recorded number with nothing enforcing it.
Teeth-checked in both directions.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Single-source the step ids, so a split cannot silently misdirect a trace row

`characteristics.test.ts:62` looks like it guards trace-row links and does not. It checks each `TRACE_ROWS[].stepId` against a **hardcoded** set of the nine current ids. When `schema` splits and a row's decision moves to `concurrency`, the row still says `schema`, `schema` still exists, the test still passes, and `TraceForward.tsx:76` sends the reader to a step that no longer makes that decision.

This is D-47's pattern with a test that reads as protection. Close it before any split lands, or every split task has to remember something that nothing checks.

**Files:**
- Create: `web/src/features/architecture/steps.ts`
- Modify: `web/src/features/architecture/Architecture.tsx` (import the ids rather than declaring them inline)
- Modify: `web/src/features/architecture/characteristics.test.ts:62-79`

**Interfaces:**
- Produces: `STEP_IDS: readonly string[]` exported from `web/src/features/architecture/steps.ts`, in rail order. `Architecture.tsx` derives its `STEPS` ids from it; `characteristics.test.ts` asserts against it. Every later task that adds a step adds it here, in one place.

- [ ] **Step 1: Write the failing test**

Replace the hardcoded set in `web/src/features/architecture/characteristics.test.ts:62-79` with:

```ts
import { STEP_IDS } from './steps'

test('every trace row points at a step the stepper actually has', () => {
  for (const r of TRACE_ROWS) {
    expect(
      STEP_IDS,
      `${r.characteristicId} points at ${r.stepId}`,
    ).toContain(r.stepId)
  }
})

// The hardcoded list this replaced could not fail when a step split: the row
// kept naming a step that still existed while the decision it described had
// moved. Deriving the list does not fix that either — nothing can tell a
// reader's intent from a string — so this asserts the weaker thing honestly
// and the split tasks carry the re-pointing as an explicit step.
test('the id list is in rail order and has no duplicates, since it is what the trace links resolve against', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  expect(STEP_IDS[0]).toBe('reverse')
  expect(STEP_IDS.at(-1)).toBe('ai')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/characteristics.test.ts`
Expected: FAIL — cannot resolve `./steps`. Right reason: the module does not exist yet.

- [ ] **Step 3: Implement**

Create `web/src/features/architecture/steps.ts`:

```ts
/**
 * The rail order for stage 03, in one place.
 *
 * `Architecture.tsx` holds the panels; this holds the ids, because two other
 * things resolve against them — `TRACE_ROWS[].stepId`, which renders as a link
 * in `TraceForward`, and the hand-written `PAGES` list in the audit suite.
 * Both used to compare against a copy of this list, which is why a copy stopped
 * being acceptable when D-52 made splitting steps routine.
 */
export const STEP_IDS = [
  'reverse',
  'require',
  'model',
  'shape',
  'sketch',
  'schema',
  'contract',
  'record',
  'ai',
] as const
```

In `Architecture.tsx`, import `STEP_IDS` and type the `STEPS` array so a step id outside the list is a type error:

```tsx
import { STEP_IDS } from './steps'

const STEPS: (Step & { id: (typeof STEP_IDS)[number] })[] = [
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/characteristics.test.ts`
Expected: PASS.

Run: `cd web && pnpm typecheck`
Expected: clean. A mismatch between `STEPS` and `STEP_IDS` is now a compile error.

- [ ] **Step 5: Teeth check**

Delete `'schema'` from `STEP_IDS`. Run `pnpm typecheck` — expect a type error on the `schema` step in `Architecture.tsx`. Run `pnpm vitest run src/features/architecture/characteristics.test.ts` — expect the trace-row test to fail naming the characteristic that points at it. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/steps.ts web/src/features/architecture/Architecture.tsx web/src/features/architecture/characteristics.test.ts
git commit -m "refactor(architecture): single-source stage 03's step ids

characteristics.test.ts checked trace-row links against a hardcoded copy of the
nine step ids. That was fine while the ids never moved and useless the moment
they did: a row pointing at \`schema\` after its decision moved to a split-out
step still passes, because \`schema\` still exists.

The list now lives in steps.ts, Architecture.tsx types its STEPS against it so a
mismatch is a compile error, and the split tasks that follow carry re-pointing
the affected trace rows as an explicit step rather than as something to
remember.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## How the split tasks work

Tasks 4 through 12 all have the same shape, so it is written once here. Each task still lists its own seam, its own new step id, and its own content.

**The exit condition is the measurement, not the edit.** A split that leaves the panel over four screens is not done. If the first seam is not enough, split again at the next `<Section>` boundary, or move elaboration behind an expand-to-reveal (`PATTERNS.md`, "Expand to reveal" — exemplars `ValidationLadder`, `AIWorkflow`, `WorkedExample`). Do not meet the threshold by deleting teaching content (D-49).

**The per-task loop:**

1. Add the new id to `STEP_IDS` in `steps.ts`, in rail order, then add the step to `STEPS` in `Architecture.tsx` with `id`, `label`, `hint`.
2. Move the named `<Section>` blocks from the old step's `content` into the new one. Move, do not retype.
3. **Re-point any affected trace rows.** Open `characteristics.ts` and read every `TRACE_ROWS[].stepId` and `stepLabel`. If a row's decision moved into the new step, re-point it. Nothing catches this: the row keeps naming a step that still exists, the test still passes, and `TraceForward.tsx:76` links the reader somewhere the decision is no longer made. This is the step most likely to be skipped, which is why it is third rather than last.
4. Renumber `<Figure n={…}>` across the whole stage so the sequence stays contiguous. Figure numbers run across the stage, not per step (`CLAUDE.md`).
5. Add the new hash to `PAGES` in `web/e2e/audit.spec.ts`.
6. Delete the old step's entry from `PANEL_EXCEPTIONS`.
7. Run `pnpm test:e2e --grep "no step panel exceeds"`. It must pass with the entry gone. If it fails, the split was not enough — go back to 2.
8. Run `pnpm test:e2e --grep "every listed step hash"` — the new hash must resolve.
9. Run `pnpm test && pnpm lint && pnpm typecheck && pnpm format:check`.
10. Browser pass at 320px and 1440px, both themes: no horizontal overflow, no sub-44px target below `lg`, zero console errors.
11. Commit.

---

### Task 4: Split `model` into `model` and `interrogate`

Deriving the nouns and interrogating them are two acts, and the doc separates them. `model` is 6.0 screens.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx` (step `model`, lines 159–275)
- Modify: `web/e2e/audit.spec.ts` (`PAGES`, `PANEL_EXCEPTIONS`)

**Interfaces:**
- Produces: step id `interrogate`, hash `/stages/03-architecture#interrogate`.

- [ ] **Step 1: Cut at the seam**

`model` keeps the noun derivation:
- `<Section eyebrow="The highest stakes" title="Model the domain first, in nouns">` (from line 166)

`interrogate` takes the rest, in this order:
- `<Section eyebrow="Your turn" title="Interrogate the model">` (from line 204) — the six questions
- `<Section title="Anything stored can disagree with itself">` (from line 226) — the drift diagram, which is the first question's consequence
- `<Section eyebrow="The artifact" title="Write down your own domain">` (from line 247) — the worksheet, which is what you fill in after interrogating

New step entry, placed immediately after `model` in `STEPS`:

```tsx
{
  id: 'interrogate',
  label: 'Interrogate',
  hint: 'Six questions that find the design errors early',
  content: (
    <div className="space-y-16">
      {/* the three Sections moved from `model` */}
    </div>
  ),
},
```

- [ ] **Step 2: Renumber figures**

The figures currently in `model` are 3 (domain sketch), 4 (drift). Keep the stage-wide sequence contiguous after the move — `model` keeps 3, `interrogate` takes 4 onward. Every later figure shifts by zero here since nothing was added, only moved. Verify by grepping `n={` and confirming the sequence is 1..N with no gaps and no repeats.

- [ ] **Step 3: Add the hash and drop the exception**

In `web/e2e/audit.spec.ts`, add `'/stages/03-architecture#interrogate',` to `PAGES` after the `#model` entry, and delete the `'/stages/03-architecture#model': 6.0,` line from `PANEL_EXCEPTIONS`.

- [ ] **Step 4: Verify the panel is actually under**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. If `model` or `interrogate` is still over 4.0, the seam was wrong — move the worksheet section back to `model` and re-measure.

- [ ] **Step 5: Verify the hash resolves**

Run: `cd web && pnpm test:e2e --grep "every listed step hash"`
Expected: PASS, `#panel-interrogate` visible.

- [ ] **Step 6: Full gate and browser pass**

Run: `cd web && pnpm test && pnpm lint && pnpm typecheck && pnpm format:check && pnpm test:e2e`
Then the browser pass from the per-task loop, step 10.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/architecture/Architecture.tsx web/e2e/audit.spec.ts
git commit -m "feat(architecture): split model into deriving the nouns and interrogating them

The panel was 6.0 screens and held two acts: striking properties out of a noun
list, then asking the six questions that correct it. The doc separates them and
the panel did not.

Removes model from D-52's temporary exception list.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Split `sketch` into `sketch` and `resilience`, and port the resilience cluster

`sketch` is 6.1 screens and is about to receive four patterns the doc added after the port (`docs/stage-03-status.md`, section 7). Splitting and porting are the same edit.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx` (step `sketch`, lines 469–582)
- Modify: `web/src/features/architecture/sketch.ts` and `sketch.test.ts`
- Modify: `web/src/lib/terms.ts` if the four patterns are not already glossary terms
- Modify: `web/e2e/audit.spec.ts`

**Interfaces:**
- Produces: step id `resilience`, hash `/stages/03-architecture#resilience`; `RESILIENCE_PATTERNS` exported from `web/src/features/architecture/sketch.ts`.

- [ ] **Step 1: Cut at the seam**

`sketch` keeps what you depend on:
- `<Section eyebrow="The objection" title="Sketch the system">` (line 474) — container view
- `<Section title="Pick the flow that crosses the most boundaries">` (line 512) — data flow

`resilience` takes what happens when a dependency misbehaves:
- `<Section eyebrow="The fork" title="Synchronous or asynchronous">` (line 529)
- `<Section title="Anything received has to be safe twice">` (line 551) — idempotency
- `<Callout kind="info" title="What is deliberately not here">` (line 569)

```tsx
{
  id: 'resilience',
  label: 'Resilience',
  hint: 'What happens when something you depend on is slow, or down',
  content: (
    <div className="space-y-16">
      {/* the moved Sections, then the new Section from Step 2 */}
    </div>
  ),
},
```

- [ ] **Step 2: Write the failing test for the new content**

The doc's "Sketch the system" section names four patterns. Add to `web/src/features/architecture/sketch.test.ts`:

```ts
import { RESILIENCE_PATTERNS } from './sketch'

test('all four resilience patterns are carried, since a reader meeting circuit breaker first in an interview was failed by the stage', () => {
  const ids = RESILIENCE_PATTERNS.map((p) => p.id)
  expect(ids).toEqual([
    'timeout',
    'backoff-jitter',
    'circuit-breaker',
    'graceful-degradation',
  ])
})

test('every pattern names the failure it answers, because the pattern without its failure mode is vocabulary', () => {
  for (const p of RESILIENCE_PATTERNS) {
    expect(p.failure.trim().length, `${p.id} has no failure mode`).toBeGreaterThan(0)
    expect(p.what.trim().length, `${p.id} has no description`).toBeGreaterThan(0)
  }
})

test('backoff carries jitter and says why, since retrying in lockstep is the failure that makes retries worse than none', () => {
  const backoff = RESILIENCE_PATTERNS.find((p) => p.id === 'backoff-jitter')
  expect(backoff?.what).toMatch(/jitter/i)
  expect(backoff?.failure).toMatch(/same moment|lockstep|thunder|synchron/i)
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: FAIL — `RESILIENCE_PATTERNS` is not exported from `./sketch`. Right reason: the data does not exist.

- [ ] **Step 4: Implement the data**

In `web/src/features/architecture/sketch.ts`, sourced from `docs/03-architecture.md`, "Sketch the system":

```ts
export type ResiliencePattern = {
  id: string
  name: string
  /** The failure this answers. Without it the pattern is vocabulary. */
  failure: string
  what: string
}

/** Source: docs/03-architecture.md, "Sketch the system". */
export const RESILIENCE_PATTERNS: ResiliencePattern[] = [
  // Fill each entry from the doc's prose. Do not paraphrase from memory —
  // open the section and mirror what it actually says (D-51).
]
```

Populate all four entries from the doc section. Then render them in the `resilience` step through an expand-to-reveal component, following `PATTERNS.md`'s "Expand to reveal" row.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: PASS.

- [ ] **Step 6: Grep terms.ts (D-47)**

Run: `grep -n "circuit breaker\|backoff\|jitter\|graceful degradation" web/src/lib/terms.ts`
If any of the four is missing, add it, then run `pnpm gen:glossary` and `pnpm vitest run src/lib/glossary.test.ts`. Never hand-edit `reference/glossary.md`.

- [ ] **Step 7: Hash, exception, gate, browser, commit**

Follow the per-task loop steps 3 and 5 through 11. Add `'/stages/03-architecture#resilience',` to `PAGES`; delete `'/stages/03-architecture#sketch': 6.1,`.

```bash
git commit -m "feat(architecture): split resilience out of sketch, and port its four patterns

The panel was 6.1 screens before adding anything, and the doc had grown
timeout, backoff with jitter, circuit breaker and graceful degradation after
the port was built (TD-23). Drawing what you depend on and deciding what
happens when it is down are different judgments, so they are different steps.

Removes sketch from D-52's temporary exception list.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Split `schema` into `schema` and `concurrency`, and port the consistency cluster

`schema` is 8.4 screens, the heaviest panel in the app, and the doc added isolation levels, locking, CAP and eventual consistency after the port.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx` (step `schema`, lines 583–788)
- Create: `web/src/features/architecture/concurrency.ts` and `concurrency.test.ts`
- Modify: `web/src/lib/terms.ts`
- Modify: `web/e2e/audit.spec.ts`

**Interfaces:**
- Produces: step id `concurrency`, hash `/stages/03-architecture#concurrency`; `LOCKING_STRATEGIES` exported from `web/src/features/architecture/concurrency.ts`.

- [ ] **Step 1: Cut at the seam**

`schema` keeps the shape of the data:
- `<Section eyebrow="The shape" title="Design the database">` (line 588) — ER view
- `<Section eyebrow="Where the rule lives" title="Constraints belong in the database">` (line 616) — DDL inspector and `invoice_sends`
- `<Section eyebrow="Answering real queries" title="Indexes come from the sketch, not from intuition">` (line 674)
- `<Section eyebrow="The rule UNIQUE cannot express" title="Some constraints have a condition on them">` (line 696)
- `<Section eyebrow="The two left implicit" title="Actors and tenancy are stored data too">` (line 719)
- `<Section eyebrow="The one that cannot be undone" title="Delete behaviour, decided per entity">` (line 749)

`concurrency` takes what two writers do to it:
- `<Section eyebrow="Beyond one row" title="Some invariants no constraint can express">` (line 770) — transactions
- plus the new content from Step 2

**Measure after this cut before writing anything new.** Moving one prose section off an 8.4-screen panel will not get it under 4.0. Expect a second cut, and take it at `<Section eyebrow="The two left implicit">` — tenancy and delete behaviour are a third judgment (who owns the row, and what happens when it goes) and would become a `tenancy` step, taking the stage to fifteen. Record which you did and why in the commit body.

- [ ] **Step 2: Write the failing test for the new content**

Create `web/src/features/architecture/concurrency.test.ts`:

```ts
import { expect, test } from 'vitest'
import { LOCKING_STRATEGIES } from './concurrency'

test('both locking strategies are carried, since the rule is a choice between them and not a single answer', () => {
  expect(LOCKING_STRATEGIES.map((s) => s.id)).toEqual(['optimistic', 'pessimistic'])
})

test('each strategy names when it is wrong, because a strategy without its failure case reads as the answer', () => {
  for (const s of LOCKING_STRATEGIES) {
    expect(s.useWhen.trim().length, `${s.id} useWhen`).toBeGreaterThan(0)
    expect(s.wrongWhen.trim().length, `${s.id} wrongWhen`).toBeGreaterThan(0)
  }
})

test('pessimistic names the human-in-the-gap case as its failure, which is the one the doc says catches people', () => {
  const p = LOCKING_STRATEGIES.find((s) => s.id === 'pessimistic')
  expect(p?.wrongWhen).toMatch(/person|human|reads their email|waits on/i)
})

test('optimistic carries the version-is-stored-data consequence, since that makes it a decide-now column', () => {
  const o = LOCKING_STRATEGIES.find((s) => s.id === 'optimistic')
  expect(o?.note).toMatch(/stored data|decide-now|expand-contract/i)
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/concurrency.test.ts`
Expected: FAIL — cannot resolve `./concurrency`. Right reason: the module does not exist.

- [ ] **Step 4: Implement**

Create `web/src/features/architecture/concurrency.ts`, sourced from `docs/03-architecture.md`, "Design the database" (its "Transactions, isolation and locking" subsection):

```ts
export type LockingStrategy = {
  id: 'optimistic' | 'pessimistic'
  name: string
  how: string
  useWhen: string
  /** The case where this choice is actively wrong. */
  wrongWhen: string
  note?: string
}

/** Source: docs/03-architecture.md, "Design the database". */
export const LOCKING_STRATEGIES: LockingStrategy[] = [
  // Populate from the doc. Both entries required.
]
```

Then build the `concurrency` step's panel. The doc's own emphasis is that **neither lock protects a cross-row rule** — two managers approving two different claims on the same shift — and that the tool for it is the partial unique index already taught in `schema`. That trap is the step's centrepiece; a guess-then-reveal fits it (`PATTERNS.md`), because a reader who has just learned optimistic locking will answer it wrong.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/concurrency.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Grep terms.ts (D-47)**

Run: `grep -n "isolation\|read committed\|serializable\|optimistic\|pessimistic\|CAP\|eventual consistency" web/src/lib/terms.ts`
Add what is missing, run `pnpm gen:glossary`, and re-run `pnpm vitest run src/lib/glossary.test.ts`.

- [ ] **Step 7: Hash, exception, gate, browser, commit**

Per-task loop steps 3 and 5 through 11. Delete `'/stages/03-architecture#schema': 8.4,`.

```bash
git commit -m "feat(architecture): split concurrency out of schema, and port isolation and locking

At 8.4 screens schema was the heaviest panel in the app before the doc's
consistency cluster was ported into it. What shape the data takes and what two
simultaneous writers do to it are different judgments.

Carries the trap the doc is emphatic about: neither lock protects a rule that
spans rows, and the tool for that is the partial unique index from the schema
step. A reader who has just learned optimistic locking answers it wrong, which
is why it is a guess-then-reveal.

Removes schema from D-52's temporary exception list.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Build the `evolve` step for doc section 9

The only doc section with no app step at all. It is new content rather than a split, so no exception is removed.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx`
- Create: `web/src/features/architecture/evolve.ts` and `evolve.test.ts`
- Create: `web/src/features/architecture/ExpandContract.tsx`
- Modify: `web/src/lib/terms.ts`, `web/e2e/audit.spec.ts`

**Interfaces:**
- Produces: step id `evolve`, hash `/stages/03-architecture#evolve`; `EXPAND_CONTRACT_STEPS` exported from `web/src/features/architecture/evolve.ts`.

- [ ] **Step 1: Write the failing test**

`docs/stage-03-status.md` records the interactive shape this section wants: a guess-then-reveal on which step people skip, and the answer is 2 and 5.

Create `web/src/features/architecture/evolve.test.ts`:

```ts
import { expect, test } from 'vitest'
import { EXPAND_CONTRACT_STEPS } from './evolve'

test('the sequence is six steps, which is what makes it a sequence rather than "add a column carefully"', () => {
  expect(EXPAND_CONTRACT_STEPS).toHaveLength(6)
})

test('steps two and five are the skipped ones, because those are the two with no visible effect when you are the only user', () => {
  const skipped = EXPAND_CONTRACT_STEPS.filter((s) => s.commonlySkipped).map(
    (s) => s.n,
  )
  expect(skipped).toEqual([2, 5])
})

test('every step says what breaks if it is skipped, since the sequence without its failure modes is a checklist', () => {
  for (const s of EXPAND_CONTRACT_STEPS) {
    expect(s.ifSkipped.trim().length, `step ${s.n} ifSkipped`).toBeGreaterThan(0)
  }
})

test('step numbers are contiguous from one, because the order is the whole content', () => {
  expect(EXPAND_CONTRACT_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6])
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/evolve.test.ts`
Expected: FAIL — cannot resolve `./evolve`.

- [ ] **Step 3: Implement**

Create `web/src/features/architecture/evolve.ts` from `docs/03-architecture.md`, "Evolve the schema safely":

```ts
export type ExpandContractStep = {
  n: number
  title: string
  what: string
  /** What goes wrong if this step is skipped. */
  ifSkipped: string
  /** Marks the steps a solo developer skips because nothing visibly breaks. */
  commonlySkipped?: boolean
}

/** Source: docs/03-architecture.md, "Evolve the schema safely". */
export const EXPAND_CONTRACT_STEPS: ExpandContractStep[] = [
  // Six entries, from the doc's own sequence.
]
```

Build `ExpandContract.tsx` as a guess-then-reveal: the reader picks which steps they would skip, then sees which two are the answer and why. Follow the interaction conventions already used in this feature (`role="radio"` inside `role="radiogroup"`, nothing checked on load, the explanation shown whichever way they answered — `scoring.test.ts` and the e2e test in `audit.spec.ts:237` hold stage 03 to that last rule).

The step also carries, from the doc: rolling deploys, backfill guards, `ALTER` lock safety, and the strangler fig. Put them behind an expand-to-reveal so the panel stays under four screens.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/evolve.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Place the step**

Insert `evolve` into `STEPS` after `schema`/`concurrency` and before `contract`, matching doc order. Renumber figures across the stage.

- [ ] **Step 6: Grep terms.ts (D-47)**

Run: `grep -n "expand-contract\|strangler\|backfill\|rolling deploy" web/src/lib/terms.ts`
Add what is missing, `pnpm gen:glossary`, re-run the glossary test.

- [ ] **Step 7: Gate, browser, commit**

Per-task loop steps 3 to 5 and 7 through 11. Add `'/stages/03-architecture#evolve',` to `PAGES`. No exception to delete — this panel is new and must be under four screens on its first measurement.

```bash
git commit -m "feat(architecture): add the evolve step for changing a live schema

Doc section 9 had no app step at all — the last section of stage 03 with none.
The six-step expand-contract sequence is a guess-then-reveal because the
interesting fact about it is which steps get skipped: 2 and 5, the two with no
visible effect while you are the only user.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Split `contract` into `contract` and `access`

`contract` is 5.3 screens and holds two doc sections: "Design the API contracts" and "Authentication and authorization". The promise and who may invoke it are different judgments.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx` (step `contract`, lines 789–888)
- Modify: `web/e2e/audit.spec.ts`

**Interfaces:**
- Produces: step id `access`, hash `/stages/03-architecture#access`.

- [ ] **Step 1: Cut at the seam**

`contract` keeps:
- `<Section eyebrow="The axis again" title="Design the API contracts">` (line 794) — contract sort, verb-route problem

`access` takes:
- `<Section title="Decide auth early, deliberately">` (line 834) — `AuthPaths`
- `<Section title="Which pattern applies to which entity?">` (line 859) — `AuthzPatterns`

```tsx
{
  id: 'access',
  label: 'Access',
  hint: 'Who the caller is, and what they may do',
  content: (
    <div className="space-y-16">
      {/* the two moved Sections */}
    </div>
  ),
},
```

Do not modify `AuthzPatterns` while moving it. It was fixed on this branch in `bd018a9` — it had been scoring `role` alone as correct on the manager-approves-a-swap scenario, the framing that produces cross-team privilege escalation, and is now a checkbox conjunction. Move it intact.

- [ ] **Step 2: Renumber figures, add the hash, drop the exception**

Add `'/stages/03-architecture#access',` to `PAGES`; delete `'/stages/03-architecture#contract': 5.3,`.

- [ ] **Step 3: Verify**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"` — PASS with the entry gone.
Run: `cd web && pnpm test:e2e --grep "every listed step hash"` — PASS.

- [ ] **Step 4: Full gate, browser pass, commit**

Per-task loop steps 9 through 11. The browser pass matters here specifically: `AuthzPatterns`'s checkbox group is new on this branch and `docs/stage-03-status.md` flags it as needing a contrast and touch-target check.

```bash
git commit -m "feat(architecture): split access out of contract

Two doc sections shared one 5.3-screen panel. What the API promises and who is
allowed to invoke it are different decisions, and the authorization one is the
decision this stage has already got wrong once (bd018a9).

AuthzPatterns moves intact — it is the fixed version, scoring the conjunction
rather than role alone.

Removes contract from D-52's temporary exception list.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Compress `shape`, and port statelessness, scaling and pooling

`shape` is 7.1 screens — the second-heaviest panel — and holds three doc sections (4, 5, 6). The spec records this as the weakest "one judgment" claim in the reshape and pre-authorises a split if compression is not enough.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx` (step `shape`, lines 276–468)
- Modify: `web/src/features/architecture/styles.ts`, `styles.test.ts`
- Modify: `web/src/lib/terms.ts`, `web/e2e/audit.spec.ts`

- [ ] **Step 1: Write the failing test for the new content**

Add to `web/src/features/architecture/styles.test.ts`:

```ts
import { SCALING_MOVES } from './styles'

test('scaling names both axes and the precondition, since scaling out without statelessness is the thing that does not work', () => {
  const ids = SCALING_MOVES.map((m) => m.id)
  expect(ids).toContain('stateless')
  expect(ids).toContain('scale-up')
  expect(ids).toContain('scale-out')
})

test('statelessness is marked as the precondition rather than a peer, because more instances is not an option without it', () => {
  const stateless = SCALING_MOVES.find((m) => m.id === 'stateless')
  expect(stateless?.precondition).toBe(true)
})

test('the serverless-to-Postgres pooling edge is carried, since it is the one that bites a solo developer on their first deploy', () => {
  const pooling = SCALING_MOVES.find((m) => m.id === 'pooling')
  expect(pooling).toBeDefined()
  expect(pooling?.what).toMatch(/pool/i)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/styles.test.ts`
Expected: FAIL — `SCALING_MOVES` is not exported. Right reason: the data does not exist.

- [ ] **Step 3: Implement the data**

In `web/src/features/architecture/styles.ts`, from `docs/03-architecture.md`, "The shapes a system can take":

```ts
export type ScalingMove = {
  id: string
  name: string
  what: string
  /** True for statelessness, which is not a peer move but what makes scale-out possible. */
  precondition?: boolean
}

/** Source: docs/03-architecture.md, "The shapes a system can take". */
export const SCALING_MOVES: ScalingMove[] = [
  // stateless (precondition), scale-up, scale-out, load-balancing,
  // read-replicas, pooling. Populate from the doc.
]
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/styles.test.ts`
Expected: PASS.

- [ ] **Step 5: Compress the panel**

Convert `<Section eyebrow="The landscape" title="The shapes a system can take">` (line 281) — the four-style landscape — to expand-to-reveal: each style shows its name and one-line summary, with the trade-off paragraph behind the click. D-44 governs this section, so the recommendation must still arrive derived rather than asserted; the summary line is what carries that, and it stays visible.

- [ ] **Step 6: Measure, and split if needed**

Delete `'/stages/03-architecture#shape': 7.1,` from `PANEL_EXCEPTIONS` and run `pnpm test:e2e --grep "no step panel exceeds"`.

If `shape` is still over 4.0, split it — this is expected and pre-authorised by the spec. `shape` keeps the styles landscape, `YourCharacteristics` and "Start with one application"; a new `boundaries` step takes `<Section eyebrow="Your turn" title="Is this a reason to split?">` (line 365) and `<Section title="Boundaries you keep honest">` (line 381), which is doc sections 5 and 6. Add `'/stages/03-architecture#boundaries',` to `PAGES`. The stage is then fourteen content steps plus AI.

Say in the commit body which of the two happened.

- [ ] **Step 7: Grep terms.ts, gate, browser, commit**

Run: `grep -n "stateless\|horizontal scaling\|vertical scaling\|load balanc\|read replica\|connection pool" web/src/lib/terms.ts`, add what is missing, `pnpm gen:glossary`.

```bash
git commit -m "feat(architecture): compress the styles landscape, and port scaling and pooling

shape was 7.1 screens carrying three doc sections. The four-style landscape
moves behind expand-to-reveal so the trade-offs stay in full while the panel
stops being a scroll, and the recommendation still arrives derived (D-44).

Ports statelessness as the precondition it is rather than a peer of scale-up
and scale-out, plus load balancing, read replicas, and the serverless-to-
Postgres pooling edge.

Removes shape from D-52's temporary exception list.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Compress `ai`, and port the four new plays and the fifth mislead

`ai` is 4.7 screens — already over — and the doc added four plays and one mislead after the port (`docs/stage-03-status.md`, section 14). It cannot absorb them as-is.

**Files:**
- Modify: `web/src/features/architecture/AIArchitecturePlays.tsx`
- Modify: `web/src/features/architecture/Architecture.tsx` (step `ai`, lines 959 onward)
- Modify: `web/e2e/audit.spec.ts`

- [ ] **Step 1: Write the failing test**

The plays and misleads live in `AIArchitecturePlays.tsx`. Move the data into a sibling module so it is testable without a component harness, matching how `scoring.ts` and `styles.ts` already work in this feature. Create `web/src/features/architecture/ai-plays.test.ts`:

```ts
import { expect, test } from 'vitest'
import { AI_PLAYS, AI_MISLEADS } from './ai-plays'

test('eleven plays are carried, since the doc grew four after the port and an app short of them teaches a stale set', () => {
  expect(AI_PLAYS).toHaveLength(11)
})

test('six misleads are carried, for the same reason', () => {
  expect(AI_MISLEADS).toHaveLength(6)
})

test('every play says what you still have to judge, because a play without that reads as an instruction to delegate the decision', () => {
  for (const p of AI_PLAYS) {
    expect(p.youJudge.trim().length, `${p.id} youJudge`).toBeGreaterThan(0)
  }
})

test('play and mislead ids do not collide, since both render in one panel', () => {
  const ids = [...AI_PLAYS, ...AI_MISLEADS].map((x) => x.id)
  expect(new Set(ids).size).toBe(ids.length)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/ai-plays.test.ts`
Expected: FAIL — cannot resolve `./ai-plays`.

- [ ] **Step 3: Implement**

Extract the existing seven plays and five misleads from `AIArchitecturePlays.tsx` into `web/src/features/architecture/ai-plays.ts`, then add the four plays and one mislead from `docs/03-architecture.md`, "AI in architecture". Read the doc section; do not reconstruct from the existing component.

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/ai-plays.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Compress**

Seventeen items cannot render expanded in four screens. Render both lists as expand-to-reveal, showing the play's name and its one-line summary with the detail behind the click.

- [ ] **Step 6: Measure, gate, browser, commit**

Delete `'/stages/03-architecture#ai': 4.7,` and run the panel test. Then the full gate and browser pass.

```bash
git commit -m "feat(architecture): port four more AI plays and a fifth mislead, behind expand-to-reveal

The panel was 4.7 screens before adding anything and the doc had grown to
eleven plays and six misleads. Seventeen items do not render expanded inside
D-52's four screens, so both lists become expand-to-reveal with the summary
line visible.

Data moves out of the component into ai-plays.ts, matching scoring.ts and
styles.ts, so the set can be tested without a component harness.

Removes ai from D-52's temporary exception list.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Port the remaining two clusters into `require` and `record`

The last two of the five clusters in `docs/stage-03-status.md`. Neither step is over threshold, so this task adds content and must not push either past 4.0.

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx` (steps `require` and `record`)
- Modify: `web/src/features/architecture/characteristics.ts` and its test
- Modify: `web/src/lib/terms.ts`, `web/e2e/audit.spec.ts`

- [ ] **Step 1: Write the failing tests**

Add to `web/src/features/architecture/characteristics.test.ts`:

```ts
test('the trace table covers all ten candidate characteristics, which was the doc round’s actual deliverable', () => {
  expect(TRACE_ROWS).toHaveLength(10)
})

test('every trace row names the decision the characteristic forces, since a characteristic that forces nothing is a label', () => {
  for (const r of TRACE_ROWS) {
    // `characteristicId`, not `id` — TraceRow has no `id` field.
    expect(r.forces.trim().length, `${r.characteristicId} forces`).toBeGreaterThan(0)
  }
})

test('fitness functions are framed as a note now and a test later, because standing up an import-graph linter before the first table is the infrastructure this stage refuses', () => {
  expect(FITNESS_FUNCTION_NOTE).toMatch(/06|testing/i)
})
```

For the `record` step, the deferral data currently lives as a local `const ITEMS` inside `DeferredList.tsx:39`, which cannot be tested without a component harness. Extract it to `web/src/features/architecture/defer.ts` as `DEFERRED_ITEMS` (keeping the existing `Item` shape), have `DeferredList.tsx` import it, then add `DEFERRED_CONCEPTS` alongside for the named-not-taught set.

Create `web/src/features/architecture/defer.test.ts`:

```ts
import { expect, test } from 'vitest'
import { DEFERRED_CONCEPTS, DEFERRED_ITEMS } from './defer'

test('the existing deferral list survived the extraction intact, since this moved data that was already reviewed', () => {
  expect(DEFERRED_ITEMS.length).toBeGreaterThan(0)
  expect(new Set(DEFERRED_ITEMS.map((i) => i.id)).size).toBe(DEFERRED_ITEMS.length)
})

test('event sourcing and CQRS are defined and left named-not-taught, since D-49 puts them outside this stage’s filter', () => {
  const ids = DEFERRED_CONCEPTS.map((c) => c.id)
  expect(ids).toContain('event-sourcing')
  expect(ids).toContain('cqrs')
  for (const c of DEFERRED_CONCEPTS) {
    expect(c.definition.trim().length, `${c.id} definition`).toBeGreaterThan(0)
  }
})

test('the CQRS definition does not bundle event sourcing into itself, which is the conflation the doc corrects', () => {
  const cqrs = DEFERRED_CONCEPTS.find((c) => c.id === 'cqrs')
  expect(cqrs?.definition).toMatch(/separat|read|write/i)
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd web && pnpm vitest run src/features/architecture/`
Expected: FAIL on the missing exports. Confirm each failure names a missing symbol, not a typo.

- [ ] **Step 3: Implement both**

From `docs/03-architecture.md`, "What this system has to be" (the ten-row trace table and the fitness-function paragraph) and "Defer aggressively" (event sourcing and CQRS). The doc is explicit that fitness functions are **not** built in this stage — one line per characteristic in your notes, with the check itself belonging to `06 — Testing`. Mirror that framing; do not turn it into a task.

- [ ] **Step 4: Run to verify they pass**

Run: `cd web && pnpm vitest run src/features/architecture/`
Expected: PASS.

- [ ] **Step 5: Measure**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. Neither `require` (2.7 before this) nor `record` (3.0 before this) may cross 4.0. If either does, move the added material behind an expand-to-reveal rather than baselining it.

- [ ] **Step 6: Grep terms.ts, gate, browser, commit**

```bash
git commit -m "feat(architecture): port fitness functions, the widened trace, and the deferred concepts

The last two of the five clusters TD-23 opened. The trace table goes from three
rows to all ten candidates, which was the doc round's actual deliverable, and
fitness functions arrive framed the way the doc frames them: a line in your
notes now, a test in 06 once there is something to check.

Event sourcing and CQRS are defined and left named-not-taught, per D-49.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Record the decision

**Files:**
- Modify: `docs/tracker.md`, `web/PATTERNS.md`, `docs/stage-03-status.md`, `KICKOFF.md`

- [ ] **Step 1: Append D-52 to `docs/tracker.md`**

Decisions are appended and superseded, never edited. D-38's entry stays as written; add a superseded marker pointing at D-52. D-52's entry carries the measurement table, the four-screen threshold with its derivation from stage 01 and 02's 3.2-screen second-heaviest panels, and the fact that stage 02 had already exceeded D-38 without a recorded deviation.

- [ ] **Step 2: Update `web/PATTERNS.md`**

The `Stepper` row currently says "Splits a stage into 4–6 steps". Reframe four-to-six as the typical range and state the panel rule and its threshold, since that is where a stage author will meet it. Note that the AI step stays beyond the content steps (D-35).

- [ ] **Step 3: Update `docs/stage-03-status.md`**

Tick the step-count task with the shape that shipped and the final count. Re-point the section-9 and five-cluster tasks at the steps that now own them. Update the header's step count and test totals.

- [ ] **Step 4: Update `KICKOFF.md`**

Project state: the new step count, the new test totals, and D-52 in place of D-38.

- [ ] **Step 5: Humanizer pass**

Per `CLAUDE.md`, run `humanizer:humanizer` over the tracker and PATTERNS prose. Skip the tables and the terminal output. Apply what makes it clearer; skip what would flatten the house voice. Check em-dash density against `docs/02-planning.md` and `docs/03-architecture.md` rather than against zero.

- [ ] **Step 6: Commit**

```bash
git commit -m "docs(tracker): record D-52 and supersede D-38

D-38 stays as written, with a superseded marker. D-52 carries the measurement
that motivated it and the derivation of the four-screen threshold.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

- [ ] `PANEL_EXCEPTIONS` has exactly two entries: `01-product-discovery#record` and `02-planning#horizon`. Any stage 03 entry left means a panel was baselined rather than fixed.
- [ ] `cd web && pnpm test` — full vitest suite green. Paste the count.
- [ ] `cd web && pnpm test:e2e` — 12 tests green over the widened `PAGES`. Paste the count.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm format:check` — all clean.
- [ ] Re-run the panel measurement across all three stages and paste the table, so D-52's own claim is evidenced rather than asserted.
- [ ] `grep -n "n={" web/src/features/architecture/Architecture.tsx` — figure numbers contiguous from 1, no gaps, no repeats.
- [ ] Every stage 03 step hash is in `PAGES` and resolves (the guard from `214bce0` proves the second half).
- [ ] `pnpm vitest run src/lib/` — `stage-03-structure`, `source-citations`, `glossary` and `stage-metadata` all still pass. The doc did not move in this plan, so a failure here means an app-side citation went stale.
- [ ] Browser pass on every new step: 320→2560px, both themes, WCAG AA, no sub-44px target below `lg`, zero console errors.
- [ ] **Whole-branch review before merge**, covering doc and app together. Still outstanding from `docs/stage-03-status.md`; the port half has never been reviewed, and it is now larger than when that was written.

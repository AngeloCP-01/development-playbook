# Stage 02 — Product Planning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe stage 02 as Product Planning with a roadmap horizon, then build it as the second interactive stage.

**Architecture:** Content first — `docs/02-planning.md` is amended and committed before any component, so the app is ported from an already-correct doc. Stage 01's worksheet shape moves to a shared `web/src/lib/discovery-sheet.ts` so stage 02 can read it without duplicating the type. All judgment logic lives in a pure `web/src/features/planning/scoring.ts` that carries the tests; components stay presentational.

**Tech Stack:** Next.js 16 (App Router, static), React 19, TypeScript, Tailwind 4, vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-24-stage-02-product-planning-design.md`

## Global Constraints

- All app commands run from `web/`. Typecheck via `pnpm typecheck` (runs `next typegen` first) — a bare `tsc --noEmit` passes only on a stale `.next`.
- Slug stays `02-planning`. Only the display title becomes "Product Planning".
- `docs/02-planning.md` keeps its seven sections — new material goes **inside** "The work".
- No version numbers in stage docs; versions live in `reference/stack.md`.
- `Stepper` takes `Step[]` of `{ id, label, hint, content }` and caps at 6 steps.
- `Figure` takes `{ n, caption }`; numbers run across the whole stage and are passed explicitly. Straight double quotes break the caption attribute — use `&ldquo;`/`&rdquo;` or typographic quotes.
- `Term` sits inside `<p>`: any registered term visual must use `<span>`, never `<div>`, or hydration breaks. Put explicit `{' '}` around a `<Term>` or surrounding spaces get trimmed.
- `REFERENCES` entries per stage: 3–5, enforced by `web/src/lib/references.test.ts`. Every URL must be opened in a real browser — `WebFetch` returns navigation chrome for the Atlassian page while Playwright renders it fine.
- Never `useEffect` + `setState` to read localStorage: `react-hooks/set-state-in-effect` is an error under React 19. Use `useLocalStorage` (`web/src/lib/useLocalStorage.ts`), which returns `{ value, setValue, reset }`.
- Touch targets ≥44px below `lg` (`min-h-11`); may tighten to `lg:min-h-9` on the desktop rail.
- Anything that swaps content in place carries `aria-live="polite"`.
- Commit trailer on every commit: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Conventional Commits, lowercase after the colon. Scopes here: `planning`, `docs`, `web`, `a11y`, `tracker`.

**Note on the shared test file.** Tasks 3, 4 and 5 all append to `web/src/features/planning/scoring.test.ts`. Each shows its own `import … from './scoring'` line for readability, but **merge them into the single existing import** rather than adding a second and third statement — three imports from one module is untidy and may trip lint.

**Note on prose provenance.** Component tasks cite their copy by `docs/02-planning.md` line range rather than restating it. The doc is canonical; duplicating its prose in this plan would create a third copy that drifts, which is the TD-2/TD-3 failure mode this project already tracks. Task 1 writes that prose, so it exists before any task consumes it.

---

### Task 1: Amend the doc and retitle the stage

**Files:**
- Modify: `docs/02-planning.md` (H1, new framing block, new horizon section, spike reframe)
- Modify: `README.md:60`
- Modify: `web/src/lib/stages.ts:31,33`
- Test: `web/src/lib/stages.test.ts`

**Interfaces:**
- Produces: stage 02 titled `Product Planning`; a `### Set the horizon` section in the doc that Task 11 ports; a `### What "planning" means here` block that Task 7's Figure 1 draws.

**TDD note:** the prose itself is a documentation deliverable and carries no unit test. The `stages.ts` metadata change does, and it is what the app renders.

- [ ] **Step 1: Write the failing test**

Append to `web/src/lib/stages.test.ts`:

```ts
test('stage 02 is titled Product Planning, since the stage teaches product planning and says so', () => {
  expect(getStage('02-planning')?.title).toBe('Product Planning')
})

test('stage 02 cadence does not imply a fixed slot in a sequence, per the playbook’s central claim', () => {
  const cadence = getStage('02-planning')?.cadence ?? ''
  expect(cadence.toLowerCase()).not.toContain('before architecture')
  expect(cadence.trim().length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm test -- stages`
Expected: FAIL — first test reports `expected 'Planning' to be 'Product Planning'`; second reports the cadence still contains `before architecture`.

- [ ] **Step 3: Update the stage metadata**

In `web/src/lib/stages.ts`, replace lines 31 and 33:

```ts
    cadence: 'After discovery · re-run whenever scope shifts',
    slug: '02-planning',
    title: 'Product Planning',
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm test -- stages`
Expected: PASS, all tests in the file.

- [ ] **Step 5: Retitle in the doc and README**

`docs/02-planning.md` line 1 becomes `# 02. Product Planning`.

`README.md:60` becomes:

```markdown
2. [Product Planning](docs/02-planning.md) — scope, sequence, and what you are deliberately not doing
```

- [ ] **Step 6: Add the framing block**

Insert into `docs/02-planning.md` immediately after `## The work` (line 19), before `### Define done before defining work`:

```markdown
### What "planning" means here

*Product planning* covers more ground elsewhere than it does in this stage. The standard
treatment runs seven steps — ideate, research the market, set vision and goals, write
specifications, build a roadmap, prototype, launch — which spans most of this playbook
rather than one document of it.

This stage is the middle of that band:

| Elsewhere in the phrase | Here |
|---|---|
| Ideation, market research, prototyping | [01 — Product Discovery](01-product-discovery.md) |
| **Vision and goals, specification, roadmap** | **This stage** |
| Launch | [13 — Production Deployment](13-production-deployment.md) |
| Lifecycle, sunsetting | [17](17-maintenance.md), [18](18-continuous-improvement.md) |

So the question is not whether to build. You decided that in discovery. What is left is
deciding what "built" means, what is in v1, in what order it gets made, and where it goes
afterwards.
```

- [ ] **Step 7: Name MVP and appetite where the practices already live**

In `### Cut to the core`, after the table and before "The rejected items are not gone"
(around line 50), add:

```markdown
What survives that test is your **minimum viable product** — the smallest thing that
delivers the outcome you just defined. The name is worth knowing because you will meet it
everywhere, and worth distrusting because it is usually used to mean "version one with the
hard parts removed", which is a different and worse thing.
```

In `### Estimate for sequencing, not for promises`, after the S/M/L list (around line 95),
add:

```markdown
There is a sharper version of this idea. Instead of estimating how long something will
take, decide how much time it is **worth** — the appetite — and then design something that
fits. An estimate starts with a design and ends with a number; an appetite starts with a
number and ends with a design. Solo, appetite is almost always the more useful of the two,
because you control the scope and nobody is holding you to the number.
```

- [ ] **Step 8: Add the horizon section**

Insert into `docs/02-planning.md` after `### Write the plan` ends (after line 142, before
`### Replan without guilt`):

```markdown
### Set the horizon

The plan covers v1. It does not say where the product is going — and without that, the
MVP reads as a list of things you cut rather than as a first step toward something.

Three horizons, and no dates:

**Now** — the MVP. Whatever "Cut to the core" left standing.

**Next** — what earns its way in. The "not now" list in priority order, each item waiting
on evidence rather than on a date: when three people ask for it, when a client's volume
makes it necessary.

**Later** — the product you are actually building toward. A paragraph, not a feature list.
It exists so that "Next" has a direction to be judged against.

> **Now** — Create an invoice, mark it paid, see what is overdue.
> **Next** — Recurring invoices, once a user has billed the same client three months
> running. PDF export, once someone asks twice.
> **Later** — The thing a freelancer opens on Monday to see exactly who owes them money
> and who to chase, and then does not open again that week.

Dates are the trap. A roadmap with dates becomes a promise, and a promise makes replanning
politically expensive — the plan-as-contract failure named below. Horizons carry the
sequence without the commitment.

"Next" is what [18 — Continuous Improvement](18-continuous-improvement.md) consumes once
real usage starts producing evidence. Until then it is a hypothesis in priority order.
```

- [ ] **Step 9: Reframe the spike section**

In `### Timebox the unknowns`, replace the opening sentence (line 102) with:

```markdown
Some unknowns are not scope questions but **feasibility** questions — can this be built at
all, with the tools and budget available? Discovery tested whether people want the thing;
this tests whether you can make it. When something is unknown enough to make estimation
meaningless, spike it: a timeboxed investigation with a specific question and a hard stop.
```

And after the "The output is knowledge, not code" paragraph (after line 110), add:

```markdown
The written decision is the handoff. [03 — Architecture](03-architecture.md) consumes it
directly: a spike that settles "can Stripe Connect do this" is exactly the kind of finding
that makes an architecture decision reversible-by-default instead of a guess.
```

- [ ] **Step 10: Update the artifacts and definition-of-done lists**

In `## Artifacts`, add after the one-page plan bullet:

```markdown
- A horizon: now / next / later, with "later" written as a paragraph
```

In `## Definition of done`, add:

```markdown
- [ ] A "later" written down, so the MVP is a first step rather than only a cut
```

- [ ] **Step 11: Verify the seven-section template still holds**

A naive `grep -c '^## '` does **not** work here: the doc's example plan is a fenced block
containing `## Done means`, `## Slices` and so on, and the horizon example adds `## Now`,
`## Next`, `## Later`. Counting those gives 14 and means nothing. Use a fence-aware check
and compare against the neighbouring stages:

```bash
for f in docs/01-product-discovery.md docs/02-planning.md docs/03-architecture.md; do
  echo "== $f"
  awk '/^```/{fence=!fence; next} !fence && /^## /{print "   " $0}' "$f"
done
```

Expected: all three print the same six headings — Entry criteria, The work, Artifacts,
Definition of done, Scaling to a team, Traps. Those six plus the bold "When this actually
happens" line are the seven-section template; the seventh is not a `##` heading.

- [ ] **Step 12: Run humanizer over the amended prose**

Invoke the `humanizer:humanizer` skill on the new blocks only (framing, MVP, appetite,
horizon, spike reframe). Apply fixes that improve clarity; skip any that flatten a
deliberate voice. Do not run it over the tables or the existing untouched prose.

- [ ] **Step 13: Commit**

```bash
git add docs/02-planning.md README.md web/src/lib/stages.ts web/src/lib/stages.test.ts
git commit -m "$(cat <<'EOF'
docs(planning): frame 02 as product planning and add the roadmap horizon

Names what the stage already taught, and supplies vocabulary the playbook never
used: MVP, appetite, and a now/next/later horizon. "Later" is new to the whole
playbook — nothing stated where a product was going, so the MVP read as a cut
rather than a first step.

Spikes are reframed as feasibility risk, with the written decision named as what
stage 03 consumes.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Extract the shared discovery sheet

**Files:**
- Create: `web/src/lib/discovery-sheet.ts`
- Create: `web/src/lib/discovery-sheet.test.ts`
- Modify: `web/src/features/discovery/Worksheet.tsx:16-34,111-115`

**Interfaces:**
- Produces: `DiscoverySheet` type, `DISCOVERY_KEY`, `EMPTY_SHEET`, and `readDiscoverySheet(): DiscoverySheet`. Task 10 consumes all four.

- [ ] **Step 1: Write the failing test**

Create `web/src/lib/discovery-sheet.test.ts`:

```ts
import { afterEach, expect, test, vi } from 'vitest'
import {
  DISCOVERY_KEY,
  EMPTY_SHEET,
  readDiscoverySheet,
} from './discovery-sheet'

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

test('reads a sheet stage 01 saved, which is the whole point of the carry-forward', () => {
  window.localStorage.setItem(
    DISCOVERY_KEY,
    JSON.stringify({ ...EMPTY_SHEET, success: 'They know who owes them money.' }),
  )
  expect(readDiscoverySheet().success).toBe('They know who owes them money.')
})

test('returns the empty sheet when nothing is stored, since most readers arrive at 02 cold', () => {
  expect(readDiscoverySheet()).toEqual(EMPTY_SHEET)
})

test('returns the empty sheet on malformed JSON rather than throwing into the render', () => {
  window.localStorage.setItem(DISCOVERY_KEY, '{not json')
  expect(readDiscoverySheet()).toEqual(EMPTY_SHEET)
})

test('fills missing fields from a partial sheet, so an older saved shape cannot crash a field read', () => {
  window.localStorage.setItem(DISCOVERY_KEY, JSON.stringify({ success: 'only this' }))
  const sheet = readDiscoverySheet()
  expect(sheet.success).toBe('only this')
  expect(sheet.notThis).toBe('')
})

test('coerces non-string field values to empty, because JSON.parse will hand back anything', () => {
  window.localStorage.setItem(DISCOVERY_KEY, JSON.stringify({ success: 42, notThis: null }))
  const sheet = readDiscoverySheet()
  expect(sheet.success).toBe('')
  expect(sheet.notThis).toBe('')
})

test('never writes to stage 01’s key, because stage 02 is a reader and must not corrupt it', () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem')
  const removeItem = vi.spyOn(Storage.prototype, 'removeItem')
  readDiscoverySheet()
  window.localStorage.setItem(DISCOVERY_KEY, '{bad')
  setItem.mockClear()
  readDiscoverySheet()
  expect(setItem).not.toHaveBeenCalled()
  expect(removeItem).not.toHaveBeenCalled()
})

test('survives localStorage throwing, as it does in some privacy modes', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied')
  })
  expect(readDiscoverySheet()).toEqual(EMPTY_SHEET)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm test -- discovery-sheet`
Expected: FAIL — `Failed to resolve import "./discovery-sheet"`. The module does not exist yet.

- [ ] **Step 3: Write the module**

Create `web/src/lib/discovery-sheet.ts`:

```ts
/**
 * Stage 01's worksheet shape, owned in one place.
 *
 * Stage 02 reads this sheet to carry a reader's discovery answers forward. That
 * makes the shape a contract between two stages rather than a component detail,
 * so it lives here and both import it — the alternative is a second copy that
 * drifts, which is the failure this project already tracks as TD-2 and TD-3.
 *
 * Reading is deliberately total: every failure mode returns the empty sheet
 * rather than throwing, because this runs during render.
 */

export type DiscoverySheet = {
  problem: string
  who: string
  today: string
  evidence: string
  severity: string
  success: string
  notThis: string
}

export const DISCOVERY_KEY = 'playbook:discovery-worksheet'

export const EMPTY_SHEET: DiscoverySheet = {
  problem: '',
  who: '',
  today: '',
  evidence: '',
  severity: '',
  success: '',
  notThis: '',
}

const FIELDS = Object.keys(EMPTY_SHEET) as (keyof DiscoverySheet)[]

/** Read-only. Stage 02 must never write to stage 01's key. */
export function readDiscoverySheet(): DiscoverySheet {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(DISCOVERY_KEY)
  } catch {
    return EMPTY_SHEET
  }
  if (raw === null) return EMPTY_SHEET

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return EMPTY_SHEET
  }
  if (typeof parsed !== 'object' || parsed === null) return EMPTY_SHEET

  const source = parsed as Record<string, unknown>
  const sheet = { ...EMPTY_SHEET }
  for (const field of FIELDS) {
    const v = source[field]
    if (typeof v === 'string') sheet[field] = v
  }
  return sheet
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm test -- discovery-sheet`
Expected: PASS, 7 tests.

- [ ] **Step 5: Point stage 01 at the shared module**

In `web/src/features/discovery/Worksheet.tsx`, delete the local `Sheet` type (lines 16-24)
and the local `EMPTY` constant (lines 26-34), and add to the imports:

```tsx
import {
  DISCOVERY_KEY,
  EMPTY_SHEET,
  type DiscoverySheet,
} from '@/lib/discovery-sheet'
```

Replace every `Sheet` type reference with `DiscoverySheet` (the `Field` type's
`key: keyof Sheet`, `FIELDS`, `toMarkdown(s: Sheet)`), and change the hook call:

```tsx
  const { value, setValue, reset } = useLocalStorage<DiscoverySheet>(
    DISCOVERY_KEY,
    EMPTY_SHEET,
  )
```

- [ ] **Step 6: Verify stage 01 is unchanged in behaviour**

Run: `cd web && pnpm lint && pnpm typecheck && pnpm test`
Expected: all pass, no new warnings.

Teeth check: temporarily change `DISCOVERY_KEY` to `'playbook:wrong'`, run
`pnpm test -- discovery-sheet`, confirm the read tests fail, then restore.

- [ ] **Step 7: Commit**

```bash
git add web/src/lib/discovery-sheet.ts web/src/lib/discovery-sheet.test.ts web/src/features/discovery/Worksheet.tsx
git commit -m "$(cat <<'EOF'
refactor(web): give the discovery sheet one home so stage 02 can read it

The shape and key were private to stage 01's Worksheet. Stage 02 carries those
answers forward, so copying the type would have created a third source of truth
alongside TD-2 and TD-3. Reading is total — missing, malformed, partial and
throwing storage all return the empty sheet, because it runs during render.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Scoring — the cut-to-the-core verdicts

**Files:**
- Create: `web/src/features/planning/scoring.ts`
- Create: `web/src/features/planning/scoring.test.ts`

**Interfaces:**
- Produces: `CUT_FEATURES: CutFeature[]` where `CutFeature = { id: string; label: string; core: boolean; why: string }`, and `scoreCut(answers: Record<string, boolean>): { answered: number; correct: number }`. Task 8 renders these.

Content source: `docs/02-planning.md:39-48` (the feature table) and `:50-55` (the default-no rule).

- [ ] **Step 1: Write the failing test**

Create `web/src/features/planning/scoring.test.ts`:

```ts
import { expect, test } from 'vitest'
import { CUT_FEATURES, scoreCut } from './scoring'

test('the cut table carries all eight features from the doc, so the exercise matches the prose', () => {
  expect(CUT_FEATURES).toHaveLength(8)
})

test('exactly three features are core, because the definition of done fails without them', () => {
  expect(CUT_FEATURES.filter((f) => f.core)).toHaveLength(3)
})

test('every feature explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const f of CUT_FEATURES) {
    expect(f.why.trim().length, `${f.id} has no why`).toBeGreaterThan(0)
  }
})

test('feature ids are unique, because answers are keyed by id', () => {
  expect(new Set(CUT_FEATURES.map((f) => f.id)).size).toBe(CUT_FEATURES.length)
})

test('scores only what was answered, so a partial run still reports honestly', () => {
  const answers = { 'create-invoice': true, 'dark-mode': true }
  expect(scoreCut(answers)).toEqual({ answered: 2, correct: 1 })
})

test('an empty run scores zero rather than dividing by nothing', () => {
  expect(scoreCut({})).toEqual({ answered: 0, correct: 0 })
})

test('ignores ids that are not features, so stale saved answers cannot inflate a score', () => {
  expect(scoreCut({ 'not-a-feature': true })).toEqual({ answered: 0, correct: 0 })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm test -- scoring`
Expected: FAIL — `Failed to resolve import "./scoring"`.

- [ ] **Step 3: Write the implementation**

Create `web/src/features/planning/scoring.ts`:

```ts
/**
 * The judgment logic for stage 02, kept out of the components.
 *
 * These are the decisions the stage teaches — what survives the cut, what order
 * slices go in, which horizon an item belongs to. Keeping them as pure functions
 * means they can be tested without a component harness, which this project does
 * not have.
 */

export type CutFeature = {
  id: string
  label: string
  core: boolean
  why: string
}

/** Source: docs/02-planning.md:39-48. "Does the definition of done fail without this?" */
export const CUT_FEATURES: CutFeature[] = [
  {
    id: 'create-invoice',
    label: 'Create an invoice',
    core: true,
    why: 'The definition of done says a freelancer can issue an invoice. Without this there is no product, only a database.',
  },
  {
    id: 'mark-paid',
    label: 'Mark it paid',
    core: true,
    why: 'Without it every invoice stays open forever and the overdue list — the actual value — is noise within a week.',
  },
  {
    id: 'overdue-list',
    label: 'See overdue invoices',
    core: true,
    why: 'This is the outcome the whole thing exists for. Cut it and you have built a worse spreadsheet.',
  },
  {
    id: 'email-reminders',
    label: 'Email reminders',
    core: false,
    why: 'The user can send the email. Automating it adds a sending domain, deliverability, bounce handling and an unsubscribe path — a lot of surface for a step that currently takes thirty seconds.',
  },
  {
    id: 'pdf-export',
    label: 'PDF export',
    core: false,
    why: 'Version two. It feels essential because invoices are paper-shaped, but nothing in the definition of done requires a file.',
  },
  {
    id: 'multi-currency',
    label: 'Multi-currency',
    core: false,
    why: 'Until someone asks. Currency touches every stored amount, every total and every rounding decision, so adding it later is genuinely expensive — which is an argument for knowing you need it, not for guessing.',
  },
  {
    id: 'team-accounts',
    label: 'Team accounts',
    core: false,
    why: 'The audience is solo freelancers. Building for a team you do not have means designing permissions around imaginary people.',
  },
  {
    id: 'dark-mode',
    label: 'Dark mode',
    core: false,
    why: 'The clearest no on the list, and the one most likely to get built anyway because it is enjoyable to build.',
  },
]

const BY_ID = new Map(CUT_FEATURES.map((f) => [f.id, f]))

/** `answers[id] === true` means the reader judged it core. Unknown ids are ignored. */
export function scoreCut(answers: Record<string, boolean>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, guess] of Object.entries(answers)) {
    const feature = BY_ID.get(id)
    if (!feature) continue
    answered += 1
    if (feature.core === guess) correct += 1
  }
  return { answered, correct }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm test -- scoring`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/planning/scoring.ts web/src/features/planning/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(planning): add cut-to-the-core scoring

Judgment logic lives outside the components so it can be tested without a
component harness, which this project does not have.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Scoring — the slice sequencing rules

**Files:**
- Modify: `web/src/features/planning/scoring.ts`
- Modify: `web/src/features/planning/scoring.test.ts`

**Interfaces:**
- Consumes: nothing from Task 3 beyond the file.
- Produces: `SLICES: Slice[]` where `Slice = { id: string; label: string; size: 'S' | 'M' | 'L'; endToEnd: boolean; risky: boolean; why: string }`, and `scoreOrder(order: string[]): OrderVerdict` where `OrderVerdict = { endToEndFirst: boolean; riskEarly: boolean; notes: string[] }`. Task 8 renders these.

Content source: `docs/02-planning.md:70-84` (the ordering and the riskiest-slice-early rule).

**Read this before writing the data — an earlier draft of this plan got it wrong.** The doc's own example order (`:71-77`) ends with *Auth and multi-user*, so auth is **not** the risky slice. What the doc actually calls risky is a **third-party integration** (`:81-82`: "If a third-party integration might not work, find out in week one, not week eight"), and its worked spike is Stripe (`:105`). Auth appears in the doc's Risks block (`:134-135`) as an architecture *decision* deferred to stage 03 before slice 4 — a decision to make early, not a slice to build first.

So the exercise uses **six** slices: the doc's five plus a card-payments slice, which is the one carrying third-party risk. Marking auth risky would contradict the doc's own ordering and make the correct answer unreachable.

**The rule that matters:** the two checks are independent. A reader who opens with the payments slice satisfies `riskEarly` but fails `endToEndFirst` — right instinct, wrong place. The verdict must say so rather than marking the attempt simply wrong or simply right.

- [ ] **Step 1: Write the failing test**

Append to `web/src/features/planning/scoring.test.ts`:

```ts
import { SLICES, scoreOrder } from './scoring'

const IDEAL = [
  'create-view',
  'mark-paid',
  'payments',
  'overdue',
  'clients',
  'auth',
]

test('there are six slices: the doc’s five plus the third-party one carrying the risk', () => {
  expect(SLICES).toHaveLength(6)
})

test('exactly one slice is the end-to-end starter and exactly one is the risky one', () => {
  expect(SLICES.filter((s) => s.endToEnd)).toHaveLength(1)
  expect(SLICES.filter((s) => s.risky)).toHaveLength(1)
})

test('the risky slice is the third-party integration, not auth, because that is what the doc names', () => {
  expect(SLICES.find((s) => s.risky)?.id).toBe('payments')
})

test('an order that opens end to end and probes the integration early satisfies both rules', () => {
  const verdict = scoreOrder(IDEAL)
  expect(verdict.endToEndFirst).toBe(true)
  expect(verdict.riskEarly).toBe(true)
})

test('payments first is right for the wrong reason: risk is early but nothing works end to end', () => {
  const verdict = scoreOrder([
    'payments',
    'create-view',
    'mark-paid',
    'overdue',
    'clients',
    'auth',
  ])
  expect(verdict.riskEarly).toBe(true)
  expect(verdict.endToEndFirst).toBe(false)
  expect(verdict.notes.join(' ')).toMatch(/end to end/i)
})

test('the integration left until last fails the risk rule even behind a correct opener', () => {
  const verdict = scoreOrder([
    'create-view',
    'mark-paid',
    'overdue',
    'clients',
    'auth',
    'payments',
  ])
  expect(verdict.endToEndFirst).toBe(true)
  expect(verdict.riskEarly).toBe(false)
  expect(verdict.notes.join(' ')).toMatch(/week eight|late/i)
})

test('early means within the first half: position 3 of 6 passes, position 4 does not', () => {
  const inside = ['create-view', 'mark-paid', 'payments', 'overdue', 'clients', 'auth']
  const outside = ['create-view', 'mark-paid', 'overdue', 'payments', 'clients', 'auth']
  expect(scoreOrder(inside).riskEarly).toBe(true)
  expect(scoreOrder(outside).riskEarly).toBe(false)
})

test('an incomplete order scores what it can rather than throwing', () => {
  const verdict = scoreOrder(['create-view'])
  expect(verdict.endToEndFirst).toBe(true)
  expect(verdict.riskEarly).toBe(false)
})

test('an empty order fails both rules and says why', () => {
  const verdict = scoreOrder([])
  expect(verdict.endToEndFirst).toBe(false)
  expect(verdict.riskEarly).toBe(false)
  expect(verdict.notes.length).toBeGreaterThan(0)
})
```

**Threshold definition, fixed here so the tests and the implementation cannot disagree:** risk counts as early when its index is strictly less than `ceil(SLICES.length / 2)`. For six slices that is index < 3 — positions 1, 2 and 3 pass; position 4 and later do not. The seventh test above pins exactly that boundary.

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm test -- scoring`
Expected: FAIL — `SLICES` and `scoreOrder` are not exported from `./scoring`.

- [ ] **Step 3: Write the implementation**

Append to `web/src/features/planning/scoring.ts`:

```ts
export type Slice = {
  id: string
  label: string
  size: 'S' | 'M' | 'L'
  endToEnd: boolean
  risky: boolean
  why: string
}

/** Source: docs/02-planning.md:70-84. */
export const SLICES: Slice[] = [
  {
    id: 'create-view',
    label: 'Create and view one invoice',
    size: 'M',
    endToEnd: true,
    risky: false,
    why: 'Touches schema, server and UI, so something works end to end on day one. Every later slice is a change to a running thing rather than a step toward a first one.',
  },
  {
    id: 'mark-paid',
    label: 'Mark it paid',
    size: 'S',
    endToEnd: false,
    risky: false,
    why: 'Closes the core loop. Small, because the hard part — the invoice existing — is already done.',
  },
  {
    id: 'overdue',
    label: 'List invoices with overdue highlight',
    size: 'S',
    endToEnd: false,
    risky: false,
    why: 'The actual value appears here. Worth reaching early, because it is the first slice a user would notice missing.',
  },
  {
    id: 'clients',
    label: 'Clients as first-class records',
    size: 'M',
    endToEnd: false,
    risky: false,
    why: 'The model deepens. Deferring it means invoices carry a client name as text for a while, which is survivable and teaches you what a client record actually needs.',
  },
  {
    id: 'payments',
    label: 'Accept card payments (third-party integration)',
    size: 'M',
    endToEnd: false,
    risky: true,
    why: 'The risky one, and the only slice here that can fail for reasons outside your control. If the payout model the provider supports does not match what you need, you want that news in week one — not week eight, with four slices built on the assumption. Early is not the same as first, though: putting it first costs you the end-to-end slice that makes everything after it demonstrable.',
  },
  {
    id: 'auth',
    label: 'Auth and multi-user',
    size: 'M',
    endToEnd: false,
    risky: false,
    why: 'Last in the doc’s own order, and not the risky slice — but note it appears in the plan’s Risks list, because the auth choice constrains the data model. That is a decision to make early in stage 03, not a slice to build early here. Deciding early and building late is a perfectly good answer.',
  },
]

export type OrderVerdict = {
  endToEndFirst: boolean
  riskEarly: boolean
  notes: string[]
}

/** Early means the first half of the plan, rounded down: index < ceil(n / 2). */
const RISK_EARLY_BEFORE = Math.ceil(SLICES.length / 2)

/**
 * Two independent rules, deliberately not collapsed into one score.
 *
 * A reader who opens with the risky slice satisfies the second and fails the
 * first — the right instinct applied in the wrong place. Collapsing them into
 * "3/6 correct" would hide exactly the mistake worth naming.
 */
export function scoreOrder(order: string[]): OrderVerdict {
  const notes: string[] = []
  const starter = SLICES.find((s) => s.endToEnd)
  const risky = SLICES.find((s) => s.risky)

  const endToEndFirst = order.length > 0 && order[0] === starter?.id
  if (!endToEndFirst) {
    notes.push(
      order.length === 0
        ? 'Nothing ordered yet. The first slice should be the one that makes something work end to end.'
        : `Your first slice does not work end to end. Start with “${starter?.label}” — until one slice touches schema, server and UI, nothing is demonstrable and nothing has taught you anything.`,
    )
  }

  const riskIndex = risky ? order.indexOf(risky.id) : -1
  const riskEarly = riskIndex !== -1 && riskIndex < RISK_EARLY_BEFORE

  if (!riskEarly) {
    notes.push(
      riskIndex === -1
        ? `“${risky?.label}” is unplaced. It is the slice most likely to invalidate the others, so it needs a position.`
        : `“${risky?.label}” carries the risk and you left it late. If the integration cannot do what you need, you want that in week one — not week eight, with everything before it built on the assumption.`,
    )
  }

  if (endToEndFirst && riskEarly && notes.length === 0) {
    notes.push(
      'Both rules satisfied: something demonstrable first, and the slice that could invalidate the plan scheduled while changing course is still cheap.',
    )
  }

  return { endToEndFirst, riskEarly, notes }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm test -- scoring`
Expected: PASS, all tests in the file.

- [ ] **Step 5: Teeth check**

Change `endToEndFirst` to `order.length > 0`. Run `pnpm test -- scoring`. Confirm the
"right for the wrong reason" test fails and the cut-table tests still pass. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/planning/scoring.ts web/src/features/planning/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(planning): add slice ordering verdicts

Two independent rules rather than one score, because opening with the risky
slice is the interesting mistake: right instinct, wrong place. A combined score
would hide it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Scoring — the horizon triage

**Files:**
- Modify: `web/src/features/planning/scoring.ts`
- Modify: `web/src/features/planning/scoring.test.ts`

**Interfaces:**
- Produces: `type Horizon = 'now' | 'next' | 'later'`, `HORIZON_ITEMS: HorizonItem[]` where `HorizonItem = { id: string; label: string; best: Horizon; alsoDefensible?: Horizon; why: string }`, and `judgeHorizon(id: string, choice: Horizon): { verdict: 'best' | 'defensible' | 'off'; why: string }`. Task 11 renders these.

Content source: the horizon section written in Task 1 Step 8.

**The rule that matters:** triage is judgment, not a quiz. Some items are defensible in more than one horizon, and the component must say "defensible" rather than "wrong" — otherwise it teaches false precision about a decision the doc explicitly frames as a current best guess.

- [ ] **Step 1: Write the failing test**

Append to `web/src/features/planning/scoring.test.ts`:

```ts
import { HORIZON_ITEMS, judgeHorizon } from './scoring'

test('every horizon item explains itself', () => {
  for (const i of HORIZON_ITEMS) {
    expect(i.why.trim().length, `${i.id} has no why`).toBeGreaterThan(0)
  }
})

test('all three horizons appear among the items, so the exercise exercises all three', () => {
  const used = new Set(HORIZON_ITEMS.map((i) => i.best))
  expect(used).toEqual(new Set(['now', 'next', 'later']))
})

test('the best horizon is recognised as best', () => {
  const item = HORIZON_ITEMS[0]
  expect(judgeHorizon(item.id, item.best).verdict).toBe('best')
})

test('a second defensible horizon is called defensible, not wrong, because this is judgment', () => {
  const item = HORIZON_ITEMS.find((i) => i.alsoDefensible)
  expect(item, 'at least one item must be defensible two ways').toBeDefined()
  const result = judgeHorizon(item!.id, item!.alsoDefensible!)
  expect(result.verdict).toBe('defensible')
})

test('a clearly wrong placement is called off, and says why', () => {
  const nowItem = HORIZON_ITEMS.find(
    (i) => i.best === 'now' && i.alsoDefensible !== 'later',
  )
  const result = judgeHorizon(nowItem!.id, 'later')
  expect(result.verdict).toBe('off')
  expect(result.why.trim().length).toBeGreaterThan(0)
})

test('an unknown id is off rather than a crash, since ids come from user state', () => {
  expect(judgeHorizon('nope', 'now').verdict).toBe('off')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm test -- scoring`
Expected: FAIL — `HORIZON_ITEMS` and `judgeHorizon` are not exported.

- [ ] **Step 3: Write the implementation**

Append to `web/src/features/planning/scoring.ts`:

```ts
export type Horizon = 'now' | 'next' | 'later'

export type HorizonItem = {
  id: string
  label: string
  best: Horizon
  /** A second placement a thoughtful reader could defend. Judgment, not a quiz. */
  alsoDefensible?: Horizon
  why: string
}

export const HORIZON_ITEMS: HorizonItem[] = [
  {
    id: 'overdue-highlight',
    label: 'Highlight which invoices are overdue',
    best: 'now',
    why: 'It is the definition of done. Anything the done statement names is Now by construction — that is what makes the statement useful.',
  },
  {
    id: 'recurring',
    label: 'Recurring invoices',
    best: 'next',
    why: 'Waiting on evidence: a user billing the same client three months running. That is a trigger you can actually observe, which is what makes it Next rather than Later.',
  },
  {
    id: 'pdf-export',
    label: 'PDF export',
    best: 'next',
    alsoDefensible: 'later',
    why: 'Next if you expect the request quickly — the trigger is "someone asks twice". Later is defensible if nothing about your audience suggests they need a file at all; the honest answer depends on what discovery told you.',
  },
  {
    id: 'accountant-handoff',
    label: 'A year-end export your accountant can use',
    best: 'later',
    alsoDefensible: 'next',
    why: 'Later, because it points at the product this becomes rather than at v1. Defensible as Next if your audience is close enough to a tax deadline that the first January decides whether they keep using it.',
  },
  {
    id: 'become-accounting-tool',
    label: 'Full expense tracking and bookkeeping',
    best: 'later',
    why: 'This is the one to be careful with. Stage 01 wrote “not an accounting tool” under what this is NOT — so putting it anywhere but Later contradicts a decision made when you were thinking clearly. Later is where you record that you know the pull exists.',
  },
  {
    id: 'dark-mode',
    label: 'Dark mode',
    best: 'later',
    why: 'Nothing triggers it and nothing depends on it, which is the definition of Later. It gets built anyway, usually on a Friday.',
  },
]

const HORIZON_BY_ID = new Map(HORIZON_ITEMS.map((i) => [i.id, i]))

const HORIZON_LABEL: Record<Horizon, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
}

export function judgeHorizon(
  id: string,
  choice: Horizon,
): { verdict: 'best' | 'defensible' | 'off'; why: string } {
  const item = HORIZON_BY_ID.get(id)
  if (!item) {
    return { verdict: 'off', why: 'That item is no longer on the board.' }
  }
  if (choice === item.best) return { verdict: 'best', why: item.why }
  if (choice === item.alsoDefensible) {
    return { verdict: 'defensible', why: item.why }
  }
  return {
    verdict: 'off',
    why: `${HORIZON_LABEL[item.best]} fits better here. ${item.why}`,
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm test -- scoring`
Expected: PASS, all tests in the file.

- [ ] **Step 5: Teeth check**

Make `judgeHorizon` return `'best'` whenever `choice === item.alsoDefensible`. Run the
tests. Confirm only the "called defensible, not wrong" test fails. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/planning/scoring.ts web/src/features/planning/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(planning): add horizon triage judgments

Some items are defensible in two horizons and the verdict says so. Marking a
thoughtful second choice "wrong" would teach false precision about a decision the
stage frames as a current best guess.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Glossary terms and outward references

**Files:**
- Modify: `web/src/lib/terms.ts`
- Modify: `web/src/lib/references.ts`

**Interfaces:**
- Produces: term ids `mvp`, `product-roadmap`, `product-vision`, `appetite`, `vertical-slice`, `spike`, `feasibility-risk`, consumed by Tasks 8–11 via `<Term id="…">`; a `'02-planning'` key in `REFERENCES` rendered by Task 12.

Existing invariants in `web/src/lib/terms.test.ts` and `references.test.ts` already cover
shape, the 3–5 cap, https URLs and uniqueness — no new test file is needed. Add one test
pinning the terms this stage promises.

- [ ] **Step 1: Write the failing test**

Append to `web/src/lib/terms.test.ts`:

```ts
test('stage 02 vocabulary is defined, since the stage introduces words the playbook never used', () => {
  for (const id of [
    'mvp',
    'product-roadmap',
    'product-vision',
    'appetite',
    'vertical-slice',
    'spike',
    'feasibility-risk',
  ]) {
    expect(TERMS[id], `${id} is missing`).toBeDefined()
  }
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm test -- terms`
Expected: FAIL — `expected undefined not to be undefined` for `mvp`, the first missing id.

- [ ] **Step 3: Add the terms**

Add to `TERMS` in `web/src/lib/terms.ts`. Write each for a first encounter — plain
language, no forward references, and a `soWhat` a dictionary would omit:

```ts
  mvp: {
    short: 'The smallest version that delivers the outcome you defined as done.',
    full: 'Minimum viable product: the least you can build that still achieves the result you wrote down, so that real usage can tell you what to build next. It is defined by the outcome, not by a feature count.',
    soWhat:
      'The phrase is usually misused to mean "v1 with the hard parts removed", which produces something nobody can use and teaches you nothing. If your MVP cannot deliver the outcome, it is not minimum — it is unfinished.',
  },
  'product-roadmap': {
    short: 'What you plan to build, in order, without dates.',
    full: 'An ordered statement of intent — usually now, next and later — saying what is being built and what is waiting. The good ones name what has to be true before an item moves up, rather than naming a month.',
    soWhat:
      'The moment a roadmap carries dates it becomes a promise, and replanning turns political. Horizons give you the sequence without the commitment.',
  },
  'product-vision': {
    short: 'Where the product is going, written as a state of the world.',
    full: 'A short description of what the product becomes if it works — not a feature list, and not a slogan. One paragraph is the right length.',
    soWhat:
      'Without one, an MVP reads as a list of things you cut. With one, it reads as a first step, and every "not now" decision has something to be judged against.',
  },
  appetite: {
    short: 'How much time something is worth, decided before the design.',
    full: 'A fixed budget of time you are willing to spend, which the solution is then shaped to fit. An estimate starts with a design and ends with a number; an appetite starts with a number and ends with a design.',
    soWhat:
      'It reverses who is in charge. An estimate lets the design dictate the schedule; an appetite lets the schedule dictate the design — which, solo, is almost always the trade you want.',
  },
  'vertical-slice': {
    short: 'A piece of work that touches every layer and produces something usable.',
    full: 'Work sequenced so each step goes through storage, logic and interface at once, rather than building each layer across the whole product before starting the next.',
    soWhat:
      'Layer-first work means nothing functions until everything does, and you learn nothing until the end. A vertical slice is demonstrable the day it lands, which is also what makes it possible to change your mind cheaply.',
  },
  spike: {
    short: 'A timeboxed investigation whose output is a decision, not code.',
    full: 'A short, deliberately bounded piece of exploration answering one specific question — can this integration do what we need, is this approach fast enough — with a hard stop and a written answer.',
    soWhat:
      'The discipline is throwing the code away. If you keep it, you have not run a spike; you have merged untested, unreviewed work through the side door.',
  },
  'feasibility-risk': {
    short: 'The risk that the thing cannot be built as imagined.',
    full: 'One of the standard product risks, alongside whether people want it and whether it makes business sense. It asks whether the technology, data, budget and time actually permit the solution.',
    soWhat:
      'Discovery tests whether anyone wants it; this tests whether you can make it. They fail differently and at different costs, so finding feasibility problems late is the more expensive of the two.',
  },
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm test -- terms`
Expected: PASS.

- [ ] **Step 5: Verify every reference URL in a real browser**

For each of the four URLs below, use the Playwright MCP: `browser_navigate`, then
`browser_evaluate` returning `document.title` plus a content probe, and confirm the article
body renders rather than navigation chrome. `WebFetch` is not sufficient — it returns nav
for the Atlassian page.

```
https://www.atlassian.com/agile/product-management/product-planning
https://www.nngroup.com/articles/user-story-mapping/
https://basecamp.com/shapeup/2.2-chapter-08
https://www.svpg.com/dual-track-agile/
```

Record the resolved title of each. If one 404s or redirects off-host, replace it and note
the substitution in the commit body.

- [ ] **Step 6: Add the references**

Add to `REFERENCES` in `web/src/lib/references.ts`, keyed `'02-planning'`:

```ts
  '02-planning': [
    {
      title: 'The complete guide to product planning',
      source: 'Atlassian',
      url: 'https://www.atlassian.com/agile/product-management/product-planning',
      adds: 'The seven-step industry version of the phrase — ideate, research, vision, specification, roadmap, prototype, launch. Read it to see how much wider "product planning" is elsewhere than it is here, and which of this playbook’s stages own the rest of it.',
    },
    {
      title: 'Mapping User Stories in Agile',
      source: 'Nielsen Norman Group',
      url: 'https://www.nngroup.com/articles/user-story-mapping/',
      adds: 'How slicing actually gets done when the work is bigger than one person can hold. Story mapping lays the whole product out and then cuts release lines through it, hunting the smallest release someone would find genuinely useful — the team-shaped version of this stage’s vertical slices.',
    },
    {
      title: 'Shape Up — The Betting Table',
      source: 'Ryan Singer · Basecamp',
      url: 'https://basecamp.com/shapeup/2.2-chapter-08',
      adds: 'The sharpest available argument for appetite over estimate, and for calling the decision a bet rather than a plan. Go here when "estimate for sequencing" feels like it is still smuggling a promise in.',
    },
    {
      title: 'Dual-Track Agile',
      source: 'Marty Cagan · Silicon Valley Product Group',
      url: 'https://www.svpg.com/dual-track-agile/',
      adds: 'Why there is no planning phase between deciding and building — discovery and delivery run in parallel, continuously. The clearest statement of why the number on this document is a filing code rather than a position in a queue.',
    },
  ],
```

- [ ] **Step 7: Run the full suite**

Run: `cd web && pnpm test`
Expected: PASS, including the 3–5 cap and url-uniqueness invariants.

- [ ] **Step 8: Commit**

```bash
git add web/src/lib/terms.ts web/src/lib/terms.test.ts web/src/lib/references.ts
git commit -m "$(cat <<'EOF'
feat(planning): add stage 02 vocabulary and references

Seven terms the playbook previously never defined, and four outward links each
verified in a real browser — WebFetch returns navigation chrome for the Atlassian
guide while Playwright renders the article.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Figure 1 — where this stage sits

**Files:**
- Create: `web/src/features/planning/PlanningScope.tsx`

**Interfaces:**
- Produces: `<PlanningScope />`, a static SVG-free diagram rendered inside `<Figure n={1}>` by Task 12.

Content source: the framing table written in Task 1 Step 6.

This figure carries the round's new argument, so it is built first. It draws the seven-step
industry band as a horizontal strip with this stage's three middle steps filled, and labels
each outer step with the playbook stage that owns it.

- [ ] **Step 1: Build the component**

Create `web/src/features/planning/PlanningScope.tsx`. Requirements:

- A single row on `sm` and up; stacks to a column below `sm` with no horizontal overflow at 320px
- Seven cells: Ideate, Market research, **Vision & goals**, **Specification**, **Roadmap**, Prototype, Launch
- The three middle cells use `bg-brand`/`text-brand-fg` or `border-brand` — `brand` means *attention / you are here*, which is exactly this usage. Do **not** use `go`/`danger`/`warn`; those carry meaning
- Every cell carries a second signal beyond colour: the owned cells are labelled `This stage`, the others carry their stage number (`01`, `13`, `17–18`)
- Static, no state, no interaction — it is a figure, not a control
- Uses `t-label` for the stage-number captions and `t-data` for nothing here

- [ ] **Step 2: Verify it renders at both extremes**

Run `pnpm dev`, then via Playwright MCP resize to 320px and 2560px on
`/stages/02-planning` once Task 12 mounts it. Until then, verify in isolation by temporarily
rendering it on the stage 01 page and removing that before commit.

Expected: no horizontal scrollbar at 320px; the seven cells remain legible.

- [ ] **Step 3: Commit**

```bash
git add web/src/features/planning/PlanningScope.tsx
git commit -m "$(cat <<'EOF'
feat(planning): add the scope figure

Draws the seven-step industry band with this stage's three steps filled and the
rest labelled with the playbook stage that owns them. It is the figure carrying
the round's argument, so it is built first.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Steps 1–2 — the done statement and the cut table

**Files:**
- Create: `web/src/features/planning/DoneStatement.tsx`
- Create: `web/src/features/planning/CutTable.tsx`
- Create: `web/src/features/planning/CutFunnel.tsx` (Figure 2)

**Interfaces:**
- Consumes: `CUT_FEATURES`, `scoreCut` from `./scoring` (Task 3).
- Produces: `<DoneStatement />`, `<CutTable />`, `<CutFunnel />` for Task 12.

Content source: `docs/02-planning.md:21-30` (define done) and `:32-55` (cut to the core).

**Pattern:** both exercises are guess-then-reveal. Copy the mechanics from
`web/src/features/discovery/QuestionLab.tsx` — the answer must lock before the verdict
shows, and the running score is `correct/answered`, not `correct/total`.

- [ ] **Step 1: Build `DoneStatement`**

Three candidate done statements; the reader picks the checkable one before any verdict
appears. Requirements:

- State shape `useState<number | null>(null)`; once set, the choice locks (do not allow re-picking, matching `QuestionLab`'s `i in prev ? prev : …` guard)
- Each option is a `<button type="button">` with `min-h-11`; the group carries `role="radiogroup"` and each button `role="radio"` + `aria-checked`
- The verdict region carries `aria-live="polite"`
- Candidates: one naming a feature list ("the invoice app is finished"), one naming a feeling ("users are happy with it"), one naming a checkable state — the doc's own example at `docs/02-planning.md:26-27`. Explain, for each, what makes it hold or fail as a scope boundary

- [ ] **Step 2: Build `CutTable`**

Requirements:

- Renders `CUT_FEATURES`; each row offers **Core** / **Cut** before revealing
- Uses `scoreCut(answers)` for the running `{correct}/{answered} right` display with `aria-live="polite"`
- Reveal shows the verdict with both an icon and a word (`Check`/`X` from `lucide-react`), never colour alone
- A Reset button appears once any answer exists, matching `QuestionLab:78-86`
- Closes with the doc's rule at `:53-55` — the default answer to any feature is no — as a `<Callout kind="info">`, not as a bare paragraph

- [ ] **Step 3: Build `CutFunnel` (Figure 2)**

Static diagram: everything imagined → the done-statement filter → what survives (Now) and
what falls to the "not now" list. Same colour discipline as Task 7: `brand` for emphasis
only, second signals throughout.

- [ ] **Step 4: Verify**

Run: `cd web && pnpm lint && pnpm typecheck`
Expected: clean, zero warnings.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/planning/DoneStatement.tsx web/src/features/planning/CutTable.tsx web/src/features/planning/CutFunnel.tsx
git commit -m "$(cat <<'EOF'
feat(planning): add the done-statement and cut-table exercises

Both lock the reader's answer before revealing, since a verdict nobody committed
to teaches nothing.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Step 3 — the slice sequencer

**Files:**
- Create: `web/src/features/planning/SliceSequencer.tsx`
- Create: `web/src/features/planning/SliceAnatomy.tsx` (Figure 4)
- Create: `web/src/features/planning/RiskOrder.tsx` (Figure 5)

**Interfaces:**
- Consumes: `SLICES`, `scoreOrder`, `type OrderVerdict` from `./scoring` (Task 4).
- Produces: `<SliceSequencer />`, `<SliceAnatomy />`, `<RiskOrder />` for Task 12.

Content source: `docs/02-planning.md:57-84`.

**Pattern:** click-to-order, then reveal. Explicitly **not** drag-and-drop — see the spec's
non-goals.

- [ ] **Step 1: Build `SliceSequencer`**

Requirements:

- State: `useState<string[]>([])` holding chosen ids in order, plus a `locked` boolean
- Clicking an unchosen slice appends it and shows its position badge (`①`-style or a plain `1.` in `t-data`); clicking a chosen slice removes it and renumbers
- **Lock in order** button is disabled until all six are placed; on click sets `locked`
- After locking, render `scoreOrder(order)`: each rule as its own line with a `Check`/`X` icon **and** the rule name, then the `notes`
- Each slice's `why` is revealed after locking, in the reader's chosen order, so they read their own sequence back with commentary
- A **Try again** button clears both state values
- The whole verdict region carries `aria-live="polite"`
- Buttons are `min-h-11`; the list is a `<ul>` of `<li>` with real `<button>` children — not clickable `<div>`s

- [ ] **Step 2: Build `SliceAnatomy` (Figure 4)**

One slice drawn as three stacked bands — storage, logic, interface — with the slice cutting
through all three, beside a layer-first alternative that fills one band at a time. This is
the diagram the `Contrast` at `docs/02-planning.md:59-77` describes in words.

- [ ] **Step 3: Build `RiskOrder` (Figure 5)**

Slices plotted by position with the risky one marked, showing cost-of-discovery rising the
later it sits. Rendered only inside the sequencer's post-lock reveal.

- [ ] **Step 4: Verify keyboard operation**

Run `pnpm dev`. With Playwright MCP or by hand: Tab to the first slice, activate with Enter
and with Space, confirm both work; confirm focus is visible on every control; confirm the
verdict is announced (region has `aria-live`).

- [ ] **Step 5: Verify**

Run: `cd web && pnpm lint && pnpm typecheck`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/planning/SliceSequencer.tsx web/src/features/planning/SliceAnatomy.tsx web/src/features/planning/RiskOrder.tsx
git commit -m "$(cat <<'EOF'
feat(planning): add the slice sequencer

Click-to-order rather than drag: keyboard-native, touch-safe, and no drag math.
The verdict reports the two rules separately so "risky slice first" reads as the
right instinct in the wrong place rather than as a wrong answer.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Step 4 — sizing and the spike card

**Files:**
- Create: `web/src/features/planning/SizeScorer.tsx`
- Create: `web/src/features/planning/DecompositionLadder.tsx` (Figure 6)
- Create: `web/src/features/planning/SpikeCard.tsx` (Figure 7 lives inside it)

**Interfaces:**
- Consumes: `SLICES` from `./scoring` for the sizes.
- Produces: `<SizeScorer />`, `<DecompositionLadder />`, `<SpikeCard />` for Task 12.

Content source: `docs/02-planning.md:86-111` including the spike reframe from Task 1 Step 9.

- [ ] **Step 1: Build `SizeScorer`**

Copy the structure of `web/src/features/discovery/SeverityScorer.tsx` exactly — `role="radiogroup"`, `role="radio"`, `aria-checked`, the `aria-live` verdict panel, the dashed
empty state. Three levels: Small / Medium / Large, each with its test and its consequence.
Large's verdict is the doc's point: **Large means "not yet decomposed"**, so its panel says
to break it down rather than to schedule it.

Use the `TONE_CLASS` idiom, but note Large is not a *failure* — use `warn`, not `danger`,
and do not use `brand` for any of the three, since these carry meaning.

- [ ] **Step 2: Build `DecompositionLadder` (Figure 6)**

A Large task splitting into smaller ones until nothing Large remains, with the caption
stating the claim: a task you cannot decompose is one you do not understand well enough to
start.

- [ ] **Step 3: Build `SpikeCard`**

The copy-artifact pattern (`AIWorkflow` prompts are the canonical example). A filled spike
template — question, timebox, output — with a **Copy** button using
`navigator.clipboard.writeText`, wrapped in try/catch exactly as
`Worksheet.tsx:121-130` does, because clipboard access throws in insecure contexts. Show a
transient "Copied" state for 2000ms.

The card must state that the code is discarded and the written decision is the output —
this is the 02 → 03 handoff, and it should link to `/stages/03-architecture`.

- [ ] **Step 4: Verify**

Run: `cd web && pnpm lint && pnpm typecheck`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/planning/SizeScorer.tsx web/src/features/planning/DecompositionLadder.tsx web/src/features/planning/SpikeCard.tsx
git commit -m "$(cat <<'EOF'
feat(planning): add the size scorer and spike card

Large is scored as warn rather than danger: it is not a failure, it is a signal
the work is not yet understood. The spike card names the written decision as
what stage 03 consumes.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Steps 5–6 — the worksheet, carry-forward and horizon

**Files:**
- Create: `web/src/features/planning/PlanWorksheet.tsx`
- Create: `web/src/features/planning/CarryForward.tsx`
- Create: `web/src/features/planning/PlanAnatomy.tsx` (Figure 8)
- Create: `web/src/features/planning/HorizonTriage.tsx`
- Create: `web/src/features/planning/HorizonBands.tsx` (Figure 9)

**Interfaces:**
- Consumes: `readDiscoverySheet`, `EMPTY_SHEET`, `type DiscoverySheet` from `@/lib/discovery-sheet` (Task 2); `HORIZON_ITEMS`, `judgeHorizon`, `type Horizon` from `./scoring` (Task 5); `useLocalStorage` from `@/lib/useLocalStorage`.
- Produces: `<PlanWorksheet />`, `<CarryForward onSeed />`, `<HorizonTriage />`, `<HorizonBands />` for Task 12.

Content source: `docs/02-planning.md:112-142` (write the plan) and the horizon section from
Task 1 Step 8.

- [ ] **Step 1: Build `PlanWorksheet`**

Copy `web/src/features/discovery/Worksheet.tsx` structurally — `useLocalStorage` under a
**new** key `'playbook:planning-worksheet'`, per-field textareas with `label` +
`aria-describedby` hint, a `filled/total` counter with `aria-live`, Copy-as-Markdown and
Clear with a `window.confirm` guard.

Fields, matching the doc's one-page plan at `:116-140`: `doneMeans`, `slices`, `notInV1`,
`risks`, `openQuestions`.

- [ ] **Step 2: Build `CarryForward`**

Renders above the worksheet fields. Requirements:

- Reads via `useSyncExternalStore`-backed `useLocalStorage<DiscoverySheet>(DISCOVERY_KEY, EMPTY_SHEET)` **or** a one-shot `readDiscoverySheet()` — never `useEffect` + `setState`
- When `success` or `notThis` is non-empty, show each as a quoted block with a **Use as “Done means”** / **Seed “Not in v1”** button
- Each seed button is disabled once the corresponding worksheet field is non-empty, so seeding can never overwrite typed text
- When both are empty, render a single quiet line pointing at `/stages/01-product-discovery` — this is a designed empty state, not a fallback, and most readers will see it
- Props: `{ onSeed: (field: 'doneMeans' | 'notInV1', text: string) => void; canSeed: (field: 'doneMeans' | 'notInV1') => boolean }`

- [ ] **Step 3: Build `PlanAnatomy` (Figure 8)**

The doc's one-page plan (`docs/02-planning.md:116-140`) rendered as an annotated artifact:
the five headings — Done means, Slices, Not in v1, Risks, Open questions — each with a
callout marking what that section is *for*. The annotation on "Not in v1" is the load-bearing
one, since the doc calls it the part that does actual work, and step 6 turns it into an
exercise. Static; caption states the claim that a plan longer than a page will not be read.

- [ ] **Step 4: Build `HorizonTriage`**

Requirements:

- Renders `HORIZON_ITEMS` plus any non-empty lines parsed from the worksheet's `notInV1` field (split on newlines, trim, drop empties), so the reader triages their own entries alongside the worked examples
- Each item offers Now / Next / Later as a `role="radiogroup"`; on choice, `judgeHorizon` renders one of three verdicts
- **`defensible` must read visibly differently from `best` and from `off`** — three states, three treatments, each with an icon and a word. Do not collapse defensible into either neighbour
- Reader-supplied items have no `judgeHorizon` entry; they show the horizon's own definition rather than a verdict, and must not count toward any score
- `aria-live="polite"` on the verdict region

- [ ] **Step 4: Build `HorizonBands` (Figure 9)**

Three bands — Now / Next / Later — with Now labelled as the MVP, Next carrying its
evidence-triggers, Later carrying the product goal. Caption states the claim: horizons carry
sequence without commitment, which is what keeps a roadmap from becoming a promise.

- [ ] **Step 5: Verify the seed guard by hand**

Run `pnpm dev`. On `/stages/02-planning#write`: with stage 01's worksheet filled, confirm
the seed buttons appear; type into "Done means" and confirm its seed button disables; clear
stage 01's storage (`localStorage.removeItem('playbook:discovery-worksheet')`) and reload,
and confirm the empty state renders without error.

- [ ] **Step 6: Verify**

Run: `cd web && pnpm lint && pnpm typecheck && pnpm test`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/planning/PlanWorksheet.tsx web/src/features/planning/CarryForward.tsx web/src/features/planning/HorizonTriage.tsx web/src/features/planning/HorizonBands.tsx
git commit -m "$(cat <<'EOF'
feat(planning): add the plan worksheet, carry-forward and horizon triage

Two carry-forwards make the chain real: stage 01's answers seed the plan, and the
plan's own "not in v1" entries become the items the reader triages — so the doc's
claim that that list does the real work is something performed rather than read.

Seeding is explicit and per-field, and disables once a field has text, so it can
never overwrite what the reader typed.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Assemble and register the stage

**Files:**
- Create: `web/src/features/planning/Planning.tsx`
- Modify: `web/src/features/stage-content.ts`
- Modify: `web/src/lib/stages.ts:38`
- Modify: `web/e2e/audit.spec.ts:9-17`

**Interfaces:**
- Consumes: every component from Tasks 7–11.
- Produces: a live `/stages/02-planning` route.

- [ ] **Step 1: Build `Planning.tsx`**

Model it on `web/src/features/discovery/ProductDiscovery.tsx`. A `STEPS: Step[]` of six,
each `content` a `<div className="space-y-16">` of `<Section>` blocks, closing with
`<References slug="02-planning" />` the way stage 01 does.

```
id: 'done'      label: 'Done'      hint: 'Define done before defining work'
id: 'cut'       label: 'Cut'       hint: 'The default answer to a feature is no'
id: 'sequence'  label: 'Sequence'  hint: 'Vertical slices, riskiest early'
id: 'size'      label: 'Size'      hint: 'S/M/L, and timeboxing the unknowns'
id: 'write'     label: 'Write'     hint: 'The one-page plan'
id: 'horizon'   label: 'Horizon'   hint: 'Now, next, later — and replanning'
```

Figure numbers, passed explicitly and running across the whole stage: 1 `PlanningScope`
(done), 2 `CutFunnel` (cut), 3 the layer-first `Contrast` (sequence), 4 `SliceAnatomy`
(sequence), 5 `RiskOrder` (sequence, post-lock), 6 `DecompositionLadder` (size), 7 the spike
loop inside `SpikeCard` (size), 8 the annotated plan (write), 9 `HorizonBands` (horizon).

Wrap first appearances of the Task 6 terms with `<Term id="…">`, remembering the explicit
`{' '}` around each. Close the horizon step with `<Callout kind="trap">` blocks ported from
`docs/02-planning.md:188-211`, and the collapsed "If you're not solo" block from `:174-184`.

- [ ] **Step 2: Register and flip ready**

`web/src/features/stage-content.ts`:

```ts
import { Planning } from './planning/Planning'

export const STAGE_CONTENT: Record<string, ComponentType> = {
  '01-product-discovery': ProductDiscovery,
  '02-planning': Planning,
}
```

`web/src/lib/stages.ts:38`: `ready: false` → `ready: true`.

- [ ] **Step 3: Run the suite**

Run: `cd web && pnpm test`
Expected: PASS — in particular `every ready stage is registered in STAGE_CONTENT`
(`stages.test.ts:49-56`), which is the existing guard against flipping `ready` without
registering.

Teeth check: revert the `stage-content.ts` registration, run `pnpm test -- stages`, confirm
`02-planning is ready but unregistered` fails, then restore.

- [ ] **Step 4: Add the audit routes**

`web/e2e/audit.spec.ts`, extend `PAGES`:

```ts
  '/stages/02-planning#done',
  '/stages/02-planning#cut',
  '/stages/02-planning#sequence',
  '/stages/02-planning#size',
  '/stages/02-planning#write',
  '/stages/02-planning#horizon',
```

- [ ] **Step 5: Build and run the audit**

Run: `cd web && pnpm build && pnpm test:e2e`
Expected: PASS — no overflow at any of the five widths, no sub-44px target below `lg`, WCAG
AA in both themes, zero console errors.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/planning/Planning.tsx web/src/features/stage-content.ts web/src/lib/stages.ts web/e2e/audit.spec.ts
git commit -m "$(cat <<'EOF'
feat(planning): assemble stage 02 and take it live

Six steps, nine figures. Adds the six step hashes to the audit suite's
hand-maintained PAGES list — that list drifting from the ready stages is tracked
as debt rather than fixed here.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Verification passes and the record

**Files:**
- Modify: `docs/task.md`
- Modify: `docs/tracker.md`
- Modify: `web/PATTERNS.md` (only if a genuinely new pattern emerged)

- [ ] **Step 1: Run the full gate**

```bash
cd web && pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```

Expected: every command exits 0. Paste the raw output into the task report.

- [ ] **Step 2: Live contrast and responsive pass**

With `pnpm build && pnpm start` on :3100 and the Playwright MCP: walk all six steps in both
themes at 320, 768, 1024, 1440 and 2560px. Confirm the audit's automated findings by eye on
at least the horizon step, which has the most new colour usage.

Watch specifically for `brand` used to mean "good" — that is a bug in this design system and
has been one before.

- [ ] **Step 3: Humanizer pass on the stage's prose**

Run `humanizer:humanizer` over the prose in `Planning.tsx` and the component copy. Skip
tables, code, and the terminal-style spike card.

- [ ] **Step 4: Update `docs/task.md`**

Tick W-3's per-stage checklist for stage 02. Resolve the "Open product decision for stage 02"
note at `:158-160` — it is answered: read-only carry-forward, implemented in Task 11.

- [ ] **Step 5: Update `docs/tracker.md`**

Add the shipped-slice entry with evidence: commit range, test count, what the reviews caught.
Include a `Deferred:` list — TD-2/TD-3, stage 01's team-section asymmetry, deploy.

Add decision entries: the product-planning reframe; rejecting a separate Roadmap stage at
both candidate placements; read-only carry-forward over a shared store.

Add debt entries: the stage 01 / stage 02 team-section asymmetry; the hand-maintained
`PAGES` list in `web/e2e/audit.spec.ts`.

- [ ] **Step 6: Commit**

```bash
git add docs/task.md docs/tracker.md web/PATTERNS.md
git commit -m "$(cat <<'EOF'
docs(tracker): record stage 02 with evidence

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification (after all tasks)

1. `cd web && pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e` — all green
2. `/stages/02-planning` renders six steps; each step hash deep-links and the back button walks between them
3. Figure numbers run 1–9 with no repeats and no gaps, in reading order
4. With stage 01's worksheet filled, stage 02's carry-forward offers both seeds; with it empty, the quiet pointer renders and nothing throws
5. Seeding a field that already has text is impossible — the button is disabled
6. Every `<Term>` opens on click, closes on Escape and on outside click, and works on touch
7. All four reference URLs open in a real browser
8. `docs/02-planning.md` still has exactly seven `##` sections
9. A final whole-branch review before merge, per `CLAUDE.md` — findings carry severity, an ID and provenance

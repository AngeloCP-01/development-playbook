# Stage 03 — Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build stage 03 (Architecture) as the third interactive stage, and close TD-13 by making the team disclosure a uniform convention.

**Architecture:** Content first — `docs/03-architecture.md` gains its missing `### AI in architecture` section and is committed before any component, so the app is ported from an already-correct doc. All judgment logic lives in a pure `web/src/features/architecture/scoring.ts` carrying the tests; components stay presentational. The persisted domain sheet gets its own module in `web/src/lib/` because its shape is a contract between stages 02 and 03, not a component detail.

**Tech Stack:** Next.js 16 (App Router, static), React 19, TypeScript, Tailwind 4, vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-07-28-stage-03-architecture-design.md`

## Global Constraints

- All app commands run from `web/`. Typecheck via `pnpm typecheck` (runs `next typegen` first) — a bare `tsc --noEmit` passes only on a stale `.next`.
- Slug is `03-architecture`. Title is `Architecture` and does not change; `stage-metadata.test.ts` guards it against the doc's H1.
- `docs/03-architecture.md` keeps its seven sections. New material goes **inside** "The work" as a `###` subsection.
- No version numbers in stage docs; versions live in `reference/stack.md`.
- `Stepper` takes `Step[]` of `{ id, label, hint, content }`. This stage ships **six** steps: `reverse`, `model`, `constrain`, `shape`, `decide`, `ai`.
- `Figure` takes `{ n, caption }`; numbers run 1–9 across the whole stage and are passed explicitly. Straight double quotes break the caption attribute — use `&ldquo;`/`&rdquo;`.
- `Term` sits inside `<p>`: any registered term visual must use `<span>`, never `<div>`, or hydration breaks. Put explicit `{' '}` around a `<Term>` or surrounding spaces get trimmed.
- `terms.ts` is the single glossary source. After adding terms run `pnpm gen:glossary`. **Never hand-edit `reference/glossary.md`.**
- `REFERENCES` entries per stage: 3–5, enforced by `web/src/lib/references.test.ts`. Every URL must be opened in a real browser — some publishers 403 command-line requests while serving people fine.
- Never `useEffect` + `setState` to read localStorage: `react-hooks/set-state-in-effect` is an error under React 19. Use `useLocalStorage` (`web/src/lib/useLocalStorage.ts`), which returns `{ value, setValue, reset }`.
- Cross-step reads go through storage, not props. Stepper panels are siblings, not a parent chain (`PlanWorksheet.tsx:18-21`).
- Touch targets ≥44px below `lg` (`min-h-11`); may tighten to `lg:min-h-9` on the desktop rail.
- Anything that swaps content in place carries `aria-live="polite"`.
- `brand` means *attention / you are here*. `go` / `danger` / `warn` carry meaning. Using `brand` for "this is good" is a bug that shipped once.
- Every colour-coded distinction carries a second signal (a dot, a label, a border style). Colour is never the only cue.
- Commit trailer on every commit: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Conventional Commits, lowercase after the colon. Scopes here: `architecture`, `docs`, `web`, `a11y`, `discovery`, `tracker`.

**Note on teeth checks.** One mutation is not evidence of a test set's teeth. Two teeth checks in the stage 02 plan were vacuous — one mutated a constant's value while the tests referenced its symbol, so both sides moved together. Prefer plausible near-misses (inverted comparisons, off-by-one boundaries, swapped operands) over deleting logic outright, which only proves the code executes. If a mutation fails nothing, that is a finding about the tests, not a formality.

**Note on the shared test file.** Tasks 3, 4, 5 and 6 all append to `web/src/features/architecture/scoring.test.ts`. Each shows its own `import … from './scoring'` line for readability, but **merge them into the single existing import** rather than stacking four import statements.

**Note on prose provenance.** Component tasks cite their copy by `docs/03-architecture.md` line range rather than restating it. The doc is canonical; duplicating its prose here would create a third copy that drifts.

**One deliberate deviation from the spec, flagged rather than made silently.** The spec specifies five candidates for `SplitTrigger` (the doc's four triggers plus "it will scale better"). This plan builds **six**: a second non-reason, "the codebase is getting large and a service would be tidier", drawn from the doc's Traps section ("Microservices for a solo project. Every cost, no benefits."). A set where five of six answers are *yes* is guessable without reading; four-and-two is not. Record this in the tracker entry as a plan-authored refinement, not an implementer deviation.

---

### Task 1: Amend the doc with the AI-in-architecture section

**Files:**
- Modify: `docs/03-architecture.md` (new `###` subsection at the end of "The work")
- Test: `web/src/lib/stage-metadata.test.ts`

**Interfaces:**
- Produces: `### AI in architecture` in the doc, which Task 14's `AIArchitecturePlays` ports into the app. The doc is written first so the component has canonical prose to carry.

**TDD note:** the prose is a documentation deliverable and carries no unit test of its own. What *is* testable is D-35's rule — every stage built so far must carry the section — and nothing currently enforces it. That test is written first and fails on stage 03.

- [ ] **Step 1: Write the failing test**

Append to `web/src/lib/stage-metadata.test.ts`:

```ts
// D-35: every stage carries an "AI plays" section — a `### AI in <stage>`
// subsection in the doc and a dedicated stepper step in the app. Nothing
// enforced the doc half, and stage 03 was written before the decision existed.
//
// This list grows by one slug per stage built. It is deliberately explicit
// rather than derived from `ready`, so the section lands with the doc amendment
// at the start of a stage round rather than at the end when `ready` flips.
const AI_SECTION_STAGES = [
  '01-product-discovery',
  '02-planning',
  '03-architecture',
]

test.each(AI_SECTION_STAGES)('%s: the doc carries an AI plays section', (slug) => {
  const md = readFileSync(docPath(slug), 'utf8')
  expect(md, `${slug} has no "### AI in ..." subsection`).toMatch(
    /^### AI in .+$/m,
  )
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts`

Expected: FAIL on `03-architecture: the doc carries an AI plays section`, with the message `03-architecture has no "### AI in ..." subsection`. The other two pass — which is the point: the test is not vacuous, it distinguishes the two stages that have the section from the one that does not.

- [ ] **Step 3: Add the section to the doc**

In `docs/03-architecture.md`, insert after the "Defer aggressively" section (currently ending at line 184, immediately before the `---` that opens "Artifacts"):

```markdown
### AI in architecture

An agent asked to design a system will give you one: services, a queue, a cache, an event
bus, a diagram with twelve boxes. Every one of those is on the list you just read as
something not to build. The problem is not that the model is careless — it is that most
architecture writing on the internet is about systems at a scale you do not have, and that
is what it learned from. So point it at options and at checking, never at "design my
system."

Where it earns its place:

- **Generate the option set, then throw most of it away.** The expensive failure is
  choosing without knowing the alternatives existed. Over-generation is the one habit that
  helps here — ask for six ways to model this, then argue them down yourself.
- **Pressure-test a reversibility claim.** "This is cheap to undo" has a falsifiable
  answer. Ask what would have to change, how many call sites touch it, and whether any of
  it is stored data. A model is good at enumerating consequences and bad at deciding they
  are acceptable.
- **Read a schema for what is missing.** Uniqueness scope, delete behaviour, and
  nullability are mechanical to check and easy for a person to skim past. Paste the DDL and
  ask what a hostile script could write into it.
- **Draft the ADR's first pass** from your own notes, while the alternatives are still
  fresh. You supply the reasons; it supplies the structure.

Where it misleads, which is the half worth reading twice:

- **It reaches for distribution by default.** Microservices, queues and caching layers turn
  up unprompted, because that is what the training material is about. Each one is a real
  solution to a problem you do not yet have.
- **It invents scale.** Ask it to design for growth and it will design for growth you
  cannot describe, then justify the complexity with the number it made up.
- **Schema advice arrives confident and context-free.** It does not know your compliance
  boundary, your budget, or that this table is financial and legally has to survive a
  deletion.
- **An unsupervised ADR is worse than no ADR.** It reads plausibly while recording reasons
  you never had. That is exactly the reconstruction this stage warns about, except it
  arrives eight months early, in writing, and you will believe it.

The tools worth naming: `context7` for the provider's own documentation rather than the
model's memory of it, which matters most for anything touching auth; `claude-mem` for "did
I already decide this and write it down"; a git worktree or a sandbox for the throwaway
spike that answers a feasibility question without polluting the repo.

What none of this replaces: knowing which decisions are expensive, and being willing to
build less than the model offers. It has no stake in maintaining what it proposes.
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts`

Expected: PASS, all stage-title tests plus three AI-section tests.

- [ ] **Step 5: Verify the seven-section template still holds**

Run: `grep -n '^## ' docs/03-architecture.md`

Expected exactly: `Entry criteria`, `The work`, `Artifacts`, `Definition of done`, `Scaling to a team`, `Traps`. The new material is a `###` inside "The work" and must not have added an `##`.

- [ ] **Step 6: Run humanizer over the new prose**

Invoke `humanizer:humanizer` on the section added in Step 3. Apply the fixes that make it clearer; skip the ones that would flatten the doc's established voice (the stage docs use em dashes deliberately and consistently). Do not touch prose outside the new section.

- [ ] **Step 7: Commit**

```bash
git add docs/03-architecture.md web/src/lib/stage-metadata.test.ts
git commit -m "$(cat <<'EOF'
docs(architecture): add the AI in architecture section

D-35 made an "AI plays" section mandatory for all eighteen stages, but stage 03's
doc predates the decision and never got one. Adds it as the last subsection of
"The work", after the defer list, because the section's sharpest point is that
agents reach for exactly the complexity that list tells you not to build.

Also makes D-35 enforceable: stage-metadata.test.ts now asserts the section
exists for every stage built so far. The list is explicit rather than derived
from `ready`, so the check lands with the doc amendment at the start of a stage
round rather than when `ready` flips at the end.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The shared domain sheet

**Files:**
- Create: `web/src/lib/architecture-sheet.ts`
- Test: `web/src/lib/architecture-sheet.test.ts`

**Interfaces:**
- Produces: `DomainSheet` (type), `ARCHITECTURE_KEY` (string), `EMPTY_DOMAIN` (DomainSheet), `readDomainSheet(): DomainSheet`. Task 10's `DomainWorksheet` writes through `useLocalStorage(ARCHITECTURE_KEY, EMPTY_DOMAIN)`; nothing else writes to it.

Structurally mirrors `web/src/lib/discovery-sheet.ts`. It lives in `lib/` rather than the feature folder for the same reason that one does: the shape is a contract between stages, and a second copy would drift.

- [ ] **Step 1: Write the failing test**

Create `web/src/lib/architecture-sheet.test.ts`:

```ts
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import {
  ARCHITECTURE_KEY,
  EMPTY_DOMAIN,
  readDomainSheet,
  type DomainSheet,
} from './architecture-sheet'

const FILLED: DomainSheet = {
  entities: 'A User has many Clients. A Client has many Invoices.',
  derived: 'overdue — computed from due_date, never stored',
  deletion: 'Invoice: soft delete. Client: restrict while invoices exist.',
  uniqueness: 'invoice number unique per owner, not globally',
  decisions: 'auth strategy — needs an ADR',
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('the key is namespaced and distinct from the other two stages, so the sheets never collide', () => {
  expect(ARCHITECTURE_KEY).toBe('playbook:architecture-worksheet')
})

test('the empty sheet has every field, since the worksheet renders one input per key', () => {
  expect(Object.keys(EMPTY_DOMAIN).sort()).toEqual([
    'decisions',
    'deletion',
    'derived',
    'entities',
    'uniqueness',
  ])
})

test('reads a sheet the worksheet wrote', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, JSON.stringify(FILLED))
  expect(readDomainSheet()).toEqual(FILLED)
})

test('an absent key reads as empty rather than throwing, because this runs during render', () => {
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('malformed JSON reads as empty rather than throwing', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, '{not json')
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('a JSON primitive reads as empty, since a stored string is not a sheet', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, '"just a string"')
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('null reads as empty, because typeof null is object and would pass a naive guard', () => {
  window.localStorage.setItem(ARCHITECTURE_KEY, 'null')
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})

test('a partial sheet keeps the fields it has and empties the rest, so an older shape still loads', () => {
  window.localStorage.setItem(
    ARCHITECTURE_KEY,
    JSON.stringify({ entities: 'A User has many Clients.' }),
  )
  expect(readDomainSheet()).toEqual({
    ...EMPTY_DOMAIN,
    entities: 'A User has many Clients.',
  })
})

test('non-string values are dropped rather than rendered, since every field feeds a textarea', () => {
  window.localStorage.setItem(
    ARCHITECTURE_KEY,
    JSON.stringify({ entities: 42, derived: 'computed' }),
  )
  expect(readDomainSheet()).toEqual({ ...EMPTY_DOMAIN, derived: 'computed' })
})

test('a throwing localStorage reads as empty, because private-mode browsers throw on access', () => {
  vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
    throw new Error('SecurityError')
  })
  expect(readDomainSheet()).toEqual(EMPTY_DOMAIN)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/lib/architecture-sheet.test.ts`

Expected: FAIL — `Failed to resolve import "./architecture-sheet"`. The module does not exist yet.

- [ ] **Step 3: Write the module**

Create `web/src/lib/architecture-sheet.ts`:

```ts
/**
 * Stage 03's worksheet shape, owned in one place.
 *
 * The four content fields are the doc's four interrogation questions
 * (docs/03-architecture.md:58-76) in the order it asks them. The fifth
 * accumulates the decisions that need an ADR, which is where stage 02's risks
 * land when the reader carries them forward.
 *
 * Reading is deliberately total: every failure mode returns the empty sheet
 * rather than throwing, because this runs during render.
 */

export type DomainSheet = {
  /** Nouns and relationships, before tables. */
  entities: string
  /** Values computed rather than stored. */
  derived: string
  /** What happens on delete, per entity. */
  deletion: string
  /** What must be unique, and in what scope. */
  uniqueness: string
  /** Expensive decisions that need an ADR. */
  decisions: string
}

export const ARCHITECTURE_KEY = 'playbook:architecture-worksheet'

export const EMPTY_DOMAIN: DomainSheet = {
  entities: '',
  derived: '',
  deletion: '',
  uniqueness: '',
  decisions: '',
}

const FIELDS = Object.keys(EMPTY_DOMAIN) as (keyof DomainSheet)[]

export function readDomainSheet(): DomainSheet {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(ARCHITECTURE_KEY)
  } catch {
    return EMPTY_DOMAIN
  }
  if (raw === null) return EMPTY_DOMAIN

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return EMPTY_DOMAIN
  }
  if (typeof parsed !== 'object' || parsed === null) return EMPTY_DOMAIN

  const source = parsed as Record<string, unknown>
  const sheet = { ...EMPTY_DOMAIN }
  for (const field of FIELDS) {
    const v = source[field]
    if (typeof v === 'string') sheet[field] = v
  }
  return sheet
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/lib/architecture-sheet.test.ts`

Expected: PASS, 10 tests.

- [ ] **Step 5: Teeth check**

Change `if (typeof v === 'string')` to `if (v !== undefined)`. Run the suite again.

Expected: the non-string test fails (`entities` comes back as `42`), and only that one. Revert.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/architecture-sheet.ts web/src/lib/architecture-sheet.test.ts
git commit -m "$(cat <<'EOF'
feat(architecture): add the shared domain sheet

Stage 03's persisted worksheet shape, structurally mirroring discovery-sheet.ts.
Five fields: the doc's four interrogation questions in the order it asks them,
plus the list of decisions that need an ADR — which is where stage 02's risks
land when carried forward.

Lives in lib/ rather than the feature folder because the shape is a contract
between stages, not a component detail. Reading is total: malformed JSON, a
stored primitive, null, a partial sheet and a throwing localStorage all return
the empty sheet, because this runs during render.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Scoring — the reversibility verdicts

**Files:**
- Create: `web/src/features/architecture/scoring.ts`
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Produces: `Decision` (type), `DECISIONS` (Decision[]), `scoreReversibility(answers: Record<string, boolean>): { answered: number; correct: number }`. Task 9's `ReversibilityTable` consumes both. `answers[id] === true` means the reader judged it **expensive** to undo.

Source: `docs/03-architecture.md:22-42`. Two of the six rows are deliberately arguable — a set of six obvious ones would score well and teach nothing.

- [ ] **Step 1: Write the failing test**

Create `web/src/features/architecture/scoring.test.ts`:

```ts
import { expect, test } from 'vitest'
import { DECISIONS, scoreReversibility } from './scoring'

test('the table carries six decisions, matching the exercise the stage describes', () => {
  expect(DECISIONS).toHaveLength(6)
})

test('the set is balanced three and three, so guessing one way scores half', () => {
  expect(DECISIONS.filter((d) => d.expensive)).toHaveLength(3)
  expect(DECISIONS.filter((d) => !d.expensive)).toHaveLength(3)
})

test('two rows are marked arguable, because a set of six gimmes teaches nothing', () => {
  expect(DECISIONS.filter((d) => d.arguable)).toHaveLength(2)
})

test('every decision explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const d of DECISIONS) {
    expect(d.why.trim().length, `${d.id} has no why`).toBeGreaterThan(0)
  }
})

test('every decision names its undo cost, which is the axis the exercise is actually about', () => {
  for (const d of DECISIONS) {
    expect(d.undo.trim().length, `${d.id} has no undo cost`).toBeGreaterThan(0)
  }
})

test('decision ids are unique, because answers are keyed by id', () => {
  expect(new Set(DECISIONS.map((d) => d.id)).size).toBe(DECISIONS.length)
})

test('scores only what was answered, so a partial run still reports honestly', () => {
  // Asymmetric on purpose: two matches and one miss. A symmetric fixture scores
  // the same whether the comparison is `===` or its negation, so it cannot tell
  // a correct implementation from an inverted one.
  const answers = {
    'auth-strategy': true, // expensive — correct
    'invoice-delete': true, // expensive — correct
    'folder-names': true, // cheap — wrong
  }
  expect(scoreReversibility(answers)).toEqual({ answered: 3, correct: 2 })
})

test('guessing everything expensive scores exactly the expensive ones, so pessimism does not inflate the score', () => {
  const answers = Object.fromEntries(DECISIONS.map((d) => [d.id, true]))
  expect(scoreReversibility(answers)).toEqual({ answered: 6, correct: 3 })
})

test('credits a correct cheap call, so a reader who rightly shrugs at folder names is counted', () => {
  // Every other fixture guesses `true`, which cannot distinguish `expensive === guess`
  // from a scorer that ignores the guess and counts expensive decisions alone.
  expect(scoreReversibility({ 'folder-names': false })).toEqual({
    answered: 1,
    correct: 1,
  })
})

test('unknown ids are ignored rather than counted, so stale answers cannot inflate a score', () => {
  expect(scoreReversibility({ 'not-a-decision': true })).toEqual({
    answered: 0,
    correct: 0,
  })
})

test('an empty run scores zero rather than dividing by nothing', () => {
  expect(scoreReversibility({})).toEqual({ answered: 0, correct: 0 })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: FAIL — `Failed to resolve import "./scoring"`.

- [ ] **Step 3: Write the implementation**

Create `web/src/features/architecture/scoring.ts`:

```ts
/**
 * The judgment logic for stage 03, kept out of the components.
 *
 * These are the decisions the stage teaches — what is expensive to undo, what
 * the domain model must answer, and when splitting a service out is justified.
 * Keeping them as pure functions means they can be tested without a component
 * harness, which this project does not have.
 */

export type Decision = {
  id: string
  label: string
  /** True when the decision is expensive to reverse. */
  expensive: boolean
  /** What undoing it actually costs. The axis the exercise is about. */
  undo: string
  /** Marks a row a thoughtful reader could get wrong for good reasons. */
  arguable?: boolean
  why: string
}

/** Source: docs/03-architecture.md:22-42. "How expensive is this to undo?" */
export const DECISIONS: Decision[] = [
  {
    id: 'component-library',
    label: 'Which component library the UI uses',
    expensive: false,
    undo: 'An afternoon, plus whatever you had customised.',
    why: 'Components are leaves. Nothing else in the system knows which one you picked, so replacing them touches only the files that render.',
  },
  {
    id: 'folder-names',
    label: 'What the folders are called',
    expensive: false,
    undo: 'A rename. The editor does it.',
    why: 'The clearest cheap decision on the list, and the one most likely to absorb an afternoon of deliberation anyway. That is the failure the stage names: agonising over folder structure while the data model gets ten minutes.',
  },
  {
    id: 'logging-library',
    label: 'Which logging library you call',
    expensive: false,
    undo: 'A find-and-replace, or an afternoon if you never wrapped it.',
    arguable: true,
    why: 'This one feels expensive because the calls are everywhere, and “everywhere” is a real signal for most decisions. It is the exception: log calls are write-only and nothing reads them back, so swapping the library behind a thin wrapper is mechanical. Compare it to the data model, where “everywhere” means every query depends on the shape.',
  },
  {
    id: 'auth-strategy',
    label: 'Where user identity lives',
    expensive: true,
    undo: 'A migration of every user record, plus a rewrite of every access check.',
    why: 'It touches the data model, every route and every query. This is the decision the stage tells you to make deliberately and write an ADR for, because retrofitting it means touching everything.',
  },
  {
    id: 'invoice-delete',
    label: 'Whether deleting an invoice is soft or hard',
    expensive: true,
    undo: 'You cannot undo a hard delete. The records are gone.',
    why: 'The only decision here whose reversal is not merely expensive but impossible. Choosing hard delete and changing your mind leaves nothing to migrate — which is why financial records want soft delete or an immutable ledger.',
  },
  {
    id: 'money-cents',
    label: 'Storing money as integer cents rather than a decimal',
    expensive: true,
    arguable: true,
    undo: 'A migration of every stored amount, every total, and every rounding decision that depended on the old type.',
    why: 'This reads like a formatting detail, which is exactly why it is on the list. It is stored data other things read, so it fits the stage’s own test for expensive. Getting it wrong surfaces as totals that are off by a cent, months later, in a way nobody can reproduce.',
  },
]

const BY_ID = new Map(DECISIONS.map((d) => [d.id, d]))

/** `answers[id] === true` means the reader judged it expensive. Unknown ids are ignored. */
export function scoreReversibility(answers: Record<string, boolean>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, guess] of Object.entries(answers)) {
    const decision = BY_ID.get(id)
    if (!decision) continue
    answered += 1
    if (decision.expensive === guess) correct += 1
  }
  return { answered, correct }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: PASS, 11 tests.

- [ ] **Step 5: Teeth check**

Change `if (decision.expensive === guess)` to `if (decision.expensive !== guess)`. Run the suite.

Expected: the three scoring fixtures fail (2/3 becomes 1/3, 3/6 becomes 3/6 — note that one does *not* move, which is why the asymmetric fixture and the `false`-guess fixture both exist). Confirm at least two distinct tests fail, not one. Revert.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(architecture): score the reversibility judgment

Six decisions from the doc's expensive/cheap lists, balanced three and three so
guessing one way scores half. Two are marked arguable: the logging library reads
expensive because the calls are everywhere, and integer cents reads cheap because
it looks like formatting. Both are the point — a set of six obvious rows would
score well and teach nothing.

Each row carries its undo cost separately from its reasoning, because the undo
cost is the axis the exercise is actually about.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Scoring — the domain interrogation

**Files:**
- Modify: `web/src/features/architecture/scoring.ts`
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Consumes: nothing from Task 3 beyond the file existing.
- Produces: `Interrogation` (type), `INTERROGATIONS` (Interrogation[]), `judgeInterrogation(id: string, choice: string): { correct: boolean; why: string }`. Task 10's `ModelInterrogation` consumes both.

Source: `docs/03-architecture.md:58-76`. These are the only four questions in the stage with defensible answers, which is why the scored treatment belongs here and not on the reader's own domain.

- [ ] **Step 1: Write the failing test**

Append to `web/src/features/architecture/scoring.test.ts` (merging the import):

```ts
import { INTERROGATIONS, judgeInterrogation } from './scoring'

test('four questions, matching the four the doc asks of a domain model', () => {
  expect(INTERROGATIONS).toHaveLength(4)
})

test('every question offers exactly two options, because a third would be padding', () => {
  for (const q of INTERROGATIONS) {
    expect(q.options, `${q.id} option count`).toHaveLength(2)
  }
})

test('every question’s answer is one of its own options, so the right answer is reachable', () => {
  for (const q of INTERROGATIONS) {
    expect(
      q.options.map((o) => o.id),
      `${q.id} answer not in options`,
    ).toContain(q.answer)
  }
})

test('option ids are unique within a question, since a choice is keyed by id', () => {
  for (const q of INTERROGATIONS) {
    expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length)
  }
})

test('question ids are unique across the set', () => {
  expect(new Set(INTERROGATIONS.map((q) => q.id)).size).toBe(
    INTERROGATIONS.length,
  )
})

test('overdue is computed rather than stored, which is the stage’s named trap', () => {
  const verdict = judgeInterrogation('overdue-status', 'computed')
  expect(verdict.correct).toBe(true)
  expect(verdict.why).toMatch(/drift|disagree/i)
})

test('storing overdue is judged wrong, and the reason names what breaks', () => {
  const verdict = judgeInterrogation('overdue-status', 'stored')
  expect(verdict.correct).toBe(false)
  expect(verdict.why.trim().length).toBeGreaterThan(0)
})

test('a wrong answer gets the same explanation as a right one, because the lesson is the reasoning', () => {
  // Not a formatting detail: an exercise that explains itself only when you are
  // right teaches the readers who least need it.
  for (const q of INTERROGATIONS) {
    const wrong = q.options.find((o) => o.id !== q.answer)
    expect(wrong, `${q.id} has no wrong option`).toBeDefined()
    const verdict = judgeInterrogation(q.id, wrong!.id)
    expect(verdict.why.trim().length, `${q.id} wrong answer why`).toBeGreaterThan(0)
  }
})

test('an unknown question id is judged incorrect rather than throwing, since this runs in render', () => {
  const verdict = judgeInterrogation('not-a-question', 'computed')
  expect(verdict.correct).toBe(false)
  expect(verdict.why.trim().length).toBeGreaterThan(0)
})

test('an unknown option on a real question is judged incorrect', () => {
  expect(judgeInterrogation('overdue-status', 'neither').correct).toBe(false)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: FAIL — `INTERROGATIONS is not exported` / `judgeInterrogation is not a function`. The Task 3 tests still pass.

- [ ] **Step 3: Write the implementation**

Append to `web/src/features/architecture/scoring.ts`:

```ts
export type InterrogationOption = {
  id: string
  label: string
}

export type Interrogation = {
  id: string
  /** The question, phrased as the doc phrases it. */
  question: string
  options: InterrogationOption[]
  /** The id of the defensible answer. */
  answer: string
  /** Shown whichever way the reader answered. The reasoning is the lesson. */
  why: string
}

/** Source: docs/03-architecture.md:58-76. */
export const INTERROGATIONS: Interrogation[] = [
  {
    id: 'overdue-status',
    question: 'Is “overdue” a status, or a computed value?',
    options: [
      { id: 'stored', label: 'A stored status, updated when it changes' },
      { id: 'computed', label: 'Computed from due_date and status' },
    ],
    answer: 'computed',
    why: 'Computed. If it is stored, something has to update it — a cron job, a trigger, a write on read — and the day that something misses a run, the column disagrees with the date it was derived from. Computed from due_date < now() AND status = ‘sent’, it is always correct and cannot drift. Storing derived state is one of the most common sources of data that disagrees with itself.',
  },
  {
    id: 'invoice-delete',
    question: 'What happens when an invoice is deleted?',
    options: [
      { id: 'hard', label: 'Remove the row' },
      { id: 'soft', label: 'Mark it deleted and keep the row' },
    ],
    answer: 'soft',
    why: 'Soft delete, or an immutable ledger. A hard delete loses history you may be legally required to keep; a soft delete keeps it at the cost of every query remembering to filter. For financial records that trade is worth making, because “where did that invoice go” is a much worse conversation than a slightly more complex query.',
  },
  {
    id: 'client-owners',
    question: 'Can a client belong to two users?',
    options: [
      { id: 'fk', label: 'No — a foreign key on the client' },
      { id: 'join', label: 'Yes, or plausibly later — a join table' },
    ],
    answer: 'join',
    why: 'If the answer is yes now, or plausibly yes later, the relationship is a join table rather than a foreign key. Retrofitting many-to-many onto a one-to-many is a migration plus every query that touched it. This is the one question here where the honest answer depends on your product — but the cost is asymmetric, and that asymmetry is the lesson.',
  },
  {
    id: 'number-uniqueness',
    question: 'Invoice numbers must be unique — in what scope?',
    options: [
      { id: 'global', label: 'Globally, across the whole table' },
      { id: 'per-owner', label: 'Per user' },
    ],
    answer: 'per-owner',
    why: 'Per user. Two freelancers both issuing invoice 001 is normal and correct; a global constraint makes the second one fail for no reason a user could understand. Getting uniqueness scope wrong surfaces months later as a confusing constraint violation, which is why it belongs in the schema as UNIQUE (owner_id, number) rather than in a validation function.',
  },
]

const INTERROGATION_BY_ID = new Map(INTERROGATIONS.map((q) => [q.id, q]))

export function judgeInterrogation(
  id: string,
  choice: string,
): { correct: boolean; why: string } {
  const question = INTERROGATION_BY_ID.get(id)
  if (!question) {
    return { correct: false, why: 'That question is no longer on the sheet.' }
  }
  return { correct: choice === question.answer, why: question.why }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: PASS, 21 tests.

- [ ] **Step 5: Teeth check**

Change `choice === question.answer` to `choice !== question.answer`. Run the suite.

Expected: `overdue is computed rather than stored` and `storing overdue is judged wrong` both fail, and `an unknown option on a real question is judged incorrect` also fails. Three distinct failures. Revert.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(architecture): score the domain interrogation

The doc's four questions — stored versus computed, delete behaviour,
cardinality, uniqueness scope — as a locked-then-revealed exercise. These are
the only four questions in the stage with defensible answers, which is why the
scored treatment lands on the invoice domain rather than on the reader's own.

The reasoning is returned whichever way the reader answered. An exercise that
explains itself only when you are right teaches the readers who least need it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Scoring — the split triggers

**Files:**
- Modify: `web/src/features/architecture/scoring.ts`
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Produces: `SplitCandidate` (type), `SPLIT_CANDIDATES` (SplitCandidate[]), `scoreSplit(answers: Record<string, boolean>): { answered: number; correct: number }`. Task 12's `SplitTrigger` consumes both. `answers[id] === true` means the reader judged it a real reason to split.

Source: `docs/03-architecture.md:116-123` for the four triggers, and `:233-235` (Traps) for the second non-reason. See the deviation note in Global Constraints: six candidates, not the spec's five.

- [ ] **Step 1: Write the failing test**

Append to `web/src/features/architecture/scoring.test.ts` (merging the import):

```ts
import { SPLIT_CANDIDATES, scoreSplit } from './scoring'

test('six candidates: the doc’s four triggers and two of its named non-reasons', () => {
  expect(SPLIT_CANDIDATES).toHaveLength(6)
})

test('four are real triggers and two are not, so the set is not guessable by answering yes', () => {
  expect(SPLIT_CANDIDATES.filter((c) => c.valid)).toHaveLength(4)
  expect(SPLIT_CANDIDATES.filter((c) => !c.valid)).toHaveLength(2)
})

test('every candidate explains itself', () => {
  for (const c of SPLIT_CANDIDATES) {
    expect(c.why.trim().length, `${c.id} has no why`).toBeGreaterThan(0)
  }
})

test('candidate ids are unique', () => {
  expect(new Set(SPLIT_CANDIDATES.map((c) => c.id)).size).toBe(
    SPLIT_CANDIDATES.length,
  )
})

test('scoring is asymmetric, so an inverted comparison cannot pass', () => {
  const answers = {
    'execution-limit': true, // valid — correct
    'different-runtime': true, // valid — correct
    'will-scale-better': true, // not valid — wrong
  }
  expect(scoreSplit(answers)).toEqual({ answered: 3, correct: 2 })
})

test('answering yes to everything scores exactly the four real triggers', () => {
  const answers = Object.fromEntries(SPLIT_CANDIDATES.map((c) => [c.id, true]))
  expect(scoreSplit(answers)).toEqual({ answered: 6, correct: 4 })
})

test('rejecting “it will scale better” is credited, which is the row the exercise exists for', () => {
  expect(scoreSplit({ 'will-scale-better': false })).toEqual({
    answered: 1,
    correct: 1,
  })
})

test('unknown ids are ignored rather than counted', () => {
  expect(scoreSplit({ 'not-a-candidate': true })).toEqual({
    answered: 0,
    correct: 0,
  })
})

test('an empty run scores zero', () => {
  expect(scoreSplit({})).toEqual({ answered: 0, correct: 0 })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: FAIL — `SPLIT_CANDIDATES is not exported`. Tasks 3 and 4 still pass.

- [ ] **Step 3: Write the implementation**

Append to `web/src/features/architecture/scoring.ts`:

```ts
export type SplitCandidate = {
  id: string
  label: string
  /** True when this is a concrete reason to split something out. */
  valid: boolean
  why: string
}

/**
 * Source: docs/03-architecture.md:116-123 for the four triggers, and :233-235
 * for the second non-reason.
 *
 * Six rather than the four-plus-one the spec proposed. A set where five of six
 * answers are yes can be scored without reading it; four and two cannot.
 */
export const SPLIT_CANDIDATES: SplitCandidate[] = [
  {
    id: 'execution-limit',
    label: 'A job routinely runs longer than the function execution limit',
    valid: true,
    why: 'A concrete limit you have hit, not one you expect to. This is what a queue and a worker are for, and the split is forced by the platform rather than chosen.',
  },
  {
    id: 'different-runtime',
    label: 'One piece genuinely needs a different runtime — Python for a model',
    valid: true,
    why: 'You cannot run two runtimes in one process, so the boundary already exists. Putting it behind HTTP acknowledges a split that reality made for you.',
  },
  {
    id: 'load-profile',
    label: 'One component’s load profile is wildly different and provably expensive',
    valid: true,
    why: 'Note both halves: wildly different *and* provably expensive. Measured, not predicted. Without the measurement this is the imagined-scale trap wearing a costume.',
  },
  {
    id: 'compliance-boundary',
    label: 'A real compliance boundary requires isolation',
    valid: true,
    why: 'An external requirement with someone else’s signature on it. The cost of distribution is not optional here, which makes it one of the few cases where paying it early is correct.',
  },
  {
    id: 'will-scale-better',
    label: 'It will scale better',
    valid: false,
    why: 'The row this exercise exists for. It is a prediction, and usually a wrong one. Distribution solves problems you do not have — independent team scaling, independent deploy cadence — while charging you network failure modes and distributed debugging today.',
  },
  {
    id: 'codebase-tidier',
    label: 'The codebase is getting large and a service would be tidier',
    valid: false,
    why: 'Tidiness inside one application is what module boundaries are for, and they cost nothing at runtime. Reaching for a network call to enforce a boundary you could enforce with an import rule is every cost of distribution bought for an organisational benefit you cannot collect solo.',
  },
]

const SPLIT_BY_ID = new Map(SPLIT_CANDIDATES.map((c) => [c.id, c]))

/** `answers[id] === true` means the reader judged it a real reason to split. */
export function scoreSplit(answers: Record<string, boolean>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, guess] of Object.entries(answers)) {
    const candidate = SPLIT_BY_ID.get(id)
    if (!candidate) continue
    answered += 1
    if (candidate.valid === guess) correct += 1
  }
  return { answered, correct }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: PASS, 30 tests.

- [ ] **Step 5: Teeth check**

Change `if (candidate.valid === guess)` to `if (candidate.valid !== guess)`. Run the suite.

Expected: three of the four scoring fixtures fail. Revert.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(architecture): score the split-a-service judgment

Six candidates: the doc's four concrete triggers plus two of its named
non-reasons. The spec proposed five (four triggers and "it will scale better"),
but a set where five of six answers are yes can be scored without reading it.
The second non-reason — "the codebase is getting large" — comes from the doc's
Traps section, so the refinement stays inside the source material.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Data — schema annotations and boundary edges

**Files:**
- Modify: `web/src/features/architecture/scoring.ts`
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Produces: `SchemaLine` (type), `SCHEMA_LINES` (SchemaLine[]), `BoundaryEdge` (type), `BOUNDARY_EDGES` (BoundaryEdge[]), `BOUNDARY_MODULES` (string[]). Task 11's `SchemaInspector` consumes the first pair; Task 12's `BoundaryMap` consumes the second.

Not scoring, but it is the same kind of data — content with invariants worth asserting — and it lives in the same module so the components stay presentational. Source: `docs/03-architecture.md:81-97` and `:130-142`.

- [ ] **Step 1: Write the failing test**

Append to `web/src/features/architecture/scoring.test.ts` (merging the import):

```ts
import {
  BOUNDARY_EDGES,
  BOUNDARY_MODULES,
  SCHEMA_LINES,
} from './scoring'

test('every schema line carries its SQL text, since the block is rendered from this data', () => {
  for (const l of SCHEMA_LINES) {
    expect(l.sql.length, `${l.id} has no sql`).toBeGreaterThan(0)
  }
})

test('annotated lines explain what the constraint buys, not what it says', () => {
  for (const l of SCHEMA_LINES.filter((x) => x.note)) {
    expect(l.note!.trim().length, `${l.id} note`).toBeGreaterThan(0)
  }
})

test('at least five lines are annotated, so the inspector has something to inspect', () => {
  expect(SCHEMA_LINES.filter((l) => l.note).length).toBeGreaterThanOrEqual(5)
})

test('the four constraints the doc calls out by name are all annotated', () => {
  // docs/03-architecture.md:95-97 names these four specifically. If a future
  // edit drops one, the inspector silently stops teaching the thing the prose
  // promises it teaches.
  for (const id of ['amount-cents', 'status-check', 'owner-fk', 'unique-number']) {
    const line = SCHEMA_LINES.find((l) => l.id === id)
    expect(line, `${id} missing from the schema block`).toBeDefined()
    expect(line!.note, `${id} is not annotated`).toBeTruthy()
  }
})

test('schema line ids are unique, because selection is keyed by id', () => {
  expect(new Set(SCHEMA_LINES.map((l) => l.id)).size).toBe(SCHEMA_LINES.length)
})

test('the boundary map has three modules, matching the doc’s example', () => {
  expect(BOUNDARY_MODULES).toEqual(['billing', 'clients', 'auth'])
})

test('every edge runs between declared modules, so the map cannot draw a dangling arrow', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(BOUNDARY_MODULES, `${e.id} from`).toContain(e.from)
    expect(BOUNDARY_MODULES, `${e.id} to`).toContain(e.to)
  }
})

test('exactly one edge is illegal, and it is the cross-table query', () => {
  const illegal = BOUNDARY_EDGES.filter((e) => !e.legal)
  expect(illegal).toHaveLength(1)
  expect(illegal[0].id).toBe('clients-queries-invoices')
})

test('legality is data, not styling, so a screen reader gets the same information as a sighted reader', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(typeof e.legal, `${e.id} legal`).toBe('boolean')
    expect(e.why.trim().length, `${e.id} why`).toBeGreaterThan(0)
  }
})

test('every edge names the call it represents, since that is what the reader is meant to copy', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(e.call.trim().length, `${e.id} call`).toBeGreaterThan(0)
  }
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: FAIL — `SCHEMA_LINES is not exported`.

- [ ] **Step 3: Write the implementation**

Append to `web/src/features/architecture/scoring.ts`:

```ts
export type SchemaLine = {
  id: string
  /** The line exactly as it appears in the DDL. */
  sql: string
  /** Indentation depth, so the component does not parse whitespace. */
  indent: 0 | 1
  /** What this line buys. Absent on structural lines with nothing to teach. */
  note?: string
}

/** Source: docs/03-architecture.md:81-97. */
export const SCHEMA_LINES: SchemaLine[] = [
  { id: 'open', sql: 'CREATE TABLE invoices (', indent: 0 },
  {
    id: 'pk',
    sql: 'id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
    note: 'A generated uuid rather than a sequence. Nothing about an invoice’s identity is guessable from it, and two databases can generate ids without coordinating.',
  },
  {
    id: 'owner-fk',
    sql: 'owner_id     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'ON DELETE RESTRICT is the load-bearing half. Deleting a user who has invoices fails loudly instead of quietly cascading financial history away. CASCADE here is one careless statement from destroying records you are legally required to keep.',
  },
  {
    id: 'client-fk',
    sql: 'client_id    uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'Same rule, same reason. Note that this is a foreign key, not a join table — which is the cardinality decision from the interrogation, written down where the database will hold you to it.',
  },
  {
    id: 'number',
    sql: 'number       text NOT NULL,',
    indent: 1,
    note: 'Text, not an integer. Invoice numbers acquire prefixes, years and dashes the moment a real person uses them, and none of that arithmetic is ever performed.',
  },
  {
    id: 'amount-cents',
    sql: 'amount_cents integer NOT NULL CHECK (amount_cents >= 0),',
    indent: 1,
    note: 'Money as integer cents. A float cannot represent 0.10 exactly, so totals drift by a cent in ways nobody can reproduce. The CHECK stops a negative amount at the door rather than in a validation function a script can bypass.',
  },
  { id: 'due-date', sql: 'due_date     date NOT NULL,', indent: 1 },
  {
    id: 'status-check',
    sql: "status       text NOT NULL CHECK (status IN ('draft','sent','paid')),",
    indent: 1,
    note: 'A fixed set of values, enforced where it cannot be bypassed. Note what is absent: “overdue”. It is computed from due_date and status, so it cannot drift out of agreement with the date it derives from.',
  },
  {
    id: 'created-at',
    sql: 'created_at   timestamptz NOT NULL DEFAULT now(),',
    indent: 1,
    note: 'timestamptz, not timestamp. The version without a time zone silently means “whatever the server thought local time was”, which stops being funny the first time you deploy to a different region.',
  },
  {
    id: 'unique-number',
    sql: 'UNIQUE (owner_id, number)',
    indent: 1,
    note: 'Uniqueness scoped per user, not globally. Two freelancers both issuing invoice 001 is normal; a global constraint would fail the second for no reason a user could understand.',
  },
  { id: 'close', sql: ');', indent: 0 },
]

export type BoundaryEdge = {
  id: string
  from: string
  to: string
  /** The call this edge represents, written the way the codebase would write it. */
  call: string
  legal: boolean
  why: string
}

/** Source: docs/03-architecture.md:130-142. */
export const BOUNDARY_MODULES = ['billing', 'clients', 'auth']

export const BOUNDARY_EDGES: BoundaryEdge[] = [
  {
    id: 'clients-calls-billing',
    from: 'clients',
    to: 'billing',
    call: 'billing.getInvoicesForClient(clientId)',
    legal: true,
    why: 'The rule, working. Clients needs invoice data and asks the module that owns it, through a function that module chose to export. Billing can change how invoices are stored tomorrow without clients noticing.',
  },
  {
    id: 'billing-calls-auth',
    from: 'billing',
    to: 'auth',
    call: 'auth.currentUser()',
    legal: true,
    why: 'Every module needs to know who is calling, and exactly one module owns that answer. A second place that decodes a session is a second place to get authorization wrong.',
  },
  {
    id: 'clients-queries-invoices',
    from: 'clients',
    to: 'billing',
    call: "db.select().from(invoices).where(eq(invoices.clientId, id))",
    legal: false,
    why: 'The one move that turns a monolith into a ball of mud. It works, it is shorter, and it silently makes billing’s table part of clients’ public interface — so the next change to the invoice schema breaks a module that never mentioned invoices. Keeping this rule is what makes extracting a service later a mechanical job rather than an archaeology project.',
  },
]
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: PASS, 40 tests.

- [ ] **Step 5: Teeth check**

Delete the `note` from the `unique-number` line. Run the suite.

Expected: `the four constraints the doc calls out by name are all annotated` fails with `unique-number is not annotated`, and `at least five lines are annotated` may or may not — check which. If only one test fails, that is correct and sufficient here; the named-constraints test is the one carrying the teeth. Revert.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "$(cat <<'EOF'
feat(architecture): add schema annotations and boundary edges

The DDL block as data rather than a string, so the inspector renders from it and
a test can assert the four constraints the prose names by hand are all still
annotated. Same for the boundary map: legality is a boolean on the edge, not a
border colour, so a screen reader gets what a sighted reader gets.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Glossary terms and outward references

**Files:**
- Modify: `web/src/lib/terms.ts`
- Modify: `web/src/lib/terms.test.ts`
- Modify: `web/src/lib/references.ts`
- Modify: `reference/glossary.md` (generated, not hand-edited)

**Interfaces:**
- Produces: term ids `domain-model`, `derived-state`, `soft-delete`, `join-table`, `monolith`, `authorization`, `database-constraint` for `<Term>` to reference; `REFERENCES['03-architecture']` for `<References>` to render.

- [ ] **Step 1: Write the failing test**

Append to `web/src/lib/terms.test.ts`:

```ts
test('stage 03 vocabulary is defined, since the stage introduces words the playbook never used', () => {
  for (const id of [
    'domain-model',
    'derived-state',
    'soft-delete',
    'join-table',
    'monolith',
    'authorization',
    'database-constraint',
  ]) {
    expect(getTerm(id), `${id} is missing`).toBeDefined()
  }
})

test('authorization is defined against authentication, because conflating them is the mistake the stage names', () => {
  expect(getTerm('authorization')?.full).toMatch(/authentication/i)
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd web && pnpm vitest run src/lib/terms.test.ts`

Expected: FAIL — `domain-model is missing`.

- [ ] **Step 3: Add the terms**

Add to `TERMS` in `web/src/lib/terms.ts`, keeping the existing style (`name`, `see`, `short`, `full`, `soWhat`):

```ts
  'domain-model': {
    name: 'Domain model',
    see: '03-architecture',
    short: 'The nouns your system holds and how they relate, before any table exists.',
    full: 'A description of the system in entities and relationships — a user has many clients, a client has many invoices — written in the language of the problem rather than the language of the database. Tables come after, as one way of storing it.',
    soWhat: 'It is the decision that outlives every framework choice, because migrating code is easy and migrating data is not. Getting it wrong is the most expensive kind of wrong available before you have users.',
  },
  'derived-state': {
    name: 'Derived state',
    see: '03-architecture',
    short: 'A value that could be calculated from others, but is stored anyway.',
    full: 'Anything you could work out on demand — whether an invoice is overdue, how many items are in a cart, a running total — that is written into a column instead. Storing it means something has to keep it up to date.',
    soWhat: 'Stored derived state drifts. The job that updates it misses a run, or a script writes around it, and now two fields in your database disagree about the same fact with no way to tell which is right.',
  },
  'soft-delete': {
    name: 'Soft delete',
    see: '03-architecture',
    short: 'Marking a row deleted instead of removing it.',
    full: 'A deleted_at timestamp or a boolean flag, set instead of issuing a DELETE. The row stays; every query that should not see it has to filter it out.',
    soWhat: 'It is the trade the stage asks you to make deliberately: a permanently more complex query set, in exchange for being able to answer “where did that invoice go”. For financial or audited records, the complexity is usually worth it, and the decision cannot be revisited after the rows are gone.',
  },
  'join-table': {
    name: 'Join table',
    see: '03-architecture',
    short: 'A table whose job is to connect two other tables.',
    full: 'When a client can belong to several users and a user to several clients, neither table can hold the relationship in a column. A third table holds pairs of ids instead — one row per connection.',
    soWhat: 'Starting with a foreign key and discovering later that you needed a join table is a migration plus a rewrite of every query that touched the relationship. The asymmetry is the reason to think about it now rather than when it bites.',
  },
  monolith: {
    name: 'Monolith',
    see: '03-architecture',
    short: 'One application, one deployment, one process.',
    full: 'A system where all the code runs together rather than being split across services that talk over a network. Internal structure can still be strict; the distinction is about deployment and process boundaries, not tidiness.',
    soWhat: 'For one developer it is the correct default rather than a compromise. The benefits of splitting — independent deploys, independent team scaling — are organisational, and you cannot collect them alone, but you pay every cost from day one.',
  },
  authorization: {
    name: 'Authorization',
    see: '03-architecture',
    short: 'Deciding what a known user is allowed to do.',
    full: 'The check that this particular record belongs to this particular caller. Distinct from authentication, which establishes who the caller is: authentication gets you a user id, authorization decides whether that user id may read invoice 42.',
    soWhat: 'Authentication is the part people buy or borrow and mostly get right. Authorization is the part written by hand in every route, and the part that leaks other people’s data when one route forgets it.',
  },
  'database-constraint': {
    name: 'Database constraint',
    see: '03-architecture',
    short: 'A rule the database enforces itself, regardless of what the code does.',
    full: 'NOT NULL, UNIQUE, CHECK, and foreign keys with their delete behaviour. Declared in the schema, so the database refuses to store a row that breaks them.',
    soWhat: 'Application code has bugs, gets bypassed by migration scripts and one-off fixes, and races with itself under concurrency. The database does not get bypassed, which makes it the only place a rule genuinely holds.',
  },
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd web && pnpm vitest run src/lib/terms.test.ts`

Expected: PASS.

- [ ] **Step 5: Regenerate the glossary**

Run: `cd web && pnpm gen:glossary`

Then run `cd web && pnpm vitest run src/lib/glossary.test.ts` to confirm the snapshot matches. Inspect `git diff reference/glossary.md` — it must contain only the seven new entries, in the right alphabetical or source order for that file. **Do not hand-edit the markdown.** If the diff looks wrong, fix `terms.ts` and regenerate.

- [ ] **Step 6: Verify every reference URL in a real browser**

Open each in Playwright MCP (not `WebFetch` — some publishers 403 command-line requests while serving people fine) and confirm it loads and is the article named:

- `https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions` — Michael Nygard, "Documenting Architecture Decisions". If this URL has moved, find the current canonical home before substituting; the ADR community links it from several mirrors.
- `https://martinfowler.com/bliki/MonolithFirst.html` — Martin Fowler, "MonolithFirst"
- `https://mcfunley.com/choose-boring-technology` — Dan McKinley, "Choose Boring Technology"
- `https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf` — Fowler, "Who Needs an Architect?"

If any URL does not resolve, replace the entry rather than shipping a broken link, and note the substitution in the commit body.

- [ ] **Step 7: Add the references**

Add to `REFERENCES` in `web/src/lib/references.ts`:

```ts
  '03-architecture': [
    {
      title: 'Documenting Architecture Decisions',
      source: 'Michael Nygard',
      url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
      adds: 'The origin of the artifact this stage tells you to write, from the person who named it. Go here for the status lifecycle — proposed, accepted, superseded — which is the part that makes a folder of ADRs a record of how thinking changed rather than a pile of decisions that may or may not still hold.',
    },
    {
      title: 'MonolithFirst',
      source: 'Martin Fowler',
      url: 'https://martinfowler.com/bliki/MonolithFirst.html',
      adds: 'Evidence where this stage asserts. Fowler reports what happened to teams who started with microservices rather than arguing from first principles, and names the reason it fails: you cannot draw good service boundaries before you understand the domain, and building the monolith is how you come to understand it.',
    },
    {
      title: 'Choose Boring Technology',
      source: 'Dan McKinley',
      url: 'https://mcfunley.com/choose-boring-technology',
      adds: 'The budget framing this stage implies but never states. You get roughly three innovation tokens; everything novel spends one, and the ones you spend on infrastructure are not available for the thing you are actually building. Useful for the decisions that feel too small to deliberate over.',
    },
    {
      title: 'Who Needs an Architect?',
      source: 'Martin Fowler · IEEE Software',
      url: 'https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf',
      adds: 'Where this stage’s opening claim comes from — architecture as the decisions that are hard to change — and, more usefully, its limits. Fowler’s argument is that the job is to make decisions reversible rather than to make them correctly, which reframes the whole reversibility sort.',
    },
  ],
```

- [ ] **Step 8: Run the full suite**

Run: `cd web && pnpm test && pnpm lint && pnpm typecheck`

Expected: all pass. `references.test.ts` enforces the 3–5 cap; four entries is inside it.

- [ ] **Step 9: Commit**

```bash
git add web/src/lib/terms.ts web/src/lib/terms.test.ts web/src/lib/references.ts reference/glossary.md
git commit -m "$(cat <<'EOF'
feat(architecture): add stage 03 vocabulary and references

Seven terms the stage introduces: domain-model, derived-state, soft-delete,
join-table, monolith, authorization, database-constraint. Glossary regenerated
from terms.ts rather than hand-edited (D-36).

authorization is written explicitly against authentication and carries a test
asserting so, because conflating the two is the mistake the stage names — the
part people get wrong is not proving who you are, it is proving the record
belongs to you.

Four references, each opened in a real browser: Nygard for the ADR lifecycle,
Fowler's MonolithFirst for evidence where this stage asserts, Choose Boring
Technology for the innovation-token budget, and Who Needs an Architect for
where the reversibility claim originates.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: The static figures

**Files:**
- Create: `web/src/features/architecture/ReversibilityAxis.tsx`
- Create: `web/src/features/architecture/DomainSketch.tsx`
- Create: `web/src/features/architecture/DriftDiagram.tsx`
- Create: `web/src/features/architecture/DeleteBehaviour.tsx`
- Create: `web/src/features/architecture/OneAppCosts.tsx`

**Interfaces:**
- Produces: `<ReversibilityAxis />` (Fig 1), `<DomainSketch />` (Fig 2), `<DriftDiagram />` (Fig 3), `<DeleteBehaviour />` (Fig 5), `<OneAppCosts />` (Fig 6). All static, no state, no props. Task 15 mounts each inside a numbered `<Figure>`.

Grouped into one task because they share a shape: no state, no interaction, and the same responsive risk. A reviewer would accept or reject them together.

- [ ] **Step 1: Build `ReversibilityAxis`**

Content source: `docs/03-architecture.md:26-42`. Requirements:

- A horizontal axis labelled `cheap to undo` at one end and `expensive to undo` at the other, with the doc's items placed along it.
- Cheap end: component library, folder naming, logging library, most UI decisions. Expensive end: the data model, auth strategy, one service or several, anything writing to a store others read.
- The expensive end is bracketed and labelled `spend your thinking here` using `brand` — this is *attention*, the correct use.
- Every item carries its position as text as well as by placement, so the axis is not the only signal.
- Stacks to two labelled columns below `sm` rather than compressing the axis. No horizontal overflow at 320px.
- Static. No state, no props.

- [ ] **Step 2: Build `DomainSketch`**

Content source: `docs/03-architecture.md:51-56`. Requirements:

- Draws the four sentences as nouns and relationships: `User —has many→ Client —has many→ Invoice —has many→ LineItem`, plus `Invoice has a status: draft | sent | paid`.
- Nouns are boxes; relationships are labelled edges. The label is the verb phrase from the doc, not an arrow alone.
- Deliberately small — this panel is the heaviest in the stage and the figure is orientation, not the lesson.
- Stacks vertically below `sm`. No horizontal overflow at 320px.
- Static, no state.

- [ ] **Step 3: Build `DriftDiagram`**

Content source: `docs/03-architecture.md:60-63`. Requirements:

- Two rows, one week apart. Row 1: `due_date: 3 Mar` / `is_overdue: false` / status agrees. Row 2: same `due_date`, `is_overdue` still `false`, `now()` past the date — the two now disagree.
- The disagreeing cell is marked with `danger` and a text label (`disagrees`), never colour alone.
- A third row shows the computed version with nothing to disagree with, marked `go` plus a text label.
- The caption (passed by Task 15) carries the claim; the figure shows the mechanism.
- Static, no state. Stacks below `sm`.

- [ ] **Step 4: Build `DeleteBehaviour`**

Content source: `docs/03-architecture.md:245-246`. Requirements:

- Side-by-side: `ON DELETE CASCADE` and `ON DELETE RESTRICT`, each showing the same statement (`DELETE FROM users WHERE id = …`) and what is left afterwards.
- CASCADE: the user row and every invoice gone, marked `danger` with the label `invoices deleted`. RESTRICT: the delete fails, marked `go` with the label `delete refused`.
- Use the `Contrast` primitive from `@/components/ui` if it fits; build bespoke only if `Contrast`'s two-column shape fights the content. Each side is labelled, so colour is never the only signal.
- Stacks below `sm`. No horizontal overflow at 320px — the SQL line is short enough to wrap, but check it.

- [ ] **Step 5: Build `OneAppCosts`**

Content source: `docs/03-architecture.md:104-114`. Requirements:

- Two columns: what one application gives you (one process locally, one deployment, no network boundary between your own code, refactoring is a rename) against what distribution costs (network failure modes, distributed debugging, deployment coordination, data consistency).
- A third band below, visually separated: the benefits distribution buys (independent team scaling, independent deploy cadence, per-service resource scaling) each labelled `needs a team` — which is the argument, not a decoration.
- Stacks to one column below `md`. No horizontal overflow at 320px.
- Static, no state.

- [ ] **Step 6: Verify all five render at both extremes**

These cannot be mounted on the stage 03 page until Task 15. Verify in isolation: temporarily render them at the bottom of `/stages/02-planning`'s last step, run `pnpm dev`, and via Playwright MCP resize to 320px and 2560px.

Expected: no horizontal scrollbar at 320px; every label legible at both widths; both themes checked with the theme toggle.

**Remove the temporary mount before committing.** Run `git diff web/src/features/planning/` and confirm it is empty.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/architecture/ReversibilityAxis.tsx \
        web/src/features/architecture/DomainSketch.tsx \
        web/src/features/architecture/DriftDiagram.tsx \
        web/src/features/architecture/DeleteBehaviour.tsx \
        web/src/features/architecture/OneAppCosts.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): add the five static figures

The axis, the domain sketch, the drift diagram, the cascade contrast and the
one-application cost table. All static and stateless — they are figures, not
controls.

Every colour-coded distinction carries a text label alongside it. The drift
diagram in particular has to work for a reader who cannot see that one cell is
red, since "these two disagree" is the entire content.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Step 1 — the reversibility table and the deferred list

**Files:**
- Create: `web/src/features/architecture/ReversibilityTable.tsx`
- Create: `web/src/features/architecture/DeferredList.tsx`

**Interfaces:**
- Consumes: `DECISIONS`, `scoreReversibility` from `./scoring` (Task 3).
- Produces: `<ReversibilityTable />`, `<DeferredList />`. Task 15 mounts both in the `reverse` step.

- [ ] **Step 1: Build `ReversibilityTable`**

Structural reference: `web/src/features/planning/CutTable.tsx`. Requirements:

- One row per entry in `DECISIONS`. Each row shows the label and two controls: `cheap to undo` and `expensive to undo`.
- Controls use `role="radio"` inside a `role="radiogroup"` per row, with `aria-checked`. Not `<div>` with an onclick.
- Committing a row reveals that row's `undo` cost and `why`. Nothing is revealed before the reader commits — that is the lesson.
- A row marked `arguable` shows a quiet label (`arguable`) **after** its verdict is revealed, never before. Showing it early tells the reader which rows to think about.
- A running score (`4/6`) sits above or below the table with `aria-live="polite"`, computed via `scoreReversibility`.
- Reader answers live in local `useState<Record<string, boolean>>`. Nothing persists — this is an exercise, not an artifact.
- Touch targets `min-h-11`, tightening to `lg:min-h-9` only on the desktop rail.
- Correct and incorrect use `go` and `danger` with a text label alongside, never colour alone.

- [ ] **Step 2: Build `DeferredList`**

Structural reference: `web/src/features/discovery/ValidationLadder.tsx`. Content source: `docs/03-architecture.md:172-184`. Requirements:

- Seven collapsed items: caching layer, a queue, multi-tenancy beyond a user_id column, event sourcing, a design system, feature-flag infrastructure, and the doc's closing claim as a summary row. (If seven reads long, six items plus the summary in prose is acceptable — say which you chose in the commit body.)
- Collapsed shows the item name and a one-line summary. Expanded shows three lines: the real problem it solves, why it is not yours yet, what it costs you today.
- The third line is the one the doc makes and most writing on the subject does not. Do not drop it to save space.
- The control sets `aria-expanded` and controls a panel by id. Collapsed by default.
- Keyboard operable; `min-h-11` targets.

- [ ] **Step 3: Verify both in isolation**

Same temporary-mount approach as Task 8. Check: committing a row reveals only that row; the score updates and is announced; nothing is revealed on load; 320px and 2560px; both themes; zero console errors.

Remove the temporary mount. `git diff web/src/features/planning/` must be empty.

- [ ] **Step 4: Commit**

```bash
git add web/src/features/architecture/ReversibilityTable.tsx \
        web/src/features/architecture/DeferredList.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): build the reverse step's two components

The reversibility table locks each row before revealing its verdict, and the
"arguable" marker only appears after the reader has committed — showing it early
would tell them which rows to think about, which is the whole exercise.

The deferred list gives each item three lines: the real problem it solves, why
it is not yours yet, and what it costs you today. The third is the doc's own
argument and the one most writing on the subject leaves out.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Step 2 — the interrogation, the worksheet, and the carry-forward

**Files:**
- Create: `web/src/features/architecture/ModelInterrogation.tsx`
- Create: `web/src/features/architecture/DomainWorksheet.tsx`
- Create: `web/src/features/architecture/ArchCarryForward.tsx`

**Interfaces:**
- Consumes: `INTERROGATIONS`, `judgeInterrogation` from `./scoring` (Task 4); `DomainSheet`, `ARCHITECTURE_KEY`, `EMPTY_DOMAIN` from `@/lib/architecture-sheet` (Task 2); `PLANNING_KEY`, `EMPTY_PLAN`, `PlanSheet` from `@/features/planning/PlanWorksheet`.
- Produces: `<ModelInterrogation />`, `<DomainWorksheet />`. `ArchCarryForward` is consumed only by `DomainWorksheet`, with the prop shape `{ onSeed: (field: SeedField, text: string) => void; canSeed: (field: SeedField) => boolean }` where `type SeedField = 'entities' | 'decisions'`.

This is the heaviest panel in the stage. Build it in the order below; the worksheet must work before the carry-forward is added, so a failure in the seeding cannot be mistaken for a failure in the sheet.

- [ ] **Step 1: Build `ModelInterrogation`**

Structural reference: `web/src/features/discovery/QuestionLab.tsx`. Requirements:

- One block per entry in `INTERROGATIONS`: the question, then its two options as `role="radio"` in a `role="radiogroup"`.
- The answer locks on selection. The verdict and the `why` appear only after locking, and the `why` appears whichever way the reader answered — that is asserted by a test in Task 4 and must not be undone in the component.
- A running score (`3/4`) with `aria-live="polite"`.
- Local `useState` only. Nothing persists.
- Correct/incorrect use `go`/`danger` plus a text label.

- [ ] **Step 2: Build `DomainWorksheet` without the carry-forward**

Structural reference: `web/src/features/planning/PlanWorksheet.tsx`. Requirements:

- Five `<textarea>` fields, one per `DomainSheet` key, in the order `entities`, `derived`, `deletion`, `uniqueness`, `decisions`.
- Labels and hints tie each field to the interrogation question it answers, so the exercise the reader just did maps onto the sheet they are filling.
- `useLocalStorage<DomainSheet>(ARCHITECTURE_KEY, EMPTY_DOMAIN)` for state. Never `useEffect` + `setState`.
- Copy-as-markdown and clear, matching `PlanWorksheet`'s buttons and its saved-state affordance.
- A filled-field counter with `aria-live="polite"`.

- [ ] **Step 3: Verify the worksheet persists before adding the seed**

Run `pnpm dev`, temporarily mount on stage 02's last step, type into two fields, reload the page, and confirm the text survives. Then check `localStorage` directly in the browser console: `JSON.parse(localStorage.getItem('playbook:architecture-worksheet'))` must return an object with all five keys.

This step exists because the theme script once read a raw string where the hook writes JSON, and nobody noticed until the theme silently stopped applying. Check the stored value, not the visible one.

- [ ] **Step 4: Build `ArchCarryForward`**

Structural reference: `web/src/features/planning/CarryForward.tsx` — read its header comment before writing, especially lines 12-18. Requirements:

- `const { value: plan } = useLocalStorage(PLANNING_KEY, EMPTY_PLAN)`. **Destructure `value` only.** Never call `setValue` or `reset`: stage 03 must never write to stage 02's key, and reading through the same hook stage 02 writes with is what avoids a hydration mismatch.
- Two seeds, offered only when the source field has text:
  - `plan.slices` → `entities`, labelled `Stage 02 — your slices`. Helper line: the nouns in your slices are your entities.
  - `plan.risks` → `decisions`, labelled `Stage 02 — risks you logged`. The label says *risks*, not *decisions*: the text usually will not be a decision yet, and pretending otherwise would be dishonest about what was carried.
- When neither source has text, render the same fallback shape `CarryForward` uses: a line pointing at `/stages/02-planning`.
- Each seed button disables once its target field holds text, driven by the parent's `canSeed`, so seeding cannot overwrite something the reader typed.
- `min-h-11` targets; the button label changes to `Already in “…”` with a check icon when disabled.

- [ ] **Step 5: Wire `ArchCarryForward` into `DomainWorksheet`**

Render it above the fields. `canSeed(field)` returns `!value[field].trim()`, computed from live worksheet state — the parent is the source of truth for whether a field is empty, not the carry-forward.

- [ ] **Step 6: Verify the carry-forward end to end**

In one browser session: fill stage 02's worksheet (at least `slices` and `risks`), navigate to stage 03, open the model step.

Expected: both seeds appear with the stage 02 text quoted. Clicking one fills the target field. The button then reads `Already in “…”` and is disabled. Type into the other target field manually and confirm its button disables too.

Then confirm nothing wrote back: in the console, compare `localStorage.getItem('playbook:planning-worksheet')` before and after. It must be byte-identical.

Finally, clear all storage and reload stage 03: the fallback line must render, pointing at stage 02, with no seeds and no error.

- [ ] **Step 7: Verify responsive and console**

320px and 2560px, both themes, zero console errors. The worksheet's textareas and the seed buttons are the specific risk below `sm` — the button label is long.

Remove the temporary mount. `git diff web/src/features/planning/` must be empty.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/architecture/ModelInterrogation.tsx \
        web/src/features/architecture/DomainWorksheet.tsx \
        web/src/features/architecture/ArchCarryForward.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): build the model step's exercise and worksheet

The four interrogation questions scored on the doc's invoice domain, then the
same four questions as free text for the reader's own. Taught then recorded:
the invoice answers are defensible and worth scoring, the reader's own are not.

The carry-forward seeds entities from stage 02's slices and decisions from its
risks. It reads stage 02's key through the same hook stage 02 writes with and
never calls setValue or reset, which is both what keeps the read one-way and
what avoids the hydration mismatch a one-shot read in the render body would
cause.

The risks seed is labelled "risks you logged" rather than "decisions". The text
usually will not be a decision yet, and the point is that it is sitting there
waiting to become one.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Step 3 — the schema inspector

**Files:**
- Create: `web/src/features/architecture/SchemaInspector.tsx`

**Interfaces:**
- Consumes: `SCHEMA_LINES` from `./scoring` (Task 6).
- Produces: `<SchemaInspector />`. Task 15 mounts it as Figure 4.

Structural reference: `web/src/features/discovery/OpportunityTree.tsx` for the click-node-plus-detail-panel shape.

**This is the component most likely to break the no-horizontal-overflow rule.** Its narrow-width behaviour is designed here rather than audited afterwards.

- [ ] **Step 1: Build the component**

Requirements:

- Renders `SCHEMA_LINES` in order as a monospace block. `indent: 1` lines are indented one level; do not parse leading whitespace out of the `sql` string, use the field.
- Lines with a `note` are buttons (`aria-pressed` or `role="radio"` in a radiogroup — pick one and be consistent). Lines without a note are inert text, visibly non-interactive.
- Selecting a line shows its note in a detail panel below the block, with `aria-live="polite"`. One selection at a time.
- Nothing is selected on load. The panel shows a prompt (`select a line`) rather than collapsing to zero height, so the layout does not jump.
- The annotated lines carry a second signal beyond colour that they are clickable — a marker in the gutter or an underline. A reader who cannot distinguish the hover colour must still be able to tell which lines do something.
- **The block sits inside its own `overflow-x: auto` container.** The longest line is `status       text NOT NULL CHECK (status IN ('draft','sent','paid')),` at 66 characters, which does not fit 320px at any readable monospace size. It scrolls inside its own box; the page body does not.
- The scroll container is keyboard-reachable (`tabIndex={0}` with an accessible name) so a keyboard user can scroll it without a mouse.
- `t-data` for the SQL. Touch targets: a full-width line at `min-h-11` below `lg` is acceptable and preferable to per-token targets.

- [ ] **Step 2: Verify the overflow behaviour specifically**

Temporarily mount, run `pnpm dev`, and via Playwright MCP resize to exactly 320px.

Expected: `document.documentElement.scrollWidth === document.documentElement.clientWidth` — the page does not scroll sideways. The SQL block itself scrolls. Confirm both by evaluating in the browser rather than by looking at a screenshot.

Also check 360px and 768px, since the failure could be a container that only misbehaves once it has room.

- [ ] **Step 3: Verify selection and both themes**

Select each annotated line in turn and confirm the panel updates and announces. Check `go`/`danger`/`brand` usage: this component should use `brand` for the selected line (attention, "you are here") and no semantic colour at all, because none of these lines is good or bad.

Zero console errors, both themes.

Remove the temporary mount.

- [ ] **Step 4: Commit**

```bash
git add web/src/features/architecture/SchemaInspector.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): build the schema inspector

The doc's CREATE TABLE block rendered from data, with each constraint explaining
what it buys rather than what it says. Selecting a line updates a detail panel;
nothing is selected on load and the panel keeps its height so the layout does
not jump.

The block scrolls inside its own container. The longest line is 66 characters,
which cannot fit 320px at a readable monospace size, so the alternative was
either a page that scrolls sideways or SQL nobody can read. The scroll container
is focusable so a keyboard user can reach it.

Uses brand for the selected line and no semantic colour, because none of these
lines is good or bad — they are all correct, which is the point.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Step 4 — the split exercise, the boundary map, and the team disclosure

**Files:**
- Create: `web/src/features/architecture/SplitTrigger.tsx`
- Create: `web/src/features/architecture/BoundaryMap.tsx`
- Create: `web/src/features/architecture/TeamNotes.tsx`

**Interfaces:**
- Consumes: `SPLIT_CANDIDATES`, `scoreSplit`, `BOUNDARY_EDGES`, `BOUNDARY_MODULES` from `./scoring` (Tasks 5, 6).
- Produces: `<SplitTrigger />`, `<BoundaryMap />` (Figure 7), `<TeamNotes />`. `TeamNotes` takes props so Task 16 can reuse it for stage 01: `{ title?: string; children: ReactNode }`, defaulting the title to `If you are not solo`.

- [ ] **Step 1: Build `SplitTrigger`**

Requirements:

- One row per `SPLIT_CANDIDATES` entry, each with `a reason` / `not a reason` as `role="radio"` in a per-row radiogroup.
- Commit before reveal, same as `ReversibilityTable`. Running score via `scoreSplit`, `aria-live="polite"`.
- Local `useState` only.
- `go`/`danger` with text labels for correct/incorrect.

- [ ] **Step 2: Build `BoundaryMap`**

Structural reference: `OpportunityTree.tsx`. Requirements:

- Three module boxes from `BOUNDARY_MODULES`, labelled `src/features/billing/`, `src/features/clients/`, `src/features/auth/`, each with the one-line ownership note from `docs/03-architecture.md:131-134`.
- Three edges from `BOUNDARY_EDGES`. Legal edges are drawn one way, the illegal one another — **and the difference is stated in text on the edge**, not carried by line style alone. The `legal` boolean is asserted as data by a Task 6 test precisely so the component can render it as text.
- Selecting an edge shows its `call` and `why` in a detail panel with `aria-live="polite"`.
- Edges are buttons with accessible names that include both endpoints and legality, e.g. `clients calls billing — allowed` / `clients queries billing's table — not allowed`. A screen-reader user must not have to infer legality from position.
- The illegal edge uses `danger`; legal edges use a neutral line, not `go`. Marking correct code as green implies the other two are a scored answer rather than the rule.
- Stacks below `md` without the edges becoming meaningless — if the layout cannot carry arrows at 320px, fall back to a labelled list of the three calls with the same detail panel. Say which you shipped in the commit body.

- [ ] **Step 3: Build `TeamNotes`**

Content source: `docs/03-architecture.md:212-224`. Requirements:

- A collapsed disclosure titled `If you are not solo`, matching the shape stage 02 established. Collapsed by default.
- `aria-expanded` on the control, panel controlled by id.
- Takes `children` so stage 01 can pass its own team content in Task 16. The title is a prop defaulting to `If you are not solo`.
- Content for stage 03: boundaries become social and follow team ownership; ADRs stop being optional because they are how a decision survives the person who made it; splitting services is finally justifiable by deploy cadence and team autonomy; architectural changes deserve heavier review than feature changes because the blast radius is larger; Conway's law.
- Wrap `blast-radius` and `adr` with `<Term>` on first appearance — both already exist in `terms.ts`, so do not redefine them. Remember the explicit `{' '}` around each `<Term>`.

- [ ] **Step 4: Verify all three**

Temporary mount. Check: split rows commit before revealing; the boundary map's edges are individually selectable and their accessible names carry legality (verify with the Playwright accessibility snapshot, not by reading the JSX); `TeamNotes` is collapsed on load; 320px and 2560px; both themes; zero console errors.

Confirm the `<Term>` spacing rendered correctly — inspect the DOM text, since this is the bug that shipped once as "solution treeis".

Remove the temporary mount.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/architecture/SplitTrigger.tsx \
        web/src/features/architecture/BoundaryMap.tsx \
        web/src/features/architecture/TeamNotes.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): build the shape step

The split exercise scores four real triggers against two named non-reasons. The
boundary map draws the one rule that keeps a monolith from becoming a ball of
mud, with the illegal cross-table query as a selectable edge.

Legality is in the accessible name, not the line style. A screen-reader user
should not have to infer from position which of three arrows is the one they
must not draw.

TeamNotes takes children and a title prop so stage 01 can reuse it — TD-13 is
closed by making the disclosure a shared component rather than a per-stage
decision.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Step 5 — auth paths and the ADR anatomy

**Files:**
- Create: `web/src/features/architecture/AuthPaths.tsx`
- Create: `web/src/features/architecture/ADRAnatomy.tsx`

**Interfaces:**
- Produces: `<AuthPaths />` (Figure 8), `<ADRAnatomy />` (Figure 9).

- [ ] **Step 1: Build `AuthPaths`**

Structural reference: `web/src/features/discovery/Toolkit.tsx` for the tab shape. Content source: `docs/03-architecture.md:148-153`. Requirements:

- Three tabs: `Roll your own`, `Managed provider`, `A library`. `role="tablist"` / `role="tab"` / `role="tabpanel"`, arrow-key roving focus.
- Each panel answers the same three questions in the same order, so the tabs are comparable rather than three essays: what it costs, what the risk is, and what it does to your data model. The last one is the tie to the rest of the stage and must not be dropped.
- Concrete examples named as the doc names them: Clerk and Auth0 for the managed provider, Auth.js for the library.
- No `go`/`danger` on any option. None of the three is wrong, and colouring one green is a recommendation the doc deliberately does not make.
- Below the tabs, a line on authorization being the part people get wrong, wrapping `authorization` with `<Term>` (added in Task 7) and linking to `/stages/05-development`.

- [ ] **Step 2: Build `ADRAnatomy`**

Content source: `docs/03-architecture.md:162-168`. Requirements:

- Five collapsed parts: Context, Decision, Reasoning, Consequences, Alternatives considered.
- Each expands to two things: what the part is for in one line, and the filled-in version for the auth decision the reader just compared in `AuthPaths`. The worked example is what makes ADRs read as useful rather than bureaucratic, so it is not optional.
- A copy button that puts the **blank** template on the clipboard as markdown, with the five headings. Copy the template, not the worked example — the reader is going to write their own.
- The copy button shows a confirmation state on success, matching `PlanWorksheet`'s copy affordance, with `aria-live="polite"`.
- Wrap `adr` with `<Term>` on first appearance. It already exists in `terms.ts`.
- A closing line pointing at `/stages/10-documentation` for the format itself, since this stage defers it there.
- Collapsed by default; `aria-expanded`; `min-h-11`.

- [ ] **Step 3: Verify both**

Temporary mount. Check: tab arrow-keys move focus and change panels; the copy button actually writes to the clipboard (read it back via the browser, do not assume); `<Term>` spacing in the DOM; 320px and 2560px; both themes; zero console errors.

At 320px the three tab labels are the risk — confirm they wrap or scroll rather than overflowing.

Remove the temporary mount.

- [ ] **Step 4: Commit**

```bash
git add web/src/features/architecture/AuthPaths.tsx \
        web/src/features/architecture/ADRAnatomy.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): build the decide-and-record step

Three auth paths, each answering the same three questions in the same order so
the tabs compare rather than each making its own case. No semantic colour on any
of them: none is wrong, and colouring one green is a recommendation the doc
deliberately declines to make.

The ADR anatomy expands each of the five parts to the filled-in version of the
auth decision the reader just compared. That pairing is why auth and ADRs share
a step — an ADR step with no decision in it reads as bureaucracy.

Copy puts the blank template on the clipboard, not the worked example.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: The AI plays step

**Files:**
- Create: `web/src/features/architecture/AIArchitecturePlays.tsx`

**Interfaces:**
- Produces: `<AIArchitecturePlays />`. Task 15 mounts it in the `ai` step.

Structural reference: `web/src/features/planning/AIPlanningPlays.tsx` — read it before writing, and match its shape rather than inventing a new one. Content source: the `### AI in architecture` section written in Task 1.

- [ ] **Step 1: Build the component**

Requirements:

- Two groups, clearly separated: where agents earn their place, and where they mislead. The second group is the load-bearing half and gets at least equal visual weight.
- Each entry is expand-to-reveal: the claim collapsed, the reasoning inside.
- The four "helps" and the four "misleads" from the doc section, not a paraphrase that drifts from it.
- Tools named where the doc names them: `context7`, `claude-mem`, a git worktree or sandbox for a throwaway spike.
- `go` for the helps group and `warn` for the misleads group, each with a text label. Not `brand` — these carry meaning, and using `brand` for "this is good" is the bug that already shipped once.
- If `AIPlanningPlays` includes a copyable prompt, mirror that here only if there is a prompt genuinely worth pasting. Do not add one for symmetry.
- Collapsed by default; `aria-expanded`; `min-h-11`.

- [ ] **Step 2: Verify against the doc**

Read `docs/03-architecture.md`'s AI section and the component side by side. Every claim in the component must appear in the doc, and every doc bullet must appear in the component. They are two renderings of one argument; a drift here is the duplication problem this project already tracks.

- [ ] **Step 3: Verify rendering**

Temporary mount. 320px and 2560px, both themes, zero console errors, collapsed on load.

Remove the temporary mount.

- [ ] **Step 4: Commit**

```bash
git add web/src/features/architecture/AIArchitecturePlays.tsx
git commit -m "$(cat <<'EOF'
feat(architecture): build the AI plays step

Mirrors AIPlanningPlays structurally and carries the doc section written in the
first commit of this branch, so the two say the same thing in the shape each
medium wants.

The misleads half gets equal weight, because it is the half that matters here:
an agent asked to design a system reaches for services, queues and caches by
default, and every one of those is on the defer list the reader just went
through.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Assemble the stage and turn it on

**Files:**
- Create: `web/src/features/architecture/Architecture.tsx`
- Modify: `web/src/features/stage-content.ts`
- Modify: `web/src/lib/stages.ts:50`
- Modify: `web/e2e/audit.spec.ts:8-24`

**Interfaces:**
- Consumes: every component from Tasks 8–14.
- Produces: `<Architecture />` registered against `03-architecture`; six new URLs in the audit suite.

Structural reference: `web/src/features/planning/Planning.tsx`.

- [ ] **Step 1: Build `Architecture.tsx`**

Requirements:

- `const STEPS: Step[]` with exactly six entries, in order:

| id | label | hint |
|---|---|---|
| `reverse` | Reverse | Sort decisions by how expensive they are to undo |
| `model` | Model | The data model outlives every framework choice |
| `constrain` | Constrain | Rules the database holds, not the application |
| `shape` | Shape | One application, with honest boundaries inside |
| `decide` | Decide | The expensive choice, and the record of why |
| `ai` | AI plays | Where agents help, and where they design for scale you do not have |

- Each step's content is `<div className="space-y-16">` of `<Section eyebrow=… title=…>` blocks, matching `Planning.tsx`.
- Figures mounted with explicit numbers running 1–9 across the whole stage: 1 `ReversibilityAxis`, 2 `DomainSketch`, 3 `DriftDiagram`, 4 `SchemaInspector`, 5 `DeleteBehaviour`, 6 `OneAppCosts`, 7 `BoundaryMap`, 8 `AuthPaths`, 9 `ADRAnatomy`.
- Captions state what the figure *claims*, not what it depicts. Use `&ldquo;`/`&rdquo;` for any quotes — a straight double quote breaks the attribute.
- `TeamNotes` sits in the `shape` step, after `BoundaryMap`.
- The stage closes on a `Callout kind="trap"` set carrying `docs/03-architecture.md:227-252`, the way stage 01 and 02 do.
- `<References slug="03-architecture" />` at the end, matching how `Planning.tsx` mounts it.
- Wrap first appearances of the seven new terms plus `adr`, `blast-radius`, `yagni` with `<Term>`. Explicit `{' '}` around each.
- Prose is connective tissue between the interactive pieces, not the main event. If a `Section` has no figure, no expandable detail and nothing to click, it is the anti-pattern `PATTERNS.md:31-32` names.

- [ ] **Step 2: Register the stage**

In `web/src/features/stage-content.ts`:

```ts
import { Architecture } from './architecture/Architecture'

export const STAGE_CONTENT: Record<string, ComponentType> = {
  '01-product-discovery': ProductDiscovery,
  '02-planning': Planning,
  '03-architecture': Architecture,
}
```

In `web/src/lib/stages.ts:50`, change `ready: false` to `ready: true` for the `03-architecture` entry.

- [ ] **Step 3: Add the six step hashes to the audit suite**

In `web/e2e/audit.spec.ts`, append to `PAGES`:

```ts
  '/stages/03-architecture#reverse',
  '/stages/03-architecture#model',
  '/stages/03-architecture#constrain',
  '/stages/03-architecture#shape',
  '/stages/03-architecture#decide',
  '/stages/03-architecture#ai',
```

This array is hand-written, not derived from `ready`. Skipping it ships the stage unaudited with CI green, which is why it is a numbered step rather than a note.

- [ ] **Step 4: Run the full local gate**

Run, from `web/`:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Expected: all clean. The build prerenders 22 routes; stage 03 now renders content rather than the placeholder.

- [ ] **Step 5: Run the audit suite**

Run: `cd web && pnpm test:e2e`

Expected: 9 tests pass across all 20 pages. If contrast or overflow fails, fix the component rather than the threshold. If the failure is at 1.34:1 or similar, check whether the parser is reading `oklab()` before assuming the palette is wrong — that false alarm has happened.

- [ ] **Step 6: Walk every step in a browser**

Run `pnpm dev` and visit each of the six hashes directly. Confirm: the deep link opens the right step; the back button walks between them; visited steps get a check; arrow keys move between steps.

Zero console errors on all six, in a clean browser context.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/architecture/Architecture.tsx \
        web/src/features/stage-content.ts \
        web/src/lib/stages.ts \
        web/e2e/audit.spec.ts
git commit -m "$(cat <<'EOF'
feat(architecture): assemble stage 03 and turn it on

Six steps — reverse, model, constrain, shape, decide, ai — with nine figures
numbered across the whole stage. Registered in STAGE_CONTENT and flipped to
ready, so the route stops rendering the placeholder.

Also adds the six step hashes to e2e/audit.spec.ts. That array is hand-written
rather than derived from `ready`, so a stage can otherwise ship completely
unaudited while CI stays green.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Close TD-13 — retrofit the stage 01 team disclosure

**Files:**
- Modify: `web/src/features/discovery/ProductDiscovery.tsx`

**Interfaces:**
- Consumes: `TeamNotes` from `@/features/architecture/TeamNotes` (Task 12).

Stage 02 ports its team section into the app; stage 01 dropped its equivalent, and every later stage has been left to guess which precedent to follow. This closes it in stage 01's favour so the rule is uniform: team content ships as a collapsed disclosure in every stage.

Deliberately the smallest possible change to a finished stage. One component, one mount point, no restructuring.

- [ ] **Step 1: Read stage 01's team content**

Run: `grep -n '^## Scaling to a team' -A 20 docs/01-product-discovery.md`

That is the source. Do not rewrite it; port it.

- [ ] **Step 2: Mount `TeamNotes` in stage 01's closing step**

In `ProductDiscovery.tsx`, add `<TeamNotes>` to the final step, after the existing content and before the trap callouts, carrying the doc's team section as children.

Importing an architecture-folder component into the discovery folder is a cross-feature import. It is correct here: `TeamNotes` is a shared disclosure shape, not stage 03 content. If a reviewer objects, the fix is to move `TeamNotes` to `web/src/components/`, not to duplicate it — say so in the review response rather than copying the file.

- [ ] **Step 3: Verify stage 01 is otherwise unchanged**

Run: `git diff web/src/features/discovery/ProductDiscovery.tsx`

Expected: one import line and one mounted component. Nothing else. If the diff is larger, you restructured something that was working.

- [ ] **Step 4: Verify rendering**

Run `pnpm dev`, visit `/stages/01-product-discovery#record`. Confirm the disclosure is collapsed on load, expands, and matches stage 02's and stage 03's shape.

320px and 2560px, both themes, zero console errors.

- [ ] **Step 5: Run the gate**

Run: `cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e`

Expected: all clean. The audit suite already sweeps stage 01's step hashes, so the new disclosure is covered without adding a page.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/discovery/ProductDiscovery.tsx
git commit -m "$(cat <<'EOF'
fix(discovery): give stage 01 the team disclosure (closes TD-13)

Stage 02 ported its "Scaling to a team" section as a collapsed disclosure and
stage 01 silently dropped its equivalent, leaving every later stage to guess
which precedent to follow. Stage 03 forced the question, so it is settled here:
team content ships as a collapsed disclosure in every stage.

Reuses the TeamNotes component built for stage 03 rather than writing a second
one. The cross-feature import is deliberate — TeamNotes is a shared disclosure
shape, and if that becomes uncomfortable the fix is to move it to components/,
not to duplicate it.

Smallest possible change to a finished stage: one import, one mount point.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Verification pass and the record

**Files:**
- Modify: `docs/task.md` (W-3 checklist, AI-plays tracker)
- Modify: `docs/tracker.md` (shipped entry, decisions, TD-13 closed)
- Modify: `KICKOFF.md` (project state, next round)
- Modify (only if Step 6 finds a pattern worth recording): `web/PATTERNS.md`

**Interfaces:**
- Consumes: everything. Produces: the record that makes the work auditable.

- [ ] **Step 1: Run the whole gate from clean**

```bash
cd web
rm -rf .next
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```

Deleting `.next` is not ceremony. A bare typecheck passes locally on a stale `.next` and fails on a clean checkout, which is exactly how CI caught it once.

Record the actual test counts. Do not write "all tests pass" — write the number.

- [ ] **Step 2: Run the three verification passes against the production build**

Serve the production build on :3100 and check, for all six stage 03 steps plus stage 01's steps:

- **Contrast**: every distinct text/background pair, both themes, WCAG AA. If a checker reports mass failures, suspect the checker first — a link audit once reported 124 false breaks and a contrast parser once reported 1.34:1 because it could not read `oklab()`.
- **Responsive**: 320 → 2560px, no horizontal overflow, no sub-44px touch target below `lg`. Check `SchemaInspector` at 320px explicitly by evaluating `scrollWidth` against `clientWidth`, not by looking at a screenshot.
- **Console**: zero errors in a clean browser context.

- [ ] **Step 3: Run the cold-reader pass on the doc**

Follow `docs/learnings/cold-reader-testing.md`. Run the beginner-completeness pass on `docs/03-architecture.md` as amended: could a reader who has never designed a schema follow it? Record what the pass found, including anything it found that you decided not to fix and why.

- [ ] **Step 4: Update `docs/task.md`**

Tick the W-3 per-stage checklist for stage 03 with the actual numbers in parentheses, matching how stage 02's entry reads. Update the per-stage AI-plays tracker.

- [ ] **Step 5: Update `docs/tracker.md`**

Add the shipped entry. **Evidence, not adjectives** — commit SHAs, test counts, what review caught. Include:

- A `Deferred:` list. At minimum: TD-11 and TD-14 stay open; no ADR worksheet; no schema validation.
- A decision entry for five content steps plus AI on a dense stage, stating it is a ceiling for dense stages rather than the new default.
- A decision entry for the domain-model worksheet over an ADR worksheet, with the reasoning.
- TD-13 moved to closed, with the rule stated: team content ships as a collapsed disclosure in every stage.
- The `SplitTrigger` six-versus-five refinement, recorded as plan-authored.
- The correction that `e2e/audit.spec.ts` is hand-maintained, so the next stage build does not rediscover it.

Decisions are appended and superseded, never edited.

- [ ] **Step 6: Decide whether `web/PATTERNS.md` needs an entry**

Only if stage 03 produced a pattern stages 04–18 should copy. Two candidates to judge rather than assume: the **annotated-code inspector** (`SchemaInspector`) is a distinct shape from the click-node inspector already documented, and the **taught-then-recorded** pairing (a scored exercise on a worked example, then the same questions free-text for the reader's own project) is a composition of two existing patterns rather than a new one.

If either earns a row, add it with its canonical example. If neither does, write nothing — `PATTERNS.md` documents the code, and padding it makes the useful entries harder to find. Say which you decided in the commit body.

- [ ] **Step 7: Update `KICKOFF.md`**

Refresh *Project state* and *This round's scope*. Delete closed items rather than leaving them ticked. Stage 03 becomes complete; the next round's recommendation is stage 04 or `W-5`, with the reasoning stated rather than asserted.

Fix the two things this round found wrong in it: the audit suite does not sweep ready stages automatically, and a stage's doc may be missing its AI section.

- [ ] **Step 8: Run humanizer over the round’s prose**

`humanizer:humanizer` over the amended `docs/03-architecture.md` section (already done in Task 1, re-check if it changed) and the `KICKOFF.md` prose. **Skip it for tracker entries and terminal output** — the flagged patterns are not the problem there.

- [ ] **Step 9: Commit**

```bash
git add docs/task.md docs/tracker.md KICKOFF.md   # plus web/PATTERNS.md if Step 6 added a row
git commit -m "$(cat <<'EOF'
docs(tracker): record stage 03, close TD-13, refresh the kickoff

Evidence for the stage 03 build, the decisions taken during it, and what it
deliberately did not do. TD-13 closes with the rule rather than the fix: team
content ships as a collapsed disclosure in every stage.

Also corrects two things the kickoff asserted that turned out to be false — the
audit suite does not sweep ready stages, and a stage doc can be missing its AI
section — so the next round does not rediscover them.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Verification (after all tasks)

Before requesting the final whole-branch review:

- [ ] `cd web && rm -rf .next && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e` — all clean, counts recorded
- [ ] All six stage 03 step hashes deep-link correctly, back button walks between them
- [ ] Contrast AA in both themes across all six steps and stage 01's retrofit
- [ ] No horizontal overflow 320–2560px; `SchemaInspector` verified by measuring, not by screenshot
- [ ] No sub-44px touch target below `lg`
- [ ] Zero console errors in a clean browser context
- [ ] Carry-forward works end to end, and `playbook:planning-worksheet` is byte-identical before and after
- [ ] Worksheet persists across reload; the stored JSON has all five keys
- [ ] `reference/glossary.md` regenerated, never hand-edited
- [ ] Every reference URL opened in a real browser
- [ ] The app's AI step and the doc's AI section make the same claims
- [ ] `git status` clean, no temporary mounts left in `planning/` or `discovery/`

Then a **final whole-branch review** before merge, not only the per-task reviews. Findings carry severity, an ID, and provenance. The reviewer is expected to disprove as well as confirm, including its own earlier claims.

Merge with `--no-ff` and a hand-written subject via `superpowers:finishing-a-development-branch`. Do not push unless asked.

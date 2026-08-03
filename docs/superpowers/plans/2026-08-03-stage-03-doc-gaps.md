# Stage 03's eight recorded doc gaps — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the eight recorded doc gaps in `docs/03-architecture.md` and mirror each into `web/`, leaving stage 03 with no open recorded gap.

**Architecture:** Eight independent tasks, one gap each, every one landing the doc change and its app mirror in a single commit (D-51). Placement is dictated by D-52's four-screen panel cap rather than by convenience: the two panels with no headroom take zero visible height. One new test guards the container view against drifting from the doc.

**Tech Stack:** Markdown (the stage docs), Next.js 16 · TypeScript · Tailwind 4 (the app), vitest, playwright.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-08-03-stage-03-doc-gaps-design.md`. Read it before Task 1 — it settles the *content* of all eight gaps, and this plan does not repeat the reasoning.
- **D-51 — doc and app in one commit.** Every task changes `docs/03-architecture.md` and `web/`, and commits them together. A task that lands one side is not done. This is the failure that produced TD-23.
- **D-49 — never meet a constraint by teaching less.** Content moves behind an expand-to-reveal; it does not get cut.
- **D-52 — no panel over 4.0 screens at 1024×768.** Enforced by `web/e2e/audit.spec.ts`. Current headroom: `model` 3.7, `schema` 3.6, `evolve` 3.4 are tight; `indexes` 1.9, `sketch` 2.3, `tenancy` 2.5, `resilience` 2.7 have room.
- **D-42 — cite doc sections by heading, never by line number.** `source-citations.test.ts` enforces it.
- **D-47 — grep `web/src/lib/terms.ts` when a concept is ported**, then `pnpm gen:glossary`. Never hand-edit `reference/glossary.md`.
- **D-50 — executable content gets executed.** Task 5 touches SQL.
- **TDD.** No production content without a failing test first where a test is possible. Data files and components are testable; prose in `Architecture.tsx` is not, and the honest guard for prose is the doc-sync tests this plan adds and extends.
- **A test name is a claim.** Six tests on this branch shipped with names their assertions could not fail for, twice in tests cited in a commit body as the fix. Verify every new assertion by running it against a counter-example before trusting it.
- **Stage before teeth-checking.** `git checkout <file>` on unstaged work is a revert, not a restore. This cost a rebuild once already.
- Run `pnpm typecheck` (not bare `tsc`) — it runs `next typegen` first.
- **Commits:** Conventional Commits, lowercase after the colon, scope `architecture` or `docs`. Trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

## File structure

| File | Responsibility | Tasks |
|---|---|---|
| `docs/03-architecture.md` | The stage doc. Source of truth for every claim | all |
| `web/src/features/architecture/Architecture.tsx` | Panel prose and step composition | 1, 2, 3, 7 |
| `web/src/features/architecture/sketch.ts` | Container-view nodes, flow steps, resilience patterns | 8 |
| `web/src/features/architecture/sketch.test.ts` | Their invariants, plus the new doc-sync guard | 8 |
| `web/src/features/architecture/scoring.ts` | The interrogation set | 4 |
| `web/src/features/architecture/scoring.test.ts` | Its invariants | 4 |
| `web/src/features/architecture/evolve.ts` | Expand-contract steps, notes, `BACKFILL_SQL` | 5 |
| `web/src/features/architecture/evolve.test.ts` | Its invariants, incl. the character-for-character backfill | 5 |
| `web/src/features/architecture/schema-blocks.ts` | The DDL blocks beyond `invoices` | 6, 7 |
| `web/src/features/architecture/Normalisation.tsx` | New: the three normal forms, expand-to-reveal | 6 |
| `web/src/features/architecture/SoftDelete.tsx` | New: the three mechanics and the filter problem | 7 |
| `web/src/lib/terms.ts` | Glossary, single-sourced | as terms arrive |

---

### Task 1: Record the declined deployment view as a decision

The cheapest gap, and it sets the pattern for the rest: a doc paragraph plus its app mirror, committed together.

`docs/03-architecture.md`, "Sketch the system", already argues that a separate deployment view would be padding for one application on one platform. What it never does is record that as a *decision* — so a reader who was promised the view by the C4 framing sees it silently absent.

**Files:**
- Modify: `docs/03-architecture.md`, "Sketch the system" (the paragraph beginning "The deployment view, for this system, is close enough")
- Modify: `web/src/features/architecture/Architecture.tsx`, the `sketch` step

**Interfaces:**
- Produces: nothing other tasks consume. Prose only.

- [ ] **Step 1: Amend the doc**

In "Sketch the system", the deployment-view paragraph currently ends "It stops being true the moment anything runs on its own schedule or its own hardware." Append, as its own sentence in the same paragraph:

```
Record that as a decision rather than an omission — "no deployment view: one app, one
platform, and the container view already carries it" — because a view you decided not to
draw and a view you forgot are the same shape on the page and different facts about your
thinking.
```

- [ ] **Step 2: Mirror it into the app**

In `Architecture.tsx`, the `sketch` step, inside the `<Section eyebrow="The objection" title="Sketch the system">` prose block, after the paragraph naming C4's four levels, add:

```tsx
<p>
  The deployment view is declined here, and declining it is the
  decision — one application on one platform, with the container view
  already carrying it. Write that down rather than leaving a gap: a view
  you decided not to draw and a view you forgot look identical on the
  page and mean opposite things about your thinking.
</p>
```

- [ ] **Step 3: Verify the panel still fits**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. `sketch` was 2.3 screens; a paragraph is roughly 0.1.

- [ ] **Step 4: Gate**

Run: `cd web && pnpm test && pnpm lint && pnpm typecheck && pnpm format:check`
Expected: all clean. No test changes in this task — `source-citations.test.ts` and `stage-03-structure.test.ts` must still pass, which is what proves the doc edit did not move a heading.

- [ ] **Step 5: Commit**

```bash
git add docs/03-architecture.md web/src/features/architecture/Architecture.tsx
git commit -m "docs(architecture): record the declined deployment view as a decision

The doc argued the declination and never recorded it as one, so a reader
promised the view by C4's framing meets a silent absence. A view you decided
not to draw and a view you forgot are the same shape on the page.

Closes the first of eight gaps recorded since the third cold-reader run.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Capacity estimation, as one number rather than a model

`#### Indexes` tells the reader to trace indexes to real queries. It cannot be judged without knowing roughly how much data exists — and the doc never asks for that number. One hit for `capacity|back-of-envelope|QPS|throughput` in the whole document, and it is the phrase "write throughput" inside a trade-off list.

The risk in fixing this is over-fixing it: capacity planning as an activity is what "Designing for imagined scale" exists to refuse. It goes near indexes, in two sentences, framed as the input the next section already assumes.

**Files:**
- Modify: `docs/03-architecture.md`, "Design the database" → `#### Indexes`
- Modify: `web/src/features/architecture/Architecture.tsx`, the `indexes` step

**Interfaces:**
- Produces: nothing other tasks consume. Prose only.

- [ ] **Step 1: Amend the doc**

At the start of `#### Indexes`, before the existing guidance, insert:

```
Before any of this, one number: **how much data will exist in a year, and how fast does it
arrive?** Not a model — a number you can say out loud. Ten thousand invoices is a table
where every query is fast and no index is load-bearing; ten million is a table where the
wrong index is an outage. You cannot tell which of the two you are indexing for without
saying which one you are, and the honest answer is usually available in one sentence about
your own product.

This is the light version on purpose. Sizing a cache, projecting to ten million users, or
building a spreadsheet of QPS is the imagined scale this stage spends a section refusing.
One number, revisited when it is wrong.
```

- [ ] **Step 2: Mirror it into the app**

In `Architecture.tsx`, the `indexes` step, as the first paragraph of the `<Prose>` in the `<Section eyebrow="Answering real queries">` block:

```tsx
<p>
  One number first: how much data will exist in a year, and how fast does
  it arrive? Ten thousand invoices is a table where nothing you do to it
  matters; ten million is a table where the wrong index is an outage. You
  cannot judge an index without saying which of the two you are — and one
  sentence about your own product is the whole exercise. Sizing a cache or
  projecting to ten million users is the imagined scale this stage
  refuses.
</p>
```

- [ ] **Step 3: Verify the panel still fits**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. `indexes` was 1.9 screens.

- [ ] **Step 4: Gate and commit**

Run: `cd web && pnpm test && pnpm lint && pnpm typecheck && pnpm format:check`

```bash
git add docs/03-architecture.md web/src/features/architecture/Architecture.tsx
git commit -m "docs(architecture): ask for the one capacity number the index section assumes

The stage tells a reader to trace indexes to real queries and never asks how
much data exists, which is the input that decides whether any of it matters.
One number, said out loud, revisited when wrong — explicitly not the sizing
exercise 'Designing for imagined scale' exists to refuse.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Outbox cadence, and where the seam with stage 11 falls

The doc's own answer for a failed notification is "record the intent and send later". The only scheduled job it shows runs daily, which cannot serve a 6am shift confirmed the night before. A reader following the doc literally builds a mechanism that misses its own use case.

**Files:**
- Modify: `docs/03-architecture.md`, "Sketch the system" (the email-provider down-case)
- Modify: `web/src/features/architecture/Architecture.tsx`, the `resilience` step

**Interfaces:**
- Produces: nothing other tasks consume. Prose only.

- [ ] **Step 1: Amend the doc**

In "Sketch the system", after the bullet answering what happens when the email provider is down ("Either retry, or record the intent and send later"), add a paragraph:

```
**If you record the intent, decide the cadence with it.** "Send later" is not a design until
you say how much later, and the answer comes from the promise the feature made rather than
from a default. A daily sweep is right for an invoice reminder and wrong for a shift
confirmed at 9pm for 6am — same mechanism, same code, and one of the two is a broken
feature. Where that job runs, how it is scheduled, and what happens when a run fails are
[11 — CI/CD](11-ci-cd.md)'s and [13 — Production Deployment](13-production-deployment.md)'s;
choosing the cadence the promise requires is this stage's, because it is a property of the
design rather than of the pipeline.
```

- [ ] **Step 2: Mirror it into the app**

In `Architecture.tsx`, the `resilience` step, in the `<Section eyebrow="The consequence" title="Anything received has to be safe twice">` prose — as a second paragraph after the existing idempotency one:

```tsx
<p>
  The same applies to the other half of that answer. If you record the
  intent and send later, <em>how much later</em> is part of the design,
  and it comes from the promise the feature made rather than from a
  default: a daily sweep serves an invoice reminder and fails a shift
  confirmed at 9pm for 6am, on identical code. Where the job runs and what
  happens when a run fails belongs to{' '}
  <Link href="/stages/11-ci-cd" className="text-brand">
    11 — CI/CD
  </Link>
  ; choosing the cadence belongs here.
</p>
```

- [ ] **Step 3: Verify the link resolves and the panel fits**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"` — PASS (`resilience` was 2.7).
Run: `cd web && pnpm test:e2e --grep "zero console errors"` — PASS. A `<Link>` to a route that does not exist is a build-time failure in Next 16, so `pnpm build` is the real check; run it if the link is new.

- [ ] **Step 4: Gate and commit**

```bash
git add docs/03-architecture.md web/src/features/architecture/Architecture.tsx
git commit -m "docs(architecture): make 'send later' say how much later

The doc's own answer to a dead email provider is to record the intent and send
later, and the only job it shows runs daily — which cannot serve a shift
confirmed at 9pm for 6am. Same mechanism, same code, one of them a broken
feature. Cadence follows the promise the feature made; running the job is 11's,
and the seam is now stated rather than implied.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: G1 — a rule for property versus entity, not a second example

The noun-derivation strike test rests on one example: `total` is not an entity. A reader with a different noun has nothing to apply. Open across three cold-reader runs.

The rule: **would you ever need to point at this on its own?** An entity has identity you refer to later; a property only ever describes something else. `total` fails twice — derivable, and unaddressable.

**Files:**
- Modify: `docs/03-architecture.md`, "Model the domain first"
- Modify: `web/src/features/architecture/scoring.ts` (the `INTERROGATIONS` set)
- Modify: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Consumes: `INTERROGATIONS` and `judgeInterrogation` as they exist in `scoring.ts`.
- Produces: one added interrogation entry. Its `id` is `property-or-entity`.

- [ ] **Step 1: Write the failing test**

Add to `web/src/features/architecture/scoring.test.ts`:

```ts
// The strike test rested on one example, so a reader with a different noun had
// nothing to apply. The rule has to be in the data, not only in the prose that
// introduced the example — open across three cold-reader runs.
test('the interrogation carries the property-versus-entity rule, since one worked example is not a test a reader can run', () => {
  const q = INTERROGATIONS.find((i) => i.id === 'property-or-entity')
  expect(q, 'no property-or-entity question').toBeDefined()
  expect(q?.why, 'the rule has to be stated, not just the verdict').toMatch(
    /point at|refer to|on its own/i,
  )
})

test('the question works on a noun the stage never used, since a verdict on ours is not a test a reader can run', () => {
  const q = INTERROGATIONS.find((i) => i.id === 'property-or-entity')
  // `total` may appear in the explanation — it is the example that motivated
  // the rule — but the question itself has to bite on something else, or the
  // reader learns our answer rather than the test.
  expect(q?.question).not.toMatch(/\btotal\b/i)
  expect(q?.options, 'a scored question needs options to choose between').toHaveLength(2)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: FAIL — `no property-or-entity question`. Right reason: the entry does not exist.

- [ ] **Step 3: Add the entry to the doc first**

In "Model the domain first", where the strike test is worked, add the general rule above the `total` example:

```
The test that generalises: **would you ever need to point at this on its own?** An entity has
an identity you refer to later — you fetch it, link to it, attach something to it. A property
only ever describes something else, and has no life apart from the row it sits on. `total`
fails twice over: it is derivable from the line items, and there is no circumstance in which
you address it. A shipping address on an order is the harder case and the same answer — it
is a property until somebody needs to reuse it across orders, at which point it acquires
identity and becomes one.
```

- [ ] **Step 4: Mirror it into `scoring.ts`**

Add to `INTERROGATIONS`, positioned immediately after the entity-versus-event question so the two strike tests sit together:

```ts
{
  id: 'property-or-entity',
  question:
    'A shipping address on an order — is that a property of the order, or an entity of its own?',
  options: [
    { id: 'property', label: 'A property: columns on the order' },
    { id: 'entity', label: 'An entity: its own row, referenced by the order' },
  ],
  answer: 'property',
  why: 'A property, until it is not — and the test that tells you which is: would you ever need to point at this on its own? An entity has an identity you refer to later; you fetch it, link to it, attach something to it. A property only ever describes the row it sits on. An address on a one-off order is described and never addressed, so it is columns. The moment somebody needs to reuse it across orders — a saved address book, a "ship to the same place" button — it acquires identity and becomes an entity, and that change is a migration rather than an afternoon. This is the half of the strike test that generalises: `total` fails it twice over, being both derivable and unaddressable, but the rule is what you apply to a noun we never saw.',
},
```

The type is `Interrogation` in `scoring.ts`: `id`, `question`, `options` (each `{ id, label }`), `answer` (the id of the defensible option), `why` (shown whichever way the reader answered). The exercise is a scored guess-then-reveal, so the entry needs two options and a defensible answer — not a yes/no rule statement.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: PASS.

- [ ] **Step 6: Teeth check**

Stage the work first (`git add -A`), then change the prompt to name `total` explicitly. Run the test file: the second test must fail and only that one. Restore with `git checkout --`.

- [ ] **Step 7: Verify the panel still fits**

`model` is 3.7 screens with no headroom. The entry renders inside the existing interrogation component, which is a list — one more row.

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. **If `model` crosses 4.0, do not split the step** — move the new row's explanation behind the component's existing reveal, or re-measure with the row collapsed by default. Report which you did.

- [ ] **Step 8: Gate and commit**

```bash
git add docs/03-architecture.md web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "docs(architecture): give the strike test a rule instead of one example

'total is not an entity' is a verdict on our noun, not a test a reader can run
on theirs. The rule that generalises: would you ever need to point at this on
its own? G1, open across three cold-reader runs.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: The batch-iteration loop the backfill stops short of

`### Evolve the schema safely` gives a batch size and both guards, then stops before the loop itself. The comment says "Repeat until it reports zero rows" and nothing says how, or what to do when the table is large enough that `OFFSET` stops being free.

**`BACKFILL_SQL` in `evolve.ts` is held to the doc character-for-character by `evolve.test.ts`.** If the SQL block changes, both sides move together or the suite fails. That test is the guard for this task, and it already exists.

**Files:**
- Modify: `docs/03-architecture.md`, "Evolve the schema safely"
- Modify: `web/src/features/architecture/evolve.ts` (`EVOLUTION_NOTES`)
- Modify: `web/src/features/architecture/evolve.test.ts`

**Interfaces:**
- Consumes: `EVOLUTION_NOTES` (four entries: `rollover`, `backfill-guards`, `alter-lock`, `same-shape`, `strangler-fig` — confirm the current list before editing).
- Produces: one added note, id `batch-loop`.

- [ ] **Step 1: Write the failing test**

Add to `web/src/features/architecture/evolve.test.ts`:

```ts
// The doc gave the batch size and both guards and stopped before the loop, so
// "repeat until it reports zero rows" was an instruction with no mechanism.
test('the batch loop is carried, since a backfill that says "repeat" and not "how" is not a procedure', () => {
  const note = EVOLUTION_NOTES.find((n) => n.id === 'batch-loop')
  expect(note, 'no batch-loop note').toBeDefined()
  expect(note?.body).toMatch(/zero rows/i)
})

test('the loop names keyset iteration over OFFSET, which is the part that stops being free on a large table', () => {
  const note = EVOLUTION_NOTES.find((n) => n.id === 'batch-loop')
  expect(note?.body, 'OFFSET must be named as the thing to avoid').toMatch(
    /offset/i,
  )
  expect(note?.body).toMatch(/keyset|id >|last id|greater than the last/i)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/evolve.test.ts`
Expected: FAIL — `no batch-loop note`.

- [ ] **Step 3: Amend the doc**

In "Evolve the schema safely", after the paragraph that gives the batch size ("The batch size is a judgement rather than a constant…"), add:

```
**The loop itself, since "repeat" is not a mechanism.** Run the statement, read the row count
it reports, and run it again until that count is zero. On a small table that is the whole
technique. On a large one, stop paginating with `OFFSET` — it re-scans every row it skips, so
each batch is slower than the last — and iterate by key instead: remember the highest `id` you
touched and start the next batch above it. The guard that makes the loop terminate is already
in the statement above; this is only how you drive it.
```

**Do not change the SQL block.** The keyset advice is prose about driving the statement, not a rewrite of it. If a later reader wants the keyset variant written out, that is a separate decision — and it would need `BACKFILL_SQL` and the doc changed together, which the existing test enforces.

- [ ] **Step 4: Mirror it into `evolve.ts`**

Add to `EVOLUTION_NOTES`, after `backfill-guards` so it sits with the statement it drives:

```ts
{
  id: 'batch-loop',
  title: 'The loop itself, since “repeat” is not a mechanism',
  summary: 'Run it until the row count comes back zero — and stop using OFFSET.',
  body: 'Run the statement, read the row count it reports, and run it again until that count is zero. On a small table that is the whole technique. On a large one, OFFSET stops being free — it re-scans every row it skips, so each batch is slower than the last. Iterate by key instead: remember the highest id you touched and start the next batch above it. The guard that makes the loop terminate is already in the statement; this is only how you drive it.',
},
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd web && pnpm vitest run src/features/architecture/evolve.test.ts`
Expected: PASS, including the pre-existing character-for-character backfill assertion — which proves the SQL block was not touched.

- [ ] **Step 6: Teeth check**

Stage first. Then delete the `/offset/i` sentence from the note body and re-run: the second test must fail and only that one. Restore.

- [ ] **Step 7: Verify the panel fits**

`evolve` is 3.4 screens. The note is a collapsed accordion row: one more row, near-zero height.

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"` — PASS.

- [ ] **Step 8: Gate and commit**

```bash
git add docs/03-architecture.md web/src/features/architecture/evolve.ts web/src/features/architecture/evolve.test.ts
git commit -m "docs(architecture): give the backfill a loop, not just an instruction to repeat

The doc gave a batch size and both guards and stopped before the mechanism, so
'repeat until it reports zero rows' told a reader what to achieve and not how.
Adds the loop, and names the point where OFFSET stops being free.

The SQL block is untouched, which evolve.test.ts proves — it holds BACKFILL_SQL
to the doc character-for-character.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Normalisation — one sentence per form, behind the working rule

`#### Normalisation` names first, second and third normal form in a single clause and teaches the practical rule instead. The rule is the right lead. The forms are standard vocabulary a reader will meet in every schema discussion they ever have, and naming without defining is the gap D-49 exists to close.

`schema` is 3.6 screens, so this goes behind an expand-to-reveal and costs the panel one collapsed card.

**Files:**
- Modify: `docs/03-architecture.md`, "Design the database" → `#### Normalisation`
- Create: `web/src/features/architecture/normal-forms.ts`
- Create: `web/src/features/architecture/normal-forms.test.ts`
- Create: `web/src/features/architecture/Normalisation.tsx`
- Modify: `web/src/features/architecture/Architecture.tsx`, the `schema` step

**Interfaces:**
- Produces: `NORMAL_FORMS: NormalForm[]` from `web/src/features/architecture/normal-forms.ts`, where

```ts
export type NormalForm = {
  id: '1nf' | '2nf' | '3nf'
  name: string
  rule: string
  /** The shape of the mistake it forbids, in this stage's own example. */
  violation: string
}
```

- [ ] **Step 1: Write the failing test**

Create `web/src/features/architecture/normal-forms.test.ts`:

```ts
import { expect, test } from 'vitest'
import { NORMAL_FORMS } from './normal-forms'

test('all three forms are carried, since naming them and defining none is the gap this closes', () => {
  expect(NORMAL_FORMS.map((f) => f.id)).toEqual(['1nf', '2nf', '3nf'])
})

test('every form states its rule and the mistake it forbids, because a definition without a violation is a label', () => {
  for (const f of NORMAL_FORMS) {
    expect(f.rule.trim().length, `${f.id} rule`).toBeGreaterThan(20)
    expect(f.violation.trim().length, `${f.id} violation`).toBeGreaterThan(20)
  }
})

test('third normal form is the one marked as the target, matching the doc rather than teaching all three as equals', () => {
  const third = NORMAL_FORMS.find((f) => f.id === '3nf')
  expect(third?.rule).toMatch(/aim|target|far enough|worth/i)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/normal-forms.test.ts`
Expected: FAIL — cannot resolve `./normal-forms`.

- [ ] **Step 3: Amend the doc**

In `#### Normalisation`, after the working rule ("if changing one fact means updating two rows, the model is wrong") and before the denormalisation paragraph, add:

```
The three forms, since you will meet the names:

- **First normal form** — one value per cell. A comma-separated list of tags in a `tags`
  column is the violation, and it is the one that looks harmless until you need to query it.
- **Second normal form** — no column depending on part of a composite key. On a table keyed
  by `(invoice_id, line_no)`, storing the client's name is the violation: it depends on the
  invoice alone.
- **Third normal form** — no column depending on another non-key column. Storing both
  `client_id` and `client_address` on an invoice is the violation, and it is the one the
  working rule above is really about.

Third is the one worth aiming at. Beyond it the forms get stricter and the returns get
thinner, and you would be reaching for them to satisfy a definition rather than to fix
something.
```

- [ ] **Step 4: Create `normal-forms.ts`**

```ts
/**
 * Source: docs/03-architecture.md, "Design the database" — its Normalisation
 * subsection.
 *
 * The doc leads with the working rule and names the forms in a clause. These
 * carry the definitions, because a reader meets the names in every schema
 * discussion they will ever have and "named, not taught" is the gap D-49
 * exists to close.
 */

export type NormalForm = {
  id: '1nf' | '2nf' | '3nf'
  name: string
  rule: string
  /** The shape of the mistake it forbids, in this stage's own example. */
  violation: string
}

export const NORMAL_FORMS: NormalForm[] = [
  {
    id: '1nf',
    name: 'First normal form',
    rule: 'One value per cell.',
    violation:
      'A comma-separated list of tags in a `tags` column. It looks harmless until you need to query it, and then every query is a string operation.',
  },
  {
    id: '2nf',
    name: 'Second normal form',
    rule: 'No column depending on part of a composite key.',
    violation:
      'On a table keyed by (invoice_id, line_no), storing the client’s name — it depends on the invoice alone, so half the key is carrying it.',
  },
  {
    id: '3nf',
    name: 'Third normal form',
    rule: 'No column depending on another non-key column. This is the one worth aiming at.',
    violation:
      'Storing both client_id and client_address on an invoice. It is the violation the working rule above is really about: change the address and you are updating two rows.',
  },
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/normal-forms.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 6: Build the component**

Create `web/src/features/architecture/Normalisation.tsx`, following `EvolutionNotes.tsx` exactly for the collapsed-row shape — `role`-free `<button>` with `aria-expanded` and `aria-controls`, `min-h-11` with `lg:min-h-9`, chevron rotating on open, `<h3>` wrapping the control. Collapsed row shows `name` and `rule`; the panel shows `violation` under a `t-label` heading reading "The violation".

Copy the markup rather than inventing a variant. This is the sixth accordion in the feature with this shape, which is recorded debt (`RevealList`, tracker) — do not refactor it here.

- [ ] **Step 7: Render it in `schema`**

In `Architecture.tsx`, the `schema` step, inside the `<Section eyebrow="Where the rule lives" title="Constraints belong in the database">` block, after the existing prose and before the DDL figure:

```tsx
<div className="mt-5">
  <Normalisation />
</div>
```

Add the import beside the other feature imports.

- [ ] **Step 8: Verify the panel still fits**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. `schema` was 3.6; three collapsed rows plus a card border is roughly 0.25.

**If `schema` crosses 4.0**, move the component into the `indexes` step (1.9 screens) instead and say so in the commit body — normalisation and indexes are both "how the table is shaped for queries", so the seam holds. Do not split the step.

- [ ] **Step 9: Gate and commit**

```bash
git add docs/03-architecture.md web/src/features/architecture/normal-forms.ts web/src/features/architecture/normal-forms.test.ts web/src/features/architecture/Normalisation.tsx web/src/features/architecture/Architecture.tsx
git commit -m "docs(architecture): define the three normal forms the doc only named

1NF/2NF/3NF appeared in one clause. They are standard vocabulary a reader meets
in every schema discussion, and naming without defining is exactly the gap D-49
exists to close — so each gets its rule and the violation it forbids, in this
stage's own example.

The working rule stays the lead. Third normal form is marked as the target
rather than teaching all three as equals.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: G6 — the soft-delete mechanic, and how queries stop forgetting the filter

The DDL shows `deleted_at` and the trace row names soft delete as auditability's cost. What is unspecified is the choice — column versus status versus archive table — and the half that bites: every query now needs a filter, and discipline is not how you get one.

**Files:**
- Modify: `docs/03-architecture.md`, "Design the database"
- Create: `web/src/features/architecture/soft-delete.ts`
- Create: `web/src/features/architecture/soft-delete.test.ts`
- Create: `web/src/features/architecture/SoftDelete.tsx`
- Modify: `web/src/features/architecture/Architecture.tsx`, the `tenancy` step

**Interfaces:**
- Produces: `SOFT_DELETE_MECHANICS: SoftDeleteMechanic[]` from `web/src/features/architecture/soft-delete.ts`:

```ts
export type SoftDeleteMechanic = {
  id: 'column' | 'status' | 'archive-table'
  name: string
  what: string
  useWhen: string
  /** Why it is the wrong reach — every one of the three has a case where it is. */
  wrongWhen: string
  isDefault?: boolean
}
```

- [ ] **Step 1: Write the failing test**

Create `web/src/features/architecture/soft-delete.test.ts`:

```ts
import { expect, test } from 'vitest'
import { FILTER_RULE, SOFT_DELETE_MECHANICS } from './soft-delete'

test('all three mechanics are carried, since the gap was that the doc showed one and named no choice', () => {
  expect(SOFT_DELETE_MECHANICS.map((m) => m.id)).toEqual([
    'column',
    'status',
    'archive-table',
  ])
})

test('exactly one is marked the default, because a list of three peers is not advice', () => {
  const defaults = SOFT_DELETE_MECHANICS.filter((m) => m.isDefault)
  expect(defaults).toHaveLength(1)
  expect(defaults[0].id).toBe('column')
})

test('every mechanic says when it is the wrong reach, since each of the three has a case where it is', () => {
  for (const m of SOFT_DELETE_MECHANICS) {
    expect(m.useWhen.trim().length, `${m.id} useWhen`).toBeGreaterThan(20)
    expect(m.wrongWhen.trim().length, `${m.id} wrongWhen`).toBeGreaterThan(20)
  }
})

// The half the doc skipped. A filter every query must remember is a filter
// some query will forget, and the answer is structural rather than cultural.
test('the filter rule rejects discipline as the mechanism, which is the half that actually bites', () => {
  expect(FILTER_RULE).toMatch(/view|accessor|one place|repository/i)
  expect(FILTER_RULE, 'remembering is not a mechanism').toMatch(
    /forget|remember|discipline/i,
  )
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/soft-delete.test.ts`
Expected: FAIL — cannot resolve `./soft-delete`.

- [ ] **Step 3: Amend the doc**

In "Design the database", after the paragraph where `deleted_at` is introduced in the DDL discussion, add:

```
**Soft delete has three mechanics, and the DDL above shows one of them.** A nullable
`deleted_at` timestamp is the default: it records *when*, which is what auditability
actually asked for, and it stays out of the way of every other column. A status enum with a
`deleted` member is the common alternative and usually the wrong one — it conflates a
lifecycle the row already has (draft, sent, paid) with whether the row exists at all, so a
row can only be one thing at a time and "deleted, and previously paid" stops being
expressible. An archive table earns its place when volume is the problem rather than
history: moving old rows out keeps the live table small, and it costs you every query that
wants both.

**Then the half that bites.** Every read now needs `WHERE deleted_at IS NULL`, and a filter
that every query has to remember is one that some query will forget — usually a report,
months later, quietly counting rows nobody deleted on purpose. Discipline is not the
mechanism. Put the filter somewhere structural: a view the application reads instead of the
table, or a single accessor every query goes through. Which one is a codebase decision and
belongs in [05 — Development](05-development.md); that the filter cannot be optional is this
stage's, because it follows from the column you just added.
```

- [ ] **Step 4: Create `soft-delete.ts`**

Populate `SOFT_DELETE_MECHANICS` with the three entries from the doc paragraph above — `column` (marked `isDefault: true`), `status`, `archive-table` — each with `what`, `useWhen` and `wrongWhen` drawn from that prose. Then:

```ts
/** The half the doc skipped: a filter everyone must remember is one someone forgets. */
export const FILTER_RULE =
  'Every read now needs WHERE deleted_at IS NULL, and a filter every query has to remember is one some query will forget — usually a report, months later, quietly counting rows nobody deleted on purpose. Discipline is not the mechanism. Put it somewhere structural: a view the application reads instead of the table, or a single accessor every query goes through.'
```

Do not paraphrase from memory — the doc paragraph you just wrote is the source (D-51).

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd web && pnpm vitest run src/features/architecture/soft-delete.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Teeth check**

Stage first. Then drop the word "view" and the word "accessor" from `FILTER_RULE`. The fourth test must fail and only that one. Restore.

- [ ] **Step 7: Build the component and render it**

Create `SoftDelete.tsx`: the three mechanics as a compact card list, not an accordion — three entries of two lines each, matching `FitnessExamples.tsx` for the shape. Mark the default with a `brand` chip reading "the default", exactly as `DeploymentStyles` marks its chosen row (`brand` means "you are here", not "this is correct"). Close the card with `FILTER_RULE` in the footer position `FitnessExamples` uses for its callout.

Render it in the `tenancy` step, immediately after the `<Section eyebrow="The one that cannot be undone" title="Delete behaviour, decided per entity">` figure, inside that same section — soft delete and `ON DELETE` behaviour are the same decision seen from two sides.

- [ ] **Step 8: Verify the panel fits**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"`
Expected: PASS. `tenancy` was 2.5 screens.

- [ ] **Step 9: Gate, browser pass, commit**

Full gate, then a browser pass at 320px and 1440px in both themes on `#tenancy`: no horizontal overflow, no sub-44px target, zero console errors.

```bash
git add docs/03-architecture.md web/src/features/architecture/soft-delete.ts web/src/features/architecture/soft-delete.test.ts web/src/features/architecture/SoftDelete.tsx web/src/features/architecture/Architecture.tsx
git commit -m "docs(architecture): name the three soft-delete mechanics and the filter that bites

The DDL showed deleted_at and the trace row named its cost; the choice between
a column, a status enum and an archive table was never posed, and neither was
the half that hurts — every read now needs a filter, and a filter every query
must remember is one some query forgets.

Discipline is not the mechanism. Where the filter lives is 05's; that it cannot
be optional is this stage's, because it follows from the column.

Closes G6, partially closed once and open across three cold-reader runs.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: The auth dependency the container view omits — and a guard so it cannot drift again

The largest task, and the one the run-3 report called "a bigger edit than this wave took on". The Availability trace row promises a decision about what still works when each dependency is down; the container view draws payment, email and blob storage, and omits the dependency every one of those flows depends on.

This task also adds the guard: the app's external systems get counted and named against the doc's, so the next edit to either side cannot silently diverge.

**Files:**
- Modify: `docs/03-architecture.md`, "Sketch the system" (the container-view ASCII diagram and the down-case list)
- Modify: `web/src/features/architecture/sketch.ts` (`SKETCH_NODES`)
- Modify: `web/src/features/architecture/sketch.test.ts`

**Interfaces:**
- Consumes: `SketchNode` and `SKETCH_NODES` as they exist in `sketch.ts`. Externals today: `payments`, `email`, `blob`.
- Produces: a fourth external, id `auth`.

- [ ] **Step 1: Write the failing doc-sync test**

Add to `web/src/features/architecture/sketch.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// The port carries a diagram the doc also draws, and the two drifted for a
// whole round before anyone noticed the app was a dependency short. Counting
// the doc's own down-case list is the cheapest guard that survives an edit to
// either side — the same shape as ddl-sync.test.ts and ai-plays.test.ts.
test('every external system the doc answers a down-case for is a node in the app, and vice versa', () => {
  const md = readFileSync(
    fileURLToPath(new URL('../../../../docs/03-architecture.md', import.meta.url)),
    'utf8',
  )
  const section = md.slice(
    md.indexOf('### Sketch the system'),
    md.indexOf('### Design the database'),
  )
  // The doc's down-cases are bold leads: "- **Payment provider down** — …"
  const docNames = [...section.matchAll(/^- \*\*([A-Za-z ]+?) down\*\*/gm)]
    .map((m) => m[1].trim().toLowerCase())
    .sort()
  const appNames = SKETCH_NODES.filter((n) => n.kind === 'external')
    .map((n) => n.name.trim().toLowerCase())
    .sort()
  expect(appNames).toEqual(docNames)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: FAIL, with a diff showing three names on each side that match — and once the doc gains auth in Step 3, four against three. Run it **again after Step 3** to see the failure this test exists for.

Note: if the doc's down-case bullets do not match the regex, fix the *test* to match the doc's actual formatting before proceeding — the doc is the source of truth, not this plan's guess at its punctuation.

- [ ] **Step 3: Amend the doc**

Two edits in "Sketch the system".

First, the container-view diagram gains an auth box. Keep the existing ASCII alignment — the block is inside a fenced code block and its columns are hand-aligned; add the box in the same style as the payment provider, drawn from the app to it.

Second, add a fourth down-case to the list, after blob storage:

```
- **Auth provider down** — nobody new can sign in. Whether the people already using the
  system keep working is not luck, it is the statelessness decision from
  [The shapes a system can take](#the-shapes-a-system-can-take): a session in a cookie or a
  shared store outlives the provider being unreachable, and one held in instance memory does
  not. This is the dependency whose down-case most systems discover in production, because it
  is the one nobody draws.
```

- [ ] **Step 4: Run the test to see it fail for the right reason**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: FAIL — the doc now answers four down-cases and `SKETCH_NODES` has three externals. That is the drift this test exists to catch, demonstrated.

- [ ] **Step 5: Add the node**

In `sketch.ts`, add to `SKETCH_NODES` after `blob`:

```ts
{
  id: 'auth',
  name: 'Auth provider',
  kind: 'external',
  does: 'Signs people in, and holds the identity every other box on this diagram is acting on behalf of. Whether it is a managed service or a library in your own application is the decision Access makes; either way it is a dependency, and drawing it is how you find that out.',
  edge: 'app redirects → provider; provider returns a session',
  whenDown:
    'Nobody new can sign in. Whether the people already using the system keep working is not luck: a session in a cookie or a shared store outlives the provider being unreachable, and one held in instance memory does not — which is the statelessness decision from Shape. The dependency most systems meet in production, because it is the one nobody draws.',
},
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: PASS, including the pre-existing "three external systems" assertion — **which will now fail, because there are four.** Update that assertion to four and correct its name, which says "matching the three answers the doc works through". Both numbers come from the doc; do not pin a number the doc does not have.

- [ ] **Step 7: Teeth check the new guard**

Stage first. Then remove the `auth` node from `SKETCH_NODES` and run the file: the doc-sync test must fail naming the missing side. Restore. Then remove the doc's auth down-case instead and run again: it must fail the other way. A guard that only catches drift in one direction is half a guard.

- [ ] **Step 8: Verify the panel and the diagram**

Run: `cd web && pnpm test:e2e --grep "no step panel exceeds"` — `sketch` was 2.3.
Run: `cd web && pnpm test:e2e --grep "no horizontal overflow"` — the ASCII diagram is the 320px overflow risk in the doc, and `SystemSketch` is a laid-out component in the app.

Then a browser pass on `#sketch` at 320px and 1440px, both themes: the new node renders, its down-case opens, no overflow, zero console errors.

- [ ] **Step 9: Gate and commit**

```bash
git add docs/03-architecture.md web/src/features/architecture/sketch.ts web/src/features/architecture/sketch.test.ts
git commit -m "docs(architecture): draw the auth dependency, and guard the diagram against drifting again

The Availability trace row promises a decision about what still works when each
dependency is down. The container view drew payment, email and blob storage and
omitted the dependency all three act on behalf of — so the row demanded a
down-case for a box that was not on the page.

Its down-case is the interesting one and it cross-links: whether existing
sessions survive is the statelessness decision from Shape, not luck.

Adds the guard the port needed rather than only the node: the doc's own
down-case list is counted against the app's external nodes, in both directions,
so the next edit to either side fails instead of drifting. Teeth-checked by
removing each side in turn.

Closes the last of eight gaps recorded since the third cold-reader run.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

- [ ] `cd web && pnpm test` — full vitest suite green. Paste the count. Baseline before this plan: 286 across 24 files.
- [ ] `cd web && pnpm test:e2e` — 14 tests green over 36 URLs. Paste the count.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm build` — all clean.
- [ ] Re-measure every stage-03 panel and paste the table. Six of eight tasks added rendered content; `model` and `schema` were the two with no headroom.
- [ ] `pnpm vitest run src/lib/` — `stage-03-structure`, `source-citations`, `glossary` and `stage-metadata` all pass. A failure here means a doc heading moved or a citation went stale.
- [ ] `grep -n "n={" web/src/features/architecture/Architecture.tsx` — figure numbers contiguous from 1, no gaps, no repeats. No task adds a figure; a change here is a mistake.
- [ ] **Every gap is closed in both places.** Walk `docs/stage-03-status.md`'s "Known gaps" list and the run-3 report's "Still open" list against the eight commits. Anything unclosed gets said out loud, not quietly carried.
- [ ] **Fourth cold-reader run** — same shift-swap product and constraints as runs 1–3, report to `docs/verification/cold-reader-stage-03-run4.md`.
- [ ] **Fix wave after it, then verify the wave** (D-48). Every run so far has found gaps the round introduced; budget for it rather than treating the report as the end.
- [ ] Update `docs/stage-03-status.md`, `docs/tracker.md`, `docs/task.md` — the eight move to closed with the commit that closed each.
- [ ] **Re-run the whole-branch review** before merge. The existing one describes a tree this round changed.

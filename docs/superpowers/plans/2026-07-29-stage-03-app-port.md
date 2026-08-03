# Stage 03 App Port (W-3.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `web/src/features/architecture/` into agreement with the thirteen-subsection
`docs/03-architecture.md`, closing TD-23, by correcting what the app states wrongly and then
building the four subsections it has no counterpart for.

**Architecture:** The stepper goes from six steps to nine, one per doc movement, under D-49
(one step, one decision, at most one committed exercise). Judgment data lives in pure modules
under `web/src/features/architecture/` and is unit-tested; components render that data and are
covered by the audit suite rather than by a component harness, which this repo deliberately
does not have. The app does not read the markdown: this is hand-transcription, and every
component cites its doc section by heading.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind 4,
Vitest, Playwright, lucide-react icons.

## Global Constraints

- **NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.** Data-layer tasks write the test, run it,
  watch it fail for the right reason, then implement. Component tasks are marked
  **implementation-only** where they have no unit-testable surface; those say so explicitly
  rather than faking a RED run.
- **Teeth check on every data task.** After GREEN, break the implementation again and confirm
  the new test — and only the new test — fails. Restore. Paste both terminal outputs in the
  task report and state why the failure was the right one.
- **Cite doc sections by heading, never by line number** (D-42). The exact form
  `docs/03-architecture.md, "Heading"` is enforced by `web/src/lib/source-citations.test.ts`;
  a line-number citation fails the suite outright.
- **Run `pnpm typecheck`, never bare `tsc --noEmit`.** Route types are generated; typecheck runs
  `next typegen` first. All commands run from `web/`.
- **React 19 forbids setState in an effect body.** Persisted state uses
  `useLocalStorage` (`web/src/lib/useLocalStorage.ts`), never `useEffect` + `setState`.
- **`brand` means attention, not approval.** `go`/`danger`/`warn` carry meaning. An exercise
  with no right answer uses neither `go` nor `danger`.
- **Touch targets ≥44px below `lg`** (`min-h-11`), may tighten to 36px on the desktop rail
  (`lg:min-h-9`).
- **`aria-live="polite"`** on anything that swaps content in place.
- **Collapsed by default.** Nothing reveals an answer the reader has not committed to.
- **Code blocks get their own `overflow-x-auto` container with `tabIndex={0}`**, never shrunken
  type and never a sideways-scrolling page.
- **Commit convention:** `type(scope): subject`, lowercase after the colon, scope `architecture`
  / `scoring` / `a11y` / `tracker` / `plan`. Every commit carries the trailer
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- **Curly apostrophes in prose strings.** Existing data files use `’` and `“ ”` inside
  TypeScript string literals. Match them; do not introduce straight quotes into copy.

## File Structure

**Judgment data — pure modules, unit-tested.** Split out of `scoring.ts` by subject rather than
piled into it, because `scoring.ts` is already 338 lines and the round adds six more data sets:

| File | Owns |
|---|---|
| `features/architecture/scoring.ts` (modify) | Existing sets, corrected: `DECISIONS`, `INTERROGATIONS`, `SPLIT_CANDIDATES`, `SCHEMA_LINES`, `BOUNDARY_EDGES`. Gains `REVERSIBILITY_TEST` |
| `features/architecture/characteristics.ts` (create) | `CHARACTERISTICS`, `TRADES`, `MAX_PICKS`, `EXAMPLE_PICK`, `EXAMPLE_DECLINED`, `TRACE_ROWS` |
| `features/architecture/styles.ts` (create) | `DEPLOYMENT_STYLES`, `CHOSEN_STYLE_ID`, `ORGANISATION_STYLES`, `ORGANISATION_QUESTION`, `STYLE_TRACE` |
| `features/architecture/sketch.ts` (create) | `SKETCH_NODES`, `C4_LEVELS`, `FLOW_STEPS`, `SYNC_ASYNC_ROWS`, `PROCESSED_EVENTS_LINES` |
| `features/architecture/contracts.ts` (create) | `CONTRACT_ROWS`, `ROUTE_ANSWERS`, `CONTRACT_DECISIONS`, `AUTHZ_PATTERNS`, `AUTHZ_SCENARIOS`, `scoreAuthz` |
| `features/architecture/schema-blocks.ts` (create) | `INDEX_LINES`, `PARTIAL_UNIQUE_LINES`, `TENANCY_LINES`, `ER_ENTITIES`, `ER_EDGES` |

Each gets a sibling `*.test.ts`. `scoring.test.ts` already exists and is extended.

**Components — one file per component, matching the existing convention:**

Create: `CharacteristicPicker.tsx`, `TraceForward.tsx`, `DeploymentStyles.tsx`,
`InternalOrganisation.tsx`, `YourCharacteristics.tsx`, `SystemSketch.tsx`, `DataFlow.tsx`,
`SyncAsync.tsx`, `IdempotencyBlock.tsx`, `ERView.tsx`, `PartialUniqueIndex.tsx`,
`ContractCost.tsx`, `RouteShape.tsx`, `AuthzPatterns.tsx`.

Modify: `SchemaInspector.tsx` (takes its lines as a prop), `ReversibilityTable.tsx`,
`ModelInterrogation.tsx` (no change needed beyond data), `BoundaryMap.tsx`, `DeferredList.tsx`,
`AIArchitecturePlays.tsx`, `Architecture.tsx` (rebuilt into nine steps).

**Storage:** `lib/architecture-sheet.ts` gains nothing. The characteristics pick gets its own
key and its own tiny module, `features/architecture/characteristics-store.ts`, so the domain
worksheet's shape is not widened for an unrelated concern.

---

## Wave 1 — corrections

The app currently states things the doc has corrected. These land first, so the round is
releasable after wave 1 and so scope pressure at the end cannot reach them.

### Task 1: The fifth interrogation question

**Files:**
- Modify: `web/src/features/architecture/scoring.ts:105-146`
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `INTERROGATIONS` gains a fifth entry with `id: 'actor-rights'` and three options
  (`'entity'`, `'column'`, `'membership'`), answer `'membership'`. Task 15 (`AuthzPatterns`) and
  Task 16 (tenancy DDL) both refer to this question by that id.

- [ ] **Step 1: Write the failing tests**

Append to `web/src/features/architecture/scoring.test.ts`:

```ts
test('the model is interrogated with five questions, because the fifth is what decides whether a role is an entity, a column, or a relationship', () => {
  expect(INTERROGATIONS).toHaveLength(5)
})

test('the actor-rights question answers with the relationship, since a users.role column is one global answer to a question asked per team', () => {
  expect(judgeInterrogation('actor-rights', 'membership').correct).toBe(true)
  expect(judgeInterrogation('actor-rights', 'column').correct).toBe(false)
  expect(judgeInterrogation('actor-rights', 'entity').correct).toBe(false)
})

test('every interrogation offers at least two options, since a question with one answer is not a judgment', () => {
  for (const q of INTERROGATIONS) {
    expect(q.options.length, `${q.id} has too few options`).toBeGreaterThan(1)
  }
})

test('every interrogation answer names one of its own options, so a typo cannot make a question unanswerable', () => {
  for (const q of INTERROGATIONS) {
    expect(
      q.options.map((o) => o.id),
      `${q.id} answers with an option it does not offer`,
    ).toContain(q.answer)
  }
})
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`

Expected: the first two FAIL. The length assertion reports `expected length 4 to be 5`. The
`judgeInterrogation` assertion fails because an unknown id returns
`{ correct: false, why: 'That question is no longer on the sheet.' }`, so
`judgeInterrogation('actor-rights', 'membership').correct` is `false` rather than `true`.
The last two PASS already, which is correct — they are invariants over the set, and they exist
so the new entry cannot be added malformed.

- [ ] **Step 3: Add the fifth question**

In `web/src/features/architecture/scoring.ts`, append to the `INTERROGATIONS` array, after the
`number-uniqueness` entry:

```ts
  {
    id: 'actor-rights',
    question: 'Does every actor have the same rights over this entity?',
    options: [
      { id: 'entity', label: 'No — “Manager” is its own entity' },
      { id: 'column', label: 'No — a role column on users' },
      { id: 'membership', label: 'No — a role on the membership' },
    ],
    answer: 'membership',
    why: 'The role belongs on the relationship. A users.role column is a single global answer to a question that gets asked per team: a person can manage one team and be an ordinary member of another, and the column cannot say that. Making “Manager” its own entity is worse, because it duplicates the person. Ask this before the schema exists and you get a memberships table with the role on it; ask it afterwards and you get a migration. It is also the question that decides which authorization pattern applies to this entity, which is why ownership is not the only one.',
  },
```

- [ ] **Step 4: Correct the reasoning on two existing questions**

The doc generalised both answers after the app was built. In the `overdue-status` entry, replace
the `why` with:

```ts
    why: 'Computed. If it is stored, something has to update it — a cron job, a trigger, a write on read — and the day that something misses a run, the column disagrees with the date it was derived from. Computed from due_date < now() AND status = ‘sent’, it is always correct and cannot drift. The general form is worth more than this answer: compute it when it is a pure function of data you already hold, and store it when it is a fact about a moment — the tax rate applied when the invoice was sent, the price at the time of purchase, the address it shipped to. Those look derivable and are not, because the thing they would derive from has since changed.',
```

In the `invoice-delete` entry, replace the `why` with:

```ts
    why: 'Soft delete, or an immutable ledger. The heuristic is wider than money: keep anything somebody will later ask “where did that go?” about. Financial records obviously, but also cancelled bookings, withdrawn requests, and users who left — each of those is a row whose absence is itself a question someone eventually needs answered. Pay the filtering cost where that is true, and hard delete where it genuinely is not, because a soft delete taxes every query that follows it.',
```

- [ ] **Step 5: Run the tests and verify they pass**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: PASS, all tests in the file.

- [ ] **Step 6: Teeth check**

Change `answer: 'membership'` to `answer: 'column'` and re-run. Confirm the actor-rights test
fails and the length test still passes — that is the point: the two assertions catch different
defects. Then delete the whole new entry and confirm the length test fails too. Restore both.
Paste both runs into the task report.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "fix(scoring): add the fifth interrogation question, and generalise two answers

The doc's fifth question — does every actor have the same rights over
this entity — is what decides whether a role is an entity, a column or a
relationship, and it feeds the authorization pattern. The app asked four.

Two existing answers were narrower than the doc's: 'computed, here' is an
answer rather than a rule, so the compute-vs-store general form now rides
with it, and the soft-delete heuristic covers cancelled bookings and
withdrawn requests rather than only money.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: The reversibility test, surfaced

**Files:**
- Modify: `web/src/features/architecture/scoring.ts` (add `REVERSIBILITY_TEST` after `Decision`)
- Modify: `web/src/features/architecture/ReversibilityTable.tsx`
- Modify: `web/src/features/architecture/AIArchitecturePlays.tsx:44-47`
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `export type TestQuestion = { id: string; question: string; note: string }` and
  `export const REVERSIBILITY_TEST: TestQuestion[]` (three entries, last id `'stored-data'`).

W-3.1 promoted this test out of the AI section and into "Sort decisions by reversibility". The
app has it only as one line inside an AI play (`AIArchitecturePlays.tsx:46`), so a reader who
never opens the AI step never meets it.

- [ ] **Step 1: Write the failing tests**

```ts
test('the reversibility test has three questions, which is what makes it a test rather than an instinct', () => {
  expect(REVERSIBILITY_TEST).toHaveLength(3)
})

test('the last question is the stored-data one, because the doc says it dominates the other two', () => {
  expect(REVERSIBILITY_TEST.at(-1)?.id).toBe('stored-data')
})

test('every test question explains itself, since the questions alone read as a checklist', () => {
  for (const q of REVERSIBILITY_TEST) {
    expect(q.note.trim().length, `${q.id} has no note`).toBeGreaterThan(0)
  }
})
```

Add `REVERSIBILITY_TEST` to the import block at the top of `scoring.test.ts`.

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: the file fails to collect, reporting that `REVERSIBILITY_TEST` is not exported from
`./scoring`. That is the right failure for a symbol that does not exist yet.

- [ ] **Step 3: Add the data**

In `scoring.ts`, immediately after the `Decision` type and before `DECISIONS`:

```ts
export type TestQuestion = {
  id: string
  question: string
  note: string
}

/**
 * Source: docs/03-architecture.md, "Sort decisions by reversibility".
 *
 * The test the reader applies to their own decisions rather than looking them
 * up. It sat in the AI section until W-3.1 promoted it here, which is where it
 * belongs: the exercise below is six worked examples of this test, and without
 * it the exercise teaches the answers instead of the method.
 */
export const REVERSIBILITY_TEST: TestQuestion[] = [
  {
    id: 'what-changes',
    question: 'What would have to change?',
    note: 'Name the files, the tables and the deploys. A decision you cannot describe the reversal of is one you have not thought about yet, which is a different problem.',
  },
  {
    id: 'call-sites',
    question: 'How many call sites touch it?',
    note: 'A real signal, with one trap in it. Logging calls are everywhere and still cheap, because nothing reads them back. Count what depends on the shape, not what mentions the name.',
  },
  {
    id: 'stored-data',
    question: 'Is any of it stored data?',
    note: 'This one dominates the other two. Code is refactorable; data has to be migrated, and a migration runs against rows that already exist, written by a version of the system you no longer have.',
  },
]
```

- [ ] **Step 4: Render it above the exercise**

In `ReversibilityTable.tsx`, add `REVERSIBILITY_TEST` to the import from `./scoring`, and insert
this block immediately after the opening `<Card>` tag, before the existing header `<div>`:

```tsx
      <div className="mb-5 border border-line bg-sunken p-4">
        <p className="t-label mb-3 text-subtle">The test, applied three times</p>
        <ol className="space-y-2.5">
          {REVERSIBILITY_TEST.map((q, i) => (
            <li key={q.id} className="flex gap-3">
              <span
                className="t-data shrink-0 pt-0.5 text-[11px] text-brand"
                aria-hidden
              >
                {`0${i + 1}`}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">
                  {q.question}
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-muted">
                  {q.note}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
```

- [ ] **Step 5: Stop the AI play from restating it**

In `AIArchitecturePlays.tsx`, replace the `reversibility` entry's `body` with:

```ts
    body: '“This is cheap to undo” has a falsifiable answer, and the test is the one at the top of this stage. Hand it the decision and the test, and make it argue the expensive case. A model is good at enumerating consequences and bad at deciding they are acceptable.',
```

- [ ] **Step 6: Run the tests and verify they pass**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts && pnpm typecheck`
Expected: PASS.

- [ ] **Step 7: Teeth check**

Reorder `REVERSIBILITY_TEST` so `stored-data` is first. Confirm only the "last question" test
fails, and that the length test still passes — a reordering is exactly the defect a length
assertion cannot see, which is why both exist. Restore.

- [ ] **Step 8: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts web/src/features/architecture/ReversibilityTable.tsx web/src/features/architecture/AIArchitecturePlays.tsx
git commit -m "fix(architecture): teach the reversibility test where the doc now teaches it

W-3.1 promoted the three-part test out of the AI section and into the
stage's opening. The app still had it as one line inside an AI play, so a
reader who never opened that step met six worked verdicts and never the
method that produces them.

The play now points at the test instead of restating it, which is also
what the doc does.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Annotate the two DDL lines that are choices

**Files:**
- Modify: `web/src/features/architecture/scoring.ts:245-297` (`SCHEMA_LINES`)
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `SCHEMA_LINES` unchanged in shape; the `pk` and `due-date` entries both carry a
  `note`. Task 16 reuses the `SchemaLine` type for three further blocks.

The DDL statements did not change in W-3.1. What changed is that the doc now teaches two of the
lines as choices rather than defaults, and `due_date` currently has no annotation at all
(`scoring.ts:277`), so the reader cannot click the line the doc argues about.

- [ ] **Step 1: Write the failing tests**

```ts
test('the due_date line is annotated, because date versus timestamptz is one of the two lines the doc argues about', () => {
  const line = SCHEMA_LINES.find((l) => l.id === 'due-date')
  expect(line?.note?.trim().length ?? 0).toBeGreaterThan(0)
})

test('the primary-key note names the alternative it rejected, so the choice reads as a choice', () => {
  const line = SCHEMA_LINES.find((l) => l.id === 'pk')
  expect(line?.note).toMatch(/bigserial/)
})

test('every annotated line is inside the table body, since the CREATE and the closing paren have nothing to teach', () => {
  for (const line of SCHEMA_LINES) {
    if (line.note) expect(line.indent, `${line.id} is annotated`).toBe(1)
  }
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: the first two FAIL. The `due-date` assertion reports `expected 0 to be greater than 0`
because that entry has no `note` property. The `pk` assertion reports that `undefined`/the
current note does not match `/bigserial/`. The third PASSES already and is there to stop a
later task annotating a structural line.

- [ ] **Step 3: Replace the two entries**

In `SCHEMA_LINES`, replace the `pk` entry's `note` and replace the whole `due-date` entry:

```ts
  {
    id: 'pk',
    sql: 'id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
    note: 'A choice, not a default. A uuid can be generated without a round trip to the database and gives away nothing when it appears in a URL. The alternative, bigserial, is smaller and faster to join on — but it publishes how many rows you have and how fast they arrive, to anyone who can see two of your ids.',
  },
```

```ts
  {
    id: 'due-date',
    sql: 'due_date     date NOT NULL,',
    indent: 1,
    note: 'date here, timestamptz below, and the difference is not pedantry. A due date is a calendar day and means the same thing to a reader in any timezone. A creation time is an instant and does not. Getting these backwards produces off-by-one-day bugs that appear only for users in other timezones, which is to say never on your machine.',
  },
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: PASS.

- [ ] **Step 5: Teeth check**

Delete the `note` from `due-date` and confirm only that test fails. Change `bigserial` to
`bigint` in the `pk` note and confirm only the pk test fails. Restore both.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "fix(scoring): annotate the two DDL lines the doc argues about

The statements are unchanged; what changed is that W-3.1 named uuid-over-
bigserial and date-versus-timestamptz as choices with a cost on each side.
due_date carried no annotation at all, so the line the doc spends a
paragraph on was the one line in the block a reader could not click.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: The boundary rule applies to writes

**Files:**
- Modify: `web/src/features/architecture/scoring.ts:312-337` (`BOUNDARY_EDGES`)
- Test: `web/src/features/architecture/scoring.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `BOUNDARY_EDGES` gains a fourth entry, `id: 'clients-writes-invoices'`, with
  `legal: false`. `BOUNDARY_MODULES` is unchanged at three; the new edge reuses `billing` and
  `clients`, so no module needs adding.

The doc's "that applies to writes as much as reads, which is the half that gets forgotten" has
no edge in the app. All three existing edges are reads.

- [ ] **Step 1: Write the failing tests**

```ts
test('the boundary map shows a write crossing a boundary, which is the half of the rule that gets forgotten', () => {
  const write = BOUNDARY_EDGES.find((e) => e.id === 'clients-writes-invoices')
  expect(write).toBeDefined()
  expect(write?.legal).toBe(false)
})

test('the map is not all-illegal or all-legal, so the shape of the call is what decides and not the pairing', () => {
  expect(BOUNDARY_EDGES.filter((e) => e.legal).length).toBeGreaterThan(0)
  expect(BOUNDARY_EDGES.filter((e) => !e.legal).length).toBeGreaterThan(1)
})

test('every edge names modules the map actually draws, since an edge to nowhere renders as a dangling line', () => {
  for (const e of BOUNDARY_EDGES) {
    expect(BOUNDARY_MODULES, `${e.id} from`).toContain(e.from)
    expect(BOUNDARY_MODULES, `${e.id} to`).toContain(e.to)
  }
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts`
Expected: the first FAILS with `expected undefined not to be undefined` — there is no write
edge. The second FAILS because only one edge is currently illegal and the assertion wants more
than one. The third PASSES, guarding the new entry against a typo in `from`/`to`.

- [ ] **Step 3: Add the edge**

Append to `BOUNDARY_EDGES`:

```ts
  {
    id: 'clients-writes-invoices',
    from: 'clients',
    to: 'billing',
    call: 'db.update(invoices).set({ status: “paid” }).where(...)',
    legal: false,
    why: 'The same violation as the read below it, and the one people forget, because a boundary tends to get policed on the way in and not on the way out. Writing another module’s table means billing’s invariants — what a valid status transition is, what else has to change with it — now live in two places, and only one of them is the module that owns them. Approving a shift swap has the same shape: it changes rows the approval flow does not own, so it goes through the owning feature’s function or the boundary exists only in the folder names.',
  },
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/scoring.test.ts && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Give the new edge an accessible name**

`BoundaryMap.tsx:52-56` keys a verb phrase off the edge id, and falls back to a generic
"from to" that flattens exactly the distinction this edge exists to draw. Add the entry:

```ts
const EDGE_VERB: Record<string, string> = {
  'clients-calls-billing': 'clients calls billing',
  'billing-calls-auth': 'billing calls auth',
  'clients-queries-invoices': "clients queries billing's table",
  'clients-writes-invoices': "clients writes billing's table",
}
```

The rest of the component maps over `BOUNDARY_EDGES` and needs no change. Confirm that by
reading it — the row list at `:121-130` is unbounded, and the module grid at `:104` iterates
`BOUNDARY_MODULES`, which is unchanged. Report what you checked rather than editing
speculatively.

- [ ] **Step 6: Teeth check**

Flip the new edge's `legal` to `true` and confirm only the first test fails. Restore.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/architecture/scoring.ts web/src/features/architecture/scoring.test.ts
git commit -m "fix(scoring): show a write crossing a module boundary

All three edges were reads, so the app taught half the rule. The doc's
point is that the write case is the one that gets forgotten: approving a
swap changes rows the approval flow does not own, and reaching for the
table puts one module's invariants in two places.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Multi-tenancy stops being a deferral

**Files:**
- Modify: `web/src/features/architecture/DeferredList.tsx:61-70` and the closing paragraph at
  `:185-188`

**Interfaces:**
- Consumes: nothing.
- Produces: `DeferredList` renders five deferred items plus one item marked as failing the
  test. Task 19 (step 08 assembly) relies on the component still being default-exportable with
  no props.

**Implementation-only.** `DeferredList` holds its items as a module-local `ITEMS` const with no
exported surface, so there is nothing a unit test can reach. Do not invent an export purely to
test it; the audit suite covers the rendered result. Say this in the task report.

The doc now opens the section with a test — *defer anything whose reversal does not require
migrating stored data* — and then names multi-tenancy as the one item that fails it.

- [ ] **Step 1: Add the test as a field on the type**

Replace the `Item` type and add a `failsTest` flag:

```ts
type Item = {
  id: string
  name: string
  summary: string
  problem: string
  notYet: string
  costsToday: string
  /** Marks the item that fails the deferral test and therefore is not deferred. */
  failsTest?: boolean
}
```

- [ ] **Step 2: Replace the multi-tenancy entry**

```ts
  {
    id: 'multi-tenancy',
    name: 'Multi-tenancy: the axis, not the machinery',
    summary: 'The one item here that fails the test. Decide the axis now.',
    failsTest: true,
    problem:
      'Isolates each customer’s data and access so tenants never see or affect one another’s rows.',
    notYet:
      'Everything built on top of the axis can wait: invitations, per-tenant settings, roles, billing. None of it is stored data on every table, so none of it fails the test.',
    costsToday:
      'The axis itself cannot wait, and it is a single question — is the tenant a person or an organisation? Where data is genuinely shared across a team, user_id is not a lighter version of the right answer, it is the wrong axis: the rows belong to the organisation and the person is merely who touched them. Retrofitting org_id in place of user_id is a migration of every table plus every query that ever touched one.',
  },
```

- [ ] **Step 3: Mark it in the rendered row**

In the `<button>`'s label block, after the `{item.name}` span, add:

```tsx
                    {item.failsTest && (
                      <span className="mt-1 inline-block border border-warn px-1.5 py-0.5 text-[11px] font-medium text-warn">
                        fails the test
                      </span>
                    )}
```

`warn` rather than `brand`: this carries meaning (an exception to the rule the list states), and
`brand` is reserved for attention.

- [ ] **Step 4: Replace the closing paragraph**

```tsx
      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        The test: defer anything whose reversal does not require migrating stored
        data. Adding a cache later touches code. Adding a queue later touches
        code. Those are afternoons, and you will make the decision with
        information you do not have today. One item above fails that test, which
        is why it is split into the part you decide now and the part you defer.
      </p>
    </Card>
```

- [ ] **Step 5: Verify it renders**

Run: `cd web && pnpm typecheck && pnpm lint && pnpm dev`, open
`http://localhost:3200/stages/03-architecture#decide`, expand the multi-tenancy row, and confirm
the badge, the three panels and the new closing paragraph all read correctly in both themes.
Paste what you saw.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/DeferredList.tsx
git commit -m "fix(architecture): split multi-tenancy into the axis and the machinery

The app listed multi-tenancy as a plain deferral. The doc now states the
deferral test — defer anything whose reversal does not require migrating
stored data — and multi-tenancy fails it, because a tenant key is stored
data on every table.

So the row is split rather than moved: decide the axis now (person or
organisation), defer everything built on top of it. The badge is warn
rather than brand, because it carries meaning.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: The AI section catches up with the doc

**Files:**
- Modify: `web/src/features/architecture/AIArchitecturePlays.tsx:37-81`

**Interfaces:**
- Consumes: the `reversibility` body edited in Task 2. Do not re-edit it.
- Produces: `HELPS` has seven entries, `MISLEADS` has five. No exported surface changes.

**Implementation-only**, for the same reason as Task 5: `HELPS` and `MISLEADS` are module-local.

- [ ] **Step 1: Add three helps**

Insert after the `reversibility` entry, keeping the doc's order:

```ts
  {
    id: 'characteristics',
    claim: 'Argue down a characteristics list',
    body: 'Ask for the ten things this system could need to be, then make it defend cutting six. The generating half is where it helps. The cutting half is where you find out whether your three were actually chosen or merely listed.',
  },
  {
    id: 'missing-box',
    claim: 'Find the box you left out of the sketch',
    body: 'Paste the container view and ask what a system like this usually talks to that is missing. It is good at this because it is pattern-matching against every similar system it has read, which is the one situation where that habit works for you rather than against you.',
  },
```

And insert before the `schema-gaps` entry:

```ts
  {
    id: 'schema-index',
    claim: 'Read a schema for the index you need',
    body: 'Paste the DDL and the queries your screens actually make. Without the queries it will suggest indexes for imagined access patterns, which is worse than no suggestion at all, because an index you do not need still costs write time and disk.',
  },
```

- [ ] **Step 2: Add the fifth mislead**

Insert after the `distribution` entry:

```ts
  {
    id: 'style-by-popularity',
    claim: 'Asked which style to use, it answers with the one it has read most about',
    body: 'Not the one your characteristics select. It will produce a comparison table that looks like the one in this stage and then recommend against your own constraints, with citations. Use it the other way round: give it your three characteristics and make it derive the answer, rather than asking it what to pick.',
  },
```

- [ ] **Step 3: Verify counts and order against the doc**

Read `docs/03-architecture.md`, section "AI in architecture". Confirm the app now carries all
seven helps and all five misleads, in the doc's order. List any the doc has that the app still
does not, in the task report, rather than assuming the count is the check.

- [ ] **Step 4: Verify it renders**

Run: `cd web && pnpm typecheck && pnpm lint`, then load `#ai` in the dev server and expand every
new row in both themes.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/architecture/AIArchitecturePlays.tsx
git commit -m "fix(architecture): carry the doc's seven plays and five misleads

The app had four and four. The three missing helps are the ones tied to
sections the app did not have yet — arguing down a characteristics list,
finding the box missing from the sketch, reading a schema for the index
a real query needs.

The missing mislead is the one that matters most now that the styles
comparison exists: asked which style to use, a model answers with the one
it has read most about, not the one your characteristics select.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Wave 2 — the four new steps

### Task 7: Architecture characteristics, as data

**Files:**
- Create: `web/src/features/architecture/characteristics.ts`
- Test: `web/src/features/architecture/characteristics.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces, all named exports used by Tasks 8 and 10:
  - `type Characteristic = { id: string; name: string; meaning: string }`
  - `const CHARACTERISTICS: Characteristic[]` (ten)
  - `type TraceRow = { characteristicId: string; forces: string; stepId: string; stepLabel: string }`
  - `const TRACE_ROWS: TraceRow[]` (three)
  - `const EXAMPLE_PICK: string[]` (three ids)
  - `type Declined = { id: string; because: string }` and `const EXAMPLE_DECLINED: Declined[]` (three)
  - `const TRADES: string[]`
  - `const MAX_PICKS = 4`

- [ ] **Step 1: Write the failing tests**

Create `web/src/features/architecture/characteristics.test.ts`:

```ts
import { expect, test } from 'vitest'
import {
  CHARACTERISTICS,
  EXAMPLE_DECLINED,
  EXAMPLE_PICK,
  MAX_PICKS,
  TRACE_ROWS,
  TRADES,
} from './characteristics'

const IDS = new Set(CHARACTERISTICS.map((c) => c.id))

test('ten candidates are offered, because the exercise is choosing from a list and not completing one', () => {
  expect(CHARACTERISTICS).toHaveLength(10)
})

test('candidate ids are unique, since a pick is stored by id', () => {
  expect(IDS.size).toBe(CHARACTERISTICS.length)
})

test('every candidate says what choosing it commits you to, so the list is not ten words to nod at', () => {
  for (const c of CHARACTERISTICS) {
    expect(c.meaning.trim().length, `${c.id} has no meaning`).toBeGreaterThan(0)
  }
})

test('the cap is four, which is what makes the exercise a trade rather than a checklist', () => {
  expect(MAX_PICKS).toBe(4)
})

test('the worked example picks three and declines three, because a characteristic you never considered is not one you rejected', () => {
  expect(EXAMPLE_PICK).toHaveLength(3)
  expect(EXAMPLE_DECLINED).toHaveLength(3)
})

test('the example picks and declines name real candidates, so neither list can drift from the ten', () => {
  for (const id of EXAMPLE_PICK) expect(IDS, `picked ${id}`).toContain(id)
  for (const d of EXAMPLE_DECLINED) expect(IDS, `declined ${d.id}`).toContain(d.id)
})

test('nothing is both picked and declined, which would make the worked example incoherent', () => {
  const declined = new Set(EXAMPLE_DECLINED.map((d) => d.id))
  for (const id of EXAMPLE_PICK) expect(declined, `${id}`).not.toContain(id)
})

test('every declined characteristic says why, since declining out loud is the whole point of the list', () => {
  for (const d of EXAMPLE_DECLINED) {
    expect(d.because.trim().length, `${d.id} has no reason`).toBeGreaterThan(0)
  }
})

// The doc's own test, expressed as an invariant: "a characteristic that traces
// to no decision was not chosen, it was listed." If this fails, the trace table
// and the worked example have drifted apart, and the section teaches vocabulary.
test('every picked characteristic traces to a decision, which is the doc test this section closes on', () => {
  const traced = new Set(TRACE_ROWS.map((r) => r.characteristicId))
  for (const id of EXAMPLE_PICK) expect(traced, `${id} traces nowhere`).toContain(id)
})

test('every trace row points at a step the stepper actually has', () => {
  const steps = new Set([
    'reverse',
    'require',
    'model',
    'shape',
    'sketch',
    'schema',
    'contract',
    'record',
    'ai',
  ])
  for (const r of TRACE_ROWS) {
    expect(steps, `${r.characteristicId} points at ${r.stepId}`).toContain(r.stepId)
  }
})

test('the trades are stated, because the cap needs a reason and "pick fewer" is not one', () => {
  expect(TRADES.length).toBeGreaterThan(0)
  for (const t of TRADES) expect(t.trim().length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/characteristics.test.ts`
Expected: the file fails to collect — `Failed to resolve import "./characteristics"`. That is the
right failure: the module does not exist. Do not create an empty module to get a different
error first.

- [ ] **Step 3: Write the module**

Create `web/src/features/architecture/characteristics.ts`:

```ts
/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * Architecture characteristics — what most job descriptions call
 * non-functional requirements. Stage 02 settled what the system does; this is
 * the other half, what it has to be while doing it.
 *
 * The list is deliberately ten and the cap is deliberately four. They trade
 * against each other, and a system that is meant to be everything has been told
 * nothing, which is a system whose next hard call gets made by whoever is
 * closest to it.
 */

export type Characteristic = {
  id: string
  name: string
  /** What choosing it commits you to, rather than what the word means. */
  meaning: string
}

export const CHARACTERISTICS: Characteristic[] = [
  {
    id: 'availability',
    name: 'Availability',
    meaning:
      'The system is up when somebody reaches for it. Measured in nines, and each further nine costs roughly an order of magnitude more than the last.',
  },
  {
    id: 'correctness',
    name: 'Correctness',
    meaning:
      'The answer is the right one, and no two parts of the system disagree about the same fact.',
  },
  {
    id: 'auditability',
    name: 'Auditability',
    meaning:
      'You can reconstruct what happened, who did it and when — years later, for somebody who was not there.',
  },
  {
    id: 'latency',
    name: 'Latency',
    meaning:
      'The system answers fast enough that nobody notices waiting. Distinct from throughput, which is how much it answers at once.',
  },
  {
    id: 'scalability',
    name: 'Scalability',
    meaning:
      'Load can grow a long way before the design has to change shape. The one most often chosen on no evidence.',
  },
  {
    id: 'security',
    name: 'Security',
    meaning:
      'Only the people who should reach a thing can reach it, and you can demonstrate that rather than assert it.',
  },
  {
    id: 'cheap-to-run',
    name: 'Cheap to run',
    meaning:
      'The monthly bill stays proportionate to what the system is worth. For one person paying for it, this is a real constraint and not a preference.',
  },
  {
    id: 'deployability',
    name: 'Deployability',
    meaning:
      'A change reaches production quickly and safely, so shipping is routine rather than an event.',
  },
  {
    id: 'evolvability',
    name: 'Evolvability',
    meaning:
      'The next feature costs about what the last one did. This is the one that decays quietly, because nothing alerts when it does.',
  },
  {
    id: 'observability',
    name: 'Observability',
    meaning:
      'When something is wrong you can find out what, from outside, without shipping code to find out.',
  },
]

/** Why the cap exists. Every line here pulls against the others. */
export const TRADES: string[] = [
  'High availability costs money, and each further nine costs much more than the last.',
  'Strong auditability costs write throughput, because every change has to be recorded as well as made.',
  'Cheap to run costs both, which is why it is a characteristic and not a wish.',
]

export const MAX_PICKS = 4

/** The invoicing example's three. */
export const EXAMPLE_PICK: string[] = [
  'auditability',
  'correctness',
  'cheap-to-run',
]

export type Declined = {
  id: string
  because: string
}

/**
 * Declined out loud, because a characteristic you never considered is not the
 * same as one you rejected — and only the second is a decision.
 */
export const EXAMPLE_DECLINED: Declined[] = [
  {
    id: 'availability',
    because:
      'A few hours down is survivable. Nobody sends invoices at three in the morning, and the cost of the next nine buys nothing anybody would notice.',
  },
  {
    id: 'latency',
    because:
      'Nobody is in a hurry to look at an invoice. A page that answers in a second is indistinguishable, here, from one that answers in eighty milliseconds.',
  },
  {
    id: 'scalability',
    because:
      'There is no evidence of it. Inventing some is the trap this stage names twice, and designing for a number you made up is how the complexity arrives.',
  },
]

export type TraceRow = {
  characteristicId: string
  /** The decision this characteristic forces later in the stage. */
  forces: string
  /** The stepper step where that decision actually gets made. */
  stepId: string
  stepLabel: string
}

/**
 * The part that makes the section load-bearing rather than a vocabulary
 * exercise. Every row is a decision the stage makes anyway; choosing the
 * characteristic first is what turns it from a preference into something with a
 * reason attached.
 */
export const TRACE_ROWS: TraceRow[] = [
  {
    characteristicId: 'auditability',
    forces:
      'Soft delete over hard delete, and an immutable record of what was sent. Every query afterwards pays a filtering cost, which is the trade being bought here.',
    stepId: 'schema',
    stepLabel: 'Schema',
  },
  {
    characteristicId: 'correctness',
    forces:
      'Constraints in the database rather than the application, and money as integer cents rather than a float that cannot hold 0.10.',
    stepId: 'schema',
    stepLabel: 'Schema',
  },
  {
    characteristicId: 'cheap-to-run',
    forces:
      'One application and one database, with no queue until something demands one. It also rules out microservices, whose cost is paid per service regardless of load.',
    stepId: 'shape',
    stepLabel: 'Shape',
  },
]
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/characteristics.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Teeth check**

Remove the `cheap-to-run` row from `TRACE_ROWS`. Confirm only the "traces to a decision" test
fails, and read its message: it should name `cheap-to-run` as tracing nowhere. That test carries
the doc's own claim about when a characteristic was chosen rather than listed, so it earning its
keep matters more than the count assertions around it. Then change one `stepId` to `constrain`
(the old step id this round removes) and confirm only the step test fails. Restore both.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/characteristics.ts web/src/features/architecture/characteristics.test.ts
git commit -m "feat(architecture): add architecture characteristics as data

Ten candidates, a cap of four, the invoicing example's three picks and
its three explicit declines, and the trace table that says what each
choice forces later in the stage.

The trace is tested against the doc's own test — a characteristic that
traces to no decision was listed, not chosen — so the two halves cannot
drift apart and leave the section teaching vocabulary.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: The characteristics picker and the trace

**Files:**
- Create: `web/src/features/architecture/characteristics-store.ts`
- Create: `web/src/features/architecture/CharacteristicPicker.tsx`
- Create: `web/src/features/architecture/TraceForward.tsx`
- Test: `web/src/features/architecture/characteristics-store.test.ts`

**Interfaces:**
- Consumes: everything Task 7 produced.
- Produces: `CHARACTERISTICS_KEY`, `NO_PICKS`, `togglePick(picks, id, max)` from
  `characteristics-store.ts`; `<CharacteristicPicker />` and `<TraceForward />`, both
  prop-less. Task 10 consumes `CHARACTERISTICS_KEY` and `NO_PICKS`; Task 18 renders both
  components.

`togglePick` is a pure function so the cap behaviour — the only real logic here — is testable
without a component harness. The components themselves are implementation-only.

- [ ] **Step 1: Write the failing tests**

Create `web/src/features/architecture/characteristics-store.test.ts`:

```ts
import { expect, test } from 'vitest'
import { togglePick } from './characteristics-store'

test('picking adds the id, which is the ordinary case', () => {
  expect(togglePick([], 'correctness', 4)).toEqual(['correctness'])
})

test('picking again removes it, so a misclick is not permanent', () => {
  expect(togglePick(['correctness'], 'correctness', 4)).toEqual([])
})

test('the cap blocks a fifth pick rather than silently dropping the first, because a silent swap would hide the trade', () => {
  const four = ['a', 'b', 'c', 'd']
  expect(togglePick(four, 'e', 4)).toEqual(four)
})

test('at the cap you can still deselect, or the reader is stuck with their first four', () => {
  expect(togglePick(['a', 'b', 'c', 'd'], 'b', 4)).toEqual(['a', 'c', 'd'])
})

test('order is preserved, so the list does not reshuffle under the reader as they pick', () => {
  expect(togglePick(['a', 'b'], 'c', 4)).toEqual(['a', 'b', 'c'])
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/characteristics-store.test.ts`
Expected: fails to collect, `Failed to resolve import "./characteristics-store"`.

- [ ] **Step 3: Write the store**

Create `web/src/features/architecture/characteristics-store.ts`:

```ts
/**
 * The reader's own characteristics, kept in one place.
 *
 * A separate key from the domain worksheet (`lib/architecture-sheet.ts`) rather
 * than a sixth field on it: the worksheet is a document the reader exports, and
 * this is a selection two steps of the stage read. Widening the worksheet's
 * shape for it would change what "the artifact" means.
 */

export const CHARACTERISTICS_KEY = 'playbook:architecture-characteristics'

/** Stable reference: this is the server snapshot for useSyncExternalStore. */
export const NO_PICKS: string[] = []

/**
 * Toggle one id, refusing to exceed `max`.
 *
 * Refusing rather than evicting the oldest pick is deliberate. An eviction
 * would let the reader keep clicking and never meet the cap, which is the one
 * thing this exercise is trying to teach: they trade against each other.
 */
export function togglePick(
  picks: string[],
  id: string,
  max: number,
): string[] {
  if (picks.includes(id)) return picks.filter((p) => p !== id)
  if (picks.length >= max) return picks
  return [...picks, id]
}
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/characteristics-store.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Teeth check**

Change the cap branch to `return [...picks.slice(1), id]` (the eviction behaviour the comment
rejects). Confirm the cap test fails and the deselect test still passes. Restore.

- [ ] **Step 6: Write `CharacteristicPicker`**

Create `web/src/features/architecture/CharacteristicPicker.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import {
  CHARACTERISTICS,
  EXAMPLE_DECLINED,
  EXAMPLE_PICK,
  MAX_PICKS,
  TRADES,
} from './characteristics'
import {
  CHARACTERISTICS_KEY,
  NO_PICKS,
  togglePick,
} from './characteristics-store'

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * Not a scored exercise, because the doc offers a set to choose from rather
 * than a set to complete — there is no right three for a system it has not
 * seen. So no `go` and no `danger` anywhere in here: the only accent is
 * `brand` on a selected chip, which means "you are here" and not "correct".
 *
 * The teeth are in the cap. A reader who tries for a fifth is told why, in
 * the terms the section is about, and the trades are what the message names.
 * Refusing rather than evicting is the point — see `togglePick`.
 *
 * The picks persist, because step 04 asks the reader to run the same trace
 * against their own three and cannot do that if the answer was thrown away on
 * navigation.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))

export function CharacteristicPicker() {
  const {
    value: picks,
    setValue: setPicks,
    reset,
  } = useLocalStorage<string[]>(CHARACTERISTICS_KEY, NO_PICKS)
  const [revealed, setRevealed] = useState(false)
  const [blocked, setBlocked] = useState(false)

  const toggle = (id: string) => {
    const next = togglePick(picks, id, MAX_PICKS)
    setBlocked(next === picks && !picks.includes(id))
    setPicks(next)
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            What does your system have to be?
          </p>
          <p className="text-sm text-subtle">
            Pick three or four. Not because a longer list is hard to write.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-live="polite"
            className="font-mono text-sm tabular-nums text-muted"
          >
            {picks.length}/{MAX_PICKS} chosen
          </span>
          {picks.length > 0 && (
            <button
              type="button"
              onClick={() => {
                reset()
                setBlocked(false)
                setRevealed(false)
              }}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          )}
        </div>
      </div>

      <div
        role="group"
        aria-label="Architecture characteristics"
        className="grid gap-2 sm:grid-cols-2"
      >
        {CHARACTERISTICS.map((c) => {
          const on = picks.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(c.id)}
              className={[
                'flex min-h-11 w-full items-start gap-2.5 border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                on
                  ? 'border-brand bg-brand-tint'
                  : 'border-line bg-raised hover:border-line-strong',
              ].join(' ')}
            >
              <span
                className={`mt-0.5 w-3.5 shrink-0 text-sm ${on ? 'text-brand' : 'text-subtle'}`}
                aria-hidden
              >
                {on ? '▪' : '▫'}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-muted">
                  {c.meaning}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {blocked && (
          <div className="mt-4">
            <Callout kind="warn" title="Four is the cap, and it is the lesson">
              <p>
                They trade against each other, so a longer list is not a more
                ambitious system. It is a system with no priorities, which means
                the next hard call gets made by whoever is closest to it.
              </p>
              <ul className="mt-2 space-y-1">
                {TRADES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Callout>
          </div>
        )}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-4 flex min-h-11 items-center gap-2 border border-line bg-raised px-4 text-sm font-medium transition-colors duration-150 hover:border-fg lg:min-h-9"
        >
          Show what the invoicing example chose
        </button>
      ) : (
        <div className="mt-4 space-y-4 border-t border-line pt-4">
          <div>
            <p className="t-label mb-2 text-subtle">The example chose</p>
            <ul className="space-y-1.5">
              {EXAMPLE_PICK.map((id) => (
                <li key={id} className="flex items-center gap-2 text-sm">
                  <Check className="size-3.5 shrink-0 text-brand" aria-hidden />
                  <span className="font-medium text-fg">
                    {NAME_BY_ID.get(id) ?? id}
                  </span>
                  {picks.includes(id) && (
                    <span className="text-xs text-subtle">
                      (you chose this too)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="t-label mb-2 text-subtle">And declined, out loud</p>
            <ul className="space-y-2.5">
              {EXAMPLE_DECLINED.map((d) => (
                <li key={d.id}>
                  <span className="block text-sm font-medium text-fg">
                    {NAME_BY_ID.get(d.id) ?? d.id}
                  </span>
                  <span className="mt-0.5 block text-sm leading-6 text-muted">
                    {d.because}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-muted">
            A characteristic you never considered is not the same as one you
            rejected. Writing the declines down is what stops the list being
            three things that happened to come to mind.
          </p>
        </div>
      )}
    </Card>
  )
}
```

- [ ] **Step 7: Write `TraceForward`**

Create `web/src/features/architecture/TraceForward.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { CHARACTERISTICS, TRACE_ROWS } from './characteristics'

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * The doc's trace-forward table, as expand-to-reveal rather than a table:
 * every row's payload is a paragraph, which is the case `PATTERNS.md` names
 * this pattern for, and a three-column table at 320px is an overflow risk for
 * content that reflows perfectly well as prose.
 *
 * Each row links to the step where the decision it forces actually gets made.
 * That link is the section's argument in one gesture — the characteristic is
 * not a label, it is the reason a later step goes the way it does.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))

export function TraceForward() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {TRACE_ROWS.map((row) => {
          const open = openIds.has(row.characteristicId)
          const panelId = `trace-${row.characteristicId}`
          return (
            <li key={row.characteristicId}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(row.characteristicId)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">
                      {NAME_BY_ID.get(row.characteristicId) ??
                        row.characteristicId}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      forces a decision in {row.stepLabel}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <div
                  id={panelId}
                  className="border-t border-line bg-sunken px-5 py-4"
                >
                  <p className="text-sm leading-6 text-muted">{row.forces}</p>
                  <a
                    href={`#${row.stepId}`}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand lg:min-h-9"
                  >
                    Go to {row.stepLabel}
                    <ArrowRight className="size-3.5 shrink-0" aria-hidden />
                  </a>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        Every row is a decision this stage makes anyway. Choosing the
        characteristic first is what turns it from a preference into something
        with a reason attached. Which gives you the test: a characteristic that
        traces to no decision was not chosen, it was listed. If &ldquo;secure&rdquo;
        is on your list and nothing downstream changed because of it, delete it.
        It is doing no work, and it is crowding out one that would.
      </p>
    </Card>
  )
}
```

- [ ] **Step 8: Verify both render**

Run: `cd web && pnpm typecheck && pnpm lint`. Both must be clean; `lint` runs at
`--max-warnings 0`.

These components are not wired into a step until Task 18, so verify them by temporarily
rendering both at the top of the existing `reverse` step, checking in the browser at 320px and
1440px in both themes, then reverting that temporary edit before committing. Confirm
specifically: the cap message appears on a fifth click and not before, the picks survive a page
reload, and the `Go to Schema` link moves the stepper.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/architecture/characteristics-store.ts web/src/features/architecture/characteristics-store.test.ts web/src/features/architecture/CharacteristicPicker.tsx web/src/features/architecture/TraceForward.tsx
git commit -m "feat(architecture): build the characteristics picker and its trace

The picker is not scored, because the doc offers a set to choose from
rather than one to complete. The teeth are the cap: a fifth pick is
refused, not swapped in, and the refusal names the trades — which is the
only way a cap teaches anything rather than just annoying someone.

togglePick is pure so the cap behaviour is tested without a component
harness. The picks persist because step 04 asks the reader to run the
same trace against their own three.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: The styles landscape, as data

**Files:**
- Create: `web/src/features/architecture/styles.ts`
- Test: `web/src/features/architecture/styles.test.ts`

**Interfaces:**
- Consumes: `CHARACTERISTICS` from Task 7, for a cross-file invariant only.
- Produces:
  - `type DeploymentStyle = { id: string; name: string; summary: string; buys: string; costs: string; trueWhen: string }`
  - `const DEPLOYMENT_STYLES: DeploymentStyle[]` (four)
  - `const CHOSEN_STYLE_ID = 'modular-monolith'`
  - `type OrganisationStyle = { id: string; name: string; summary: string; body: string }`
  - `const ORGANISATION_STYLES: OrganisationStyle[]` (two)
  - `const ORGANISATION_QUESTION: string`
  - `type StyleTrace = { characteristicId: string; rules: string }` and `const STYLE_TRACE: StyleTrace[]` (three)

- [ ] **Step 1: Write the failing tests**

Create `web/src/features/architecture/styles.test.ts`:

```ts
import { expect, test } from 'vitest'
import { CHARACTERISTICS } from './characteristics'
import {
  CHOSEN_STYLE_ID,
  DEPLOYMENT_STYLES,
  ORGANISATION_QUESTION,
  ORGANISATION_STYLES,
  STYLE_TRACE,
} from './styles'

test('four deployment shapes are compared, because a comparison of one is advice taken on faith', () => {
  expect(DEPLOYMENT_STYLES).toHaveLength(4)
})

test('every deployment shape says what it buys, what it costs, and what would have to be true', () => {
  for (const s of DEPLOYMENT_STYLES) {
    expect(s.buys.trim().length, `${s.id} buys`).toBeGreaterThan(0)
    expect(s.costs.trim().length, `${s.id} costs`).toBeGreaterThan(0)
    expect(s.trueWhen.trim().length, `${s.id} trueWhen`).toBeGreaterThan(0)
  }
})

test('the style this stage teaches is one of the four it compares, so the conclusion is on the table with its alternatives', () => {
  expect(DEPLOYMENT_STYLES.map((s) => s.id)).toContain(CHOSEN_STYLE_ID)
})

test('the microservices row names its benefit as organisational, which is the row people adopt for the wrong reason', () => {
  const micro = DEPLOYMENT_STYLES.find((s) => s.id === 'microservices')
  expect(micro?.buys).toMatch(/team/i)
})

test('internal organisation is a separate axis with two options, since collapsing it into the deployment question is the bad question the doc names', () => {
  expect(ORGANISATION_STYLES).toHaveLength(2)
  expect(ORGANISATION_STYLES.map((s) => s.id)).toEqual(['layered', 'hexagonal'])
})

test('the organisation axis is decided on one stated question, not on taste', () => {
  expect(ORGANISATION_QUESTION.trim().length).toBeGreaterThan(0)
})

// The trace is what makes the choice follow from the characteristics rather
// than from taste. If a trace row names a characteristic that no longer
// exists, the two files have drifted and the argument has a hole in it.
test('every trace row names a real characteristic, so styles.ts and characteristics.ts cannot drift apart', () => {
  const ids = new Set(CHARACTERISTICS.map((c) => c.id))
  for (const t of STYLE_TRACE) {
    expect(ids, `trace names ${t.characteristicId}`).toContain(t.characteristicId)
  }
})

test('the trace covers three characteristics, matching the example pick it is derived from', () => {
  expect(STYLE_TRACE).toHaveLength(3)
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/styles.test.ts`
Expected: fails to collect, `Failed to resolve import "./styles"`.

- [ ] **Step 3: Write the module**

Create `web/src/features/architecture/styles.ts`:

```ts
/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * Two questions that usually get collapsed into one, kept apart here because
 * collapsing them is what makes "monolith or microservices" a bad question:
 * how the system deploys, and how it is organised inside. A hexagonal monolith
 * is an ordinary, sensible thing.
 */

export type DeploymentStyle = {
  id: string
  name: string
  /** One line, shown collapsed. */
  summary: string
  buys: string
  costs: string
  /** The condition under which this shape is the right answer. */
  trueWhen: string
}

export const DEPLOYMENT_STYLES: DeploymentStyle[] = [
  {
    id: 'monolith',
    name: 'Monolith',
    summary: 'One process, one deploy.',
    buys: 'One process and one deploy. Refactoring across the whole system is a rename, and there is one place to look when it breaks.',
    costs:
      'Everything scales together, and one bad deploy takes all of it down at once.',
    trueWhen: 'Almost anything, starting out.',
  },
  {
    id: 'modular-monolith',
    name: 'Modular monolith',
    summary: 'The above, plus seams that make a later split mechanical.',
    buys: 'Everything the monolith buys, plus boundaries that make extracting a service later a mechanical job rather than an archaeology project.',
    costs:
      'The boundaries hold by discipline. Nothing at runtime enforces them, so the rule is only as good as the last time somebody was in a hurry.',
    trueWhen:
      'You expect the system to outlive your first guess at its shape, which is most systems anyone keeps.',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    summary: 'Independent deploys, for teams that need them.',
    buys: 'Independent deploys, independent scaling, and team autonomy. Read that list again: every item on it is organisational. Independent deploys matter when the alternative is four teams negotiating a release. Alone, you are negotiating with yourself, and you will win.',
    costs:
      'Network failure modes, distributed debugging, and consistency across separate stores. These are technical, and they arrive on day one.',
    trueWhen:
      'Separate teams need to ship without coordinating with each other.',
  },
  {
    id: 'serverless',
    name: 'Serverless',
    summary: 'No servers to keep alive; scales to zero.',
    buys: 'Nothing to keep alive, scaling to zero, and a bill that tracks invocations rather than uptime.',
    costs:
      'Cold starts, execution limits, and anything that does not fit the shape of a request and a response.',
    trueWhen:
      'Load is spiky or close to zero, and the work fits inside the limits.',
  },
]

/** What this stage teaches, and it is worth having the name. */
export const CHOSEN_STYLE_ID = 'modular-monolith'

export type OrganisationStyle = {
  id: string
  name: string
  summary: string
  body: string
}

/**
 * Independent of the deployment shape above: both are compatible with every
 * row of it. This is the axis the stage's own advice lives on, which is why
 * the next two sections are about structure inside one application.
 */
export const ORGANISATION_STYLES: OrganisationStyle[] = [
  {
    id: 'layered',
    name: 'Layered',
    summary: 'Routes call services call repositories.',
    body: 'Familiar and easy to explain, which is worth more than it sounds. Its failure mode is a bottom layer that everything reaches through, at which point the layers describe the imports rather than the design. Start here, and extract ports where a piece of logic gets hard to test.',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal (ports and adapters)',
    summary: 'The domain defines interfaces; everything else plugs in.',
    body: 'The domain logic defines the interfaces, and the database, HTTP and third parties plug into them. More indirection, and the payoff is a core you can test without any of them running. If your logic is mostly validate, write, read back, this is ceremony around a thin middle.',
  },
]

/**
 * The doc decides between them on exactly this, rather than on taste. Going
 * from layered to hexagonal is an extraction; going the other way is a rewrite.
 */
export const ORGANISATION_QUESTION =
  'How much of your logic is worth testing without the database running?'

export type StyleTrace = {
  characteristicId: string
  /** What that characteristic rules in or out, and why. */
  rules: string
}

/**
 * The choice follows from the characteristics, not from taste. Run the same
 * trace against your own three: if it produces a different answer than the next
 * section, the next section is wrong for your system, and you should be able to
 * say why.
 */
export const STYLE_TRACE: StyleTrace[] = [
  {
    characteristicId: 'cheap-to-run',
    rules:
      'Rules out microservices, whose costs are paid per service regardless of load, and makes serverless a deployment detail rather than an architecture.',
  },
  {
    characteristicId: 'correctness',
    rules:
      'Favours one database with real constraints over consistency maintained by hand across several.',
  },
  {
    characteristicId: 'auditability',
    rules:
      'Is easier where every write goes through one place, which is an argument for the boundaries in the next section rather than against them.',
  },
]
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/styles.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Teeth check**

Change one `STYLE_TRACE` entry's `characteristicId` to `'cost'` (a plausible-looking id that
does not exist). Confirm only the cross-file test fails and that its message names `cost`.
That is the drift this test exists for. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/styles.ts web/src/features/architecture/styles.test.ts
git commit -m "feat(architecture): add the styles landscape as data

Four deployment shapes and two internal organisations, kept on separate
axes because collapsing them is what makes 'monolith or microservices' a
bad question. A hexagonal monolith is an ordinary thing.

STYLE_TRACE is tested against characteristics.ts by id, so the argument
that the modular monolith follows from the characteristics cannot quietly
lose the characteristic it follows from.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: The styles components

**Files:**
- Create: `web/src/features/architecture/DeploymentStyles.tsx`
- Create: `web/src/features/architecture/InternalOrganisation.tsx`
- Create: `web/src/features/architecture/YourCharacteristics.tsx`

**Interfaces:**
- Consumes: everything from Task 9; `CHARACTERISTICS` from Task 7; `CHARACTERISTICS_KEY` and
  `NO_PICKS` from Task 8.
- Produces: `<DeploymentStyles />`, `<InternalOrganisation />`, `<YourCharacteristics />`, all
  prop-less. Task 18 renders all three in step 04.

**Implementation-only.** All three render data that Task 9 already tests. Do not add exports
purely to create a test surface.

`InternalOrganisation` is deliberately **not** scored. Under D-49 a step carries at most one
committed exercise, and step 04's is `SplitTrigger`. It is also honest to the doc, which
presents the two organisations as a landscape to know rather than a judgment to commit to.

- [ ] **Step 1: Write `DeploymentStyles`**

Create `web/src/features/architecture/DeploymentStyles.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { CHOSEN_STYLE_ID, DEPLOYMENT_STYLES } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * The doc's four-column table, as expand-to-reveal. A four-column comparison
 * does not survive 320px: it either scrolls sideways, which hides the column
 * that carries the decision, or it shrinks the type below readable. Every
 * cell here is a sentence rather than a value, which is the case
 * `PATTERNS.md` names expand-to-reveal for.
 *
 * The chosen row is marked, and marked with `brand` rather than `go`. It is
 * "you are here", not "this one is correct" — the whole point of the section
 * is that a different set of characteristics picks a different row.
 */

export function DeploymentStyles() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {DEPLOYMENT_STYLES.map((style) => {
          const open = openIds.has(style.id)
          const chosen = style.id === CHOSEN_STYLE_ID
          const panelId = `style-${style.id}`
          return (
            <li key={style.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(style.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{style.name}</span>
                      {chosen && (
                        <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
                          what this stage teaches
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {style.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <div
                  id={panelId}
                  className="space-y-3 border-t border-line bg-sunken px-5 py-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blueprint">
                      What it buys
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {style.buys}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                      What it costs
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {style.costs}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                      What would have to be true
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {style.trueWhen}
                    </p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        The microservices row is the one people adopt for the wrong reason. What
        it buys is organisational; what it costs is technical and arrives on day
        one. Alone you pay the full price for none of the return.
      </p>
    </Card>
  )
}
```

- [ ] **Step 2: Write `InternalOrganisation`**

Create `web/src/features/architecture/InternalOrganisation.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { ORGANISATION_QUESTION, ORGANISATION_STYLES } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * Deliberately a reveal and not a scorer. Two reasons, and the second matters
 * more: D-49 gives a step at most one committed exercise and step 04's is
 * `SplitTrigger`; and the doc presents these two as a landscape to know
 * rather than a judgment with a defensible answer, so scoring them would
 * invent a right answer the source does not have.
 *
 * The question is shown before either option, because the question is the
 * content. A reader who takes away only "decide it on how much logic is worth
 * testing without the database" has taken away the section.
 */

export function InternalOrganisation() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card>
      <p className="text-sm font-medium">Choose between them on one question</p>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
        {ORGANISATION_QUESTION}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        If the answer is &ldquo;most of it&rdquo; — pricing rules, eligibility,
        anything with branches you care about — hexagonal pays for its
        indirection. If it is mostly validate, write, read back, layered is
        honest.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ORGANISATION_STYLES.map((style) => {
          const open = openId === style.id
          const panelId = `org-${style.id}`
          return (
            <div key={style.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : style.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={[
                  'flex min-h-11 w-full flex-col items-start justify-center border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                  open
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-raised hover:border-line-strong',
                ].join(' ')}
              >
                <span className="text-sm font-medium text-fg">
                  {style.name}
                </span>
                <span className="mt-0.5 text-sm leading-6 text-muted">
                  {style.summary}
                </span>
              </button>
              {open && (
                <p
                  id={panelId}
                  className="mt-2 border border-line bg-sunken p-3.5 text-sm leading-6 text-muted"
                >
                  {style.body}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
        Both are compatible with every deployment shape above. Start layered and
        extract ports where a piece of logic gets hard to test — that direction
        is an extraction, and the other one is a rewrite.
      </p>
    </Card>
  )
}
```

- [ ] **Step 3: Write `YourCharacteristics`**

Create `web/src/features/architecture/YourCharacteristics.tsx`:

```tsx
'use client'

import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { CHARACTERISTICS } from './characteristics'
import { CHARACTERISTICS_KEY, NO_PICKS } from './characteristics-store'
import { STYLE_TRACE } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take" — "Run the
 * same trace against your own three."
 *
 * Read-only by construction, the same way `ArchCarryForward` is: this
 * destructures `value` only, so `setValue` and `reset` are never called and
 * step 02's key cannot be written from here. Reading through the same hook
 * step 02 writes with, rather than a one-shot localStorage read in the render
 * body, is also what avoids a hydration mismatch.
 *
 * With no picks it says so and links back rather than rendering an empty box.
 * A reader who skipped step 02 is told what they skipped and why it mattered,
 * which is more useful than a blank.
 */

const NAME_BY_ID = new Map(CHARACTERISTICS.map((c) => [c.id, c.name]))
const TRACED = new Set(STYLE_TRACE.map((t) => t.characteristicId))

export function YourCharacteristics() {
  const { value: picks } = useLocalStorage<string[]>(
    CHARACTERISTICS_KEY,
    NO_PICKS,
  )

  if (picks.length === 0) {
    return (
      <Card>
        <p className="text-sm leading-6 text-muted">
          You have not chosen characteristics yet.{' '}
          <a href="#require" className="text-brand">
            Go back to Require
          </a>{' '}
          and pick three or four. This section&rsquo;s conclusion is derived from
          them, so without them it is a preference you are being asked to take on
          trust.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <p className="t-label mb-3 text-subtle">Your three, traced</p>
      <ul className="space-y-2.5">
        {picks.map((id) => {
          const trace = STYLE_TRACE.find((t) => t.characteristicId === id)
          return (
            <li key={id} className="border-l-2 border-line pl-3.5">
              <p className="text-sm font-medium text-fg">
                {NAME_BY_ID.get(id) ?? id}
              </p>
              <p className="mt-0.5 text-sm leading-6 text-muted">
                {trace
                  ? trace.rules
                  : 'The worked example does not trace this one. Do it yourself: what does it rule in, and what does it rule out? If the answer is nothing, it was listed rather than chosen.'}
              </p>
            </li>
          )
        })}
      </ul>

      {picks.some((id) => !TRACED.has(id)) && (
        <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
          At least one of your picks is not in the worked trace, which is the
          normal case and the useful one. If it produces a different answer than
          this section, this section is wrong for your system, and you should be
          able to say why.
        </p>
      )}
    </Card>
  )
}
```

- [ ] **Step 4: Verify**

Run: `cd web && pnpm typecheck && pnpm lint`.

In the browser, check all three temporarily rendered in an existing step, at 320px and 1440px,
both themes. Specifically confirm: `YourCharacteristics` shows the empty state with
localStorage cleared, then shows the traced list after picking in step 02, and that a pick
outside the worked trace produces the closing note. Revert the temporary wiring before
committing.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/architecture/DeploymentStyles.tsx web/src/features/architecture/InternalOrganisation.tsx web/src/features/architecture/YourCharacteristics.tsx
git commit -m "feat(architecture): build the styles landscape components

The four-shape comparison is expand-to-reveal rather than the doc's
four-column table, because four columns at 320px either scroll sideways
and hide the deciding column or shrink below readable.

InternalOrganisation is a reveal, not a scorer: D-49 allows one committed
exercise per step and step 04's is SplitTrigger, and the doc presents the
two organisations as a landscape rather than a judgment with a right
answer.

YourCharacteristics closes the loop the doc opens — run the same trace
against your own three — and is read-only by construction.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Generalise `SchemaInspector`

**Files:**
- Modify: `web/src/features/architecture/SchemaInspector.tsx:87-138`

**Interfaces:**
- Consumes: `SchemaLine` from `./scoring` (unchanged).
- Produces the new signature every later SQL block uses:

```ts
export function SchemaInspector(props: {
  lines: SchemaLine[]
  /** Names the block for both aria-labels, e.g. "the invoices table". */
  title: string
  emptyHint?: string
}): JSX.Element
```

**Implementation-only.** This is a refactor with no behaviour change; the existing render is
already covered by the audit suite. Tasks 14, 17 and 18 all depend on it, which is why it lands
before them rather than as part of the schema step.

The round adds three more SQL blocks (the two indexes, the partial unique index, the tenancy
tables) and one outside the schema step entirely (`processed_events`, in the sketch). Three
near-identical copies of a 138-line component is the wrong answer; the block's identity is its
data, not its rendering.

- [ ] **Step 1: Change the signature**

Replace the `SchemaInspector` function (everything from `export function SchemaInspector()` to
the end of the file) with:

```tsx
export function SchemaInspector({
  lines,
  title,
  emptyHint = 'Select a line to see what it buys.',
}: {
  lines: SchemaLine[]
  title: string
  emptyHint?: string
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedLine = lines.find((l) => l.id === selectedId) ?? null

  return (
    <Card>
      <div
        tabIndex={0}
        aria-label={`${title}, scrolls horizontally`}
        className="overflow-x-auto border border-line bg-sunken py-2"
      >
        <div
          role="radiogroup"
          aria-label={`Annotated lines of ${title}`}
          className="min-w-max"
        >
          {lines.map((line) => (
            <SchemaRow
              key={line.id}
              line={line}
              selected={selectedId === line.id}
              onSelect={() => setSelectedId(line.id)}
            />
          ))}
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-4 min-h-24 border border-line bg-raised p-4"
      >
        {selectedLine?.note ? (
          <>
            <span className="inline-block bg-brand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-fg">
              {fieldName(selectedLine.sql)}
            </span>
            <p className="t-data mt-2.5 whitespace-pre-wrap text-[13px] text-fg">
              {selectedLine.sql}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              {selectedLine.note}
            </p>
          </>
        ) : (
          <p className="text-sm text-subtle">{emptyHint}</p>
        )}
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: Drop the now-unused import**

`SCHEMA_LINES` is no longer referenced in this file. Change the import at the top to:

```ts
import { type SchemaLine } from './scoring'
```

Leaving it imported fails `lint` at `--max-warnings 0`.

- [ ] **Step 3: Update the doc comment**

The comment at the top says "The doc's CREATE TABLE block". It now renders four different
blocks. Replace the first paragraph with:

```
 * An annotated SQL block: rendered from data rather than pasted as text, so
 * each line can explain what it buys rather than what it says. Four blocks in
 * this stage use it — the invoices table, the two indexes, the partial unique
 * index, and processed_events in the sketch — which is why the lines arrive as
 * a prop rather than being imported here.
```

Keep the rest of the comment: the 320px reasoning, the structural-lines rule, and the note that
`brand` is the only accent because none of these constraints is right or wrong.

- [ ] **Step 4: Fix the one existing call site**

In `Architecture.tsx`, the `constrain` step renders `<SchemaInspector />`. Change it to:

```tsx
<SchemaInspector lines={SCHEMA_LINES} title="the invoices table" />
```

and add `SCHEMA_LINES` to that file's import from `./scoring`. (`Architecture.tsx` is rebuilt in
Task 19; this keeps the tree green in the meantime, which is the point of fixing it now.)

- [ ] **Step 5: Verify**

Run: `cd web && pnpm typecheck && pnpm lint && pnpm test`
Expected: all clean. Then load `#constrain` and confirm the inspector behaves exactly as before:
structural lines inert, annotated lines selectable, panel updating.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/SchemaInspector.tsx web/src/features/architecture/Architecture.tsx
git commit -m "refactor(architecture): SchemaInspector takes its lines as a prop

The round adds three more annotated SQL blocks and one outside the schema
step entirely. The block's identity is its data, not its rendering, so
three copies of a 138-line component is the wrong answer.

No behaviour change. Both aria-labels are derived from the new title prop
so two inspectors on one step are distinguishable to a screen reader.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: The system sketch, as data

**Files:**
- Create: `web/src/features/architecture/sketch.ts`
- Test: `web/src/features/architecture/sketch.test.ts`

**Interfaces:**
- Consumes: `SchemaLine` from `./scoring`.
- Produces:
  - `type SketchNode = { id: string; name: string; kind: 'actor' | 'yours' | 'store' | 'external' | 'scheduled'; does: string; edge: string; whenDown?: string }`
  - `const SKETCH_NODES: SketchNode[]` (seven)
  - `type C4Level = { id: string; name: string; what: string; draw: boolean; note: string }` and `const C4_LEVELS: C4Level[]` (four)
  - `type FlowStep = { n: number; event: string; consequence: string; kind: 'sync' | 'async' | 'local' }` and `const FLOW_STEPS: FlowStep[]` (five)
  - `type SyncAsyncRow = { id: string; question: string; sync: string; async: string }` and `const SYNC_ASYNC_ROWS: SyncAsyncRow[]` (four)
  - `const PROCESSED_EVENTS_LINES: SchemaLine[]`

- [ ] **Step 1: Write the failing tests**

Create `web/src/features/architecture/sketch.test.ts`:

```ts
import { expect, test } from 'vitest'
import {
  C4_LEVELS,
  FLOW_STEPS,
  PROCESSED_EVENTS_LINES,
  SKETCH_NODES,
  SYNC_ASYNC_ROWS,
} from './sketch'

// The whole return on drawing the sketch is the question it forces: for each
// box that is not yours, what happens when it is down? A node that ships with
// a description and no failure mode is the failure this component exists to
// stop, so it fails here rather than in review.
test('every external system answers what happens when it is down, which is the only reason the diagram pays for itself', () => {
  for (const n of SKETCH_NODES) {
    if (n.kind !== 'external') continue
    expect(
      n.whenDown?.trim().length ?? 0,
      `${n.id} has no failure answer`,
    ).toBeGreaterThan(0)
  }
})

test('there are three external systems, matching the three answers the doc works through', () => {
  expect(SKETCH_NODES.filter((n) => n.kind === 'external')).toHaveLength(3)
})

test('the sketch is more than the application and its database, which is the objection the section answers', () => {
  expect(SKETCH_NODES.length).toBeGreaterThan(3)
})

test('every node says what it does and how it connects, so no box is unexplained', () => {
  for (const n of SKETCH_NODES) {
    expect(n.does.trim().length, `${n.id} does`).toBeGreaterThan(0)
    expect(n.edge.trim().length, `${n.id} edge`).toBeGreaterThan(0)
  }
})

test('node ids are unique, since selection is keyed by id', () => {
  expect(new Set(SKETCH_NODES.map((n) => n.id)).size).toBe(SKETCH_NODES.length)
})

test('C4 has four levels and two of them are worth drawing, which is the advice rather than the trivia', () => {
  expect(C4_LEVELS).toHaveLength(4)
  expect(C4_LEVELS.filter((l) => l.draw)).toHaveLength(2)
})

test('the drawn levels are context and container, not the two below them', () => {
  expect(C4_LEVELS.filter((l) => l.draw).map((l) => l.id)).toEqual([
    'context',
    'container',
  ])
})

test('the flow runs five numbered steps in order, because it is drawn end to end or it is not drawn', () => {
  expect(FLOW_STEPS.map((s) => s.n)).toEqual([1, 2, 3, 4, 5])
})

test('the flow crosses both integration styles, which is what makes it the flow worth picking', () => {
  const kinds = new Set(FLOW_STEPS.map((s) => s.kind))
  expect(kinds).toContain('sync')
  expect(kinds).toContain('async')
})

test('the sync/async comparison answers four questions on both sides', () => {
  expect(SYNC_ASYNC_ROWS).toHaveLength(4)
  for (const r of SYNC_ASYNC_ROWS) {
    expect(r.sync.trim().length, `${r.id} sync`).toBeGreaterThan(0)
    expect(r.async.trim().length, `${r.id} async`).toBeGreaterThan(0)
  }
})

test('the idempotency block annotates its primary key, since that is the line doing the work', () => {
  const pk = PROCESSED_EVENTS_LINES.find((l) => l.id === 'pk')
  expect(pk?.note?.trim().length ?? 0).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: fails to collect, `Failed to resolve import "./sketch"`.

- [ ] **Step 3: Write the module**

Create `web/src/features/architecture/sketch.ts`:

```ts
/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * The objection this section answers: if the answer is one application and one
 * database, the diagram is two boxes and a line. That is right about the
 * application and wrong about the system. Your application is one box; your
 * system takes payments, sends email, stores PDFs, and needs something to
 * notice an overdue invoice.
 *
 * `whenDown` is required on every external node by test, not by type, because
 * the failure question is the entire return on drawing this.
 */

import { type SchemaLine } from './scoring'

export type SketchNode = {
  id: string
  name: string
  kind: 'actor' | 'yours' | 'store' | 'external' | 'scheduled'
  does: string
  /** How it connects, written the way the container view labels an arrow. */
  edge: string
  /** Required on externals: what happens when this is down. */
  whenDown?: string
}

export const SKETCH_NODES: SketchNode[] = [
  {
    id: 'user',
    name: 'User',
    kind: 'actor',
    does: 'Creates invoices, sends them, and looks at whether they have been paid.',
    edge: 'browses the app over HTTPS',
  },
  {
    id: 'app',
    name: 'Next.js app',
    kind: 'yours',
    does: 'The only box you write code in. Everything else on this diagram is somebody else’s, which is the point of drawing it.',
    edge: 'the centre of the diagram',
  },
  {
    id: 'postgres',
    name: 'Postgres',
    kind: 'store',
    does: 'Holds every row, and is the source of truth for all of it. That last part is a design property, and the blob-storage answer below depends on it.',
    edge: 'app reads and writes, over a pooled connection',
  },
  {
    id: 'payments',
    name: 'Payment provider',
    kind: 'external',
    does: 'Takes the money, then tells you about it later over a webhook. You call it synchronously to charge; it calls you back asynchronously when the payment succeeds.',
    edge: 'app charges → provider; provider webhooks → app',
    whenDown:
      'Invoices still send, and payment reconciles late. Survivable, and it needs no code — which is worth knowing before you build a retry queue for it.',
  },
  {
    id: 'email',
    name: 'Email provider',
    kind: 'external',
    does: 'Delivers the invoice. Called synchronously on send, so if it fails the user finds out immediately.',
    edge: 'app sends → provider',
    whenDown:
      'This one is a decision, and the diagram is what forced it. The invoice must not be lost because the send failed. Either retry, or record the intent and send later — but pick one, because the default is losing the invoice.',
  },
  {
    id: 'blob',
    name: 'Blob storage',
    kind: 'external',
    does: 'Holds the rendered PDF of each invoice.',
    edge: 'app renders and stores → storage',
    whenDown:
      'An inconvenience rather than data loss, because PDFs are regenerable from the invoice row. That is only true because the row is the source of truth, which is a design property worth having noticed rather than assumed.',
  },
  {
    id: 'scheduled',
    name: 'Scheduled job',
    kind: 'scheduled',
    does: 'Runs daily, looks for sent invoices past their due date, and emails a reminder. It sends; it does not write a status. “Overdue” is computed, per the interrogation in Model.',
    edge: 'runs on a schedule; see 11 — CI/CD for where it lives',
  },
]

export type C4Level = {
  id: string
  name: string
  what: string
  /** Whether one person should actually draw it. */
  draw: boolean
  note: string
}

/** Four levels; draw two. */
export const C4_LEVELS: C4Level[] = [
  {
    id: 'context',
    name: 'Context',
    what: 'Your system and the world around it.',
    draw: true,
    note: 'Often folded into the container view, because the container view already carries the user and the external systems. Draw it separately once the outside world gets busy enough that mixing the two makes either unreadable.',
  },
  {
    id: 'container',
    name: 'Container',
    what: 'The deployable things inside your system.',
    draw: true,
    note: 'The one that pays for itself. It is where the external systems appear, and therefore where the failure question can be asked at all.',
  },
  {
    id: 'component',
    name: 'Component',
    what: 'The pieces inside one container.',
    draw: false,
    note: 'Worth drawing for the one subsystem complicated enough that you keep re-deriving how it fits together. Not for the rest.',
  },
  {
    id: 'code',
    name: 'Code',
    what: 'Classes, functions, the call graph.',
    draw: false,
    note: 'What your editor already draws, on demand, and more accurately than you would.',
  },
]

export type FlowStep = {
  n: number
  event: string
  consequence: string
  kind: 'sync' | 'async' | 'local'
}

/**
 * Pick the flow that crosses the most boundaries, because that is where the
 * design decisions hide. Steps 2 and 4 are different in kind, and that
 * difference is the decision the sync/async comparison poses.
 */
export const FLOW_STEPS: FlowStep[] = [
  {
    n: 1,
    event: 'User clicks “send”',
    consequence:
      'The app writes status = ‘sent’ and calls the email provider.',
    kind: 'local',
  },
  {
    n: 2,
    event: 'Email provider accepts',
    consequence:
      'Synchronous. If it fails, the user finds out now, which is the property you are buying.',
    kind: 'sync',
  },
  {
    n: 3,
    event: 'Client pays, days later',
    consequence:
      'The payment provider fires a webhook at your app. Nothing in your system initiated this.',
    kind: 'local',
  },
  {
    n: 4,
    event: 'App receives the webhook',
    consequence:
      'Asynchronous, and not by your choice. Nobody is waiting, and it may arrive twice.',
    kind: 'async',
  },
  {
    n: 5,
    event: 'App writes status = ‘paid’',
    consequence:
      'Must be safe to run twice. That is idempotency, and on a payment flow it is not optional.',
    kind: 'async',
  },
]

export type SyncAsyncRow = {
  id: string
  question: string
  sync: string
  async: string
}

export const SYNC_ASYNC_ROWS: SyncAsyncRow[] = [
  {
    id: 'learn',
    question: 'You learn about failure',
    sync: 'Immediately, inside the request.',
    async: 'Later, or never, unless you go looking.',
  },
  {
    id: 'waits',
    question: 'The caller waits',
    sync: 'Yes.',
    async: 'No.',
  },
  {
    id: 'fails-by',
    question: 'It fails by',
    sync: 'The callee being down, or slow.',
    async: 'The message being lost, delayed, or delivered twice.',
  },
  {
    id: 'needs',
    question: 'It needs',
    sync: 'A timeout and a retry policy.',
    async: 'Idempotency, and somewhere to put what failed.',
  },
]

/**
 * Making something idempotent is a schema decision, which is why it belongs in
 * this stage rather than in implementation.
 */
export const PROCESSED_EVENTS_LINES: SchemaLine[] = [
  { id: 'open', sql: 'CREATE TABLE processed_events (', indent: 0 },
  {
    id: 'provider',
    sql: 'provider   text NOT NULL,',
    indent: 1,
    note: 'Which sender this id came from. Two providers can issue the same event id without either being wrong, so the id alone is not unique and the pair is.',
  },
  {
    id: 'event-id',
    sql: 'event_id   text NOT NULL,',
    indent: 1,
    note: 'The id the sender gave the event. You store it rather than deriving one, because the sender is the only party who knows that two deliveries are the same delivery.',
  },
  {
    id: 'handled-at',
    sql: 'handled_at timestamptz NOT NULL DEFAULT now(),',
    indent: 1,
    note: 'Not load-bearing for correctness, and worth having anyway: when a duplicate storm happens you will want to know when you first saw the event.',
  },
  {
    id: 'pk',
    sql: 'PRIMARY KEY (provider, event_id)',
    indent: 1,
    note: 'The line doing all the work. Insert this row first and do the work second, both in one transaction: the second delivery fails the primary key, the transaction rolls back, and nothing happens twice. Order matters as soon as “the work” reaches outside the database, which is the case being taught here.',
  },
  { id: 'close', sql: ');', indent: 0 },
]
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/sketch.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Teeth check**

Delete `whenDown` from the `email` node. Confirm only the first test fails and that its message
names `email`. That node's failure answer is the one the doc calls a genuine piece of work you
would otherwise have discovered in production, so losing it silently is exactly the defect worth
catching. Restore, then set `draw: true` on `component` and confirm both C4 tests fail. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/sketch.ts web/src/features/architecture/sketch.test.ts
git commit -m "feat(architecture): add the system sketch as data

Seven nodes, the four C4 levels with the two worth drawing marked, the
five-step payment flow, the sync/async comparison, and processed_events
as an annotated block.

whenDown is required on every external node by test rather than by type,
because the failure question is the entire return on drawing the sketch.
A node with a description and no failure answer now fails the suite.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: The container view as a click-node inspector

**Files:**
- Create: `web/src/features/architecture/SystemSketch.tsx`

**Interfaces:**
- Consumes: `SKETCH_NODES`, `SketchNode` from Task 12.
- Produces: `<SystemSketch />`, prop-less. Task 19 renders it in step 05.

**Implementation-only.** The judgment it carries is `SKETCH_NODES`, tested in Task 12.

Every external box is selectable, and its panel answers both what it does and what happens when
it is down. Folding the failure question into the diagram rather than listing it separately is
the doc's own argument: the diagram is what forces the question.

- [ ] **Step 1: Write the component**

Create `web/src/features/architecture/SystemSketch.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { SKETCH_NODES, type SketchNode } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * A grouped, selectable node map rather than an arrow diagram, for the reason
 * `BoundaryMap` records in this same stage: at 320px an arrow's direction is
 * the first thing to become illegible, and here the direction is content —
 * you call the payment provider, it calls you back. So every connection is
 * written out as text on the node, which survives any width, and the grouping
 * carries what a diagram's layout would have.
 *
 * The grouping is the claim the section makes: your application is one box,
 * your system is not. "Yours" holds two nodes and "not yours" holds four, and
 * a reader who notices that ratio has taken the point.
 *
 * Selecting an external node answers two questions, not one. What it does is
 * ordinary documentation; what happens when it is down is the decision the
 * diagram exists to force, and one of the three answers is real work you would
 * otherwise meet in production.
 *
 * External nodes are marked with a dashed border as well as a group heading,
 * so "not yours" is never carried by position alone. No semantic colour: none
 * of these boxes is wrong.
 */

const GROUPS: { id: string; heading: string; kinds: SketchNode['kind'][] }[] = [
  { id: 'actor', heading: 'Who uses it', kinds: ['actor'] },
  { id: 'yours', heading: 'Yours to write', kinds: ['yours', 'store'] },
  { id: 'theirs', heading: 'Not yours, and fails on its own schedule', kinds: ['external'] },
  { id: 'clock', heading: 'Runs without anyone asking', kinds: ['scheduled'] },
]

export function SystemSketch() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = SKETCH_NODES.find((n) => n.id === selectedId) ?? null

  return (
    <Card>
      <div className="space-y-4">
        {GROUPS.map((group) => {
          const nodes = SKETCH_NODES.filter((n) => group.kinds.includes(n.kind))
          if (nodes.length === 0) return null
          return (
            <div key={group.id}>
              <p className="t-label mb-2 text-subtle">{group.heading}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {nodes.map((node) => {
                  const on = node.id === selectedId
                  const external = node.kind === 'external'
                  return (
                    <button
                      key={node.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelectedId(node.id)}
                      className={[
                        'flex min-h-11 w-full flex-col items-start justify-center border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                        external ? 'border-dashed' : '',
                        on
                          ? 'border-brand bg-brand-tint'
                          : 'border-line bg-raised hover:border-line-strong',
                      ].join(' ')}
                    >
                      <span className="text-sm font-medium text-fg">
                        {node.name}
                      </span>
                      <span className="t-data mt-0.5 text-[12px] leading-5 text-subtle">
                        {node.edge}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Four of these six boxes are not yours. Select one to see what it does
        and, for the external ones, what happens when it is down.
      </p>

      <div
        aria-live="polite"
        className="mt-3 min-h-32 border border-line bg-raised p-4"
      >
        {selected ? (
          <>
            <span className="inline-block bg-brand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-fg">
              {selected.name}
            </span>
            <p className="mt-2.5 text-sm leading-6 text-muted">
              {selected.does}
            </p>
            {selected.whenDown && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                  When it is down
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {selected.whenDown}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-subtle">
            Select a box to see what it does.
          </p>
        )}
      </div>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
        Three external systems, three answers, one of which is a genuine piece
        of work you would otherwise have discovered in production. That is the
        return on a diagram.
      </p>
    </Card>
  )
}
```

- [ ] **Step 2: Verify**

Run: `cd web && pnpm typecheck && pnpm lint`.

Render it temporarily inside an existing step and check at 320px, 768px and 1440px in both
themes. Confirm the three-column grid collapses cleanly, the dashed border is visible in both
themes, and the panel's minimum height stops the layout jumping when a node with no `whenDown`
is selected after one that has it. Revert the temporary wiring.

- [ ] **Step 3: Commit**

```bash
git add web/src/features/architecture/SystemSketch.tsx
git commit -m "feat(architecture): build the container view as a click-node inspector

Selecting an external box answers both what it does and what happens when
it is down, rather than listing the failure modes separately. That is the
doc's own argument: the diagram is what forces the question.

Grouped nodes rather than an arrow diagram, for the reason BoundaryMap
already records in this stage — at 320px arrow direction is the first
thing to go, and here direction is content. The grouping carries the
claim: your application is one box, your system is not.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: The flow, the fork, and idempotency

**Files:**
- Create: `web/src/features/architecture/DataFlow.tsx`
- Create: `web/src/features/architecture/SyncAsync.tsx`
- Create: `web/src/features/architecture/IdempotencyBlock.tsx`

**Interfaces:**
- Consumes: `FLOW_STEPS`, `SYNC_ASYNC_ROWS`, `PROCESSED_EVENTS_LINES` from Task 12;
  `SchemaInspector` with its Task 11 signature.
- Produces: `<DataFlow />`, `<SyncAsync />`, `<IdempotencyBlock />`, all prop-less. Task 19
  renders all three in step 05.

**Implementation-only.**

- [ ] **Step 1: Write `DataFlow`**

Create `web/src/features/architecture/DataFlow.tsx`:

```tsx
import { Card } from '@/components/ui'
import { FLOW_STEPS } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * One data flow, drawn end to end: the flow that crosses the most boundaries,
 * because that is where the design decisions hide.
 *
 * The kind badge is the payload. Steps 2 and 4 look alike in a numbered list
 * and are different in kind, and that difference is the decision the next
 * component poses. Labelling every step — including the three that are neither
 * — is what makes the two that are stand out without colour doing the work.
 *
 * A server component: nothing here is interactive.
 */

const KIND_LABEL: Record<string, string> = {
  sync: 'synchronous',
  async: 'asynchronous',
  local: 'your app',
}

export function DataFlow() {
  return (
    <Card>
      <ol className="space-y-3">
        {FLOW_STEPS.map((step) => (
          <li key={step.n} className="flex gap-3.5">
            <span
              className="t-data shrink-0 pt-0.5 text-[11px] text-brand"
              aria-hidden
            >
              {`0${step.n}`}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-fg">
                  {step.event}
                </span>
                <span className="border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                  {KIND_LABEL[step.kind]}
                </span>
              </span>
              <span className="mt-0.5 block text-sm leading-6 text-muted">
                {step.consequence}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
        Steps 2 and 4 are different in kind, and the difference is a decision
        the stage has not posed yet.
      </p>
    </Card>
  )
}
```

- [ ] **Step 2: Write `SyncAsync`**

Create `web/src/features/architecture/SyncAsync.tsx`:

```tsx
import { Callout, Card } from '@/components/ui'
import { SYNC_ASYNC_ROWS } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * The doc's two-column table, stacked per question rather than rendered as a
 * table: a two-column comparison plus a row label is three columns at 320px,
 * and the row label is the part that cannot be dropped. Each question stacks
 * on mobile and sits side by side from `sm` up.
 *
 * The closing callout is the rule that catches people, and it is a `warn`
 * rather than an `info` because it is the one place in this step where getting
 * it wrong loses money rather than tidiness.
 *
 * A server component: nothing here is interactive.
 */

export function SyncAsync() {
  return (
    <Card>
      <ul className="space-y-3">
        {SYNC_ASYNC_ROWS.map((row) => (
          <li key={row.id} className="border border-line bg-sunken p-3.5">
            <p className="text-sm font-medium text-fg">{row.question}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <p className="t-label text-subtle">Synchronous</p>
                <p className="mt-0.5 text-sm leading-6 text-muted">
                  {row.sync}
                </p>
              </div>
              <div>
                <p className="t-label text-subtle">Asynchronous</p>
                <p className="mt-0.5 text-sm leading-6 text-muted">
                  {row.async}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Callout kind="warn" title="For anything you receive, you do not get to choose">
          A payment webhook is asynchronous because somebody else decided it is.
          It will be delivered twice eventually, and the write it triggers has to
          be safe when that happens. Choose synchronous by default for work you
          initiate; reach for asynchronous when the caller genuinely should not
          wait, and accept that you have bought a failure mode you now have to
          watch.
        </Callout>
      </div>
    </Card>
  )
}
```

- [ ] **Step 3: Write `IdempotencyBlock`**

Create `web/src/features/architecture/IdempotencyBlock.tsx`:

```tsx
import { Callout } from '@/components/ui'
import { SchemaInspector } from './SchemaInspector'
import { PROCESSED_EVENTS_LINES } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * Idempotency as an annotated artifact rather than prose, because the lesson
 * is which line carries it: the composite primary key, and the ordering around
 * it. Reuses `SchemaInspector` — the pattern is identical to the invoices
 * table, only the data differs.
 *
 * The second mechanism gets equal weight rather than a footnote. "Set this to
 * that" needs no bookkeeping at all, and reaching for the table when you did
 * not need it is its own kind of over-building.
 *
 * The closing callout is the half that gets missed. Answering the sender a
 * failure on a duplicate builds a retry loop out of the mechanism meant to
 * prevent one, which is a worse outcome than not having the table.
 *
 * A server component: `SchemaInspector` carries its own 'use client'.
 */

export function IdempotencyBlock() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-fg">
          Record what you have already processed
        </p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
          The sender gives every event an id. Store it with a unique constraint
          and ignore anything you have seen before. This is the general answer,
          and the one to use when handling the event twice would do visible
          damage.
        </p>
      </div>

      <SchemaInspector
        lines={PROCESSED_EVENTS_LINES}
        title="the processed_events table"
        emptyHint="Select a line to see what it buys."
      />

      <div>
        <p className="text-sm font-medium text-fg">
          Or make the write itself repeatable
        </p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
          Setting <code className="t-data">status = &lsquo;paid&rsquo;</code> is
          already safe to run twice. Adding to a balance is not. Where you can
          phrase the change as &ldquo;set this to that&rdquo; rather than
          &ldquo;adjust this by that&rdquo;, you need no bookkeeping at all.
          Reach for this where it works and for the table where it does not.
        </p>
      </div>

      <Callout kind="warn" title="Then answer the sender success">
        A duplicate is not an error, it is the system working. Returning a
        failure means the provider retries, fails again, and keeps going — you
        have built a loop out of the mechanism meant to prevent one.
      </Callout>
    </div>
  )
}
```

- [ ] **Step 4: Verify**

Run: `cd web && pnpm typecheck && pnpm lint`.

Render all three temporarily and check at 320px in both themes. Specifically: the `SyncAsync`
grid must stack rather than squeeze, and the `processed_events` block must scroll inside its own
container with the page not scrolling sideways.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/architecture/DataFlow.tsx web/src/features/architecture/SyncAsync.tsx web/src/features/architecture/IdempotencyBlock.tsx
git commit -m "feat(architecture): build the flow, the sync/async fork and idempotency

DataFlow labels every step's kind, including the three that are neither,
so the two that differ stand out without colour carrying it.

SyncAsync stacks per question rather than rendering a table: two columns
plus a row label is three columns at 320px, and the row label is the part
you cannot drop.

IdempotencyBlock reuses SchemaInspector, gives the repeatable-write
mechanism equal weight, and closes on the half that gets missed — answer
the sender success, or you have built a retry loop out of the mechanism
meant to prevent one.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Contracts and authorization, as data

**Files:**
- Create: `web/src/features/architecture/contracts.ts`
- Test: `web/src/features/architecture/contracts.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type ContractRow = { id: string; contract: string; cost: 'cheap' | 'expensive' | 'not-yours'; why: string }` and `const CONTRACT_ROWS: ContractRow[]` (three)
  - `type RouteAnswer = { id: string; name: string; example: string; body: string }` and `const ROUTE_ANSWERS: RouteAnswer[]` (two)
  - `type ContractDecision = { id: string; name: string; body: string }` and `const CONTRACT_DECISIONS: ContractDecision[]` (three)
  - `type AuthzPattern = { id: string; name: string; question: string; holdsFor: string }` and `const AUTHZ_PATTERNS: AuthzPattern[]` (three)
  - `type AuthzScenario = { id: string; scenario: string; answer: string; why: string }` and `const AUTHZ_SCENARIOS: AuthzScenario[]` (four)
  - `function scoreAuthz(answers: Record<string, string>): { answered: number; correct: number }`

- [ ] **Step 1: Write the failing tests**

Create `web/src/features/architecture/contracts.test.ts`:

```ts
import { expect, test } from 'vitest'
import {
  AUTHZ_PATTERNS,
  AUTHZ_SCENARIOS,
  CONTRACT_DECISIONS,
  CONTRACT_ROWS,
  ROUTE_ANSWERS,
  scoreAuthz,
} from './contracts'

test('three contracts are sorted, because the sort is the decision and one row is not a sort', () => {
  expect(CONTRACT_ROWS).toHaveLength(3)
})

test('the three costs are all different, so the row you are in is what changes the answer', () => {
  expect(new Set(CONTRACT_ROWS.map((r) => r.cost)).size).toBe(3)
})

test('the webhook row is not yours to change, which is the row that carries idempotency in with it', () => {
  const hook = CONTRACT_ROWS.find((r) => r.id === 'webhook')
  expect(hook?.cost).toBe('not-yours')
})

test('the verb problem has two workable answers, since the doc says picking either consistently beats agonising', () => {
  expect(ROUTE_ANSWERS).toHaveLength(2)
  for (const a of ROUTE_ANSWERS) {
    expect(a.example.trim().length, `${a.id} example`).toBeGreaterThan(0)
  }
})

test('three decisions are made before the first row exists', () => {
  expect(CONTRACT_DECISIONS).toHaveLength(3)
})

test('three authorization patterns, because the mistake is assuming there is only one', () => {
  expect(AUTHZ_PATTERNS.map((p) => p.id)).toEqual([
    'ownership',
    'role',
    'membership',
  ])
})

test('every pattern states the question it asks, which is what makes them distinguishable at all', () => {
  for (const p of AUTHZ_PATTERNS) {
    expect(p.question.trim().length, `${p.id} question`).toBeGreaterThan(0)
    expect(p.holdsFor.trim().length, `${p.id} holdsFor`).toBeGreaterThan(0)
  }
})

test('every scenario answers with a pattern that exists, so a typo cannot make one unanswerable', () => {
  const ids = new Set(AUTHZ_PATTERNS.map((p) => p.id))
  for (const s of AUTHZ_SCENARIOS) {
    expect(ids, `${s.id} answers ${s.answer}`).toContain(s.answer)
  }
})

// The doc's point is that a system with a shared workspace uses all three. An
// exercise whose answers were all "ownership" could be passed without reading
// it, and would teach the exact mistake the section exists to correct.
test('all three patterns are the answer to at least one scenario, so the set cannot be passed by always answering ownership', () => {
  const used = new Set(AUTHZ_SCENARIOS.map((s) => s.answer))
  for (const p of AUTHZ_PATTERNS) {
    expect(used, `${p.id} is never the answer`).toContain(p.id)
  }
})

test('every scenario explains itself, since a revealed verdict without a reason teaches nothing', () => {
  for (const s of AUTHZ_SCENARIOS) {
    expect(s.why.trim().length, `${s.id} has no why`).toBeGreaterThan(0)
  }
})

test('scoring counts only what was answered, so a partial run still reports honestly', () => {
  const first = AUTHZ_SCENARIOS[0]
  const second = AUTHZ_SCENARIOS[1]
  const wrong = AUTHZ_PATTERNS.find((p) => p.id !== second.answer)!.id
  // Asymmetric on purpose: one right, one wrong. A fixture where both match
  // scores the same whether the comparison is `===` or its negation.
  const result = scoreAuthz({ [first.id]: first.answer, [second.id]: wrong })
  expect(result).toEqual({ answered: 2, correct: 1 })
})

test('scoring ignores ids it does not know, so stale storage cannot inflate a score', () => {
  expect(scoreAuthz({ 'not-a-scenario': 'ownership' })).toEqual({
    answered: 0,
    correct: 0,
  })
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/contracts.test.ts`
Expected: fails to collect, `Failed to resolve import "./contracts"`.

- [ ] **Step 3: Write the module**

Create `web/src/features/architecture/contracts.ts`:

```ts
/**
 * Source: docs/03-architecture.md, "Design the API contracts" and
 * "Authentication and authorization".
 *
 * A contract is a promise about shape, and its real cost is who you can force
 * to move when you break it — which is the same reversibility axis the stage
 * opens on, and why the decision belongs in this stage rather than in
 * implementation.
 */

export type ContractRow = {
  id: string
  contract: string
  cost: 'cheap' | 'expensive' | 'not-yours'
  why: string
}

export const CONTRACT_ROWS: ContractRow[] = [
  {
    id: 'internal',
    contract: 'An internal server action or function',
    cost: 'cheap',
    why: 'One codebase, and the compiler finds every caller. Most solo projects live almost entirely in this row, which is the argument for not building a public API until something needs one.',
  },
  {
    id: 'public',
    contract: 'A public API somebody else calls',
    cost: 'expensive',
    why: 'You do not know who depends on it and you cannot make them move. The mistake is not noticing the moment you have arrived here — a mobile client, a partner integration, an endpoint somebody found — because from then on the shape is a commitment.',
  },
  {
    id: 'webhook',
    contract: 'A webhook you receive',
    cost: 'not-yours',
    why: 'Somebody else owns the shape and you adapt. You inherit its delivery behaviour along with it: it will arrive twice eventually, and handling it has to be safe when it does. That is idempotency, worked through in the sketch step where the payment flow makes it concrete.',
  },
]

export type RouteAnswer = {
  id: string
  name: string
  example: string
  body: string
}

/**
 * The verb problem. Two workable answers, and picking either consistently
 * beats agonising — so this is a reveal rather than a scored exercise.
 */
export const ROUTE_ANSWERS: RouteAnswer[] = [
  {
    id: 'sub-resource',
    name: 'Treat the verb as a sub-resource',
    example: 'POST /claims/:id/approve',
    body: 'Keeps the noun in the path and reads naturally. The default answer, and the one that needs no argument.',
  },
  {
    id: 'verb-as-noun',
    name: 'Make the verb a noun',
    example: 'POST /approvals',
    body: 'An approval is a thing that happened, with an actor and a timestamp, and this may be closer to your real model than a status flip. Worth a moment’s thought rather than a reflex: if you would want to know later who approved what and when, the verb was an entity all along — and the interrogation in Model should have caught it.',
  },
]

export type ContractDecision = {
  id: string
  name: string
  body: string
}

export const CONTRACT_DECISIONS: ContractDecision[] = [
  {
    id: 'route-shape',
    name: 'Route shape',
    body: 'Resource-oriented (/invoices/:id) is the default, because it is predictable, and predictable is most of what a contract is worth. It stops being obvious the moment your operations are verbs rather than documents.',
  },
  {
    id: 'request-response',
    name: 'Request and response shape',
    body: 'Validate at the boundary: anything crossing into your system is untrusted, including data from your own frontend. What you return is a promise — adding a field is safe, removing or renaming one is not.',
  },
  {
    id: 'versioning',
    name: 'Versioning',
    body: 'Needed only for the expensive row, and the cheapest strategy is to avoid needing it: add fields, never remove them, never change the meaning of one that exists. When that stops being enough, version the route rather than the payload.',
  },
]

export type AuthzPattern = {
  id: string
  name: string
  question: string
  holdsFor: string
}

/**
 * The part people get wrong is not authentication but authorization, and the
 * mistake is assuming there is only one pattern.
 */
export const AUTHZ_PATTERNS: AuthzPattern[] = [
  {
    id: 'ownership',
    name: 'Ownership',
    question: 'Does this row carry the caller’s id?',
    holdsFor: 'A user’s own invoices, drafts, notes.',
  },
  {
    id: 'role',
    name: 'Role',
    question: 'Does this caller hold a role that grants the action?',
    holdsFor: 'A manager approving somebody else’s request.',
  },
  {
    id: 'membership',
    name: 'Membership',
    question: 'Do the caller and the row belong to the same group?',
    holdsFor: 'Anything with a shared workspace or team.',
  },
]

export type AuthzScenario = {
  id: string
  scenario: string
  /** The id of the pattern that applies. */
  answer: string
  why: string
}

export const AUTHZ_SCENARIOS: AuthzScenario[] = [
  {
    id: 'own-draft',
    scenario: 'A freelancer edits their own draft invoice',
    answer: 'ownership',
    why: 'The row carries their id, and nobody else has any business in it. This is the case that makes ownership feel general, because for a product where each person works on their own things it genuinely is.',
  },
  {
    id: 'approve-swap',
    scenario: 'A manager approves a shift swap between two other people',
    answer: 'role',
    why: 'The manager owns none of the three rows involved. This is where ownership fails, and it fails quietly: the system works correctly for the person who built it and refuses everyone else. Nothing about the row can grant this, so the grant has to come from the caller’s role.',
  },
  {
    id: 'shared-doc',
    scenario: 'Anyone on a team opens a document in their shared workspace',
    answer: 'membership',
    why: 'No individual owns it and no special role is needed. The question is whether the caller and the row belong to the same group, which is a different query from both of the others — and the reason the memberships table exists.',
  },
  {
    id: 'own-feed',
    scenario: 'A user reads their own notification feed',
    answer: 'ownership',
    why: 'Ownership again, and deliberately: two of four are ownership because that is the honest ratio in most products. The lesson is not that ownership is wrong, it is that it is not the only one — so the decision is which pattern applies to which entity, written down per entity.',
  },
]

const SCENARIO_BY_ID = new Map(AUTHZ_SCENARIOS.map((s) => [s.id, s]))

/** `answers[id]` is the pattern id the reader chose. Unknown ids are ignored. */
export function scoreAuthz(answers: Record<string, string>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, choice] of Object.entries(answers)) {
    const scenario = SCENARIO_BY_ID.get(id)
    if (!scenario) continue
    answered += 1
    if (scenario.answer === choice) correct += 1
  }
  return { answered, correct }
}
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/contracts.test.ts`
Expected: PASS, 12 tests.

- [ ] **Step 5: Teeth check**

Change the `shared-doc` scenario's answer to `'ownership'`. Confirm the "all three patterns are
used" test fails and names `membership`. That is the exact defect the test exists for: an
exercise that can be passed by always answering ownership teaches the mistake the section
corrects. Restore. Then change `scoreAuthz`'s comparison to `!==` and confirm only the scoring
test fails.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/contracts.ts web/src/features/architecture/contracts.test.ts
git commit -m "feat(architecture): add API contracts and authorization as data

Contracts sorted by who you can force to move when you break the shape,
which is the reversibility axis pointed at an interface.

The authorization exercise is tested against the doc's actual claim: all
three patterns must be the answer to at least one scenario, so the set
cannot be passed by always answering ownership — which would teach the
exact mistake the section exists to correct.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: The contract and authorization components

**Files:**
- Create: `web/src/features/architecture/ContractCost.tsx`
- Create: `web/src/features/architecture/RouteShape.tsx`
- Create: `web/src/features/architecture/AuthzPatterns.tsx`

**Interfaces:**
- Consumes: everything from Task 15.
- Produces: `<ContractCost />`, `<RouteShape />`, `<AuthzPatterns />`, all prop-less. Task 20
  renders all three in step 07.

`AuthzPatterns` is step 07's single committed exercise under D-49, which is why `RouteShape` is
a reveal. `ContractCost` and `RouteShape` are implementation-only; `AuthzPatterns` renders data
and a scorer both tested in Task 15.

- [ ] **Step 1: Write `ContractCost`**

Create `web/src/features/architecture/ContractCost.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { CONTRACT_ROWS } from './contracts'

/**
 * Source: docs/03-architecture.md, "Design the API contracts".
 *
 * Expand-to-reveal rather than the doc's three-column table, for the reason
 * this stage now applies four times: a cell that is a sentence is a paragraph
 * pretending to be a cell.
 *
 * The cost badge is deliberately not colour-coded good-to-bad. "Expensive" is
 * not a failure — a public API you meant to publish is a correct expensive
 * contract — and `danger` on that row would say otherwise. Neutral borders,
 * with the word doing the work.
 */

const COST_LABEL: Record<string, string> = {
  cheap: 'cheap to change',
  expensive: 'expensive to change',
  'not-yours': 'not yours to change',
}

export function ContractCost() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {CONTRACT_ROWS.map((row) => {
          const open = openIds.has(row.id)
          const panelId = `contract-${row.id}`
          return (
            <li key={row.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(row.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{row.contract}</span>
                    <span className="mt-1 inline-block border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                      {COST_LABEL[row.cost]}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <p
                  id={panelId}
                  className="border-t border-line bg-sunken px-5 py-4 text-sm leading-6 text-muted"
                >
                  {row.why}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        If your whole list lands in the first row, the sort is still worth
        thirty seconds. The value is noticing that you have nothing in rows two
        and three yet, and knowing which item would move there first.
      </p>
    </Card>
  )
}
```

- [ ] **Step 2: Write `RouteShape`**

Create `web/src/features/architecture/RouteShape.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { CONTRACT_DECISIONS, ROUTE_ANSWERS } from './contracts'

/**
 * Source: docs/03-architecture.md, "Design the API contracts".
 *
 * A reveal, not a scorer. The doc says picking either consistently beats
 * agonising, so there is no defensible answer to score against — and D-49
 * gives this step one committed exercise, which is `AuthzPatterns`.
 *
 * The two answers sit side by side rather than one being the default with the
 * other in a footnote, because the second is the one carrying the insight: if
 * you would want to know later who approved what and when, the verb was an
 * entity all along.
 */

export function RouteShape() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card>
      <p className="text-sm font-medium text-fg">
        When the operation is a verb, not a document
      </p>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
        Approving a claim, withdrawing one, cancelling a shift: none of those is
        a create, read, update or delete on a noun. Two workable answers, and
        picking either consistently beats agonising over which.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ROUTE_ANSWERS.map((answer) => {
          const open = openId === answer.id
          const panelId = `route-${answer.id}`
          return (
            <div key={answer.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : answer.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={[
                  'flex min-h-11 w-full flex-col items-start justify-center border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                  open
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-raised hover:border-line-strong',
                ].join(' ')}
              >
                <span className="text-sm font-medium text-fg">
                  {answer.name}
                </span>
                <span className="t-data mt-0.5 text-[12px] leading-5 text-subtle">
                  {answer.example}
                </span>
              </button>
              {open && (
                <p
                  id={panelId}
                  className="mt-2 border border-line bg-sunken p-3.5 text-sm leading-6 text-muted"
                >
                  {answer.body}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 space-y-3 border-t border-line pt-4">
        <p className="t-label text-subtle">
          Three decisions, before the first row exists
        </p>
        {CONTRACT_DECISIONS.map((d) => (
          <div key={d.id}>
            <p className="text-sm font-medium text-fg">{d.name}</p>
            <p className="mt-0.5 text-sm leading-6 text-muted">{d.body}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
```

- [ ] **Step 3: Write `AuthzPatterns`**

Create `web/src/features/architecture/AuthzPatterns.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { AUTHZ_PATTERNS, AUTHZ_SCENARIOS, scoreAuthz } from './contracts'

/**
 * Source: docs/03-architecture.md, "Authentication and authorization".
 *
 * Step 07's single committed exercise, per D-49. Structurally this is
 * `ReversibilityTable` with three options instead of two: commit before the
 * verdict, the chosen option stays on screen disabled rather than vanishing,
 * and the reasoning shows whichever way it went.
 *
 * The patterns are listed above the exercise on purpose. This is not a recall
 * test — the reader has never seen these three before — it is a test of
 * matching a situation to a pattern, which is the skill the section is about.
 *
 * Two of the four answers are ownership, which is the honest ratio and also
 * the trap: a reader who notices the pattern repeating and answers ownership
 * for all four gets the manager scenario wrong, which is precisely the failure
 * the doc describes as working correctly for the person who built it.
 */

export function AuthzPatterns() {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const commit = (id: string, choice: string) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: choice }))

  const { answered, correct } = scoreAuthz(answers)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Which pattern applies?</p>
          <p className="text-sm text-subtle">
            Commit to each before its verdict shows.
          </p>
        </div>
        {answered > 0 && (
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className="font-mono text-sm tabular-nums text-muted"
            >
              {correct}/{answered} right
            </span>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          </div>
        )}
      </div>

      <ul className="mb-5 space-y-2">
        {AUTHZ_PATTERNS.map((p) => (
          <li key={p.id} className="border border-line bg-sunken px-3.5 py-2.5">
            <p className="text-sm font-medium text-fg">{p.name}</p>
            <p className="mt-0.5 text-sm leading-6 text-muted">{p.question}</p>
            <p className="mt-0.5 text-sm leading-6 text-subtle">
              Holds for: {p.holdsFor}
            </p>
          </li>
        ))}
      </ul>

      <ul className="space-y-2.5">
        {AUTHZ_SCENARIOS.map((scenario) => {
          const choice = answers[scenario.id]
          const done = scenario.id in answers
          const right = done && choice === scenario.answer

          return (
            <li key={scenario.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                {scenario.scenario}
              </p>

              <div
                role="radiogroup"
                aria-label={`Which pattern applies to: ${scenario.scenario}?`}
                className="grid grid-cols-1 gap-2 sm:grid-cols-3"
              >
                {AUTHZ_PATTERNS.map((p) => {
                  const checked = done && choice === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(scenario.id, p.id)}
                      className={[
                        'min-h-11 min-w-0 border px-3 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                        checked
                          ? 'border-brand bg-brand-tint text-fg'
                          : done
                            ? 'cursor-not-allowed border-line bg-raised text-subtle opacity-60'
                            : 'border-line bg-raised text-muted hover:border-line-strong',
                      ].join(' ')}
                    >
                      {p.name}
                    </button>
                  )
                })}
              </div>

              <div aria-live="polite">
                {done && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p
                      className={[
                        'mb-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                        right ? 'text-go' : 'text-danger',
                      ].join(' ')}
                    >
                      {right ? (
                        <Check className="size-3.5 shrink-0" aria-hidden />
                      ) : (
                        <X className="size-3.5 shrink-0" aria-hidden />
                      )}
                      {right ? 'Correct' : 'Not quite'}
                      <span className="font-normal normal-case tracking-normal text-subtle">
                        {
                          AUTHZ_PATTERNS.find((p) => p.id === scenario.answer)
                            ?.name
                        }
                      </span>
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      {scenario.why}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="info" title="The decision is per entity, not per system">
          A system with a shared workspace will use all three. So write it down
          per entity — getting this wrong is not an error you find later, it is a
          system that works correctly for the person who built it and leaks for
          everyone else.
        </Callout>
      </div>
    </Card>
  )
}
```

- [ ] **Step 4: Verify**

Run: `cd web && pnpm typecheck && pnpm lint && pnpm test`.

Render all three temporarily. At 320px the three-option radiogroup must stack to one column;
confirm each option still clears 44px. Check both themes, and confirm a committed row keeps its
chosen option visible and disabled rather than replacing it with the verdict.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/architecture/ContractCost.tsx web/src/features/architecture/RouteShape.tsx web/src/features/architecture/AuthzPatterns.tsx
git commit -m "feat(architecture): build the contract sort and the authorization exercise

AuthzPatterns is step 07's one committed exercise under D-49, which is
why RouteShape is a reveal — the doc says picking either route answer
consistently beats agonising, so there is nothing to score against.

The patterns are listed above the exercise deliberately: this is not a
recall test, it is matching a situation to a pattern, which is the skill
the section teaches.

ContractCost does not colour-code its cost badge. An expensive contract
you meant to publish is correct, and danger on that row would say
otherwise.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Wave 2b — additions inside steps that already exist

### Task 17: The remaining schema blocks, as data

**Files:**
- Create: `web/src/features/architecture/schema-blocks.ts`
- Test: `web/src/features/architecture/schema-blocks.test.ts`

**Interfaces:**
- Consumes: `SchemaLine` from `./scoring`.
- Produces:
  - `const INDEX_LINES: SchemaLine[]`
  - `const PARTIAL_UNIQUE_LINES: SchemaLine[]`
  - `const TENANCY_LINES: SchemaLine[]`
  - `type ErEdge = { id: string; from: string; to: string; note?: string }`
  - `const ER_ENTITIES: string[]` and `const ER_EDGES: ErEdge[]`

- [ ] **Step 1: Write the failing tests**

Create `web/src/features/architecture/schema-blocks.test.ts`:

```ts
import { expect, test } from 'vitest'
import {
  ER_EDGES,
  ER_ENTITIES,
  INDEX_LINES,
  PARTIAL_UNIQUE_LINES,
  TENANCY_LINES,
} from './schema-blocks'

test('two indexes are shown, one from a screen and one from the scheduled job, because both come from the sketch and not from intuition', () => {
  const created = INDEX_LINES.filter((l) => l.sql.startsWith('CREATE INDEX'))
  expect(created).toHaveLength(2)
})

test('the partial index is partial, since a plain UNIQUE would forbid the second rejected claim and that is the whole point', () => {
  const sql = PARTIAL_UNIQUE_LINES.map((l) => l.sql).join(' ')
  expect(sql).toMatch(/WHERE/)
  expect(sql).toMatch(/UNIQUE INDEX/)
})

test('the tenancy block carries the memberships table, which is the answer to the fifth interrogation question', () => {
  const sql = TENANCY_LINES.map((l) => l.sql).join(' ')
  expect(sql).toMatch(/CREATE TABLE memberships/)
})

test('the tenancy block puts the role on the membership and not on users, which is the mistake it exists to prevent', () => {
  const sql = TENANCY_LINES.map((l) => l.sql).join(' ')
  expect(sql).toMatch(/role\s+text NOT NULL CHECK/)
  expect(sql).not.toMatch(/users\s*\([^)]*role/)
})

test('every block annotates at least one line, or it is a code dump rather than an annotated artifact', () => {
  for (const [name, lines] of [
    ['indexes', INDEX_LINES],
    ['partial unique', PARTIAL_UNIQUE_LINES],
    ['tenancy', TENANCY_LINES],
  ] as const) {
    expect(
      lines.some((l) => l.note),
      `${name} has no annotated line`,
    ).toBe(true)
  }
})

test('line ids are unique within each block, because selection is keyed by id', () => {
  for (const [name, lines] of [
    ['indexes', INDEX_LINES],
    ['partial unique', PARTIAL_UNIQUE_LINES],
    ['tenancy', TENANCY_LINES],
  ] as const) {
    expect(new Set(lines.map((l) => l.id)).size, name).toBe(lines.length)
  }
})

test('the ER view carries four entities and the fourth edge, which is the one worth arguing about before it is typed', () => {
  expect(ER_ENTITIES).toHaveLength(4)
  const owner = ER_EDGES.find((e) => e.id === 'users-invoices')
  expect(owner).toBeDefined()
  expect(owner?.note?.trim().length ?? 0).toBeGreaterThan(0)
})

test('every ER edge joins entities the view actually draws', () => {
  for (const e of ER_EDGES) {
    expect(ER_ENTITIES, `${e.id} from`).toContain(e.from)
    expect(ER_ENTITIES, `${e.id} to`).toContain(e.to)
  }
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/features/architecture/schema-blocks.test.ts`
Expected: fails to collect, `Failed to resolve import "./schema-blocks"`.

- [ ] **Step 3: Write the module**

Create `web/src/features/architecture/schema-blocks.ts`:

```ts
/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The three SQL blocks the schema step shows beyond the invoices table, plus
 * the ER view that precedes all of them. Each block is an excerpt and assumes
 * the tables the domain model named already exist — they are not a migration
 * file, which is what the step says out loud.
 */

import { type SchemaLine } from './scoring'

/**
 * Indexes answer queries you actually run, so write the queries first. Both of
 * these come from the system sketch rather than from intuition: one from a
 * screen, one from the scheduled job.
 */
export const INDEX_LINES: SchemaLine[] = [
  {
    id: 'dashboard-comment',
    sql: '-- The dashboard lists one user’s invoices, filtered by status.',
    indent: 0,
  },
  {
    id: 'dashboard-index',
    sql: 'CREATE INDEX invoices_owner_status_idx ON invoices (owner_id, status);',
    indent: 0,
    note: 'Traced to a screen. Without it every page load scans the whole table. The column order matters: owner_id first, because that is the column every query filters on and status only narrows what is left.',
  },
  { id: 'gap', sql: '', indent: 0 },
  {
    id: 'overdue-comment',
    sql: '-- The scheduled job looks for sent invoices past their due date.',
    indent: 0,
  },
  {
    id: 'overdue-index',
    sql: 'CREATE INDEX invoices_overdue_idx ON invoices (due_date) WHERE status = ‘sent’;',
    indent: 0,
    note: 'Traced to the scheduled job in the sketch. Partial, because the job never asks about drafts or paid invoices, and a smaller index is a faster one. Indexes cost write time and disk, which is why “index everything” is not the answer and “index nothing until it hurts” is not either.',
  },
]

/**
 * Some rules are conditional, and UNIQUE cannot express them. The stage names
 * races as the reason constraints belong in the database, then supplies only
 * primary keys, foreign keys, CHECK and UNIQUE — none of which can say "at most
 * one approved claim per shift".
 */
export const PARTIAL_UNIQUE_LINES: SchemaLine[] = [
  {
    id: 'create',
    sql: 'CREATE UNIQUE INDEX one_approved_claim_per_shift',
    indent: 0,
    note: 'A unique index rather than a UNIQUE constraint, because only an index can carry the WHERE clause below. A plain UNIQUE (shift_id) would also forbid the second rejected claim, which is wrong.',
  },
  {
    id: 'where',
    sql: '  ON claims (shift_id) WHERE status = ‘approved’;',
    indent: 1,
    note: 'The condition is what makes the rule expressible. Without it, the usual approach is to check for an existing approval and then insert — which two concurrent requests both pass, both believing they were first. That is the race the database was supposed to be holding the line on.',
  },
]

/**
 * Actors and tenancy are stored data too, and they are the two this stage most
 * often leaves implicit. The invoicing schema has neither, because one
 * freelancer owning their own rows needs neither. Most products are not that.
 */
export const TENANCY_LINES: SchemaLine[] = [
  { id: 'companies-open', sql: 'CREATE TABLE companies (', indent: 0 },
  {
    id: 'companies-id',
    sql: '  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
  },
  { id: 'companies-name', sql: '  name text NOT NULL', indent: 1 },
  { id: 'companies-close', sql: ');', indent: 0 },
  { id: 'gap-1', sql: '', indent: 0 },
  { id: 'teams-open', sql: 'CREATE TABLE teams (', indent: 0 },
  {
    id: 'teams-id',
    sql: '  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
  },
  {
    id: 'teams-company',
    sql: '  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'The tenant key, and the one item on the deferral list that cannot be deferred. It is stored data on every table that holds tenant data, which the top of this stage classifies as decide-now.',
  },
  { id: 'teams-name', sql: '  name       text NOT NULL,', indent: 1 },
  {
    id: 'teams-unique',
    sql: '  UNIQUE (company_id, name)',
    indent: 1,
    note: 'The scoped-uniqueness rule from the domain model, applied to a tenant: two companies may both have a team called Kitchen. Globally unique team names would fail the second company for no reason its users could understand.',
  },
  { id: 'teams-close', sql: ');', indent: 0 },
  { id: 'gap-2', sql: '', indent: 0 },
  { id: 'memberships-open', sql: 'CREATE TABLE memberships (', indent: 0 },
  {
    id: 'memberships-user',
    sql: '  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,',
    indent: 1,
  },
  {
    id: 'memberships-team',
    sql: '  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,',
    indent: 1,
  },
  {
    id: 'memberships-role',
    sql: '  role    text NOT NULL CHECK (role IN (‘member’,‘manager’)),',
    indent: 1,
    note: 'The role lives on the relationship, not on the user. A person can manage one team and be an ordinary member of another, and a users.role column cannot say that. This is the answer to the fifth interrogation question, which is why that question is asked before the schema exists.',
  },
  {
    id: 'memberships-pk',
    sql: '  PRIMARY KEY (user_id, team_id)',
    indent: 1,
    note: 'The pair is the identity: one row per person per team. It also makes the membership lookup — the query behind the membership authorization pattern — an index hit rather than a scan.',
  },
  { id: 'memberships-close', sql: ');', indent: 0 },
]

export type ErEdge = {
  id: string
  from: string
  to: string
  /** Present where the edge is a decision rather than an obvious consequence. */
  note?: string
}

export const ER_ENTITIES: string[] = [
  'users',
  'clients',
  'invoices',
  'line_items',
]

/**
 * The same picture the domain model described in words, with cardinality made
 * explicit. Worth drawing once, because the fourth edge is visible here and
 * invisible in a list of tables.
 */
export const ER_EDGES: ErEdge[] = [
  { id: 'users-clients', from: 'users', to: 'clients' },
  { id: 'clients-invoices', from: 'clients', to: 'invoices' },
  { id: 'invoices-line-items', from: 'invoices', to: 'line_items' },
  {
    id: 'users-invoices',
    from: 'users',
    to: 'invoices',
    note: 'Worth arguing about before it is typed. Hanging invoices off users as well as clients is what lets a client be merged or reassigned later without the invoices following it. It is exactly the kind of thing an ER view makes visible and a list of tables does not.',
  },
]
```

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/features/architecture/schema-blocks.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Teeth check**

Change the memberships `role` line to `users.role`-style by replacing the whole
`memberships-role` entry's `sql` with `'  -- role moved to users'`. Confirm the
role-on-the-membership test fails. Restore. Then drop the `WHERE` clause from
`PARTIAL_UNIQUE_LINES` and confirm only the partial-index test fails.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/architecture/schema-blocks.ts web/src/features/architecture/schema-blocks.test.ts
git commit -m "feat(architecture): add the indexes, partial unique index and tenancy blocks

Three SQL blocks the schema step was missing, plus the ER view's edges.
Each index is annotated with where it came from — one screen, one
scheduled job — because the doc's rule is that an index answers a query
you actually run.

The tenancy block is tested for the mistake it exists to prevent: the
role has to be on the membership, not on users. A users.role column is
one global answer to a question asked per team.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 18: The ER view and the partial unique index

**Files:**
- Create: `web/src/features/architecture/ERView.tsx`
- Create: `web/src/features/architecture/PartialUniqueIndex.tsx`

**Interfaces:**
- Consumes: `ER_ENTITIES`, `ER_EDGES` from Task 17; `PARTIAL_UNIQUE_LINES` from Task 17;
  `SchemaInspector` with its Task 11 signature.
- Produces: `<ERView />` and `<PartialUniqueIndex />`, both prop-less. Task 20 renders both in
  step 06.

**Implementation-only.**

- [ ] **Step 1: Write `ERView`**

Create `web/src/features/architecture/ERView.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { ER_EDGES, ER_ENTITIES } from './schema-blocks'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The nouns with their cardinality made explicit. Rendered as an entity list
 * plus an edge list rather than a drawn diagram, consistent with `BoundaryMap`
 * and `SystemSketch` in this stage: the reading of "one A has many B" is the
 * content, and at 320px a crow's foot is the first thing to become
 * indistinguishable from a line ending.
 *
 * The fourth edge is the reason this exists at all, so it is the only one that
 * expands. Three obvious edges and one argued edge is the shape of the lesson:
 * an ER view earns its place by making one decision visible, not by drawing
 * four relationships you already knew about.
 */

export function ERView() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card>
      <p className="t-label mb-2 text-subtle">Entities</p>
      <div className="flex flex-wrap gap-2">
        {ER_ENTITIES.map((entity) => (
          <span
            key={entity}
            className="t-data border border-line bg-sunken px-2.5 py-1 text-[13px] text-fg"
          >
            {entity}
          </span>
        ))}
      </div>

      <p className="t-label mb-2 mt-5 text-subtle">
        Relationships — read <span className="t-data">A ──1──&lt; B</span> as
        &ldquo;one A has many B&rdquo;
      </p>
      <ul className="space-y-2">
        {ER_EDGES.map((edge) => {
          const open = openId === edge.id
          const panelId = `er-${edge.id}`
          if (!edge.note) {
            return (
              <li
                key={edge.id}
                className="border border-line bg-sunken px-3.5 py-2.5"
              >
                <span className="t-data text-[13px] text-fg sm:text-sm">
                  {edge.from} ──1──&lt; {edge.to}
                </span>
              </li>
            )
          }
          return (
            <li key={edge.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : edge.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={[
                  'flex min-h-11 w-full flex-wrap items-center justify-between gap-2 border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                  open
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-sunken hover:border-line-strong',
                ].join(' ')}
              >
                <span className="t-data text-[13px] text-fg sm:text-sm">
                  {edge.from} ──1──&lt; {edge.to}
                </span>
                <span className="shrink-0 border border-line px-1.5 py-0.5 text-[11px] font-medium text-subtle">
                  worth arguing about
                </span>
              </button>
              {open && (
                <p
                  id={panelId}
                  className="mt-2 border border-line bg-raised p-3.5 text-sm leading-6 text-muted"
                >
                  {edge.note}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
```

- [ ] **Step 2: Write `PartialUniqueIndex`**

Create `web/src/features/architecture/PartialUniqueIndex.tsx`:

```tsx
import { Callout } from '@/components/ui'
import { SchemaInspector } from './SchemaInspector'
import { PARTIAL_UNIQUE_LINES } from './schema-blocks'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The race comes first and the index second, deliberately. A reader shown the
 * index first reads it as syntax; a reader shown the check-then-insert race
 * first reads it as the answer to something.
 *
 * `warn` on the race, because it is a defect that passes every test you would
 * think to write and then loses to concurrency in production.
 *
 * A server component: `SchemaInspector` carries its own 'use client'.
 */

export function PartialUniqueIndex() {
  return (
    <div className="space-y-4">
      <Callout kind="warn" title="Check, then insert, is not a constraint">
        The usual approach to &ldquo;at most one approved claim per shift&rdquo;
        is to look for an existing approval and then insert. Two concurrent
        requests both pass the check, both insert, and both believe they were
        first. The stage names races as the reason constraints belong in the
        database, and then supplies only primary keys, foreign keys,
        <code className="t-data"> CHECK</code> and
        <code className="t-data"> UNIQUE</code> — none of which can express a
        rule with a condition on it.
      </Callout>

      <SchemaInspector
        lines={PARTIAL_UNIQUE_LINES}
        title="the partial unique index"
        emptyHint="Select a line to see what it buys."
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify**

Run: `cd web && pnpm typecheck && pnpm lint`.

Render both temporarily. Confirm at 320px that the ER edge rows wrap rather than overflow (the
badge and the edge text are on one flex row and must wrap), and that the `──1──<` glyphs render
in both themes at the mono size used.

- [ ] **Step 4: Commit**

```bash
git add web/src/features/architecture/ERView.tsx web/src/features/architecture/PartialUniqueIndex.tsx
git commit -m "feat(architecture): build the ER view and the partial unique index

Only one ER edge expands, and that is the shape of the lesson: an ER view
earns its place by making one decision visible, not by drawing four
relationships you already knew about. The fourth edge — invoices hanging
off users as well as clients — is what lets a client be reassigned later
without the invoices following it.

PartialUniqueIndex puts the race before the index. Shown the index first
a reader reads syntax; shown the check-then-insert race first they read
an answer to something.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Wave 3 — assembly, wiring and gates

### The figure list, fixed

Figures run across the whole stage and are passed explicitly. This is the final numbering; both
assembly tasks use it, so neither has to guess and Task 21 verifies rather than assigns.

| # | Component | Step |
|---|---|---|
| 1 | `ReversibilityAxis` | 01 Reverse |
| 2 | `TraceForward` | 02 Require |
| 3 | `DomainSketch` | 03 Model |
| 4 | `DriftDiagram` | 03 Model |
| 5 | `DeploymentStyles` | 04 Shape |
| 6 | `OneAppCosts` | 04 Shape |
| 7 | `BoundaryMap` | 04 Shape |
| 8 | `SystemSketch` | 05 Sketch |
| 9 | `DataFlow` | 05 Sketch |
| 10 | `SyncAsync` | 05 Sketch |
| 11 | `IdempotencyBlock` | 05 Sketch |
| 12 | `ERView` | 06 Schema |
| 13 | `SchemaInspector` (invoices) | 06 Schema |
| 14 | `SchemaInspector` (indexes) | 06 Schema |
| 15 | `PartialUniqueIndex` | 06 Schema |
| 16 | `SchemaInspector` (tenancy) | 06 Schema |
| 17 | `DeleteBehaviour` | 06 Schema |
| 18 | `ContractCost` | 07 Contract |
| 19 | `AuthPaths` | 07 Contract |
| 20 | `ADRAnatomy` | 08 Record |

Exercises are not figures, matching the existing convention: `ReversibilityTable`,
`CharacteristicPicker`, `ModelInterrogation`, `DomainWorksheet`, `SplitTrigger`,
`InternalOrganisation`, `YourCharacteristics`, `RouteShape`, `AuthzPatterns`, `DeferredList`
and `AIArchitecturePlays` all render outside a `Figure`.

---

### Task 19: Assemble steps 01–05

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx`

**Interfaces:**
- Consumes: every component from Tasks 8, 10, 13, 14, plus the existing ones.
- Produces: a `STEPS` array whose first five entries have ids `reverse`, `require`, `model`,
  `shape`, `sketch`. Task 20 appends the remaining four. Task 22 uses these ids for `PAGES`.

**Implementation-only.** Wiring: every judgment it renders is already tested.

**Copying existing sections.** Several steps below reuse a `Section` that already exists. Each
is named by its `title` prop and by its line range in `Architecture.tsx` **as of `main`** — find
it by the title string, because Task 19's own edits shift every line number below them. The
seven blocks, all in `web/src/features/architecture/Architecture.tsx`:

| `title` | Lines on `main` | Moves to |
|---|---|---|
| `Constraints belong in the database` | 190–216 | step 06 `schema` |
| `Delete behaviour, decided per entity` | 218–237 | step 06 `schema` |
| `Start with one application` | 247–268 | step 04 `shape` |
| `Is this a reason to split?` | 270–282 | step 04 `shape` |
| `Boundaries you keep honest` | 284–349 | step 04 `shape` |
| `Decide auth early, deliberately` | 359–382 | step 07 `contract` |
| `Write it down now, not later` | 384–399 | step 08 `record` |

Copy each one whole, from its `<Section` to its matching `</Section>`. The only edits are the
figure numbers and the additions this plan spells out. If a copied block differs from the
original in any other way, that is a defect, not an improvement — the prose in them was written,
reviewed and humanized in W-3, and rewriting it here would be an unreviewed change riding along
inside a port.

- [ ] **Step 1: Replace the imports**

```tsx
import Link from 'next/link'
import { Callout, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Stepper, type Step } from '@/components/Stepper'
import { References } from '@/components/References'
import { SCHEMA_LINES } from './scoring'
import { INDEX_LINES, TENANCY_LINES } from './schema-blocks'
import { ReversibilityAxis } from './ReversibilityAxis'
import { ReversibilityTable } from './ReversibilityTable'
import { CharacteristicPicker } from './CharacteristicPicker'
import { TraceForward } from './TraceForward'
import { DomainSketch } from './DomainSketch'
import { ModelInterrogation } from './ModelInterrogation'
import { DriftDiagram } from './DriftDiagram'
import { DomainWorksheet } from './DomainWorksheet'
import { DeploymentStyles } from './DeploymentStyles'
import { InternalOrganisation } from './InternalOrganisation'
import { YourCharacteristics } from './YourCharacteristics'
import { OneAppCosts } from './OneAppCosts'
import { SplitTrigger } from './SplitTrigger'
import { BoundaryMap } from './BoundaryMap'
import { TeamNotes } from './TeamNotes'
import { SystemSketch } from './SystemSketch'
import { DataFlow } from './DataFlow'
import { SyncAsync } from './SyncAsync'
import { IdempotencyBlock } from './IdempotencyBlock'
import { ERView } from './ERView'
import { SchemaInspector } from './SchemaInspector'
import { PartialUniqueIndex } from './PartialUniqueIndex'
import { DeleteBehaviour } from './DeleteBehaviour'
import { ContractCost } from './ContractCost'
import { RouteShape } from './RouteShape'
import { AuthPaths } from './AuthPaths'
import { AuthzPatterns } from './AuthzPatterns'
import { ADRAnatomy } from './ADRAnatomy'
import { DeferredList } from './DeferredList'
import { AIArchitecturePlays } from './AIArchitecturePlays'
```

Task 20 uses the later half of this list, which is why it is all added now.

- [ ] **Step 2: Step 01 — `reverse`, unchanged except its figure number**

Keep both existing sections verbatim. `ReversibilityAxis` stays `n={1}`. The
`REVERSIBILITY_TEST` block added in Task 2 lives inside `ReversibilityTable`, so nothing changes
here.

- [ ] **Step 3: Step 02 — `require`, new**

Insert immediately after the `reverse` entry:

```tsx
  {
    id: 'require',
    label: 'Require',
    hint: 'What the system has to be, and what that forces',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The other half"
          title="What this system has to be"
        >
          <Prose>
            <p>
              The stage has been sorting decisions by what they cost. This asks
              what they are <em>for</em>. Stage 02 settled what the system{' '}
              <em>does</em> — the outcome, the cut, the vertical slices — and{' '}
              <Link href="/stages/02-planning" className="text-brand">
                02 — Planning
              </Link>{' '}
              owns all of it. What this stage needs is the other half: what the
              system has to <em>be</em> while doing those things. Those are its{' '}
              <Term id="architecture-characteristic">
                architecture characteristics
              </Term>
              , which is the same thing most job descriptions call
              non-functional requirements.
            </p>
            <p>
              Pick three or four, not because a longer list is hard to write but
              because they trade against each other. A system that is meant to
              be everything has been told nothing.
            </p>
          </Prose>
          <div className="mt-5">
            <CharacteristicPicker />
          </div>
        </Section>

        <Section
          eyebrow="The test"
          title="A characteristic has to force something"
        >
          <Prose>
            <p>
              Every row below is a decision this stage makes anyway. Choosing
              the characteristic first is what turns that decision from a
              preference into something with a reason attached — and it is the
              only thing separating this section from a vocabulary exercise.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="Three characteristics and the decision each one forces, with the step where that decision actually gets made. The link is the argument: a characteristic is not a label, it is the reason a later step goes the way it does."
          >
            <TraceForward />
          </Figure>
        </Section>
      </div>
    ),
  },
```

- [ ] **Step 4: Step 03 — `model`, plus the method it was missing**

Keep all four existing sections. Renumber `DomainSketch` to `n={3}` and `DriftDiagram` to
`n={4}`. In the first section's `<Prose>`, insert this paragraph between the two existing ones:

```tsx
            <p>
              Getting to the nouns is mechanical, and worth doing rather than
              guessing at. Take the vertical slices from{' '}
              <Link href="/stages/02-planning" className="text-brand">
                02 — Planning
              </Link>{' '}
              and underline every noun in them. Strike the ones that are a
              property of another noun — an invoice&rsquo;s <em>total</em> is
              not an entity, it is a column, and possibly not even that. What
              survives is the candidate list, and it will be wrong on the first
              pass. The interrogation below is what corrects it, which is why
              the questions matter more than the sketch.
            </p>
```

In the second section's `<Prose>`, change "Four questions" to "Five questions" and "Answer each
before the reasoning shows" stays. Change "one of these four genuinely depends on a product you
have not described" to "one of these five genuinely depends on a product you have not
described".

- [ ] **Step 5: Step 04 — `shape`, with the landscape in front of it**

Replace the whole existing `shape` entry with:

```tsx
  {
    id: 'shape',
    label: 'Shape',
    hint: 'Know the options, then take the one your characteristics pick',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The landscape"
          title="The shapes a system can take"
        >
          <Prose>
            <p>
              Before choosing, know what you are choosing between, or the next
              section is advice you take on faith. Start by separating two
              questions that usually get collapsed into one. How does it{' '}
              <em>deploy</em> — one unit or many? And how is it{' '}
              <em>organised inside</em> — what depends on what? A{' '}
              <Term id="hexagonal-architecture">hexagonal</Term>{' '}
              <Term id="monolith">monolith</Term> is an ordinary, sensible
              thing, which is why &ldquo;monolith or{' '}
              <Term id="microservices">microservices</Term>&rdquo; is a bad
              question: it treats one answer as covering both.
            </p>
          </Prose>
          <Figure
            n={5}
            caption="Four deployment shapes, each with what it buys, what it costs, and what would have to be true for it to be right. The microservices row is the one people adopt for the wrong reason — what it buys is organisational, and what it costs arrives on day one."
          >
            <DeploymentStyles />
          </Figure>
          <div className="mt-6">
            <InternalOrganisation />
          </div>
          <Prose>
            <p>
              A third axis:{' '}
              <Term id="event-driven-architecture">event-driven</Term> means
              components announce that something happened rather than calling
              the next step directly. It is not a deployment shape — a single
              application can be event-driven inside. The decision that leads
              there is posed in <em>Sketch</em>, where it is concrete.
            </p>
            <p>
              What this stage teaches is a{' '}
              <Term id="modular-monolith">modular monolith</Term>, and it is
              worth having the name: a reader who has been building one for
              years without the term cannot look up whether they are doing it
              well. <Term id="serverless">Serverless</Term> is a deployment
              detail underneath it rather than a rival to it.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="Your turn"
          title="Run the trace against your own three"
        >
          <Prose>
            <p>
              That choice follows from the characteristics rather than from
              taste. Run the same trace against yours. If it produces a
              different answer than the next section, the next section is wrong
              for your system, and you should be able to say why.
            </p>
          </Prose>
          <div className="mt-5">
            <YourCharacteristics />
          </div>
        </Section>

        {/* COPY: "Start with one application", main:247-268, whole Section.
            No edits: OneAppCosts is n={6} on main and n={6} in the new list. */}

        {/* COPY: "Is this a reason to split?", main:270-282, whole Section.
            No edits. SplitTrigger is this step's one committed exercise, per D-49. */}

        {/* COPY: "Boundaries you keep honest", main:284-349, whole Section.
            One edit: the two paragraphs below are inserted into its <Prose>.
            BoundaryMap is n={7} on main and n={7} in the new list. */}
      </div>
    ),
  },
```

Copy the three commented-out section bodies verbatim from the current file's `shape` step. In
the boundaries section's `<Prose>`, add this paragraph after the existing first one:

```tsx
            <p>
              Each of those folders is a{' '}
              <Term id="bounded-context">bounded context</Term> — a boundary
              inside which a word means exactly one thing. The line belongs
              where the vocabulary changes: if &ldquo;invoice&rdquo; means an
              unpaid obligation to billing and a ticket attachment to somebody
              else, those are two contexts, and forcing one model across both
              costs more than keeping them apart. That is also what{' '}
              <Term id="ubiquitous-language">ubiquitous language</Term> buys —
              the table is called <code className="t-data">claims</code> because
              the people who use the system say &ldquo;claim&rdquo;. Where the
              words in the code and the words in the room drift apart, bugs live
              in the gap.
            </p>
            <p>
              Choosing a boundary and enforcing one are different problems, and
              the second is useless without the first. The test for choosing: a
              feature owns the tables it alone writes. If two features both
              write a table, they are one feature that has not admitted it yet.
            </p>
```

- [ ] **Step 6: Step 05 — `sketch`, new**

Insert after the `shape` entry:

```tsx
  {
    id: 'sketch',
    label: 'Sketch',
    hint: 'Your app is one box; your system is not',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The objection" title="Sketch the system">
          <Prose>
            <p>
              There is an obvious objection to drawing anything at this point:
              if the answer is one application and one database, the diagram is
              two boxes and a line, and drawing it teaches nobody anything.
            </p>
            <p>
              The objection is right about the application and wrong about the
              system. <strong className="font-medium text-fg">
                Your application is one box. Your system is not.
              </strong>{' '}
              The invoicing example takes payments, sends email, renders and
              stores PDFs, and needs something to notice when an invoice has
              gone past its due date. None of those is code you wrote, all of
              them fail on their own schedule, and every one is a decision you
              have already made without writing it down.
            </p>
            <p>
              <Term id="c4-model">C4</Term> is the usual answer to &ldquo;what
              kind of diagram&rdquo;. Four levels — context, container,
              component, code. For one person, context and container earn their
              keep; component is worth drawing for the one subsystem
              complicated enough that you keep re-deriving how it fits together;
              code is what your editor already draws. Draw two diagrams, not
              four.
            </p>
          </Prose>
          <Figure
            n={8}
            caption="The container view. Four of the six boxes are not yours, which is the whole argument for drawing it — select an external one to see what it does and what happens when it is down."
          >
            <SystemSketch />
          </Figure>
        </Section>

        <Section
          eyebrow="One flow, end to end"
          title="Pick the flow that crosses the most boundaries"
        >
          <Prose>
            <p>
              That is where the design decisions hide. Two of the five steps
              below are different in kind from the rest, and the difference is a
              decision the stage has not posed yet.
            </p>
          </Prose>
          <Figure
            n={9}
            caption="Sending an invoice and being paid for it, drawn end to end. Step 2 is a call you make; step 4 is a call somebody makes to you, days later, possibly twice."
          >
            <DataFlow />
          </Figure>
        </Section>

        <Section
          eyebrow="The fork"
          title="Synchronous or asynchronous"
        >
          <Prose>
            <p>
              This is the fork that leads to{' '}
              <Term id="event-driven-architecture">
                event-driven architecture
              </Term>
              , and it has real consequences on each branch. The rule that
              catches people: for anything you <em>receive</em>, you do not get
              to choose.
            </p>
          </Prose>
          <Figure
            n={10}
            caption="The same four questions asked of both branches. The last row is the one that turns into work: asynchronous needs idempotency, and somewhere to put what failed."
          >
            <SyncAsync />
          </Figure>
        </Section>

        <Section
          eyebrow="The consequence"
          title="Anything received has to be safe twice"
        >
          <Prose>
            <p>
              A payment webhook will be delivered twice eventually, and the
              write it triggers has to survive that. That is{' '}
              <Term id="idempotency">idempotency</Term>, and it is a schema
              decision, which is why it belongs in this stage rather than in
              implementation. Two mechanisms cover almost everything.
            </p>
          </Prose>
          <Figure
            n={11}
            caption="The general mechanism and the cheaper one. Insert the row first and do the work second, in one transaction — and then answer the sender success, because a duplicate is the system working."
          >
            <IdempotencyBlock />
          </Figure>
          <div className="mt-6">
            <Callout kind="info" title="What is deliberately not here">
              Full high-level design practice comes with a system specification
              document, a review board, and a sign-off before implementation
              starts. None of that is in this stage, on purpose. The thinking
              survives — what the pieces are, how they talk, what happens when
              one fails — and the paperwork does not, because its actual purpose
              is coordinating people you do not have.
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
```

- [ ] **Step 7: Verify**

Run: `cd web && pnpm typecheck && pnpm lint`. The file will not build until Task 20 replaces the
remaining old steps, so expect exactly one class of error: the old `constrain` and `decide`
steps still referencing figures 4, 5, 8 and 9. Leave them; Task 20 replaces them. If any other
error appears, it is real — fix it here.

- [ ] **Step 8: Commit**

```bash
git add web/src/features/architecture/Architecture.tsx
git commit -m "feat(architecture): assemble steps 01-05 of the nine-step stage

Require and Sketch are new; Shape gains the styles landscape in front of
the conclusion it was previously asserting, and Model gains the
underline-the-nouns method the app never had.

Figures 1-11 are final. The remaining four steps are Task 20, so the tree
is intentionally mid-refactor at this commit.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 20: Assemble steps 06–09

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx`

**Interfaces:**
- Consumes: the imports Task 19 added.
- Produces: `STEPS` complete at nine entries — `reverse`, `require`, `model`, `shape`,
  `sketch`, `schema`, `contract`, `record`, `ai`.

**Implementation-only.**

- [ ] **Step 1: Step 06 — `schema`, replacing `constrain`**

Replace the whole `constrain` entry with:

```tsx
  {
    id: 'schema',
    label: 'Schema',
    hint: 'The model becomes tables, and the rules become constraints',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The shape" title="Design the database">
          <Prose>
            <p>
              Now the model becomes a schema. If your product has organisations
              or teams, read the tenant question in <em>Record</em> before you
              write the first table: the tenant key is the one item on the
              deferral list that cannot be deferred, and it belongs on the
              tables you are about to create.
            </p>
            <p>
              <Term id="normalisation">Normalisation</Term> is the vocabulary
              for how far you have gone in removing duplicated facts. The theory
              is longer than the working rule, which is: if changing one fact
              means updating two rows, the model is wrong. A client&rsquo;s
              address stored on every invoice is not a shortcut, it is four
              hundred rows that will disagree the first time somebody moves.
            </p>
          </Prose>
          <Figure
            n={12}
            caption="The nouns with their cardinality made explicit. Three of the four relationships are obvious; the fourth is a decision, and it is the reason this view is worth drawing at all."
          >
            <ERView />
          </Figure>
        </Section>

        {/* COPY: "Constraints belong in the database", main:190-216, whole
            Section. Two edits: figure n={4} → n={13}, and the bare
            <SchemaInspector /> becomes
            <SchemaInspector lines={SCHEMA_LINES} title="the invoices table" />. */}

        <Section
          eyebrow="Answering real queries"
          title="Indexes come from the sketch, not from intuition"
        >
          <Prose>
            <p>
              Write the queries first and add the index the query needs. Both of
              these come from the system sketch two steps back: one from a
              screen, one from the scheduled job. Indexes cost write time and
              disk, which is why &ldquo;index everything&rdquo; is not the
              answer and &ldquo;index nothing until it hurts&rdquo; is not
              either.
            </p>
          </Prose>
          <Figure
            n={14}
            caption="Two indexes, each traced to the thing that asks for it. The second is partial, because the job never asks about drafts or paid invoices and a smaller index is a faster one."
          >
            <SchemaInspector lines={INDEX_LINES} title="the two indexes" />
          </Figure>
        </Section>

        <Section
          eyebrow="The rule UNIQUE cannot express"
          title="Some constraints have a condition on them"
        >
          <Prose>
            <p>
              The stage names races as the reason constraints belong in the
              database, then supplies only primary keys, foreign keys,{' '}
              <code className="t-data">CHECK</code> and{' '}
              <code className="t-data">UNIQUE</code> — none of which can say
              &ldquo;at most one <em>approved</em> claim per shift&rdquo;. The
              tool is a{' '}
              <Term id="partial-unique-index">partial unique index</Term>.
            </p>
          </Prose>
          <Figure
            n={15}
            caption="The race first, the index second. A plain UNIQUE (shift_id) would also forbid the second rejected claim, which is wrong — the condition is what makes the rule expressible at all."
          >
            <PartialUniqueIndex />
          </Figure>
        </Section>

        <Section
          eyebrow="The two left implicit"
          title="Actors and tenancy are stored data too"
        >
          <Prose>
            <p>
              The invoicing schema has neither, because one freelancer owning
              their own rows needs neither. Most products are not that. If your
              answer to &ldquo;does every actor have the same rights?&rdquo; was
              no, or your tenant is an organisation rather than a person, this
              is the shape.
            </p>
            <p>
              And when the axis is not one level: a company that contains teams
              gives you two candidate keys, and picking wrong costs a migration.
              The rule is that the tenant key is the level at which data stops
              being shared. If a worker moving between teams should keep their
              history, the company is the tenant and the team is an ordinary
              foreign key. If teams are genuinely separate customers who must
              never see each other&rsquo;s rows, the team is the tenant.
            </p>
          </Prose>
          <Figure
            n={16}
            caption="The answer to the fifth interrogation question, written down. Roles live on the membership rather than on the user, because a person can manage one team and be an ordinary member of another."
          >
            <SchemaInspector
              lines={TENANCY_LINES}
              title="the tenancy tables"
            />
          </Figure>
        </Section>

        {/* COPY: "Delete behaviour, decided per entity", main:218-237, whole
            Section. One edit: figure n={5} → n={17}. */}

        <Section
          eyebrow="Beyond one row"
          title="Some invariants no constraint can express"
        >
          <Prose>
            <p>
              Moving an amount from one row to another, or writing a record and
              marking its source consumed, has to happen as one unit or not at
              all. That is a <strong className="font-medium text-fg">
                transaction
              </strong>: the work commits together or none of it does. This is
              the point where a rule stops being the database&rsquo;s job to
              guarantee and starts being yours to demarcate. The database will
              hold the line, but only around the boundary you draw.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
```

Copy the two commented-out section bodies verbatim from the old `constrain` step. The
`SchemaInspector` call inside the first becomes:

```tsx
<SchemaInspector lines={SCHEMA_LINES} title="the invoices table" />
```

- [ ] **Step 2: Step 07 — `contract`, replacing the first half of `decide`**

```tsx
  {
    id: 'contract',
    label: 'Contract',
    hint: 'Promises about shape, and who may do what to which record',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The axis again"
          title="Design the API contracts"
        >
          <Prose>
            <p>
              A contract is a promise about shape, and its real cost is{' '}
              <em>who you can force to move when you break it</em>. That is the
              same reversibility axis this stage opened on, which is why the
              decision belongs here rather than in implementation.
            </p>
            <p>
              A contract means one callable surface with a shape somebody
              depends on — a route, or an exported function another feature
              calls. Not every internal helper. If it crosses a feature boundary
              or leaves your process, it is a contract; if it is private to one
              module, it is code.
            </p>
          </Prose>
          <Figure
            n={18}
            caption="Three kinds of contract, sorted by who you can make move. Most solo projects live almost entirely in the first row, which is the argument for not building a public API until something needs one."
          >
            <ContractCost />
          </Figure>
          <div className="mt-6">
            <RouteShape />
          </div>
          <Prose>
            <p>
              How these are implemented — where validation physically goes, how
              errors are shaped, what a route file should contain — belongs to{' '}
              <Link href="/stages/05-development" className="text-brand">
                05 — Development
              </Link>
              . As with authentication, this stage decides and 05 carries it
              out.
            </p>
          </Prose>
        </Section>

        {/* COPY: "Decide auth early, deliberately", main:359-382, whole
            Section. One edit: figure n={8} → n={19}. */}

        <Section
          eyebrow="Your turn"
          title="Which pattern applies to which entity?"
        >
          <Prose>
            <p>
              The part people get wrong is not authentication but{' '}
              <Term id="authorization">authorization</Term>: deciding whether
              this caller may do this thing to this record. It comes in three
              patterns, and the mistake is assuming there is only one.
            </p>
            <p>
              Ownership is the one everybody reaches for, and it is the one that
              fails quietly. It is correct for a product where each person works
              on their own things, which makes it feel general — until the first
              feature where somebody acts on a record they do not own.
            </p>
          </Prose>
          <div className="mt-5">
            <AuthzPatterns />
          </div>
          <Prose>
            <p>
              Enforcement — where the check physically goes, and what happens
              when a route forgets — is stage 05&rsquo;s.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
```

- [ ] **Step 3: Step 08 — `record`, replacing the rest of `decide`**

```tsx
  {
    id: 'record',
    label: 'Record',
    hint: 'Why you chose it, and what you chose not to build',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The record" title="Write it down now, not later">
          {/* COPY: the <Prose> and <Figure> from "Write it down now, not later",
              main:384-399 — the inner body only, since this Section's own tags
              are written out here. One edit: figure n={9} → n={20}. */}
          <Prose>
            <p>
              &ldquo;Every expensive decision has an{' '}
              <Term id="adr">ADR</Term>&rdquo; is uncheckable until you say what
              counts as one decision. The rule: one ADR per thing that could be
              reversed independently. &ldquo;Next.js, Postgres and Vercel&rdquo;
              is three, because you could move the database without touching the
              framework. &ldquo;Auth.js with a Postgres adapter&rdquo; is one,
              because unpicking either half means redoing both.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The other half"
          title="Deciding also means deciding not to"
        >
          <Prose>
            <p>
              &ldquo;Aggressively&rdquo; needs a test, or it is just a mood.
              Here is the one, and it is this stage&rsquo;s own axis pointed at
              infrastructure:{' '}
              <strong className="font-medium text-fg">
                defer anything whose reversal does not require migrating stored
                data.
              </strong>{' '}
              Adding a cache later touches code. Adding a queue later touches
              code. Those are afternoons, and you will make the decision with
              information you do not have today —{' '}
              <Term id="yagni">YAGNI</Term> applied to infrastructure rather
              than to features.
            </p>
            <p>
              Two of the items below are worth knowing the boundary of.{' '}
              <Term id="event-sourcing">Event sourcing</Term> is not an audit
              table alongside normal rows: it is event sourcing only when the
              log is the truth and the tables you query are derived from it. A
              history of who approved what is an ordinary table and you should
              keep it. <Term id="cqrs">CQRS</Term> travels with it and gets
              deferred for the same reason.
            </p>
            <p>
              One item fails the test, and the list says which.
            </p>
          </Prose>
          <div className="mt-5">
            <DeferredList />
          </div>
        </Section>
      </div>
    ),
  },
```

- [ ] **Step 4: Step 09 — `ai`, unchanged**

Keep the existing `ai` entry verbatim, including `<References slug="03-architecture" />`. Add one
`Callout` at the top of its traps list, before "Designing for imagined scale":

```tsx
            <Callout kind="trap" title="Choosing a style before choosing characteristics">
              The answer sounds identical either way — &ldquo;a modular
              monolith&rdquo; — and only one of them is a decision. The other is
              a preference you will not be able to defend the first time it is
              questioned, including by yourself.
            </Callout>
```

- [ ] **Step 5: Verify the whole stage builds**

Run: `cd web && pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: all clean, and the build prerenders all 22 routes.

- [ ] **Step 6: Walk all nine steps in a browser**

`pnpm dev`, then visit each of the nine hashes in turn. Confirm the rail shows nine tabs and
scrolls horizontally at 320px, every figure number is unique and ascending, and no step throws
in the console.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/architecture/Architecture.tsx
git commit -m "feat(architecture): assemble steps 06-09, completing the nine-step stage

constrain becomes schema and grows the ER view, the indexes, the partial
unique index, the tenancy tables and transactions. decide splits into
contract (API contracts plus auth and authorization) and record (ADRs and
deferral), because one step carries one decision under D-49 and the old
step carried four.

The traps list gains the doc's new first trap: choosing a style before
choosing characteristics. Both answers sound the same and only one of
them is a decision.

Closes the structural half of TD-23.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 21: Terms, references, and the figure audit

**Files:**
- Modify: `web/src/lib/references.ts:82-107`
- Modify: `web/src/features/architecture/Architecture.tsx` (only if the figure audit finds a gap)
- Test: `web/src/lib/references.test.ts` already covers reference shape; read it before adding.

**Interfaces:**
- Consumes: the assembled `STEPS`.
- Produces: three new entries in `REFERENCES['03-architecture']`.

- [ ] **Step 1: Audit the terms actually wired**

Run this and read the output against the list in the spec:

```bash
cd web && grep -rho 'Term id="[^"]*"' src/features/architecture/ | sort -u
```

All fourteen must appear: `architecture-characteristic`, `modular-monolith`, `microservices`,
`serverless`, `hexagonal-architecture`, `bounded-context`, `ubiquitous-language`, `c4-model`,
`event-driven-architecture`, `idempotency`, `normalisation`, `partial-unique-index`,
`event-sourcing`, `cqrs` — alongside the ten the stage already used. Wire any that are missing
at their first use. Report the before and after lists.

- [ ] **Step 2: Audit the figures**

```bash
cd web && grep -o 'n={[0-9]*}' src/features/architecture/Architecture.tsx | sort -t'{' -k2 -n
```

Expected: `n={1}` through `n={20}`, each exactly once. A duplicate or a gap is a real defect —
figure numbers run across the stage and a reader following "see figure 12" has to land on the
right one. Fix any and say what you found.

- [ ] **Step 3: Add the three references**

Append to the `'03-architecture'` array in `web/src/lib/references.ts`:

```ts
    {
      title: 'Fundamentals of Software Architecture',
      source: 'Mark Richards & Neal Ford',
      url: 'https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/',
      adds: 'Where "architecture characteristics" comes from as a term, and the longer version of why you pick a few rather than list many. The book is explicit that the list is unbounded and the choosing is the work, which is the part this stage compresses into one exercise.',
    },
    {
      title: 'The C4 model for visualising software architecture',
      source: 'Simon Brown',
      url: 'https://c4model.com',
      adds: 'The four levels, from the person who defined them, with far more on notation than this stage needs. Go here when the container view stops being enough — the component level is the one worth reading properly, and it is the one this stage tells you to draw only once.',
    },
    {
      title: 'Hexagonal Architecture',
      source: 'Alistair Cockburn',
      url: 'https://alistair.cockburn.us/hexagonal-architecture/',
      adds: 'The original, and shorter than its reputation. Worth reading for what it does not claim: it is a way to keep the domain testable without the database, not a layering scheme, and most of the ceremony people associate with it was added later by other people.',
    },
```

- [ ] **Step 4: Verify every reference resolves**

Each URL must be checked as actually resolving, not assumed. Report the status code for each.
A reference that 404s is worse than no reference.

- [ ] **Step 5: Run the suite**

Run: `cd web && pnpm test && pnpm typecheck && pnpm lint`
Expected: clean, including `source-citations.test.ts`, which resolves every doc heading cited by
the new components. If it fails, a component cites a heading that does not exist in
`docs/03-architecture.md` — fix the citation, not the doc.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/references.ts web/src/features/architecture/
git commit -m "feat(architecture): wire the fourteen new terms and add three references

The terms shipped in W-3.1 and were defined but never used inline, so the
app's vocabulary was still the ten stage 03 launched with.

References for the three ideas the stage now names but does not own:
Richards and Ford on characteristics, Brown on C4, Cockburn on hexagonal
— the last worth reading for what it does not claim.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 22: The audit sweep and the verification passes

**Files:**
- Modify: `web/e2e/audit.spec.ts:9-30`

**Interfaces:**
- Consumes: the nine step ids.
- Produces: a `PAGES` array covering all nine.

- [ ] **Step 1: Replace the stage 03 hashes**

The six old hashes include two ids that no longer exist. Replace them with:

```ts
  '/stages/03-architecture#reverse',
  '/stages/03-architecture#require',
  '/stages/03-architecture#model',
  '/stages/03-architecture#shape',
  '/stages/03-architecture#sketch',
  '/stages/03-architecture#schema',
  '/stages/03-architecture#contract',
  '/stages/03-architecture#record',
  '/stages/03-architecture#ai',
```

Nothing fails if you forget this (TD-12), which is exactly why it is a named step rather than
something to notice.

- [ ] **Step 2: Run the audit suite**

Run: `cd web && pnpm test:e2e`
Expected: 10 tests pass over 23 URLs. Paste the output.

- [ ] **Step 3: The 320px pass, by hand**

The suite checks document overflow, which is necessary and not sufficient. At 320px, walk all
nine steps and confirm by eye: every SQL block scrolls inside its own container rather than
scrolling the page, the three-option radiogroup in `AuthzPatterns` stacks to one column, the ER
edge rows wrap, and nothing below `lg` has a touch target under 44px.

- [ ] **Step 4: The contrast pass**

Every distinct text/background pair, both themes, all nine steps, WCAG AA. Read
`docs/learnings/contrast-checkers-lie.md` first. Three of the failures ever reported in this
repo were the checker, and the parser must handle `oklab()` — Tailwind emits it for alpha
backgrounds. New pairs this round: the dashed external-node border in `SystemSketch`, the
`warn`-bordered "fails the test" badge in `DeferredList`, and the `brand`-bordered "what this
stage teaches" badge in `DeploymentStyles`.

- [ ] **Step 5: The console pass**

Zero errors in a clean browser context, all nine steps. A hydration warning counts as a failure
here — `CharacteristicPicker` and `YourCharacteristics` both read localStorage, which is the
exact shape of bug `useLocalStorage` exists to prevent, so a warning means it was bypassed.

- [ ] **Step 6: The D-49 length check**

Walk each of the nine steps and check it against the rule this round records: one decision, at
most one committed exercise. Step 06 `schema` is the one to watch — it carries six figures, more
than any other. If it reads as a scroll, the fix is **not** to split it, because it is one doc
movement and splitting it would break D-49 in the round that states it. Fold `DeleteBehaviour`
into the constraints section as a sub-part instead, and report that you did.

- [ ] **Step 7: Commit**

```bash
git add web/e2e/audit.spec.ts
git commit -m "test(architecture): sweep all nine stage 03 steps in the audit suite

Two of the six hashes no longer existed, and three steps were new. The
list is hand-maintained (TD-12) and nothing fails when it is wrong, which
is why this is a step rather than something to notice.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 23: Record the round

**Files:**
- Modify: `docs/tracker.md`
- Modify: `docs/task.md:237-262`
- Modify: `web/PATTERNS.md:40-53`
- Modify: `KICKOFF.md`

- [ ] **Step 1: Append D-49**

Append to the decisions table in `docs/tracker.md`. Do **not** edit D-38 — decisions are
appended and superseded, never rewritten, because the record of what was believed at the time is
the value. Note in D-49 that it supersedes D-38, and state the untested half explicitly:

> **D-49** — A step is one decision the reader makes, and carries at most one committed
> exercise. Step count follows from how many decisions the stage's doc teaches. **Supersedes
> D-38**, which capped step count at five plus AI. Reasoning: count does not control length,
> contents do; five steps holding thirteen subsections is longer per step than nine holding
> thirteen. Stage 04 does not inherit nine, it inherits the obligation to show its doc teaches
> that many decisions, which is checkable against the doc's own headings. Follow-up: the step
> count and audit coverage are testable and the one-exercise rule is not, because this repo has
> no component harness by choice — it lives in `PATTERNS.md` as a review rule, and this decision
> records that gap rather than implying a gate that does not exist.

- [ ] **Step 2: Close TD-23**

Mark TD-23 closed with evidence: the commit range, the test count from a clean `.next`, the
audit suite result over 23 URLs, and the fact that doc and app now carry the same thirteen
subsections. Evidence, not adjectives — "reviewed + merged" is not evidence.

- [ ] **Step 3: Add the W-3.2 shipped entry**

With its `Deferred:` list. At minimum it carries: TD-19 and TD-20 (both now one row worse, since
`AuthzPatterns` is a fourth scored radiogroup), TD-12 if Task 24 was cut, and the
`Stepper.tsx:128` zero-padding limit at ten steps.

- [ ] **Step 4: Tick W-3.2 in `docs/task.md`**

Tick each checkbox that actually shipped, and leave unticked anything that did not — the entry
at `docs/task.md:230` records a previous round ticking something in error, which is the failure
to avoid repeating.

- [ ] **Step 5: Update `web/PATTERNS.md`**

The 4–6 guidance at `:42` and `:49-53` becomes a typical range rather than a cap, with D-49's
rule stated beside it and the review-rule caveat named. Also add any interaction pattern this
round produced that is genuinely new rather than an instance of an existing row — check the
existing table honestly before adding, since "selectable node with a two-part payload" may just
be click-node inspector.

- [ ] **Step 6: Refresh `KICKOFF.md`**

Project state: stage 03 complete on both surfaces, TD-23 closed, the step count and test count
current. Delete closed items rather than leaving them ticked. A stale kickoff is worse than none
because it is trusted.

- [ ] **Step 7: Run the humanizer pass**

Run `humanizer:humanizer` over the prose added to `PATTERNS.md` and `KICKOFF.md`. Skip the
tracker entries and tables, where the flagged patterns are not the problem.

- [ ] **Step 8: Commit**

```bash
git add docs/tracker.md docs/task.md web/PATTERNS.md KICKOFF.md
git commit -m "docs(tracker): record D-49 and close TD-23

D-49 supersedes D-38 by moving the ceiling off step count and onto step
contents. D-38 is left as written, because the record of what was
believed at the time is the value.

The decision records its own untested half: step count and audit coverage
are testable here, the one-exercise-per-step rule is not, and saying so
is what keeps it from being a gate that does not exist.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 24 (optional — cut this first): close TD-12's silent half

**Files:**
- Modify: `web/src/features/architecture/Architecture.tsx`, `web/src/features/discovery/`,
  `web/src/features/planning/` (export step ids)
- Modify: `web/src/features/stage-content.ts`
- Create: `web/src/lib/audit-coverage.test.ts`

This closes the half of TD-12 that actually bites: nothing fails when `PAGES` is wrong. It
touches all three built stages, which puts it outside the round's core scope — cut it if the
round has run long, and say so in the tracker rather than leaving it implied.

- [ ] **Step 1: Write the failing test**

Create `web/src/lib/audit-coverage.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { STAGE_STEP_IDS } from '@/features/stage-content'

const AUDIT = readFileSync(
  fileURLToPath(new URL('../../e2e/audit.spec.ts', import.meta.url)),
  'utf8',
)

// TD-12: PAGES is hand-written, and nothing fails when a ready stage's step is
// missing from it. A stage could ship unaudited with the suite green, which is
// the worst shape a gate can have — it reports success for work it never did.
test('every step of every ready stage is swept by the audit suite', () => {
  for (const [slug, ids] of Object.entries(STAGE_STEP_IDS)) {
    for (const id of ids) {
      expect(AUDIT, `${slug}#${id} is not in PAGES`).toContain(
        `/stages/${slug}#${id}`,
      )
    }
  }
})
```

- [ ] **Step 2: Run and verify failure**

Run: `cd web && pnpm vitest run src/lib/audit-coverage.test.ts`
Expected: fails to collect — `STAGE_STEP_IDS` is not exported from `@/features/stage-content`.

- [ ] **Step 3: Export the ids from each stage**

In each of the three stage feature files, hoist the ids out of the `STEPS` array:

```ts
export const STEP_IDS = STEPS.map((s) => s.id)
```

Then in `web/src/features/stage-content.ts`, add:

```ts
export const STAGE_STEP_IDS: Record<string, string[]> = {
  '01-product-discovery': DISCOVERY_STEP_IDS,
  '02-planning': PLANNING_STEP_IDS,
  '03-architecture': ARCHITECTURE_STEP_IDS,
}
```

importing each stage's `STEP_IDS` under an aliased name. Read `stage-content.ts` first: it
already imports each stage's component, so the import shape is established and this follows it
rather than inventing a second registry.

- [ ] **Step 4: Run and verify pass**

Run: `cd web && pnpm vitest run src/lib/audit-coverage.test.ts`
Expected: PASS, given Task 22 already fixed `PAGES`.

- [ ] **Step 5: Teeth check**

Delete one stage 03 hash from `PAGES` and confirm the test fails and names it. That is the
failure mode TD-12 describes, caught for the first time. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/ web/src/lib/audit-coverage.test.ts
git commit -m "test(web): fail when a ready stage's step is not audited

Closes TD-12's silent half. PAGES stays hand-written, which is fine; what
was not fine is that a wrong PAGES reported success for work the suite
never did. A gate that passes for pages it never visited is worse than no
gate, because it is believed.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

Run from `web/`, in this order, cheapest first — the same order CI uses:

```bash
rm -rf .next          # a bare tsc passes on a dirty .next; CI checks out clean
pnpm format:check
pnpm lint             # --max-warnings 0
pnpm typecheck        # runs next typegen first
pnpm test             # 136 existing + 69 new (4+3+3+3+11+5+8+11+12+8, plus 1 if Task 24
                      # ships) = ~205 across ~17 files
pnpm build            # prerenders all 22 routes
pnpm test:e2e         # 10 tests over 23 URLs
```

Then, against a live build and not asserted:

- **All nine steps, both themes, 320 / 768 / 1024 / 1440 / 2560px.** No horizontal page overflow,
  no touch target under 44px below `lg`.
- **Contrast, WCAG AA, every distinct pair.** Read `docs/learnings/contrast-checkers-lie.md`
  first; a checker reporting mass failures is usually the checker.
- **Zero console errors**, hydration warnings included.
- **D-49 per-step check.** One decision per step, at most one committed exercise. Step 06 is the
  one at risk.
- **Doc and app agree.** Walk `docs/03-architecture.md`'s thirteen subsections against the nine
  steps and confirm every one has a counterpart. This is the actual close condition for TD-23,
  and it is a reading task, not a command.

Then the whole-branch review before merge, per `superpowers:requesting-code-review`. It is
load-bearing rather than ceremony: most of stage 03's original defects were plan-authored rather
than implementer error, and a per-task review sees one diff at a time.

# Stage 03 Doc Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Amend `docs/03-architecture.md` so it runs requirements → HLD → LLD, names the
architecture styles landscape, and closes all 14 cold-reader gaps — closing TD-22, TD-21 and
TD-18.

**Architecture:** Eight subsections of "The work" become thirteen. The TD-22 inversion is
fixed by splitting "Model the domain first" into a conceptual section (HLD) and a database
section (LLD), then inserting four new sections around them. The app is not touched this
round; `web/src/lib/terms.ts` is, because it is the single source for the glossary.

**Tech Stack:** Markdown, TypeScript (`terms.ts` only), vitest (file-snapshot glossary test).

**Spec:** `docs/superpowers/specs/2026-07-29-stage-03-doc-round-design.md`

## A note on TDD in this plan

The spec says plainly that prose has no unit test, and this plan does not pretend
otherwise. Manufacturing assertions that pass regardless of whether the writing works is
the vacuous-test failure the teeth-check convention exists to catch.

What is genuinely testable is tested first:

- **Task 1 and every task adding glossary terms** have a real RED → GREEN cycle: editing
  `terms.ts` breaks `glossary.test.ts`'s file snapshot, and `pnpm gen:glossary` fixes it.
- **Task 2 adds a committed structure test** that pins the thirteen `###` headings in order.
  This is **beyond spec** — flagged for easy removal — and included because the restructure
  is the round's highest-risk mechanical operation and currently has zero automated
  protection. It also pays down part of TD-5.
- **Prose quality is gated by the cold-reader re-run in Task 9**, not by assertions.

Steps that say "write the section" carry the section's claims, worked-example values and
gap-closing lines inline. They are not placeholders — the substance is specified; only the
final sentence-level wording is the implementer's.

## Global Constraints

- **D-44** — teach the trade-off, do not change the recommendation. Monolith-first, modular
  boundaries and defer-aggressively all stand. If a draft of section 4 reads on its own as
  advocacy for microservices, it is wrong regardless of what section 5 says afterward.
- **D-42** — cite a doc section by its **heading**, never a line number. A range only where
  the exact lines are the point, and then it names the heading too.
- **D-20** — `humanizer:humanizer` pass over the amended doc before the round is done.
- **D-5** — stage numbers are filing codes. Nothing added may imply stages run in sequence.
- **Stage 02 owns functional requirements.** Stage 03 states it consumes them and restates
  nothing.
- **Stage 05 owns API implementation.** Stage 03 decides contracts and links to 05, exactly
  as the existing auth section already does.
- **No specification documents, no sign-off.** The doc says this omission is deliberate.
- **G9 stays deferred** to stage 10 (D-39). Do not close it.
- **Live gates that must stay green:** `web/src/lib/stage-metadata.test.ts` (H1 matches
  `stages.ts`; `### AI in ...` exists) and `web/src/lib/glossary.test.ts` (file snapshot).
- **The doc will land near 600 lines.** Accepted. Do not compress content to hit a length.
- All commands run from `web/`. Commit after every task.

---

### Task 1: Close G3 — authorization, in the doc and the glossary term

The blocking gap, scheduled first because it is the only one that produces a *confident
wrong answer* rather than a stall. Same defect in two places: the doc offers only ownership,
and `terms.ts` defines `Authorization` as ownership.

**Files:**
- Modify: `web/src/lib/terms.ts` — the `authorization` entry
- Modify: `reference/glossary.md` — generated, never hand-edited
- Modify: `docs/03-architecture.md` — section "Authentication: decide early, deliberately"

**Interfaces:**
- Consumes: nothing.
- Produces: the three-pattern authorization vocabulary (**ownership**, **role**,
  **membership**) that Task 8's Definition-of-done line refers to.

- [ ] **Step 1: Write the failing test — edit the term**

In `web/src/lib/terms.ts`, replace the `authorization` entry's `full` and `soWhat`. The
current `full` is *"The check that this particular record belongs to this particular
caller"* — that is the defect. New content:

- `short`: keep the existing one-liner only if it does not say "belongs to the caller";
  otherwise "The check that this caller may do this thing to this record."
- `full`: names three patterns. **Ownership** — the row carries the caller's id, and you
  compare them. **Role** — the caller holds a role that grants the action, regardless of who
  owns the row. **Membership** — the caller belongs to a group that the row also belongs to,
  which is what shared-workspace products actually need.
- `soWhat`: why ownership is the dangerous default — it is right often enough to feel
  general, and it fails silently on the first product where one person acts on another
  person's record.

- [ ] **Step 2: Run the test and confirm it fails for the right reason**

```bash
cd web && pnpm test src/lib/glossary.test.ts
```

Expected: FAIL — `reference/glossary.md is in sync with terms.ts`, a snapshot mismatch
showing the old Authorization prose against the new. **Paste this output into the task
report.** A pass here means the edit did not land.

- [ ] **Step 3: Regenerate the glossary**

```bash
cd web && pnpm gen:glossary
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
cd web && pnpm test src/lib/glossary.test.ts
```

Expected: PASS. Confirm `reference/glossary.md` was modified and still carries its
"Generated … Do not edit by hand" header.

- [ ] **Step 5: Fix G3 in the doc**

In `docs/03-architecture.md`, under "Authentication: decide early, deliberately", the
paragraph beginning "The part people get wrong is not authentication but **authorization**"
currently offers ownership alone. Replace with the three patterns, each with the question
that selects it:

| Pattern | The question | Where it holds |
|---|---|---|
| Ownership | Does this row carry the caller's id? | A user's own invoices, notes, drafts |
| Role | Does this caller hold a role that grants the action? | A manager approving someone else's request |
| Membership | Do the caller and the row belong to the same group? | Anything with shared workspaces or teams |

Add the sentence that makes the DoD satisfiable: most products need more than one, and the
decision is *which pattern applies to which entity*, written down per entity rather than
chosen once for the system. Keep enforcement pointing at
`05-development.md#server-actions-need-validation-and-authorization` — do not teach
enforcement here.

- [ ] **Step 6: Confirm the live gates still pass**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
```

Expected: all green. `terms.ts` is TypeScript, so lint and typecheck are not optional.

- [ ] **Step 7: Commit**

```bash
git add web/src/lib/terms.ts reference/glossary.md docs/03-architecture.md
git commit -m "docs(architecture): name the ownership/role/membership split (closes G3)"
```

Body should record that the glossary term carried the same defect as the prose, which no
tracker entry had noticed.

---

### Task 2: Pin the section structure with a test, then restructure

The riskiest mechanical operation in the round. The test goes in first so the restructure
has something to satisfy.

**Beyond spec — easy to cut.** The spec's Verification says links are re-checked by hand
because the P-4 script no longer exists (TD-5). This task commits a structure test instead
of relying on eyes. Remove this task's test half if unwanted; the restructure half stays.

**Files:**
- Create: `web/src/lib/stage-03-structure.test.ts`
- Modify: `docs/03-architecture.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the thirteen-heading order every later task writes into. Later tasks fill
  sections; none may reorder them without updating this test.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// The stage 03 round (W-3.1) restructured "The work" from eight subsections to
// thirteen, running requirements -> HLD -> LLD. The order is load-bearing: the
// styles taxonomy sits BEFORE "Start with one application" so the recommendation
// arrives derived rather than asserted (D-44). Nothing else would catch a
// reorder, so this pins it.
const DOC = fileURLToPath(
  new URL('../../../docs/03-architecture.md', import.meta.url),
)

const EXPECTED = [
  'Sort decisions by reversibility',
  'What this system has to be',
  'Model the domain first',
  'The shapes a system can take',
  'Start with one application',
  'Boundaries inside the monolith',
  'Sketch the system',
  'Design the database',
  'Design the API contracts',
  'Authentication and authorization',
  'Write the ADRs',
  'Defer aggressively',
  'AI in architecture',
]

test('stage 03 "The work" carries its thirteen subsections in order', () => {
  const md = readFileSync(DOC, 'utf8')
  const headings = [...md.matchAll(/^### (.+)$/gm)].map((m) => m[1].trim())
  expect(headings).toEqual(EXPECTED)
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm test src/lib/stage-03-structure.test.ts
```

Expected: FAIL showing the current eight headings against the expected thirteen — the
current list still has "Authentication: decide early, deliberately" and lacks the four new
sections. **Paste this into the task report.**

- [ ] **Step 3: Restructure the doc**

Structural only — no new teaching content in this task. Content lands in Tasks 3–8.

1. Rename "Authentication: decide early, deliberately" → "Authentication and
   authorization". Task 1's content stays.
2. Split "Model the domain first": the nouns block and the four interrogation questions stay
   under that heading; the `CREATE TABLE` block, the "Encode these as database constraints"
   paragraph and the money/CHECK/RESTRICT notes **move out** into a new "Design the database"
   section positioned after "Sketch the system".
3. Insert the four new headings: "What this system has to be", "The shapes a system can
   take", "Sketch the system", "Design the API contracts". Each gets **one real sentence
   stating what the section decides** — not a placeholder, because this commit ships a
   coherent doc. Tasks 3, 4, 6 and 7 expand them. Suggested: "Before shaping a system, name
   the three or four things it has to be good at." · "Two questions get collapsed into one:
   how it deploys, and how it is organised inside." · "One application is still not one box
   — draw what it depends on." · "A contract's cost is who you can force to move when it
   changes."
4. Reorder to match `EXPECTED`.

- [ ] **Step 4: Run the test and confirm it passes**

```bash
cd web && pnpm test src/lib/stage-03-structure.test.ts
```

Expected: PASS.

- [ ] **Step 5: Teeth-check the new test**

Swap two adjacent headings in the doc, re-run, confirm **only** this test fails, then put
them back. A structure test that passes on a reordered doc is worthless. **Record the
teeth-check output in the task report.**

- [ ] **Step 6: Confirm the other gates still pass**

```bash
cd web && pnpm test
```

Expected: all green — H1 unchanged, `### AI in architecture` still present.

- [ ] **Step 7: Commit**

```bash
git add web/src/lib/stage-03-structure.test.ts docs/03-architecture.md
git commit -m "docs(architecture): restructure the work into thirteen subsections"
```

---

### Task 3: Section 1 gains G14; section 2 is written

**Files:**
- Modify: `docs/03-architecture.md` — sections "Sort decisions by reversibility" and "What
  this system has to be"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 2's heading order.
- Produces: the three chosen characteristics (**auditability**, **correctness**,
  **cheap to run**) that Tasks 4, 5 and 7 trace back to.

- [ ] **Step 1: Add the glossary term (the failing test)**

Add `architecture-characteristic` to `terms.ts`: named as *architecture characteristics* by
Richards & Ford and as *non-functional requirements* almost everywhere else — one idea, two
vocabularies. `soWhat`: they trade against each other, so a list of twenty is a list of
none.

- [ ] **Step 2: Run and confirm RED**

```bash
cd web && pnpm test src/lib/glossary.test.ts
```

Expected: FAIL, snapshot mismatch. Paste into the report.

- [ ] **Step 3: Regenerate and confirm GREEN**

```bash
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts
```

- [ ] **Step 4: Close G14 in section 1**

The section currently gives two example lists (expensive / cheap) and no way to produce your
own. The test exists in the doc already, but is buried in the AI section framed as a prompt
for a model. Promote it into "Sort decisions by reversibility" as the stated rule the two
lists exemplify:

> Ask what would have to change, how many call sites touch it, and whether any of it is
> stored data. The last one dominates: code is refactorable and data has to be migrated.

Place it **before** the two lists, so they read as worked examples of the test rather than
as things to memorise. Task 8 removes the duplicate from the AI section.

- [ ] **Step 5: Write section 2 — "What this system has to be"**

Claims, in order:

1. The stage has been sorting decisions by cost. This asks what the decisions are *for*.
2. Both names for one idea, per the glossary term.
3. A candidate list to choose from, not to complete: availability, correctness,
   auditability, latency, scalability, security, cost to run, deployability, evolvability,
   observability.
4. **The rule: pick three or four.** They trade. High availability costs money; strong
   auditability costs write throughput; cheap-to-run costs both.
5. Worked example — the invoicing app picks **auditability** (financial records get asked
   about years later), **correctness** (money that disagrees with itself is worse than money
   that is slow), **cheap to run** (one person is paying for it). And declines, explicitly:
   high availability (a few hours down is survivable when nobody sends invoices at 3am), low
   latency (nobody is in a hurry), scale.
6. **The trace-forward table, which is what makes the section load-bearing:**

| Characteristic | What it forces later in this stage |
|---|---|
| Auditability | Soft delete over hard delete; an immutable record of what was sent |
| Correctness | Constraints in the database, not the application; money as integer cents |
| Cheap to run | One application, one database, no queue until something demands it |

7. The test: **a characteristic that traces to no decision was not chosen, it was listed.**
8. One sentence stating this consumes stage 02's functional requirements and does not
   restate them, citing `02-planning.md` by heading per D-42.

- [ ] **Step 6: Update Artifacts and Definition of done**

Artifacts gains: "Three or four architecture characteristics, each traced to a decision in
this stage." Definition of done gains: "- [ ] Characteristics chosen, and each one traced to
a decision it forced".

- [ ] **Step 7: Run the gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): ask what the system has to be before shaping it"
```

---

### Task 4: Section 4 — the styles taxonomy

TD-21's first half. The task most at risk of violating D-44 — read the Global Constraints
line about advocacy before writing.

**Files:**
- Modify: `docs/03-architecture.md` — "The shapes a system can take", and the opening of
  "Start with one application"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 3's three characteristics.
- Produces: the term **modular monolith**, which Task 5 uses to name what section 6 teaches.

- [ ] **Step 1: Add the glossary terms (the failing test)**

Add to `terms.ts`: `modular-monolith`, `microservices`, `event-driven-architecture`,
`serverless`, `hexagonal-architecture`. Each `soWhat` states what would have to be true to
choose it, not why it is popular.

- [ ] **Step 2: Run and confirm RED, then regenerate and confirm GREEN**

```bash
cd web && pnpm test src/lib/glossary.test.ts     # FAIL — paste into report
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 3: Write the section**

Open with the distinction most treatments blur, because it is the thing that makes the rest
readable:

> These are two questions, not one. **How is it deployed** — one unit or many? And **how is
> it organised inside** — what depends on what? A hexagonal monolith is an ordinary,
> sensible thing. "Monolith or microservices" is a bad question because it collapses the two.

Then the deployment table. Every row states what would have to be true, and no row is
written as a recommendation:

| Style | What it buys | What it costs | Choose it when |
|---|---|---|---|
| Monolith | One process, one deploy, refactoring is a rename | Everything scales together; one bad deploy takes it all | Almost always, starting out |
| Modular monolith | The above, plus boundaries that make a later split mechanical | Discipline with no enforcement — the boundaries hold only while you keep them | You expect the system to outlive your first guess at its shape |
| Microservices | Independent deploy cadence, independent scaling, team autonomy | Network failure modes, distributed debugging, data consistency across services | Teams need to deploy without coordinating — an organisational problem, not a technical one |
| Serverless | No servers to run, scales to zero, pay per use | Cold starts, execution limits, vendor coupling, awkward long-running work | Load is spiky or near zero, and the work fits the limits |

Then internal organisation, briefly: layered, and hexagonal / ports-and-adapters — what each
is for, and that both are compatible with any row above.

Then event-driven as a third axis: not a deployment shape but a **communication style**, and
available inside a monolith. Cross-reference section 7's integration-style decision.

Close by naming the stage's own approach — **modular monolith** — and tracing to Task 3's
characteristics: cheap-to-run rules out microservices and serverless for this system;
correctness favours one database with real constraints over consistency across services.

- [ ] **Step 4: Reframe section 5's opening**

"Start with one application" currently opens by asserting the default. It now opens as a
conclusion drawn from sections 2 and 4 — the answer follows from characteristics already
chosen and alternatives already seen. **The section's content does not otherwise change**,
and the recommendation is identical. Only its standing changes: prescription becomes
conclusion.

- [ ] **Step 5: Update Artifacts and Definition of done**

Definition of done gains: "- [ ] Architecture style named, with the alternatives you
rejected and the reason each was rejected".

- [ ] **Step 6: Check the D-44 constraint deliberately**

Re-read section 4 alone, as if sections 2 and 5 did not exist. If it reads as advocacy for
distribution, rewrite the "Choose it when" cells — they are where advocacy leaks in.
**Record this check in the task report.**

- [ ] **Step 7: Run the gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): name the styles landscape the stage was teaching unnamed"
```

---

### Task 5: Section 3 gains G1, G2, G6, G7; section 6 gains the DDD vocabulary

**Files:**
- Modify: `docs/03-architecture.md` — "Model the domain first" and "Boundaries inside the
  monolith"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 2's split (the DDL has already moved out); Task 4's `modular-monolith`.
- Produces: the feature-ownership rule Task 6's data-flow view depends on.

- [ ] **Step 1: Add the glossary terms (the failing test)**

Add `bounded-context` and `ubiquitous-language` to `terms.ts`. Bounded context's `soWhat`
carries Fowler's reasoning: total unification of a domain model across a large system is not
cost-effective, and boundaries follow the lines where people already use words differently.

- [ ] **Step 2: Run and confirm RED, then regenerate and confirm GREEN**

```bash
cd web && pnpm test src/lib/glossary.test.ts     # FAIL — paste into report
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 3: Close G1 — how to get from a product description to nouns**

The section currently shows a finished entity block. Add the derivation, two or three
sentences, before it: take each vertical slice from stage 02 (cite by heading "Sequence in
vertical slices"), underline every noun in its sentence, then strike the ones that are
attributes of another noun. What survives is the candidate entity list. Note that the list
is wrong on the first pass and that the interrogation below is what corrects it.

- [ ] **Step 4: Close G2 — a fifth interrogation question**

Add after the existing four:

> **Does every actor have the same rights over this entity?** If a manager can approve a
> swap that the requester cannot, then role is part of your model, not a column you add
> later. This is the question that decides whether "Manager" is an entity, a column, or a
> role — and it feeds the authorization pattern below.

Cross-reference section 10 by heading.

- [ ] **Step 5: Close G6 — generalise the deletion heuristic**

The existing treatment covers financial records only. Generalise: keep anything someone will
later ask *"where did that go?"* about — cancelled bookings, withdrawn requests, departed
users. Say plainly that this is a wider net than "financial", and that the cost of soft
delete is that every query must remember to filter.

- [ ] **Step 6: Close G7 — the derived-versus-stored test**

The doc computes `overdue` and stores `paid` without stating the difference. State it:

> Compute it if it is a pure function of data you already hold. Store it if it is a fact
> about a moment — the tax rate when the invoice was sent, the price at the time of
> purchase. Those are not derivable later, because the source they would derive from has
> since changed.

- [ ] **Step 7: Name bounded context and close G11 in section 6**

In "Boundaries inside the monolith": name **bounded context** for what the section already
teaches, and **ubiquitous language** for why boundaries land where words change meaning.
Then close G11 — the doc gives a rule for *enforcing* boundaries but not for *choosing*
them, and states it only for reads:

> A feature owns the tables it alone writes. That is the test. Reads across a boundary go
> through the owner's exported function; **writes across a boundary do too**, and if two
> features both write a table, they are one feature that has not admitted it yet.

The write half matters because approval flows write across the seam, which the read-only
rule never covered.

- [ ] **Step 8: Run the gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): derive the entity list, and name bounded context"
```

---

### Task 6: Section 7 — sketch the system

The HLD artifact TD-22 exists for. Its failure mode is demonstrating that HLD is pointless,
which is why the worked example scales here.

**Files:**
- Modify: `docs/03-architecture.md` — "Sketch the system"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 3's characteristics; Task 5's feature-ownership rule.
- Produces: the sync/async vocabulary Task 7's contract-reversibility sort reuses.

- [ ] **Step 1: Add the glossary terms (the failing test)**

Add `c4-model` and `idempotency` to `terms.ts`. Idempotency earns entry because the webhook
in this section cannot be taught without it.

- [ ] **Step 2: Run and confirm RED, then regenerate and confirm GREEN**

```bash
cd web && pnpm test src/lib/glossary.test.ts     # FAIL — paste into report
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 3: Scale the worked example, and say why**

Open by admitting the objection directly, because a reader who has followed the stage will
raise it: if the answer is one application and one database, what is there to draw? Then
answer it — the application is one box, and the system is not. The invoicing app really
talks to a payment provider, an email sender, something that renders and stores PDFs, and
something scheduled that notices an invoice went overdue. **Those are the parts that fail
independently of you**, which is what makes the sketch worth drawing.

- [ ] **Step 4: Name C4 and state which levels earn their keep**

Four levels: context, container, component, code. For one person, context and container earn
their keep; the component level is worth drawing for the one subsystem that is genuinely
intricate; the code level is what an IDE already draws. Say that, so a reader does not
produce four diagrams out of obligation.

- [ ] **Step 5: Draw the three views**

A container view as a fenced ASCII block — the Next.js application, Postgres, and the four
external systems, with the direction of each call marked. A deployment view, brief, because
for this system it is nearly the same picture and saying so is more honest than padding it.
A data-flow view for one flow chosen to cross the seam: **invoice sent → payment received →
invoice marked paid**, where sending is synchronous and the payment webhook is not.

- [ ] **Step 6: Pose the integration-style decision (TD-18's gap)**

Synchronous versus asynchronous, as a decision with failure modes on each branch, not a
preference:

| | Synchronous | Asynchronous |
|---|---|---|
| You learn about failure | Immediately, in the request | Later, or never, unless you look |
| The caller waits | Yes | No |
| Fails when | The callee is down or slow | The message is lost, duplicated, or arrives twice |
| Needs | A timeout and a retry policy | Idempotency, and somewhere to put what failed |

State the rule: **you do not get to choose for a webhook you receive** — that branch is
asynchronous because someone else decided it is, and it will arrive twice eventually. Point
forward to event-driven from section 4 as the shape you get when this choice is made
everywhere.

- [ ] **Step 7: Ask the question that makes the sketch worth drawing**

For each external box: what happens when it is down? The invoicing answers — the payment
provider being down means invoices still send and payment reconciles late; the email sender
being down must not lose the invoice, so the send is queued or retried; PDF rendering being
down is survivable because the PDF is regenerable. **Each answer is a design decision the
diagram made visible**, which is the argument for drawing it.

- [ ] **Step 8: Write the ceremony refusal**

Explicitly, so an enterprise-background reader knows it is a decision:

> Full HLD practice comes with a specification document, a review board and a sign-off. None
> of that is here, deliberately. The thinking survives — what the pieces are, how they talk,
> what happens when one fails — and the paperwork does not, because its purpose is
> coordinating people you do not have.

- [ ] **Step 9: Update Artifacts and Definition of done**

Artifacts: replace "A one-paragraph description of the system, plus a diagram only if it
clarifies" with "A system sketch: containers, the external systems they depend on, and one
data flow drawn end to end". Definition of done gains: "- [ ] System sketched, with what
happens when each external dependency is down".

- [ ] **Step 10: Run the gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): sketch the system before designing the schema"
```

---

### Task 7: Section 8 — design the database; section 9 — design the API contracts

Two LLD sections, one task: section 8 is a rewrite of material Task 2 already moved, and
section 9 is short.

**Files:**
- Modify: `docs/03-architecture.md` — "Design the database" and "Design the API contracts"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 2's moved DDL; Task 6's sync/async vocabulary.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Add the glossary terms (the failing test)**

Add `normalisation` and `partial-unique-index` to `terms.ts`.

- [ ] **Step 2: Run and confirm RED, then regenerate and confirm GREEN**

```bash
cd web && pnpm test src/lib/glossary.test.ts     # FAIL — paste into report
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 3: Add the ER view and normalisation**

An ER view of the four entities as a fenced block, with cardinality marked — this is the
picture the nouns block in section 3 described in words. Then normalisation named through
3NF, with the practical rule under it: **one fact in one place**, and if changing one fact
means updating two rows, the model is wrong. Then the deliberate exception — denormalise
when you have measured a problem, and cross-reference stage 09 by heading.

- [ ] **Step 4: Close G4 — two indexes with reasoning**

The DDL has no indexes while Artifacts requires them. Add two, each derived from a query the
application actually makes:

```sql
-- The dashboard lists a user's invoices by status. Without this, every page
-- load scans the table.
CREATE INDEX invoices_owner_status_idx ON invoices (owner_id, status);

-- The scheduled job from the system sketch looks for sent invoices past due.
-- Partial, because it never asks about drafts or paid invoices.
CREATE INDEX invoices_overdue_idx ON invoices (due_date) WHERE status = 'sent';
```

State the rule that produced them: **an index answers a query you actually run**, so write
the queries first. Note that indexes cost write time and space, which is why "index
everything" is not the answer.

- [ ] **Step 5: Close G5 — conditional uniqueness and transactions**

The doc names races as *the* reason to push constraints into the database, then supplies
nothing that expresses a conditional rule. Add the partial unique index:

```sql
-- At most one approved claim per shift. UNIQUE (shift_id) would be wrong --
-- it would also forbid two rejected claims.
CREATE UNIQUE INDEX one_approved_claim_per_shift
  ON claims (shift_id) WHERE status = 'approved';
```

Then the sentence the doc has never carried: some invariants span rows and no constraint can
express them. Those need a **transaction** — the work happens as one unit or not at all —
and this is the point where a rule stops being the database's job and becomes yours.

- [ ] **Step 6: Close G8 and G13 as DDL annotations**

G8 — `date` versus `timestamptz`: `due_date` is a calendar day and means the same thing
regardless of where the reader is; `created_at` is an instant. Getting it backwards produces
off-by-one-day bugs that only appear for users in other timezones. G13 — one clause on the
primary key: `uuid` because ids appear in URLs and are generated without a round trip;
`bigserial` is smaller and faster to join but leaks how many rows exist and how fast they
arrive.

- [ ] **Step 7: Write section 9 — design the API contracts**

Sorted by the stage's own axis, which is what makes it belong in this stage rather than 05:

| Contract | Reversibility | Why |
|---|---|---|
| An internal server action | Cheap | One codebase; the compiler finds every caller |
| A published API others call | Expensive | You do not know who depends on it, and cannot make them move |
| A webhook you receive | Not yours | Someone else owns the shape; you adapt |

Then the three decisions: route shape (resource-oriented is the default, and the point is
consistency); request and response contracts (validate at the boundary, and the response
shape is a promise); and versioning (you need it only for the expensive row, and the cheapest
version strategy is to add fields and never remove them).

Close by pointing at stage 05 for implementation, citing
`05-development.md#server-actions-need-validation-and-authorization` by heading, matching the
precedent the auth section already set.

- [ ] **Step 8: Update Artifacts and Definition of done**

Artifacts gains the API contracts entry and keeps the schema entry, which now genuinely has
indexes. Definition of done gains: "- [ ] API contracts decided, sorted by how expensive
each is to change".

- [ ] **Step 9: Run the gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): design the database and the contracts, not just the DDL"
```

---

### Task 8: Sections 11, 12, 13 — ADRs, deferral, and the AI section

The tail. Closes G10, G12, C1 and C2, and removes the sentence Task 3 promoted.

**Files:**
- Modify: `docs/03-architecture.md` — "Write the ADRs", "Defer aggressively", "AI in
  architecture", "Traps"
- Modify: `web/src/lib/terms.ts`, `reference/glossary.md`

**Interfaces:**
- Consumes: Task 3's promoted reversibility test.
- Produces: nothing.

- [ ] **Step 1: Define the dismissed terms (the failing test)**

TD-21 and TD-18 both flag it: the doc gives **event sourcing** a verdict ("almost certainly
not") without ever defining it, and **CQRS** is absent entirely. A reader cannot tell whether
their own approval-history table counts as the thing being dismissed. Add `event-sourcing`
and `cqrs` to `terms.ts`. Event sourcing's `soWhat` must let a reader answer exactly that
question: keeping a log of what happened alongside current state is not event sourcing —
event sourcing is when the log *is* the state and current values are derived from it.

Run and confirm RED, then regenerate and confirm GREEN:

```bash
cd web && pnpm test src/lib/glossary.test.ts     # FAIL — paste into report
cd web && pnpm gen:glossary && pnpm test src/lib/glossary.test.ts   # PASS
```

- [ ] **Step 2: Expand the abbreviations on first use**

Doc-wide, and cheap: **ADR** is expanded on first use in "Write the ADRs" but the abbreviation
appears earlier, in the auth section. **DDL** appears in the AI section unexpanded. Expand
each at its genuine first occurrence and use the short form afterward.

- [ ] **Step 3: Give the dismissal a definition before its verdict**

In "Defer aggressively", the event-sourcing bullet currently states a verdict alone. Give it
one clause of definition first, then the verdict, then the line that lets a reader check
themselves against it — an audit table recording what changed is ordinary and is not this.

- [ ] **Step 4: Close G10 — what counts as one ADR**

"Every expensive decision has an ADR" is uncheckable without saying what one decision is.
Add: **one ADR per thing that could be reversed independently.** "Next.js + Postgres +
Vercel" is three, because you could change the database without changing the framework.
Note that G9 — format, length, status, naming — stays with stage 10 by design, and link
there.

- [ ] **Step 5: Close G12 — a criterion for deferral**

"Defer aggressively" is six fixed items, not a test. Add the test, which is the stage's own
axis applied to infrastructure:

> Defer anything whose reversal does not require migrating stored data. That is why a cache,
> a queue and feature flags are safe to defer — adding them later touches code. It is also
> why the items in the next paragraph are not.

- [ ] **Step 6: Close C1 and C2 — the multi-tenancy contradiction**

The defer list says "multi-tenancy beyond a `user_id` column" while the reversibility section
classifies stored data on every table as decide-now. The two point opposite ways with no
tie-breaker. Resolve it with the Step 5 criterion:

> A tenant key is stored data on every table, so it is the one item on this list that the
> deferral test excludes. Decide the **axis** now — is the tenant a person or an
> organisation? — even while deferring everything built on top of it. Retrofitting
> `user_id` into `org_id` is a migration of every table plus every query that touched them.
> Where data is shared across a team, `user_id` is not a weaker version of the right answer;
> it is the wrong axis.

That second sentence closes C2. Remove multi-tenancy from the defer list or annotate it in
place — do not leave it reading as a plain deferral.

- [ ] **Step 7: Update the AI section**

Remove the reversibility-test sentence from the "Pressure-test a reversibility claim" bullet
— Task 3 promoted it to section 1, and leaving both means the doc states its central rule
twice, in one place as a rule and in the other as a prompt. The bullet stays; it now points
at the rule rather than containing it.

Add plays for the new material, matching the section's existing structure of where-it-earns
and where-it-misleads:

- **Earns:** generate the characteristics candidate list and argue it down to three; check a
  system sketch for the dependency you forgot to draw; read a DDL for the missing index given
  the queries you paste alongside it.
- **Misleads:** asked which architecture style to use, it answers with the one it has read
  most about, not the one your characteristics select — which is the failure section 4 exists
  to prevent, arriving with citations.

- [ ] **Step 8: Add a trap for the new content**

Traps gains one, in the section's existing voice: **choosing a style before choosing
characteristics** — the answer sounds the same either way, and only one of them is a
decision.

- [ ] **Step 9: Run the gates and commit**

```bash
cd web && pnpm test && pnpm lint && pnpm typecheck
git add docs/03-architecture.md web/src/lib/terms.ts reference/glossary.md
git commit -m "docs(architecture): give deferral a criterion and resolve the tenancy conflict"
```

---

### Task 9: Verification — cold-reader re-run, links, humanizer, consultability

The round's real gate. Nothing here is optional, and a failure here is a finding, not a
formality.

**Files:**
- Create: `.superpowers/sdd/cold-reader-stage-03-after.md`
- Modify: `docs/03-architecture.md` (fixes arising)

- [ ] **Step 1: Run the full suite from a clean state**

```bash
cd web && rm -rf .next && pnpm test && pnpm lint && pnpm typecheck
```

Clean `.next` because D-25 — a bare typecheck passes off a stale build and fails on a clean
checkout.

- [ ] **Step 2: Re-run the cold-reader pass (D-32)**

Dispatch an agent that may read **only** `docs/03-architecture.md`, is forbidden from filling
gaps with its own knowledge, and takes the **same shift-swap product** through the stage —
same product as the original pass, or the results are not comparable to TD-18's baseline.
Report against all 14 original gaps individually: closed, partially closed, or still open.

- [ ] **Step 3: Act on the report honestly**

Any gap the round intended to close and did not is **recorded in the tracker, not quietly
dropped**. New gaps the amended doc introduces are recorded as new technical debt. Fix what
is cheap and blocking; record the rest.

- [ ] **Step 4: Check internal links by hand**

The P-4 link script no longer exists (TD-5). Five new sections mean five new anchor targets.
Verify every `docs/NN-*.md#anchor` in the amended doc resolves to a real heading, including
the two pointers into stage 05 and the one into stage 10. State the count checked in the
report.

- [ ] **Step 5: Run the humanizer pass (D-20)**

`humanizer:humanizer` over the amended doc. Apply what makes the writing clearer; skip what
would flatten the house voice. The doc leans on em-dashes deliberately — that is the voice,
not a defect. Tables and SQL blocks are out of scope for the pass.

- [ ] **Step 6: Run the consultability check**

The check the cold reader structurally cannot do, because a cold reader reads linearly.
Look up three specific questions in the amended doc **without reading it front to back**:
"what index should I add?", "is my product ownership or membership?", "what do I do about a
webhook that arrives twice?". Each should be findable from the headings alone. If the answer
is buried, the fix is a heading or a cross-reference, not a rewrite. Record the result — a
600-line doc failing this is the round's main risk.

- [ ] **Step 7: Commit**

```bash
git add .superpowers/sdd/cold-reader-stage-03-after.md docs/03-architecture.md
git commit -m "docs(architecture): verify the amended stage against a cold reader"
```

---

### Task 10: Records

**Files:**
- Modify: `docs/task.md`, `docs/tracker.md`, `KICKOFF.md`

- [ ] **Step 1: Update `docs/task.md`**

Check off W-3.1's items. **Correct the G14 placement error** — the checklist puts G14 in the
NFR step; TD-18 puts it in the reversibility section, and TD-18 is right. Add **W-3.2** for
the app port, carrying the note that it supersedes D-38.

- [ ] **Step 2: Update `docs/tracker.md`**

Close TD-22, TD-21 and TD-18 with evidence, not adjectives — the cold-reader before/after
per gap, the commit range, the test count. Record `Deferred:` on the entry: the app port
(W-3.2), G9 (still stage 10's), and anything Task 9 found and did not fix.

Add decisions:

- The full HLD/LLD treatment was chosen over the lighter 450-line alternative, with the
  length consequence and the reasoning.
- The round is doc-only, widening the doc/app divergence deliberately until W-3.2.
- `terms.ts`'s `Authorization` definition carried G3's defect — a gap in the single source,
  which no entry had recorded and which a doc-only fix would have left authoritative.

Open technical debt: the doc/app divergence, until W-3.2 lands.

- [ ] **Step 3: Update `KICKOFF.md`**

Refresh Project state and This round's scope. The stage 03 doc is no longer "not done"; the
next round is the app port.

- [ ] **Step 4: Commit**

```bash
git add docs/task.md docs/tracker.md KICKOFF.md
git commit -m "docs(tracker): close TD-18, TD-21 and TD-22 with the stage 03 doc round"
```

---

## Verification (after all tasks)

- [ ] `cd web && rm -rf .next && pnpm test && pnpm lint && pnpm typecheck` — all green
- [ ] `docs/03-architecture.md` carries thirteen `###` subsections in the order Task 2 pinned
- [ ] All 14 TD-18 gaps reported individually by the cold-reader re-run; G9 still open by
      design
- [ ] `reference/glossary.md` regenerated, never hand-edited, header intact
- [ ] Every internal link resolves, counted and stated
- [ ] `humanizer:humanizer` pass applied
- [ ] Consultability check run and recorded
- [ ] Working tree clean; branch state stated as `N commits off main, M/M tests, build clean`
- [ ] **Whole-branch review before merge** — the load-bearing one, per `CLAUDE.md`

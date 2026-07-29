# Stage 03 doc round — high-level design, styles vocabulary, cold-reader gaps

**Round:** W-3.1 · **Closes:** TD-22, TD-21, TD-18 · **Date:** 2026-07-29

---

## Problem

`docs/03-architecture.md` is 300 lines across eight subsections of "The work". The
interactive stage built on top of it is finished and verified (W-3, 24 commits, `21f555b`
… `9758cef`). The doc underneath it is not, and three tracker entries say so for three
different reasons.

**TD-22 — the stage produces low-level design without ever doing high-level design.** The
industry sequence is requirements → HLD → LLD. Stage 03 goes from "Sort decisions by
reversibility" to a concrete `CREATE TABLE` statement with nothing in between. The schema
is the most detailed artifact in the stage and it arrives with nothing above it to justify
its shape. Missing: non-functional requirements, a high-level design artifact, component
and deployment and data-flow views, database design past the DDL, and API contract design.

**TD-21 — the styles landscape is never named.** The stage teaches the modular monolith in
"Boundaries inside the monolith" without using the term. Microservices, event-driven,
serverless, hexagonal and the DDD vocabulary go unnamed, so a reader finishes unable to
place their own decisions among the words they will meet in every job description.

**TD-18 — a cold-reader pass found 14 beginner-completeness gaps, three of them blocking.**
G3 is the one that matters most and it is not like the others: the Definition of Done makes
"authorization pattern decided" an exit condition while the doc offers only ownership, so a
reader on a shared-workspace product can decide, tick the box, and be wrong with nothing
downstream to flag it.

The three are one round because they share a document and meet at specific points. They are
**not** one round with the app: see Non-goals.

### One thing this spec corrects in its own sources

`docs/task.md`'s W-3.1 checklist places TD-18's **G14** in the new non-functional
requirements step. TD-18's own closing line for G14 places it in the reversibility section:
*"Promote that sentence into the reversibility section as the rule the two lists
exemplify."*

**TD-18 is right and `task.md` conflated the two.** G14's defect is that the reversibility
section supplies two example lists and no test for producing them; a fix has to land where
the lists are. G14 goes to section 1. `task.md` is corrected as part of this round's
documentation updates rather than left to be discovered again.

### And one defect this spec found that no entry had recorded

`web/src/lib/terms.ts` defines **`Authorization`** as *"The check that this particular
record belongs to this particular caller."* That is precisely the ownership-only framing
G3 calls unsatisfiable. The gap is not only in the prose — it is baked into the
single-sourced term (D-36) that generates both `reference/glossary.md` and the app's inline
definitions. Fixing the doc without fixing the term would leave the wrong definition
authoritative in two more places.

---

## Goals

1. Stage 03 runs the requirements → HLD → LLD arc, with each artifact justified by the one
   above it.
2. A reader can name the architecture style they chose, and say what they did not choose
   and why.
3. Every gap in TD-18's table has a home in the amended doc, with G3 first.
4. The stage's recommendation is unchanged and now arrives derived rather than asserted.
5. A re-run of the cold-reader pass on the amended doc finds none of the original three
   blocking gaps.

---

## Non-goals

**The app is not touched in this round, beyond `terms.ts`.** Splitting doc from app was
decided at the top of the brainstorm. Stage 03's app sits at D-38's ceiling of five content
steps plus the AI step, and this round adds five sections — so the port needs a step
structure that does not exist yet. Porting a structure while the prose that defines it is
still moving means doing it twice. `W-3.2` mirrors the settled doc and supersedes D-38 with
the shape the doc proved. **This widens the known doc/app divergence** that `CLAUDE.md`
names, deliberately and temporarily; it is recorded as technical debt, not left silent.

**Functional requirements are not taught here.** Stage 02 owns them — verified against its
headings: "Define done before defining work", "Cut to the core", "Sequence in vertical
slices". Stage 03 states that it *consumes* them and restates nothing. Getting this wrong
would duplicate stage 02 and break the filing-code claim the playbook rests on (D-5). This
resolves the first of TD-22's two open questions.

**API implementation is not taught here.** Stage 05 owns it: "Keep route files thin",
"Server Actions need validation and authorization", "Types at the boundaries". Stage 03
decides the contract; 05 implements it. This is not a new seam — `03`'s existing auth
section already decides the strategy and links to `05` for enforcement, and API design
follows that precedent rather than inventing one.

**Specification documents and sign-off are not adopted.** This resolves TD-22's second open
question, and the answer is written into the doc rather than left as an omission a reader
has to notice. Take the HLD/LLD thinking, leave the paperwork, and say so, so a reader from
an enterprise background knows it was a decision.

**ADR format is still deferred to stage 10.** TD-18's G9 is a boundary, not a gap (D-39).
Unchanged here.

---

## Constraints

- **D-44 governs the styles content.** Teach the trade-off, do not change the
  recommendation. Monolith-first, modular boundaries and defer-aggressively all stand.
- **D-42 governs citations.** Name a heading, not a line number. A range only where the
  exact lines are the point, and then it names the heading too.
- **D-20 governs the prose.** A `humanizer:humanizer` pass before the round is done.
- **Live test gates, verified rather than assumed:**
  - `web/src/lib/stage-metadata.test.ts:25-31` — the doc's H1 must match `stages.ts`.
  - `web/src/lib/stage-metadata.test.ts:46-54` — `### AI in ...` must exist in the doc.
  - `web/src/lib/glossary.test.ts:7-11` — `reference/glossary.md` is a file snapshot of
    `terms.ts`.
- **Not gates, despite appearing in the tracker as evidence:** the seven-section template
  check and the 124-link resolution pass were ad-hoc scripts from P-4 and were thrown away
  (TD-5). This round must not cite them as having run unless it re-runs them by hand.
- The doc will land near 600 lines, roughly 1.6× the current longest stage doc
  (`02-planning.md`, 377). Accepted as a consequence of the full-treatment choice.

---

## Architecture

Eight subsections become thirteen. The inversion TD-22 names is fixed by **splitting one
existing section**, not only by adding new ones: "Model the domain first" currently fuses
the conceptual model (nouns and relationships, which is HLD) with the physical schema (the
`CREATE TABLE`, which is LLD). Splitting them is what makes the arc work, and it keeps the
doc's "model the domain first" claim intact instead of demoting it.

```
consumed from 02 ──────────────────────────────
  1  Sort decisions by reversibility      + G14 · the test the two lists exemplify
HLD ───────────────────────────────────────────
  2  What this system has to be           NEW · TD-22 owns, TD-21 consumes
  3  Model the domain first               conceptual only · + G1, G2, G6, G7 · DDL moves out
  4  The shapes a system can take         NEW · TD-21
  5  Start with one application           now a conclusion drawn from 2 and 4
  6  Boundaries inside the monolith       + bounded context, ubiquitous language · G11
  7  Sketch the system                    NEW · C4, views, sync vs async · TD-22
LLD ───────────────────────────────────────────
  8  Design the database                  DDL + ER + normalisation · G4, G5, G8, G13
  9  Design the API contracts             NEW · TD-22 · points at 05
 10  Authentication and authorization      + G3  ← blocking, fixed first
 11  Write the ADRs                       + G10
 12  Defer aggressively                   + G12, C1, C2
 13  AI in architecture                   loses G14's sentence, gains the new plays
```

### The worked example scales rather than being replaced

The full HLD treatment has a failure mode: if the system is "one Next.js app plus Postgres",
the component view is two boxes and the deployment view is one, and the section demonstrates
that HLD is pointless. The fix is not a second worked example — it is that an invoicing app
genuinely has external systems. A payment provider, an email sender, PDF generation and
storage, and something scheduled that notices an invoice went overdue. That is a real
component view, and the payment webhook gives the data-flow view a reason to cross the
synchronous/asynchronous seam.

This keeps one example across the whole stage and lets TD-18's integration-style gap close
on concrete material rather than an abstraction.

### Section content

**2 · What this system has to be.** Names *architecture characteristics* and *non-functional
requirements* as one thing under two vocabularies. The rule is pick three or four, because
they trade against each other. The worked example picks auditability, correctness and
cheap-to-run, and explicitly declines high availability and low latency. What makes the
section load-bearing rather than a vocabulary exercise: **each characteristic traces forward
to a decision later in the stage.** Auditability produces the soft-delete rule the doc
already teaches; correctness produces the database constraints; cheap-to-run produces the
single application. A characteristic that traces to nothing was not really chosen.

**4 · The shapes a system can take.** Monolith, modular monolith, microservices,
event-driven, serverless — each with what it costs, what it buys, and what would have to be
true to choose it. The stage's own approach is named as **modular monolith**. The
distinction most treatments blur and this one will not: layered and hexagonal describe
*internal organisation*, not deployment shape. A hexagonal monolith is an ordinary thing.
Conflating the two axes is why "monolith or microservices" is a bad question. Closes by
tracing back to section 2, because the characteristics are what select the style.

**7 · Sketch the system.** C4 named with its four levels and an honest statement of which
earn their keep for one person: context and container, while the code level is what an IDE
already draws. The component view of the scaled invoicing example, a deployment view, and
one data flow drawn end to end across the sync/async seam. Integration style posed as a
decision with the failure modes on each branch, which is where event-driven stops being a
word from section 4 and becomes a fork with a reason. This section carries the ceremony
refusal in text.

**8 · Design the database.** The existing DDL keeps its place and gains an ER view,
normalisation named through 3NF with the practical rule underneath it, two indexes derived
from queries the application actually makes (G4), a partial unique index for conditional
uniqueness plus the sentence that row-spanning invariants need a transaction (G5), one
annotation on `date` versus `timestamptz` (G8), and one clause on primary key type (G13).

**9 · Design the API contracts.** Route shape, request and response contracts, and
versioning, sorted by the stage's own reversibility axis: an internal server action is cheap
to change, a published contract is expensive, and a webhook you receive is someone else's
contract that you do not control at all. Implementation points at stage 05.

**10 · Authentication and authorization.** G3, the blocking one, fixed first. Names the
ownership / role / membership split, keeps enforcement in stage 05, and the DoD line becomes
satisfiable for a product where a manager approves a swap between two other people.

### Glossary changes

`terms.ts` is the single source (D-36); `reference/glossary.md` regenerates from it. Today
it holds 42 terms.

- **Corrected:** `Authorization` — the record-belongs-to-caller framing is demoted to one of
  three patterns rather than the definition, matching G3's fix in section 10. The term's
  `soWhat` carries why the ownership default is the dangerous one: it is right often enough
  to feel general.
- **Added:** architecture characteristic / non-functional requirement, modular monolith,
  microservices, event-driven architecture, serverless, bounded context, ubiquitous
  language, C4 model, normalisation, partial unique index, API contract. Final list settled
  during implementation — a term earns entry by being used inline, not by appearing once.

---

## Testing

**The prose has no unit test, and this spec will not pretend otherwise.** Dressing prose
editing up as TDD would produce vacuous tests, which is the failure the teeth-check
convention exists to catch. What is genuinely testable is tested, and the rest is verified
by the cold-reader method (D-32).

**The real red-green cycle.** Adding terms to `terms.ts` fails `glossary.test.ts` for the
right reason — the file snapshot no longer matches — before `pnpm gen:glossary` regenerates
`reference/glossary.md`. The RED output is pasted in the task report per the TDD-evidence
convention, and the failure reason is stated, not just the failure.

**Regressions the restructure could cause, each covered by a live gate:**

| Risk from the restructure | Gate |
|---|---|
| H1 changed while retitling sections | `stage-metadata.test.ts:25-31` |
| `### AI in architecture` renamed or lost when section 13 is rewritten | `stage-metadata.test.ts:46-54` |
| Glossary regenerated by hand, or not regenerated | `glossary.test.ts:7-11` |

**The prose gate is the cold-reader re-run** (D-32): an agent that may read only
`docs/03-architecture.md`, is forbidden from filling gaps with its own knowledge, and takes
the **same shift-swap product** through the stage. Using the same product is what makes the
result comparable to TD-18's baseline rather than a fresh unrelated list.

---

## Verification

1. `pnpm test` from `web/` — the full unit suite, including the three gates above.
2. `pnpm lint`, `pnpm typecheck` — `terms.ts` is TypeScript and is edited this round.
3. Cold-reader re-run, same product, reported against TD-18's original 14 gaps one by one:
   closed, partially closed, or still open. A gap this round intended to close and did not
   is recorded rather than quietly dropped.
4. Internal links re-checked **by hand**, because the P-4 link script no longer exists
   (TD-5). Five new sections mean five new anchor targets, and section 9's pointer into
   stage 05 must resolve.
5. `humanizer:humanizer` over the amended doc (D-20).
6. A **consultability check**, which the cold-reader pass structurally cannot do: a cold
   reader reads linearly, and the playbook's stated purpose is a document you look things up
   in. Verified separately by looking up three specific questions in the amended doc without
   reading it front to back.

---

## Documentation updates

- `docs/task.md` — W-3.1 checked off; the **G14 placement error corrected** rather than left
  standing; W-3.2 added for the app port.
- `docs/tracker.md` — TD-22, TD-21, TD-18 closed with evidence (cold-reader before/after,
  not adjectives); the doc/app divergence opened as new technical debt; a decision recording
  the full-treatment choice, its length consequence, and the rejected 450-line alternative;
  a decision recording that `Authorization`'s glossary definition carried G3's defect.
- `reference/glossary.md` — regenerated, never hand-edited.
- `KICKOFF.md` — project state and round scope refreshed.

---

## Risks

**Section 4 reads as an argument for microservices.** The exact drift D-44 exists to
prevent. Mitigated by ordering: 4 arrives after 2, so the characteristics are already chosen
when the styles are read, and 5 immediately spends the taxonomy on a conclusion. If a draft
of 4 can be read on its own as advocacy, it is wrong regardless of what 5 says afterward.

**The stage stops being consultable at thirteen sections.** A 600-line doc works against
"something you consult rather than read". The cold-reader pass will not catch this, because
a cold reader reads linearly — which is why verification step 6 exists as a separate check
rather than folded into the cold-reader brief.

**The doc/app gap widens for a full round.** Accepted and time-boxed to W-3.2. The risk is
that W-3.2 slips and stage 03 ships to readers as a doc and an app that disagree about what
the stage contains.

**Full HLD treatment imports ceremony the playbook exists to refuse.** The stated mitigation
is that the doc names what it is not adopting. The residual risk is tonal rather than
factual: five new sections of design apparatus may shift the stage's centre of gravity away
from "defer aggressively" even with every individual sentence defensible. The
`humanizer:humanizer` pass will not catch this either. It is a judgment call at review.

**Two blocking gaps get less attention than the structural work.** G4 and G5 are quiet gaps
in a round dominated by new sections. G3 is scheduled first for exactly this reason; G4 and
G5 land inside section 8, which is a rewrite rather than an insertion, and are the easiest
items in the round to under-serve.

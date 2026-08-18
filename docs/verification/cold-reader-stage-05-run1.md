# Cold-reader run 1 — stage 05, before the port

Method: `docs/learnings/cold-reader-testing.md`. **D-54**: the pass runs before the app is
built, not after. Stage 03 ran it last and ended with a finished app sitting on a doc with
three blocking gaps; stage 04 ran it first and it returned three blocking findings that
would otherwise have been ported straight into components.

Three inputs, two of them dispatched read-only and unable to see this branch:

- **Completeness.** One agent, `docs/05-development.md` and nothing else, forbidden from
  filling gaps with its own knowledge. Task: ship the first two vertical slices of `sprout`,
  a houseplant-watering app — deliberately not the doc's own invoices example, so it could
  not copy. Raw: `scratchpad/cold-reader-stage-05-completeness-raw.md`. Ran clean first try.
- **Consultability.** A second agent, given only the heading list, predicted which section
  answers five reader questions before seeing any prose, then checked itself. Raw:
  `scratchpad/cold-reader-stage-05-consultability-raw.md`. Ran clean first try.
- **Execution.** `docs/verification/stage-05-doc-execution.md`, committed at `e1f1c86`
  before this file — the doc's three TypeScript blocks compiled against the versions
  `reference/stack.md` prescribes.

Raw agent outputs are scratch. Read this file for the synthesis; they are not a path a
later reader can follow.

**This is a classification record, not a fix.** Nothing in `docs/05-development.md` has
changed. As on stage 04: where a cold-reader suspicion and an execution result disagree,
**the execution result wins** — it is evidence, the cold read is inference.

---

## Counts, and why they are not the agents' counts

The completeness reader returned **8 BLOCKING · 10 NON-BLOCKING · 4 BOUNDARY**, plus six
factual concerns. It rates *how blocking a gap is*, which is a different question from
*whether closing it is this stage's job*. Everything below is reclassified **defect** (the
doc contradicts itself, or a beginner cannot proceed within its own scope) or **boundary**
(deliberately another stage's job).

Two of its ratings are overturned below, one factual claim is **re-grounded because I could
not verify the mechanism it named**, and one of its low-confidence guesses is **promoted to
confirmed** on the execution pass's evidence.

| Source | Defects | Boundary | Disproved / sound |
|---|---|---|---|
| Completeness | 14 | 8 | — |
| Consultability | 3 | — | 4 of 5 questions HIT |
| Execution (`e1f1c86`) | 4 | 1 | 3 |
| Found while synthesising | 2 | — | — |

Deduplicated, **19 distinct defects**. Three were found independently by two inputs, which
is the strongest signal in the set.

---

## The convergences — found twice, independently

These three were reported by both the completeness reader (reading, no compiler) and the
execution pass (compiler, no reading of the prose). Neither could see the other's work.

**C1 — the Server Action imports two of its five external symbols.** `z` and `requireUser`
are imported; `db`, `eq` and `invoices` are not. Seven compiler errors. The reader's
framing adds what the compiler cannot: "a reader with no Drizzle background cannot know
`eq` comes from `drizzle-orm`, that `invoices` is a schema export, or where `db` is
constructed." This is the page's security exemplar and it does not compile as printed.

**C2 — `InvoiceTable` is named three times and never produced.** Rendered in both TSX
blocks, defined in neither. It is the *component* link of the "column, query, component,
test" chain `### Vertical slices` teaches as the unit of work.

**C3 — the bare `pnpm tsc --noEmit`.** The reader flagged it at **low confidence** (its
F6). The execution pass had already confirmed it at high confidence from two sources the
reader could not see: `docs/04-project-setup.md` defines `"typecheck": "next typegen && tsc
--noEmit"` and explains why the bare form is wrong, and `CLAUDE.md` records CI catching
exactly that. **Promoted to confirmed.** The reader was right and could not have known how
right.

---

## Defects — the doc arguing with itself

**D1 — the Definition of done requires what the body forbids.** The highest-value finding
in the set, and the exact pattern `cold-reader-testing.md` names from stage 03: a checkbox
gating on a concept the body never taught. Here the body teaches its *negation*.

- `## Definition of done`: "Loading and error states exist for anything async."
- `### Server Components by default`: "No `useEffect`, **no loading state**, no client-side
  fetch, no API route in between."

Both are defensible — the body means client-managed loading state, the checklist means
route-level `loading.tsx` and `error.tsx` — but the doc never draws that distinction, and
neither file, nor `Suspense`, nor an error boundary, nor `notFound` appears anywhere on the
page. A reader who correctly guesses what the checklist means is still given no mechanism.

**D2 — the prose says "Return" and the code throws.** `### Server Actions need validation
and authorization` reads: "**Return** 'Not found' rather than 'Forbidden' for records the
user does not own." Four lines above, its own code does `throw new Error('Not found')`.

This is also a documented anti-pattern, not merely an inconsistency. Next's shipped guide
(`node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`) classes a
failed authorization as an *expected* error and says: "For these errors, avoid using
`try`/`catch` blocks and throw errors. **Instead, model expected errors as return values.**"

*Correcting the completeness reader here.* It reached the right finding via a mechanism I
could not confirm — that "Next.js masks Server Action error messages with a digest in
production." The shipped docs show `digest` on the error boundary's props but state nothing
about masking Server Action messages, so **that claim is not cited and should not be
repeated in the fix**. The finding stands without it, on the doc's own prose/code mismatch
and Next's documented guidance.

**D3 — `'use client'` does not do what the doc says it does.** A factual error, in teaching
material, in two places:

- `### Server Components by default`: "A `'use client'` at the top of a page makes the whole
  tree client-rendered."
- `## Traps`: "**`'use client'` at the top of a page.** Opts the entire tree out of server
  rendering."

Next's shipped docs, `05-server-and-client-components.md`: "**Client Components** and the
RSC Payload are used to **prerender** HTML," and on first load "HTML is used to immediately
show a fast non-interactive preview of the route." Client Components *are* server-rendered.

What `'use client'` actually costs: server-only data access in that subtree, the JavaScript
shipped to the client, and — per the same doc — rendering "entirely on the client, without
the server-rendered HTML" on *subsequent navigations*. The doc also misses that a Server
Component can still be passed through as `children`, so the boundary need not swallow the
tree at all.

**The advice is right and the reason is wrong**, which is the damaging shape: a reader
debugging a slow page goes looking for missing HTML that is present.

**D4 — the security exemplar checks one row and updates by a different key.** It reads the
invoice, compares `invoice?.ownerId !== user.id`, then updates
`.where(eq(invoices.id, data.invoiceId))` — scoped by id alone, with the owner dropped.
Check-then-act, in the block whose omission the doc says "becomes a data breach". Folding
the owner into the update's `where` is both safer and shorter.

**D5 — two blocks eighteen lines apart disagree about showing imports.** `### Server
Components by default` prints its import line; `### Keep route files thin` uses three
undeclared symbols while its own comment claims "Route file: routing, auth, composition.
Nothing else."

**D6 — the same example function has two incompatible signatures.** `await getInvoices()`
with no auth in one block; `await requireUser()` then `await getInvoices(user.id)` in the
next, which declares auth to be a route file's job. Same name, two arities, no note that
one supersedes the other.

**D7 — the loop and the checklist describe different workflows.** `## Definition of done`
opens "before opening a PR" and closes with "Verified on the preview URL" — but the preview
is produced *by* the PR. `### The loop` has no PR step at all. Also, `### Commits` carries a
pre-PR obligation ("Rebase your branch before opening a PR") that the actual pre-PR
checklist omits, so the page has two before-PR lists that disagree.

**D8 — branch lifetime is stated three times in three numbers.** From the consultability
pass, and the one question of five it missed:

- `### The loop`: "Anything that cannot merge within **two days**"
- `## Traps`: "A branch open for **two weeks** will conflict"
- `## Entry criteria`: "small enough to finish in **a day or two**"

Only the first is a rule. The reader who goes looking clicks `### Commits` — the only
version-control heading — finds nothing but the rebase line, and concludes the page has no
branch policy. "Branch" appears in no heading on the page.

**D9 — the `as` standard differs between body and checklist.** `### Types at the
boundaries` and `## Traps` condemn every `as`; `## Definition of done` permits an explained
one ("No `any`, no **unexplained** `as`") without saying what an explanation looks like.

**D10 — Drizzle is listed among the runtime parsers.** `### Types at the boundaries` is
about parsing untrusted input, and its fourth bullet is "Database rows — Drizzle already
types these from your schema." Drizzle's typing is compile-time inference with no runtime
check. In a list whose other three entries are Zod, a reader may conclude rows are
validated. The bullet is true and its placement teaches the opposite.

**D11 — the Server Action's return value is the raw Drizzle result.** Crosses the RPC
boundary, must be serializable, and leaks the database shape into the client contract.

**D12 — no caller for the Server Action.** The doc defines a public endpoint in full and
never shows a `<form action={…}>`, `useActionState`, pending state, or how the thrown error
surfaces. Half an RPC.

**D13 — no revalidation after a mutation.** Confirmed against Next's shipped
`07-mutating-data.md`, which documents `refresh()` from `next/cache` and
`revalidatePath`/`revalidateTag` as the post-mutation step. Stage 05 names none of them,
and its worked example *is* a mutation — so a reader following it literally marks a plant
watered and watches the list not change.

**D14 — `queries.ts` is asserted about, never shown.** Named twice and characterised as "a
plain function that can be tested without a framework" — an assertion about code the doc
never prints.

**D15 — the column has no origin and no pointer.** `### Vertical slices` makes "column" the
first element of the unit of work; nothing on the page shows a schema or links to one. The
doc cross-references 02, 04, 06, 07, 12 and 13 elsewhere and even hands env vars off
precisely ("Zod, at boot ([04])"), so a missing pointer here is a lapse in its own practice
rather than a scope boundary.

**D16 — `### Local environment` omits the command that makes slice 1 have data.** Its three
commands are `pnpm dev`, `drizzle-kit studio` (which *inspects*), and `vitest --watch`.
Nothing generates, applies, or seeds a schema change.

**D17 — UI has no home.** `## Artifacts` says "Feature code in `src/features/`, route files
thin", which does not distinguish `src/features/plants/plant-list.tsx` from a `components/`
subfolder from a top-level `src/components/`. Emphatic about where logic goes, silent about
where UI goes — and this repo has made that exact call twice (`RevealList`, `TeamNotes`).

**D18 — no `### AI in development` section.** **D-35** makes an "AI plays" section mandatory
for every stage. `AI_SECTION_STAGES` in `web/src/lib/stage-metadata.test.ts` is an explicit
four-slug list, so nothing fails today — and its own comment says the list is explicit
"so the section lands with the doc amendment **at the start of a stage round** rather than
at the end when `ready` flips." Writing the section and adding the slug is therefore a
start-of-round task by the test's own design, not an oversight to be caught later.

**D19 — feature flags are prescribed twice and explained never.** "hidden behind a flag"
(`### The loop`) and "Slice smaller; use flags" (`## Traps`). The escape hatch for the
page's central discipline has no mechanism, no library, and no cross-reference.

---

## Boundary — not defects, do not patch

- **How to write the test.** Handed to [06](../06-testing.md) twice, explicitly.
- **Linter and formatter identity.** `--max-warnings 0` is ESLint-flavoured; naming the
  tools is [04](../04-project-setup.md)'s job.
- **Auth setup.** `@/lib/auth` is stage 04's. *But* — unlike env vars, it carries **no
  cross-reference at all**, so the reader is not told which stage to go read. The setup is
  a boundary; the missing pointer is D15's sibling and worth fixing with it.
- **Preview verification and diff self-review.** Clean handoffs to [12] and [07]. Only the
  *ordering* is wrong, which is D7.
- **Schema and migration mechanics.** 03's and 04's. Only the pointers are 05's (D15, D16).
- **`(app)` route-group syntax.** App Router basics, [04](../04-project-setup.md).
- **TypeScript 7 removed `baseUrl`.** Surfaced by the execution harness; `tsconfig`
  territory, and stage 05 mentions neither option.
- **Read-path authorization.** The reader notes the authorize rule is scoped to writes
  everywhere it appears, and that an unscoped read list is shippable under a literal
  reading. Arguably 05's, arguably [03](../03-architecture.md)'s. **Flagged, not classified**
  — it is a content decision, and the kind the tracker records as deferred rather than
  silently resolved.

---

## What the consultability pass says about the shape

**4 / 5, no partials.** Cross-user edits, being stuck, third-party JSON and client-rendering
all land from the heading list alone. `## Traps` works as a symptom-side index into a
rule-side body, which is a real strength worth preserving in the port.

Three structural notes, all cheaper to fix in the doc than to design around in the app:

- **`### The loop` is the least informative heading and holds the most consultable content**
  — the make-it-work ordering, cleanup-before-PR, and the authoritative two-day number.
- **`### Local environment` is named for the wrong content.** It reads like env-var setup,
  which is stage 04's territory, and holds the page's strongest single claim: "Vitest in
  watch mode in a spare terminal is the highest-leverage habit on this page."
- **`## Traps` has become the sole home of two claims that belong with the rules they
  support** — most of its eight entries are useful reinforcement, but the strongest argument
  for the authorization rule ("the most common serious security bug in App Router
  applications") appears *only* there, and never in the section that teaches the rule.

Four things are in the body that no heading advertises: the information-disclosure rule,
the loading/error-states requirement (D1), the rebase-before-PR obligation (D7), and Zod's
status as the mandated validator.

---

## Disproved, and recorded as such

- **`tsc` still exists on TypeScript 7.** The prescribed stack is the Go compiler, which
  raised a reasonable doubt about `pnpm tsc --noEmit`. The binary is present at 7.0.2.
  C3 stands on the missing `next typegen`, not on the binary name.
- **`z.string().uuid()` is not deprecated in Zod 4.** Both it and top-level `z.uuid()` exist,
  no deprecation marker ships in the types, and the schema rejects a bad UUID, a negative
  amount and a non-integer amount correctly. No change needed.
- **The Server Action's logic is sound.** Typechecks clean against the prescribed stack, and
  `invoice?.ownerId !== user.id` genuinely throws on a missing row as well as a foreign one,
  so the doc's "Not found" advice is implemented rather than merely asserted beside the code.
- **Digest-masking of Server Action errors** — see D2. Asserted by the completeness reader,
  **not confirmed** in the shipped docs, and deliberately not carried forward.

## One number corrected in passing

`KICKOFF.md` describes the doc as "four `##` sections and nine `###` ones." Nine `###` is
right; there are **six** `##`. Small, and exactly the count-the-thing-in-front-of-you class
the kickoff itself warns about two paragraphs later.

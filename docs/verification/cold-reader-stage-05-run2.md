# Cold-reader run 2 — stage 05, after the corrections

Method: `docs/learnings/cold-reader-testing.md`. This is the re-run the method requires
after any round that substantially rewrites a doc: same scenario, same questions, so the
result compares against run 1 rather than producing a fresh unrelated list.

This branch closed twenty defects in `docs/05-development.md` (D1–D19 from run 1's
classification, D20 added by the spec — read-path authorization, `### Authorize reads,
not just writes`) across twelve tasks, commits `53b0d19`…`6f43f2c`. This record checks
what actually closed.

**Departure from the plan, recorded as instructed.** The plan's Task 10 says to "ask
[the completeness reader] explicitly whether each of the twenty defects is closed." That
was overridden before dispatch: a reader handed the list will confirm the list, which is
not evidence of anything. Both readers ran exactly as run 1's did — blind to the twenty
defects, the branch, the plan, and each other. The mapping onto the twenty, below, is
done in this record from their blind output, not by them.

Three inputs:

- **Completeness.** One agent, `docs/05-development.md` and nothing else, same `sprout`
  houseplant-watering scenario and two-slice task as run 1, forbidden from filling gaps
  with its own knowledge. Raw:
  `scratchpad/cold-reader-stage-05-completeness-run2.md`.
- **Consultability.** A second agent, the same five questions as run 1, predicting from
  headings alone before checking itself. Raw:
  `scratchpad/cold-reader-stage-05-consultability-run2.md`.
- **Execution.** `docs/verification/stage-05-doc-execution-run2.md`, committed at
  `b542766` before this file. Every fenced `ts`/`tsx` block in the corrected doc,
  compiled twice (literal, charitable) against the versions `reference/stack.md`
  prescribes, teeth-checked. This record cites its conclusions rather than repeating its
  method.

Raw agent outputs are scratch. Read this file for the synthesis.

**This is a classification record, not a fix.** Nothing in `docs/05-development.md` has
changed while producing it. As run 1 states and this run confirms again: where a
cold-reader suspicion and an execution result disagree, **the execution result wins** —
it is evidence, the cold read is inference.

---

## Counts, run 1 beside run 2

Same caution as run 1: these are not the agents' own verdicts. A reader's BLOCKING/
NON-BLOCKING rating answers *how blocking a gap is*; the table below reclassifies into
**defect** (the doc contradicts itself, or a beginner cannot proceed within its own
scope) or **boundary** (deliberately another document's job).

| | Run 1 | Run 2 |
|---|---|---|
| Completeness — BLOCKING | 8 | **0** |
| Completeness — NON-BLOCKING | 10 | 5 |
| Completeness — BOUNDARY | 4 | 4 |
| Completeness — could finish both slices | No (stalled slice 1, could not attempt slice 2) | **Yes, both** |
| Consultability — HIT | 4/5 | **5/5** |
| Consultability — miss | Q3, branch lifetime (no heading said "branch") | none |
| Execution — fenced blocks total | 6 | 12 |
| Execution — executable | 3 | 9 |
| Execution — literal-pass errors | 7 (all one block) | 18 (five blocks, corpus tripled) |
| Execution — silent, undisclosed import gaps (E1-class) | 7 | **0** |
| Execution — charitable pass | exit 0 | exit 0 |
| Contradictions found (doc arguing with itself) | 9 (D1, D2, D5, D6, D7, D8, D9, D10, D19) | **0** |

Run 1's reader could not produce a single compiling file for its first slice and could
not finish the second at all. Run 2's reader finished both, and its own words on the
difference: "The full `updateInvoice` Server Action was the single most load-bearing
block on the page — I transcribed its authenticate/validate/authorize/return shape
almost unchanged for `waterPlant`."

---

## Verdict on the twenty defects

Read against `docs/05-development.md` as this branch left it, plus both readers' blind
output and the execution record.

**Closed — nineteen of twenty.**

- **D1** (Definition of done required what the body forbade). `### Loading and error
  states` now exists and distinguishes the two senses; `## Definition of done` reads
  `loading.tsx` and `error.tsx` exist for any segment that fetches. Neither reader found
  a contradiction here — the completeness reader shipped `loading.tsx`/`error.tsx` for
  its own scenario by direct transcription, calling it "fully worked examples … copy-paste,
  no guessing."
- **D2** (prose said "Return", code threw). `### Server Actions need validation and
  authorization` now returns `{ ok: false, error }`; nothing in the section throws.
- **D3** (`'use client'` factual error). Corrected in both places. Consultability Q5
  (page slow, client-rendered) scored HIT on the corrected explanation, quoting it back
  almost verbatim: "'use client' does not mean 'not rendered on the server'…"
- **D4** (check-then-act in the security exemplar). The `where` now folds
  `eq(invoices.ownerId, user.id)` into the same statement as the update. Execution run 2's
  charitable pass compiles it; the teeth check that removes the owner predicate still
  compiles, which is the instrument's ceiling, not a residual defect (see "What these
  instruments cannot see," below).
- **D5** (adjacent blocks disagreeing about showing imports). `### Server Components by
  default` and `### Keep route files thin` now import identically. Execution run 2:
  "run 1's E2 (adjacent blocks disagreeing on whether imports are shown) is fixed."
- **D6** (two signatures for the same function). `getInvoices(ownerId: string)` is now
  the only signature, used identically in both route examples.
- **D7** (loop and checklist describing different workflows). `### The loop` now ends
  "Open the pull request → Verify on the preview → Ship"; `## Definition of done` opens
  "before you open the pull request" and moves "Verified on the preview URL" to its own
  line after "Then open it, and after the preview builds." The two no longer disagree
  about ordering, and `### Commits and branches` and the checklist both carry the rebase
  line once each rather than the checklist omitting it.
- **D8** (branch lifetime in three numbers). "Two days" now reads consistently in
  `## Entry criteria`, `### The loop`, `### Commits and branches`, and `## Traps` (which
  reframes "two weeks" as the failure story rather than a competing rule). Consultability
  Q3 — run 1's only miss — now scores HIT on first click, "Commits and branches": *"A
  branch that cannot merge within two days is too big."*
- **D9** (the `as` standard differing between body and checklist). Both now say "cast"
  and both require a comment: `### Types at the boundaries` — "each one carries a
  comment saying what you know that it does not"; `## Definition of done` — "Every `as`
  cast has a comment saying what the compiler could not know."
- **D10** (Drizzle listed among runtime parsers). Split into its own paragraph under
  `### Types at the boundaries`, explicit that it is inference, not validation.
- **D11** (raw Drizzle result crossing the RPC boundary). `updateInvoice` returns
  `{ ok: true } as const` or `{ ok: false, error } as const`, never the update result.
- **D12** (no caller for the Server Action). `invoice-amount-form.tsx` now exists,
  wired with `useActionState`. Execution run 2 compiles it as block 5 of 9.
- **D13** (no revalidation after a mutation). `revalidatePath('/billing')` is in the
  action, with a paragraph on why its absence reads as "it didn't save."
- **D14** (`queries.ts` asserted, never shown). Shown in full under `### Keep route
  files thin`, and compiles (execution run 2, block 3).
- **D15** (the column had no origin or pointer). `### Vertical slices` now reads: "The
  table it belongs to was designed in [03 — Architecture] … the tooling that applies the
  change was installed in [04 — Project Setup]." The completeness reader's own G1 confirms
  this reads as a clean boundary, not a gap: *"a clean, correctly-labeled boundary."*
- **D16** (no command that gives slice one data). `### Keep the feedback loop running`
  now lists `pnpm drizzle-kit push # apply a schema change locally` first.
- **D17** (UI had no stated home). `## Artifacts` now reads "Feature code in
  `src/features/<feature>/`, components included"; `### Keep route files thin` states
  `invoice-table.tsx` sits beside `queries.ts`.
- **D18** (no `### AI in development` section). Present, last `###` under `## The work`
  before `## Artifacts`, matching the placement rule the other three built stages set.
  `stage-metadata.test.ts` passes with `05-development` in `AI_SECTION_STAGES`.
- **D19** (feature flags prescribed twice, explained never). `### The loop` now defines
  the mechanism in one sentence: "A flag here is the boring kind: a boolean your code
  reads, defaulting to off…"
- **D20** (the twentieth, read-path authorization scoped to this stage — D-69).
  `### Authorize reads, not just writes` exists, shows `getInvoice(id, ownerId)` scoping
  the query rather than filtering after, and the route example uses it with an inline
  comment: `// not getInvoice(id)`. The completeness reader did not build a detail route
  in its own scenario (its two slices were a list and a mutation), so it could not test
  this section against a task — but it raised no contradiction reading it, and the
  section's own fragment is a documented, signposted delta (see execution run 2,
  "Literal pass," third bullet) rather than a silent gap.

**Open — one.** **C2's surviving half.** Run 1 filed C2 as a convergence — `InvoiceTable`
named three times, produced nowhere — found independently by the completeness reader and
the execution pass. Task 3 was supposed to close it. It closed `InvoiceDetail`'s sibling
question (where UI lives, D17) but did not produce `InvoiceTable` itself, and **the same
convergence recurred in run 2**, found again by two instruments blind to each other and to
run 1:

- The completeness reader's own code comment, unprompted: *"[INVENTED — the page imports
  and renders `InvoiceTable` everywhere but never once shows its body, so this markup is
  not a transcription of anything on the page.]"*
- Execution run 2: *"`InvoiceTable` … still imported and rendered, never defined … `grep
  -n "InvoiceTable\|InvoiceDetail" docs/05-development.md` — 6 matches, all import or
  JSX-usage lines; zero `function InvoiceTable`/`function InvoiceDetail` definitions."*

**This overturns an earlier per-task review's judgment.** Task 3's per-task review argued
that no section on the page teaches component implementation, so writing `InvoiceTable`'s
JSX would bury the lesson rather than serve it, and that argument was accepted at the
time. On reflection it is half right: right about `InvoiceDetail`, whose section
(`### Authorize reads, not just writes`) teaches scoping a query, not building a
component, and which the plan's own Global Constraints designate scenery by name. Wrong
about `InvoiceTable`, which `### Vertical slices` names as a step of the unit of work in
its own right ("column, query, component, test"). A five-line list component closes the
gap without burying anything; the plan's own constraint says as much — "If you cannot
tell which a symbol is, produce it," and this one is not ambiguous. `InvoiceDetail` stays
an import. **This split is recorded, not fixed, here** — it goes to the fix wave below.

---

## Two independent instruments, the same unsourced superlative

Task 4's per-task review flagged, as M2, that "the most common serious security bug in
App Router applications" reads as a vague-attribution tell — a superlative asserted with
no source, appearing twice in the doc at the time. Task 8 resolved the *duplication* (the
`## Traps` entry now points at the rule's section instead of repeating the line), but the
underlying claim was never re-sourced, and it still stands once, in `### Server Actions
need validation and authorization`.

The completeness reader's run 2 output, blind to that review and to the doc's revision
history, raised the identical sentence under "Part 3 — factual concerns": *"Stated as
fact, no source. Plausible, but I have no way from this page to tell confident claim
from house opinion."*

Two inputs that cannot see each other converging on the same sentence is the strongest
signal in this set, the same standing run 1's record gives C1–C3. It goes to the fix
wave. The fix is cheap — either cite something (OWASP's broken-access-control ranking is
the obvious candidate) or soften the sentence to a stated house judgment rather than an
asserted fact.

---

## What consultability run 2 says about the shape

**5/5, no partials.** The single miss from run 1 — branch lifetime, D8 above — now hits
comfortably on first click. The two renames (`### Commits and branches`, `### Keep the
feedback loop running`) broke nothing: all four questions that hit in run 1 still hit.

Three structural notes, none of them defects:

- **Duplication is judged deliberate, not bloat**, for the two claims the page repeats
  most: the two-day branch rule (four sections) and the authorization rule (five
  touchpoints, now including `### AI in development`'s back-reference). The reader's own
  words: "deliberate emphasis, not bloat, and it matches this project's own `CLAUDE.md`
  concern with authorization defects."
- **One near-literal repetition, not the same as the deliberate ones above.** The
  `'use client'`-at-top-of-page explanation in `### Server Components by default` and the
  `## Traps` entry restate the same sentence with only the framing changed — Task 2 wrote
  both halves in one commit. The reader calls this "closer to literal repetition than the
  other [duplications]." Not a contradiction (both say the same true thing), so not a
  defect by the run 1 rule, but worth tightening in a later pass rather than a doc-arguing-
  with-itself fix.
- **`unstable_retry` is strong, specific, framework-version content with zero heading
  signal.** Buried inside `### Loading and error states`, which gives no hint it holds a
  Next-version trap. A reader debugging "my Try Again button throws `undefined` is not a
  function" would not guess to click there from the heading list. Not a defect — the
  content exists and is correct — but a findability gap the same shape as run 1's
  `## Traps`-strands finding, minor.

---

## What the corrections introduced

Run 1 kept a section for this and it stays, because a fix wave is exactly where a doc
grows new defects faster than its author notices (`docs/learnings/cold-reader-testing.md`,
"the second run").

**One claim added with no example or citation.** Task 2's rewrite of `### Server
Components by default` added: "a Server Component passed through as `children` stays a
Server Component even when its parent is a Client Component, so the boundary does not
have to swallow a subtree to cross it." True — it is how the shipped Next docs describe
composition — but no code accompanies it, unlike everything else the section teaches. The
completeness reader flagged it independently (its G9): "Useful-sounding and stated as
flat fact … I'd trust it less than the passages backed by a worked example." Non-blocking,
in scope (the doc's own subject, not another stage's), and a fix is one small code
fragment or a citation into Next's shipped docs. Goes to the fix wave.

**One residual completeness gap, signposted rather than silent.** The `getInvoice`
fragment under `### Authorize reads, not just writes` reads `// alongside getInvoices;
the import gains \`and\`` and, taken alone, is missing three symbols the literal pass
catches (execution run 2, "Literal pass"). This is not new information — the execution
record already classifies it as distinct in kind from the old E1 (signposted delta, not a
silent gap) — but it is worth naming here as the shape a completeness gap now takes on
this page: partial by design and disclosure, not by omission. Not a candidate for the fix
wave on its own; changing it would mean either duplicating `queries.ts`'s full content a
second time or removing the "alongside" framing that makes the delta legible in the first
place, and neither is a clear improvement.

---

## New findings in run 2, classified

The completeness reader returned 5 NON-BLOCKING and 4 BOUNDARY findings beyond what the
twenty already cover. Reclassified by the run 1 rule:

**Boundary — correctly deferred, no action:**

- **G1 — schema table definition syntax.** The reader's own words: "a clean,
  correctly-labeled boundary." This is D15's territory and D15 is closed; the boundary
  language the doc now uses is exactly what produced the reader's own confirmation.
- **G2 — `db` client construction (`@/db`).** Same shape as `@/lib/auth`'s established
  precedent (see below) — reasonable to defer to [04].
- **G6 — testing conventions, file layout, mocking.** Matches run 1's boundary finding
  verbatim: "How to write the test. Handed to [06] twice, explicitly." Sharper this run
  only in degree — the reader notes the page's one testing sentence ("A test calls it
  with an id and checks what comes back") does not extend to mocking `requireUser` or
  `db` for a Server Action test, which is real, and is [06]'s to answer.
- **G8 — the path from `drizzle-kit push` to a shipped migration.** The loop diagram
  ends in "Ship ([13])" and never says what carries a schema change to production.
  Plausibly [04]'s or [13]'s; not [05]'s example to extend.

**Boundary with a flagged residual — the one worth acting on:**

- **G3 — `requireUser`'s contract** (return shape, failure mode when nobody is signed
  in). The mechanism is [04]'s. But run 1's record already flagged that `@/lib/auth`
  "carries no cross-reference at all" and called it "worth fixing with [D15]" — and it
  was not fixed. The reader's own words this run: "a page this dependent on one function
  never naming its source module's owner or its failure mode is a real absence." Cheap,
  precedented (D15 got exactly this pointer for the schema), and still open. Goes to the
  fix wave.

**Defects — in the page's own scope, not another stage's job:**

- **G5 — no pattern for a mutation with no user-typed input.** Every Server Action
  example on the page is form-bound to typed fields; nothing shows firing an action from
  a plain button with data the component already holds. The reader had to invent the
  wiring for `waterPlant`, flagging it explicitly (its own comment: "I reused the
  form+useActionState wiring only because it's the one pattern shown, not because I have
  any reason to think it's the intended shape"). This is Server Actions material, which
  is squarely this stage's subject — not deferred to anyone. Minor, but real. Goes to the
  fix wave.
- **G9 — the children-passthrough claim.** Covered above under "What the corrections
  introduced." A defect by the same reasoning as G5: in scope, unsupported, cheap to fix.

**Not gaps — factual concerns, one already covered above:**

- The unsourced "most common serious security bug" superlative — see the convergence
  section above.
- **"Vitest in watch mode … is the highest-leverage habit on this page."** Same shape,
  single-source this run (the completeness reader only; run 1's consultability pass
  called the same sentence a content strength, not a defect). Lower priority than the
  security superlative because it lacks the second convergence, but the same fix — cite
  or soften — would resolve it in the same pass if someone is already touching nearby
  prose. Optional, not blocking.

**G4** (`useActionState` unexplained) and **G7** (`PageProps`'s origin unexplained) are
non-blocking and boundary-adjacent — React's and Next's own documentation territory, used
here only as worked examples the reader could pattern-match without understanding the
mechanism. Neither stalled the reader. Not recommended for the fix wave; noted for
completeness.

---

## What goes to the fix wave, ordered

1. **Produce `InvoiceTable`.** The only surviving instance of a defect found by two
   instruments in run 1 and by two different instruments again in run 2. Five lines of
   JSX, per Task 3's own precedent for `invoice-table.tsx`'s location. `InvoiceDetail`
   stays an import — do not produce it.
2. **Re-source or soften "the most common serious security bug in App Router
   applications."** Flagged by a per-task code review and, independently, by a blind
   completeness reader. Cite something, or state it as a house judgment rather than an
   asserted fact.
3. **Add a stage-04 cross-reference near `@/lib/auth`'s first appearance**, mirroring the
   pointer `### Vertical slices` already gives the schema. Flagged in run 1, not
   actioned, reconfirmed independently in run 2.
4. **Show or acknowledge a no-input Server Action.** One short example (a button that
   posts an id the component already holds) resolves the gap that forced the
   completeness reader to invent wiring for its own scenario.
5. **Back the children-passthrough sentence with a fragment or a citation.** Introduced
   by this round's own Task 2; the only claim in the corrected doc with no supporting
   code, flagged independently by the completeness reader.

Not recommended for this wave: the `getInvoice` fragment's residual literal-pass errors
(deliberately signposted, not silent — changing it costs more clarity than it buys); the
`unstable_retry` heading-signal gap (a consultability finding about findability, not
about content, better addressed if `### Loading and error states` is touched for another
reason); the Vitest superlative (single-source, low cost either way, bundle it in only if
already editing nearby prose).

---

## What these instruments cannot see

The same limits run 1 named, restated because they still hold:

- **A green compile proves a block is complete. It does not prove it is secure.**
  Execution run 2 reproduced this directly: dropping the owner predicate from
  `updateInvoice`'s `where` still compiles, exit 0. Nothing in either `tsc` pass has
  anything to say about an authorization gap that is a missing predicate rather than a
  type error.
- **A completeness reader tests one scenario.** `sprout`'s two slices are a list and a
  mutation; nothing in this run exercised the detail-route pattern `### Authorize reads,
  not just writes` teaches, because the reader's own task never needed one. D20's verdict
  above rests on reading the section and the execution pass compiling its blocks, not on
  a reader building against it.
- **Consultability tests findability, not correctness.** A HIT means a reader would click
  the right heading; it says nothing about whether the prose under it is right. Every
  correctness claim in this record rests on the completeness reader, the execution pass,
  or reading the doc directly — never on a consultability score.
- **Neither reader can see the other's work, this branch, run 1, or the twenty-defect
  list**, by design. What they converge on without that visibility (`InvoiceTable`, the
  security superlative) is the strongest signal available; what only one of them raises
  is real but weaker, and is labeled as single-source above where it applies.

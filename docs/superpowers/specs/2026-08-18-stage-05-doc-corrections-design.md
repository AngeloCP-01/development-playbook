# Stage 05 doc corrections — design

**Date:** 2026-08-18
**Branch:** `fix/stage-05-doc-corrections`
**Precedes:** the W-3.5 port of stage 05 into the app, which is a separate round.

## Problem

`docs/05-development.md` is 249 lines and is next in line to be ported. **D-54** says the
cold-reader pass runs before the port rather than after, because stage 03 ran it last and
ended with a finished app sitting on a doc with three blocking gaps.

The pass ran. Three inputs, two of them dispatched read-only and unable to see each other:
a completeness reader given the doc and a houseplant-watering app to ship, a consultability
reader given only the heading list, and an execution pass that compiled the doc's three
TypeScript blocks against the versions `reference/stack.md` prescribes. Records:
`docs/verification/cold-reader-stage-05-run1.md` and
`docs/verification/stage-05-doc-execution.md`, committed at `f3c883b` and `e1f1c86`.

They returned **nineteen distinct defects**, recorded as D1–D19 in the classification record.
Three were found twice by inputs that could not see each other's work.

A twentieth was added by a decision the classification record deliberately left open.
The authorize rule appears three times in the doc and is scoped to writes every time, so an
unscoped read list is shippable under a literal reading. The record flagged this without
classifying it, because it is a content decision rather than a defect a reader could
demonstrate. **It is stage 05's job** and gets the new `### Authorize reads, not just
writes` section — the same class of bug, in a doc that already says "Never trust an ID from
the client to belong to the caller", with the hole present in its own example route.

The doc's failures cluster into a shape worth naming, because it decides the fix. This is
not a document that is wrong about its subject — its judgement is good and the
consultability pass scored it 4/5. It is a document whose **code blocks are excerpts with
their imports and their callers removed**, and whose **checklist has drifted away from its
own body**. The completeness reader could not produce a single compiling file for its first
slice, and could not finish the second slice at all.

Two defects carry most of the weight:

- `## Definition of done` requires "Loading and error states exist for anything async"
  while `### Server Components by default` teaches "no loading state", and neither
  `loading.tsx`, `error.tsx`, `Suspense` nor an error boundary appears anywhere on the page.
  `docs/learnings/cold-reader-testing.md` names this exact pattern from stage 03 — a
  checkbox gating on a concept the body never taught. Here the body teaches its negation.
- `### Server Components by default` and `## Traps` both state that `'use client'` opts a
  tree out of server rendering. Next's shipped documentation
  (`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`)
  says Client Components and the RSC payload "are used to **prerender** HTML". The advice
  is right and the reason is wrong, which is the damaging shape: a reader debugging a slow
  page goes looking for HTML that is already there.

## Goals

1. Close all twenty defects, so the port works from a doc that does not argue with itself.
2. Make every code block on the page compile as printed, against the prescribed stack.
3. Give every piece of new material a heading a reader would click, measured by a second
   consultability pass rather than asserted.
4. Close the gate hole this round exposed: cross-document anchor links are unguarded, so a
   heading rename breaks them silently.
5. Land `### AI in development` and its test-list entry **with the doc amendment rather than
   with the port**, which is the ordering `stage-metadata.test.ts` was deliberately
   structured to make possible: its list is explicit rather than derived from `ready`, so
   the section does not have to wait for the flag to flip.

## Non-goals

- **No app work.** `ready` stays `false` for `05-development` and no component is written.
  The port is W-3.5 and a separate round with its own spec. Dropped because stage 03 proved
  the reverse order expensive, and mixing them makes the whole-branch review unable to tell
  a doc defect from a port defect.
- **No renaming `### Server Actions need validation and authorization`.** Considered, and
  rejected on evidence: three live anchor citations depend on it —
  `docs/03-architecture.md` twice and `docs/07-code-review.md` once. The read-path material
  it would have absorbed gets its own section instead, so the rename buys nothing and costs
  three edits in shipped documents.
- **No changes to neighbouring stage docs** beyond the single citation this round breaks.
  Several findings touch 04's and 06's territory; they are boundaries and stay theirs.
  Dropped because a doc round that edits five documents cannot be reviewed as one unit.
- **No new worked example.** The invoices/billing example stays. Dropped because replacing
  it would invalidate the cold-reader baseline, and the method requires the re-run use the
  same scenario or the results do not compare.
- **No general link checker.** The new guard resolves anchors into `docs/*.md` only. A
  full external-link audit is TD-5's territory and once produced 124 false breaks.

## Constraints

- **Cite by heading, never by line number** (D-42). Applies to the doc, this spec's
  references into docs, and the plan.
- **Executable content gets executed** (D-50). Every code block the round writes or edits is
  compiled before it is committed, not read.
- **A fix that reaches zero needs a case where zero is wrong.** Recorded at `f18c785`. Any
  new test gets a teeth check against a counter-example.
- **`web/AGENTS.md`**: this Next.js version postdates training data. Every framework claim
  the round writes is checked against `node_modules/next/dist/docs/`, and cited.
- **The doc more than doubles.** Expect ~249 → ~600 lines. Stage 04's went 323 → 711.
- **`reference/stack.md` holds versions and nothing else does.** The round cites it rather
  than restating versions.

## Architecture

### Section structure

Existing sections grow, two are added, two are renamed. Twelve `###` under `## The work`,
six `##` unchanged.

```
## Entry criteria                                  (fix: branch-lifetime wording)
## The work
  ### The loop                                     (grows: feature flags)
  ### Vertical slices                              (grows: schema pointer)
  ### Server Components by default                 (fix: 'use client' factual error)
  ### Keep route files thin                        (fix: imports, getInvoices signature,
                                                    queries.ts body, UI location)
  ### Server Actions need validation and           (fix: imports, throw→return,
      authorization                                 check-then-act; grows: caller,
                                                    revalidation)
+ ### Authorize reads, not just writes             (NEW)
  ### Types at the boundaries                      (fix: Drizzle placement, `as` standard)
+ ### Loading and error states                     (NEW)
  ### Commits and branches                         (RENAMED from "Commits"; absorbs the
                                                    two-day rule)
  ### When you get stuck
  ### Keep the feedback loop running                (RENAMED from "Local environment";
                                                    grows: migration command)
+ ### AI in development                            (NEW — D-35)
## Artifacts                                       (fix: UI location)
## Definition of done                              (fix: loading/error, `as`, PR ordering,
                                                    tsc --noEmit)
## Scaling to a team
## Traps                                           (fix: 'use client' entry; grows: two
                                                    claims currently homed only here)
```

The two renames come from the consultability pass. `### Local environment` reads like
env-var setup, which is stage 04's territory, while holding the page's strongest single
claim — "Vitest in watch mode in a spare terminal is the highest-leverage habit on this
page." The reader who would benefit most never clicks it. `### Commits` attracts every
version-control question and answers one, which is how the branch-lifetime question scored
the pass's only miss.

### The branch-lifetime number

Stated three times in three numbers today: "two days" in `### The loop`, "two weeks" in
`## Traps`, "a day or two" in `## Entry criteria`. Only the first is a rule.

**Two days is the rule.** `### The loop` keeps the argument, because it follows from
"smallest shippable slice" and moving it whole would separate rule from reasoning.
`### Commits and branches` mirrors the rule as an operational line. `## Traps` keeps its
two-week failure story, reframed so it reads as the consequence of breaking the rule rather
than as a competing threshold. `## Entry criteria` aligns to "two days".

### Code blocks

Every block compiles as printed. Concretely: the Server Action gains its three missing
imports, `InvoiceTable` gets produced rather than referenced, `queries.ts` gets a body, and
the two route examples stop disagreeing about whether route files show imports.

Two blocks change behaviour rather than only completeness:

- The Server Action returns a typed result instead of throwing, per Next's error-handling
  guide: expected errors are "modelled as return values", not thrown. Its return value stops
  being the raw Drizzle update result, which must cross an RPC boundary and currently leaks
  the database shape into the client contract.
- The update folds the owner into its `where` rather than checking ownership on a prior read
  and then updating by id alone. Check-then-act in the page's own security exemplar.

**Rejected inline:** keeping the throw and documenting the masking behaviour. The
completeness reader justified the finding by asserting that Next masks Server Action error
messages with a digest in production. That mechanism could not be confirmed in the shipped
docs and is not carried forward. The finding stands on the doc's own prose/code mismatch —
it says "Return" four lines under code that throws — and on Next's documented guidance,
both of which are citable.

### The anchor guard

`source-citations.test.ts` scans `web/src/` for citations of the form
`docs/NN-name.md, "Heading"` and resolves each against the real headings. It cannot see
markdown-to-markdown links, so `[05 — Development](05-development.md#commits)` in
`docs/10-documentation.md` is unguarded — and this round renames that heading.

Four such links point into stage 05 today: one into `#commits` from `docs/10-documentation.md`,
two into `#server-actions-need-validation-and-authorization` from `docs/03-architecture.md`,
one from `docs/07-code-review.md`. Only the first breaks, because the other heading is
deliberately not renamed.

The round extends the test to resolve every `](NN-name.md#anchor)` link across `docs/`
against the target document's real headings, using GitHub's slug rules. This is not scope
creep for its own sake: the round is about to rename a heading four citations depend on, in
a repo whose recorded standard is that a decision needs a test, and TD-5 already records
that the link-resolution figures quoted in the tracker came from P-4 scripts that no longer
exist.

## Testing

TDD applies to the two testable pieces. The doc prose is not testable and is covered by
verification instead.

1. **Anchor guard.** Write the test first. It must fail against the renamed heading — that
   is its RED, and it is also the teeth check, because the failure is a real break rather
   than a synthetic one. Then fix `docs/10-documentation.md` and watch it go green. A second
   teeth check confirms the guard catches a *fabricated* bad anchor too, so that a guard
   which only ever sees one true case is not mistaken for a working one.
2. **`### AI in development`.** Add `05-development` to `AI_SECTION_STAGES` in
   `web/src/lib/stage-metadata.test.ts` **before** writing the section, so the test fails
   naming the missing heading, then write the section. The list is explicit rather than
   derived from `ready` precisely to make this ordering possible.

Existing tests that must stay green and are load-bearing here: `stage-metadata.test.ts`
(H1 sync), `source-citations.test.ts`, `glossary.test.ts`, and the full `pnpm test` run.

## Verification

- **Execution pass, re-run.** Every code block in the corrected doc compiles against the
  prescribed stack, in the harness at `scratchpad/doc-exec-05/`. Recorded with raw
  terminal output for the run, and teeth-checked with a reverted mutation.
- **Cold-reader run 2**, same `sprout` scenario as run 1, so the results compare. The method
  is explicit that a different scenario produces a fresh unrelated list and tells you nothing
  about whether anything was fixed.
- **Consultability run 2**, same five questions, to confirm the branch-lifetime miss closes
  and that the two renames did not break a question that previously scored HIT.
- **A fix wave is budgeted after run 2, not treated as optional.** D-48. The wave lands after
  the pass that justified it, so by construction nothing checks it — stage 03's fix wave
  shipped that round's only unrunnable SQL, and a later whole-branch review caught it. The
  cheap mitigation is to re-skim the wave's own additions and read anything containing code
  as code.
- **Per-task review subagents**, then a whole-branch review before the merge request. The
  same session cannot self-review: the reading that produced the claim produces the check.

## Documentation updates

- `docs/05-development.md` — the round's subject.
- `docs/10-documentation.md` — one anchor citation, broken by the rename.
- `web/src/lib/stage-metadata.test.ts` — one slug.
- `web/src/lib/source-citations.test.ts` — the anchor guard.
- `docs/tracker.md` — the W-3.5-doc row with evidence, a `Deferred:` list, and decisions.
- `docs/task.md` — status of the stage 05 doc phase.
- `KICKOFF.md` — refreshed for the port round, including the corrected `##` count.
- `reference/glossary.md` is **generated**. If the round needs a term, edit
  `web/src/lib/terms.ts` and run `pnpm gen:glossary` (D-47).

## Risks

**The doc more than doubles, and length is not the goal.** Stage 04 went 323 → 711 and the
material earned it, but the failure mode is real: a page that teaches every mechanic stops
being the consultable reference the consultability pass says it currently is. The mitigation
is that run 2 measures consultability rather than assuming it, and a section that makes the
page harder to look things up in is a defect the round must catch itself.

**The new mechanics pull toward tutorial.** The caller, revalidation and loading/error states
are the sections most likely to drift into teaching Next.js rather than teaching the loop.
Each is capped at what a reader needs to finish a slice, with the rest handed to Next's own
documentation by link.

**A fix wave introduces new contradictions faster than the author notices**, because the
author checks each addition against intent rather than against the other 600 lines. This is
the documented reason run 2 exists, and the reason a wave is budgeted after it.

**The anchor guard could be a check that cannot fail.** A guard that resolves zero links, or
matches nothing because its slug rules are wrong, is green and worthless — this repo's most
common defect class, now past seven instances. It gets two teeth checks: one real break and
one fabricated.

**The two renames are the round's only irreversible-ish change to other documents' surface.**
Both are justified by measurement, and one is guarded by the new test. `### Server Actions
need validation and authorization` is deliberately not renamed for exactly this reason.

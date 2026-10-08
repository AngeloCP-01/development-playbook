# Stage 09 Performance Optimization: chapter before port

## Problem

The canonical chapter says to measure before optimizing, but its loop at
`docs/09-performance-optimization.md:21` never shows a reader how to obtain or
record the first measurement. It moves from targets at `:35` to tools at `:49`
and fixes at `:68`. A reader can follow its index example without knowing which
user action was slow, how often, or whether the change helped.

Several claims need correction before they reach the app. The chapter omits CLS
from its Web Vitals targets (`:39–42`), presents API and database latency numbers
as general standards (`:41–42`), diagnoses any large-table sequential scan as a
missing index (`:65`), asks for an index on every filtered or sorted column
(`:193`), and tells Next.js 16 readers to inspect bundle sizes in `next build`
(`:149–154`). The [Stage 09 source audit](../../../reference/stage-09-performance-sources.md)
ties these and the other corrections to primary documentation.

Stage 09 is still a placeholder in `web/src/lib/stages.ts:105–113`. Porting the
current prose would teach unsupported shortcuts without a usable baseline.

## Goals

- Teach **how to measure first**. Start with an affected user journey, choose
  the metric that represents it, collect a field baseline where possible, and
  reproduce the symptom in a controlled lab or trace. Record route/action,
  metric and percentile, time window, device segment, sample size, deployment
  version, test-data shape, and cache state so the comparison can be repeated.
- Use one invoice-list example throughout: baseline, user-facing target,
  bottleneck evidence, one justified intervention, and a production retest.
  Example values must be labelled illustrative, not represented as measurements
  of this repository or a live invoice application.
- Correct the chapter against the cited primary sources, including all three
  Core Web Vitals, PostgreSQL plan interpretation, concurrent index caveats,
  Next.js 16 cache and bundle advice, and the limits of tracing and images.
- Carry the corrected chapter into a deep-linkable interactive stage after the
  chapter is reviewed. A reader should practice choosing a metric, reading
  evidence, deciding whether to change anything, and recording the comparison.
- Preserve researched sources for the planned W-6 `caching` and `scaling`
  sheets without drawing either sheet in this round.

## Non-goals

- A live benchmark of this static playbook: it has no invoice backend, so a
  fabricated production result would teach the wrong evidence standard.
- Universal API or database latency budgets: their targets depend on the user
  journey and measured baseline. The chapter can show an example target with
  its rationale.
- A catalog of scaling algorithms in the Stage 09 chapter: load balancing
  belongs in the planned W-6 `scaling` lookup sheet and is not the routine fix
  for the invoice case.
- Publishing a third-party image: no researched graphic has verified
  image-specific reuse rights and a suitable fit for the measurement loop.
- W-6.4 glossary/stack surfacing or building the `caching` and `scaling`
  sheets; source gathering here prepares that later work.

## Constraints

- The markdown chapter is canonical. Revise and review it before porting
  content into React; do not widen the hand-ported duplication without noting
  where the chapter and app must agree.
- Stage 09's cadence is “On measured slowness only” in
  `web/src/lib/stages.ts:105–113`. It is a filing code, not a step after Stage
  08. Keep the design consistent with `web/DESIGN.md` and `web/PATTERNS.md`.
- Field data describes actual users; controlled lab data helps diagnosis. Do
  not claim a single lab run is a field percentile. Low traffic may leave too
  little field data for a stable percentile; state that limit and use a
  controlled baseline while waiting for enough observations.
- For Web Vitals use [Google's thresholds](https://web.dev/articles/vitals):
  LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75, assessed separately for mobile
  and desktop. Averages can be useful but do not replace tail percentiles.
- A query plan is evidence to interpret, not a prescription. PostgreSQL's
  [EXPLAIN guide](https://www.postgresql.org/docs/current/using-explain.html)
  shows that a sequential scan can be the cheaper choice. Index candidates
  must be checked against the real query and write cost.
- Next.js code guidance must match the installed Next.js 16.2.10 docs in
  `web/node_modules/next/dist/docs/` before it is published. `updateTag` is
  Server Action only, and `next build` no longer reports JS bundle sizes.

## Architecture

### Chapter

Open the work section with a first-measurement procedure. It should tell a
reader where to look for field Web Vitals and route latency, how to choose one
affected route/action and segment, how to run a repeatable lab check, and how
to log the baseline. Keep page experience, request latency, and database
query time distinct; they measure different parts of the journey. Link from a
slow function or trace to an instrumented operation, then use an actual query
plan when the database is implicated. Explain what to do when field samples are
insufficient.

Keep the invoice list as the running case. Show a compact measurement record
with clearly illustrative values and the evidence that leads to one fix. The
case must show at least one plausible alternative rejected by measurement;
otherwise “find the bottleneck” is only a slogan. Compare the same scope and
cache state after the change and include a production observation window. If
the result misses the target or regresses correctness, the decision is to
investigate further or revert.

Reframe the existing fixes as conditional options. Keep N+1, indexes,
independent awaits, cache, bundle analysis, images, and Server Components,
but state the evidence that would justify each. Replace the inaccurate
absolutes and correct copyable examples. Add `### AI in performance optimization`
with useful assistance in summarizing measurements or generating hypotheses,
and a firm requirement to verify metrics, query plans, and before/after claims.
Make Artifacts and Definition of done require a comparable measurement record,
not a blanket index checklist.

This worked-case structure was selected over a narrow errata pass: errata
would repair facts but leave the first-measurement gap. A broad scaling survey
was rejected because it would obscure the chapter's measured-slowness loop and
duplicate the future W-6 `scaling` sheet.

### Interactive port

After chapter review, group panels by judgment rather than copying paragraph
boundaries. Likely decisions are: which user action and metric to measure; what
the baseline does and does not prove; where time is spent; whether an index,
query-shape change, cache, or no change is justified; and how to compare and
stop. Use the shared `Stepper` and existing disclosure and decision patterns.
The active step remains in the URL hash. An illustrative data set must be
labelled as such; the interface must not imply it measured the reader's app.
Include the standard AI step and keep each panel within the four-screen budget.

### W-6 source handoff

`reference/stage-09-performance-sources.md` holds direct links and rights
caveats for the planned `caching` and `scaling` sheets. Before either sheet is
drawn, choose its scope and plate separately, record exact image provenance if
one is copied, and distinguish CDN caching from Next.js application caching.

## Testing

- Write chapter guards before prose edits. They should fail on the missing
  first-measurement method, absent CLS, overbroad scan/index rules, outdated
  build instruction, and missing AI section. Show RED for the expected reason,
  then GREEN and a teeth check for the new guards.
- Check SQL and TypeScript examples against their actual tools and versions.
  Avoid pseudo-code in a fence that looks executable; if a fragment is only a
  sketch, label it clearly.
- When porting, add render tests for data-derived decisions, baseline fields,
  and the before/after verdict. Run RED/GREEN and a teeth check per behavior.
- Run format, lint, typecheck, unit/DOM tests, build, production browser audit,
  and the development-console audit for the stage round.

## Verification

Review each changed claim against the source audit and installed framework
docs. Check that field and lab values are never presented as interchangeable,
that the same route/segment/window definition is used in the comparison, and
that a database index is presented as a measured candidate. A cold reader
should be able to use the chapter alone to produce a baseline record before
seeing any proposed fix. Review the chapter before its port; then review the
whole branch, both themes, responsive widths, console, and stage-to-doc
coverage before proposing integration.

## Documentation updates

Record the approved scope and phase results in `docs/task.md` and
`docs/tracker.md`, with source URLs and any selected graphic in
`reference/cheatsheet-sources.md`. Keep the source audit linked. The existing
uncommitted Stage 08 count correction in `docs/task.md` should be committed
separately from Stage 09 records. Record deliberate deferrals and the evidence
for each completed phase.

## Risks

- A plausible illustrative number may be mistaken for observed production
  data. Label the example at each point where a reader could copy it.
- A lab improvement may disappear for real users or under different cache and
  data states. The comparison must keep its scope visible and require a field
  follow-up when traffic permits.
- A performance fix can change correctness, especially caching and query
  scope. Keep correctness tests and rollback criteria in the worked case.
- Source pages and framework behavior can change before the app port. Recheck
  the exact APIs and statements when implementing, rather than relying on this
  dated audit alone.

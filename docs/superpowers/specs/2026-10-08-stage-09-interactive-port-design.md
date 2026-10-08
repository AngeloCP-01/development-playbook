# Stage 09 interactive port

Date: 2026-10-08. Milestone: W-3.16.

Status: approved 2026-10-08. After the written spec was presented, the user
replied "proceed", approving the handoff to implementation planning. The
scope pairs a worked order example with an own-app worksheet. Implementation
waits for review of the task plan and selection of its execution method.

## Problem

Stage 09 has a reviewed measurement-first chapter but still renders the
placeholder: `web/src/lib/stages.ts:112` has `ready: false`, and
`web/src/features/stage-content.ts:21` has no Stage 09 entry. A reader can
read the chapter but cannot practice defining a measurement, inspect the
worked order journey, or take away a performance record for their own app.

The chapter round exposed two mistakes that the port must guard against.
The percentile population needs an explicit timeout rule, and a server route
or webhook interval cannot stand in for the entire user outcome. See the
[chapter report](../reports/2026-10-08-stage-09-chapter.md), especially
"Cold reader and review", and the canonical chapter's "Measure the first
baseline" and "Map the order journey" sections.

The audience is a reader learning the topic while working on an application.
Success means that reader can define a user-visible baseline before choosing
a fix, distinguish diagnosis from outcome evidence, and export a record that
makes the eventual comparison possible.

## Goals

- Make the first activities define the observer, start and stop events, and
  baseline record. Introduce fixes after those activities in reading order.
- Teach checkout, visible payment status, and downstream completion as
  distinct outcomes. Keep route, provider, webhook and consumer timings in
  their diagnostic roles.
- Carry the chapter's 20-item cart example through baseline, bottleneck
  evidence, batching and retest. Label every exercise dataset hypothetical.
- Teach what evidence would justify each of the chapter's candidate fixes,
  including choosing to stop when the outcome already meets its target.
- Pair practice with a locally saved worksheet and Markdown export for the
  reader's own application. Keep their record separate from example answers.
- Port the chapter's artifacts, completion checks, team practice, AI guidance
  and traps, with inline definitions and a short source list.

## Non-goals

- The W-6 `caching` and `scaling` sheets stay separate because each needs its
  own lookup scope and publication review.
- The site will not run orders, SQL, payment calls or performance probes.
  It has no ordering backend; an exercise cannot measure the reader's app.
- This round will not add a query-plan parser, percentile calculator or
  telemetry importer. The learning task is defining and judging evidence,
  rather than implementing a monitoring product.
- Cross-stage worksheet migration and shared drill extraction are deferred.
  Neither is required to deliver the performance record.
- The reviewed chapter remains canonical. Any factual correction found while
  porting needs a documented chapter change, rather than an app-only rewrite.
- Merge, push and production promotion are separate decisions. This spec
  does not authorize integration into `develop` or `main`.

## Constraints

The app uses Next.js 16.2.10 and React 19.2.4, as installed in
`web/package.json`. The site's current configuration is
`web/next.config.ts`; this round leaves its build and hosting configuration
alone. Static teaching panels can be Server Components, with Client
Components only for selection, exercises, persistence and clipboard actions.
The installed Next.js guides for Server and Client Components, static exports,
`updateTag`, images and CLI behavior were read while preparing this spec.
Runtime cache APIs are teaching content, not features to activate in this app.

Follow `web/DESIGN.md` and `web/PATTERNS.md`. Match the whiteprint and cyanotype
themes, existing type roles and semantic colors. Each panel holds one judgment
and fits the four-screen budget at 1024×768. The shared
`web/src/components/Stepper.tsx:155` renders one active panel, so independent
exercise state may restart after leaving its panel. The worksheet must survive
panel changes and reloads.

The step rail remains freely navigable and deep-linkable. "Baseline before
fix" is the lesson's reading order, not a gate that blocks a reader entering
at a later hash. Stage numbers remain filing codes.

The chapter and app duplicate teaching content by established design. This
port adds that known duplication; it will use explicit coverage mapping and
focused guards for the load-bearing measurement rules. Glossary definitions
continue to live only in `web/src/lib/terms.ts`.

## Architecture

### Selected approach

Use a guided worked case followed by an own-app worksheet. A worked-case-only
port would teach the decision but leave the reader without a reusable record.
A worksheet-only port would ask for measurements before showing how to define
them. The paired approach reuses the worksheet pattern documented in
`web/PATTERNS.md` and exemplified by
`web/src/features/architecture/DomainWorksheet.tsx:126`.

### Reading order and coverage

These are twelve proposed panels, not a measured final count. During live
verification, split an over-budget panel at its judgment boundary or disclose
detail while retaining every requirement below.

| Hash | Reader's judgment and interaction | Chapter coverage |
|---|---|---|
| `clock` | Select an outcome in the order-flow inspector; identify its observer and start/stop events | Entry criteria; Map the order journey |
| `baseline` | Commit to measurement-record choices, then inspect the assembled practice record | Measure the first baseline |
| `target` | Inspect published page-experience thresholds versus a justified product target | Decide what fast enough means; When not to optimize |
| `bottleneck` | Inspect diagnostic evidence for the worked cart and commit to a hypothesis | Find the real bottleneck; N+1 candidate |
| `query` | Inspect the chapter's SQL and judge what a plan can establish | Query-plan portion of Find the real bottleneck; index candidate |
| `fixes` | Open evidence, correctness and retest conditions for each candidate | The fixes that usually matter, all seven candidates |
| `compare` | Judge whether before/after evidence supports a win, further observation or rollback | Worked comparison; When not to optimize |
| `record` | Write and save the reader's own outcome, metric, scope, window/sample, evidence and target | Baseline artifact |
| `followup` | Save hypothesis, change, after evidence, correctness/rollback and disposition; export the whole record | Remaining artifacts; before/after record |
| `ai` | Open useful assistant tasks and inspect one copyable prompt with evidence requirements | AI in performance optimization |
| `done` | Track completion evidence and open TeamNotes | Definition of done; Scaling to a team |
| `traps` | Open each failure mode and its prevention | Traps, all eight entries |

### Measurement boundaries and first activity

`OrderJourney` shows the synchronous path from validation through response,
then the separate payment-webhook path to `OrderPaid`. Inventory, logistics
and notification consumers branch from the event. Use a responsive HTML/CSS
diagram with real buttons and a detail panel; the narrow layout must preserve
the branching relationships. Figure 1's caption states that these paths have
different measurement boundaries.

Outcome selection displays observer, start, stop, suitable evidence and what
the outcome does not establish:

- Checkout: browser observer, Place order click to response receipt. Server
  route duration is a diagnostic interval within that experience.
- Payment: user-visible observer, payment submitted to Paid visible. Separate
  provider waiting, webhook receipt to persisted Paid, and persisted Paid to
  visible status when locating delay.
- Downstream action: select inventory, logistics or notification completion.
  Publish-to-consumer completion measures processing lag; a notification
  consumer finishing is not proof that a customer received or saw a message.
  A user-facing delivery promise needs its own delivery observer and stop event.

Use opaque identifiers to explain correlation. Traces only show instrumented
work; an absent span does not prove an operation or provider wait was absent.
Consumer dependencies require an explicit product rule before drawing a
serial edge.

The baseline practice then fixes its scenario to browser checkout for the
20-item cart. Say this explicitly; selecting payment in the earlier inspector
does not silently relabel checkout evidence. The practice asks the reader to
choose entries for outcome, metric/population, scope, window/sample and
evidence. Commit before revealing reasoning. After completing the choices,
show the resulting five-field practice record, including annotations for
incorrect entries. Count correct choices, rather than turning filled fields
into a claim that the record is valid. Provide reset.

Records use stated date windows, versions, device/network segment, cart/data
shape and cache state. Numerical outcomes remain unfilled where the chapter
provides no measurements. "Hypothetical exercise" stays visible with the
record. A trace or controlled reproduction supports diagnosis; it cannot fill
the field p95 cell. Sparse field samples are recorded as insufficient, with a
controlled baseline and an explicit follow-up observation window.

For the order examples, duration percentiles describe completed outcomes
with an observed stop event. Record the population rule, completed sample
count, total attempts, failures and timeouts separately. Failure categories
may overlap completed outcomes; the interface must not sum those categories
as if they partitioned the sample. The same definitions apply after the change.

### Targets, diagnostic evidence and candidate fixes

The targets panel preserves the distinction between published Web Vitals and
product-specific latency budgets. LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 are
assessed at p75 separately for mobile and desktop. The 300 ms API and 50 ms
query budgets are examples. Cite [Google's Web Vitals guide](https://web.dev/articles/vitals).
The panel also explains why traffic volume alone does not decide whether a
critical workflow needs improvement.

The bottleneck exercise shows the chapter's evidence: 21 inventory queries
for the 20-item cart and repeated round trips dominating the controlled
request. Ask the reader to choose batching, image work, or more evidence
where evidence is insufficient. Reveal the batching rationale only after
commit. Avoid fabricated millisecond bars. Show query counts as diagnosis,
with browser outcome values still awaiting observation. Figure 2 compares
repeated lookups with the batched availability lookup.

The query panel quotes the chapter's `EXPLAIN (ANALYZE, BUFFERS)` SELECT
verbatim through `AnnotatedArtifact`. An interpretation exercise distinguishes
a small-table sequential scan, an actual/estimated-row gap requiring
investigation, and a slow selective owner-and-creation query needing a
candidate index experiment. Label case descriptions hypothetical, rather than
presenting invented output as an executed plan. Teach actual versus estimated
rows, filtered rows, buffers and time; planner cost is not milliseconds.
Use [PostgreSQL's EXPLAIN guide](https://www.postgresql.org/docs/18/using-explain.html).

`RevealList` holds all seven candidate fixes: index/query shape, N+1, serial
awaits, caching, client bundles, images and Server Components. Each row names
the evidence that would justify it, the correctness risk, and the comparable
retest. Preserve the chapter's specific caveats:

- The owner/creation index is a candidate for that query shape. Consider write
  cost, write blocking, transaction restrictions and failed concurrent builds.
- Parallelize independent operations only. The two 150 ms calls are an
  arithmetic illustration, not a promised latency improvement.
- Cache freshness and authorization need checks. `updateTag` is Server Action
  only and makes the next read wait for fresh data; TTL and other invalidation
  paths have different behavior.
- A Next.js 16 production build does not report route JS bundle sizes. An
  analyzer identifies shipped client code; the affected outcome decides value.
- LCP images may need eager loading or fetch priority. Default image
  optimization needs a compatible loader for static export.
- Server Components can reduce client code and fetching waterfalls. They do
  not make an expensive server query fast or eliminate every loading state.

### Comparison exercise

Use four cases with commit-then-reveal reasoning: query count improves while
user outcome evidence is absent; comparison changes cache or segment;
comparable user outcome meets its target with unchanged correctness and
failure measures; latency improves while stock behavior or failures regress.
Their verdicts are respectively more observation, repeat a comparable
measurement, stop this optimization pass and observe, and investigate/revert.
Describe the evidence categorically instead of inventing production p95s.

Display the same outcome/observer, population rule, scope, window lengths,
completed sample counts, failures and timeouts beside both records. Deployment
versions and observation dates differ deliberately; comparability requires
recording that change, not identical version strings or overlapping dates.
A field follow-up can have a different sample count, provided the sample and
limitations are visible. A win requires the chosen user outcome and target,
correctness evidence and acceptable failure/timeout behavior. Missing evidence
cannot yield a win by default.

### Saved worksheet

`web/src/lib/performance-sheet.ts` will own `PerformanceSheet`, stable defaults,
field definitions, normalization and Markdown serialization. The storage key
is `playbook:performance-worksheet:v1`. All fields are strings; an empty
template and labels remain useful without production numbers.

The `record` panel holds six fields: outcome/observer/start/stop, metric and
population, scope, window/sample, evidence, and target/rationale. The
`followup` panel holds five: hypothesis/rejected alternative, change/version,
after evidence, correctness/rollback, and verdict/open gap/owner. Both views
use the same complete record and preserve the other panel's fields on edit.
Copy as Markdown exports every field from either panel, using "not recorded"
for blanks. Confirm clear before resetting the entire record, and label that
action "Clear whole record" in both views.

Use `useLocalStorage` (`web/src/lib/useLocalStorage.ts:59`) for hydration and
subscriptions. Its generic JSON parse does not validate a saved object's
shape. Normalize the value at the worksheet boundary: keep valid known
string fields, fill missing or invalid fields with empty strings, and ignore
unknown fields. Do not change the shared hook in this round.

Label the filled-field count as fields recorded, never verified performance.
Do not seed the reader's saved record with hypothetical answers. Provide
explicit clipboard success/failure status and manual-copy access if copying
is unavailable. Browser storage failures must leave an editable, exportable
record for the mounted session and show that saving is unavailable; test this
at the component boundary. The shared hook's failure path needs verification
before relying on it, since its read path rechecks the actual stored raw value.

### Components and integration

Keep `PerformanceOptimization.tsx`, `steps.ts`, teaching datasets and panels
in `web/src/features/performance/`. Split panel files by measurement,
diagnosis and closing content so one file does not own the whole port.
Client components are `OrderJourney`, `BaselineLab`, `DecisionDrill`,
`PerformanceWorksheet` and `PerformanceChecklist`. The baseline builder has a
different output contract from a scored case set; share the three diagnostic
exercise sets through one stage-local `DecisionDrill` instead of copying its
rendering for each set.

Existing `web/src/features/observability/Drill.tsx:102` provides a content
precedent, but carries custom radios and the known TD-19/TD-20 limitations.
New choice controls use native radio inputs with labels, an explicit commit
button, locked answers and reset. Mount live status containers empty before
their first update. This avoids copying those limitations into the new stage;
repairing older drills stays separate.

The completion checklist has its own storage key and the canonical five done
checks. Mount `TeamNotes` inside it with the chapter's four team practices.
The AI panel offers measurement-record organization, competing hypotheses
and controlled-reproduction help, using `superpowers:systematic-debugging`
as a relevant named process. The prompt requires redacted evidence, source
references and verification of arithmetic. It must not imply an assistant can
see live telemetry automatically.

Use `Figure` numbers in reading order: 1 for the journey, 2 for repeated
versus batched lookup, 3 for the annotated SQL. Reuse `Term` for `baseline`
and `percentile`; add only missing vocabulary required by this stage's first
encounters, including LCP, INP, CLS, N+1, query plan and cache invalidation.
Regenerate `reference/glossary.md` through `pnpm gen:glossary`.

Curate five references in `web/src/lib/references.ts:17`: Web Vitals,
field/lab differences, PostgreSQL EXPLAIN, Next.js cache behavior and
OpenTelemetry context propagation. Each explains what it adds. Topic-specific
links may also sit beside candidate-fix caveats. Check URLs in a real browser
before shipping, as `web/PATTERNS.md` requires.

Stage assembly is atomic: register the component in
`web/src/features/stage-content.ts`, import its declared ids into
`web/src/features/step-ids.ts:33`, and flip the Stage 09 `ready` field together.
The existing reciprocal guards in `web/src/lib/stages.test.ts:49` and `:67`
already reject partial registration. Stage 09 is already in
`AI_SECTION_STAGES` (`web/src/lib/stage-metadata.test.ts:59`); no new chapter
AI-section guard is needed.

## Testing

Use TDD for each production behavior: record raw RED and GREEN output, name
the expected failure, then deliberately break the implemented behavior for a
teeth check and restore it. Data tests alone do not cover displayed decisions.

| Behavior | Required observation |
|---|---|
| Journey boundaries | Render each selected outcome; assert observer/start/stop, diagnostic limits and three independent consumer branches |
| Baseline builder | Reasoning stays hidden until commit; assembled fields follow selections, incorrect entries remain marked, score and reset follow the dataset |
| Diagnostic drills | Changed data changes displayed explanation and correct choice; commit locks answers; reset clears state; native radios work by keyboard |
| Comparison | Internal improvement, changed scope and missing evidence cannot produce a win; harmful behavior produces investigate/revert |
| Sheet model | Normalize missing, invalid and unknown stored fields; export every field and distinguish blanks from evidence |
| Worksheet render | Edit on both panels, navigate away/back, remount/reload, export exact saved values, handle clipboard rejection, confirm/cancel whole-record clear |
| Storage unavailable | Denied reads/writes preserve mounted editable text and allow export, with an accurate save-status message |
| Completion | Checklist persists and resets, count derives from valid ids, TeamNotes carries all four team practices |
| Assembly | Observed rail matches declared ids; registry and ready state agree; final rendered panels cover every canonical section |

Pin only the chapter's load-bearing rules and exact SQL fence. Build a
coverage mapping from canonical section headings and the seven fix/eight trap
items to rendered panels. Do not assert broad prose snapshots or a hand-copied
overall test count. Derive each final count from its actual run.

## Verification

After implementation, run the repository gate from `web/`: format check,
lint, `pnpm typecheck`, unit/DOM tests and production build. Then run
`pnpm test:e2e` against that production build and `pnpm test:dev-console`
against a fresh development server. The former cannot detect React's stripped
development validation. Run the latter once for the round, and again if a
subsequent fix changes the behavior it was meant to check.

Inspect both themes and every panel at 320 through 2560 px. Include committed
incorrect answers, all disclosures open, longest worksheet text, loaded saved
data and failed clipboard/storage states. Check contrast, focus, radio keyboard
behavior, touch targets, overflow, hash navigation/back and the four-screen
panel budget. Measure before proposing any split; the twelve-panel proposal
does not prove its own fit.

Review doc-to-port coverage independently of this spec's checklist, including
bold candidate-fix and trap lead-ins. Check field/lab distinction against
[Google's explanation](https://web.dev/articles/lab-and-field-data-differences)
and recheck version-dependent framework guidance in the installed docs.
Run per-task read-only review and a final independent whole-branch review.
Apply `humanizer:humanizer` to prose before calling the port ready.

## Documentation updates

After this written spec is approved, produce a separate task plan at
`docs/superpowers/plans/2026-10-08-stage-09-interactive-port.md` through
`superpowers:writing-plans`. Present Inline and Subagent-Driven execution
with a recommendation grounded in the resulting task dependencies.

Record W-3.16 scope and evidence in `docs/task.md` and `docs/tracker.md`,
including a standing Deferred list and the report holding raw RED/GREEN,
teeth checks and review findings. The separate handoff branch
`docs/2026-10-08-stage-09-port-handoff` already carries pending records updates;
reconcile its contents before editing those records, without merging it under
this spec's authorization. The initial spec commit was cut from local
`develop` at `c99bf64` and changed only this spec. Planning and its records
follow on the design branch.

Keep W-3 at 14/18 until an approved port merge brings it to 15/18. W-6 remains
20/25. Refresh KICKOFF with measured branch state when preparing the next
handoff, and document saved-sheet behavior in PATTERNS only if this port
establishes a reusable pattern beyond the existing worksheet convention.

## Risks

- Hypothetical evidence can look like real monitoring. Keep its label beside
  exercises, records and figures; leave unmeasured p95s unfilled.
- The first inspector covers several outcomes while the worked case uses
  checkout. Name the switch explicitly and keep every dataset's boundary visible.
- A worksheet with all fields filled can look verified. Labels describe
  recording progress; evidence and verdict remain the reader's responsibility.
- Persistence spans two panels and uncertain storage availability. Exercise
  navigation, malformed entries and denied storage rather than assuming that
  a green serializer test proves persistence.
- Existing drill accessibility debt and storage-hook behavior can be copied
  accidentally. Use native radio semantics and test worksheet fallback locally.
- A diagram may turn consumer branches into a serial chain on a narrow screen.
  Preserve event-to-consumer grouping and assert the relationship in the render
  test, then inspect the actual responsive layout.
- The port can pass gates while omitting a chapter requirement. The independent
  coverage review must use the chapter as its starting point.

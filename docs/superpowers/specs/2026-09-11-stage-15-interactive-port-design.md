# Stage 15 (Observability) Interactive Port — Design

**Date:** 2026-09-11
**Stage:** 15 — Observability
**Source doc:** `docs/15-observability.md` (853 lines, 6 `##`, 12 `###`, after the doc round
W-3.12 closed on 2026-09-11 at `7418684`)
**Pattern:** the doc-round-then-port sequence stages 12, 13 and 14 used, with the doc round
already merged and reviewed

---

## Problem

Stage 15's doc is content-complete: two cold-reader passes, a fix wave, a D-48 re-run and a
whole-branch review have all run against it, and every claim it makes is pinned by
`web/src/lib/stage-15-structure.test.ts` (51 tests). It still renders the "sheet not drawn"
placeholder at `/stages/15-observability`, because `web/src/lib/stages.ts:173` says
`ready: false` and no component is registered for the slug. This spec covers porting it
into an interactive stage component.

It is the largest doc ported since stage 04 (711 lines → 15 steps) and stage 03
(1,507 → 22). The section count alone (12 subsections plus four closing lists) puts it
outside the "four to six steps" typical result; D-52 makes that a measurement, not a rule,
so this port lands where the panels say it lands.

## Goals

- Port all 853 lines of the doc into `web/src/features/observability/`, following the
  three-file trace `CLAUDE.md` describes and stages 12–14 executed
- Four guess-then-reveal drills, one shared component, so the stage's judgments are
  exercised rather than read: alert triage, log level, silence, scrubber
- Five annotated artifacts quoting the doc's TypeScript fences verbatim, so the code a reader
  lifts is the code the harness typechecked
- Close S4 from the findings file (bold lead-ins invisible to a table of contents) by
  making each lead-in a row title or Section title in the port
- Register the stage: `ready: true`, `STAGE_CONTENT`, `STEP_IDS`
- Add the glossary terms the doc introduces and does not yet define

## Non-goals

- **No persisted worksheet this round.** The doc says "write the numbers down" and a
  baselines/alert-set worksheet (the `Worksheet` pattern from stage 01, `useLocalStorage` +
  markdown export) would be the bridge from reading to doing. It is a fifth interactive
  component with its own storage and export path, and stage 14 — which consumes baselines —
  shipped without one. Deferred to its own bounded round immediately after this port, at the
  user's direction on 2026-09-11, so the port ships without a second review cycle on the same
  files.
- **No `observability` reference sheet.** Ten images are committed with no provenance
  (`450190c`); `reference/cheatsheet-sources.md` requires an author and a URL before any is
  registered. Unchanged from the doc round.
- **No new shared components.** Everything needed exists: `Stepper`, `RevealList`,
  `RevealFacet`, `AnnotatedArtifact`, `Figure`, `Term`, `InlineCode`, `TeamNotes`,
  `References`, `Section`/`Prose`/`Callout`/`Card`. `Drill` is stage-local, in the feature
  folder, the same way `TriageDrill` and `AuthorizationDrill` are — a fourth instance of the
  guess-then-reveal row in `web/PATTERNS.md`, not a new row.
- **No platform toggle.** Stages 13 and 14 gave Vercel and AWS their own steps because each
  had a page of platform-specific commands. Here the platform split is two short tables
  (four signals, log retention), which render as rows inside their steps. A toggle would be
  a mechanism for content that does not need one.
- **No re-editing of the doc.** The five minors the whole-branch review deferred (breadcrumb
  sample, `requestContext.run()` sample, deletion how-to, Fly.io in the tables, timing-safe
  token comparison) stay deferred. The port transcribes the doc as merged; a port that
  quietly improves its source widens the known duplication `CLAUDE.md` warns about.

## Constraints

- **Three-file registration is one atomic task** — `stages.ts`, `stage-content.ts`,
  `step-ids.ts` in the same task, per `CLAUDE.md` and KICKOFF's open-threads note. Nothing
  before that task flips `ready`.
- **Every data file is pinned against the source doc** via a `doc-source.ts` that wraps
  `docSource('docs/15-observability.md')` the way
  `web/src/features/post-deployment-verification/doc-source.ts` does. Data tests precede
  render tests; RED before GREEN; the failure reason stated.
- **D-52:** one judgment per step, no panel over four screens at 1024×768.
  `web/e2e/audit.spec.ts` measures it. The known seam if step 8 (`silence`) is over is
  written into the architecture below so the split is a decision already made, not one
  improvised mid-task.
- **`AI_SECTION_STAGES` already lists `15-observability`** (added in the doc round, Task 1).
  Do not add it again; the test would not fail on a duplicate, but the list is the record.
- **Terms:** added to `web/src/lib/terms.ts`, then `pnpm gen:glossary`; `glossary.md` is
  never hand-edited (D-36). Existence is checked before adding — `canary`, `percentile`,
  `slo`, `error-budget`, `golden-signals`, `baseline` and `timeout` are already there, four of
  them tethered to this stage.
- **Semantic colour:** `go`/`danger` carry drill verdicts; `brand` is attention only
  (`web/DESIGN.md`; `TriageDrill.tsx`'s header comment says why).
- **`InlineCode` for every string that came out of the doc.** The drills' prompts and
  `why` fields will carry backticks (`` `beforeSend` ``, `` `finally` ``), as stage 04's
  data did (D-67).

---

## Architecture

### Step grouping — 10 steps

```ts
// steps.ts
export const STEP_IDS = [
  'three', 'errors', 'logs', 'where', 'signals',
  'health', 'alerts', 'silence', 'ai', 'done',
] as const
```

| # | id | Label · hint | Doc sections | Judgment / interaction |
|---|---|---|---|---|
| 1 | `three` | Three things · in order of value | `### Three things, in order of value` + `## Entry criteria` | The on-ramp. Monitoring-vs-observability opener as `Prose`; the three things as a 3-row `RevealList` whose third row carries "you will know when you need them". Entry criteria as a list, the way stage 14's `verify` step opens. |
| 2 | `errors` | Errors that are useful · context, then scrubbing | `### Errors that are actually useful` | `identifyUser`/`SafeContext` as `Prose` with the opaque-id argument; **`SCRUBBER` artifact** (`sentry.server.config.ts`); the three-runtime-files note; **Scrubber drill**; quota exhaustion as a `Callout kind="warn"`. |
| 3 | `logs` | Structured logs · objects, not sentences | `### Structured logs` | **`LOGGER` artifact**; the `Error`-has-no-enumerable-properties explanation; level ladder as a table; **Log level drill**; request id, `setTag`, event naming, never-log list and cardinality as a 4-row `RevealList`. |
| 4 | `where` | Where logs go · stream, not storage | `### Where logs go, and what they cost` | Vercel/AWS retention as a 2-row `RevealList` (collector, default, what to set); cost order-of-magnitude as `Prose`; retention-is-privacy as a `Callout`. Small, and deliberately its own step: M4 was a MISS before this section existed, and a reader looking for "where did Monday's logs go" needs a rail entry to find. |
| 5 | `signals` | The four signals · and what normal looks like | `### The four signals` | 4-row `RevealList`, one per signal, each body carrying the doc's table row transposed (where it comes from → Vercel → AWS); "error rate does not come from your error tracker" as a `Callout kind="warn"`; percentiles and the two-latencies note as `Prose`; baselines as the closing `Callout`. |
| 6 | `health` | Health checks · liveness vs readiness | `### Health checks` | **`HEALTH` artifact**; the liveness route (3 lines) as a plain `Card` beside it; **Fig 1** (restart vs routing); the not-all-or-nothing readiness paragraph as `Prose`. |
| 7 | `alerts` | Alerts you will act on · actionable, or deleted | `### Alerts you will not learn to ignore` | **Alert triage drill** (the centrepiece); the hard-ceiling exception, the ratio floor, and the three moves for a noisy alert as a 3-row `RevealList`; fire-a-test-alert as a `Callout`; the handoff to stage 16 as a link. |
| 8 | `silence` | When nothing reports · and jobs nobody watches | `### Uptime monitoring from outside` + `### When nothing is reporting` + `### Jobs that nobody watches` | External check + certificate expiry as `Prose`; **`CANARY` artifact**; **Silence drill**; **`HEARTBEAT` artifact**; not-in-`finally`, `TreatMissingData`, withhold-a-ping, duration and overlap as a 4-row `RevealList`. |
| 9 | `ai` | AI plays · where agents help | `### AI in observability` | Standard `AIPlays`: premise, 6 plays, limit. |
| 10 | `done` | Traps & checklist | `### Dashboards` + `## Artifacts` + `## Definition of done` + `## Scaling to a team` + `## Traps` | Dashboards as the opening block (five bullets, the `sentry-cli` release snippet in a `Card`, the Grafana data-sources paragraph); then 15 traps; `ObservabilityChecklist` (15 DoD, 10 artifacts, 6 team notes inside `TeamNotes`); `References`. |

**Why step 8 merges three doc sections.** Canary, silence and heartbeat are one judgment —
*absence is a signal* — and the reader who lands on any of them needs the other two. The
doc keeps them adjacent for the same reason (`the two silence sections sit after uptime
monitoring` is a pinned test).

**The known seam.** If the audit measures `silence` over four screens, split at the drill:
`silence` keeps canary + certificate + the drill; a new `jobs` step takes the heartbeat
artifact and its four rows. Dashboards then stays in `done`. This is the only split the
spec anticipates; any other means the panel weight was misjudged and the plan says so.

**Why Dashboards lands in `done`.** Five bullets, one snippet, one paragraph. Too thin to
hold a step's judgment alone, and "one screen, is the application healthy right now" reads
naturally as the closing move before the checklist.

**S4.** Each bold lead-in in the doc (`**Levels are a filter, not a mood.**`,
`**A ratio needs a floor.**`, `**Absence of a signal is not evidence of health.**`,
`**Withhold a ping on purpose…**`) becomes a `RevealList` row title, a `Section` title or a
`Callout` heading. The port's rail and row titles are the table of contents the markdown
never had.

### The `Drill` component

`features/observability/Drill.tsx`, `'use client'`. A generalisation of
`web/src/features/testing/TriageDrill.tsx:30` (which cloned stage 04's `DeployBlockers`)
with the question, subtitle, options and rows as props instead of module constants:

```ts
export type DrillOption = { id: string; label: string }
export type DrillRow = {
  id: string
  prompt: string      // rendered through InlineCode
  answer: string      // a DrillOption id
  why: string         // the doc's own sentence, rendered through InlineCode
}
type DrillProps = {
  idPrefix: string
  question: string
  subtitle: string
  options: DrillOption[]
  rows: DrillRow[]
}
```

Unchanged from `TriageDrill`: `role="radiogroup"` per row, `role="radio"` per option,
lock-before-verdict (the two-lock guard — `disabled` on the buttons plus the `commit`
guard — carried over with its comment), `aria-live="polite"` on the running score and on
each verdict, `go` for a correct answer and `danger` for a wrong one, a reset button, and
the header comment explaining why `brand` is never a verdict.

What generalising buys: one component, one render test, and four datasets that are pure
data. What it costs: `TriageDrill` and `AuthorizationDrill` stay as they are — migrating
them onto `Drill` would be a behaviour-neutral refactor across two shipped stages, and
`PATTERNS.md`'s note on the stage 01/02 disclosures says that kind of migration is its own
decision. Recorded as a follow-up, not done here.

### Drill data

Four files, each `{ QUESTION, SUBTITLE, OPTIONS, ROWS }`:

| File | Options | Rows | Where the answers come from |
|---|---|---|---|
| `alert-triage.ts` | `page` / `no-page` | 11 | the doc's "Worth alerting on" list (8, answer `page`) and "Not worth alerting on" list (3, answer `no-page`). The hard-ceiling `why` on the connection-pool row; the "signature you have never seen" `why` on the new-error row. |
| `log-levels.ts` | `debug` / `info` / `warn` / `error` / `fatal` | 6 | the level table plus the doc's worked cases: a card decline (`info`), the health check's unreachable dependency (`warn`), a payment-provider call throwing (`error`), the process unable to bind its port (`fatal`), a per-row SQL timing in development (`debug`), an external API returning `200` with a failure body (`warn`). |
| `silence.ts` | `seen` / `unseen` | 6 | the five bullets under `### When nothing is reporting` (all `unseen`) plus one control: an unhandled exception in a route handler (`seen`), so the answer is not always the same and the reader has to read. |
| `scrubber.ts` | `scrubbed` / `reaches` | 6 | `beforeSend`'s three surfaces (an `authorization` header, a form body, a connection string in an exception message — all `scrubbed`) against `addContext({ card })` without `SafeContext` (`reaches`), a breadcrumb carrying a token (`reaches`), and a `logger.warn` line — `reaches`, with a `why` that says `beforeSend` never sees a log line at all. |

Every `why` is a sentence from the doc, so `*.test.ts` pins it with `flat()`. Row counts
are asserted against the doc's own list lengths, the way `traps.test.ts` in stage 14 holds
11 traps against 11 bold leads.

### Artifacts

`artifacts.ts` exports five `Artifact`s (`web/src/components/artifact.ts:17`), each quoted
verbatim from a fence in the doc and held line-for-line by `artifacts.test.ts` against
`fences()`:

| Export | Fence header | Lines | Pivot |
|---|---|---|---|
| `SCRUBBER` | `// sentry.server.config.ts — edit the wizard's Sentry.init, do not add another` | ~24 | `if (value.value) value.value = redact(value.value)` |
| `LOGGER` | `// src/lib/logger.ts` | ~30 | `error: (err: Error) => ({` |
| `HEALTH` | `// src/app/api/health/route.ts` | ~30 | `await Promise.race([` |
| `CANARY` | `// src/app/api/canary/route.ts — reads the real path, writes nothing` | ~22 | `return Response.json({ ok: false }, { status: 503 })` |
| `HEARTBEAT` | `// At the start and end of the job — after the work, on the success path only.` | 7 | `await fetch(process.env.HEARTBEAT_URL!, {` |

Annotations go on the lines that carry a decision — the header deletes, the `SafeContext`
constraint, the `mixin`, the `serializers` block, the timeout, the `clearTimeout`, the
`404`-not-`401`, the empty-result branch, the `durationMs` payload — and nowhere else.
The liveness route (`src/app/api/health/live/route.ts`, three lines) renders as a `Card`
with a `<pre>` beside `HEALTH`, not as a sixth artifact: nothing in it carries a decision
except its emptiness, which the prose beside it states. `redact.ts` and `Sentry.setTag`
stay as `InlineCode` in prose; `redact.ts`'s three patterns appear in `SCRUBBER`'s
annotations rather than as their own block.

### Figure 1 — restart vs routing

In `health`. A static two-column grid, no interaction: **Restart decision** (Fly, ECS,
Cloud Run, a Kubernetes liveness probe) → *liveness endpoint, returns `200` whenever the
process runs*; **Routing decision** (a load balancer's health check, a Kubernetes readiness
probe) → *readiness endpoint, checks dependencies*. Caption states the claim: a restart
cannot fix a database, so the check that triggers one must not depend on it. Wrapped in
`Figure n={1}`. It is the only figure in the stage, which is why it gets the number.

### Component tree

```
Observability.tsx
├── Stepper (10 steps)
│   ├── three:   Section + Prose + RevealList(3) + entry criteria
│   ├── errors:  Section + Prose + AnnotatedArtifact(SCRUBBER) + Prose
│   │            + Drill(scrubber) + Callout(warn: quota)
│   ├── logs:    AnnotatedArtifact(LOGGER) + Prose + level table + Drill(log-levels)
│   │            + RevealList(4: request id · setTag · naming · never-log/cardinality)
│   ├── where:   RevealList(2: Vercel · AWS) + Prose + Callout(retention is privacy)
│   ├── signals: RevealList(4) + Callout(warn: error rate) + Prose + Callout(baselines)
│   ├── health:  AnnotatedArtifact(HEALTH) + Card(liveness) + Figure 1 + Prose
│   ├── alerts:  Drill(alert-triage) + RevealList(3: ceiling · floor · three moves)
│   │            + Callout(fire a test alert) + link to 16
│   ├── silence: Prose + AnnotatedArtifact(CANARY) + Drill(silence)
│   │            + AnnotatedArtifact(HEARTBEAT) + RevealList(4)
│   ├── ai:      AIPlays (premise, 6 plays, limit)
│   └── done:    Dashboards block + Traps(15) + ObservabilityChecklist + References
```

### Data files

| File | Exports | Shape |
|---|---|---|
| `steps.ts` | `STEP_IDS`, `StepId` | 10 ids, `as const` |
| `doc-source.ts` | `DOC`, `section`, `h2`, `flat`, `fences` | `docSource('docs/15-observability.md')` |
| `artifacts.ts` | `SCRUBBER`, `LOGGER`, `HEALTH`, `CANARY`, `HEARTBEAT` | `Artifact` ×5 |
| `alert-triage.ts`, `log-levels.ts`, `silence.ts`, `scrubber.ts` | `QUESTION`, `SUBTITLE`, `OPTIONS`, `ROWS` | `DrillOption[]`, `DrillRow[]` |
| `ai-plays.ts` | `AI_PREMISE`, `AI_LIMIT`, `PLAYS` | `Play[]` ×6 (kinds: `prompt` ×5, `cli-mcp` ×1) |
| `traps.ts` | `TRAPS` | `Trap[]` ×15 |
| `checklist.ts` | `DONE`, `ARTIFACT_LIST`, `TEAM` | `DoneItem[]` ×15, `string[]` ×10, `TeamNote[]` ×6 |
| `signals.ts` | `SIGNALS` | 4 rows: `{ id, name, source, vercel, aws }`, pinned against the doc table |

### Glossary terms

Checked against `web/src/lib/terms.ts` on 2026-09-11. Existing and reused: `canary`,
`percentile`, `slo`, `error-budget`, `golden-signals`, `baseline`, `timeout`. To add, each
with `name`, `short`, `full`, `soWhat`, `see: '15-observability'`:

| id | name |
|---|---|
| `heartbeat` | Heartbeat (dead man's switch) |
| `liveness` | Liveness check |
| `readiness` | Readiness check |
| `saturation` | Saturation |
| `cardinality` | Cardinality |
| `structured-logging` | Structured logging |
| `request-id` | Request id |
| `alert-fatigue` | Alert fatigue |

`term-usage.test.ts` already requires each term tethered to a stage to appear in that
stage's doc; all eight do.

### Registration (atomic, one task)

1. `web/src/lib/stages.ts:173` — `ready: true`
2. `web/src/features/stage-content.ts` — `'15-observability': Observability`
3. `web/src/features/step-ids.ts` — `'15-observability': OBSERVABILITY`

---

## Testing

### Data tests (pin against the doc)

| Test | Pins |
|---|---|
| `steps.test.ts` | 10 ids in order; unique |
| `artifacts.test.ts` | each artifact's `lines.map(l => l.text)` equals its fence in the doc, line for line; exactly one pivot per artifact; every `note` is non-empty; `language` is `ts` |
| `alert-triage.test.ts` | 11 rows; 8 answer `page`, 3 answer `no-page`; each prompt's key phrase is in the doc's list; each `why` in `flat()` |
| `log-levels.test.ts` | 6 rows; 5 options in ladder order; the decline row answers `info` and the health-check row `warn`; each `why` in `flat()` |
| `silence.test.ts` | 6 rows; exactly one `seen`; the five `unseen` prompts match the five bullets; each `why` in `flat()` |
| `scrubber.test.ts` | 6 rows; 3 `scrubbed`, 3 `reaches`; the log-line row's `why` mentions `beforeSend`; each `why` in `flat()` |
| `signals.test.ts` | 4 rows, names in the doc's table order; each `source`/`vercel`/`aws` cell in the doc |
| `ai-plays.test.ts` | premise/limit phrases in `section('AI in observability')`; 6 plays, unique ids, valid kinds; each title matches a bold lead |
| `traps.test.ts` | 15 traps against 15 bold leads under `## Traps`; unique ids |
| `checklist.test.ts` | 15 DoD items against 15 checkboxes; 10 artifacts; 6 team notes |
| `prose.test.ts` | ~10 phrases the panels quote, one per step, each in `flat()` |

### Render tests

| Test | Renders |
|---|---|
| `Drill.test.tsx` | with `scrubber` data: verdict hidden until a choice; choice locks (second click ignored, buttons `disabled`); score updates in an `aria-live` region; reset clears; `go`/`danger` class present on the verdict and `brand` absent |
| `Observability.test.tsx` | 10 tabs with the right labels; every drill mounts with its row count (four `radiogroup` sets sized 11/6/6/6); all five artifacts render their first line; the liveness `Card` renders `return new Response('ok')` |
| `AIPlays.test.tsx` | 6 titles; premise and limit reach the page |
| `ObservabilityChecklist.test.tsx` | 15 checkboxes; ticking persists; 10 artifact items; `TeamNotes` disclosure present and collapsed |

**Teeth check, planned for the plan:** for `Drill`, revert the `disabled` guard and confirm
`Drill.test.tsx` — and only it — reddens; for `artifacts.test.ts`, edit one line of `HEALTH`
and confirm the line-for-line assertion is the one that fails. Both are the checks stage
06's round wrote down as the ones that catch a vacuous pin.

---

## Verification

After all tasks, on the branch and again on the merge result if the user approves a merge:

- `pnpm lint` — 0 warnings
- `pnpm typecheck` — via `next typegen`
- `pnpm test` — both projects; count re-derived, not quoted
- `pnpm build` — `/stages/15-observability` prerenders
- `pnpm test:e2e` — **required**: a new route enters the audit sweep, and it measures every
  panel against D-52. If `silence` is over, take the split the architecture names.
- `pnpm test:dev-console` — **required**: unrun since 2026-09-07, this is a stage round, and
  the drills are client components with lists. Ask the user to stop their dev server rather
  than killing it.
- Contrast, both themes, all ten steps; responsive 320→2560 with no horizontal overflow on
  any artifact (the `SCRUBBER` and `HEALTH` lines are the widest); console clean.
- `humanizer:humanizer` over the panel prose, applied where it clarifies and skipped where
  the doc's voice is deliberate.
- `AUDIT_IDS=1 node e2e/count-expandables.mjs` against a fresh server, to record the
  expandable count the stage adds.

---

## Documentation updates

- `docs/tracker.md` — a W-3.12 (port) row: commit range, re-derived test count, what the
  per-task reviews and the whole-branch review caught, and the Deferred list below
- `docs/task.md` — stage 15 interactive; W-3 → **12/18**, six remain
- `KICKOFF.md` — project state, the next candidate stage, the worksheet round queued
- `web/PATTERNS.md` — the guess-then-reveal row gains a sentence: `Drill` is a fifth
  instance, parameterised, and the first to be reused across four datasets in one stage
- `web/src/lib/terms.ts` + `pnpm gen:glossary`

---

## Deferred, on the record

- **The baselines/alert-set worksheet** — its own bounded round after this port (user's
  call, 2026-09-11)
- **Migrating `TriageDrill` and `AuthorizationDrill` onto `Drill`** — behaviour-neutral,
  touches two shipped stages, needs its own decision
- **The `observability` reference sheet** — ten images, no provenance
- **The doc's five deferred minors** from the whole-branch review — unchanged
- **`docs/tracker.md`'s "Next up" section** — ten days stale, a separate pass

---

## Risks

- **Panel weight in `silence`.** Two artifacts and a drill in one panel is the heaviest
  step in the stage. The split is pre-decided (above); the risk is only that it is needed,
  and the e2e audit is what says so.
- **Drill prompts that give the answer away.** A prompt that quotes the doc's own verdict
  ("a CPU spike that self-resolves") is not a judgment. Prompts describe the situation;
  `why` quotes the doc. The per-task review checks this for each dataset.
- **Silence drill with five `unseen` and one `seen`.** The reader may learn the pattern by
  row three. Mitigation: shuffle is not available (the order is pinned), so the `seen`
  control goes in position 2 or 3, not last, and the subtitle says the answers are not all
  the same.
- **Term collisions.** `request-id` may exist under another id; `structured-logging` may
  overlap a stage 04 term. Check before adding, and update `see` rather than duplicate.
- **Artifact width.** `SCRUBBER`'s longest line is 84 characters; `HEALTH`'s `Promise.race`
  block is deeply indented. Test at 320px before calling the step done — the per-line
  scroller in `AnnotatedArtifact` should hold, and the audit fails if it does not.
- **The health check's `finally { clearTimeout(timer!) }`.** It is correct code and it is
  the doc's; a reader may read `finally` here against the heartbeat rule two steps later.
  The `HEALTH` annotation on that line says the two `finally`s are different — one is
  resource cleanup, the other would be a false success signal.

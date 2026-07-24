# Stage 02 — Product Planning (W-3, first stage) — Design

**Date:** 2026-07-24
**Scope:** `docs/02-planning.md`, `README.md`, `web/src/lib/`, `web/src/features/planning/`, `web/e2e/`
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** W-3 from `docs/task.md`, first stage in the revised order (D-27)

## Problem

Stage 01 promises stage 02 and then drops the reader on a placeholder. Its closing step
is captioned "One page, then hand off to planning"
(`web/src/features/discovery/ProductDiscovery.tsx:255`), and its `PipelineFit` figure
draws Discovery → Brainstorm → Plan → Build. Both land on the "sheet not drawn" fallback,
because `02-planning` is absent from `STAGE_CONTENT`
(`web/src/features/stage-content.ts:8-10`) and `ready: false` in
`web/src/lib/stages.ts:38`.

Underneath that is a framing problem found while researching this round. `docs/02-planning.md`
never says what kind of planning it is. Read against how the industry uses the words, it is
**product** planning — Atlassian's roadmap step ("feature prioritization determines which
capabilities are must-haves versus nice-to-haves") is `docs/02-planning.md:32-55` almost
verbatim — but the doc names none of the vocabulary a reader will meet everywhere else.
`MVP` and `roadmap` appear in **none of the eighteen stage docs**. For a playbook whose
stated job is teaching ground the reader has not worked in, that is a gap, not a style
choice.

Behind that sits a second gap, found by asking where a roadmap belongs. **The playbook has
no product vision anywhere** — "vision" appears as a product concept in none of the
eighteen docs. Stage 02's "not in v1" is a *rejection* list; stage 18 handles what comes
next *after* shipping, evidence-driven. Nothing says where the product is going, so the MVP
reads as a cut rather than as a first step.

Two smaller defects surfaced in the same pass:

- Stage 01's worksheet shape and storage key are private to a component
  (`web/src/features/discovery/Worksheet.tsx:16-24`, `:112-115`). Stage 02 wants to read
  that sheet, and copying the type would create a third instance of the TD-2/TD-3 pattern.
- Stage 02's `cadence` reads "After discovery · before architecture"
  (`web/src/lib/stages.ts:31`) — the most linear string in the file, on a playbook whose
  central claim is that the numbers are filing codes, not a sequence. The doc's own timing
  line is better: "Revisited every time scope shifts, which is often."

## Goals

1. `docs/02-planning.md` names itself as product planning and supplies the vocabulary —
   MVP, roadmap, appetite, feasibility risk — mapped onto the practices it already
   teaches.
2. Stage 02 gains a **roadmap horizon** — now / next / later — so the MVP is framed as a
   first step toward a stated product goal rather than only as a cut.
3. Stage 02 renders as a full interactive stage: six steps, nine figures, five judgment
   exercises, a persisted worksheet.
4. The stage 01 → 02 handoff is real: stage 02's worksheet reads what stage 01 saved.
5. `web/PATTERNS.md` is proven to transfer — the second stage is built from the pattern
   library rather than reinventing it.
6. The doc and the app agree at every point, per `README.md:136-138`.

## Non-goals

- **TD-2 / TD-3 (duplicated stage metadata and glossary)** — `docs/task.md:156-157` puts
  these before stage 03, not before 02. Stage 02 adds one stage's worth of drift; stage
  03 is where the compounding starts to hurt. Deferring keeps this round one round.
- **Retrofitting stage 01's "Scaling to a team" section** — stage 02 includes its team
  block, so an asymmetry with stage 01 is created deliberately. Fixing it means reopening
  a finished, polished stage mid-round. Recorded as debt instead.
- **Moving estimation and spikes into stage 03** — considered seriously and rejected.
  Research says release slicing is a product practice: Patton slices a story map to find
  the "smallest successful release", and Shape Up treats sizing as a bet (appetite), not
  an engineering breakdown. More decisively, `docs/02-planning.md:61-68` attacks
  layer-first sequencing by name; vertical slices exist so you do *not* need full
  architecture up front, so putting them after stage 03 inverts the doc's own argument and
  reintroduces the waterfall it was written to kill.
- **A separate Roadmap stage** — considered at two placements and rejected at both.
  *After architecture* (the original proposal) inverts a stated dependency:
  `docs/03-architecture.md:14` already lists "a plan with defined scope and vertical slices
  ([02])" as its entry criteria, so deciding MVP-versus-full-product after stage 03 means
  the expensive-to-reverse decisions were made without knowing what the product grows into.
  It is also the same error as moving slicing to 03, one level up. *Before architecture* is
  coherent but splits one activity in two — every source we gathered treats roadmapping as
  a step **of** product planning (Atlassian's step 5 of seven). Either placement costs a
  19th stage: 15 docs renamed, cross-links rewritten across 20 files, and the
  `there are exactly 18 stages, because the playbook says so` invariant
  (`web/src/lib/stages.test.ts:9`) broken. The horizon section inside stage 02 buys the same
  content for none of that.
  The real insight behind the ordering — architecture teaches you what is expensive, which
  should change the roadmap — is already served by the revisit loop (`README.md:47-48`).
- **A shared `playbook:project` store across all stages** — rejected. It makes stage 01 a
  migration target on day one of stage 02 and fixes a schema before stages 03–18 have said
  what they need. Read-only carry-forward gets the chain with none of the coupling.
- **Drag-to-reorder in the sequencer** — rejected. New interaction pattern, needs a
  keyboard fallback to meet the `PATTERNS.md` baseline, and drag math is the defect class
  the source project's final review caught. Click-to-order teaches the same judgment.
- **Deploy (W-5)** and **any edit to `docs/03-architecture.md`** — out of scope; the 02→03
  handoff is written from the 02 side only.

## Constraints

- The doc keeps its seven-section template — new framing goes *inside* "The work", so the
  18/18 template check still passes.
- The slug stays `02-planning`. Only the display title becomes "Product Planning", so
  every existing inbound link and the file path stay valid.
- Versions live in `reference/stack.md` and nowhere else; no version numbers in the doc.
- `Stepper` takes 4–6 steps; `Figure` numbers run across the whole stage and are passed
  explicitly (`web/PATTERNS.md:40-56`).
- `References` is capped at 3–5 by test (`web/src/lib/references.test.ts`), and every URL
  must be verified in a real browser — `WebFetch` returns navigation chrome for the
  Atlassian guide while the page renders fine under Playwright.
- Term visuals must use `<span>`, never `<div>`: a `Term` sits inside `<p>` and invalid
  nesting breaks hydration (`web/PATTERNS.md:72-74`).
- React 19 forbids setState in an effect body; localStorage is read through
  `useSyncExternalStore` (`web/src/lib/useLocalStorage.ts`).
- TDD per `CLAUDE.md`: failing test first, and a teeth check on every fix.

## Architecture

### Part A — the content amendment, first

Committed before any component, so the app is built from an already-correct doc.

1. **Retitle** — `docs/02-planning.md` H1, the `README.md:60` list entry, and
   `title` in `web/src/lib/stages.ts:33` become "Product Planning". Slug untouched.
2. **Frame it** — a short block inside "The work" stating that product planning names a
   lifecycle-wide band (ideate → research → vision → specification → roadmap → prototype →
   launch) and that this stage is its **vision → specification → roadmap** middle, with
   the other phases pointing at the stages that own them (research → 01, launch → 13,
   sunsetting → 17/18).
3. **Name the vocabulary** — MVP against "Cut to the core"; roadmap against the "not now"
   list plus slice order; appetite against "Estimate for sequencing, not for promises".
   Each is introduced where the practice already lives, not in a glossary dump.
4. **Set the horizon** — a new section after "Write the plan", giving the playbook the
   product direction it currently lacks, in the standard dateless format:

   | Horizon | Holds | Sourced from |
   |---|---|---|
   | **Now** | the MVP | the output of "Cut to the core" |
   | **Next** | evidence-triggered work | the prioritised "not now" list → hands to stage 18 |
   | **Later** | the complete product goal | new — nothing in the playbook states this today |

   Dateless on purpose: a roadmap with dates becomes the plan-as-contract the doc's own
   team section warns against (`docs/02-planning.md:181-182`).
5. **Reframe spikes** — "Timebox the unknowns" becomes explicitly about **feasibility
   risk**, tying to Cagan's four risks that stage 01 already cites, and states that the
   spike's written decision is what stage 03 consumes. That is the 02 → 03 handoff.
6. **Loosen the cadence string** in `web/src/lib/stages.ts:31` to match the doc's timing
   line rather than implying a waterfall.
7. `humanizer:humanizer` over the amended prose.

### Part B — the shared discovery sheet

New `web/src/lib/discovery-sheet.ts` owns three things currently private to
`Worksheet.tsx`: the `DiscoverySheet` type, the `playbook:discovery-worksheet` key, and a
read-only `readDiscoverySheet()` that tolerates absent, unparseable, or partial storage.
`Worksheet.tsx` imports the type and key rather than declaring them; its behaviour is
unchanged. Stage 02 imports the reader and **never writes** to stage 01's key.

This is the targeted improvement the round pays for: one home for the shape, so the
carry-forward cannot drift by construction rather than by test.

### Part C — the stage

`web/src/features/planning/`, registered in `stage-content.ts`, `ready: true`.

| # | Step | Doc sections | Interaction |
|---|---|---|---|
| 1 | Done | Define done before defining work | Guess-then-reveal: three candidate "done" statements, one checkable |
| 2 | Cut | Cut to the core | Guess-then-reveal over the 8-feature table, scored `n/8` |
| 3 | Sequence | Sequence in vertical slices | `Contrast` (layer-first vs vertical) + click-to-order sequencer |
| 4 | Size | Estimate for sequencing · Timebox the unknowns | S/M/L scorer + copyable spike card |
| 5 | Write | Write the plan | Persisted worksheet with stage-01 carry-forward |
| 6 | Horizon | Set the horizon · Replan · Scaling to a team | Now/next/later triage; team block collapsed; `trap` callouts close |

Six is the `Stepper` cap (`web/PATTERNS.md:42`), so this stage sits at it. If a seventh
step ever seems necessary, that is a signal the grouping is wrong, not the cap.

Figures, numbered 1–9 across the stage, matching stage 01's density: the disambiguation
band (industry's seven steps, this stage's slice highlighted); the cut funnel; layer-first
vs vertical; anatomy of one slice; risk-first ordering (revealed after the sequencer
locks); the decomposition ladder; the spike loop; the annotated one-page plan; the
now/next/later horizon. **Build Fig 1 first** — it carries the new argument; if figures get
cut they get cut from the end.

**Two carry-forwards, one chain.** A `CarryForward` block above the step-5 worksheet
renders stage 01's `success` and `notThis` when present, each with a button seeding "Done
means" and "Not in v1"; empty or unparseable storage degrades to a quiet line pointing at
stage 01. Then step 6 reads the worksheet's own "Not in v1" entries and asks the reader to
place each into **Next** or **Later** — which turns the doc's claim that *"the 'Not in v1'
list is the part that does actual work over the following weeks"*
(`docs/02-planning.md:142`) into something the reader performs rather than reads. Seeding
is always explicit and per-field, never an automatic overwrite of typed text.

**Judgment logic is not in the components.** Every existing vitest file lives in
`web/src/lib/`; there is no `@testing-library/react` in the project. Rather than add a
component harness mid-round, the cut-table verdicts, the sequencer's two rules (end-to-end
first, riskiest early) and the horizon triage go in
`web/src/features/planning/scoring.ts` as pure functions. That file is what gets the
failing test first; components stay presentational.

**Terms** added to `web/src/lib/terms.ts` as `{ short, full, soWhat? }`
(`web/src/lib/terms.ts:9-14`): `mvp`, `product-roadmap`, `product-vision`, `appetite`,
`vertical-slice`, `spike`, `feasibility-risk`. Each wrapped at first appearance.

**References** — four, each adding something distinct, all browser-verified:

| Source | What it adds |
|---|---|
| Atlassian, *The complete guide to product planning* | The seven-step industry version — what these words mean outside this playbook |
| NN/g, *Mapping User Stories in Agile* (Patton) | How slicing becomes a release plan, and the "smallest successful release" |
| Basecamp, *Shape Up* ch. 8 — The Betting Table | Appetite instead of estimate, and why Basecamp calls it betting rather than planning |
| SVPG, *Dual-Track Agile* (Cagan) | Why no planning phase exists between discovery and delivery — the tracks run in parallel |

## Testing

RED before GREEN, with raw output for both runs and a stated reason the RED failed.

- `web/src/lib/discovery-sheet.test.ts` — reads a stored sheet; returns empty for missing,
  malformed, and partial JSON; a read never writes to localStorage.
- `web/src/features/planning/scoring.test.ts` — cut-table verdicts per feature; both
  sequencing rules, including the case that matters most: a reader who puts the risky
  slice first for the *wrong* reason (not end-to-end) scores one rule, not both; horizon
  triage, including that an item can be defensible in either Next or Later and the verdict
  says so rather than marking it wrong.
- `web/src/lib/stages.test.ts` — **correction to an earlier draft of this spec:** the
  "every ready stage is registered in `STAGE_CONTENT`" invariant already exists at
  `web/src/lib/stages.test.ts:49-56`, along with its converse at `:58-62`. Nothing to add.
  Flipping `ready: true` without registering stage 02 will fail an existing test, which is
  the coverage this spec wanted. The `getStage` title assertion at `:42` pins stage 01
  only, so the stage 02 rename does not break it.
- `web/src/lib/terms.test.ts`, `references.test.ts` — existing invariants cover the new
  entries; the references cap (3–5) is already enforced.

Teeth check on each: break the implementation, confirm only the new test fails, restore.

## Verification

Against a production build, per `CLAUDE.md`:

- Contrast — every distinct text/background pair, both themes, all six steps, WCAG AA
- Responsive — 320→2560px, no horizontal overflow, no sub-44px target below `lg`
- Console — zero errors in a clean browser context
- All four reference URLs opened in a real browser

`web/e2e/audit.spec.ts:9-17` has a **hand-maintained** `PAGES` list; six stage-02 hashes
are added. That list silently drifting from the ready stages is real debt — logged, not
fixed here.

## Documentation updates

- `docs/02-planning.md` — Part A above
- `README.md:60` — retitled list entry
- `docs/task.md` — W-3 per-stage checklist ticked for 02; the "open product decision"
  note resolved
- `docs/tracker.md` — the slice with evidence and its `Deferred:` list; decision entries
  recording the product-planning reframe, the rejected re-scope, and the rejection of a
  separate Roadmap stage at both candidate placements; debt entries for the stage 01
  team-section asymmetry and the hand-maintained `PAGES` list
- `web/PATTERNS.md` — only if the build produces a genuinely new pattern; the
  click-to-order sequencer is a variant of guess-then-reveal and may warrant a row

## Risks

- **The reframe outgrows the round.** Naming product planning invites rewriting the doc
  wholesale. Mitigation: the amendment is additive — framing, vocabulary, one reframed
  section. The practices themselves do not change.
- **The carry-forward reads a sheet the reader never filled.** Most readers will arrive at
  stage 02 with empty storage. The empty state is a designed state, not a fallback.
- **Seeding overwrites typed text.** Mitigation: seeding is explicit, per-field, and
  disabled once that field is non-empty.
- **Nine figures and six steps is a big round.** Stage 01 shipped nine figures across six
  steps, so the precedent holds exactly — but this stage adds a doc amendment on top. The
  cut order is figures from the end, never the exercises, since a prose-only step is the
  anti-pattern `web/PATTERNS.md:31-32` names.
- **The horizon section invites scope creep into stage 18.** "Later" is product direction;
  "what we do next based on evidence" belongs to Continuous Improvement. Mitigation: stage
  02 states the horizon once and hands Next to 18 explicitly rather than teaching
  prioritisation twice.
- **Extracting `discovery-sheet.ts` touches finished stage 01 code.** Mitigation: type and
  key move, behaviour does not; stage 01's existing tests plus the audit suite cover it.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All app commands run from `web/`:

```bash
pnpm dev      # dev server on :3000 (Turbopack)
pnpm build    # production build; prerenders all 22 routes
pnpm lint     # eslint
pnpm exec tsc --noEmit   # typecheck (no dedicated script yet)
```

There is **no test suite yet** — `pnpm test` does not exist. See `docs/tracker.md`
TD-4/TD-5 before assuming otherwise or claiming tests pass.

## Two deliverables, one body of content

**`docs/NN-*.md`** — eighteen markdown stage documents. The canonical prose. Readable
in a plain editor and on GitHub.

**`web/`** — a Next.js 16 static site that turns those documents into something you
consult rather than read. No backend, no database, no env vars.

The web app does **not** read the markdown. Content is hand-ported into React
components. This duplication is known and tracked (`docs/tracker.md` TD-2, TD-3) —
do not "fix" it casually, but do not widen it without noting it either.

## The claim the structure rests on

**Stage numbers are filing codes, not a sequence.** CI/CD (11) is wired during Project
Setup (04). Documentation (10) and Observability (15) never stop. Stages 13–18 loop.

This is why every stage carries a `cadence` field in `src/lib/stages.ts`, surfaced in
the `TitleBlock` component. Any change that re-implies a linear waterfall — renumbering,
"next/previous" framing that suggests progression, a progress bar over all 18 — works
against the point of the playbook.

## Making a stage interactive

Stage 01 is the reference implementation. Adding another is a three-file trace:

1. `src/lib/stages.ts` — flip `ready: true`
2. `src/features/<stage>/` — build the content component; group sections into 4–6
   `Step` objects and render through `<Stepper>`
3. `src/features/stage-content.ts` — register the component against the slug

A slug absent from `STAGE_CONTENT` renders a "sheet not drawn" placeholder, so
routing works for all 18 regardless.

`Stepper` keeps the active step in the URL hash (deep-linkable, back button works) and
renders one panel at a time. `Figure` numbers run across the whole stage, not per step,
and are passed explicitly.

## Design system

Tokens live in `src/app/globals.css`. Light mode is a whiteprint (dark linework on
drafting paper); dark is a cyanotype (pale linework on Prussian blue). Dark is a
second drawing, not an inverted filter — design both.

**Accent and semantic colour are deliberately separate.** `brand` (annotation orange)
means *attention* — active states, eyebrows, "you are here". `go` / `danger` / `warn`
carry meaning. Using `brand` for "this is good" is a bug; it was one, and was fixed.

Type roles are utility classes, not Tailwind font sizes: `t-display` (Archivo pushed
wide, uppercase, sparingly), `t-head`, `t-ui`, `t-label` (mono, tracked caps),
`t-data` (mono, tabular). Body is Newsreader at 17px — a serif, on purpose.

`main :is(p, li)` caps at 68ch by default. The container is wide (1400px) so diagrams
get room; prose stays readable without per-component effort. Opt out with
`.measure-full`.

## Framework gotchas

`web/AGENTS.md` instructs reading `node_modules/next/dist/docs/` before writing code.
Follow it — this Next.js version has breaking changes from training data. Notably
`params` and `searchParams` are Promises; use the generated `PageProps<'/route'>` helper.

**React 19 forbids setState in an effect body** (`react-hooks/set-state-in-effect`, an
error not a warning). `src/lib/useLocalStorage.ts` uses `useSyncExternalStore` for this
reason. Reaching for `useEffect` + `setState` to read localStorage will fail lint and
cause a cascading render.

## Verification expectations

This repo's standard is checking against a live build rather than asserting. Changes
touching UI are expected to clear:

- **Contrast** — every distinct text/background pair, both themes, all steps, WCAG AA
- **Responsive** — 320→2560px, no horizontal overflow, no sub-44px touch target below `lg`
- **Console** — zero errors in a clean browser context

These scripts are currently written ad hoc and thrown away (TD-5). Two cautions learned
the hard way: a checker reporting mass failures is usually the checker (a link audit
once reported 124 false breaks), and colour parsers must handle `oklab()` — Tailwind
emits it for alpha backgrounds.

## Git conventions

Ported from `SmartJobSearchCRM`, where they are established across ~500 commits.

**Conventional Commits**, `type(scope): subject`. Types in use: `feat`, `fix`, `docs`,
`refactor`, `test`, `chore`, `build`. Subject is lowercase after the colon and describes
the change, not the diff.

Scopes are the area touched. In this repo that means `web`, `docs`, `design`, `a11y`,
`stepper`, a stage slug (`discovery`), or the artifact being edited (`tracker`, `task`,
`spec`, `plan`).

```
feat(discovery): add opportunity solution tree with per-level legend
fix(a11y): raise --faint to 4.8:1 on the darkest light surface
docs(tracker): record TD-1 stack drift between playbook and app
refactor(stepper): hoist FlowNode out of render to stop state resets
```

A body is used when there is a *why* worth keeping — a constraint, a rejected
alternative, a load-bearing ordering. Skip it when the subject already says everything.

Every commit carries the trailer:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

**Branches** are `feat/<kebab-topic>` or `fix/<kebab-topic>`, no ticket numbers.
`docs/<date>-<topic>` branches carry a date in the slug; `feat`/`fix` do not.

**Merges use `--no-ff`** — never squash, never rebase. The merge subject is hand-written
and carries meaning, because history should show what shipped as one unit:

```
Merge feat/observability-p1: backend observability P1 (Sentry + /api/health/deep)
Merge: RAG-grounded résumé tailoring suggestions (RAG part 2)
```

Merge commits get bodies too — a bullet summary of the branch plus a pointer to its
plan. Branches are deleted after merge.

**Specs, plans and tracker updates are committed separately** with `docs(...)` scopes,
before or alongside the implementation they describe — so a spec exists in history at
the point the decision was made.

Temporary commits meant to be reverted are labelled as such:
`chore(TEMP): add /api/debug/boom to verify Sentry prod capture (revert after)`.

## Delivery loop

The established loop, adapted from the source project:

```
brainstorm  →  spec  →  plan  →  TDD tasks  →  per-task review  →  final whole-branch review  →  merge  →  verify
```

- **Spec** → `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md` (superpowers:brainstorming)
- **Plan** → `docs/superpowers/plans/YYYY-MM-DD-<slug>.md` with checkbox steps (superpowers:writing-plans)
- **Execute** → superpowers:subagent-driven-development, or inline for small slices
- **Review** → a final whole-branch pass before merge, not only per-task

Scale it to the work. A single-component fix does not need a spec; a milestone
(`W-3`, `W-4`) does.

**Spec sections, in order:** Problem · Goals · Non-goals · Constraints · Architecture ·
Testing · Verification · Documentation updates · Risks. Non-goals state *why* each was
dropped. Specs cite real code by `file:line` and record rejected options inline.

**Plans** open with a fixed preamble, then `## Global Constraints`, then
`### Task N` blocks (Files / Interfaces / checkbox steps), then
`## Verification (after all tasks)`. Tasks carry the full test and implementation source
inline, so an implementer works from the task slice alone rather than the whole plan.

### Review

Two tiers: a read-only review per task, then a **final whole-branch review** before
merge. The final one is load-bearing, not ceremony — in the source project it caught an
SVG-spoof XSS, a `Set-Cookie` refresh-token leak, an infinite autosave loop, and a
drag-math defect.

Findings carry a severity and an ID: **Critical**, **Important** (`I1`, `I2`, written
`(blocking)`), **Minor** (`M1`…). They also carry *provenance*, which matters because it
changes who fixes what:

```
I2 (blocking) - no test rendered <WebVitals/>
M3 (PRE-EXISTING, not introduced here; defer to final review)
Fix (Important, PLAN-AUTHORED ERROR not implementer error)
DEFERRED (user's call, not blocking): M5 - ...
```

Verdicts are `review clean` / `review clean after 1 fix` per task, and
`Ready to merge` / `Ready with fixes` for the branch. A review closes with the branch
state: `12 commits off main, 296/296 across 53 files, build clean, tree clean. NOT merged, NOT deployed.`

**A reviewer is expected to disprove as well as confirm**, including its own earlier
claims — real entries read `DISPROVED my suspected SPA bug: ...` and
`CORRECTED A FACTUAL ERROR IN MY OWN SPEC: ...`. Agreeing with a wrong finding is worse
than missing one.

### TDD evidence

A task report pastes **raw terminal output for both the RED and GREEN runs**, and states
explicitly that the failure was *for the right reason* — "failed for the expected reason
(`trackEvent` never called — 'Number of calls: 0')". A green test alone proves nothing.

When a fix lands, verification includes a **teeth check**: deliberately break the
implementation again and confirm the new test — and only that test — fails. This is what
separates a real regression test from a vacuous one.

Test names encode the rationale, not the mechanic:
`test('still fires ai_analysis_run when the run fails, since failure volume is a useful signal')`.

## Project artifacts

| File | Holds |
|---|---|
| `CLAUDE.md` | How this project works. You are reading it. |
| `KICKOFF.md` | Paste-buffer for cold-starting a new session with full context. Refresh its *Project state* before use — a stale kickoff is worse than none, because it is trusted. |
| `docs/task.md` | Scope, milestones (`P-` content, `W-` web app), dependency map |
| `docs/tracker.md` | What shipped with evidence, numbered decisions, technical debt, bug ledger |
| `web/DESIGN.md` | The design system. Any new UI matches it. |
| `docs/superpowers/specs/`, `plans/` | Delivery-loop artifacts |
| `docs/learnings/` | Guides written for future-you when a round teaches something expensive |
| `reference/stack.md` | The default stack. Versions live here and nowhere else. |

## Recording work

`docs/task.md` — scope, milestones, dependency map.
`docs/tracker.md` — what shipped with evidence, numbered decisions with reasoning,
technical debt ranked by cost, bug ledger.

Two conventions worth keeping precisely:

**Evidence, not adjectives.** A completed entry cites what proves it — commit SHA,
test count, what a review caught. "Reviewed + merged" alone is not evidence.

**Every slice records what it deliberately did *not* do.** A `Deferred:` list on each
entry. This is the same discipline as the "What this is NOT" box in stage 01, and it is
what stops scope creep being invisible.

Decisions are appended and superseded, never edited — the record of what was believed
at the time is the value. Follow-ups are struck through with a date when closed
(`~~rotate the key~~ ✓ done 2026-07-02`) rather than deleted.

## Tooling

MCP servers configured at user level, and what each is actually for here:

| Server | Use |
|---|---|
| **context7** | Library docs before writing framework code. Prefer over training memory — this Next.js version postdates it. |
| **playwright** | Driving the running app for the verification passes above. |
| **claude-mem** | "Did I already decide this?" across sessions. |

Skills worth reaching for: `superpowers:brainstorming` before creative work,
`superpowers:writing-plans` for multi-step milestones,
`superpowers:systematic-debugging` before proposing a fix,
`frontend-design` for visual direction (the only project-enabled plugin),
`ui-ux-pro-max` for design-system and accessibility rule lookups.

## Known contradiction

`reference/stack.md` and `docs/04-project-setup.md` prescribe **Biome** and **Lefthook**.
`web/` uses ESLint and has no git hooks (TD-1). Do not install Biome to "match the docs"
without deciding which side wins — that decision is task P-5.

# AGENTS.md

Shared project instructions for Codex and Claude Code. This file is canonical;
`CLAUDE.md` imports it. Choose the workflow by risk, not by milestone label.

## Commands

All app commands run from `web/`:

```bash
pnpm dev          # dev server on :3200 (Turbopack) — 3000 is left free for other projects
pnpm build        # production build; prerenders every page, plus /robots.txt and /sitemap.xml
pnpm lint         # eslint --max-warnings 0
pnpm format       # prettier --write (format:check is what CI runs)
pnpm test         # vitest — two projects: `unit` (node, data invariants), `dom` (jsdom, render tests)
pnpm test:e2e     # playwright audit suite against a production build on :3100
pnpm test:prod    # playwright @smoke checks against the DEPLOYED site (docs/14)
pnpm test:dev-console # React's dev-mode warnings, against `next dev` on :3101 (TD-35)
pnpm typecheck    # next typegen && tsc --noEmit
```

Lefthook runs format+lint on commit and typecheck+test on push. CI
(`.github/workflows/ci.yml`) is the same gate cheapest-first, plus the audit suite.

`pnpm test:prod` is **not** part of that gate. It checks the deployed site, so a green run
says nothing about the working tree and a red one may have nothing to do with local changes.
Run it after a promotion to `main`.

`pnpm test:dev-console` is not part of it either, and for the opposite reason: it needs a
dev server, which the gate deliberately avoids. Run it once for a new interactive
stage or changed interaction/shared React behavior. It sees React's development
validation — missing keys, invalid DOM
nesting, `act()` warnings, hydration detail — because a production build has stripped all of
it (TD-35). It found a real bug on its first run.

## Two deliverables, one body of content

**`docs/NN-*.md`** — eighteen markdown stage documents. The canonical prose. Readable
in a plain editor and on GitHub.

**`web/`** — a Next.js 16 static site that turns those documents into something you
consult rather than read. No backend, no database, no env vars.

The web app does **not** read the markdown. The interactive stage _content_ is
hand-ported into React components — known duplication, do not "fix" it casually, but do
not widen it without noting it either.

Two pieces that used to be hand-ported are now single-sourced (D-36): the **glossary**
lives in `web/src/lib/terms.ts` and `reference/glossary.md` is generated from it (run
`pnpm gen:glossary`; never hand-edit the markdown), and stage **titles** are guarded by a
sync test against `stages.ts`. A term or a stage title now lives in exactly one place.

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

**Before building a stage, read `web/PATTERNS.md`.** It catalogs the interaction
patterns (expand-to-reveal, inline terms, guess-then-reveal, click-node inspector, and
so on) and says which fits which content. The default is not a paragraph — it is
something the reader clicks. A stage that is only prose blocks is the anti-pattern.

## Design system

Tokens live in `src/app/globals.css`. Light mode is a whiteprint (dark linework on
drafting paper); dark is a cyanotype (pale linework on Prussian blue). Dark is a
second drawing, not an inverted filter — design both.

**Accent and semantic colour are deliberately separate.** `brand` (annotation orange)
means _attention_ — active states, eyebrows, "you are here". `go` / `danger` / `warn`
carry meaning. Using `brand` for "this is good" is a bug; it was one, and was fixed.

Type roles are utility classes, not Tailwind font sizes: `t-display` (Archivo pushed
wide, uppercase, sparingly), `t-head`, `t-ui`, `t-label` (mono, tracked caps),
`t-data` (mono, tabular). Body is Newsreader at 17px — a serif, on purpose.

`main :is(p, li)` caps at 68ch by default. The container is wide (1400px) so diagrams
get room; prose stays readable without per-component effort. Opt out with
`.measure-full`.

## Framework gotchas

Before using or changing Next.js APIs, read the relevant installed guide in
`node_modules/next/dist/docs/`; see `web/AGENTS.md`. Routine content/style edits
using established patterns do not need another API-doc read. Notably
`params` and `searchParams` are Promises; use the generated `PageProps<'/route'>` helper.

**Route types are generated, not written.** `PageProps<'/route'>` and friends live in
`.next/types/`, produced by `next build` or `next typegen`. A bare `tsc --noEmit` passes
locally only because a previous build left `.next` behind, and fails on a clean checkout
— which is exactly how CI caught it. Always typecheck via `pnpm typecheck`, which runs
typegen first.

**React 19 forbids setState in an effect body** (`react-hooks/set-state-in-effect`, an
error not a warning). `src/lib/useLocalStorage.ts` uses `useSyncExternalStore` for this
reason. Reaching for `useEffect` + `setState` to read localStorage will fail lint and
cause a cascading render.

## Verification expectations

Run focused checks while editing. Research/prose-only changes need relevant
content/link checks, not the app suite or a build. For web-affecting work, run the
existing final gate once on the completed branch: format, lint, generated-route
typecheck, tests, production build and production audit. CI runs on pull requests
and pushes to main, **not local develop merges**. Use a successful PR gate for the
exact final tree, or run the gate locally before a web merge.

Check affected panels and material interaction states in both themes, with
keyboard access, readable layout, contrast, touch targets and a clean console.
Use representative narrow, middle and wide widths for focused manual checks.
The automated audit keeps its broader WCAG AA, 320–2560px, overflow and 44px
non-inline touch-target coverage. Shared changes may require a wider manual sweep.

Run the development-console sweep once for a new interactive stage or changed
interaction/shared React behavior. Production strips React development
validation, so the production audit cannot establish missing-key or development
warning cleanliness. `pnpm test:prod` checks deployment only, after promotion.

Rerun what later edits invalidate. A records-only commit or merge with an
unchanged application diff may reuse identified application checks. State which
checks are fresh and which are retained, with the tested commit/tree. Do not
repeat full suites/builds/browser matrices after every task or records update.
Diagnose failures before fixing them; do not weaken assertions or timeouts just
to obtain green output. Mass checker failures can be checker defects; color
parsers must handle Tailwind's `oklab()` output.

A component deriving visible output or accessible names from data needs a
meaningful `*.test.tsx` render test (see `web/PATTERNS.md`). Data invariants alone
cannot prove that the component uses the data.

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

A body is used when there is a _why_ worth keeping — a constraint, a rejected
alternative, a load-bearing ordering. Skip it when the subject already says everything.

**Branches** are `feat/<kebab-topic>` or `fix/<kebab-topic>`, no ticket numbers.
`docs/<date>-<topic>` branches carry a date in the slug; `feat`/`fix` do not.

### `main` is production — the branch you may not merge to

Since 2026-08-11 the site is live from `main` (https://acp-dev-playbook.vercel.app), so a
push to `main` is a deploy. The flow that follows from that:

```
feat/… · fix/… · chore/… · docs/…   ──merge──>   develop   ──user only──>   main
```

- **Work branches merge to `develop`.** Never to `main`, whatever the change is and however
  safe it looks. A records-only edit deploys exactly as hard as a feature.
- **`main` is the user's.** You may **open a pull request** to `main`; you may not merge it,
  and you may not push to it. The user handles that promotion.
- **Ask before every merge, including into `develop`.** Having a plan approved is not
  approval to merge the branch that came out of it — integration is a separate decision, and
  it is the user's each time.

Everything below applies to a merge into `develop` exactly as it did to `main`.

**Merges use `--no-ff`** — never squash, never rebase. The merge subject is hand-written
and carries meaning, because history should show what shipped as one unit:

```
Merge feat/observability-p1: backend observability P1 (Sentry + /api/health/deep)
Merge: RAG-grounded résumé tailoring suggestions (RAG part 2)
```

Merge commits get a short body describing the scope and linking a plan when one
exists. Branches are deleted after merge.

When a design or plan is needed, commit it with a `docs(...)` scope before the
implementation it governs. Related tracker/handoff updates can accompany a slice;
a separate records commit per task is not required.

Temporary commits meant to be reverted are labelled as such:
`chore(TEMP): add /api/debug/boom to verify Sentry prod capture (revert after)`.

## Development workflow

Approved 2026-10-26 (D-99). These scoped rules replace the earlier blanket
spec/plan, TDD, per-task review and evidence requirements. They are standing
project instructions; the exceptions below do not need approval each time.

| Work | Default path |
| --- | --- |
| Research or documentation | Short scope checklist → sources → edit → content/link checks |
| Page using existing patterns | Short acceptance checklist → implement inline → focused checks → final review |
| Shared behavior or consequential change | Design where needed → compact plan → TDD for behavior → independent review |

Escalate when a routine page gains new behavior or affects other pages. Shared
hooks/components, routing and hash/history, persistence, clipboard races,
generators, build/CI changes and security-sensitive examples need the third path.

### Research and documentation

Use primary sources for factual claims. Record URL, author/organization, relevant
version or access date, and the finding supported. For images record the original
source, license and intended use. Label uncertain attribution, unknown project
facts and illustrative examples. Keep the chapter and web content consistent.

Work inline from a short checklist. No separate spec, implementation plan, task
agents, per-task reviews or app build is required for research/prose alone. Check
changed links/anchors, applicable existing content guards and finished prose.
Executable operational examples and security-sensitive guidance still need
appropriate source/behavior validation, even when they live in Markdown.

### Planning and reviews

For an ordinary page, name the reader task, source material, sections/interactions
and acceptance checks. Use a compact design if choices remain unresolved. For
consequential work, write the design before implementation; multiple dependent
steps get a compact plan. Multi-session work needs a recovery checklist. Existing
`docs/superpowers/specs/` and `plans/` paths remain available when warranted.
Plans name files, interfaces, acceptance criteria and tests; they do not duplicate
full implementation/test source. Ask only about choices that change the outcome.

Small edits get self-review. A complete new page or substantial teaching revision
gets one independent final review covering content and the delivered page.
Consequential changes get independent review of the actual branch diff. Add a
per-task review only for a distinct risk that cannot usefully wait. Two blinded
readers, frozen-score studies and separate design/plan reviews are optional
investigations. Findings state severity, evidence and provenance; challenge
unsupported findings and resolve blockers before delivery.

### Tests and regression protection

Use TDD for new behavior and reproduced bugs: observe a meaningful failure,
implement the minimum, then confirm it passes. Keep relevant race, permission,
recovery, navigation and accessibility coverage. A generated output or config
change uses appropriate validation; behavioral generator changes use TDD.

Prose, static content/data, images, examples and styling do not require new
failing tests before editing. Existing guards still apply. Add meaningful render
coverage for new conditional/data-driven output; avoid tests that merely restate
literal copy, CSS classes or element counts. The render-test rule in
`web/PATTERNS.md` remains in force. Use mutation/teeth checks when test sensitivity
is uncertain or a consequential regression warrants them, rather than for every
fix. Record the real failure reason and final result; full raw output need not be
pasted into every task report.

### Skills, agents and context

Use applicable skills for the selected work, without expanding a small change
into every delivery phase. Read a skill once per conversation unless it changes.
Routine work stays inline with one implementer. Delegate only an independent,
bounded task when separate context improves accuracy or elapsed time. File
searches do not need subagents. Apply the model/session policy below; pass its
explicit model and effort when the tool supports them.

Read relevant code, framework guides and prior decisions on demand. Pass file
pointers and a bounded diff to reviewers rather than repeating whole plans or
session histories. When execution options are useful, recommend the approach
that fits this task instead of asking for a choice at every phase.

### Models and session handoffs

Approved 2026-10-29 (D-100), for the current cost budget:

| Role | Model | Reasoning effort |
| --- | --- | --- |
| Research, brainstorming, planning, coordination and review | `gpt-6-astra` | `low` |
| Implementation, test writing, running checks and diagnosing failures | `gpt-6.1-sol` | `high` |

Every next-task recommendation must name the task, recommended model **and**
effort before work starts. Each implementation task starts in a fresh session,
with the user selecting the recommended setting. Keep the main research/planning
session open to coordinate and review those implementation sessions. Use these
settings until the user changes them; propose an escalation with its reason
rather than silently increasing effort or changing models. State recommendations
as recommendations; only claim an active setting when the environment confirms it.

Put a compact handoff in the existing task/KICKOFF records: reader outcome,
scope, starting branch/commit, source/design pointers, acceptance checks,
recommended model/effort and the coordinator session to return results to. The
implementer reports its branch/commit, actual checks, unresolved issues and
session reference. Before relying on a referenced session, read its thread;
the coordinator reviews the actual diff and evidence. Identify the reviewed
commit and keep later changes visible. This session split does not add plans,
agents or review rounds beyond D-99's risk-based requirements. Integration still
requires the user's separate approval.

## Project artifacts

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Shared project policy; `CLAUDE.md` points here |
| `KICKOFF.md` | Short current-state handoff with pointers; refresh at handoff |
| `docs/task.md` | Scope, milestones and dependencies |
| `docs/task-archive.md` | Older completed task detail; search by ID |
| `docs/tracker.md` | Completed work/evidence, decisions, open debt and bugs |
| `docs/tracker-archive.md` | Older completed work and closed debt |
| `web/DESIGN.md`, `web/PATTERNS.md` | Visual system and interaction/test patterns |
| `docs/superpowers/specs/`, `plans/` | Designs/plans when the work warrants them |
| `docs/learnings/` | Reusable lessons from expensive findings |
| `reference/stack.md` | Default stack and its versions |

## Recording work

Keep source findings in one research record and completion in one concise tracker
entry: commit, actual commands/results, important limits and deferred scope.
Update task milestones when status changes. Refresh a short KICKOFF at handoff;
link details instead of copying the same history into every file. Additional
reports are for substantial decisions/investigations, not every editing step.

Keep relevant failure output and reproduction details for bugs. Successful runs
need the command, exit status, relevant count and tested commit/tree. Preserve
research images/provenance. Workspace tarballs, per-file hash manifests and full
transcript/screenshot collections are optional for a concrete recovery/audit need.
Historical evidence remains intact.

Decisions are appended and superseded, never rewritten. Keep deferred scope
explicit. Archive closed debt/older completed rows when needed, verbatim with
stable IDs; decisions stay in the live tracker. Preserve D-96's ledger integrity:
`tracker-ledger.test.ts` guards duplicates and misplaced open debt. Search the
tracker/task/archive by ID or section; do not read the full ledgers each session.

Run `humanizer:humanizer` once over substantive new prose as an editing pass.
Apply useful corrections and keep the intended voice. No separate prose-review
report is required. Skip this pass for code, terminal output and tracker tables.

## Tooling

Use relevant design skills for visual work: **`frontend-design`** for direction and
**`ui-ux-pro-max`** for design/accessibility lookups. Match `web/DESIGN.md`.

MCP servers, configured at user level, and what each is actually for here:

| Server | Use |
| --- | --- |
| **context7** | Relevant library docs before framework/API changes |
| **playwright** | Running-app verification |
| **Codex-mem** | Prior decisions across sessions |

## Resolved contradiction (kept for history)

`reference/stack.md` and `docs/04-project-setup.md` used to prescribe **Biome** while
`web/` ran ESLint with no hooks (TD-1). Resolved 2026-07-23 in ESLint's favour — its
react-hooks rule family caught a real bug here — with Prettier added for formatting and
Lefthook for hooks. Biome stays documented in `reference/stack.md` as the alternative
for projects off the ESLint plugin ecosystem. Decision D-22.

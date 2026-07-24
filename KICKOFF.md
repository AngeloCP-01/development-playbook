# Kickoff — Development Playbook

Paste the block below into a **new Claude Code session** opened in
`/Users/angelito/personal/Development-Playbook` to start a round with full context.

Update the *Project state* section before pasting — a stale kickoff is worse than none,
because it is trusted.

---

## Paste this into the new session:

I'm continuing work on the Development Playbook: eighteen markdown stage documents
covering the software lifecycle, plus a Next.js static site that turns them into
something you consult rather than read. It doubles as a learning tool — it will cover
ground I have not worked in, so stages need to teach, not just remind.

Before doing anything, read these for context:

- `CLAUDE.md` — how this project works: git conventions, delivery loop, review and TDD
  standards, tooling. Start here.
- `docs/task.md` — scope, milestones (`P-` content, `W-` web app), dependency map
- `docs/tracker.md` — what shipped with evidence, numbered decisions, technical debt
- `web/DESIGN.md` — the design system; any new UI matches it
- `README.md` — the playbook's own index and its central claim
- `web/AGENTS.md` — this Next.js version postdates your training data; read
  `node_modules/next/dist/docs/` before writing framework code

### Project state (as of 2026-07-24)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`). 18/18 pass the
  seven-section template check; internal links resolve.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. Stage 01 complete
  and polished (`W-0`…`W-2`): 6-step stepper, 9 numbered figures, 5 interactive
  exercises, a localStorage worksheet, inline term popovers (some with mini-diagrams),
  and 5 curated outward references.
- **Stages 02–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier, eslint at
  `--max-warnings 0`, 13 vitest invariants, a 9-test playwright audit suite, lefthook
  hooks, and CI. CI's first runs went red on a real bug (generated route types missing
  on a clean checkout) and are green since the fix. Branch protection is on — which
  required making the repo public, since GitHub Free does not enforce rulesets on
  private repos (D-26).
- **Not deployed** (`W-5` open).
- **Branch:** work happens on `feat/<topic>`, merged to `main` with `--no-ff`, then
  pushed. `main` is the current tip and CI is green.

### This round's scope

**Recommended: `W-3` — build stage 02 (Planning) interactive.**

Stage 01 already promises it: its last step hints "One page, then hand off to planning",
and its `PipelineFit` figure draws Discovery → Brainstorm → Plan → Build. That handoff
currently lands on a placeholder. Stage 02 is also the safer second stage — 211 lines,
7 subsections — for proving `web/PATTERNS.md` transfers before betting the densest
stage on it.

Sections that map onto existing patterns: "Cut to the core" (a feature yes/no table →
guess-then-reveal), "Sequence in vertical slices" (an explicit wrong/right pair →
`Contrast` plus a diagram), "Estimate for sequencing" (S/M/L → a scorer), "Write the
plan" (a one-page artifact → a worksheet).

**One product decision to settle first:** should stage 02's worksheet read the answers
saved by stage 01's? It would make the two stages a real chain rather than two
independent pages. Nothing does this yet.

Other open candidates:
- **`P-6`** — fold the remaining working conventions into the stage docs (commit and
  branch conventions → 05/07, review severity and provenance → 07, tracker conventions
  and kickoff files → 02/10). Partially done; see `docs/task.md`.
- **`W-5`** — deploy.
- **Known debt worth deciding before more stages:** `TD-2` and `TD-3` — stage metadata
  and the glossary each live in two places, and every new stage multiplies the drift.

I lean toward **W-3 / stage 02** — but advise me, and say if you disagree.

### How we work

1. **Brainstorm** the slice (`superpowers:brainstorming`) → spec at
   `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md`
2. **Plan** it (`superpowers:writing-plans`) → `docs/superpowers/plans/YYYY-MM-DD-<slug>.md`
   with checkbox steps and complete code inline
3. **Execute** — `superpowers:subagent-driven-development`, or inline for small slices.
   TDD throughout; commit after every task.
4. **Review** — per task, then a **final whole-branch review** before merge. Findings
   carry severity, an ID, and provenance. Disprove as well as confirm.
5. **Merge** to `main` with `--no-ff` and a hand-written subject
   (`superpowers:finishing-a-development-branch`). Do not push unless I ask.
6. Use `frontend-design` or `ui-ux-pro-max` for any new UI, matching `web/DESIGN.md`.

Scale the ceremony to the work: a one-component fix does not need a spec; a milestone
does.

### Environment notes

- All app commands run from `web/`: `pnpm dev` (port 3000), `pnpm build`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test` (vitest), `pnpm test:e2e` (playwright audit
  suite). Lefthook hooks run format+lint on commit, typecheck+test on push.
- No env vars, no database, no backend. Static site.
- MCP in use: **context7** (library docs — prefer it over memory for framework code),
  **playwright** (driving the running app for verification), **claude-mem** ("did I
  already decide this?").
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

Verification is not optional and is run against a live build: contrast in both themes,
320–2560px with no overflow, touch targets, zero console errors.

Start by reading the docs above, then let's decide the round and scope it.

---

## Quick reference — for you, not the new session

Notes for whoever is preparing this handoff:

- Refresh **Project state** and **This round's scope** before pasting. Delete closed
  items rather than leaving them ticked.
- Fill in the `[FILL IN: ...]` lean, or delete the line if genuinely undecided.
- If a round is already scoped, add a per-round sibling — `KICKOFF-W4.md` — rather than
  overwriting this one. The generic version stays useful.
- Open threads worth carrying forward:
  - The full loop has run once: the quality-gates round (spec and plan dated
    2026-07-23) went brainstorm → spec → plan → TDD tasks → whole-branch review.
    Use those two files as the house example of the format.
  - The glossary lives in two places (`reference/glossary.md`, `web/src/lib/terms.ts`)
    and they already disagree. Decide before W-3 multiplies it.

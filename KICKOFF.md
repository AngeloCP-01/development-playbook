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

### Project state (as of 2026-07-21)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4` done). 18/18 pass the
  seven-section template check; 124/124 internal links resolve.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. Scaffold, design
  system and **stage 01 complete** (`W-0`…`W-2`). Stage 01 is the reference
  implementation: 6-step stepper, 9 numbered figures, 5 interactive exercises, a
  localStorage worksheet, 10 glossary terms.
- **Stages 02–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates are in place** (W-4): vitest invariants, the committed audit suite,
  lefthook hooks, and a CI workflow. Not deployed yet (W-5). Branch protection is a
  GitHub-side switch to flip after pushing.
- **Branch:** work happens on `feat/<topic>`, merged to `main` with `--no-ff`. Both
  rounds so far are merged and pushed; `main` is the current tip.
- **One open gate item:** CI has never been observed running (TD-10) — branch
  protection is off and no red run has been seen.

### This round's scope

Open candidates, in the order `docs/task.md` recommends:

- **W-3 — Stages 02–18 interactive.** Suggested first: **03 Architecture** (densest
  concepts, most diagram-friendly), then 15 Observability, 16 Incident Management.
- **P-6 — Fold the real working conventions into the stage docs.**

I lean toward **[FILL IN: W-3 / P-6 / W-5]** — but advise me, and say if you
disagree.

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
  `pnpm exec tsc --noEmit`, `pnpm test` (vitest), `pnpm test:e2e` (playwright audit
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

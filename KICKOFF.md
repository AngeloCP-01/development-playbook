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

### Project state (as of 2026-07-28)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`). 18/18 pass the
  seven-section template check; internal links resolve.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01 and 02
  are complete and interactive.** Stage 02 (Product Planning) ships a 7-step stepper
  (Done · Cut · Sequence · Size · AI plays · Write · Horizon), 9 figures, 5 judgment
  exercises, a plan worksheet that carries stage 01's answers forward, and 4 references.
  It was validated with cold-reader persona tests (D-37): developer-complete; PMs and
  solutions architects are deliberate scope boundaries, not gaps.
- **Every stage carries an "AI plays" section** now (D-35) — where agents help and where
  they mislead, tuned per stage, in both doc and app. Build it for each new stage.
- **Glossary + metadata are single-sourced** (D-36, TD-2/TD-3 closed): terms live in
  `web/src/lib/terms.ts`, `reference/glossary.md` is generated from it (`pnpm gen:glossary`),
  and a title sync test guards each doc's H1 against `stages.ts`. Never hand-edit
  `glossary.md`.
- **Stages 03–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, 78 vitest tests, a 9-test playwright audit suite (sweeps
  every ready stage's step hashes), lefthook hooks, and CI. Branch protection is on; the
  repo is public (D-26).
- **Not deployed** (`W-5` open).
- **Branch/push:** work happens on `feat/`|`fix/`|`docs/<date>-` branches, merged to `main`
  with `--no-ff` and a hand-written subject, never squashed. **The user handles pushes** —
  `main` is currently well ahead of `origin/main` and unpushed.

### This round's scope

**Recommended: `W-3` — build stage 03 (Architecture) interactive.**

Stage 02 hands off to it directly (a feasibility spike produces the written decision stage
03 consumes; the "auth choice affects the data model → decide in 03" risk points straight
here). It is the **solutions architect's home** — the audience stage 02 feeds but does not
serve — and the densest, most diagram-friendly stage, so it is where the pattern library
gets its real stress test. It is unblocked now that TD-2/TD-3 are closed.

Read `docs/03-architecture.md` first. Its sections map onto existing patterns: "Sort
decisions by reversibility" (a scale → single-select scorer, the `SeverityScorer` shape),
"Model the domain first" and "Boundaries inside the monolith" (structure → click-node
inspector, the `OpportunityTree` shape), "Write the ADRs" (an artifact → a worksheet), and
a `Contrast` for the reversible-vs-irreversible and monolith-first decisions.

Two things that are now standard and must be part of this stage:
- **An "AI plays" step** (D-35), tuned to architecture: where agents genuinely help
  (generating options, pressure-testing reversibility, drafting ADRs) and where they
  mislead (over-engineering, inventing scale you do not have). Mirror stage 02's
  `AIPlanningPlays` shape, in both the doc (`### AI in architecture`) and a 7th step.
- **Glossary terms are already migrated:** `adr`, `blast-radius`, and the deploy/ops terms
  live in `terms.ts` — wrap their first appearances with `<Term>`; do not redefine them.

Other open candidates (not recommended over 03): `W-5` deploy; the low remaining debt
(`TD-11` design-token names, `TD-13` team-section asymmetry, `TD-14` card widths).

I lean toward **W-3 / stage 03** — but advise me, and say if you disagree.

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
  - The delivery loop has run many times now; stage 02's spec/plan pair
    (`docs/superpowers/{specs,plans}/2026-07-24-stage-02-*`) is the fullest house example.
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) is how a stage doc is
    validated before it ships — run the beginner-completeness pass on every stage, and the
    audience-fit pass whenever "is it ready for X?" comes up.
  - The glossary/metadata duplication (old TD-2/TD-3) is **closed** (D-36): `terms.ts` is
    the single source, `pnpm gen:glossary` regenerates `reference/glossary.md`. No longer a
    thread — just do not hand-edit the generated markdown.

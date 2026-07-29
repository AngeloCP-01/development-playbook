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
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01, 02 and 03
  are complete and interactive.** Stage 03 (Architecture) ships a 6-step stepper
  (Reverse · Model · Constrain · Shape · Decide · AI plays), 9 figures, 4 judgment
  exercises, an annotated-DDL inspector, and a domain worksheet that carries stage 02's
  answers forward.
- **Stage 03's doc has open gaps.** A cold-reader pass found 14 beginner-completeness gaps
  in `docs/03-architecture.md`, 3 of them blocking (**TD-18**). The app is done; the doc is
  not. This is the recommended next round — see below.
- **Every stage carries an "AI plays" section** (D-35), in both doc and app.
  `stage-metadata.test.ts` now **fails any stage whose doc lacks the `### AI in <stage>`
  heading**, because stage 03's doc turned out not to have one and the round had to write it
  before it could mirror it. Do not assume a stage doc already has its AI section — check.
- **Glossary + metadata are single-sourced** (D-36, TD-2/TD-3 closed): terms live in
  `web/src/lib/terms.ts`, `reference/glossary.md` is generated from it (`pnpm gen:glossary`),
  and a title sync test guards each doc's H1 against `stages.ts`. Never hand-edit
  `glossary.md`.
- **Stages 04–18** render a "sheet not drawn" placeholder. Routing works for all 18.
- **Quality gates live and proven** (`W-4` done): prettier (skips markdown by design),
  eslint at `--max-warnings 0`, **133 vitest tests across 9 files**, a **10-test playwright
  audit suite over 20 URLs**, lefthook hooks, and CI. Branch protection is on; the repo is
  public (D-26).
- **The audit suite does *not* sweep ready stages automatically.** `PAGES` in
  `web/e2e/audit.spec.ts` is a hand-written list of step hashes (**TD-12**). Adding a stage
  means editing that array by hand; nothing fails if you forget, so a stage can ship
  unaudited with the suite still green. An earlier version of this kickoff claimed otherwise.
- **Not deployed** (`W-5` open).
- **Branch/push:** work happens on `feat/`|`fix/`|`docs/<date>-` branches, merged to `main`
  with `--no-ff` and a hand-written subject, never squashed. **The user handles pushes** —
  `main` is currently well ahead of `origin/main` and unpushed.

### This round's scope

**Recommended: close stage 03's doc gaps (`TD-18`) before building another stage.**

The reasoning, so you can disagree with it. Stage 03's app is finished and verified, but a
cold-reader pass found the doc underneath it incomplete for a beginner: 14 gaps, 3 blocking.

The blocking three are not cosmetic. The Definition of Done makes "authorization pattern
decided" an exit condition, but the doc offers only ownership, which fails for any product
where data is shared rather than owned. "Indexes" is a required artifact that appears exactly
once in the whole document — in the list requiring it. And races are named as *the* reason to
push constraints into the database, with no tool given that expresses a conditional
uniqueness rule, and transactions unmentioned anywhere. A reader following the stage honestly
cannot finish it.

It ranks above stage 04 for three reasons. The app mirrors the doc, so several fixes are
two-file changes and the coupling gets more expensive as stages accumulate. The cold-reader
method is cheap and it works — acting on the first stage where it produced blocking findings
sets it up as a gate rather than a formality. And stage 03 is the solutions architect's home
(D-37), the audience the playbook serves worst; shipping it with an unsatisfiable exit
condition undercuts stage 02's claim to legitimately defer architecture to it.

The counter-argument, which is real: the gaps pre-date the branch, the stage is genuinely
usable today, and building stage 04 would keep W-3 moving. It loses mainly on the coupling
point.

Start from `.superpowers/sdd/2026-07-28-stage-03-architecture/cold-reader-findings.md` —
every gap already carries the line that would close it. Expect matching app changes for
anything touching the DDL annotations, the interrogation set or the reversibility lists,
since those are ported into `src/features/architecture/scoring.ts`.

Other open candidates, with what each is worth:
- **`W-5` deploy** — stronger than it was. Three stages are finished, so "deploy matters less
  while the app has one finished stage" no longer holds, and it would turn the audit suite
  into a real post-deployment check.
- **`TD-17`** — no component-test harness. vitest is `environment: 'node'` and matches only
  `*.test.ts`, so nothing can render a component. Gets more valuable with every stage built.
- **`TD-16`** — worksheet placeholder text at 2.77:1 in light mode, across all three
  worksheets, invisible to the audit suite because it samples `textContent`.
- Low remaining debt: `TD-11` design-token names, `TD-14` card widths, `TD-9` (stage 02 has
  no Figure 5).

I lean toward **TD-18** — but advise me, and say if you disagree.

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
  - The delivery loop has run many times now; stage 03's spec/plan pair
    (`docs/superpowers/{specs,plans}/2026-07-28-stage-03-architecture*`) is the fullest house
    example — 17 tasks, subagent-driven, with the ledger at
    `.superpowers/sdd/2026-07-28-stage-03-architecture/progress.md`.
  - **Cold-reader testing** (`docs/learnings/cold-reader-testing.md`) is how a stage doc is
    validated before it ships. Run the beginner-completeness pass **before** building the
    interactive stage, not after — stage 03 ran it last and now has a finished app on top of
    a doc with three blocking gaps.
  - **Most of stage 03's defects were plan-authored, not implementer error** (tracker,
    "Process observations"). A per-task review sees one diff; nothing but controller-level
    review catches a task whose output undermines another's. Budget for that.
  - **Cite doc sections by heading, never by line number** (D-42). An audit of `web/src/`
    found 14 of 33 citations wrong — four staled by this round, ten inherited from the
    stage 02 round, the worst off by ~86 lines. Nothing in the gate can detect it, and a
    grep for the pattern cannot either: it only sees citations that repeat the filename, so
    bare `:NNN` continuations and citations to other docs stay invisible. Open the lines.
  - `docs/learnings/contrast-checkers-lie.md` — read it before changing a token in response
    to a contrast number. Three of the failures reported in this repo were the checker.

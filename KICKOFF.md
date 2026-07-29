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

### Project state (as of 2026-07-29)

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`). 18/18 pass the
  seven-section template check; internal links resolve.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01, 02 and 03
  are complete and interactive.** Stage 03 (Architecture) ships a 6-step stepper
  (Reverse · Model · Constrain · Shape · Decide · AI plays), 9 figures, 4 judgment
  exercises, an annotated-DDL inspector, and a domain worksheet that carries stage 02's
  answers forward.
- **Stage 03's doc has open gaps, of two kinds.** A cold-reader pass found 14
  beginner-completeness gaps in `docs/03-architecture.md`, 3 of them blocking (**TD-18**) —
  things a reader cannot finish the stage without. Separately, the stage never names the
  architecture styles landscape (**TD-21**): it teaches the modular monolith without using
  the term, and never asks what the system needs to *be* before deciding how it is shaped.
  The app is done; the doc is not. Both are the next round — see below.
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

**Decided: one round on stage 03's doc — `TD-18` and `TD-21` together — before building
another stage.** This is settled, not a recommendation to weigh; the reasoning is here so you
can execute it, and disagree only if you find something new.

Stage 03's app is finished and verified. The doc underneath it has two separate problems.

**`TD-21` — the styles landscape is missing** (decision **D-44**). The stage prescribes a
single Next.js application, gives four triggers for splitting a service out, and teaches
feature modules talking through exported functions. That advice is correct and matches
current industry consensus — but it is delivered as a prescription the reader takes on faith.
The stage never asks what the system needs to *be* before deciding how it is shaped, and it
teaches the **modular monolith** without ever using the term. Microservices, event-driven,
hexagonal, serverless, SOA and the DDD vocabulary (bounded context, ubiquitous language) go
unnamed, so a reader finishes the stage unable to place their own decisions among the words
they will meet everywhere else.

**The round adds microservices content deliberately, and does not change the recommendation.**
Monolith-first, modular boundaries and defer-aggressively all stand. The playbook's job is to
teach ground the reader has not worked in, and someone who has never seen microservices
cannot evaluate why monolith-first is right *for them* — they can only take it on faith,
which is the same failure as G3 below. Knowing what you are not doing, and why, is what makes
it a decision. Do not read the microservices material as drift from the solo-first stance;
D-44 exists so you don't.

**`TD-18` — a cold-reader pass found the doc incomplete for a beginner:** 14 gaps, 3 blocking.

The blocking three are not cosmetic. The Definition of Done makes "authorization pattern
decided" an exit condition, but the doc offers only ownership, which fails for any product
where data is shared rather than owned. "Indexes" is a required artifact that appears exactly
once in the whole document — in the list requiring it. And races are named as *the* reason to
push constraints into the database, with no tool given that expresses a conditional
uniqueness rule, and transactions unmentioned anywhere. A reader following the stage honestly
cannot finish it.

**Why the two are one round.** Both live in `docs/03-architecture.md`, and both force matching
changes in `src/features/architecture/` because the DDL annotations, the interrogation set and
the reversibility lists are all ported into `scoring.ts`. They also meet in one place:
`TD-21`'s new architecture-characteristics step is where `TD-18`'s **G14** belongs — the
reversibility test is currently stranded in the AI section, framed as a prompt for a model
rather than as the rule the whole stage turns on. Splitting the work would mean opening the
same doc and the same components twice.

It ranks above stage 04 because the doc/app coupling gets more expensive as stages
accumulate, because the cold-reader method is cheap and worked on its first real outing, and
because stage 03 is the solutions architect's home (D-37) — the audience the playbook serves
worst. Shipping it with an unsatisfiable exit condition undercuts stage 02's claim to
legitimately defer architecture to it.

**Suggested shape**, to argue with rather than follow: a new step before the structural
advice (*what does this system need to be?* — three or four characteristics, not twenty), then
a styles comparison where each option states what would have to be true to pick it, and the
stage's own answer arrives as a conclusion rather than an opening. `TD-18`'s blocking three
fold into the sections they belong to.

Start from `.superpowers/sdd/2026-07-28-stage-03-architecture/cold-reader-findings.md` —
every gap already carries the line that would close it. `docs/task.md`'s **W-3.1** has the
full checklist. Note that `.superpowers/` is git-ignored scratch, so if the file is gone the
same findings are reproduced inline in `TD-18`.

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

The round is **`TD-18` + `TD-21`**. Start with `superpowers:brainstorming` — the scope is
decided but the shape is not, and the styles comparison in particular needs designing before
it is planned.

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

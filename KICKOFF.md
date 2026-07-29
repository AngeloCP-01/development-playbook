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

- **Playbook content:** all 18 stage docs written (`P-0`…`P-4`).
  **Caution:** the "18/18 pass the seven-section template check" and "124/124 links resolve"
  figures quoted in the tracker came from **ad-hoc P-4 scripts that no longer exist** (TD-5).
  They are not committed tests and nothing re-runs them. Do not cite them as having passed.
  What *is* enforced: `stage-metadata.test.ts` (each doc's H1 matches `stages.ts`, and every
  built stage has its `### AI in …` heading), `glossary.test.ts`, and — new in W-3.1 —
  `stage-03-structure.test.ts`, which pins that doc's thirteen subsections in order.
- **Web app:** `web/` — Next 16, TypeScript, Tailwind 4, no backend. **Stages 01, 02 and 03
  are complete and interactive.** Stage 03 (Architecture) ships a 6-step stepper
  (Reverse · Model · Constrain · Shape · Decide · AI plays), 9 figures, 4 judgment
  exercises, an annotated-DDL inspector, and a domain worksheet that carries stage 02's
  answers forward.
- **Stage 03's doc is done; its app now lags it (TD-23).** W-3.1 closed **TD-18**, **TD-21**
  and **TD-22** in `docs/03-architecture.md`, which went from 8 subsections and 300 lines to
  **13 subsections and 871 lines**, running requirements → HLD → LLD. The round was
  deliberately doc-only (**D-46**), so the app's six steps still mirror a doc that no longer
  exists. **Porting it is W-3.2 and it is the next round.** Note the app must mirror the
  *corrections* as well as the additions — `scoring.ts` holds the interrogation set, the DDL
  annotations and the reversibility lists, and all three changed.
- **The cold-reader method is now load-bearing, not a formality.** The re-run on the amended
  stage 03 scored 9 of 14 gaps closed and found five the round had *introduced*, including a
  Definition-of-done checkbox gated on idempotency that the doc never taught. Budget for a
  fix wave after every cold-reader pass; the first report is not the end of the round.
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
  eslint at `--max-warnings 0`, **134 vitest tests across 10 files**, a **10-test playwright
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

**Decided: port stage 03's amended doc into the app — `W-3.2`, closing `TD-23`.** The previous
round (`W-3.1`) rewrote the doc and deliberately left the app behind (**D-46**), so the two
now disagree. This round closes that, and it is the larger half.

**Settle the step structure first.** `D-38` caps a dense stage at five content steps plus the
AI step, and the doc no longer fits: thirteen subsections against the app's six steps. W-3.2
supersedes D-38, and the superseding decision has to state a **new ceiling with a reason** —
"stage 03 is special" is not one, because stage 04 will make the same argument.

**Mirror the corrections, not just the additions.** This is the part that is easy to miss.
`scoring.ts` carries the DDL annotations, the interrogation set and the reversibility lists,
and W-3.1 changed all three: a fifth interrogation question about actor rights, indexes and a
partial unique index and a `memberships` table in the DDL, and the reversibility test promoted
out of the AI section into section 1. A port that only adds components leaves the app asserting
things the doc has since corrected.

**New content needing components:** architecture characteristics with the trace-forward table,
the styles comparison, the system sketch and its three views, the sync/async decision, the ER
view and indexes, API contracts. The 14 new terms are already in `terms.ts` (glossary 42 → 56)
but not yet used inline — that wiring is this round's.

**Two cautions from W-3.1, both earned:**

- **The cold-reader pass is a gate, not a formality.** Its re-run found five gaps the round had
  *introduced*, including a Definition-of-done checkbox gated on idempotency that the doc never
  taught. Budget for a fix wave after the report.
- **Check `terms.ts` when fixing a concept** (**D-47**). `Authorization` was defined as
  ownership — TD-18's blocking G3 defect verbatim — and three tracker entries plus a
  cold-reader pass all missed it, because they were reading prose.

**Watch the length.** The doc is 871 lines, 2.3× the next-longest stage, which is a recorded
consequence of D-45 rather than an accident. Consultability scored 4/5 and two misfilings were
found and fixed. If the app port makes a step feel like a scroll, that is the same problem
arriving in a second surface.

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

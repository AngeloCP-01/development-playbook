# Kickoff: all JavaScript additions with sections and subsections

Updated 2026-11-06. Follow [AGENTS.md](AGENTS.md), D-99–D-103.

## Selected outcome and scope

The user selected all six researched additions, including modules, then asked
for sections with subsections. The [selected design and source record](reference/javascript-source-research.md#all-six-additions-and-subsections-selected-2026-11-06)
and [compact implementation plan](docs/superpowers/plans/2026-11-06-javascript-fundamentals-subsections.md)
are the implementation handoff. Field names, eight-section organization and
fourteen proposed activities are design choices within the selected direction.

Eight main sections, retaining the seven existing hashes and adding modules:
fundamentals; scope/closures; functions/this; objects/data; collections/problem
solving; promises/errors; scheduling; modules. Topic subsections have visible
summaries and independently expandable teaching/practice; solutions reveal
separately. Main hashes/history remain unchanged. Practice stays with its topic.

Cover control flow/text, Map/Set, a complete coding problem with edge tests and
cost reasoning, defaults/rest/destructuring/optional access, errors/cleanup/
promise composition, and named/default module imports/exports. Preserve the
four original closure/copy/async/scheduling activities. Convert the existing
collection-result activity into a worked example to keep 1–2 activities per
main section. Read the design for exact contracts and deferred scope.

## Start and implementation setting

- Documentation branch: `docs/2026-11-06-javascript-subsections`, from research
  **76119c2**. Before implementation, record its exact committed tip with
  `git rev-parse HEAD` and create `feat/javascript-fundamentals-subsections`.
- **Next task: implement W-6.3u.1c in a fresh user-selected GPT-6.1 Sol / High
  session**, following the executing-plans skill and D-100. The coordinator
  remains **01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended **GPT-6 Astra / Low**.
  Previous inline exceptions applied only to their named tasks.
- Accepted app **322c8733bb8553afd57c3fd32125105ac44f603a** is unchanged. Feature
  content currently has seven sections, eleven examples and nine activities,
  **26/30** sheets, **18/18** stages; local develop **25/30** sheets.
- Use supported Node **22.23.4** and pinned pnpm **10.33.0**. A task-local
  Corepack wrapper exists at `/private/tmp/w631a-bin/pnpm` if needed. Keep the
  user’s existing :3200 dev server intact when configuring verification servers.

## Acceptance and recovery checklist

- [ ] Extend optional Row.study metadata and checked resolver/generator traversal;
  support exclusive legacy/main-level and new subsection-level activity assignment.
- [ ] Compose nested RevealList teaching and local activities with h2/h3/h4/h5
  hierarchy, stable IDs, reset behavior and existing keyboard-scroll/focus behavior.
- [ ] Deliver all six content areas and exact activity contracts from the design.
  Keep ordinary/legacy presentation and all 29 other generated sheet bodies unchanged.
- [ ] Check actual CJS examples and real two-file `.mjs` examples separately.
  The module exercise repairs main.mjs against the supplied totals.mjs source;
  verify the intended named-import failure and repaired `USD 5 0` output.
- [ ] Audit all eight hashes and initially unmounted nested solutions; check
  main defaults/individual subsections against the panel budget, both themes,
  representative widths, keyboard/focus/scrolling and a clean dev console.
- [ ] Run behavior TDD, focused checks, the final web gate/dev-console once and
  one independent final review of actual content, app diff and delivered page.
  Record exact commits, real commands/counts and any remaining limits.

If interrupted, record the last completed task, branch/commit, failing command
and remaining checks here. Return implementation session/branch/commit and actual
evidence to the coordinator before integration. No merge, push or promotion is
authorized; separate user approval is required for a no-ff develop merge.

## Evidence boundary

This is a documentation-only design/handoff. Fresh closing checks on the tree
descended from **76119c2**: ledger **2/2**, local links/anchors **151 targets /
6 files**, and `git diff --check`, all exit 0. Self-review and humanizer editing
pass complete. Earlier **322c873** evidence remains in the
[tracker](docs/tracker.md): 1,637 tests/233 files, 57-page build, production 42/42,
dev-console 1/1. It does not validate this new delivery. The [task checklist](docs/task.md#overview)
tracks W-6.3u.1c. No app/generated/example inputs have changed.

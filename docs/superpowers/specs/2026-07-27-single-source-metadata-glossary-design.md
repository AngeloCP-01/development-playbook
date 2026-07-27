# Single source of truth: stage metadata (TD-2) and glossary (TD-3) — Design

**Date:** 2026-07-27
**Scope:** `web/src/lib/terms.ts`, `reference/glossary.md`, `web/src/lib/*.test.ts`, `web/src/lib/stages.ts` (type only)
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** closes TD-2 and TD-3, due before stage 03 multiplies both

## Problem

Two pairs of files duplicate content with nothing detecting the drift.

**TD-2 — stage metadata.** Exploration narrowed this: the doc header (`docs/NN-*.md`) and
`web/src/lib/stages.ts` genuinely duplicate only **two fields** — the title (doc H1
`# NN. Title` vs `Stage.title`) and the blurb (doc `> …` line vs `Stage.blurb`). The
other `stages.ts` fields (`group`, `cadence`, `ready`, `slug`) are app-only, and the doc's
"When this actually happens" line is a deliberately longer prose form of `timing`, not a
duplicate. The two copies do not yet disagree (stage 01's blurbs are byte-identical), but
nothing keeps them equal.

**TD-3 — glossary.** `reference/glossary.md` (18 terms, single-definition prose, keyed by
display name, covering terms from all 18 stage docs — mostly architecture/ops: ADR, Canary,
SLO, rollback) and `web/src/lib/terms.ts` (20 terms, richer `{short, full, soWhat}` shape,
keyed by slug, powering the app's inline `<Term>` popovers, but only for the two built
stages) are two glossaries with different coverage, shape, and audience. They overlap on a
handful of terms (spike, vertical-slice, YAGNI) that can silently diverge.

Stage 03 (Architecture) is next and introduces ADR, blast radius, and more — so the
glossary duplication is about to widen, not stay flat.

## Goals

1. One source of truth per concern, with drift made impossible-to-miss by a test.
2. TD-3: `terms.ts` is canonical; `reference/glossary.md` is generated from it and verified
   in sync on every `pnpm test`.
3. TD-2: the doc H1 title and blurb are asserted equal to `stages.ts` for every stage.
4. Both close in a way that keeps the markdown docs readable and editable standalone.

## Non-goals

- **Generating the stage-doc headers from `stages.ts`.** Rejected in brainstorming: the
  docs are hand-authored prose, and injecting generated lines (with edit-region markers)
  for a two-field payoff fights the "readable in a plain editor" principle. Detection, not
  generation, for TD-2.
- **Unifying `timing`/`cadence`/`group`/`ready`.** They are app-only or deliberately a
  different form from the doc; not duplication.
- **A new build tool or dependency.** The generator is vitest's built-in
  `toMatchFileSnapshot`; no script runner, no bundler step.
- **Rewording the migrated glossary definitions to be different from the doc's.** The
  migration preserves meaning; it does not re-author the terms.

## Constraints

- No new dependencies. Node 22 / pnpm 10; tests are vitest, run from `web/`.
- `reference/glossary.md` lives at the repo root, outside `web/`; from a test in
  `web/src/lib/` the path is `../../../reference/glossary.md` (three levels up to the root).
- The existing `terms.test.ts` invariant (every term has non-empty `short` and `full`)
  stays green; migrated terms must satisfy it.
- Style: single quotes, no semicolons, 2-space indent; lint at `--max-warnings 0`.
- TDD: the sync tests are written to fail first (against the current out-of-sync state),
  then made to pass by generating/aligning. A teeth check on each.
- Branch `fix/single-source-metadata-glossary`; Conventional Commits with the trailer.

## Architecture

### TD-3 — terms.ts canonical, glossary.md generated

**Schema change.** `Term` gains a required display `name` (the glossary heading, e.g.
`'ADR (Architecture Decision Record)'`, `'MVP'`, `'YAGNI'` — not derivable from the slug)
and an optional `see?: string` (a stage slug, for the "See [NN — Title]" cross-link the
current glossary carries):

```ts
export type Term = {
  name: string           // display heading for the glossary
  short: string
  full: string
  soWhat?: string
  see?: string           // stage slug, e.g. '03-architecture'
}
```

**Migration.** Every existing term (20) gains a `name`. The ~13 architecture/ops terms that
live only in `glossary.md` (ADR, blast radius, canary, error budget, golden signals, merge
gate, phantom dependency, preview deployment, production-grade, rollback, skew protection,
smoke test, SLO, plus any others) are added to `terms.ts` with the richer shape — `short`,
`full`, and `soWhat` where it adds something. This is not speculative: stage 03 will
reference several inline. Overlapping terms keep the `terms.ts` version and are reconciled
to one definition.

**Generator.** A pure `renderGlossary(): string` in `web/src/lib/glossary.ts` renders the
markdown: the fixed intro, a "generated from terms.ts — edit there, run `pnpm test -u`"
note, then every term sorted by `name`, as `**{name}** — {full}` plus a `See [link]` when
`see` is set. Glossary body uses `full` (the complete definition), which matches the
current glossary's register.

**Sync as a file snapshot.** `glossary.test.ts` asserts
`expect(renderGlossary()).toMatchFileSnapshot('../../../reference/glossary.md')`. A normal
`pnpm test` fails if `terms.ts` changed without regenerating; `pnpm test -u` regenerates the
committed file. `glossary.md` becomes a committed snapshot of `terms.ts` — no separate
script, no drift.

### TD-2 — a metadata sync test

`stage-metadata.test.ts` iterates `STAGES`; for each, reads `../../../docs/{slug}.md`,
parses the H1 (`# NN. Title`) and the first `> ` blurb line, and asserts the H1's title
part equals `Stage.title` and the blurb equals `Stage.blurb`. No generation; the docs stay
hand-written. The failure message names the stage and the mismatch, so a future edit to one
side surfaces immediately.

## Testing

RED before GREEN, raw output pasted, the RED reason stated, a teeth check on each.

- `glossary.test.ts` — `renderGlossary()` vs the committed `reference/glossary.md` via
  `toMatchFileSnapshot`. First run: FAIL (the current glossary is hand-written and differs);
  regenerate with `-u`; GREEN. Teeth: change one term's `full`, run without `-u`, confirm
  the snapshot test fails; restore.
- `stage-metadata.test.ts` — doc H1/blurb vs `stages.ts` for all 18. First run: confirm it
  passes (they currently agree) — so instead write it against a deliberately mismatched
  fixture first to prove it *can* fail, then point it at the real files. Teeth: temporarily
  change one `Stage.blurb`, confirm exactly that stage fails; restore.
- `terms.test.ts` — extend: every term has a non-empty `name`; a term's `see` (if present)
  is a real stage slug (`getStage(see)` defined).

## Verification

`cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build` — all green. Confirm
`reference/glossary.md` still renders as a readable glossary on GitHub (spot-check the
generated markdown: headings, links resolve, alphabetical order). Confirm the 22 routes
still prerender. No live-audit change (no UI touched), though the `<Term>` popovers gain the
migrated terms' data, so a quick check that an existing stage-01 term still opens is worth
one browser glance.

## Documentation updates

- `reference/glossary.md` — becomes generated; carries the "do not edit by hand" header.
- `README.md` — the "What does that word mean? → reference/glossary.md" pointer stays; add
  a line (or a comment in the file) that it is generated from `terms.ts`.
- `CLAUDE.md` / `web/PATTERNS.md` — note that glossary terms are authored in `terms.ts` and
  the markdown is generated; regenerate with `pnpm test -u`.
- `docs/tracker.md` — close TD-2 and TD-3 with evidence; a decision (D-36) recording
  terms.ts-canonical + snapshot-generation for the glossary and detection-for-metadata, and
  why generation was rejected for the doc headers.
- `docs/task.md` — mark the "settle before stage 03" note resolved.

## Risks

- **Migration is the bulk of the work and is content, not mechanics.** ~13 terms need
  `short`/`full` written and 20 need a `name`. Mitigation: the definitions already exist in
  `glossary.md` prose; migration is porting and enriching, not inventing. Run
  `humanizer:humanizer` over any newly written `full`/`soWhat`.
- **The generated glossary reads worse than the hand-written one.** Mitigation: the
  generator preserves the intro and uses `full`; a spot-check on GitHub is in Verification.
  If the register is off, adjust the template, not the source.
- **`toMatchFileSnapshot` path fragility across the web/ boundary.** Mitigation: the test
  states the resolved path in a comment and the first `-u` run proves it writes to the right
  file.

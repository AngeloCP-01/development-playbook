# Stage 04 — Project Setup (W-3, fourth stage) — Design

**Date:** 2026-08-12
**Scope:** `docs/04-project-setup.md`, `reference/stack.md`, `web/src/components/`,
`web/src/features/architecture/`, `web/src/features/setup/`, `web/src/lib/`, `web/e2e/`
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** W-3 from `docs/task.md`, fourth stage. Order decided 2026-08-11 against
15 — Observability; the reasoning is in `docs/tracker.md`, "Next up"

## Problem

Stage 04 is the next stage to build, and unlike stage 03 it is not a port of prose that
was already right. **The doc is wrong where a reader acts on it.** That is TD-28, and it
reframed the round before it started: fix a doc that misleads, rather than port a doc that
is fine but unexercised.

The headline defect is one sentence in **§8 Connect Vercel**, which tells the reader to
confirm the host's Node version "matches `.nvmrc`". Vercel reads neither `.nvmrc` nor the
CI workflow. Its Node version comes from a project setting, overridden by `engines.node`
in `package.json`. A reader who follows that sentence pins local and CI, believes they
have pinned the host, and has not — which is the exact drift `reference/stack.md`'s
**Core** table calls "a recurring source of 'works locally' bugs".

**Reading the doc for this spec found four more defects TD-28 does not name**, and three of
them sit outside §8. TD-28 is therefore a subset of the round rather than its definition.

| # | Where | Defect | Named in TD-28 |
|---|---|---|---|
| 1 | §8 Connect Vercel | "confirm the Node version matches `.nvmrc`" — the host reads neither | yes |
| 2 | Definition of done | "Node version is identical in `.nvmrc`, CI, and Vercel settings" — **the same error restated as a checkbox**, so correcting §8 alone leaves the doc contradicting itself | no |
| 3 | §1 Scaffold | `engines.node` is present, but framed only as a guard that "makes pnpm refuse to install on the wrong major". True, and the secondary effect. The load-bearing one — it is what the host reads — is unstated | no |
| 4 | §6 Git hooks | Shows a one-time `pnpm lefthook install` and **never adds a `prepare` script**, so hooks install on the author's machine and on nobody else's. The doc cannot warn about a trap it never walks the reader into | partly — TD-28 assumes the script exists |
| 5 | §8 Connect Vercel | Root Directory unmentioned; an app in a subdirectory does not build without it | yes |
| 6 | §8 Connect Vercel | Framework Preset unmentioned; a project created against an empty repository guesses, and `Other`'s output directory is `public` | yes |
| 7 | §8 Connect Vercel | "you should get a preview URL — verify that" gives the reader no way to tell a preview of the **wrong repository** from a real one | no |
| 8 | The work | No `### AI in …` subsection, so D-35 is unmet and the stage cannot be built | no |

Items 2, 3 and 4 are why the correction is not a one-line edit. A reader who fixes only §8
still ships an unpinned host (3) against a checklist that tells them they pinned it (2),
with hooks that never propagate past their own clone (4).

**Item 8 blocks the build outright.** `web/src/lib/stage-metadata.test.ts:40-44` holds an
explicit `AI_SECTION_STAGES` list, and its own comment (`:37-39`) says the list "grows by
one slug per stage built … so the section lands with the doc amendment at the start of a
stage round rather than at the end when `ready` flips." Adding `'04-project-setup'` is a
one-line failing test that the doc amendment turns green. The doc phase has a real RED,
which is unusual for a docs branch and settles how the iron law applies to it.

The app side is the ordinary shape: `04-project-setup` is absent from `STAGE_CONTENT` and
`ready: false` at `web/src/lib/stages.ts:61`, so the route renders "sheet not drawn".

**One piece of pre-existing debt is forced open by this stage rather than chosen.** Stage
03 ships five expand-to-reveal components with identical markup — `DeferredList`,
`DeploymentStyles`, `ResiliencePatterns`, `EvolutionNotes`, `ScalingMoves`. Two of them say
so in their own headers: `EvolutionNotes.tsx:15-18` calls three near-identical accordions
"duplication worth naming", and `ScalingMoves.tsx:20-22` records the fifth and defers the
fix as "a change of its own, not a rider on this one". Stage 04 needs the same pattern for
its Traps and Artifacts lists. Extracting the component before the port means writing three
new callers; extracting it after means rewriting three components that were just reviewed.

## Goals

- **`docs/04-project-setup.md` is correct where a reader acts on it.** All eight defects
  above closed, verified by running the claims rather than re-reading them.
- **The doc's own instructions are executed end to end**, in a scratch directory, before
  anything is ported. Stage 04 carries a dozen executable blocks that together claim to
  produce a working project; D-50 says executable content gets executed.
- **A cold-reader completeness pass runs before the app is built, not after.**
  `docs/learnings/stage-implementation-101.md` records stage 03 running it last and ending
  with a finished app sitting on a doc with three blocking gaps.
- **`RevealList` replaces the five duplicated accordions**, proven by the audit sweep
  returning the same expandable count and the same contrast result.
- **Stage 04 renders interactive** and `ready: true`, with a scored judgment exercise on
  the four real deploy failures, a persisted setup checklist, an AI-plays step, and a
  closing traps set.
- **TD-28 closes** with evidence in `docs/tracker.md`.

## Non-goals

- **Fixing TD-27 (the stale e2e server).** Deliberately declined for this round: it is a
  change to the verification harness, and making it while the harness is the instrument
  measuring nine new panels means a bad fix is invisible. Carried instead as a process
  mitigation (kill `:3100` before every run) and as a Risk below, because this round is
  exactly its failure pattern.
- **Fixing TD-12 (hand-written audit `PAGES`).** Nine hashes go in by hand. Deriving
  `PAGES` from the ready set is the right fix and it touches the file that gates the whole
  round; doing both at once means a red audit has two candidate causes.
- **Auditing `docs/12-staging.md` and `docs/13-production-deployment.md`.** They are silent
  on the dashboard settings, not wrong about them, and silence about first-deploy setup is
  stage 04's job by the docs' own cross-reference structure. Widening to a three-stage
  audit also has nothing to check the result against — 12 and 13 are unported.
- **Backfilling render tests across stage 03's remaining components.** The TD-17 non-goal
  stands; `RevealList` gets one because it is new code.
- **Any change to `main`.** Three merges into `develop`, each asked for separately.

## Constraints

- **`main` is production.** Work branches merge to `develop` only, and every merge is asked
  for individually. Having this spec approved is not approval to merge anything.
- **The iron law.** No production code without a failing test first, including the doc
  phase, which has one available (`AI_SECTION_STAGES`).
- **D-52 panel weight.** One judgment per step, no panel over four screens at 1024×768. A
  panel measuring 4.0 against a limit of 4.0 has not passed. **The exit condition of a
  split is the measurement, not the edit.**
- **D-42.** Cite doc sections by heading, never by line number — followed throughout this
  spec, which is why every `docs/` reference above names a section and every `web/src/`
  reference carries a line.
- **D-47.** Grep `terms.ts` when a concept changes, then `pnpm gen:glossary`. Never
  hand-edit `reference/glossary.md`.
- **D-50.** Executable content in a document gets executed.
- **The same session cannot self-review.** Implement inline, dispatch reviewers.
- Prose deliverables get the `humanizer:humanizer` pass. Terminal output, code, tables and
  tracker entries are exempt.

## Architecture

### Branches

```
develop
  ├── fix/stage-04-doc-corrections   doc corrections · AI section · cold-reader wave
  ├── refactor/reveal-list           RevealList extraction (independent of the above)
  └── feat/stage-04-app-port         the port, off develop once both have landed
```

The first two are independent and can run in either order. The port depends on both: on the
doc because a plan specified against a doc that then changes is the failure stage 03 hit
five times out of six, and on `RevealList` because three of the port's components are its
callers.

### Phase 1 — the doc correction (`fix/stage-04-doc-corrections`)

Named for the whole correction rather than for §8. Three of the eight defects sit outside
that section, and a branch name is a claim like any other.

**§1 Scaffold** — reframed, not rewritten. The claim "Pin the Node version so local, CI,
and Vercel agree" is the wrong one: `.nvmrc` reaches local (nvm/fnm) and CI (the workflow's
`node-version-file`) and stops there. `engines.node` keeps its pnpm-guard reason and gains
its real one. The generalisation from `deploying-101.md` lands in a line: for each
environment that runs your code, find the file *that environment* reads.

**§6 Git hooks** — gains the `prepare` script the doc never had, together with its guard,
because either half alone is a defect:

```json
{ "scripts": { "prepare": "lefthook install || true" } }
```

Without `prepare`, hooks exist only where someone ran the install command. With an
unguarded `prepare`, `pnpm install` exits 1 on every build host — pnpm runs `prepare` on
install, `lefthook install` needs a `.git`, and build environments have none. Husky fails
identically for the identical reason, so this is not a lefthook footnote.

**§8 Connect Vercel** — rewritten, roughly 10 lines to 45, in four moves:

1. `vercel link`.
2. **The three settings the repository cannot express**, each with the failure message it
   actually produces, because the message is what a stuck reader searches for:

   | Setting | What you see when it is wrong |
   |---|---|
   | Root Directory unset | `No Next.js version detected` |
   | Framework Preset `Other` | `No Output Directory named "public" found after the Build completed` |
   | Node version | *nothing* — it builds, and drifts |

3. **Check the SHA, not the status.** A green build of the wrong repository is
   indistinguishable from success at a glance; this project had three of them, labelled
   `Initial commit`. `git cat-file -t <sha>` settles it in one command.
4. **Verify against the running site, not the dashboard.** A green deployment says a build
   finished. It does not say the site is right.

**Definition of done** — the Node line is replaced with one naming the file each
environment reads, and a `.git`-less install check is added. **Artifacts** gains
`package.json`'s `engines` and `prepare`.

**`### AI in project setup`** — new subsection inside "The work", per D-35. Grounded in
this project rather than generic: an agent writes the CI workflow and the env schema well,
and cannot see a dashboard at all. All three settings that broke this deploy were invisible
to every tool in the repository — which is the honest boundary, and a better lesson than a
list of prompts.

**`reference/stack.md`** — the **Core** table's Node row currently says to match the version
"in CI, in Docker, and in Vercel project settings", which is right and incomplete: it names
the setting without naming the file that overrides it. One clause added. This is the file
whose whole job is that versions live there and nowhere else.

### Phase 2 — executing the doc (same branch)

Run the doc's own instructions start to finish in a scratch directory: `create-next-app`
with those exact flags, that `.prettierrc`, those `tsconfig` additions, that `lefthook.yml`,
that `ci.yml` parsed, that `env.ts` typechecked. Reading cannot tell you whether
`eslint-config-prettier/flat` is still the right specifier or whether those scaffold flags
still exist; one pass can.

The `prepare` claim is already executed and confirmed, ahead of the spec, because the whole
correction rests on it:

```
$ lefthook install              # in a directory with no .git
fatal: not a git repository (or any of the parent directories): .git
exit status 128 → exit=1

$ CI=1 VERCEL=1 lefthook install
exit status 128 → exit=1        # neither variable changes it

$ lefthook install || true
exit=0
```

### Phase 3 — the cold-reader wave (same branch)

Per `docs/learnings/cold-reader-testing.md`, after the corrections land and before the port:

- **Completeness run.** One agent, that document only, forbidden from filling gaps with its
  own knowledge, given a concrete task the doc is meant to enable on a scenario that is not
  the doc's own example.
- **Consultability rating**, run separately — three questions answered from headings alone.
  A cold reader reads linearly and structurally cannot judge look-up-ability.
- **Fix wave, then a re-skim of the fix wave's own additions** (D-48). The report is the
  middle of the round. The fix wave lands after the pass that justified it, so by
  construction nothing checks it unless something is made to.

### Phase 4 — `RevealList` (`refactor/reveal-list`)

`web/src/components/RevealList.tsx`. Shared, not feature-local, because stage 04 is its
second consumer. The five existing callers differ in exactly three ways — the item's label
field (`title` vs `name`), what the open body renders, and `ScalingMoves`' precondition
header — so the seam is:

```tsx
type RevealRow = { id: string; title: string; summary: string; body: ReactNode }

function RevealList({
  rows,
  idPrefix,
  header,
}: {
  rows: RevealRow[]
  idPrefix: string
  header?: ReactNode
}): ReactNode
```

Callers build `rows` from their own data; the component owns the open-set state, the
semantics, and the `aria-controls`/`id` pairing. `ScalingMoves`' precondition block passes
through `header`, keeping the deliberate choice recorded at `ScalingMoves.tsx:8-23` — that
the precondition is lifted out of the list rather than sitting in it as a peer row.

`TeamNotes` moves from `web/src/features/architecture/` to `web/src/components/` on this
branch. TD-13 made a team-notes disclosure the convention for every stage; leaving it in a
feature folder means stage 04 copies it instead.

### Phase 5 — the port (`feat/stage-04-app-port`)

`web/src/features/setup/`, registered in `web/src/features/stage-content.ts`, `ready: true`
at `web/src/lib/stages.ts:61`, with a `steps.ts` holding `STEP_IDS` the way
`web/src/features/architecture/steps.ts` does — so a nonexistent id is a compile error and
the audit list resolves against one source.

Seams, grouped one judgment per step:

| id | Doc source | The judgment | Pattern |
|---|---|---|---|
| `scaffold` | §1, §2 | Feature-first or layer-first | Click-node inspector on the `src/` tree |
| `strict` | §3, §4 | Which flags are worth the first week's friction | Annotated artifact on `tsconfig` |
| `env` | §5 | Validate at boot, or read `process.env` | Annotated artifact + `Contrast` |
| `gates` | §6, §7 | What belongs in pre-commit, pre-push, and CI | Annotated artifact on both YAMLs (D-41) |
| `deploy` | §8 | Which failures the repo can express, and which live in a dashboard | Guess then reveal |
| `proof` | §9, §10 | What counts as evidence that error tracking works | Expand to reveal + copy artifact |
| `checklist` | Definition of done | — | Persisted worksheet + `TeamNotes` |
| `ai` | the new AI section | Where an agent reaches, and where it cannot | Mirrors `AIArchitecturePlays` |
| `traps` | Traps | — | `Callout kind="trap"` set |

**Nine is provisional and recorded as provisional.** `gates` carries two annotated YAML
blocks and is the likeliest to split. Stage 03's round found a brief that did not match the
tree in five of six tasks; naming the expectation up front is cheaper than discovering it in
task 5.

**`DeployBlockers` is the headline component** — guess-then-reveal over four real failures,
the answer locked before the verdict, scored across the set:

| Symptom the reader sees | Cause |
|---|---|
| `No Next.js version detected` | Root Directory unset |
| `No Output Directory named "public" found after the Build completed` | Framework Preset is `Other` |
| `pnpm install` exits 1 before the build starts | `prepare` script on a host with no `.git` |
| **Three green production builds** | Connected to the wrong repository |

The fourth row is why this section earns an exercise rather than a paragraph: one option's
symptom is success. A reader who gets it wrong has learned *check the SHA, not the status*
by being wrong about it first, which is what `PATTERNS.md` means by guessing being the
lesson.

## Testing

- **Doc phase RED:** add `'04-project-setup'` to `AI_SECTION_STAGES`
  (`web/src/lib/stage-metadata.test.ts:40-44`) and watch it fail for the right reason — the
  doc has no `### AI in …` heading — before writing the section.
- **Count the doc, do not trust the brief.** `setup-sections.test.ts` asserts the port's
  section data against `docs/04-project-setup.md` itself, the way `evolve.test.ts` and
  `ai-plays.test.ts` do. Two of stage 03's ports were specified against counts that were
  already stale when they were read.
- **Render tests** (`PATTERNS.md`, "When a component gets a render test") for `RevealList`,
  which owns a conditional render and an assembled `aria-controls` pairing, plus
  `DeployBlockers`, `SetupChecklist`, and any component with a module-private helper.
- **Teeth check every fix:** break the implementation again and confirm that test, and only
  that test, fails. Two pieces of evidence recorded this month turned out to be checks that
  could not fail, and in both cases the decorative one was the one nobody teeth-checked.
- **Test names are claims and go stale like claims.** Verify a name by running its regex
  against a counter-example, not by reading it. Stage 03's branch wrote eight stale ones —
  four caught during the round, four more by the whole-branch review — and twice the
  offending test had been cited in a commit body as the fix.

## Verification

- The three passes from `DESIGN.md` against a live build — contrast in both themes at every
  step, no overflow 320→2560px, zero console errors.
- **Panel weight per step**, D-52, measured rather than judged. Re-cut and re-measure; do
  not assume a seam is right because the edit is done.
- **`RevealList` equivalence.** The audit sweep counts 108 expandables across 36 URLs after
  TD-26's fix. Same count and same contrast result before and after the refactor is what
  proves five components were replaced and nothing was lost. A green suite alone would not.
- **`:3100` killed before every `pnpm test:e2e`.** TD-27 is open by choice this round, and
  a session that runs the suite after each task otherwise measures the first task's build
  every time. It hid two over-threshold panels for five tasks on stage 03.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test` clean; `pnpm gen:glossary`
  re-run and `reference/glossary.md` byte-identical unless a term genuinely changed.
- **A per-task read-only reviewer, then a whole-branch review before each merge.** The same
  session cannot self-review — the reading that produced the claim produces the check.
- `pnpm test:prod` is **not** part of this; it measures the deployed site and says nothing
  about the working tree. It runs after a promotion to `main`, which is the user's.

## Documentation updates

- `docs/04-project-setup.md` — the eight corrections and the AI section.
- `reference/stack.md` — the Node row's `engines.node` clause.
- `docs/tracker.md` — a shipped-with-evidence row per merge; **TD-28 closed**; new decisions
  from **D-53** (D-52 is current); each entry carrying its `Deferred:` list.
- `docs/task.md` — W-3 milestone advanced to 4/18.
- `web/PATTERNS.md` — `RevealList` added to the building blocks, since the file documents
  the code and is the bug when they disagree.
- `KICKOFF.md` — *Project state* refreshed. A stale kickoff is worse than none, because it
  is trusted.
- `docs/superpowers/plans/2026-08-12-stage-04-*.md` — one plan per branch.

## Risks

- **TD-27 will silently invalidate a panel measurement.** The single likeliest way this
  round records a false number, and it is open by choice. Mitigation is procedural, which
  is weaker than a fix: kill `:3100` first, every run, and treat any panel weight that
  looks better than expected as suspect.
- **TD-12 lets a step ship unaudited.** Nine hashes by hand; a dead one fails loudly, a
  *missing* one audits nothing and stays green. Cross-check `PAGES` against `STEP_IDS` by
  eye at the end of the port.
- **The cold-reader wave will find defects this round introduces, not only old ones.** Stage
  03's re-run found five the round had just created, including a Definition-of-done checkbox
  gating on a concept the body never taught. Budget the fix wave; the report is the middle.
- **Executing the doc may date it.** `create-next-app`'s flags, `eslint-config-prettier`'s
  specifier and the Sentry wizard all move. If the run finds the doc stale rather than
  wrong, that is a larger correction than TD-28 scoped, and the scope call is the user's.
- **`RevealList` touches five reviewed components.** The equivalence check is the control.
  If the expandable count moves at all, the refactor is wrong, not the checker.
- **Nine steps is a guess.** If `gates` splits, `PAGES`, `STEP_IDS` and any prose naming a
  step all move together. A step name written in a sentence is a citation that stales
  silently — grep for step names whenever a step splits.

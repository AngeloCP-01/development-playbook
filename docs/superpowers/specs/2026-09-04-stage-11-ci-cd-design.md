# Stage 11 (CI/CD) Interactive Port — Design

## Problem

Stage 11 is the most cross-referenced unbuilt stage. Four interactive stages (04, 12,
13, 14) already link to it — every entry criterion says "CI is green (11)." The doc
exists (273 lines) but pins GitHub Actions at `@v4` while stage 04's web app already
teaches `@v7`/`@v6`/`@v7`. The doc needs version correction, then an interactive port
following the same pattern as stages 01–07 and 12–14.

## Goals

- Correct action versions in `docs/11-ci-cd.md` to match what stage 04 teaches
- Add the mandatory `### AI in CI/CD` subsection to the doc (D-35)
- Port the doc into an interactive stage with 8 steps through `<Stepper>`
- Build the ordering exercise as the signature piece — a guess-then-reveal where the
  reader arranges CI steps and discovers why cheapest-failure-first matters
- Annotate all three YAML artifacts (ci.yml, e2e.yml, dependabot.yml) line by line
- Register terms for CI/CD vocabulary the reader may not know
- Pass all quality gates, coverage walk, and humanizer
- Ship a `github-actions` cheatsheet (W-6.3l) tethered to stage 11

## Non-goals

- **Not rewriting the doc's prose.** The doc is well-written with real "this repo caught
  exactly this" stories. The port teaches its content; it does not edit the editorial
  voice. Why: doc rewrites during a port round create a second moving target and the
  duplication is already known and accepted.
- **Not building a live CI dashboard or GitHub integration.** The stage is static
  reference material. Why: the site has no backend, no env vars, no API calls.
- **Not adding drag-and-drop to the ordering exercise.** Click-to-rank with numbered
  slots is sufficient and accessible. Why: drag-and-drop on touch devices is brittle
  and every other guess-then-reveal in the app uses click, not drag.
- **Not covering CI providers beyond GitHub Actions.** The doc is GitHub Actions
  throughout. Why: stage 13 already handles the platform-aware split (Vercel vs AWS);
  stage 11 is the gate, and GitHub Actions is the gate this project uses.

## Constraints

- The three-file registration trace (`stages.ts`, `stage-content.ts`, `step-ids.ts`)
  is one atomic operation — do it in the assembly task, not the scaffold
  (`stage-implementation-101.md`).
- `AnnotatedArtifact` data modules live per-stage in `src/features/ci-cd/`, not in
  `src/components/` — they are data, not shared infrastructure.
- Testing library: `fireEvent` from `@testing-library/react` + plain DOM assertions.
  No `jest-dom`, no `user-event` (`stage-implementation-101.md`).
- `RevealFacet` tone maps must use static `Record` maps, never template literals.
  Source test required for any new tone map (`PATTERNS.md`).
- JSX spacing: explicit `{' '}` between `<Term>` and adjacent text. Check with
  `pnpm format` that Prettier does not collapse it (`stage-implementation-101.md`).
- Tailwind token names come from the `@theme` block in `globals.css`, not from CSS
  custom property names (`stage-implementation-101.md`).
- Doc-pin regexes must use `flat(section(...))` to survive hard line-wraps in the
  markdown source.
- Teeth checks require committed files, not `git add -N`
  (`stage-implementation-101.md`).
- Every AI plays section needs at least one "run this command" play
  (`stage-implementation-101.md`).

## Architecture

### Doc correction (Phase 1)

Update `docs/11-ci-cd.md` version references:

| Action | Current (doc) | Target | Source of truth |
|---|---|---|---|
| `actions/checkout` | `@v4` | `@v7` | `web/src/features/setup/artifacts.ts` |
| `pnpm/action-setup` | `@v4` | `@v6` | `web/src/features/setup/artifacts.ts` |
| `actions/setup-node` | `@v4` | `@v7` | `web/src/features/setup/artifacts.ts` |
| `actions/upload-artifact` | `@v4` | verify latest via GitHub marketplace; update if ahead of `@v4` | GitHub marketplace |

Add an `### AI in CI/CD` subsection inside "The work" (after "Secrets", before
"Artifacts"). Every interactive stage doc carries one (D-35). Content: AI writing
workflow drafts (the first version is faster, but human verifies triggers, secrets
boundaries, and concurrency logic), AI-assisted flakiness detection (pattern
recognition across test runs), Copilot Autofix for security advisories, and the
boundary — AI does not decide what to enforce; the human owns protection rules and
the secrets perimeter.

### Step structure (Phase 2)

8 steps, each carrying one judgment:

| # | ID | Label | Hint | Judgment |
|---|---|---|---|---|
| 1 | `gate` | The Gate | Actions is the gate; Vercel is the deployer | Why this workflow shape? |
| 2 | `ordering` | Cheapest First | Why the order matters more than the checks | Which order, and why? |
| 3 | `e2e` | End-to-End | Test the real deployment, not a dev server | Why separate from CI? |
| 4 | `protection` | Branch Protection | The pipeline is decoration until this is on | What to enforce? |
| 5 | `deps` | Dependencies | Grouped updates, not fifteen PRs a week | How to keep deps survivable? |
| 6 | `scaling` | Scaling | When a solo pipeline meets a team | When to add each practice? |
| 7 | `ai` | AI Plays | Where agents help and where they mislead | Where AI helps vs misleads in CI |
| 8 | `traps` | Traps | The failures that look like someone else's problem | Seven failure modes |

### Interaction patterns per step

**Step 1 (gate):** `Prose` intro on division of labor (Actions = gate, Vercel = deployer).
`AnnotatedArtifact` for the complete `ci.yml`. Annotations on: `concurrency` +
`cancel-in-progress`, `--frozen-lockfile`, `timeout-minutes`, `node-version-file`,
`cache: 'pnpm'`. A `Callout` for the "do not build deploys in Actions" principle.

**Step 2 (ordering):** Guess-then-reveal exercise. Five CI steps (format, lint,
typecheck, test, build) presented shuffled. Reader clicks to assign rank positions 1–5.
After locking, the correct order is revealed with cost reasoning per step (seconds to
fail, cumulative wait). A `Contrast` bad/good: "build first → 2 min wait for a
semicolon" vs "format first → 3 sec to the same answer." Scored: how many did you
place correctly?

**Step 3 (e2e):** `AnnotatedArtifact` for `e2e.yml`. Pivot line on
`deployment_status` — the insight that E2E tests run against the real preview URL.
Annotations on `upload-artifact` (trace on failure), `playwright install --with-deps`,
and the `BASE_URL` env var.

**Step 4 (protection):** `RevealList` with 4 rows: (1) required status checks,
(2) up-to-date branches, (3) linear history + auto-merge, (4) secrets and OIDC.
A `Callout kind="warn"` for the GitHub Free/private repo caveat. `RevealFacet` labels
for "what it prevents" and "the catch" per row.

**Step 5 (deps):** `AnnotatedArtifact` for `dependabot.yml`. Annotations on `groups`,
`open-pull-requests-limit`, `schedule`. A `Contrast` for ungrouped (15 PRs/week →
0 read) vs grouped (2 PRs: dev + production minors). Brief `Prose` on why majors
arrive individually.

**Step 6 (scaling):** `RevealList` with 5 rows matching the doc's scaling moves:
(1) require approvals, (2) split jobs past 5 min, (3) merge queue at 4–5 engineers,
(4) remote cache, (5) flakiness data. Each row body uses `RevealFacet` for "trigger"
(when to add) and "why not sooner" (the cost of premature optimization).

**Step 7 (ai):** `RevealList`. Tool plays (concrete commands): GitHub Actions AI
reviewer, Copilot Autofix for security findings, AI-generated workflow drafts,
`/code-review` for PR checks. Philosophy plays: AI writes the first CI draft but
human verifies the trigger conditions, AI suggests caching strategies but human owns
the secrets boundary. At least one "run this command" play per
`stage-implementation-101.md`.

**Step 8 (traps):** `RevealList` with 7 rows from the doc's traps section. Title is
the trap name, body explains the failure mode, the fix, and where applicable cites this
repo's history. Standard closing pattern with `Callout kind="trap"` wrapper.

### File structure

```
web/src/features/ci-cd/
├── steps.ts                      # STEP_IDS tuple + StepId type
├── steps.test.ts                 # Step ID invariants
├── CiCd.tsx                      # Main component → <Stepper>
├── CiCd.test.tsx                 # Render tests
├── ci-artifact.ts                # ci.yml AnnotatedArtifact data
├── e2e-artifact.ts               # e2e.yml AnnotatedArtifact data
├── dependabot-artifact.ts        # dependabot.yml AnnotatedArtifact data
├── ordering-exercise.ts          # Step data + correct sequence + scoring
├── ordering-exercise.test.ts     # Data invariants, doc pins
├── OrderingExercise.tsx           # Guess-then-reveal component
├── OrderingExercise.test.tsx      # Render: scoring, lock, reveal
├── scaling.ts                    # Scaling move rows
├── traps.ts                      # Trap rows
├── traps.test.ts                 # Doc-pinned trap assertions
├── ai-plays.ts                   # AI plays data
├── ai-plays.test.ts              # AI plays data tests
├── AIPlays.tsx                   # AI plays component
├── AIPlays.test.tsx              # AI plays render test
├── doc-source.ts                 # Doc path + section helpers
└── prose.test.ts                 # Doc-pinned prose assertions
```

### Terms

New entries in `web/src/lib/terms.ts`:

| ID | Name | Why it matters (soWhat) |
|---|---|---|
| `concurrency-group` | Concurrency group | Without it, three pushes burn three CI runs instead of one |
| `frozen-lockfile` | Frozen lockfile | CI silently resolves different versions than you tested with |
| `branch-protection` | Branch protection | The pipeline is decoration until merging is actually blocked |
| `merge-queue` | Merge queue | Tests each PR against the post-merge state, not a stale branch |
| `oidc` | OIDC | Short-lived credentials minted per run; nothing to leak from config |
| `deployment-status` | Deployment status event | The trigger that makes E2E run against a real deployment |

### References

3–5 outward links (enforced by test). Candidates:
- GitHub Actions documentation (workflow syntax)
- Vercel Git integration docs (the deployer half)
- Playwright CI docs (trace and artifact handling)
- Dependabot grouping docs

Each states what it adds beyond the stage.

### W-6.3l — `github-actions` cheatsheet

A new cheatsheet tethered to stage 11, following the per-stage cadence established
by D-88 (bounded W-6 round after each W-3 stage ships). Slug: `github-actions`.
Group: Standards (alongside `code-review`, `testing`, `playwright`, etc.).

Sections (3, matching the sheet's lookup-not-reading constraint):

1. **Workflow syntax** — the skeleton every workflow starts from: `on` triggers
   (push, pull_request, deployment_status, schedule, workflow_dispatch), `jobs`,
   `steps`, `uses` vs `run`. The seven triggers this stage and stage 13 actually
   teach, not an exhaustive list.
2. **Common patterns** — concurrency with cancel-in-progress, matrix strategies,
   conditional steps (`if:`), artifact upload/download, caching (`actions/cache`,
   `setup-node` cache), reusable workflows (`workflow_call`).
3. **Secrets and permissions** — `secrets.*` context, OIDC token exchange,
   `permissions:` block, environment protection rules.

No source plate image — content original to this playbook, same as `aws-deployment`
and `deployment-environments`. Filed in `web/src/lib/cheatsheets/github-actions.ts`,
registered in `index.ts`, `reference/cheatsheets.md` regenerated.

Seventeenth drawn sheet (of twenty registered + five planned language sheets).

## Testing

**Data tests** (node, `.test.ts`):
- `ordering-exercise.test.ts` — correct sequence is a permutation of all 5 steps;
  each step has a cost annotation; doc pins for the ordering rationale
- `traps.test.ts` — every trap title and at least one key phrase pinned to the doc
- `ai-plays.test.ts` — at least one tool play exists (the "run this command" rule)
- `prose.test.ts` — doc-pinned assertions for division-of-labor, ordering rationale,
  and the GitHub Free caveat
- `steps.test.ts` — step count, step IDs match the tuple

**Render tests** (jsdom, `.test.tsx`):
- `OrderingExercise.test.tsx` — renders all steps; after picking, score updates via
  `aria-live`; after lock, correct/incorrect revealed; score is literal, not
  data-derived
- `AIPlays.test.tsx` — renders all plays; at least one contains a command string
- `CiCd.test.tsx` — renders step labels, artifact components mount

**Source tests:**
- Any `RevealFacet` tone map gets a source test per `PATTERNS.md`

**Teeth checks:**
- Every test gets a deliberate break-and-verify against committed files

## Verification

1. **Contrast** — every text/background pair, both themes, all 8 steps, WCAG AA
2. **Responsive** — 320→2560px, no overflow, touch targets ≥ 44px below `lg`
3. **Console** — zero errors in clean browser context (production build for e2e,
   dev build for `test:dev-console`)
4. **Humanizer** — `humanizer:humanizer` over all prose-facing text
5. **Coverage walk** — blind to the plan, doc heading by heading vs panels,
   dispatched with planning docs explicitly withheld

## Documentation updates

- `docs/tracker.md` — record W-3.11 with evidence (test count, review findings);
  record W-6.3l `github-actions` cheatsheet
- `KICKOFF.md` — refresh project state (W-3 at 11/18, stage 11 interactive)
- `docs/task.md` — mark W-3.11 complete; update W-6 progress (seventeen of twenty
  drawn)
- `reference/glossary.md` — regenerate via `pnpm gen:glossary` after new terms
- `reference/cheatsheets.md` — regenerate after new sheet
- `reference/cheatsheet-sources.md` — update `containers` note (stage 11 now has a
  port; `github-actions` shipped instead, `containers` remains undrawn)

## Risks

**The ordering exercise is a new interaction shape.** No prior stage has a
"rank these items" exercise — the closest is guess-then-reveal with binary or
multi-choice answers. The component needs careful accessibility (numbered slots,
`aria-live` for score, keyboard reordering). Mitigation: keep it click-to-assign
(not drag), which maps to the existing guess-then-reveal pattern with a ranking
twist rather than a fundamentally different interaction.

**Eight steps is on the high end.** Prior stages range from 6–8. Each step here
carries one judgment and the doc genuinely has 7 distinct sections plus AI plays.
Mitigation: measure every panel against the 4-screen ceiling; compress with
expand-to-reveal rather than splitting further.

**Three annotated artifacts in one stage.** Stage 04 has five, so there is
precedent. The risk is visual monotony. Mitigation: the ordering exercise in
step 2 breaks the rhythm between artifacts in steps 1 and 3, and steps 4–6 use
different patterns entirely.

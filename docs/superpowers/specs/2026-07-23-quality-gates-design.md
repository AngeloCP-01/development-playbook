# Quality Gates (W-4 + P-5 resolution) — Design

**Date:** 2026-07-23
**Scope:** `web/` tooling, tests, CI; `reference/` and `docs/` amendments
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** W-4 from `docs/task.md`, folding in the P-5 tooling decision

## Problem

The app has no tests, no formatter, no git hooks, and no CI (`docs/tracker.md` TD-4,
TD-5, TD-6). Its verification — contrast, responsive, console — has caught eleven real
bugs but lives in throwaway scripts rewritten every session. Meanwhile the playbook the
app implements calls adding CI later "the most expensive mistake on the page"
(`docs/11-ci-cd.md`), and prescribes tooling the app does not use (TD-1:
`reference/stack.md:39-40` says Biome + Lefthook; `web/package.json:9` runs ESLint, no
hooks exist).

Every stage built before this lands is built without a safety net, and W-3 is seventeen
stages long.

## Goals

1. A committed, repeatable verification suite covering what the ad-hoc scripts covered:
   overflow, touch targets, contrast in both themes, console errors.
2. Unit tests over the data layer that stage-building actually breaks
   (`web/src/lib/stages.ts`, `web/src/lib/terms.ts`).
3. A CI gate ordered cheapest-first: format → lint → typecheck → unit → build → audit.
4. Git hooks so mistakes are caught in seconds locally, not minutes in CI.
5. The tooling contradiction resolved and the docs amended to match reality.

## Non-goals

- **Component/behaviour tests for stage 01's exercises** — they arrive with W-3, where
  each new stage adds its tests alongside its components. Testing them now would freeze
  APIs that W-3 will evolve.
- **Visual regression screenshots** — high maintenance for a solo project; the audit
  suite checks the properties that matter rather than pixels.
- **Deploy** — that is W-5, explicitly gated on this round.
- **Switching to Biome** — rejected after research. Biome covers ~80% of common ESLint
  configs, but this repo's most valuable lint catch (`react-hooks/set-state-in-effect`
  finding the `useLocalStorage` cascading render) came from the ESLint-only
  react-hooks family that Next ships. Speed is not a constraint at this repo's size.
  Biome stays documented as the alternative for non-Next projects.

## Constraints

- Node 22 / pnpm 10; all app commands run from `web/`.
- Prettier config must match the code's existing style (single quotes, no semicolons) so
  the baseline format commit is mechanical, not a rewrite.
- The audit suite runs against a production build (`next build` + `next start`), never
  the dev server — the dev overlay pollutes console checks and differs in rendering.
- Contrast checking must resolve colours in-browser; Tailwind emits `oklab()` for alpha
  backgrounds and a naive parser reports false failures
  (`docs/learnings/stage-implementation-101.md`).
- Hooks must stay fast: staged-files only on pre-commit; the full suite belongs to
  pre-push and CI.
- TDD per `CLAUDE.md`: for already-correct code the evidence is green + a teeth check
  (break the source, watch only the new test fail, restore).

## Architecture

### Tooling

- `prettier` + `eslint-config-prettier` as devDependencies; `.prettierrc` with
  `singleQuote: true, semi: false`; `format` / `format:check` scripts.
- `lefthook` with `web/lefthook.yml`: pre-commit runs prettier (write, staged) and
  eslint (staged); pre-push runs `tsc --noEmit` and `vitest run`.
- `.nvmrc` (22) at `web/`, matching CI's node version — the scaffold never got one.

### Unit tests

- `vitest` (node environment; no DOM needed for the data layer).
- `web/src/lib/stages.test.ts` — invariants: exactly 18 stages; `num` and `slug`
  unique; slug starts with its `num`; every group non-empty; helpers return correct
  members; every `ready: true` slug is registered in `STAGE_CONTENT`
  (`web/src/features/stage-content.ts:9`).
- `web/src/lib/terms.test.ts` — known key returns the entry; unknown key returns
  `undefined`; every entry has non-empty `short` and `full`.
- `test` script added; `pnpm test` finally exists.

### Audit suite

- `@playwright/test` replaces the bare `playwright` devDependency
  (`web/package.json:24`); `web/playwright.config.ts` uses `webServer` to build+start
  the production app.
- `web/e2e/audit.spec.ts` covering home + stage 01's six steps:
  - overflow: `scrollWidth <= clientWidth` at 320, 768, 1024, 1440, 2560
  - touch: interactive elements ≥44px below `lg`, excluding `sr-only` and elements
    inside horizontal scrollers
  - contrast: WCAG AA over every distinct text/background pair, both themes, term
    panels expanded first; colours resolved via computed style in-browser
  - console: zero errors on a fresh context
- `test:e2e` script.

### CI

- `.github/workflows/ci.yml` (repo root; `working-directory: web`):
  - `verify` job: checkout → pnpm/node (from `.nvmrc`, pnpm cache) →
    `install --frozen-lockfile` → `format:check` → `lint` → `tsc --noEmit` →
    `vitest run` → `build`. `timeout-minutes: 10`, concurrency cancel-in-progress.
  - `audit` job (needs `verify`): install chromium, run the Playwright suite, upload
    the report on failure, `timeout-minutes: 15`.
- Branch protection is configured on GitHub after push; the exact required checks are
  documented in the plan's final task.

## Testing

| Target | Test |
|---|---|
| `stages.ts` invariants | unit (vitest) |
| `terms.ts` lookups | unit (vitest) |
| Overflow / touch / contrast / console | audit suite (@playwright/test) |
| Each new test's teeth | break source deliberately, confirm only that test fails |
| The gate itself | push a deliberately broken commit on a scratch branch once CI is live, confirm red |

## Verification

1. `pnpm test`, `pnpm test:e2e`, `pnpm format:check`, `pnpm lint`,
   `pnpm exec tsc --noEmit`, `pnpm build` all green locally.
2. Teeth-check evidence recorded for unit tests and one audit check (temporarily set
   `--faint` to the old failing `#74849a`, watch contrast fail, revert).
3. A commit with a formatting error is rejected by pre-commit; a failing test is
   rejected by pre-push.
4. CI green on the branch after the user pushes.

## Documentation updates

- `reference/stack.md:39-40` — Quality rows become ESLint + Prettier (with the
  react-hooks reasoning) and keep Lefthook; Biome noted as the non-Next alternative.
- `docs/04-project-setup.md` — scaffold flags and section 3 rewritten for
  ESLint + Prettier; Lefthook section unchanged.
- `CLAUDE.md` — Commands section gains `test`, `test:e2e`, `format`; the "no test
  suite" warning is replaced; Verification expectations point at the committed suite.
- `KICKOFF.md` — environment notes updated (there *is* a `pnpm test` now).
- `docs/tracker.md` — TD-1, TD-4, TD-5, TD-6, TD-8 closed with evidence; decisions
  recorded (ESLint kept: D-22; suite committed: D-23). `docs/task.md` — W-4 ☑, P-5 ☑.

## Risks

| Risk | Mitigation |
|---|---|
| Baseline format commit churns every file and buries history | One dedicated `style:` commit containing only formatting; nothing else in it |
| Prettier fights an ESLint stylistic rule | `eslint-config-prettier` disables the overlap; `format:check` in CI catches drift |
| Audit suite is slow or flaky in CI | Runs against a prod build with retries=1; chromium only; 15-minute timeout |
| `stage-content` import drags React into node tests | Vitest handles TSX; if it becomes heavy, assert against the exported keys only |
| Contrast test false-positives on `oklab()` | Colours resolved in-browser per the learning guide; the false-alarm case is a regression test for the checker itself |

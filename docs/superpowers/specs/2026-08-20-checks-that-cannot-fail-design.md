# Checks that cannot fail — closing TD-32, TD-27, TD-26 and TD-35

**Date:** 2026-08-20
**Branch:** `fix/checks-that-cannot-fail`
**Debts closed:** TD-32, TD-27, TD-26, TD-35

## Problem

Four open debts share one shape. Each is a check that reports success without having
evaluated the thing it names, and `docs/tracker.md` already rates all four **High** for
that reason rather than for the size of any individual fix.

- **TD-32** puts one in the reader's hands. `docs/04-project-setup.md:260`, the section
  whose whole promise is that a missing environment variable stops the app, tells the
  reader nothing about how to confirm it. The obvious method, blanking `SESSION_SECRET` in
  `.env.local` with `pnpm dev` still running, returns **200**, because Turbopack does not
  re-evaluate `env.ts` when the file changes. The reader concludes the validation is wired
  and the only thing proved is that a module was cached.
- **TD-27** invalidates local verification. `web/playwright.config.ts:18` sets
  `reuseExistingServer: !process.env.CI` against a `pnpm build && pnpm start -p 3100`
  command, so the first `pnpm test:e2e` of a session builds and every later one measures
  that first build. It cost the doc-gaps round two panels sitting over threshold for five
  tasks while the gate called them passing.
- **TD-26** leaves the contrast sweep green about surfaces it never reaches. Its headline
  defect was fixed in `e058333`; three ways to be silently green survive, and the guard
  that would notice the next one was never written.
- **TD-35** leaves the console check unable to see React's development warnings, because
  it runs against a production build where React has stripped them. `RevealList` warned on
  every `pnpm dev` load for the length of a branch while the suite reported 14/14, twice.

Fixing them together is cheaper than fixing them apart. The round that just ended spent
itself on this exact failure mode and wrote the diagnosis down while it was fresh
(`docs/learnings/quality-gates-101.md`, *"Seven tests that could not fail, in one round"*).

## Goals

1. `docs/04-project-setup.md` §5 teaches the reader a check that can fail, and teaches the
   reason rather than the ritual.
2. `pnpm test:e2e` fails loudly when the server it is about to measure predates the working
   tree, instead of reporting numbers that describe a tree that no longer exists.
3. The audit's sweep is held to a property that fails when a selector change stops it
   opening things, and the three named coverage holes are closed.
4. React's development warnings have somewhere to be caught, on a command a stage round is
   told to run.
5. Every assertion added here is teeth-checked: broken deliberately, observed failing,
   restored. A round about vacuous checks that ships one has failed at its subject.

## Non-goals

- **Putting the dev-mode console spec in CI or the pre-merge gate.** Decided with the user.
  A dev server in CI costs a second build and risks the overlay making the merge gate
  flaky. It becomes a documented step in the stage-round checklist, the standing that
  `pnpm test:prod` already has. The cost is honest: it depends on someone remembering.
- **Flipping `reuseExistingServer` to `false`.** `docs/tracker.md`'s TD-27 entry names both
  options and prefers the assertion, because the assertion also catches a `pnpm start` left
  running by hand, which the flag cannot. Reusing a server is also what makes local
  iteration bearable, and this round has no interest in making the suite slower.
- **Asserting a fixed expandable count**, which is what TD-26's `Closes with:` line asks
  for by name. Rejected on evidence written after that entry:
  `web/e2e/count-expandables.mjs` records the count at 108 on 2026-08-03 and 140 on
  2026-08-13 with no defect in between, and says in its own header that the number is not a
  constant to assert against. A pinned count stales the way a step name in prose stales.
  The property replacing it is stated in Architecture.
- **Fixing `docs/11-ci-cd.md`'s stale action pins** (TD-31). Adjacent, tempting, and
  belongs to 11's own correction round, which will read the two workflows and the caching
  story this branch never opens.
- **Any W-6 content work.** The two untracked files under `reference/` stay untracked.
  This round verifies W-6's *status* line and changes nothing about its content.

## Constraints

- `main` is production. This branch merges to `develop`, and only after the user says so.
- TDD is the iron law. Every change here has a failing test first, including the doc change,
  which gets a doc-invariant test in the shape of `ai-plays.test.ts`.
- The existing audit must not get slower in CI in a way that changes its character. The
  state-sequence rework in TD-26 multiplies the number of DOM states the contrast sweep
  measures; if the runtime moves materially, the measured before and after go in the report
  and the design gets revisited rather than quietly accepted.
- `web/AGENTS.md` applies: read `node_modules/next/dist/docs/` before writing framework
  code. Playwright's own behaviour is verified by running it, not by recall.

## Architecture

### TD-32 — one paragraph in §5, and a test that it is there

`docs/04-project-setup.md` §5 gains a paragraph after the `.env.example` material stating
what a reader must do to see the validation fire: restart the dev server. It records the
observed behaviour on both sides. Turbopack logs `Reload env: .env.local` and goes on
serving 200 off the cached module; the same edit after a restart gives HTTP 500 carrying
Zod's `too_small` thrown from `env.ts` at module evaluation. Then the reason the entry
insists on, which is the half that transfers: **a validation that runs once at module
evaluation can only be re-tested by causing another module evaluation.** The cheap phrasing
teaches a ritual; the reason survives into the next framework.

The recorded observation comes from stage 04's fix wave and has never been re-run. A round
about checks that cannot fail should not put an unexecuted verification ritual into a
document, so the paragraph is written against a throwaway Next scaffold in the scratchpad
that reproduces both outcomes first. `web/` has no `env.ts` of its own to test against,
which is why the scaffold is needed rather than the app. It is throwaway and is not
committed. D-50 is the standing decision this follows.

### TD-27 — a freshness assertion with two parts

Both parts run before the suite measures anything.

1. **Identity.** The build id in the served HTML must equal `web/.next/BUILD_ID` on disk.
   Verified as observable: `BUILD_ID` reads `g2-pemUBl9fqzpomy2WPn` and that string appears
   in the prerendered `.next/server/app/index.html` and in `.next/static/`. This catches a
   server started from an older build and left running by hand, which is the case the
   config flag cannot see.
2. **Freshness.** `web/.next/BUILD_ID`'s mtime must be newer than the newest source file
   under `src/`, `e2e/` and the config files. This catches TD-27's actual failure: run one
   builds, you edit source, run two reuses run one's server and nothing rebuilt.

The scan excludes `.next`, `node_modules`, `test-results` and `playwright-report`. Under
CI, `reuseExistingServer` is already `false` so the build is always fresh and both
assertions pass. That makes CI the place this check is least useful and the place it is
most likely to be mistaken for coverage. The teeth check therefore has to be run locally.

Placement is `globalSetup`, on the assumption that Playwright starts `webServer` before
`globalSetup` runs. **That ordering is checked empirically as the first step of the task,
not assumed.** If it is the other way round, the fallback is a dedicated spec that the
other audit tests depend on rather than a helper with a hidden side effect.

### TD-26 — the sweep becomes a state sequence, and the guard becomes a property

`openExpandables` (`web/e2e/audit.spec.ts:49`) opens everything it can in one pass and the
checks measure the result once. Three of TD-26's four open items are consequences of that
shape.

It is replaced by a generator of **DOM states**. Each state has the maximum set of
disclosures open that can be open at once; a single-open accordion group contributes one
state per member; `AuthPaths`' inner tabs (`web/src/features/architecture/AuthPaths.tsx:107`,
which use `aria-selected` rather than `aria-expanded` and so were never opened at all)
contribute one state per tab. The contrast and touch-target checks run over each state.

The guard TD-26 asks for is then expressible without a constant:

> On every audited page, every disclosure control inside `[role=tabpanel]` was observed
> open in at least one state.

That fails when a selector change stops the sweep opening things, which is what the entry
wants, and it cannot go stale as content grows, which a pinned count would.

Fourth item: the contrast collector's skip at `web/e2e/audit.spec.ts:267`
(`el.children.length`) means a colour set on a container is only ever seen through its
leaves. It is replaced by "the element has at least one direct non-empty text node". A
container holding both text and elements is then measured on its own colour; a container
whose children all override theirs is still skipped, correctly, because that colour is
genuinely never shown to anyone.

Widening a sweep is how this repo found real failures before, and it may again. If it
surfaces AA or touch-target failures, few get fixed on this branch and many get a debt
entry with the count. That call is the user's, made when there is a number to look at.

### TD-35 — `pnpm test:dev-console`

A new `web/playwright.dev.ts`, modelled on the existing `web/playwright.prod.ts` and its
three-deliberate-differences comment. `webServer` runs `pnpm dev` on port 3101, clear of
`pnpm dev`'s own 3200 and the audit's 3100, with `reuseExistingServer: false` because a dev
server is cheap to start and a shared one reintroduces TD-27 in a different costume.

The spec walks the same `auditPages` set the audit does, because the RevealList incident
survived twice when every manual check loaded one page. Partial coverage is the failure
being fixed here, so it fails on console output matching React's own development warning
prefixes.
Matching by prefix rather than by allowlist is what the TD-35 entry asks for; the dev
overlay's own noise is excluded by not matching, and anything ambiguous is resolved by
looking at real output rather than by guessing at it.

Runtime is expected to be worse than the audit's, because Turbopack compiles per route on
first load. The measured number goes in the report. If it is bad enough to stop anyone
running it, that is a finding about the design, not a detail.

## Testing

| Change | Failing test first | Teeth check |
|---|---|---|
| TD-32 | Doc test asserting §5 tells the reader to restart, shape of `ai-plays.test.ts` | Remove the sentence, watch only that test fail |
| TD-27 identity | Point the suite at a server from a different build | Restore, confirm green |
| TD-27 freshness | Touch a source file with a live reused server, run the suite | Rebuild, confirm green |
| TD-26 property | Break the sweep's selector, watch the guard fail | Restore, confirm the guard is what failed |
| TD-26 container colours | A fixture with a failing container colour and passing children | Correct the colour, confirm it passes |
| TD-35 | An unkeyed list rendered on a swept page | Revert, confirm the spec goes green |

Every row's RED output is pasted raw into its task report with a statement of why the
failure was the right one. A green run alone proves nothing here, and this branch has less
excuse than most for forgetting that.

## Verification

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` all exit 0 on
  the branch, and again on the merged result before it is called done.
- `pnpm test:dev-console` runs clean, with its runtime recorded.
- `node e2e/count-expandables.mjs` run before and after the TD-26 rework, against a
  freshly built server, with both numbers in the report. The count is expected to change;
  what matters is that the direction is explainable.
- Test counts re-derived rather than quoted. The last measured figure is 648 across 80
  files, and quoting it without running it would be this document's own subject.

## Documentation updates

- `docs/tracker.md` — close TD-32, TD-27, TD-26 and TD-35 with evidence; new decisions for
  the property-over-count choice, the dev-console command's standing outside the gate, and
  the freshness assertion; a `Deferred:` list.
- `CLAUDE.md` — `pnpm test:dev-console` in the commands block, and the verification
  expectations section amended so "zero console errors" says which build it means.
- `docs/learnings/quality-gates-101.md` — a section on the property-versus-constant
  distinction, which is the transferable half of TD-26's close.
- `docs/task.md` — the two statuses `KICKOFF.md` flags as unverified: W-6's pause condition,
  expired twice over, and W-3.1b's "app port pending W-3.2" against a W-3.2 that merged
  2026-08-03. Both are checked and corrected to whatever is true.
- `KICKOFF.md` — project state and next round's scope.

## Risks

- **The TD-26 rework surfaces a pile of real contrast failures.** Likely enough to plan
  for. Handled by counting first and deciding second, with the user.
- **The state-sequence rework makes the audit materially slower.** Measured before and
  after; if it is bad, the sequence is capped per page and the cap is recorded as a known
  limit rather than left silent, because a silent cap reads as full coverage.
- **The dev-console spec is flaky.** The TD-35 entry already documents one narrow blind
  spot: Fast Refresh patching an open tab does not fire the warning, and a reload racing
  the rebuild can read clean. The spec loads pages cold, which is the case measured to fire
  reliably across three cold-server runs.
- **The freshness assertion becomes the round's own vacuous check.** The sharpest risk
  here, because it passes trivially in CI. It is not believed until it has been watched
  failing locally against a genuinely stale server.

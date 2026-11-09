# JavaScript sectioned study expansion implementation plan

**Goal:** replace compressed JavaScript lookup rows with seven focused teaching
sections and nine local activities, within the user's selected 6–8-section range.

**Architecture:** additive section metadata drives a server composer using the
existing Stepper and activity disclosures. The existing sheet data remains the
web/Markdown source. Ordinary sheets retain their current presentation.

**Stack:** existing Next.js 16, React 19, TypeScript, Tailwind, Vitest and Playwright.

**Design:** [selected expansion and sources](../../../reference/javascript-source-research.md#sectioned-expansion-selected-2026-11-05).

**Execution:** one implementer in a fresh **GPT-6.1 Sol / High** session, following
the executing-plans skill and D-99. Use focused TDD for behavior and one independent
final branch/content/page review. No per-task agent/review ceremony is required.

## Constraints and starting point

- Original feature tip: **bd72e70031d13d7e47dcfa9e083d6c396bbc18dc**; application
  **0dcfe2da558e13f5d4b2c194bd6a023809043697**. Start from this plan's committed
  documentation branch tip and record its exact SHA in implementation records.
- Create `feat/javascript-study-sections`; preserve the original implementation.
- Keep `/reference/javascript`, Languages membership, **26/30** drawn sheets on
  this branch, **18/18** stages, current dependencies and both design themes.
- Run commands from `web/` using supported Node **22.23.4**; the default shell
  Node **22.19** is unsupported. Use the installed v22.23.4 binary directory on PATH.
- Literal teaching examples use strict CommonJS and explicit host context.
  No top-level await, timing promises or interview-frequency rankings.
- No merge/push/deploy. Integration requires the user's separate approval.

## Review focus

- Missing or duplicated section/activity references must fail guards rather than
  omit teaching or render an activity twice (task 1).
- Later panels must be reachable and audited, including direct hashes and browser
  back/forward; stage defaults and inner tabs must still behave correctly (task 2).
- Visible examples and hidden answers must come from the data, without leaking
  another section's answer/disclosure state after navigation (tasks 1–2).
- Valid falsy input, empty arrays and detached/arrow receivers must preserve the
  documented result; scheduling claims stay within their host boundary (task 3).
- Added depth must remain readable within the panel budget in both themes and
  at narrow widths, including open solutions and keyboard focus (tasks 3–4).

## Task 1: section metadata and generated study order

**Files:** `web/src/lib/cheatsheets/types.ts`, `render.ts`, `index.test.ts`,
`render.test.ts`; add a small shared resolver only if both consumers need it.

**Interface:** optional `Section.study: { id: string; label: string;
hint: string; activityIds: string[] }`. Existing sections and activities remain
canonical. Study sheets annotate every section; non-study sheets annotate none.

- [ ] Observe focused failures for local activity placement, missing/duplicate/
  unassigned IDs, unsafe/duplicate hashes and partial study metadata. Test a
  valid multi-section fixture and an ordinary sheet with global activities.
- [ ] Implement the additive contract and Markdown traversal. Emit each assigned
  activity once, after its section's teaching. Preserve literal text/code fencing
  and every activity field. Plain sheets retain their existing traversal.
- [ ] Confirm focused tests pass and non-JavaScript sheet bodies are unchanged.
  The shared generated introduction may change to acknowledge study material.

## Task 2: accessible section composition and audit coverage

**Files:** proposed `web/src/components/StudySheet.tsx` and render test;
`Cheatsheet.tsx`, `Cheatsheet.test.tsx`, `Stepper.tsx`, `Stepper.test.tsx`,
`web/e2e/audit-pages.ts`, `javascript.spec.ts`, relevant `audit.spec.ts` helpers.

**Interfaces:** `StudySheet({ sheet }: { sheet: Cheatsheet })` builds `Step[]`
from metadata. `Stepper({ steps, ariaLabel = 'Stage steps' })` accepts the
optional label; the study composer passes `JavaScript sections`.

- [ ] Observe meaningful render failures for a visible worked example, local
  prompt, initially hidden answer, reveal/re-collapse, section switching and no
  duplicated bottom practice block. Retain ordinary-sheet and stage tests.
- [ ] Implement the server composer with vertical teaching units, using existing
  Stepper/SheetActivities. Preserve sources outside panels and use stable IDs.
- [ ] Add failing browser coverage for all rendered section IDs in audit discovery,
  later-panel direct links, back/forward and keyboard Home/End/arrows. Then extend
  discovery using the reference rail's rendered IDs, keeping ordinary reference
  URLs and stage discovery. Scope selectors so nested tabs add no phantom panels.
- [ ] Verify changing sections does not display a prior activity's revealed answer.
  Confirm stage default accessible names/history remain unchanged. Extend panel
  weight coverage to the study reference; do not loosen existing thresholds.

## Task 3: expanded teaching and actual-example validation

**Files:** `web/src/lib/cheatsheets/javascript.ts`, relevant actual-sheet render
tests, `reference/examples/javascript-published-checks.cjs`, generated
`reference/cheatsheets.md`, source record and `web/PATTERNS.md` for the new contract.

- [ ] Author the seven sections/nine activities in the design table. Every section
  needs an outcome, mechanism, explained worked example, common mistake,
  representative explanation prompt and local practice. Retain the four existing
  exercises and their host/error caveats, expanding their teaching context.
- [ ] Extend the checker against actual published code, with controlled inputs
  for new examples. Include valid falsy defaults, TDZ, receiver repair, empty
  collection behavior and numeric sorting without input mutation. Keep rejection/
  completion fixtures deterministic and report the actual assertion count.
- [ ] Run supported Node with `--unhandled-rejections=strict` on the checker.
  Regenerate with `pnpm gen:cheatsheets`; confirm all 29 other sheet bodies are
  unchanged. Update source citations/contract documentation and run a humanizer
  editing pass on substantive new prose.
- [ ] Inspect all panels at 1024×768: default panels fit four screens. Use existing
  disclosure for supporting detail when needed, preserving visible teaching and
  prompts. Inspect open solutions, themes, keyboard focus and representative
  320/768/1440px layouts; verify no page overflow or console errors.

## Task 4: final gate, independent review and recovery handoff

- [ ] Run the completed app tree once through `pnpm format:check`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test --maxWorkers=2`, `pnpm build` and `pnpm test:e2e`.
  Diagnose failures; keep assertions and timeouts meaningful. Run
  `pnpm test:dev-console` once for changed shared React composition/navigation.
- [ ] Obtain one independent **GPT-6 Astra / Low** review of the actual diff from
  **8ff159f** (original implementation plus expansion), with extra attention to
  the delta after **bd72e70**. Cover teaching accuracy and the delivered page.
  Identify the exact reviewed commit; resolve blockers and rerun invalidated checks.
- [ ] Update task status, one concise tracker evidence entry and KICKOFF with
  branch/commit, actual checks, limits, unresolved scope and implementation session.
  Return to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended
  **GPT-6 Astra / Low**. The coordinator reads that session before relying on it.

If interrupted, preserve the last completed checkbox, current branch/commit,
failing command and remaining checks in KICKOFF. Records-only edits may retain
identified application evidence for unchanged inputs. Separate merge approval
remains required after review.

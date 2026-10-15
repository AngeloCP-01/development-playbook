# Stage 08 security reference sheet: execution evidence

**Branch:** `feat/security-reference-sheet`, cut from `develop` at `5e25a13`.
The sheet is unmerged, unpushed, and undeployed.

## Test-first record

The first tests failed for the expected missing sheet, diagram export, and
original-diagram caption:

```text
FAIL |unit| src/lib/cheatsheets/index.test.ts > stage 08 exposes a drawn security lookup with the cross-user invoice audit and its original diagram
AssertionError: expected [] to deeply equal [ 'security' ]
FAIL |unit| src/lib/cheatsheets/render.test.ts > generated reference markdown includes the original security diagram with its text equivalent
AssertionError: expected '# Cheatsheets...' to contain '![User B is denied access...'
FAIL |dom| src/components/Cheatsheet.test.tsx > labels an original diagram as original instead of gathered
TestingLibraryElementError: Unable to find an element with the text: Original diagram.
Test Files 3 failed (3)
```

The registry's fixed drawn-sheet list then failed until `security` was added;
`pnpm gen:cheatsheets` refreshed the generated Markdown. Focused GREEN:

```text
Test Files 3 passed (3)
Tests 40 passed (40)
```

Teeth check: changing the read probe to **allow** User B caused only the new
Stage 08 sheet test to fail. The failure was for the expected cross-user denial:

```text
FAIL |unit| src/lib/cheatsheets/index.test.ts > stage 08 exposes a drawn security lookup with the cross-user invoice audit and its original diagram
AssertionError: read must test the other customer's invoice: expected false to be true
Test Files 1 failed (1)
Tests 1 failed | 21 passed (22)
```

Restoring **deny** returned the focused suite to 40/40. A production-page
mobile check then found that the diagram needed horizontal scrolling without
an instruction. The hint test failed for missing text, then for the hint being
below the diagram. The reviewer found that the hint also needed to remain
visible through the 640–673px overflow interval. After the changes, the
component suite passed **16/16**.

## Final verification

| Check | Result |
|---|---|
| `pnpm test` run alone | **1406/1406** across 184 files |
| `pnpm lint` | exit 0, no warnings |
| `pnpm typecheck` | typegen and `tsc --noEmit` exit 0 |
| `pnpm format:check` | all matched files formatted |
| `pnpm build` | 50 static pages generated, including `/reference/security` |
| `pnpm test:e2e` | **18/18** against a production build: both-theme contrast, responsive overflow, touch targets, console, route hashes and panel height |
| SVG XML | `xmllint --noout` exit 0 |

The sandboxed E2E build could not fetch Google Fonts; the run with network
access passed. That full E2E run preceded the final scroll-hint wording and
breakpoint change; the final build, component test, and targeted 320px
production-page check covered that change. One later run of Vitest alongside
lint and formatting timed out 14 unrelated DOM tests under heavy load. Running
Vitest alone passed 1406/1406.
The final 320px production page loaded the SVG (`naturalWidth: 640`), showed
the scroll hint, and had no page overflow. The SVG was visually inspected at
640 × 780 and in the production sheet.

The read-only whole-branch reviewer found stale W-6 counts and records
(Important), then a hint breakpoint and wording issue (Minor). Both were
fixed. Final verdict: **Ready to merge, review clean after fixes**.

## Deferred

- The three gathered OWASP captures remain unregistered as plates. The new
  original diagram is the sheet's displayed figure.
- Real authenticated-app testing; the invoice case is a teaching simulation.
- W-6.4 glossary/stack surfacing and the five language sheets.
- Merge into `develop`, push, and production promotion. The merge needs a
  separate user decision under the repository's branch rule.

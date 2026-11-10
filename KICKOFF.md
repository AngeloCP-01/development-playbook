# Kickoff: correct the Node.js & Express review findings

Updated 2026-11-10. Follow [AGENTS.md](AGENTS.md), D-99/D-100/D-110.
Reviewed **976198b...67b8cb6** on `feat/node-express-study`. Application **972edf9**;
later browser/test fixes **4489cd5**, **aaed08e**. No merge or push.
Twelve panels/38 topics/38 activities are present; 28/31 references, 18/18 stages.
The coordinator found six P2s; passing counts do not establish the missing teaching.

## Correction scope and acceptance

**NE-R1 — demonstrate module fundamentals.**
`web/src/lib/cheatsheets/express/modules.ts:39` only imports `basename`; exports,
CommonJS, module caching and cycle behavior are named but not worked through.
The design requires those mechanisms in modules-and-packages. Add a small visible
multi-file ESM/CJS example with the necessary files/imports, explained output and
cache/cycle trace. Add meaningful prediction/repair practice and execute the actual
published files in their declared module context. Avoid a duplicate backend or a
test that merely prints a basename. Keep interop claims specific to Node22.

**NE-R2 — teach a real next page and filter.**
`express/input.ts:138` only validates `limit` and slices from zero. Confirmed HTTP:
`limit=1` and `limit=1&offset=1` both return b1; a filter parameter is ignored.
Implement a stated bounded filter and offset/page or cursor contract, with stable
ordering, successive pages and empty/end results. Show request/result reasoning;
verify malformed/repeated/filter/page inputs and preserve caller data. No real DB
or production pagination platform is needed. Coordinate NE-R5 in the same lesson.

**NE-R3 — explain a concrete CSRF defense.**
`express/security.ts:139` only demonstrates a GET CORS header; practice names token/
origin policies without explaining one. Add a sourced request/state-table contrast:
state the cookie/origin conditions, show why blocking response reading can still
allow an authenticated mutation, then how one selected defense accepts/rejects it.
A bounded illustrative request trace is sufficient; no login/token system required.
Do not claim Node fetch demonstrates browser enforcement. If executable browser
behavior is claimed, test actual browser origin/cookie conditions. Explain CORS,
CSRF and SameSite conditions in plain language and provide a transfer activity.

**NE-R4 — assert Express dev-console traversal completeness.**
`web/e2e/dev-console.spec.ts:71–91` traverses Express, but exact observed topic/
solution ID checks remain DSA-only. Compare Express observed IDs against authored
section rows/activity assignments, retaining JS/DSA coverage. Prove omitting one
Express ID fails; merely calling forEachPanelState is insufficient because it can
stop and return a partial observation without asserting it.

**NE-R5 — pin nested-query behavior.**
`express-published.test.ts:45–46` does not cover nested-looking query keys. Replacing
the displayed parser `simple` with `extended` passes every existing list assertion,
but `?limit[value]=1` changes from 200 to 400. Define and test the intended nested/
unknown-key policy alongside repeated/invalid scalar queries. Align displayed
configuration, validation, explanation and tests; assert the actual response.
Do not impose 200 merely to preserve today's accidental omission of that key.

**NE-R6 — SIGTERM test must observe drain and cleanup.**
`express-published.test.ts:193–196` accepts an immediate successful exit. Coordinator
replaced only `stop().then(() => process.exit(0), () => process.exit(1));` with
`process.exit(0);`: both existing probes exit 0 with empty stderr. With an injected
cleanup marker, real code emits `dependency cleanup`, mutant emits nothing.
Add an isolated child test with readiness/shutdown handshakes, an in-flight request
and observable dependency cleanup. Assert request completion/cleanup before exit;
reject the immediate-exit mutation. Retain startup-failure, repeated-stop and
bounded stuck-cleanup coverage. No timing-only race or weakened timeout.

All six are bounded corrections within the selected design. Extend existing
subsections or split only where teaching weight warrants it. Keep current hashes
unless a measured split requires a recorded change. Preserve the thirty other
sheet bodies. Regenerate Markdown from canonical data and rerun affected checks;
run the required completed-tree web gate with the project's fresh/retained policy.
No new design, per-task agent or independent-review round is needed; return the
actual correction diff/evidence for focused coordinator recheck.

## Review evidence and provenance

Bounded reviewers, both **GPT-6.1 Sol / High**:
`/root/express_standards_review` (NE-R4/R5/R6) and
`/root/express_spec_review` (NE-R1/R2/R3). Coordinator read actual source and
independently reproduced pagination/parser/SIGTERM witnesses and live teaching.
No algorithm/server malfunction is established by the SIGTERM coverage finding.

Fresh focused Vitest: **66 tests / 5 files**, exit 0, covering actual Express
published code, data/render/Markdown and ledger. Thirty other generated bodies
unchanged. Live isolated browser: light 320 modules, dark 768 CORS/CSRF, light 1440
lists; themes correct, keyboard disclosure opening, hidden solutions, no overflow,
console warnings or page errors. These checks do not establish missing lesson depth.

Read implementation thread **01a1c38c-5adb-7540-b46d-9638153021bc** and raw logs:
initial Sol High then Sol Medium. Retain identified full **1756/240**, later **90**
focused, format/lint/typecheck/build, dev-console **1/1**, broad production **50/52**.
The two broad failures were exact registry counts, corrected to 28/31; final affected
browser cases **22/22** passed. No new full gate is claimed for review records.
Application/generated diff after reviewed **67b8cb6** remains unchanged.
Closing records: tracker-ledger **2/2**, six KICKOFF local links and
`git diff --check`, all exit 0. Humanizer editing pass applied to the handoff.

This feature started from **976198b**, omitting policy commit **1757d11** from the
documentation branch. Review records restore its D-110 AGENTS/active design/plan
assignments and decision verbatim; historical evidence is preserved. This does
not change the runtime model of an existing session.

## Next session

Correct NE-R1–NE-R6 in a fresh user-selected **GPT-6.1 Sol / Medium** session.
Start from this feature branch's exact committed review-handoff tip (confirm git),
retaining branch `feat/node-express-study`. Return branch/application/records SHAs,
actual commands/results, unresolved issues and root session reference to coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6.1 Sol / High**.

[Design](docs/superpowers/specs/2026-11-10-node-express-design.md),
[plan](docs/superpowers/plans/2026-11-10-node-express.md),
[sources](reference/node-express-source-research.md),
[task](docs/task.md) and [tracker](docs/tracker.md).
Preview: http://localhost:3200/reference/express. Preserve user servers and the
unrelated untracked `.pnpm-store/`; keep it out of commits.
No merge/push/promotion. Other language sheets and advanced follow-ons stay deferred.

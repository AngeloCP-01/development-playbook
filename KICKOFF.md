# Kickoff: recheck the Node.js & Express corrections

Updated 2026-11-10. Follow [AGENTS.md](AGENTS.md), D-99/D-100/D-110.
Branch **feat/node-express-study**; correction application **e852170**, starting
from review handoff **fa724bb**. The user authorized continuing in the existing
implementation session. No merge, push or promotion.

## Corrected scope

- **NE-R1:** six visible `.mjs`/`.cjs` files demonstrate ESM exports/live bindings,
  CommonJS exports/cache identity and a partially initialized cycle. Prediction
  practice changes the cache/cycle conditions. Tests execute the actual files in
  temporary directories; the displayed-code classification guard includes them.
- **NE-R2/R5:** bounded `limit`/`offset`/`tag` contract, filter before sorting/slicing,
  subsequent and empty pages, unknown/nested/repeated/invalid inputs rejected,
  frozen caller fixtures preserved. A test-only HTTP probe pins the actual
  simple-parser shape; switching the published parser to extended is detected.
- **NE-R3:** sourced CSRF request/state table explains when a cookie-authenticated
  mutation succeeds despite blocked response reading, then accepted/missing/wrong-
  session synchronizer-token outcomes and SameSite conditions. Original transfer
  practice and independent semantic render assertions. This is an illustrative
  protocol trace, not an executed browser enforcement claim.
- **NE-R4:** the actual dev-console sweep compares Express observed topic/solution
  IDs with authored rows/assignments using the same assertion as DSA. Tests prove
  omission of every Express topic or solution fails (12 panel tests, 76 omissions).
  JavaScript traversal is preserved.
- **NE-R6:** isolated child readiness/in-flight/draining/completion/cleanup/exit
  protocol. SIGTERM must clear readiness, finish the released request and run
  acknowledged dependency cleanup before exit 0. Immediate-exit mutation fails.
  Existing startup-failure, repeat-stop and bounded stuck-cleanup tests remain.

All **12 panel hashes / 38 topics / 38 activities** remain. Registry **28/31**,
stages **18/18**; other **30 generated sheet bodies** unchanged against fa724bb.
No new backend, reader runner, authentication/DB system or dependency change.
Actual runtime remains **Node 22.23.4**, exact dev-only **Express 5.3.0**.

## Evidence and limits

Fresh correction-tree checks at **e852170**: format/lint/generated-route typecheck
exit 0; **1779 unit/DOM tests / 241 files** passed. Focused published/data/render/
ID-guard/Markdown checks **87/87**, including real loopback requests and mutations.
Dev-console **1/1** passed using `pnpm test:dev-console
--config=/tmp/ne-dev.config.ts`: temporary read-only server targeting of the existing
**3200** preview avoids Next's single dev lock and preserves user servers. The
checked-in configuration is unchanged. Production build completed as part of
`pnpm test:e2e --workers=1`; the full production browser gate passed **52/52**,
exit 0 (12.1 minutes). All gate results are fresh for application **e852170**.

Preview checks: both themes at **320/768/1440**, all nested topics/solutions **2/2**
passed. The expanded CSRF panel first measured **3132.55px**; replacing the old
repeated CORS model/result table with a concise result paragraph retained all new
teaching. The unchanged all-topic/default-panel/keyboard/history height test then
passed **1/1** at **1024×768**, budget **3072px**. No weakened assertions/timeouts.
A humanizer editing pass kept the prose concrete and removed the redundant table.

Observed failure evidence: Express omission guard **12 red → 12 green**; old list
failed the new filter/page contract; old module topic lacked required displayed
files; immediate-exit signal mutant failed **child exited before draining**.
Initial concurrent gate attempts hit `test-results` removal during lint and
`.next/types` removal during typegen; both checks passed after build/startup settled.
Full command outputs are under `/tmp/ne-*.log`; source findings and detailed
correction evidence are in [the source record](reference/node-express-source-research.md).
Retain the identified application checks for subsequent records-only edits.

## Coordinator return

Recommended next task: **focused NE-R1–NE-R6 correction recheck**, **GPT-6.1 Sol /
High**, coordinator **01a1bedf-bdad-7b72-ba40-9b5406807d43**. Read implementation
thread **01a1c38c-5adb-7540-b46d-9638153021bc** before relying on its evidence;
review **fa724bb...e852170** and the actual page. No additional independent-review
round was added; this returns the bounded correction diff for coordinator acceptance.

[Design](docs/superpowers/specs/2026-11-10-node-express-design.md),
[plan](docs/superpowers/plans/2026-11-10-node-express.md),
[task](docs/task.md), [tracker](docs/tracker.md).
Preview remains **http://localhost:3200/reference/express**. Preserve the unrelated
untracked `.pnpm-store/`. Integration into develop needs separate user approval;
other language sheets and advanced follow-ons remain deferred.

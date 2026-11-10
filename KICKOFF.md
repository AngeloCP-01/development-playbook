# Kickoff: review the Node.js & Express study reference

Updated 2026-11-10. Follow [AGENTS.md](AGENTS.md), especially D-99/D-100
and D-110. W-6.3u.2 is implemented on `feat/node-express-study`, starting at
**976198b**. Application commit **972edf9**; browser locator correction **4489cd5**, exact registry-count corrections **aaed08e**.
No merge, push or promotion. Integration into develop needs separate user approval.

Reader outcome: explain Node execution, repair a small Express API and defend its
input, identity, error, state and lifecycle boundaries. `/reference/express` now
has twelve panels, 38 topics and 38 local activities, with a hidden capstone repair.
All declared hashes are preserved. Registry: **28/31** drawn, **18/18** stages;
Python, Java and Spring Boot remain placeholders. Thirty other generated sheet
bodies compare unchanged against 976198b.

Read the [source record](reference/node-express-source-research.md),
[design](docs/superpowers/specs/2026-11-10-node-express-design.md),
[plan](docs/superpowers/plans/2026-11-10-node-express.md), and
[completion evidence](docs/tracker.md). Source is in
`web/src/lib/cheatsheets/express/`; page and Markdown share it.

Verification uses Node **22.23.4**, Express **5.3.0** (exact devDependency).
Published-code harness: **47** checks; every displayed code location classified,
37 executable examples including the capstone repair, two commented sketches.
No reader runner/backend, external credentials/service, real DB or token verifier.
Cookie/CORS checks establish headers, not browser security enforcement.

Checks completed: format, lint and route typecheck exit 0; **240 files / 1756
unit+DOM tests** passed. Final capstone parser correction: **90 focused tests**
passed afterwards. Dev-console **1/1** passed including Express nested states.
Preview browser: both themes × 320/768/1440, all topics/solutions passed; separate
keyboard/history/default-and-open panel height test passed (four-screen budget).
The broad production audit passed **50/52**; its only failures were stale exact
DSA/JavaScript registry-count assertions. Both now expect 28/31. A fresh final
production build and **22/22 DSA/JavaScript/Express browser regressions** passed,
exit 0. Retain the unaffected broad results; fresh focused checks cover the later
capstone code literal and all corrected tests. No full-suite rerun was needed for
records-only changes.

Independent **GPT-6.1 Sol / High** reviewer `/root/final_review` inspected the
actual diff/content and live capstone. Fixed its findings: spoiled capstone and
missing repair, incomplete code-location guard, absent 401 challenge, imprecise
revocation wording and independent error/state/reset rendering checks. Focused
regressions pass; ownership and duplicate-send corruptions are detected. Humanizer
pass kept the technical prose neutral and concrete.

Failed attempts: sandbox denied HTTP sockets (rerun with access); concurrent
builds collided; preview held Next's single dev lock (stopped only our preview,
ran dev-console, restored preview); initial full suite exposed one stale drawn
registry expectation; height test had an ambiguous topic/solution name locator
(fixed to exact disclosure ID). No assertions/timeouts were weakened.

Running preview: **http://localhost:3200/reference/express** (HTTP 200).
Implementation thread: **01a1c38c-5adb-7540-b46d-9638153021bc**. Return to
coordinator **01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended
**GPT-6.1 Sol / High**, for actual-diff/evidence acceptance. Read this implementation
thread before relying on its evidence. Advanced Node/Express follow-ons and the
other language sheets remain separate. Leave the unrelated untracked pnpm store
out of commits.

# Kickoff: Python assessment and proposed design

Updated 2026-11-13. Follow [AGENTS.md](AGENTS.md), especially D-99/D-100/D-110
and separate integration approval.

User requested: push first, then assess/design Python with the same teaching
goal as Node.js & Express. **Develop is pushed at c768af4**. Pre-push
`pnpm typecheck` and `pnpm test` passed: **1841 tests / 242 files**. Main was not
promoted. Pushing develop does not trigger this repository's main/PR-only CI gate.

Current branch: `docs/2026-11-13-python-study-assessment`, based on **c768af4**.
Only research/design/handoff records change. Python remains a placeholder:
**28/31** references drawn and **18/18** stages. Java and Spring Boot also remain
undrawn. The Node merge and retained final app evidence live in the W-6.3u.2
completion rows in [tracker](docs/tracker.md); the prerequisite-navigation minor
remains deferred. No historical implementation thread was newly reviewed here.

Reader outcome: explain Python mechanisms, predict state, implement/repair a
small program, test failures and defend changed constraints in an interview.
Use connected reasoning, not definitions followed by an output answer key.

- [Single source record](reference/python-source-research.md): primary Python/PSF/
  PyPA sources, version limits and original example proposals. Examples have not
  been executed in this assessment.
- [Proposed design](docs/superpowers/specs/2026-11-13-python-study-design.md):
  fourteen initial panels, 45 topics/owned activities, at least ten coding repairs;
  split where teaching/layout requires. Reuse current study/disclosure patterns.
- [Task W-6.3u.3](docs/task.md)
  and decision D-113 in [tracker](docs/tracker.md).

Next: review/select the design, recommended **GPT-6.1 Sol / High**, then prepare
the compact implementation plan. This is the coordinating conversation; keep it
open and return implementation results here. No implementation session was
started or active model setting claimed.

After design/plan selection, start a fresh user-selected **GPT-6.1 Sol / Medium**
implementation session on `feat/python-study-sheet` from the committed handoff.
Implementation reports its branch/commit, actual commands/results/limits and
session reference. One final independent **GPT-6.1 Sol / High** review must inspect
the actual source/page and teaching transfer, in addition to regression results.
Return live names/objects and async lessons for user depth feedback.

Acceptance: one canonical web/generated-Markdown source; 29/31 drawn after Python,
other thirty generated bodies unchanged; actual displayed Python examples and
solutions verified with complete manifest coverage and explicit maintained
interpreter provisioning. Target 3.12+ compatibility; local 3.12.7 was inventoried,
not established as a current patch or used as release evidence. Check maintained
3.12 and current stable 3.15, version-sensitive process/GIL/task behavior, errors,
cleanup and bounded execution. Final web gate, dev-console, affected theme/width/
keyboard states, meaningful render coverage and teaching-depth review follow the
design. Research-only records require content/link and ledger checks.

Deferred: design selection, compact plan, implementation, integration, Java/Spring
Boot, backend frameworks, browser execution/scoring/progress and main promotion.
The initial push authorization covered develop at c768af4; this assessment branch
has not been pushed or merged. Preserve user servers and unrelated scratch.

Assessment checks: tracker-ledger **2/2**, local links **178 targets / 5 documents /
zero missing**, proposed table **14 panels / 45 topics**, and `git diff --check`,
all exit 0. Humanizer pass/self-review applied. These checks cover this records
change; the push-hook results above cover c768af4. No Python snippet was executed.

# Kickoff: PY-R2 closed; align PY-R1 input with its walkthrough

Updated 2026-11-19. Follow [AGENTS.md](AGENTS.md), including separate merge approval.

**Focused coordinator recheck (2026-11-19):** reviewed **cc30b1c...7262249**,
application **59c00b7**, actual implementation thread/transcript and current page.
**PY-R2 is resolved. PY-R1 is executable but remains open for one trace mismatch.**

The displayed books.jsonl is ordered River:2, river:3, Hill:0. Its existing trace
instead begins River:2 then Hill:0, followed by the river:3 duplicate. Running the
actual summarize function on prefixes of the displayed file yields river:2,
then river:5, then river:5/hill:0. The table's first intermediate state
river:2/hill:0 therefore does not occur for that input.

Recommended correction: reorder the displayed input to **River:2, Hill:0, river:3**
to preserve the authored trace. Update the rendered-input expectation and prove
that the actual function's first-two-record state matches the table, rather than
checking only final hill:0/river:5 output. Keep the entry case using displayed
input, all program/trace/practice content and the 3072px budget.

**Next task recommendation:** finish PY-R1 alignment in a fresh user-selected
**GPT-6.1 Sol / Medium** session, then focused **Sol / High** coordinator recheck.
Use this committed handoff on `feat/python-study-sheet`; return correction commit,
actual checks/limits and session to **01a1d36c-4998-7d31-91c4-6b41e9694eba**.
Integration remains unauthorized. No application source was changed by this review.

Fresh recheck at **7262249**: **113 tests / 6 files**, exit 0 on maintained
conventional CPython **3.12.16**, covering checker/published, actual page render,
Python data/disclosures and generated Markdown. Four isolated capstone states
(light/dark at 320/1024) confirm visible input before solutions, keyboard
reveal/re-collapse, no console/overflow errors and **3064px** at 1024x768.
The first browser helper accidentally closed a retained-open disclosure on its
second state; corrected to read its actual button state before opening, then all
four states passed. The current preview does contain the correction.
The source-backed prefix reproduction establishes the remaining trace mismatch.
Inspected raw implementation outputs support retained **1952/247**, **89/89 on
3.15.2**, production build and Python browser **5/5** below; no full gate repeated.

**Correction application: 59c00b7**, from review handoff **cc30b1c**, on
`feat/python-study-sheet`. No merge or push. Develop remains **c768af4**;
main promotion remains the user's.

- **PY-R1 implementation (partially accepted):** the capstone publishes labelled UTF-8 `books.jsonl` beside its
  Python files. The entry case materializes this exact displayed input; its hidden
  setup fixture is removed. Render and displayed-files-only tests failed first,
  then passed. The complete program, validator, trace and practice remain intact.
- **PY-R2 resolved by coordinator recheck:** the original package case retains `-m books.main` success and
  adds direct-script failure requiring the exact intended ImportError. A coverage
  guard failed for the missing variant before the variant was added.

**Fresh checks on the correction tree:** format, lint, generated-route typecheck;
**1952 tests / 247 files** on CPython **3.12.16**; checker/published **89/89** on
**3.15.2**; production build **M6kiy1wt5VI8YDKwCyJQR** and focused Python browser
suite **5/5**. An additional **16 states** cover capstone/package in both themes
at 320/768/1024/1440, visible input before solutions, keyboard reveal/re-collapse,
clean console and no document overflow. Capstone **3064px**, package **2711.4px**
at 1024×768, below 3072px. Setup wording was tightened without removing any rule,
program, trace or practice; no extra panel or renderer was needed.

Canonical data and generated Markdown agree. Other thirty generated sheet bodies
are byte-identical to c768af4. Current inventory: **15 panels / 45 topics /
45 activities / 16 solutions**, **87 classified locations** (71 program/input
locations, 16 fragments); 29/31 references and 18/18 stages. No shared behavior changed,
so the prior full-site audit/dev-console evidence remains limited to unchanged
areas/behavior. Hosted CI is still unrun.

The reprovisioned conventional GIL-enabled runtimes are under
`/private/tmp/python-review-runtimes/runtime-3.12.16/bin/python3.12` and
`runtime-3.15.2/bin/python3.15`. Exact builds/limits are in the
[source record](reference/python-source-research.md). Local 3.12 still omits unused
TLS modules. Tests install/download nothing.

- [Corrected capstone preview](http://localhost:3100/reference/python#report-capstone)
- [Package lesson](http://localhost:3100/reference/python#modules-and-environments)
- [Names and objects](http://localhost:3100/reference/python#names-and-objects)
- [Asyncio](http://localhost:3100/reference/python#asyncio)
- [Task](docs/task.md), [tracker evidence](docs/tracker.md),
  [design/measurements](docs/superpowers/specs/2026-11-13-python-study-design.md),
  [original plan](docs/superpowers/plans/2026-11-13-python-study.md).

**After the remaining PY-R1 alignment:** focused **GPT-6.1 Sol / High** recheck,
coordinator **01a1d36c-4998-7d31-91c4-6b41e9694eba**. Implementation session
**01a1d3ec-7518-7d72-a49d-9b12a3cf3fde**. Reader depth feedback and any integration
decision follow that recheck; no acceptance or merge approval is inferred.

Deferred minor: plain-text prerequisite references use named rail tabs. Java/Spring
Boot, frameworks, browser execution/scoring, highlighting/renderer changes and
main promotion remain outside scope. No Windows/free-threaded/TLS/deployment/
throughput/learner-outcome claim. Prior review/evidence history stays in the tracker.

Closing records: ledger/source-citation checks **5/5**, local links **211 targets /
seven documents / zero missing**, whitespace and pre-commit formatting/lint pass.
These records leave the tested application 59c00b7 unchanged.

Closing recheck-record checks: tracker-ledger **2/2**, local links **178 targets /
three documents / zero missing**, and `git diff --check`, exit 0. Humanizer editing
pass applied to the new handoff prose. Application remains **59c00b7**.

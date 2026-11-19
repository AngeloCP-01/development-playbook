# Kickoff: PY-R1 input/trace alignment fixed; focused recheck

Updated 2026-11-19. Follow [AGENTS.md](AGENTS.md); integration needs separate approval.

**Application correction: 0bc7010**, from review handoff **504170f**, on
`feat/python-study-sheet`. **PY-R2 remains closed.** The remaining PY-R1 alignment
is implemented and verified; focused coordinator acceptance is pending. No merge
or push. Develop remains **c768af4**.

The displayed `books.jsonl` now follows its walkthrough: **River 2 → Hill 0 → river 3**.
The program, validator and table are unchanged. The new regression reads the
actual displayed input, runs the published `summarize` on one-, two- and three-line
prefixes, and compares its intermediate totals to both hand-derived expectations
and the authored table cells. It failed on the old first-two-record result
`{river:5}`; now it proves `{river:2, hill:0}` before the duplicate raises river to 5.
The rendered-input expectation and generated Markdown follow the same order.

**Fresh checks on 0bc7010:** **94 tests / five files** on maintained conventional
CPython 3.12.16 (published programs, render, data/disclosure and Markdown checks);
**70/70** published checks on 3.15.2; scoped format/lint, generated-route typecheck
and production build **KZn2NpROQYiWG9RP37I1W**. Four capstone states (both themes,
320/1024) verify visible ordered input/table, keyboard reveal/re-collapse, clean
console and no overflow. Height remains **3064px** at 1024×768, below 3072px.
Other thirty generated bodies match c768af4 byte for byte. No shared behavior or
program logic changed; previous full-suite/global-audit evidence remains tied to
its recorded trees and unchanged scope. Hosted CI remains unrun.

[Live aligned capstone](http://localhost:3100/reference/python#report-capstone).
The production preview 3100 and existing dev 3300 remain running. Runtimes:
`/private/tmp/python-review-runtimes/runtime-3.12.16/bin/python 3.12` and
`runtime-3.15.2/bin/python 3.15`; exact builds/limits in the
[source record](reference/python-source-research.md). Local 3.12 omits unused TLS
modules. Tests download/install nothing.

**Next task recommendation: focused PY-R1 alignment coordinator recheck,
GPT-6.1 Sol / High**, coordinator **01a1d36c-4998-7d31-91c4-6b41e9694eba**.
Implementation session **01a1d3ec-7518-7d72-a49d-9b12a3cf3fde**. Then reader depth
feedback and a separate integration decision. No merge approval is inferred.
See [task](docs/task.md), [tracker](docs/tracker.md) and the
[approved design](docs/superpowers/specs/2026-11-13-python-study-design.md).

Deferred scope/limits are unchanged: plain-text prerequisite rail references,
Java/Spring Boot, framework/browser-runtime/renderer work, hosted CI and main
promotion; no Windows/free-threaded/TLS/deployment/throughput/learner-outcome claim.

Closing records: ledger/source-citation **5/5**, local links **210 targets / seven
documents / zero missing**, scoped format/lint and whitespace checks pass. These
records leave the tested application 0bc7010 unchanged.

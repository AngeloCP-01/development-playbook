# Kickoff: expand JavaScript into focused study sections

Updated 2026-11-05. Follow [AGENTS.md](AGENTS.md), D-99, D-100, D-101 and D-102.

## Reader outcome and selected scope

The user found the implemented JavaScript sheet too short and selected
**6–8 focused sections with worked examples and 1–2 activities per section**.
Teach mechanisms, trace examples and repair mistakes through stage-style
sections inside `/reference/javascript`.

The [design and source record](reference/javascript-source-research.md#sectioned-expansion-selected-2026-11-05)
recommends seven sections/nine activities: values; scope/closures;
functions/this; objects/prototypes; arrays; promises/errors; scheduling.
Each section includes an outcome, explanation, worked example, common mistake,
representative interview prompt and local activity. Keep the coverage selective.

## Starting point and implementation

- Current documentation branch: `docs/2026-11-05-javascript-study-expansion`,
  based on **bd72e70031d13d7e47dcfa9e083d6c396bbc18dc**. Record its exact committed
  tip with `git rev-parse HEAD` before starting implementation.
- Original application: **0dcfe2da558e13f5d4b2c194bd6a023809043697**, originally
  from **8ff159f5820caa18966e7358bea8dac5cc56fc69**. Preserve its feature history;
  expand it before integration. Feature branch **26/30** sheets, **18/18** stages;
  local develop **25/30** sheets.
- **Next task:** implement W-6.3u.1a in a **fresh user-selected GPT-6.1 Sol / High
  session**, creating `feat/javascript-study-sections` from the documentation tip.
  This is the D-100 handoff, not an inline implementation exception.
- Read the [compact plan](docs/superpowers/plans/2026-11-05-javascript-study-expansion.md),
  [PATTERNS](web/PATTERNS.md), [DESIGN](web/DESIGN.md) and relevant installed
  framework guides before changing APIs. Use the executing-plans skill.

## Acceptance and recovery checklist

- [ ] Add optional section study metadata; reuse Stepper with a reference-specific
  accessible label and the existing activity disclosures. Keep one content source.
- [ ] Author seven substantive sections and nine activities. Preserve the four
  existing activities with their async/host caveats; put practice in its section.
- [ ] Generate the same local section/activity ordering in Markdown. All 29 other
  sheet bodies remain unchanged; the shared introduction may acknowledge study sheets.
- [ ] Audit every rendered section hash, not just the base reference URL. Check
  direct links/history, keyboard use, both themes, representative widths, open
  solutions, clean console and default panel weight at 1024×768.
- [ ] Extend actual-published-example validation on Node **22.23.4** in strict
  CommonJS; keep deterministic error/completion fixtures and scheduling bounds.
- [ ] Run behavior TDD, focused checks, the final app gate/dev-console once and
  one independent final content/branch/page review. Report exact commits/results.

Use `env PATH="/Users/angelito/.nvm/versions/node/v22.23.4/bin:$PATH" pnpm …`
from `web/`; default-shell Node **22.19** remains unsupported. Do not stop the
user's existing :3200 dev server to clear a build/dev lock. If interrupted,
record the last completed task, failing command and remaining checks here.

## Evidence and return

Original **0dcfe2d** evidence remains in the [tracker](docs/tracker.md) and
[source record](reference/javascript-source-research.md#implementation-evidence-2026-11-05):
1,624 tests/232 files, 57-page build, 37 production cases with an isolated
timeout retry, dev-console 1/1 and published checker 4 activities/20 assertions.
These checks do not validate the expansion. Implementation session
**01a1a908-ddb6-7f91-bb4d-7834839b62e8** was read before using its handoff.

Fresh handoff checks on the documentation tree descended from **bd72e70**:
`pnpm test src/lib/tracker-ledger.test.ts --maxWorkers=1` **2/2**, local
links/anchors **140 targets / 5 files**, and `git diff --check`, all exit 0.
Self-review/humanizer pass applied. No web/generated/example inputs changed;
the original application evidence is retained, with no app suite/build rerun.

Return branch/commit, actual checks, unresolved issues and the implementation
session reference to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**,
recommended **GPT-6 Astra / Low**. The coordinator reads that session and reviews
the actual diff. Separate user approval is required for a no-ff merge into
develop. No merge, push or promotion has occurred. Other four sheets, a complete
course, browser execution, scoring, persistence and new dependencies are deferred.

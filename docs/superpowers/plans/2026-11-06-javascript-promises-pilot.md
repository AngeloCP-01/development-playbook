# Runtime-neutral JavaScript Promises pilot

**Goal:** make the accepted teaching prototype visible at
`/reference/javascript#async`, with a visible opening and a connected worked
lesson. Remove Node-version/CommonJS setup wording from the JavaScript sheet.

**Source:** [learner prototype](../specs/2026-11-06-javascript-promises-mini-lesson.md)
and [source/evidence record](../../../reference/javascript-source-research.md#promise-mini-lesson-source-check-2026-11-06).

**Starting point:** **8b6156f**, accepted app **4ff8f8e**. Record this plan's exact
committed tip, then create `feat/javascript-promises-lesson`. D-100 fresh
**GPT-6.1 Sol / High** implementation applies unless the user explicitly grants
the pending one-task continuation exception. Coordination/review: **GPT-6 Astra / Low**.

## Scope and contract

- Keep eight main sections/hashes, the fourteen existing activity IDs, the
  original four exercise implementations, 26/30 sheets and 18/18 stages.
- Port the connected lookup story, supplied executor arguments, promise states,
  returned-chain ownership, then/await comparison, rejection/cleanup trace,
  aggregation-before-practice, model interview answers and transfer-test guide.
- Show a useful problem/outcome introduction before subsections. Keep optional
  detail expandable. Preserve the existing async topic IDs when their subject
  remains; add coherent topics as needed, rather than preserving a topic count.
- Teaching data stays in TypeScript and generates the portable Markdown. The
  draft remains an editorial prototype, not another maintained live source.
- Reader copy targets modern JavaScript. Remove Node version, `.cjs` and
  CommonJS instructions from the whole JavaScript sheet, including module labels
  and activities. Retain explicit strict-script/module context and truthful host
  scheduling assumptions. Runtime-neutral does not mean every host has identical APIs.
- Use a standard-Promise-based simulated callback fixture for the live lesson;
  hide its implementation after its contract so it does not teach Promise syntax
  before introducing promises. No network or Node-only globals in reader code.
- Module examples use totals.js/main.js as ECMAScript modules. Verification may
  configure a temporary module package; that is not learner-facing setup.
- Actual runtime/version evidence remains in developer checks and records.
  Keep the seven non-pilot sections' teaching intact apart from context cleanup.
- No code runner, scoring, persistence, dependencies, deployment or broad rollout.

## Task 1: ordered teaching representation and single-source rendering

**Files:** `web/src/lib/cheatsheets/types.ts`, `study-sections.ts`, `render.ts`,
new `web/src/components/TeachingBlocks.tsx` and render tests, `StudySheet.tsx`,
focused generator/resolver/composer tests and `web/PATTERNS.md`.

**Interface:** optional `Section.introduction: TeachingBlock[]` and
`Row.teaching: TeachingBlock[]`. Existing what/example/when behavior remains.
TeachingBlock has a stable id and one of four forms:
paragraph(text); code(label, code); table(label, columns, rows);
interview(question, answer, optional weakAnswer/followUp).

- [ ] Observe meaningful failing render/generator tests for a visible introduction,
  interleaved explanation/code/table order, actual table headers/cells, literal
  code, interview answer structure, safe Markdown fencing/escaping and legacy absence.
- [ ] Implement the narrow typed contract and server renderer using existing
  tokens. Use labelled semantic tables with keyboard-scroll containers, explicit
  code tab stops and appropriate h4 subheadings inside h3 topic bodies.
- [ ] Render the same order into Markdown. Guard malformed/duplicate block IDs,
  ragged/empty tables and orphan teaching data rather than silently dropping it.
  Confirm non-pilot data and all 29 other sheet bodies remain unchanged.

## Task 2: publish the lesson and remove runtime coupling

**Files:** `javascript.ts`, meaningful actual-sheet render/data tests,
`reference/examples/javascript-published-checks.cjs`, generated reference output.

- [ ] Port the narrative into actual teaching blocks, retaining one lookup through
  the different forms and both outcomes. Explain Promise.resolve-based fixture
  scheduling as an implementation detail after teaching the contract.
- [ ] Preserve validation/recovery material and original exercises; place interview
  answers and aggregation before asking the corresponding transfer questions.
  Keep copy original and run the humanizer editing pass.
- [ ] Replace learner-facing Node/CJS labels throughout this sheet with precise
  language-level context. Keep strict-mode-sensitive this examples correct;
  update module filenames/imports consistently and preserve host-boundary teaching.
- [ ] Extend the checker against actual published block code, not the frozen draft.
  Verify callback return, executor timing, chain values, both display-name forms,
  lookup/transformation/cleanup failures, exact caller output, partial outcomes
  and the transfer fixture. Keep all still-relevant existing example coverage.
- [ ] Run real totals.js/main.js with temporary ESM configuration. Verify the
  intended import error and repaired output. Clean only the checker-created dir.
- [ ] Regenerate Markdown/highlighting only through their commands. Add a focused
  guard against Node-version/CommonJS setup copy returning to JavaScript content.

## Task 3: browser proof, final gate and review

**Files:** relevant `web/e2e/javascript.spec.ts` and development-console coverage;
actual final app plus task/tracker/KICKOFF.

- [ ] Check the visible introduction, every new topic/body, table/code scrolling,
  nested answers and main-history reset. Re-query audit children as before.
  Assert proper headings, focus clearance and no overflow in both themes at
  representative 320/768/1440px widths. Preserve four-screen defaults/single-topic
  limits; split a teaching unit at a real seam if required, without size exceptions.
- [ ] Verify the standard-JavaScript Promise fixture/consumer examples in an
  actual browser as well as the recorded command-line runtime. Exercise real
  module source through a browser module loader when checking runtime neutrality;
  test-only route fixtures must not become application routes or a reader runner.
- [ ] Run completed-tree format, lint, route typecheck, full tests, production build
  and audit once; run dev-console once for changed shared output. Diagnose failures
  without weakening assertions or timeouts. Keep the user's :3200 server intact.
- [ ] Obtain one independent final content/branch/page review, **GPT-6 Astra / Low**,
  emphasizing the delta after **4ff8f8e** and the teaching-depth goals, not counts.
- [ ] Leave a running preview/link for the user to inspect. Record branch/commit,
  actual checks/limits and session reference; return to coordinator
  **01a18acc-3b54-7202-92f3-404cc94fd0ad**. Separate merge approval remains required.

For recovery, record the last completed task, current branch/commit, failing
command and remaining checks in KICKOFF. Later records-only changes may retain
identified application evidence for unchanged inputs. Do not merge or push.

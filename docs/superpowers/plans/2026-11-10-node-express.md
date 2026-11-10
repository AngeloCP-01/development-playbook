# Node.js & Express implementation plan

**Execution:** use `superpowers:executing-plans` in one fresh user-selected
**GPT-6.1 Sol / Medium** session, following D-99/D-100 with D-110 model assignments.
One independent final
**GPT-6.1 Sol / High** content/page/branch review; no per-task agents or reviews.

**Goal:** fill the existing Express placeholder with a substantive Node.js and
Express fundamentals/interview study reference, with explained examples and
attempt-first practice throughout.

**Architecture:** one canonical `Cheatsheet` composed from content families,
rendered through existing study/teaching/activity components and Markdown export.
Tests execute actual displayed Node/Express snippets outside the product page.

**Stack:** existing Next/React/TypeScript, JavaScript lessons, Node 22.23.4,
Express 5.3.0 as an exact devDependency, Vitest and Playwright.

**Design:** [Node.js & Express](../specs/2026-11-10-node-express-design.md).
**Sources:** [primary-source record](../../../reference/node-express-source-research.md).
Read [AGENTS](../../../AGENTS.md), [PATTERNS](../../../web/PATTERNS.md), design
and sources before editing. Start from the exact committed documentation tip in
KICKOFF/git and create `feat/node-express-study`; docs base is **e28401e**.

## Global constraints and review focus

- Preserve `/reference/express`; title **Node.js & Express**, Languages group.
  Complete all twelve initial panels/38 topics from the design, splitting only
  when measured teaching weight requires it. Record changed hashes explicitly.
- End at 28/31 drawn/registered sheets, 18/18 stages, three placeholders. Other
  thirty generated sheet bodies stay unchanged. No stage/content port duplication.
- Every core topic has an explained worked example, common mistake, interview
  answer/follow-up and owned local activity. Use additional examples where needed.
  Counts are design targets; do not substitute terse inventory rows for lessons.
- Reuse renderers. No backend, runner, scoring, persistence, real credentials or
  external service. Keep Express in test dependencies only. Do not upgrade Node,
  Next, React or tooling. No merge, push or promotion.
- Tests consume the published code and preserve authored practice reasoning.
  Cover module-context ordering, dropped/late errors, denied ownership, malformed
  input and response lifetime. Avoid exact timing and silently skipped snippets.
- Distinguish process-local demos from durable/distributed guarantees; tests and
  prose must not turn fixture authentication into a production recommendation.

## Task 1: registry, actual-sheet rendering and the runtime families

**Files:** create `web/src/lib/cheatsheets/express.ts`, family modules
`web/src/lib/cheatsheets/express/runtime.ts`, `async.ts`, `modules.ts`;
create `web/src/lib/cheatsheets/express.test.ts`,
`web/src/components/ExpressSheet.test.tsx`; modify registry `index.ts`,
`planned.ts`, relevant count/discovery guards and reference-page render test.

**Interfaces:** root exports `nodeExpress: Cheatsheet`, slug `express`, title
`Node.js & Express`, group `Languages`, no stage tether. Each family exports a
named `{ sections: Section[]; activities: SheetActivity[] }` object. Root concatenates
arrays and sources; authored explanations survive unchanged. Metadata and IDs
match the design. No executable Node/Express imports in these production modules.

- [ ] Add meaningful failing tests against the current placeholder: registered
  Express has no study content; named panel/example/practice cannot be rendered.
  Observe assertion failures rather than relying on a missing import.
- [ ] Replace only Express in `PLANNED`, register the root and author the first
  three complete families. Keep interim content status truthful until all ship.
- [ ] Render the registered sheet via `CheatsheetView`, observe actual trace cells,
  literal code, model interview answer and hidden/revealed/re-collapsed reasoning.
  Assert a representative explanation independently of the composed object.
- [ ] Check discovery/order/count/remaining placeholders; maintain final exact
  expectations rather than deleting count guards. Run focused unit/DOM tests.

## Task 2: real published-code harness and I/O/HTTP/Express fundamentals

**Files:** add exact Express devDependency to `web/package.json` and lockfile;
create `web/src/lib/cheatsheets/express-published.test.ts` plus test-only helper
`web/src/lib/cheatsheets/express-published-checks.ts` if needed; create family
modules `express/io.ts`, `http.ts`, `flow.ts`, `input.ts`; extend root and tests.

**Interfaces:** harness selects literal code by stable teaching/activity ID,
explicit prerequisite IDs and `.mjs`/`.cjs` context. Isolated children run with
the repo's Node and resolvable dev-only Express. HTTP fixtures expose an app
factory and bind only loopback port 0; fixtures close servers/children/temp files.
The test-only manifest classifies every code block and owns assertions, not a
duplicate implementation. Follow the design's allowed fragment classifications.

- [ ] Build the manifest/coverage guard test-first: adding unclassified executable
  code or omitting a prerequisite must fail meaningfully; fix the minimum harness.
  Keep broken examples explicitly labelled and test their intended failure safely.
- [ ] Author files/streams, native HTTP, Express flow and input/response families.
  Walk through the recurring API and show each needed import/fixture dependency.
  Keep stream/path/abort explanations precise and independently understandable.
- [ ] Execute authored runtime examples: separate CJS/ESM queues, dependent versus
  concurrent work, EventEmitter order/cleanup, package/config boundaries, UTF-8
  byte counts, fs cleanup and stream success/failure/backpressure. Use observations
  and synchronization, not sleep-duration assertions.
- [ ] Execute real HTTP examples: method/status/headers/body, mounted routes,
  middleware traces, named wildcard/optional routes, query/body separation,
  invalid JSON/type/range/limit, response termination, deterministic pagination.
  Assert absent and repeated query inputs and denied malformed shapes.
- [ ] Ensure timeout/cancellation demonstrations terminate and release resources.
  Distinguish outbound abort from an incoming response timeout. Never let fixture
  cleanup hide a failed assertion or leave a listener holding the test process open.
- [ ] Extend actual-sheet tests to these sections and run focused harness/render/
  data/generator checks. Commit a coherent slice; no per-task review round.

## Task 3: errors, state, security, testing and operations

**Files:** create `express/errors.ts`, `state.ts`, `security.ts`, `testing.ts`,
`operations.ts`; complete root, published-code manifest/checks and render/data tests.

- [ ] Author every remaining topic with the full teaching contract. Cover the
  capstone's explain/repair/test/changed-constraint task; keep its answer hidden.
  Include AsyncLocalStorage as a small request-correlation example where useful,
  distinguishing context propagation from safe logging/redaction.
- [ ] Verify returned/awaited rejected Promise forwarding and the repaired callback/
  detached-error cases; test ordinary 404 separately from 500, trusted error
  classification and headersSent delegation. Cover missing response, late error
  and duplicate-send traps without hanging or crashing the parent test process.
- [ ] Test all principal/owner cases against actual displayed authorization code:
  missing principal, wrong owner, permitted owner and absent resource. Show trusted
  fixture setup explicitly. Do not derive authentication from an unverified header.
- [ ] Test the concrete cookie/CORS/proxy/validation examples and clearly state
  which observations prove HTTP headers versus browser enforcement. A browser
  claim needs a real cross-origin/browser test; otherwise keep it a sourced
  explanation without pretending Node fetch enforces browser CORS/CSRF policies.
- [ ] Demonstrate the await-state race and limitations of local stores/limits.
  Label transaction/idempotency repository sketches; no production DB/auth system
  or unexplained dependency may enter the examples. Teach duplicates and retries
  without claiming local memory provides distributed exactly-once behavior.
- [ ] Verify startup failure, idempotent bounded shutdown and resource cleanup in
  isolated children/fixtures. Use signals/handshakes rather than timer races.
  Test failure cases, not only successful HTTP responses.
- [ ] Prove a meaningful middleware-order or ownership-authorization corruption
  is detected; restore source. Keep assertions sensitive to either branch.
- [ ] Apply humanizer once to substantial prose. Verify all 38 topic IDs and
  activity ownership, then run actual-data/render/published-code/generator checks.
- [ ] Regenerate `reference/cheatsheets.md` with `pnpm gen:cheatsheets`; compare
  all thirty other generated bodies unchanged. Update source record only for
  changed factual findings or actual executable-example evidence.

## Task 4: delivered-page verification, review and handoff

**Files:** create `web/e2e/express.spec.ts`; extend
`web/e2e/dev-console.spec.ts`; update task/tracker/KICKOFF. Existing audit discovery
and nested-state utilities should work without production/shared refactoring.

- [ ] Compare rendered rail hashes with declarations and audit-discovered paths;
  visit every topic and activity solution, recording expected versus observed IDs.
  Extend dev-console's nested-state condition for Express while retaining JS/DSA.
- [ ] Verify direct links, Back/Forward, keyboard rail/code/table navigation,
  focus visibility and solution reset/re-collapse. Check both themes and
  320/768/1440px, with representative long open solutions.
- [ ] Measure every default panel and one-topic-open state, solutions closed, at
  1024×768 against the four-screen budget. Split at a real seam if needed; update
  IDs/design records/tests consistently. Do not remove explanations for a count.
- [ ] Run final `pnpm format:check`, `pnpm lint`, `pnpm typecheck`,
  `pnpm test --maxWorkers=1`, `pnpm build`, `pnpm test:e2e --workers=1`,
  plus `pnpm test:dev-console` once. Preserve user servers and settings; document
  port overrides and restore temporary configuration. Diagnose failures before
  changing checks. No deployed-site claim from local checks.
- [ ] Obtain one independent final **GPT-6.1 Sol / High** review of actual diff,
  sources and live page, including depth/security/version boundaries and test
  sensitivity. Resolve blockers; rerun only checks invalidated by later edits.
- [ ] Leave a working preview and compact handoff: feature/application/records
  SHAs, topic/hash status, actual runtime/dependency versions, checks/counts/exits,
  failed attempts/limits, fresh versus retained evidence, reviewer and root thread
  references. Return to coordinator **01a1bedf-bdad-7b72-ba40-9b5406807d43**.
  No merge or push; integration requires a separate user decision.

## Recovery checklist

At each session boundary record starting/current branch and commit, completed
families, remaining topic/code IDs, manifest coverage and actual example results.
Keep unexecuted examples labelled; a passing subset cannot complete this delivery.
The twelve-panel structure is a starting design, not permission to ship a partial
page or a reason to shrink the fundamentals. Three other language sheets remain
deferred. Advanced follow-ons include deep V8/libuv internals, native addons,
full OAuth/OIDC/provider setup, database-driver tutorials and distributed systems.

# Node.js & Express study reference

Selected 2026-11-10. The user requested the same review/interview approach as
DSA, mandatory fundamentals, many examples and enough subsections to cover the
subject properly. D-109 records that direction. The structure, version baseline
and example architecture below are coordinator choices within that brief.

## Reader outcome

The reader can explain how a Node process handles requests, trace asynchronous
execution, build and repair a small Express API, test failures and defend basic
security and operational choices in an interview. Explain unfamiliar terms before
using them. JavaScript fundamentals have a companion reference; link to it when
useful, but teach the Node-specific consequences here.

Interview preparation means being able to explain, predict, implement, debug and
choose an approach. Do not promise success at every interview or claim employer
frequency rankings. This is a substantial study reference, not an API inventory.
Do not squeeze it into the earlier tentative 6–10-topic budget from D-101.

Use [one primary-source record](../../../reference/node-express-source-research.md).
Local scenarios and interview prompts are original illustrative exercises.

## Product boundary

- Fill the existing `/reference/express` placeholder in Languages. Display title:
  **Node.js & Express**. Preserve the slug and existing incoming links.
- Compose a single `Cheatsheet` from family modules, using existing `StudySheet`,
  `TeachingBlock` and `SheetActivity` support. No new block kinds or renderer.
- Web and generated Markdown consume that source. Finish at **28/31** drawn/
  registered sheets, **18/18** stages and three remaining language placeholders.
  Preserve all thirty other generated sheet bodies. No new category or stage.
- This is a static teaching page, not a deployed Node backend. No reader code
  execution, progress storage, accounts, scoring, database or external service.
- Examples target Node 22-compatible JavaScript and Express 5. Validation starts
  with the repo's Node **22.23.4** and exact Express **5.3.0**. Record actual versions
  internally. Label `.mjs`/`.cjs` contexts where behavior depends on them; show
  supported-version context once rather than repeating setup in every lesson.
- Express may be an exact **devDependency** for published-example verification;
  it must not be imported into application components, routes or the content
  module's executable imports. No runtime or framework upgrade is selected.

## Teaching contract

Each core subsection connects these parts in order:

1. A concrete reader task and plain mental model, with an analogy only when it
   clarifies the mechanism. Explain its limits.
2. The input/setup contract and a small original worked example. Show imports,
   fixtures and helpers or name a preceding, visible shared fixture precisely.
3. An explained result: output, request/response transcript, event trace or state
   table. Explain why it occurs rather than only printing the answer.
4. A common incorrect approach and its consequence, followed by a correction or
   boundary. Clearly label deliberately broken code.
5. An interview question, substantive model answer and useful follow-up.
6. A local attempt-first activity with reasoning and a reference solution for
   coding tasks. Preserve authored explanations through composition (DSA-R1).

At least one worked example and one meaningful activity per core subsection is
the initial design target. Examples should vary between prediction, repair,
implementation and trade-off explanation. Add a second contrast where needed;
do not meet a count by duplicating the worked example unchanged as the activity.
The capstone is a mixed task, with the mechanism initially unnamed.

Use one small reading-list API as a recurring application, while keeping each
lesson usable on its own. Prefer tiny data sets with visible IDs and owners.
Label its in-memory store as a single-process fixture. Explain differences from
durable storage; do not present it as a production persistence recipe.

## Sections and subsection IDs

These twelve initial hashes and 38 topics define the delivery. Counts are design
choices. Split a panel at a teaching seam if measured weight requires it; record
any new hash. Do not cut core mechanisms to preserve twelve panels.

| Section hash | Subsection IDs | Required examples and reasoning |
| --- | --- | --- |
| `runtime-and-concurrency` | `node-runtime`, `loop-and-pool`, `parallel-work` | Node versus browser/framework; V8, host APIs and libuv; synchronous CPU work versus asynchronous I/O; event loop versus worker pool versus Worker threads/processes. Show why adding `async` does not move CPU work off the event loop. |
| `async-and-events` | `scheduling`, `promise-control`, `events-and-cleanup` | Labelled CJS/ESM queue traces, timer uncertainty; sequential/dependent versus concurrent work, bounded work, rejection and cleanup; synchronous EventEmitter listeners, `error` events and listener lifetime. |
| `modules-and-packages` | `esm-and-commonjs`, `package-contracts`, `configuration` | `.mjs`/`.cjs`, exports/imports, module scope/cache and cycles; package scripts, dependencies/devDependencies, lockfiles, semver and `npm ci`; environment values as strings, validation and startup failure. |
| `files-and-streams` | `buffers-and-encoding`, `paths-and-files`, `stream-backpressure` | UTF-8 bytes versus characters, safe buffer creation; async fs with explicit temporary paths and cleanup, path versus URL and path-traversal limits; stream chunks, `write()`/`drain` and `pipeline()` with errors/backpressure. |
| `http-foundations` | `raw-http`, `methods-and-status`, `deadlines-and-aborts` | Minimal native HTTP request/response and stream body; methods, safety/idempotency, status/headers, GET/POST/PATCH/DELETE, HEAD/204 bodies; outbound deadline and AbortSignal, client disconnect and server timeout distinctions. |
| `express-flow` | `app-and-router`, `middleware-order`, `routing-five` | app factory separate from listener; mounted Router and request path; ordered enter/exit trace, response/next/error and `return` distinction; params/query/body, route ordering, Express 5 named wildcard/optional syntax and query parser differences. |
| `input-and-responses` | `parsing-and-validation`, `response-contracts`, `lists-and-pagination` | Correct parser order/content type/limit, malformed JSON, object shape/type/range/allowlists; send/json/end/status/headers and duplicate-response repair; bounded list filtering/pagination, deterministic order, absent versus repeated/malformed query input. |
| `errors-and-boundaries` | `promise-errors`, `callback-errors`, `not-found-and-final-error` | Express 5 returned/awaited rejection forwarding; detached callbacks/promises require explicit forwarding, never double next; four-argument final middleware, ordinary 404 fallback, trusted error classification, headersSent delegation and safe generic 500 response. |
| `data-and-state` | `service-boundaries`, `process-state`, `atomicity-and-retries` | Route/service/repository roles and injected fixture dependencies; request-local data versus process cache/session state, races across await and multiple workers; transaction/uniqueness/idempotency concepts using a defined illustrative repository contract, no fake in-memory durability claim. |
| `security` | `identity-and-access`, `cookies-and-tokens`, `cors-and-csrf`, `proxy-and-input-defense` | Authentication versus ownership authorization with allowed/denied/no-principal tests; password hashing, sessions versus signed tokens, cookie flags/expiry/revocation and signing versus encryption; browser CORS versus authorization/CSRF; proxy trust and forwarded headers, parameterized queries/path allowlists as boundaries. |
| `test-and-debug` | `unit-and-http-tests`, `failure-matrix`, `diagnose-blocking-and-leaks` | Pure functions versus real local HTTP, isolated app fixtures and cleanup; malformed/oversized/unauthorized/missing/dependency-error cases; measure event-loop blocking versus downstream latency, memory/listener leaks, structured correlation and safe logs. |
| `operate-and-explain` | `startup-and-shutdown`, `scale-and-dependencies`, `resource-limits`, `interview-capstone` | Startup/readiness/liveness and SIGTERM draining with deadline; processes versus workers/external shared state, connection-pool limits, retries/backoff and duplicates; payload/concurrency/rate limits with explicitly scoped in-memory demonstrations; explain/repair/test the API and defend a changed constraint. |

Keep title/summary useful while collapsed: give a concrete task, not only a noun.
Each panel has a short visible orientation. Default and one-topic-open panels,
solutions closed, stay within four screens at 1024×768. Measure the long stream,
error and security topics early. Open solutions must remain readable, focusable
and horizontally scrollable for code/tables at narrow widths.

Every row uses subsection metadata; assign activities only through row
`activityIds`, exactly once. Use `<topic>-practice` as the initial activity ID and
`<topic>-example`/`<topic>-solution` for explicitly labelled code. Additional code
blocks need unique IDs. Keep authored prompt, answer and reasoning intact.

## Accuracy and security boundaries

- Explain that network readiness and worker-pool work differ; not all async work
  uses a thread, and workers do not automatically improve I/O workloads. Avoid
  universal timer-order claims, elapsed-time assertions or a frozen pool-size
  performance recipe. `Promise.all` starts no work by itself and does not cancel
  the operations whose promises it receives.
- Express 5 fulfilled promises do not automatically call `next()`. Returning from
  JavaScript is different from finishing the response. Teach middleware order and
  response lifetime with actual request assertions, including the error path.
- Set the example query parser explicitly to `simple`; test repeated/nested query
  input. The source record resolves a stale API-doc default against v5.3.0 source.
- Parsing is not validation or authorization. Require finite/bounded values and
  expected shapes. Unknown HTTP errors stay generic unless deliberately exposed;
  do not trust a caller-provided `status` field as an operational error contract.
- Security examples use a clearly labelled, injected **trusted test principal**
  or a shown verifier interface. Never authenticate from an arbitrary user-ID
  header or treat decoded JWT payloads as verified. Do not implement a password
  database, OAuth server, token verifier or homegrown cryptography in this sheet.
- Cover authentication/authorization, session/token trade-offs and browser trust
  boundaries with examples and failure cases, not unsupported production recipes.
  Set explicit proxy trust only for a stated topology; do not recommend blanket
  trust. Bound parsing and work; label in-memory limits as process-local.
- State that normalized paths and CORS headers alone are not access control.
  Introduce server-side allowlists/parameterized queries without choosing a real
  DB driver or pretending an unexecuted SQL fragment was integration-tested.
- Separate a failed request from a corrupted process. Cleanup/shutdown examples
  must be idempotent, bounded and not continue normal service after a fatal error.

## Executable-example verification

The canonical displayed code is the source under test. Do not create a parallel
algorithm/application implementation that tests pass while reader code is wrong.

Use a test-only manifest keyed by actual teaching/activity IDs. It identifies
module context, any displayed prerequisite blocks and expected observations.
Every code block is either executed or explicitly classified as a deliberate
broken example, a command/configuration fragment, or an interface-only sketch.
Classifications need a specific reason; main worked paths cannot be skipped.
Adding code without a classification fails the coverage guard. The manifest
contains harness setup/assertions, not a duplicate maintained lesson or backend.

Use child Node processes where module/scheduling/fatal-error semantics matter.
Test both CJS and ESM examples in their stated contexts, not a single VM bundle.
Keep execution bounded and clean up children, temporary files and listeners.
Use actual Express 5 with loopback port 0 for HTTP checks; close servers and
connections in `finally`. Keep integration checks in Vitest's Node project.
Tests must not contact public services or use the user's preview ports.

Assert observable ordering constraints and results rather than milliseconds:
middleware trace/status/headers/body, validation failure, all access decisions,
rejected dependency handling, 404/500 separation, duplicate-response avoidance,
stream completion/error, listener cleanup, cancellation and bounded lifecycle.
For proxy/CORS/cookie examples, assert actual headers/configuration but distinguish
that from browser security behavior; any claimed browser enforcement needs a
browser test. Fatal demonstrations run in isolated children with expected exits.
Verify at least one meaningful middleware-order or authorization mutation is
caught; retain successful/failed branch coverage where a mistake could leak data.

The tests may import dev-only Express; product source exports only teaching data.
No live endpoint is added to this Next static export. No new Next API is needed.

## Page and completion checks

Meaningful render tests use the registered sheet, read real trace cells and code,
and exercise explanation reveal/re-collapse/reset across panels. Assert critical
authorization/error/state reasoning against independent expectations, not only the
already-composed data. Data guards cover topic IDs, unique ownership, exact other
placeholder set, sources and 28/31 registry totals.

Browser checks visit every hash and nested topic/solution, direct links/history,
keyboard navigation/scrolling, both themes and representative narrow/middle/wide
widths. Extend dev-console's current JavaScript/DSA nested-disclosure condition
to include Express, with observed IDs compared to declarations. Preserve other
sheet coverage; no broad audit refactor is needed for this addition.

Run the final web gate once on the completed tree and dev-console once. Obtain
one independent final content/page/branch review with **GPT-6.1 Sol / High**.
Review explanatory depth and code/security contracts as well as presence/counts.
No separate design/plan or per-task review rounds are required by D-99.

## Handoff

Use the [compact plan](../plans/2026-11-10-node-express.md). Implementation uses
a fresh user-selected **GPT-6.1 Sol / Medium** session under D-100/D-110.
The exact start is this documentation branch's committed tip, recorded in KICKOFF/git; create
`feat/node-express-study`. Return actual diff, checks, limits and session reference
to coordinator **01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended
**GPT-6.1 Sol / High**. No merge/push/promotion is authorized by this feature brief.

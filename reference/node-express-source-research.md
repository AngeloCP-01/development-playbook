# Node.js and Express study reference: source research

Research date: 2026-11-10. Status: source assessment and teaching proposals;
no application implementation or executable-example verification.
Reader task: explain server fundamentals, trace a request and diagnose a small
Node/Express program using worked examples and local practice.

User direction: Node.js and Express selected next; fundamentals are mandatory,
with many examples and enough subsections to teach the material. The W-6.3u
starting topic/activity counts are recommendations, not a content ceiling.
This record does not rank employer frequency or promise interview readiness.

## Version and evidence contract

- Recommended execution baseline: **Node.js 22.23.4**, matching the coordinator's
  reported local runtime, and **Express 5.3.0**. This does not upgrade the repository.
- The [Node release table](https://nodejs.org/en/about/previous-releases), maintained
  by Node.js/OpenJS, lists 22, 24 and 26 as LTS on access; 20 is EOL. Its latest-LTS
  label is **26.13.0**. Do not call 22 the latest LTS or prescribe Node 18 merely
  because Express accepts it. Recheck support when implementation begins.
- The [Express support policy](https://expressjs.com/en/support/) says only the
  latest release within each supported major is supported. The official
  [Express releases](https://github.com/expressjs/express/releases) list **5.3.0**
  as latest. This was checked directly, independently of Context7's version list.
- Node's current `/api/` pages identify 26.13.0. Sources below use only longstanding
  fundamentals unless explicitly marked otherwise. Node22 process, errors and
  streams pages were separately opened. Check every selected API against Node22
  before coding; new Node26 APIs are outside this proposal.
- Context7 resolved `/nodejs/node` and `/expressjs/express`; queries confirmed
  module-context scheduling and Express5 promise-error semantics. Those results
  point at moving upstream branches, so they supplement official versioned docs.
- All sources below were accessed **2026-11-10**. Node and Express sources are
  maintained by their project contributors under OpenJS; OWASP documents are
  project guidance, not guarantees or a complete application security review.
  No images or copied third-party exercises are proposed.

## Source register

| ID | Primary source and applicable context | Finding supported |
| --- | --- | --- |
| N1 | [Node: do not block the event loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop), current Learn guide; Node22 fundamentals | Network readiness and libuv worker-pool work differ; long callbacks and long pool jobs reduce throughput. |
| N2 | [Node: event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), Node20+ timer caveat | Timer delays are thresholds; top-level timeout/immediate order is not fixed; libuv 1.45 changed timer placement. |
| N3 | [Node22 process](https://nodejs.org/docs/latest-v22.x/api/process.html), 22.23.4 | `nextTick` is legacy; CJS/ESM entry-point ordering differs; exit and uncaught-error behavior need care. |
| N4 | [Node CommonJS](https://nodejs.org/api/modules.html), 26.13.0; core behavior applies to 22 | Explicit module format, exports, resolved-filename caching and cycle caveats. Modern `require(esm)` makes absolute incompatibility claims obsolete. |
| N5 | [Node ESM](https://nodejs.org/api/esm.html), 26.13.0; core behavior applies to 22 | `.mjs`/package type, relative import extensions, `import.meta`, dynamic import and top-level await. |
| N6 | [Node worker threads](https://nodejs.org/api/worker_threads.html), 26.13.0; basic Worker/message API applies to 22 | Workers execute JavaScript in parallel; CPU work is the main fit, ordinary async I/O usually is not. |
| N7 | [Node events](https://nodejs.org/api/events.html), 26.13.0; EventEmitter fundamentals apply to 22 | Listeners run synchronously in registration order; `once`; special unhandled `error` behavior. |
| N8 | [Node22 errors](https://nodejs.org/docs/latest-v22.x/api/errors.html), 22.23.4 | Throw, callback error, promise rejection and emitter error require the matching interception mechanism; prefer stable error codes to message matching. |
| N9 | [Node Buffer](https://nodejs.org/api/buffer.html), 26.13.0; allocation/encoding APIs apply to 22 | Bytes differ from text code units; encodings and `alloc` versus uninitialized allocation. |
| N10 | [Node file system](https://nodejs.org/api/fs.html), 26.13.0; read/write/open APIs apply to 22 | Promise/callback operations use the pool; concurrent writes require coordination; handles need cleanup. |
| N11 | [Node path](https://nodejs.org/api/path.html), 26.13.0; join/resolve APIs apply to 22 | Platform differences; lexical path operations are not a filesystem authorization boundary. |
| N12 | [Node22 streams](https://nodejs.org/docs/latest-v22.x/api/stream.html), 22.23.4 | Readable/writable/duplex/transform, `write(false)` and drain, pipeline failure handling; highWaterMark is a threshold. |
| N13 | [Node HTTP](https://nodejs.org/api/http.html), 26.13.0; server/request/response APIs apply to 22 | Incoming/outgoing bodies are streams; headers precede completion; server timeouts and close methods are separate controls. |
| N14 | [Node test runner](https://nodejs.org/api/test.html), 26.13.0; basic test/assert hooks apply to 22 | Await asynchronous tests, close resources, distinguish unit checks from real request integration. Verify newer test-runner options before using them. |
| E1 | [Express middleware](https://expressjs.com/en/guide/using-middleware/), Express5 | Registration/mount order, middleware continuation and request completion. |
| E2 | [Express5 migration](https://expressjs.com/en/guide/migrating-5/), Express4 versus 5 | Named wildcards/braced optional portions; query/body changes; rejected-promise forwarding. |
| E3 | [Express error handling](https://expressjs.com/en/guide/error-handling/), Express5 | Four-argument middleware; returned rejections are forwarded; callback errors need forwarding; delegate if headers already sent. |
| E4 | [Express5 API index](https://expressjs.com/en/5x/api/), Express5 | App creation, CJS/ESM setup and minimum Node18. Index links separate API pages; E10–E12 below supply the relevant detail. |
| E5 | [Express production security](https://expressjs.com/en/advanced/best-practice-security/), current Express guidance | TLS, input handling, secure cookies, dependency maintenance and abuse protection are distinct responsibilities. |
| E6 | [Express behind proxies](https://expressjs.com/en/guide/behind-proxies/), Express5 | Trust must match deployment paths; forwarded headers become spoofable when the boundary is wrong. |
| E7 | [Express cors middleware](https://expressjs.com/en/resources/middleware/cors/), package documentation | CORS supplies browser response-sharing headers, not authentication or API access control. |
| E8 | [Express session middleware](https://expressjs.com/en/resources/middleware/session/), package documentation | Cookie holds session identifier; server stores session data; default MemoryStore is unsuitable for production and multiple processes. |
| E9 | [Express health and shutdown](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown/), current guide | Stop accepting work, finish in-flight requests, release resources on termination; health checks support routing decisions. |
| E10 | [Express object/JSON parser](https://expressjs.com/en/5x/api/express/), Express5; coordinator follow-up opened 2026-11-10 | `express.json` selects Content-Type, limits body size and defaults to strict arrays/objects. `req.body` may be undefined; its values remain untrusted. |
| E11 | [Express request](https://expressjs.com/en/5x/api/request/), Express5; coordinator follow-up | Parameters, query and body are distinct request inputs; query parsing is configurable, so validate actual types rather than assume a string. |
| E12 | [Express response](https://expressjs.com/en/5x/api/response/), Express5; coordinator follow-up | Response helpers set/send representations; headersSent identifies a committed header boundary, not proof of complete successful delivery. |
| E13 | [Express5.3.0 application source](https://github.com/expressjs/express/blob/v5.3.0/lib/application.js), Express contributors, exact tag | Default configuration sets query parser to `simple` and trust proxy to false. This agrees with E2; E11 still contains stale prose claiming `qs` by default. |
| P1 | [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), IETF; Fielding, Nottingham, Reschke; June 2022 | Sections 9 and 15 define method safety/idempotence and status meanings; retry semantics concern intended effects, not identical responses. |
| P2 | [Fetch CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol), WHATWG living standard | Browser origin/credentials/preflight rules; some disallowed cross-origin requests can reach the server even when script cannot read responses. |
| S1 | [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), living guidance | Deny by default, least privilege and validate permissions on every request, including object ownership. |
| S2 | [OWASP CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), living guidance | Cookie-authenticated mutation needs CSRF defenses; SameSite is defense in depth rather than a universal replacement for tokens/origin checks. |
| S3 | [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), living guidance | Use purpose-built password hashing, not plaintext, reversible encryption or a fast general hash. No homemade login system is selected. |

Additional sources for the coordinator's 38-subsection design, opened 2026-11-10:

| ID | Primary source and context | Finding supported |
| --- | --- | --- |
| A1 | [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), npm/GitHub, CLI11 | Lockfile-based clean install rejects package/lock disagreement; do not assume every local package-manager command has identical semantics. |
| A2 | [npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json), npm/GitHub, CLI11 | Scripts, dependency classes and version-range metadata; distinguish package metadata from runtime loading. |
| A3 | [RFC7519](https://www.rfc-editor.org/rfc/rfc7519.html), IETF; Jones, Bradley, Sakimura; May2015 | JWT claim representation; a signed token is not automatically encrypted, and decoding is not validation. A complete verification profile remains out of scope. |
| A4 | [OWASP SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html), living guidance | Parameterized queries separate data from query structure; dynamic identifiers need appropriate allowlisting. No driver integration is claimed. |
| A5 | [Node globals](https://nodejs.org/api/globals.html), current docs; basic abort/fetch APIs apply to 22 | AbortController/AbortSignal and fetch support explicit cancellation; a separate response deadline alone does not abort outgoing work. |

## Teaching sequence and worked-example proposals

The examples below are **original, illustrative and not executed**. Expected
results are reasoned from the sources, not reported test output. Each lesson
should begin with a familiar concrete situation, show small code and a trace,
then invite a prediction/debugging attempt before revealing the answer.
Section/subsection names are proposals for the coordinator to select.
### 1. Runtime and server fundamentals

Teach JavaScript language versus Node runtime versus Express framework; process,
request and response; what one event-loop thread means without claiming the
whole runtime has one thread. N1, N13, E4.

- Example: two requests share one process counter but have separate request
  objects. A new process starts with a fresh counter. Trace both lifetimes.
- Example: an `async` function performs a long synchronous loop before its first
  `await`. The loop still blocks request callbacks; the keyword does not move
  JavaScript to a worker. Ask which part must change to restore responsiveness.
- Contrast network I/O, async file reads and CPU computation: OS readiness,
  libuv pool and explicit Worker are different mechanisms. N1, N6, N10.
### 2. Modules, packages and execution context

Use ESM for ordinary lesson files and an explicit `.cjs` for comparisons.
Explain package metadata, dependency versus development tool, scripts and a
lockfile through the actual small fixture; do not invent npm behavior without
using the npm11 sources below and checking the local npm version. N4, N5, A1, A2.

- Example: export/import a formatter with an explicit relative `.js` extension.
  Compare `module.exports` with the `exports` alias; reassigning `exports` alone
  does not replace the exported object. N4.
- Example: importing a mutable module counter twice in the same process shares
  the cached instance in the stated resolution context. It is not durable data.
- Pitfall: do not say `require()` can never load ESM. Keep interop limits and
  top-level-await graphs as an advanced, version-labelled follow-on. N4, N5.
### 3. Scheduling, concurrency and work allocation

Teach stack completion, promise jobs, nextTick and timer/I/O phases by observable
ordering, not a drawing that implies all callbacks enter one universal FIFO. N2, N3.

- Example: log A, schedule a resolved-promise reaction, log B. Expected A, B,
  reaction; explain why synchronous work finishes first.
- Example: schedule promise reaction P, `queueMicrotask` Q and nextTick N at file
  top level. `.cjs`: N, P, Q; `.mjs`: P, Q, N. Run as separate entry points,
  not inside a test runner that changes the context. N3.
- Example: top-level `setTimeout(0)` versus `setImmediate`: accept either order.
  Inside the documented I/O callback case, immediate precedes the timer. N2.
- Practice: choose sequential awaits, bounded concurrency or a worker pool for
  dependent reads, many independent reads and CPU work; `Promise.all` is not a
  concurrency limit or automatic cancellation. N1, N6; verify Promise claims
  against the existing JavaScript sheet's source record before reusing them.
### 4. Errors and events

Trace synchronous throws, rejected promises, error-first callbacks and emitter
errors separately. A `try` around scheduling does not catch a later callback's
throw. N7, N8. Uncaught process failure is not a recovery strategy. N3.

- Example: listeners A and B around an emit, followed by C, yield A, B, C;
  `once` contributes only on the first emit. Explain synchronous dispatch.
- Example: await a missing-file read and branch on `err.code === 'ENOENT'`;
  rethrow unrelated errors. Do not match operating-system wording. N8, N10.
- Practice: repair a callback error that bypasses the intended handler; explicitly
  show which layer owns reporting, response completion and cleanup.
### 5. Bytes, files and paths

Teach text encoding, byte buffers, cwd-relative versus module-relative paths,
async versus sync file operations and cleanup. N9, N10, N11.

- Example: UTF-8 `Buffer.from('é').length` is 2 while `'é'.length` is 1;
  decoding the complete buffer returns the original text. N9.
- Example: read UTF-8 text with a temporary-file fixture, then handle a missing
  file. Avoid existence-check-then-open races; attempt the operation and handle
  its result. N10.
- Example: resolve `../outside.txt` against a directory. Normalization can escape
  that directory; `path.join` is not validation. Use an allowlisted fixture
  identifier rather than teach a weak string-prefix containment check. N11, E5.
- Advanced boundary: symlinks, atomic replacement, durable writes and concurrent
  writers require more than path normalization and one awaited write. N10.
### 6. Streams and backpressure

Use a conveyor-belt analogy, then define readable, writable and transform.
Explain chunking, consumer speed and bounded production. N12.

- Example: pipeline a temporary input file through gzip into an output file;
  decompress to verify bytes. Inject a missing source and assert rejection and
  cleanup. N10, N12; check `node:zlib` documentation before implementing gzip.
- Example: a deliberately slow writable returns false. Pause production until
  drain, while also handling failure/close. False means stop adding pressure,
  not “the chunk was rejected.” N12.
- Pitfalls: highWaterMark is not a hard memory ceiling; chunks need not align
  with characters or records. Do not promise an exact chunk count or RSS value.
  Pipeline to an HTTP response may destroy its socket on failure; do not then
  promise a replacement JSON error response. N12.
### 7. HTTP before framework conveniences

Teach URL path/query, method, headers, status and body; request/response bodies
as streams; JSON as a representation rather than a transport. N13, P1.

- Example: implement one tiny `node:http` JSON response, then its Express
  equivalent. Assert status, content type and parsed body, not header casing.
- Example: GET reads, POST creates, PUT replaces a known resource, DELETE removes.
  Repeating a DELETE can change the response code while preserving its intended
  idempotent effect; idempotent does not mean every response is identical. P1.
- Practice: choose among 201, 204, 400, 401, 403, 404, 409 and 500 for explicitly
  stated scenarios. A 401 example must include an appropriate authentication
  challenge; 204 must not return a body. P1.
### 8. Express routing and middleware

Trace registration order, path/method match, mounted routers and the choice to
respond, continue or forward an error. `return res...` stops this handler's
JavaScript execution; sending alone does not return from the function. E1, E3.

- Example: logging middleware, route and fallback; show a request trace and
  repair middleware that neither responds nor calls next. E1.
- Example: `/items/:id` versus query options; parameters remain untrusted text.
  Show a named wildcard `/*splat` and root-inclusive `/{*splat}` separately. E2.
- Example: a returned async route rejection reaches the four-argument handler.
  A detached timer callback needs explicit error forwarding; a fulfilled
  promise does not automatically call next. E3 and Context7 upstream tests.
- Practice: distinguish ordinary 404 fallthrough from thrown failure, and repair
  double response/error-after-headers behavior. E3.
### 9. Parsing, validation and a small resource

Separate Content-Type selection, byte limit, JSON syntax, data shape and business
rules. Parsing does not establish trust; missing parsing can leave body undefined.
Express5 changes query/body defaults, so examples must set relevant options. E2, E5.

- Example: POST a note with a required trimmed nonempty title and bounded length.
  Cover malformed JSON, wrong media type, missing field, wrong field type and
  oversized input as different failures; define the application's status policy.
- Example: parse an ID strictly rather than accept `parseInt('12junk')` as 12.
  Reject unsafe/nonpositive integers if that is the stated ID contract.
- Practice: implement create/read/update/delete against a clearly labelled
  in-memory repository. Demonstrate success, missing resource and validation
  failure. Do not describe the demo as persistent or safe for multiple replicas.
- Coordinator follow-up opened the dedicated Express5 JSON/request/response API
  pages (E10–E12). Use these rather than the short API index for parser options
  and request/response boundaries; verify selected examples on the exact package.
Source discrepancy resolved during coordinator follow-up: the current request
API page still says `qs` is the default query parser, whereas the v5 migration
guide and exact v5.3.0 application source specify `simple` (E2/E13). Teach the
versioned behavior and set the parser explicitly in examples. Test repeated and
nested query shapes on the exact package; do not copy the stale default claim.

### 10. Authentication, authorization and browser boundaries

Teach identity versus permission with two fixture users and one owned record.
The fixture identity is supplied by a trusted test seam, not a public header
presented as production authentication. E5, S1.

- Example: authenticated user A may read A's record, but cannot read B's; test
  both identities and an anonymous request. Authorize each requested object. S1.
- Contrast server session ID cookies with bearer credentials; neither alone
  supplies resource authorization. Explain session storage lifetime. E8, S1.
- Example: CORS response headers allow one browser origin to read data. A direct
  HTTP client remains able to send requests, so auth still runs. Some browser
  requests require a successful preflight before the real request. E7, P2.
- Example: cookie-authenticated mutation requires CSRF protection. Explain why
  HttpOnly protects script access to a cookie but does not prevent its automatic
  sending; SameSite and origin/token defenses address different conditions. S2.
- Boundary: no custom password/JWT/OAuth implementation. Explain vetted password
  hashing and secure credential handling with source links; never store plaintext
  passwords or suggest JWT decoding proves a signature valid. S3, E5.
### 11. State lifetime, configuration and operations

Distinguish request-local variables, process-local cache, shared persistent data
and external resource ownership. A read/await/write sequence can interleave with
another request even on one JavaScript thread; demonstrate a lost update with
a deterministic barrier, then explain why process-local fixes do not coordinate
replicas. Avoid mutable globals carrying one user's
identity into another request. Module reuse does not make storage durable. N4, E8.

- Example: restart the in-memory notes server and observe reset; run two instances
  and observe independent stores. This is a teaching limitation, not a bug fix.
- Example: show why trust proxy affects client IP/protocol. Compare direct access
  with a trusted local proxy; never prescribe `true` without the topology. E6.
- Example: reject missing/invalid configuration at startup; redact credentials
  from logs. Follow with SIGTERM: stop accepting, drain, release resources and
  enforce a bounded shutdown deadline. N3, N13, E9.
- Explain timeout versus abort, retry versus duplicate effects, readiness versus
  liveness, and useful request/error/latency signals. Detailed policies are
  application choices; avoid claiming one timeout/retry value fits all services.
  For outgoing fetch, explicitly abort the work with an AbortController; merely
  timing out the response does not cancel it. Circuit breakers and idempotency
  keys are illustrative contracts here, without a real database integration.
### 12. Testing and diagnostic practice

Separate pure validation checks, request integration and environment-dependent
behavior. Export app construction separately from listening; inject the tiny
repository so tests can control missing data and failure. This structure is our
teaching recommendation, supported by Node's test/lifecycle primitives. N13, N14.

- Example: listen on ephemeral localhost port, await readiness, send a real
  request, assert status/body and close the server in cleanup even after failure.
- Practice: test invalid input, unknown route, forbidden object, rejected data
  operation and a successful request following an earlier error.
- Diagnose with evidence: a blocked event loop, an unclosed handle and a leaked
  process-local collection have different reproductions. Do not imply passing
  unit tests establishes browser CORS or secure deployment configuration.

## Implementation verification and explicit follow-ons

Run every delivered snippet/reference solution in its declared version and module
context. Record Node, Express and helper versions plus exact command and result.
Use isolated temporary fixtures and ephemeral ports. The coordinator proposes Express 5.3.0 as a development dependency for executable
HTTP example tests, not an application backend or runtime dependency. This record
does not install it; the implementation plan governs that change.

Scheduling checks must assert guaranteed relations, not observed wall-clock
precision. Use subprocesses for fatal errors and module entry-point examples.
Stream checks must include input/output equality, failure and cancellation/close
cleanup. HTTP checks should include malformed JSON, limits, validation, ownership,
404 and rejected async work, as well as success. Browser CORS/CSRF claims require
real browser origin/cookie conditions when presented as executed demonstrations;
curl and server-side fetch cannot establish browser enforcement.

Advanced follow-ons: full worker-pool/transferables implementations, deep
AsyncLocalStorage instrumentation and profiling, deployment-specific clustering
and shutdown orchestration, database-driver transactions, distributed race
solutions, production session-store setup, OAuth/OIDC/JWT verifier implementation,
websocket protocols and custom stream internals. The selected design still teaches
basic request correlation, process scaling, state races and graceful shutdown;
these follow-ons extend those fundamentals into platform-specific implementation.

Known research limits: no examples run; no new API or dependency installed; the
latest-v26 process URL, Node22 globals URL and guessed split Express API URLs were unavailable in the
web tool. Working current Node pages and explicit Node22 pages are cited above.
Coordinator follow-up resolved the split Express API pages through the index
links (E10–E12); earlier guessed URLs were not used as evidence. Verify final
snippets against Node22 rather than copying newer Node26 API examples.

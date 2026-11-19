# Node fundamentals: teach the execution model

Selected 2026-11-10 after reader feedback (D-111) and the user's instruction to
proceed. This extends the [original Node/Express design](2026-11-10-node-express-design.md).
It supersedes that design's twelve-panel/38-topic structure as a delivery ceiling.
The six NE-R corrections stay closed. Integration remains on hold.

## Outcome and diagnosis

Before discussing Express middleware, a reader should be able to explain where
JavaScript runs, what happens while I/O is outstanding, how callbacks become ready,
why one request can delay another, and which resource keeps a process alive.
They should predict a small program, justify the output, change one condition
and repair a failure. Definitions and correct output alone do not establish this.

The current `runtime.ts`/`async.ts` material gives one-paragraph descriptions,
a synchronous sum inside async and an entry-point queue comparison. It does not
walk a reader through the runtime or event-loop phases. Several result tables
repeat the model paragraph instead of explaining intermediate state. Most local
activities ask for a short verbal answer. This revision addresses those gaps.

Use the [single source record](../../../reference/node-express-source-research.md),
especially its reader-feedback and Node-fundamentals evidence sections. New
scenarios are original. Explain terms before they appear in a trace or question.

## Teaching shape

Use one small book-report request as the running story: accept work, read data,
transform it and respond. Keep examples small enough to reason about by hand.
Show each lesson's prerequisites; link to JavaScript for general language syntax.
Teach a concept before asking the reader to name it in an interview.

Each changed Node lesson connects:

1. A concrete question and a plain mental model with named parts.
2. A worked program with its needed files/imports and module context visible.
3. An intermediate-state walkthrough: active JavaScript, outstanding native work,
   ready callbacks/queues and remaining resources. Use only relevant columns.
4. A contrasting example that changes one assumption, with the changed reasoning.
5. A mistake and repair, a substantive interview answer, then transfer practice.

At least six Node activities should ask for actual code or a concrete repair and
include an explained, executable reference solution: callback-to-Promise bridge,
bounded independent work, listener cleanup, incremental decoding, manual
backpressure and worker messaging. Other activities can ask for traces or choices.
This is a coordinator acceptance choice; it replaces the current reliance on
mostly verbal practice. Do not simply repeat the interview follow-up as practice.

Replace repeated boilerplate introductions in changed Node panels with the
reader's task, prerequisites and a useful orientation. Summaries should describe
what the reader will do; full explanations belong inside. Explain the result in
the trace rather than copying the definition into another column.

## Concrete event-loop teaching specimen

This is a frozen design specimen for the required depth, not a second maintained
lesson source after porting. The implementation's structured data becomes canonical.

Begin with: **“If reading a file takes time, how can Node print another line
before the file callback runs?”** Explain that the call stack is the JavaScript
currently executing. Node's file API starts native filesystem work, normally
through libuv's worker pool. JavaScript does not wait on that stack for the disk.
When the read completes, its callback becomes eligible for JavaScript execution.
Do not describe network readiness as necessarily using the same pool.

Show this as `walkthrough.cjs`, saved and run as an actual file:

```js
const { readFile } = require('node:fs');
console.log('start');

readFile(__filename, (error) => {
  if (error) throw error;
  console.log('file');
  setTimeout(() => console.log('timer'), 0);
  setImmediate(() => console.log('immediate'));
  Promise.resolve().then(() => console.log('promise'));
  queueMicrotask(() => console.log('microtask'));
  process.nextTick(() => console.log('tick'));
});

console.log('end');
```

The isolated successful read produces:
`start → end → file → tick → promise → microtask → immediate → timer`.
This draft was executed on Node22.23.4 during design research; the actual displayed
program must be executed again by implementation checks.

| Moment | What is happening | Why the next output follows |
| --- | --- | --- |
| Entry script | JavaScript prints start, requests a read and continues to end. | Completion of the read does not interrupt the current JavaScript stack. |
| Read completion | Node can dispatch the ready file callback; it prints file. | The callback schedules work; scheduling is different from executing it now. |
| Callback returns | The next-tick queue drains for this callback boundary. | tick prints before this callback's Promise and queueMicrotask jobs. |
| Microtask work | The Promise reaction and queued microtask run in enqueue order. | promise then microtask; these queues are not event-loop phases. |
| Check work | The immediate scheduled inside this I/O callback runs. | In this stated I/O context it runs before the zero-delay timer. |
| Timer becomes eligible | Node can run the timer callback. | Zero uses the minimum supported delay; it does not interrupt earlier JavaScript or promise exact elapsed time. |

Then make the learner change the program. Move timeout/immediate registration to
the entry script: their relative order is no longer promised by this lesson.
Move nextTick registration inside a Promise reaction: reason from the current
microtask checkpoint rather than memorizing “CJS always ticks first.” Run the
same entry-point queue example as `.cjs` and `.mjs` and explain the difference.
Finally add CPU work before the callback returns and ask which ready work waits.
The explanation must lead to those predictions, not simply disclose four outputs.

The phase lesson also needs a labelled phase-purpose map: timers, pending
callbacks, internal idle/prepare, poll, check and close callbacks. Explain the
poll phase's readiness/wait role and where setImmediate belongs. Mark internal
phases as background context. The diagram/table is a simplified model, not a
guarantee that all I/O has one FIFO or that every iteration executes one callback
per phase. Do not label every user event named close as a close-phase callback.
Teach Node20+/libuv1.45's timer-placement change with the documented
pre-loop caveat; do not turn a circular phase chart into a universal output order.

## Section and topic changes

Preserve all twelve existing section hashes and all 38 existing topic IDs.
Move `scheduling` from `async-and-events` to the new `event-loop` panel; this
changes its disclosure DOM prefix but preserves its topic ID. Existing section
links remain valid. There is no current topic-hash routing contract.

The initial composition becomes **15 panels / 49 topics**, with at least one
owned activity per topic. These are explicit design choices, not a ceiling.
Split at a measured teaching seam when needed; record any additional hash/ID.

| Panel hash | Topic IDs | Required teaching and contrasts |
| --- | --- | --- |
| `runtime-and-concurrency` (rewrite) | `node-runtime`, `loop-and-pool`, `parallel-work` | Map language/V8, stack, Node APIs, libuv/OS and heap; trace sync work versus an outstanding read; demonstrate why async does not offload a CPU loop. Show dependent/independent work and a concrete bounded-concurrency repair. |
| `event-loop` (new) | `event-loop-phases`, `timers-and-immediates`, `scheduling` (moved/deepened) | Full phase-purpose map and I/O walkthrough; top-level versus I/O timer/immediate contrast; nextTick/Promise/queueMicrotask checkpoints, CJS/ESM entry comparison and nested-microtask counterexample; starvation and yielding. |
| `async-and-events` (rewrite) | `callbacks-to-await` (new), `promise-control`, `events-and-cleanup` | Show the same small operation as error-first callback, Promise and await. Explain synchronous throw versus later callback error, returned versus detached work and finally. Trace synchronous emitter dispatch, once/on, error channel and listener cleanup. |
| `work-and-workers` (new) | `io-and-worker-pool`, `worker-threads`, `process-isolation` | Distinguish OS network readiness, filesystem/crypto pool jobs, JavaScript Workers and separate OS processes. Show actual small Worker message/result/error/cleanup and child-process isolation. Explain transfer/startup costs and finite capacity without claiming a speedup from a tiny timing. |
| `modules-and-packages` (retain/deepen selectively) | Existing three topics | Preserve six-file exports/cache/cycle correction. Connect package type, runtime/module loading, dependency classes, lockfile install workflow and startup config to the runnable examples. Do not replace the module walkthrough with an inventory. |
| `files-and-streams` (rewrite/expand) | `buffers-and-encoding`, `incremental-decoding` (new), `paths-and-files`, `manual-backpressure` (new), `stream-backpressure` | Distinguish code units/bytes; split a UTF-8 character and repair decoding with StringDecoder/stream encoding; async fs/error/cleanup and path vs URL; manual write(false)/drain with a controlled receiver, then pipeline completion/failure/abort and cleanup. |
| `process-and-memory` (new) | `handles-and-exit`, `retained-references`, `node-error-channels` | Explain process lifetime through a pending Promise versus referenced/unreferenced handles. Show retained listeners/collections and explicit cleanup rather than nondeterministic GC claims. Compare throw/callback/rejection/emitter errors with matched ownership; link to existing bounded shutdown/fatal process handling. |

Keep the eight existing HTTP/Express/data/security/test/operations panels after
these Node foundations. The new order is runtime, event loop, async/events,
work/workers, modules/packages, files/streams, process/memory, then HTTP onwards.
Deepen `raw-http` with a request/body/response walkthrough and connect its pieces
to the Node execution model. Keep all NE-R fixes, especially module/cycle content,
pagination/query contract, CSRF boundary and SIGTERM mutation protection.

## Example and behavior contracts

- Baseline remains Node22.23.4 and exact dev-only Express5.3.0. No dependency,
  framework/runtime upgrade or real backend. Keep one canonical web/Markdown source.
- Every code block and coding solution enters the actual-code manifest. Show all
  necessary files; use distinct temporary file groups/entries where appropriate.
  No hidden helper may supply the mechanism being taught.
- Fixed output is allowed only when justified by the context. Assert partial
  orders or a set of permitted traces for top-level timer/immediate examples;
  never require a run to exhibit both permitted orders. No elapsed-time proof.
- Starvation/CPU demonstrations must be finite or isolated with an explicit parent
  limit. Do not publish or execute an unbounded nextTick loop as a normal example.
- Workers/children need error/exit ownership, bounded execution and termination in
  cleanup. Use explicit files/argument arrays with spawn/fork; avoid constructing
  shell commands from input. Use handshake/result assertions rather than sleeps
  or CPU speed claims.
- Pool/network differences are sourced mechanisms; do not infer pool internals
  from one elapsed-time test or change UV_THREADPOOL_SIZE as a universal fix.
- Manual backpressure uses a controlled writable/release/drain sequence. A false
  write accepts the chunk but asks the producer to stop. Cover sink failure/close
  as well as drain; avoid deadlocking by awaiting only drain after destruction.
- Split-byte examples assert bytes/decoded text, not arbitrary stream chunk sizes.
  Retained-reference examples assert visible collection/listener ownership, not
  exactly when GC runs or a required RSS delta. Explain that GC can reclaim only
  unreachable objects; it does not decide whether reachable data is still needed.
- Demonstrate a created unresolved Promise without top-level await separately
  from a referenced timer. An unresolved top-level await has different process
  behavior and must be explicitly labelled if introduced.
- Preserve context-specific Node error handling: surrounding try/catch does not
  intercept a later callback throw; an emitter error is not a Promise rejection.
  Fatal examples run only in bounded children, not inside Vitest's parent process.

## Layout, verification and teaching acceptance

Reuse StudySheet/TeachingBlock/SheetActivity. One topic may need several ordered
examples and trace paragraphs. Keep the four-screen budget for default and
one-topic-open panels at 1024×768 with solutions closed. Measure the event-loop
and stream lessons early. Split a coherent lesson across adjacent topics if
needed, retaining a clear handoff; compress repeated boilerplate rather than
deleting the mechanism. Allow the rail to scroll with its existing semantics.

Meaningful render checks must observe intermediate-state reasoning independently
of the composed source. Data/ID/count tests cannot establish depth. Browser checks
must reach all new hashes/topics/solutions, keyboard code/table scrolling, both
themes, narrow/middle/wide widths and solution reset. Preserve the existing
Express/DSA dev-console completeness assertions and omitted-ID sensitivity tests.

The single independent final Sol High content/page/branch review must assess
whether the displayed lesson supplies enough reasoning for these transfer tasks:

1. Explain file I/O progressing while JavaScript prints end; locate what is waiting.
2. Move timeout/immediate registration and state what can still be guaranteed.
3. Predict nextTick scheduled inside a Promise reaction without using a global rule.
4. Explain why adding async does not solve CPU blocking, then select a bounded fix.
5. Repair a split UTF-8 decode or producer ignoring backpressure and explain failure.
6. Explain why an unresolved Promise and a referenced handle affect exit differently.

Report missing prerequisite explanations and misleading transitions with actual
page evidence. Passing the regression suite is separate evidence. Do not describe
this review as a learner study or guarantee interview performance. Return a live
event-loop lesson for the user's depth assessment before recommending integration.

## Delivery

Use the [compact plan](../plans/2026-11-10-node-fundamentals-depth.md). Keep branch
`feat/node-express-study`, starting from this design's committed handoff tip.
One fresh user-selected **GPT-6.1 Sol / Medium** implementer under D-100/D-110;
one final independent **GPT-6.1 Sol / High** content/page/branch review. No per-task
agent/review rounds. Return actual diff/checks/limits/session to coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6.1 Sol / High**.
No integration/push/promotion. Keep the unrelated `.pnpm-store/` out of commits.

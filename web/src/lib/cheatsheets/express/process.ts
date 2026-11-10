import type { Section, SheetActivity } from '../types'
export const processLifetime: {
  sections: Section[]
  activities: SheetActivity[]
} = {
  sections: [
    {
      title: 'Process and memory',
      study: {
        id: 'process-and-memory',
        label: 'Process and memory',
        hint: 'Explain the mechanism, change a condition, then repair the program',
      },
      introduction: [
        {
          id: 'process-and-memory-intro',
          kind: 'paragraph',
          text: 'Separate “a result is pending” from “a native resource keeps the loop alive.” Then inspect the references your code owns and the error channel it must handle. Run each lifetime/fatal file as an isolated Node entry with no added IPC or keepalive handle.',
        },
      ],
      rows: [
        {
          term: 'Find what keeps the process alive',
          what: 'Compare an ordinary pending Promise, referenced timer, unref and unsettled top-level await.',
          study: {
            id: 'handles-and-exit',
            summary:
              'Compare an ordinary pending Promise, referenced timer, unref and unsettled top-level await.',
            activityIds: ['handles-and-exit-practice'],
          },
          teaching: [
            {
              id: 'handles-and-exit-model',
              kind: 'paragraph',
              text: 'Node can exit naturally when no referenced work/resources need the loop. A Promise object describes a result; merely leaving it unresolved does not create a referenced native handle. Timers are referenced by default. unref permits exit while a timer is pending, but does not cancel that timer.',
            },
            {
              id: 'handles-and-exit-example',
              kind: 'code',
              label: 'pending.mjs — no top-level await or harness IPC',
              code: "new Promise(() => {});\nconsole.log('done');",
            },
            {
              id: 'referenced-timer-example',
              kind: 'code',
              label: 'referenced.cjs — timer owns referenced loop work',
              code: "setTimeout(() => console.log('timer'), 1);\nconsole.log('done');",
            },
            {
              id: 'unref-timer-example',
              kind: 'code',
              label:
                'unreferenced.cjs — a long pending timer does not hold the loop',
              code: "setTimeout(() => console.log('not-required-before-exit'), 60000).unref();\nconsole.log('done');",
            },
            {
              id: 'unref-held-example',
              kind: 'code',
              label: 'held.cjs — unref is not cancellation',
              code: "const hold = setInterval(() => {}, 60000);\nsetTimeout(() => { console.log('unref-fired'); clearInterval(hold); }, 1).unref();\nconsole.log('waiting');",
            },
            {
              id: 'liveness-trace',
              kind: 'table',
              label: 'Result state and resource state',
              columns: ['Entry', 'Referenced resource', 'Outcome'],
              rows: [
                [
                  'pending.mjs',
                  'None created by the ordinary pending Promise',
                  'done, then successful natural exit.',
                ],
                [
                  'referenced.cjs',
                  'The timer',
                  'done, then timer, then exit; no exact delay is asserted.',
                ],
                [
                  'unreferenced.cjs',
                  'No referenced timer remains',
                  'done, then exit without requiring that callback.',
                ],
                [
                  'held.cjs',
                  'The independent interval until cleared',
                  'waiting then unref-fired; the unref timer was not cancelled.',
                ],
              ],
            },
            {
              id: 'tla-boundary',
              kind: 'paragraph',
              text: 'These tests do not add an IPC channel to fabricate liveness. An unresolved top-level await is a different ESM evaluation contract: Node22 can exit with code 13 rather than successful completion. Do not confuse new Promise(...) with await new Promise(...). The existing operations lesson owns explicit startup/SIGTERM shutdown; natural exit is not a substitute for graceful service draining.',
            },
            {
              id: 'handles-and-exit-interview',
              kind: 'interview',
              question: 'Can unref make an operation safe to abandon?',
              answer:
                'No. It changes whether that handle keeps the loop alive, not whether work is cancelled or whether its result is required. If you must finish the operation before exit, keep explicit lifetime ownership and await completion with an appropriate deadline.',
              followUp:
                'What changed in held.cjs even though the timer remained unreferenced?',
            },
          ],
        },
        {
          term: 'Remove the references your owner created',
          what: 'Trace a request in a Map and listener closure without promising GC timing.',
          study: {
            id: 'retained-references',
            summary:
              'Trace a request in a Map and listener closure without promising GC timing.',
            activityIds: ['retained-references-practice'],
          },
          teaching: [
            {
              id: 'retained-references-model',
              kind: 'paragraph',
              text: 'Stack variables and heap objects are connected by references. A reachable Map entry or listener closure can keep request data reachable after the HTTP response ends. GC can reclaim unreachable objects; it cannot decide that your still-reachable cache entry is no longer useful. Explicit cleanup removes the paths you own.',
            },
            {
              id: 'retained-references-example',
              kind: 'code',
              label: 'retention.mjs — visible ownership counts',
              code: "import { EventEmitter } from 'node:events';\nconst bus = new EventEmitter(), cache = new Map(), seen = [];\nconst request = { id: 'r1', payload: Buffer.alloc(8) };\ncache.set(request.id, request);\nfunction listener() { seen.push(request.id); }\nbus.on('book', listener);\nconsole.log('owned', cache.size, bus.listenerCount('book'));\nfunction cleanup() { cache.delete(request.id); bus.off('book', listener); }\ncleanup(); cleanup(); bus.emit('book');\nconsole.log('after', cache.size, bus.listenerCount('book'), seen.length);",
            },
            {
              id: 'retainer-trace',
              kind: 'table',
              label: 'Ownership paths, not a GC observation',
              columns: ['Moment', 'Reachability path', 'Observation'],
              rows: [
                [
                  'Before cleanup',
                  'cache → request and bus → listener → request',
                  'owned 1 1; a response finishing would not automatically remove either path.',
                ],
                [
                  'After repeated cleanup',
                  'These Map/listener paths are removed',
                  'after 0 0 0; no future listener delivery.',
                ],
                [
                  'Other references / GC',
                  'The module or other code may still retain request',
                  'No claim of immediate collection, RSS reduction or absence of all leaks.',
                ],
              ],
            },
            {
              id: 'retention-diagnosis',
              kind: 'paragraph',
              text: 'Use repeated-load ownership counts and retainer/heap comparisons to find unexpected roots. Heap snapshots block the main thread and may need substantial memory; take them with an operational plan. Raising listener warning limits does not fix retention. Bounded caches and explicit eviction are policies, not a request to wait for GC.',
            },
            {
              id: 'retained-references-interview',
              kind: 'interview',
              question:
                'Does cache.size dropping to zero prove the payload was collected?',
              answer:
                'No. It proves removal of those entries. Other closures, module variables, views or collections may still retain it, and collection timing is nondeterministic. Tests should assert owned path removal and absent delivery, not a specific heap/RSS drop.',
              followUp: 'How can a tiny Buffer view retain a large allocation?',
            },
          ],
        },
        {
          term: 'Match each failure to its owner',
          what: 'Compare throw, callback error, Promise rejection and emitter error before observing fatal mistakes in separate processes.',
          study: {
            id: 'node-error-channels',
            summary:
              'Compare throw, callback error, Promise rejection and emitter error before observing fatal mistakes in separate processes.',
            activityIds: ['node-error-channels-practice'],
          },
          teaching: [
            {
              id: 'node-error-channels-model',
              kind: 'paragraph',
              text: 'A synchronous throw travels up the current stack. A callback API reports a later error through its error argument. A Promise rejects to its awaited/returned consumer. EventEmitter has a special error event. These channels need different owners; an outer try/catch is not a universal asynchronous shield.',
            },
            {
              id: 'node-error-channels-example',
              kind: 'code',
              label: 'owned-errors.mjs — handle all four channels',
              code: "import { EventEmitter } from 'node:events';\ntry { throw new Error('sync'); } catch (error) { console.log('throw', error.message); }\nfunction later(done) { setImmediate(() => done(new Error('later'))); }\nawait new Promise(resolve => later(error => { console.log('callback', error.message); resolve(); }));\ntry { await Promise.reject(new Error('rejected')); } catch (error) { console.log('promise', error.message); }\nconst bus = new EventEmitter(); bus.on('error', error => console.log('emitter', error.message));\nbus.emit('error', new Error('reported'));",
            },
            {
              id: 'fatal-callback-example',
              kind: 'code',
              label:
                'fatal-callback.cjs — deliberately fatal; run only as its own process',
              code: "try {\n setImmediate(() => { throw new Error('late callback throw'); });\n} catch (error) { console.log('outer caught', error.message); }",
            },
            {
              id: 'fatal-emitter-example',
              kind: 'code',
              label: 'fatal-emitter.cjs — deliberately unhandled emitter error',
              code: "const { EventEmitter } = require('node:events');\nnew EventEmitter().emit('error', new Error('unowned emitter'));",
            },
            {
              id: 'error-owner-trace',
              kind: 'table',
              label: 'The boundary that can catch each failure',
              columns: ['Channel', 'Required owner', 'Why'],
              rows: [
                [
                  'Synchronous throw',
                  'try/catch on the active stack',
                  'The throw happens before that stack returns.',
                ],
                [
                  'Later callback error',
                  'Callback checks error and forwards/rejects',
                  'The scheduling call’s stack no longer exists.',
                ],
                [
                  'Promise rejection',
                  'Await/return plus catch at the operation boundary',
                  'Dropping the Promise drops that caller connection.',
                ],
                [
                  'Emitter error',
                  'An error listener or explicit API policy',
                  'It is not automatically a Promise rejection.',
                ],
              ],
            },
            {
              id: 'fatal-error-boundary',
              kind: 'paragraph',
              text: 'The two deliberately broken children exit unsuccessfully; the surrounding try/catch never prints outer caught for the later callback. Do not catch a fatal process error and continue normal service with possibly corrupted state. Use supervised restart and bounded cleanup appropriate to the service; request-level expected errors belong at a request boundary instead.',
            },
            {
              id: 'node-error-channels-interview',
              kind: 'interview',
              question:
                'Does wrapping setImmediate in try/catch catch its callback throw?',
              answer:
                'No. The callback runs on a later stack. Handle the callback outcome there or adapt its documented error channel to a Promise. An unhandled emitter error is another distinct route to a fatal exception.',
              followUp:
                'Which Express boundary can see a returned rejected Promise, and which detached work remains outside it?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'handles-and-exit-practice',
      title: 'Find what keeps the process alive practice',
      prompt:
        'Create an unresolved ordinary Promise, then add a referenced interval. Predict exit in each case. If the interval is unref’d, what must be true before its result is required?',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'The Promise alone does not hold the loop; the referenced interval does. unref allows exit before the interval callback, so a required result needs another explicit lifetime owner.',
      explanation:
        'Liveness is about referenced resources/ongoing work, not whether a Promise object says pending. Do not introduce top-level await or a test-owned IPC channel and then attribute the different exit to the ordinary Promise.',
    },
    {
      id: 'retained-references-practice',
      title: 'Remove the references your owner created practice',
      prompt:
        'Remove only cache.delete from cleanup, then only bus.off. Predict the three after counts and whether the data must have been collected.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Without delete: after 1 0 0. Without off: after 0 1 1. Neither proves collection, because other references may remain.',
      explanation:
        'The Map owns one path; the emitter closure owns another. Idempotent cleanup removes the exact paths this owner created and does not remove another owner’s listener.',
    },
    {
      id: 'node-error-channels-practice',
      title: 'Match each failure to its owner practice',
      prompt:
        'Repair the reasoning “my route has try/catch, therefore every future callback and emitter error is safe.” Name the matching owner for each channel and the fatal-process boundary.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Handle callback error arguments where they arrive; return/await promises and catch their rejection; own emitter error events. Reserve current-stack try/catch for synchronous throws.',
      explanation:
        'A request error boundary cannot rewind an already-finished stack or repair corrupted process state. Forward once, avoid duplicate responses, and let supervision own fatal process recovery.',
    },
  ],
}

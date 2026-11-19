import type { Section, SheetActivity } from '../types'
export const eventLoop: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Event loop',
      study: {
        id: 'event-loop',
        label: 'Event loop',
        hint: 'Explain the mechanism, change a condition, then repair the program',
      },
      introduction: [
        {
          id: 'event-loop-intro',
          kind: 'paragraph',
          text: 'If reading a file takes time, how can Node print another line first? Start with the phase-purpose map, then follow the stack, native completion and callback queues. Run the labelled files as entry points; a queue rule without its scheduling context is incomplete.',
        },
      ],
      rows: [
        {
          term: 'Walk a file callback through the loop',
          what: 'Follow outstanding file work, ready callbacks and checkpoints without inventing a global FIFO.',
          study: {
            id: 'event-loop-phases',
            summary:
              'Follow outstanding file work, ready callbacks and checkpoints without inventing a global FIFO.',
            activityIds: ['event-loop-phases-practice'],
          },
          teaching: [
            {
              id: 'event-loop-phases-model',
              kind: 'paragraph',
              text: 'The call stack is the JavaScript currently executing. Calling readFile starts native filesystem work, normally through libuv’s pool, then lets the stack continue. When that work finishes, its callback becomes eligible for dispatch on the loop. Network readiness normally uses OS polling/completion rather than a pool thread waiting on every connection.',
            },
            {
              id: 'phase-purpose-map',
              kind: 'table',
              label: 'Phase purposes in Node 22',
              columns: ['Phase', 'Purpose', 'Boundary'],
              rows: [
                [
                  'Timers',
                  'Run callbacks whose delay threshold has elapsed',
                  'A threshold is not an exact appointment.',
                ],
                [
                  'Pending callbacks',
                  'Run certain deferred I/O callbacks',
                  'This is not every I/O completion; do not infer a universal callback FIFO.',
                ],
                [
                  'Idle / prepare',
                  'Internal loop bookkeeping',
                  'Background context, not general user queues.',
                ],
                [
                  'Poll',
                  'Process I/O readiness/completions and decide whether to wait',
                  'The loop can wait when appropriate; ready JavaScript still needs a free stack.',
                ],
                [
                  'Check',
                  'Run setImmediate callbacks',
                  'An immediate inside an I/O callback precedes a timer registered there.',
                ],
                [
                  'Close callbacks',
                  'Dispatch certain native handle-close callbacks',
                  'Not every EventEmitter event named close belongs to this phase.',
                ],
              ],
            },
            {
              id: 'phase-version-boundary',
              kind: 'paragraph',
              text: 'This table maps purposes, not one callback per phase or a total order across all events. In Node20+/libuv1.45+ timers run after poll in an iteration; the default loop’s compatibility path can also service timers before entering the loop. Pending work can be serviced after poll too. The next-tick queue and V8 microtasks are checkpoints around callback execution, not phases on this map.',
            },
            {
              id: 'event-loop-phases-example',
              kind: 'code',
              label:
                'walkthrough.cjs — save as an actual file and run node walkthrough.cjs',
              code: "const { readFile } = require('node:fs');\nconsole.log('start');\nreadFile(__filename, (error) => {\n if (error) throw error;\n console.log('file');\n setTimeout(() => console.log('timer'), 0);\n setImmediate(() => console.log('immediate'));\n Promise.resolve().then(() => console.log('promise'));\n queueMicrotask(() => console.log('microtask'));\n process.nextTick(() => console.log('tick'));\n});\nconsole.log('end');",
            },
            {
              id: 'io-queue-walkthrough',
              kind: 'table',
              label: 'File completion to deferred callbacks',
              columns: [
                'Moment',
                'Active stack / outstanding work',
                'Next output and reason',
              ],
              rows: [
                [
                  'Entry script',
                  'Print start; request native read; continue to end',
                  'Completion of the read does not interrupt the current JavaScript stack.',
                ],
                [
                  'Read completion',
                  'Ready callback prints file and schedules all five deferrals',
                  'Scheduling is not execution: the file callback must return first.',
                ],
                [
                  'Callback returns',
                  'nextTick queue, then the active microtask checkpoint',
                  'tick → promise → microtask',
                ],
                [
                  'Check',
                  'Immediate is eligible from this I/O context',
                  'immediate runs before this callback’s zero-delay timer.',
                ],
                [
                  'Timer threshold reached',
                  'No earlier stack/queues can be interrupted',
                  'timer runs; zero is normalized to a minimum supported delay, not exact elapsed time.',
                ],
              ],
            },
            {
              id: 'io-walkthrough-contrast',
              kind: 'paragraph',
              text: 'Successful isolated output: start → end → file → tick → promise → microtask → immediate → timer. Now move the timer/immediate registration to entry: their relative order is no longer promised. Add a finite CPU loop before the file callback returns: all its scheduled callbacks wait for that loop. The next topics run those changes and distinguish entry from an already-active microtask checkpoint.',
            },
            {
              id: 'event-loop-phases-interview',
              kind: 'interview',
              question: 'Can the file callback interrupt console.log(end)?',
              answer:
                'No. Native work can progress while JavaScript runs, but dispatching its JavaScript callback waits for the current stack to clear. The callback then schedules work whose own queue/phase rules determine eligibility; there is no single FIFO spanning them all.',
              followUp:
                'Where are the file read and its callback waiting at each row of the trace?',
            },
          ],
        },
        {
          term: 'Change the registration context',
          what: 'Compare entry scheduling with scheduling from the file callback.',
          study: {
            id: 'timers-and-immediates',
            summary:
              'Compare entry scheduling with scheduling from the file callback.',
            activityIds: ['timers-and-immediates-practice'],
          },
          teaching: [
            {
              id: 'timers-and-immediates-model',
              kind: 'paragraph',
              text: 'A timeout supplies a minimum eligibility threshold. An immediate requests check-phase work. Neither interrupts current JavaScript. When both are registered in the I/O callback above, the immediate precedes the timer; at entry their relative order is open because readiness and loop startup differ.',
            },
            {
              id: 'timers-and-immediates-example',
              kind: 'code',
              label:
                'timers-entry.cjs — entry context, no I/O callback wrapper',
              code: "console.log('entry');\nsetTimeout(() => console.log('timer'), 0);\nsetImmediate(() => console.log('immediate'));\nconsole.log('tail');",
            },
            {
              id: 'timer-orders',
              kind: 'table',
              label: 'Two permitted entry traces',
              columns: [
                'Trace',
                'Guaranteed relation',
                'What is not established',
              ],
              rows: [
                [
                  'entry → tail → timer → immediate',
                  'Entry stack completes before deferred callbacks',
                  'This observation does not prove timer always wins.',
                ],
                [
                  'entry → tail → immediate → timer',
                  'Entry stack completes before deferred callbacks',
                  'This observation does not prove immediate always wins.',
                ],
              ],
            },
            {
              id: 'finite-ticks-example',
              kind: 'code',
              label:
                'finite-ticks.cjs — bounded queue starvation demonstration',
              code: "let n = 0;\nfunction step() { console.log('tick'+(++n)); if (n < 3) process.nextTick(step); }\nprocess.nextTick(step);\nsetImmediate(() => console.log('yield'));",
            },
            {
              id: 'finite-ticks-reason',
              kind: 'paragraph',
              text: 'tick1 → tick2 → tick3 → yield: each tick adds another before the loop can service the immediate. This is deliberately finite. An unbounded chain can starve I/O. To yield between CPU batches, schedule the next batch with setImmediate rather than endlessly replenishing ticks or Promise reactions. An immediate scheduled from another immediate waits for a later iteration.',
            },
            {
              id: 'timers-and-immediates-interview',
              kind: 'interview',
              question: 'Does a zero timeout mean run next?',
              answer:
                'No. It must become eligible and wait for preceding JavaScript and relevant queues. Its relation to an immediate depends on where they were registered. State entry or I/O context before predicting.',
              followUp:
                'Would observing both orders on one machine establish a universal scheduling guarantee?',
            },
          ],
        },
        {
          term: 'Predict only guaranteed ordering',
          what: 'Separate CJS/ESM entry queues from a tick created during a microtask checkpoint.',
          study: {
            id: 'scheduling',
            summary:
              'Separate CJS/ESM entry queues from a tick created during a microtask checkpoint.',
            activityIds: ['scheduling-practice'],
          },
          teaching: [
            {
              id: 'scheduling-model',
              kind: 'paragraph',
              text: 'At a CJS entry boundary, Node drains nextTick before the following Promise/queueMicrotask jobs. ESM entry evaluation already runs within microtask processing, so its Promise and queued microtask run before that entry’s ticks. This is a statement about scheduling context, not a file-extension rule that overrides an active checkpoint. nextTick is Legacy in Node22; prefer queueMicrotask for most ordinary userland deferral.',
            },
            {
              id: 'scheduling-example',
              kind: 'code',
              label:
                'queue.cjs and queue.mjs — identical source, separate entry files',
              code: "console.log('sync');\nprocess.nextTick(() => console.log('tick'));\nPromise.resolve().then(() => {\n console.log('promise');\n process.nextTick(() => console.log('tick-from-promise'));\n});\nqueueMicrotask(() => console.log('microtask'));\nconsole.log('end');",
            },
            {
              id: 'scheduling-trace',
              kind: 'table',
              label: 'Entry checkpoints with the same registrations',
              columns: ['Entry', 'Output', 'Reason'],
              rows: [
                [
                  'queue.cjs',
                  'sync, end, tick, promise, microtask, tick-from-promise',
                  'The initial tick drain precedes the microtask checkpoint; a tick created inside it waits.',
                ],
                [
                  'queue.mjs',
                  'sync, end, promise, microtask, tick, tick-from-promise',
                  'Entry is already in microtask processing; queued reactions finish before the tick drain.',
                ],
              ],
            },
            {
              id: 'nested-microtask-example',
              kind: 'code',
              label:
                'nested.cjs — a nextTick created inside a Promise reaction',
              code: "console.log('sync');\nPromise.resolve().then(() => {\n console.log('reaction');\n process.nextTick(() => console.log('tick'));\n queueMicrotask(() => console.log('microtask'));\n});",
            },
            {
              id: 'nested-microtask-reason',
              kind: 'paragraph',
              text: 'sync → reaction → microtask → tick. Registration of nextTick does not interrupt the microtask drain already running. The queued microtask completes before Node services the new tick. “CJS always ticks first” predicts the wrong result here. Node checkpoints apply at host callback boundaries, not after every ordinary function call.',
            },
            {
              id: 'scheduling-interview',
              kind: 'interview',
              question:
                'Why does a tick inside a Promise reaction wait for queueMicrotask?',
              answer:
                'The currently active microtask checkpoint continues draining its own queue. Node handles the newly queued tick afterwards. You must locate the registration within the current execution context rather than apply a global nextTick priority slogan.',
              followUp:
                'What changes if the nested registration is moved to the entry stack?',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'event-loop-phases-practice',
      title: 'Walk a file callback through the loop practice',
      prompt:
        'Before the read completes, add a finite CPU loop after readFile returns. Name the active stack, native work and ready callback when end finally prints.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'The entry stack owns the CPU loop. Native file work may progress or finish, but its callback cannot preempt the stack; end still precedes file.',
      explanation:
        'A completed native operation and a dispatched JavaScript callback are different moments. Once the stack returns, callback checkpoints and phase eligibility can be serviced; this does not require a pool thread per network request.',
    },
    {
      id: 'timers-and-immediates-practice',
      title: 'Change the registration context practice',
      prompt:
        'Move timer and immediate registration out of the file callback and into entry. Give both allowed relative orders, then choose one change that really yields between CPU batches.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Entry allows timer before immediate or immediate before timer, after the entry stack. Queue the next finite CPU batch with setImmediate to yield to the loop.',
      explanation:
        'A minimum timer threshold is not preemption. Repeated Promise.resolve awaits remain microtask work and can delay loop progress. A bounded example establishes relations, not exact milliseconds or every possible platform trace.',
    },
    {
      id: 'scheduling-practice',
      title: 'Predict only guaranteed ordering practice',
      prompt:
        'In nested.cjs, replace queueMicrotask with another Promise.then. Predict both microtasks relative to tick; then explain why the same CJS file does not imply the entry-order rule.',
      context:
        'Use the visible Node 22 files and stated context. Make your prediction or repair before opening the solution.',
      answer:
        'Both reactions scheduled into the active microtask queue finish before the new tick; enqueue order determines their order within that queue.',
      explanation:
        'CJS describes the module format. The current code is running inside a Promise reaction, so a new tick cannot interrupt the active microtask checkpoint. Do not infer a global FIFO across timers, I/O, ticks and microtasks.',
    },
  ],
}

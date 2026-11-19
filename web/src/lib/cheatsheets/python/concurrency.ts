import { family } from './lesson'
export const concurrency = family(
  'threads-and-processes',
  'Threads and processes',
  'Prerequisites: Asyncio (#asyncio), Errors and cleanup (#errors-and-cleanup), Modules and environments (#modules-and-environments). Choose work placement by waiting, shared state and CPU needs. The baseline is conventional GIL-enabled CPython; build and platform qualifications are part of every choice.',
  [
    {
      id: 'concurrency-and-parallelism',
      title: 'Own a blocking thread beyond its async wrapper',
      summary:
        'to_thread can move blocking I/O off the loop; cancelling its await does not stop running thread code.',
      model:
        'Concurrency means operations overlap in lifetime; parallelism means execution at the same time. Async tasks cooperate on a loop thread, OS threads share process memory, and processes have separate memory. Conventional GIL-enabled CPython limits simultaneous Python bytecode execution within one interpreter, though native extensions/I/O can release the GIL. Optional free-threaded CPython builds began in 3.13; build capability, actual GIL state and extension compatibility differ. Neither mode prevents compound-state races. Use threads for suitable blocking I/O and processes for measured pure-Python CPU workloads when startup/serialization costs are justified.',
      code: 'import asyncio\nimport threading\n\ndef blocking(started, stop, finished):\n    try:\n        started.set()\n        stop.wait()\n    finally:\n        finished.set()\n\nasync def main():\n    started, stop, finished = (threading.Event() for _ in range(3))\n    task = asyncio.create_task(asyncio.to_thread(blocking, started, stop, finished))\n    try:\n        await asyncio.to_thread(started.wait)\n        task.cancel()\n        try:\n            await task\n        except asyncio.CancelledError:\n            print("wrapper cancelled", finished.is_set())\n    finally:\n        stop.set()\n        await asyncio.to_thread(finished.wait)\n    print("thread stopped", finished.is_set())\n\nif __name__ == "__main__":\n    asyncio.run(main())',
      trace: {
        label: 'Wrapper state and thread state differ',
        columns: ['Owner action', 'Async wrapper', 'Running thread'],
        rows: [
          [
            'started handshake',
            'Task awaiting thread result',
            'Inside blocking; waiting on stop.',
          ],
          [
            'task.cancel and await',
            'CancelledError observed',
            'Still waiting; finished is False.',
          ],
          [
            'stop.set in finally',
            'Owner requests cooperative thread stop',
            'Thread exits and sets finished.',
          ],
          [
            'finished wait / runner exit',
            'Owner has observed completion',
            'No reliance on cancelling the wrapper to kill a thread.',
          ],
        ],
      },
      contrast:
        'A running thread Future cannot generally be forcibly cancelled safely. A cooperative stop signal must reach the thread’s own blocking API or loop, with bounded waits where needed. to_thread is not a general speedup for pure-Python CPU work on a conventional GIL build. A process can isolate CPU work, but crossing its boundary needs serialization, startup and explicit failure ownership.',
      question: 'Why can a cancelled request still have a running thread?',
      answer:
        'Cancellation changed the asyncio task waiting for the result. It did not preempt code already executing in an OS thread. Keep a thread-side stop/deadline contract and observe completion. If the external API cannot stop, account for that work in capacity and shutdown instead of reporting that cancellation terminated it.',
      practice: {
        title: 'Choose placement after the workload changes',
        prompt:
          'Choose between async tasks, threads and processes for many async socket waits, a legacy blocking file API and a CPU-heavy pure-Python transform. What changes under a free-threaded build?',
        answer:
          'Use bounded async tasks for native async waits, bounded threads for appropriate blocking I/O, and consider bounded processes for CPU work on conventional CPython. Free-threaded builds may permit Python thread parallelism but need actual build/GIL/extension verification and synchronization.',
        explanation:
          'Choose from the work and ownership contracts, then measure realistic costs. A tiny example does not establish throughput or universal CPU speedup.',
      },
    },
    {
      id: 'shared-state-and-locks',
      title: 'Reproduce a lost update before locking it',
      summary:
        'A compound read/modify/write needs one synchronization boundary across the invariant.',
      model:
        'Threads share objects, but an application invariant can span several steps. The GIL is not a transaction around arbitrary Python code. A Barrier lets two workers both read the same old value before either writes, exposing a lost update deterministically. A Lock defines mutual exclusion around the entire read/modify/write operation. Every participant that changes the invariant must use the same lock. Avoid waiting on another worker while holding a lock it also needs.',
      code: 'from threading import Barrier, Lock, Thread\n\ncount = 0\nbarrier = Barrier(2)\ndef lost():\n    global count\n    old = count\n    barrier.wait()\n    count = old + 1\nthreads = [Thread(target=lost) for _ in range(2)]\nfor thread in threads:\n    thread.start()\nfor thread in threads:\n    thread.join()\nprint("lost", count)\n\ncount = 0\nlock = Lock()\ndef safe():\n    global count\n    with lock:\n        count += 1\nthreads = [Thread(target=safe) for _ in range(2)]\nfor thread in threads:\n    thread.start()\nfor thread in threads:\n    thread.join()\nprint("locked", count)',
      trace: {
        label: 'One update can overwrite another',
        columns: ['Phase', 'Worker state', 'Shared count'],
        rows: [
          ['Both reads before barrier release', 'Both old values are 0', '0'],
          [
            'Both writes after release',
            'Each stores old + 1 = 1',
            '1; one update lost.',
          ],
          [
            'Locked repair first worker',
            'Exclusive read/modify/write',
            '0 → 1',
          ],
          [
            'Locked repair second worker',
            'Reads after first completed update',
            '1 → 2',
          ],
        ],
      },
      contrast:
        'Locking only the write leaves the stale reads outside the boundary and does not repair this invariant. Putting the two-worker barrier inside the same lock deadlocks because the second worker cannot arrive. The locked program’s correctness does not require a particular worker order. Prefer ownership/message passing when it makes shared mutable state unnecessary; locks are local to their process.',
      question: 'Why is count += 1 not a sufficient thread-safety argument?',
      answer:
        'The application needs an atomic compound update under all supported execution paths and builds. A GIL or one observed bytecode sequence is not that contract. Protect the whole invariant with a shared lock, or move updates to one owner. The deterministic stale-read witness demonstrates the actual failure without scheduler luck.',
      practice: {
        title: 'Repair a shared counter as one invariant',
        prompt:
          'Implement Counter.add(amount) with a shared lock and a snapshot method using the same lock. Run two threads with 100 additions each and include a negative amount.',
        starter:
          'class Counter:\n    # TODO: lock the compound update and observation\n    pass',
        solution:
          'from threading import Lock, Thread\n\nclass Counter:\n    def __init__(self):\n        self._value = 0\n        self._lock = Lock()\n    def add(self, amount):\n        with self._lock:\n            self._value += amount\n    def snapshot(self):\n        with self._lock:\n            return self._value\n\ndef demo():\n    counter = Counter()\n    def add_many():\n        for _ in range(100):\n            counter.add(1)\n    threads = [Thread(target=add_many) for _ in range(2)]\n    for thread in threads:\n        thread.start()\n    for thread in threads:\n        thread.join()\n    counter.add(-1)\n    assert counter.snapshot() == 199\n\nif __name__ == "__main__":\n    demo()',
        answer:
          'One object owns the value and the lock; all access uses that boundary.',
        explanation:
          'Joining establishes completion before the final observation. The separately displayed barrier witness explains the lost-update mechanism; repeated successful unsynchronized increments alone would not prove safety.',
      },
    },
    {
      id: 'process-boundaries',
      title: 'Run importable work through an explicit spawn boundary',
      summary:
        'Processes serialize input/results and need guarded startup plus joined failure cleanup.',
      filename:
        'process_main.py — beside process_work.py; run python3 process_main.py',
      model:
        'A spawned process starts a fresh interpreter and imports definitions. Worker functions must be importable at module top level; startup belongs behind a main guard. ProcessPoolExecutor uses serialized arguments/results and has bounded worker processes. Its context manager waits for running work on exit; an observed failed Future does not imply other jobs were cancelled. Explicit get_context("spawn") avoids relying on platform/version defaults, which changed in Python 3.14. Objects are not shared just because their parent binding has the same name in another process.',
      code: 'from concurrent.futures import ProcessPoolExecutor\nfrom multiprocessing import get_context, active_children\nfrom process_work import transform\n\ndef main():\n    source = [2, 3]\n    with ProcessPoolExecutor(max_workers=2, mp_context=get_context("spawn")) as pool:\n        good = pool.submit(transform, source)\n        bad = pool.submit(transform, [-1])\n        print("result", good.result())\n        try:\n            bad.result()\n        except ValueError as error:\n            print("failure", error)\n    print("parent", source)\n    print("children", len(active_children()))\n\nif __name__ == "__main__":\n    main()',
      extra: [
        {
          id: 'process-boundaries-worker',
          kind: 'code',
          label: 'process_work.py — complete importable worker',
          code: 'def transform(values):\n    if any(value < 0 for value in values):\n        raise ValueError("negative input")\n    values.append(4)\n    return sum(value * value for value in values)',
        },
      ],
      trace: {
        label: 'Parent state, child state and failure',
        columns: ['Boundary', 'Owner / state', 'Result'],
        rows: [
          [
            'submit source',
            'Child receives serialized [2,3]',
            'Child append does not mutate parent list.',
          ],
          ['good.result', 'Waits for worker result', '29'],
          [
            'bad.result',
            'Raises worker ValueError at caller',
            'failure negative input',
          ],
          [
            'Executor exit',
            'Waits for owned processes to finish',
            'Parent [2,3]; no active child in this isolated program.',
          ],
        ],
      },
      contrast:
        'A lambda or nested closure may not be picklable for spawn; a REPL definition can also lack an importable module context. This is why verification writes real files. Separate memory avoids one class of shared-state race but adds transfer/startup costs and external side effects still need idempotency or rollback policy. A failed Future does not kill a running peer; define deadlines and recovery for work that may hang.',
      question:
        'Why explicitly select spawn instead of relying on the default?',
      answer:
        'Defaults differ by platform and changed in 3.14. Spawn gives the example a clear import/startup model and tests portable entry discipline. It also makes costs visible: data serialization, fresh interpreter startup, import-safe definitions and separate memory. Measure enough realistic work to justify that boundary.',
      practice: {
        title: 'Change a CPU transform to bounded processes',
        prompt:
          'A pure-Python transform now takes substantial CPU time. State what must change from a nested in-request function, how to bound capacity, and what happens to a peer when one Future fails.',
        answer:
          'Move the worker to an importable top-level module, guard entry, use explicit spawn with a fixed worker count and bound queued admission for a large input. Join executor lifecycle; one failed Future does not automatically stop peers.',
        explanation:
          'max_workers bounds processes, not an arbitrary number of submitted Futures. For large streams, keep a bounded submission window and account for serialized input and output memory.',
      },
    },
  ],
)

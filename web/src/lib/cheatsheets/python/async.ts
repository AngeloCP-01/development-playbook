import { family } from './lesson'
export const async = family(
  'asyncio',
  'Asyncio',
  'Prerequisites: Functions and scope (#functions-and-scope), Iteration and generators (#iteration-and-generators), Errors and cleanup (#errors-and-cleanup). Start with coroutine creation, then task ownership and bounded admission. These programs coordinate with events rather than asserting a particular timer speed or scheduler race.',
  [
    {
      id: 'coroutine-and-task',
      title: 'Distinguish creating, awaiting and scheduling',
      summary:
        'Calling async def creates a coroutine object; task creation schedules owned work.',
      model:
        'async def defines a coroutine function. Calling it returns a coroutine object whose body has not run. await runs or joins awaitable work and may suspend the current coroutine; it does not necessarily suspend when the result is already available. A Task schedules a coroutine on the running event loop. The loop runs cooperative tasks on its thread, so a blocking call or CPU loop inside async code blocks that thread. This Event starts unset, making gate.wait an actual suspension boundary until the owner sets it.',
      code: 'import asyncio\n\nasync def report(gate, started, events):\n    events.append("start")\n    started.set()\n    await gate.wait()\n    events.append("finish")\n    return 2\n\nasync def main():\n    gate, started = asyncio.Event(), asyncio.Event()\n    events = []\n    coroutine = report(gate, started, events)\n    print("created", events)\n    async with asyncio.TaskGroup() as group:\n        task = group.create_task(coroutine)\n        await started.wait()\n        print("waiting", events, task.done())\n        gate.set()\n    print("joined", events, task.result())\n\nif __name__ == "__main__":\n    asyncio.run(main())',
      trace: {
        label: 'Coroutine and task lifecycle',
        columns: ['Owner action', 'Coroutine / task state', 'Observation'],
        rows: [
          [
            'Call report',
            'Coroutine object created; body untouched',
            'created []',
          ],
          [
            'create_task then wait started',
            'Task starts, sets started, waits on unset gate',
            'waiting [start] False',
          ],
          [
            'Set gate',
            'Task becomes eligible to resume',
            'Owner does not promise instant execution.',
          ],
          [
            'Leave TaskGroup',
            'Task finished and joined',
            'joined [start,finish] 2',
          ],
        ],
      },
      contrast:
        'Sequentially await report and only then set gate would deadlock: nobody releases the gate. Starting work without retaining/owning its task risks unobserved failures and abandoned work. time.sleep blocks the loop; await asyncio.sleep can suspend. await on an already-set Event may return immediately, so count explicit dependencies rather than claiming every await yields fairly.',
      question: 'Does an async call run concurrently with its caller?',
      answer:
        'The call alone creates a coroutine object. Awaiting it in the current task runs it as part of that task’s control flow; scheduling it as an owned Task allows overlap at suspension points. Neither operation moves CPU-bound Python work to another core or thread automatically.',
      practice: {
        title: 'Predict the missing start',
        prompt:
          'A function calls report(...) but never awaits or schedules the result. Why is events empty? How do you overlap two independent operations and still own their failures?',
        answer:
          'The body has not executed. Create both tasks within TaskGroup and leave the group only after joining them; use results after successful exit.',
        explanation:
          'A bare coroutine is a description of pending execution. Ownership must include how work starts, how it is joined and what happens on failure.',
      },
    },
    {
      id: 'taskgroups-and-cancellation',
      title: 'Join cancellation before leaving the owner',
      summary:
        'TaskGroup cancels siblings on failure and waits for their cleanup before raising an ExceptionGroup.',
      model:
        'TaskGroup is a structured owner of child tasks: its exit waits for them. When an ordinary child exception occurs, the group requests cancellation of remaining siblings, joins them and raises an ExceptionGroup containing failures. except* ValueError handles matching leaves without discarding unrelated errors. CancelledError inherits BaseException; normally allow it to propagate after finally cleanup. Cancellation is delivered at a suspension opportunity; it is a request, not rollback of completed side effects or arbitrary preemption.',
      code: 'import asyncio\n\nasync def sibling(started, events):\n    try:\n        events.append("sibling:start")\n        started.set()\n        await asyncio.Event().wait()\n    finally:\n        events.append("sibling:closed")\n\nasync def fail(started):\n    await started.wait()\n    raise ValueError("bad record")\n\nasync def main():\n    events = []\n    started = asyncio.Event()\n    try:\n        async with asyncio.TaskGroup() as group:\n            child = group.create_task(sibling(started, events))\n            group.create_task(fail(started))\n    except* ValueError:\n        events.append("owner:caught")\n    print(events)\n    print(child.done(), child.cancelled())\n\nif __name__ == "__main__":\n    asyncio.run(main())',
      trace: {
        label: 'TaskGroup owns sibling cleanup',
        columns: ['Dependency', 'State', 'What the owner can conclude'],
        rows: [
          [
            'started event',
            'Sibling has entered its try and is waiting',
            'Failure cannot race ahead of resource setup.',
          ],
          [
            'ValueError child',
            'Group requests sibling cancellation',
            'Cancellation still needs delivery and cleanup.',
          ],
          [
            'Group exit / handler',
            'Sibling finally has run before the caller handles the group error.',
            'No owned child remains running.',
          ],
          [
            'External side effect',
            'Already-written bytes may remain',
            'Cancellation does not imply rollback.',
          ],
        ],
      },
      contrast:
        'gather’s default first-error propagation does not provide the same sibling-cancellation/join contract. Calling task.cancel() alone does not establish task completion; await the task and handle its CancelledError at the owner. A child that swallows cancellation can delay or defeat structured shutdown. Cleanup should release owned resources, then normally re-raise cancellation.',
      question: 'What does TaskGroup guarantee when one child fails?',
      answer:
        'It requests cancellation of siblings, waits for their termination and raises grouped failures after cleanup. The guarantee depends on cooperative children that reach cancellation points and do not suppress shutdown indefinitely. It does not reverse remote operations or stop an already-running worker thread.',
      practice: {
        title: 'Cancel and join a held child',
        prompt:
          'Implement cancel_join(child) so it requests cancellation and waits until the child’s finally ran before returning. Catch only the cancellation the owner expects; demonstrate with a child held on an Event.',
        starter:
          'async def cancel_join(child):\n    # TODO: request, join, handle expected child cancellation\n    pass',
        solution:
          'import asyncio\n\nasync def cancel_join(child):\n    child.cancel()\n    try:\n        await child\n    except asyncio.CancelledError:\n        # This small owner is not itself being cancelled.\n        if asyncio.current_task().cancelling():\n            raise\n\nasync def demo():\n    started = asyncio.Event()\n    events = []\n    async def held():\n        try:\n            started.set()\n            await asyncio.Event().wait()\n        finally:\n            events.append("closed")\n    child = asyncio.create_task(held())\n    await started.wait()\n    await cancel_join(child)\n    assert child.done() and child.cancelled()\n    assert events == ["closed"]\n\nif __name__ == "__main__":\n    asyncio.run(demo())',
        answer:
          'Request cancellation and await the task. Handle expected child cancellation at its owner while propagating cancellation of the owner itself.',
        explanation:
          'The started handshake establishes that the child entered its cleanup scope. done/cancelled and the finally event prove joining, unlike checking cancel()’s return alone.',
        followUp:
          'If the owner is also cancelled during the join, which scope will continue owning cleanup?',
      },
    },
    {
      id: 'bounded-async-work',
      title: 'Bound admission with fixed workers and a queue',
      summary:
        'A semaphore around unlimited created tasks does not bound task allocation.',
      model:
        'A fixed worker pool limits scheduled worker tasks. A bounded asyncio.Queue limits queued items and makes the producer await capacity: backpressure. put suspends only when full; get suspends only when empty. The producer below enumerates lazily, so at most workers + capacity items are claimed/queued plus one producer-held item waiting to put. Results retain all outputs in input order, so total result memory still grows with input size. work is an async callable; every child belongs to the TaskGroup.',
      code: 'import asyncio\n\nasync def map_bounded(values, work, workers=2, capacity=2, state=None):\n    if type(workers) is not int or workers < 1:\n        raise ValueError("positive workers required")\n    if type(capacity) is not int or capacity < 1:\n        raise ValueError("positive capacity required")\n    queue = asyncio.Queue(maxsize=capacity)\n    results = {}\n    state = {} if state is None else state\n    state.update(workers=0, max_queued=0)\n    async def produce():\n        for index, value in enumerate(values):\n            await queue.put((index, value))\n            state["max_queued"] = max(state["max_queued"], queue.qsize())\n        for _ in range(workers):\n            await queue.put(None)\n    async def consume():\n        state["workers"] += 1\n        while True:\n            item = await queue.get()\n            try:\n                if item is None:\n                    return\n                index, value = item\n                results[index] = await work(value)\n            finally:\n                queue.task_done()\n    async with asyncio.TaskGroup() as group:\n        group.create_task(produce())\n        for _ in range(workers):\n            group.create_task(consume())\n    return [results[i] for i in range(len(results))]\n\nasync def double(value):\n    return value * 2\n\nasync def main():\n    state = {}\n    print(await map_bounded(range(4), double, state=state))\n    print(state)\n\nif __name__ == "__main__":\n    asyncio.run(main())',
      trace: {
        label: 'Work capacity versus retained results',
        columns: ['Resource', 'Bound / owner', 'Failure behavior'],
        rows: [
          [
            'Worker tasks',
            'Exactly workers consumers plus one producer',
            'TaskGroup joins all children.',
          ],
          [
            'Queued inputs',
            'At most capacity; one additional producer-held item',
            'Full queue suspends producer.',
          ],
          [
            'Active work calls',
            'At most workers',
            'A failed call cancels siblings and producer.',
          ],
          [
            'Results',
            'One stored result per successful input',
            'O(n) retained output; not a constant-memory map.',
          ],
        ],
      },
      contrast:
        'Creating one task per input and guarding only work with a semaphore bounds active work but can allocate millions of waiting tasks. This design bounds tasks and pending inputs. To stream output with a strict total-memory limit, add a bounded output channel and an owner for ordering/backpressure; preserving arbitrary completion reordering may need its own buffer policy. Per-call limits are not global limits across processes.',
      question: 'What remains unbounded in this bounded mapper?',
      answer:
        'The result dictionary/list grows with input count, and each input/result may itself be large. The fixed task count and queue capacity bound scheduling state and pending input references. State every resource bound separately, and include failure cancellation and join behavior in the capacity contract.',
      practice: {
        title: 'Change the output memory requirement',
        prompt:
          'A million results cannot fit in memory. Explain how to change the mapper’s API and which tradeoff preserves input order. Then predict what happens if work fails while the producer waits on a full queue.',
        answer:
          'Use a bounded output channel consumed incrementally, with an explicit ordering/reorder-buffer policy. TaskGroup cancellation interrupts the blocked producer and joins workers on failure.',
        explanation:
          'A bounded input queue alone does not bound stored output. Strict order can require buffering slow earlier items; bound that window or accept completion-order output.',
      },
    },
  ],
)

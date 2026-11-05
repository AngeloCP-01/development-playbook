import { runInNewContext } from 'node:vm'
import { expect, test } from 'vitest'
import { javascript } from './javascript'

const activity = (id: string) => {
  const result = javascript.activities?.find((a) => a.id === id)
  if (!result) throw new Error(`Missing published activity: ${id}`)
  return result
}
function execute(code: string, bindings: Record<string, unknown> = {}) {
  return runInNewContext(`"use strict";\n${code}`, bindings)
}
function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test('published closure solution retains independent live bindings', () => {
  const logs: unknown[][] = []
  const counters = execute(
    `${activity('closure-counter').solution!.code}\n({first, second})`,
    { console: { log: (...args: unknown[]) => logs.push(args) } },
  )
  expect(logs).toEqual([[1, 2, 1]])
  expect([counters.first(), counters.second()]).toEqual([3, 2])
})

test('published copy bug shares settings while the fresh-input repair preserves the original', () => {
  const logs: unknown[][] = []
  const console = { log: (...args: unknown[]) => logs.push(args) }
  execute(activity('nested-copy').starter!.code, { console })
  expect(logs).toEqual([['dark'], [true]])
  logs.length = 0
  const { original, updated } = execute(
    `${activity('nested-copy').solution!.code}\n({original, updated})`,
    { console },
  )
  expect(logs).toEqual([['light', 'dark'], [false]])
  expect(updated).not.toBe(original)
  expect(original.settings.theme).toBe('light')
})

test('published forEach bug reports completion with held saves; no save has finished', async () => {
  const { saveAll } = execute(
    `${activity('async-iteration').starter!.code}\n({saveAll})`,
  )
  const release = deferred()
  const saved: number[] = []
  const jobs: Promise<void>[] = []
  const save = (item: number) => {
    const job = release.promise.then(() => {
      saved.push(item)
    })
    jobs.push(job)
    return job
  }
  try {
    expect(await saveAll([1, 2], save)).toBe('complete')
    expect(saved).toEqual([])
    expect(jobs).toHaveLength(2)
  } finally {
    release.resolve()
    await Promise.all(jobs)
  }
  expect(saved).toEqual([1, 2])
})

test('published async solution waits for each save before starting the next and reports completion last', async () => {
  const trace: unknown[] = []
  const { report } = execute(
    `${activity('async-iteration').solution!.code}\n({report})`,
    {
      console: {
        log: (value: unknown) => trace.push(value),
        error: (value: unknown) => trace.push(value),
      },
    },
  )
  const started = [deferred(), deferred()]
  const release = [deferred(), deferred()]
  const save = async (item: number) => {
    trace.push(`started ${item}`)
    started[item - 1].resolve()
    await release[item - 1].promise
    trace.push(`saved ${item}`)
  }
  const run = report([1, 2], save)
  try {
    await started[0].promise
    expect(trace).toEqual(['started 1'])
    release[0].resolve()
    await started[1].promise
    expect(trace).toEqual(['started 1', 'saved 1', 'started 2'])
  } finally {
    release.forEach((gate) => gate.resolve())
    await run
  }
  expect(trace).toEqual([
    'started 1',
    'saved 1',
    'started 2',
    'saved 2',
    'complete',
  ])
})

test('published saveAll preserves the rejection and its awaited report catches it without starting item 3', async () => {
  const errors: unknown[] = []
  const logs: unknown[] = []
  const { saveAll, report } = execute(
    `${activity('async-iteration').solution!.code}\n({saveAll, report})`,
    {
      console: {
        log: (value: unknown) => logs.push(value),
        error: (value: unknown) => errors.push(value),
      },
    },
  )
  const failure = new Error('save 2 failed')
  const started: number[] = []
  const save = async (item: number) => {
    started.push(item)
    if (item === 2) throw failure
  }
  await expect(saveAll([1, 2, 3], save)).rejects.toBe(failure)
  expect(started).toEqual([1, 2])
  started.length = 0
  await report([1, 2, 3], save)
  expect(started).toEqual([1, 2])
  expect(errors).toEqual(['save 2 failed'])
  expect(logs).toEqual([])
})

test('published trace runs sync statements, registered microtasks, then timer in one isolated callback', async () => {
  const output: string[] = []
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      execute(activity('scheduling-trace').starter!.code, {
        Promise,
        queueMicrotask,
        setTimeout,
        console: {
          log: (value: string) => {
            output.push(value)
            if (value === 'timer') resolve()
          },
        },
      })
    }, 0)
  })
  expect(output).toEqual(['sync 1', 'sync 2', 'promise', 'microtask', 'timer'])
})

test('lookup examples distinguish equality, TDZ, receivers, prototypes and shallow arrays', () => {
  const result = execute(`
    const equal = [0 === "0", 0 == "0", Number("0"), NaN === NaN, Number.isNaN(NaN), Object.is(NaN, NaN), Object.is(+0, -0)];
    const value = {};
    const identity = [value === value, value === {}];
    let tdz;
    try { { typeof outer; let outer; } } catch (error) { tdz = error.name; }
    const obj = {value: 7, read() { return this.value; }, arrow() { return () => this.value; }};
    const detached = obj.read;
    let detachedError;
    try { detached(); } catch (error) { detachedError = error.name; }
    class Reader { read() { return 1; } }
    const reader = new Reader();
    const records = [{n: 2}, {n: 1}];
    const copied = records.filter(() => true);
    const numbers = [10, 2, 1];
    const sorted = numbers.toSorted((a, b) => a - b);
    ({equal, identity, tdz, undeclared: typeof notDeclared, method: obj.read(), bound: detached.bind(obj)(), arrow: obj.arrow()(), detachedError,
      owns: Object.hasOwn(reader, 'read'), prototype: Object.getPrototypeOf(reader) === Reader.prototype,
      shared: copied[0] === records[0], distinct: copied !== records, numbers, sorted})
  `)
  expect(result).toEqual({
    equal: [false, true, 0, false, true, true, false],
    identity: [true, false],
    tdz: 'ReferenceError',
    undeclared: 'undefined',
    method: 7,
    bound: 7,
    arrow: 7,
    detachedError: 'TypeError',
    owns: false,
    prototype: true,
    shared: true,
    distinct: true,
    numbers: [10, 2, 1],
    sorted: [1, 2, 10],
  })
})

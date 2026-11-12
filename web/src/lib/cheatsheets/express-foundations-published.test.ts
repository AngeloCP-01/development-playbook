import { expect, test } from 'vitest'
import {
  publishedCode,
  runPublishedFiles,
  assertTrace,
} from './express-published-checks'

test('file groups reject a missing displayed prerequisite and an absent entry', () => {
  expect(() =>
    runPublishedFiles({
      files: { 'main.mjs': 'does-not-exist' },
      entry: 'main.mjs',
    }),
  ).toThrow(/missing displayed code/)
  expect(() => runPublishedFiles({ files: {}, entry: 'missing.mjs' })).toThrow(
    /missing entry file/,
  )
})
test('trace oracle accepts both legal entry orders and rejects broken guaranteed edges', () => {
  const labels = ['entry', 'tail', 'timer', 'immediate']
  const edges: [string, string][] = [
    ['entry', 'tail'],
    ['tail', 'timer'],
    ['tail', 'immediate'],
  ]
  expect(() =>
    assertTrace(['entry', 'tail', 'timer', 'immediate'], labels, edges),
  ).not.toThrow()
  expect(() =>
    assertTrace(['entry', 'tail', 'immediate', 'timer'], labels, edges),
  ).not.toThrow()
  expect(() =>
    assertTrace(['entry', 'timer', 'tail', 'immediate'], labels, edges),
  ).toThrow(/tail must precede timer/)
  expect(() =>
    assertTrace(['entry', 'tail', 'timer', 'timer'], labels, edges),
  ).toThrow()
})
test('I/O walkthrough executes the actual displayed CJS file', () => {
  const { stdout } = runPublishedFiles({
    files: { 'walkthrough.cjs': 'event-loop-phases-example' },
    entry: 'walkthrough.cjs',
  })
  expect(stdout.split('\n')).toEqual([
    'start',
    'end',
    'file',
    'tick',
    'promise',
    'microtask',
    'immediate',
    'timer',
  ])
})

import {
  foundationPrograms,
  foundationFragments,
  processFiles,
  pipelineFiles,
  subscribeCheck,
  writeCheck,
} from './express-foundations-cases'

test.each(Object.entries(foundationPrograms))(
  'published foundations %s',
  (id, program) => {
    const result = runPublishedFiles(program)
    if (program.output !== undefined) expect(result.stdout).toBe(program.output)
    if (program.error) expect(result.stderr).toContain(program.error)
    if (program.trace === 'timers')
      assertTrace(
        result.stdout.split('\n'),
        ['entry', 'tail', 'timer', 'immediate'],
        [
          ['entry', 'tail'],
          ['tail', 'timer'],
          ['tail', 'immediate'],
        ],
      )
    if (program.trace === 'allocation')
      assertTrace(
        result.stdout.split('\n'),
        ['submit', 'entry:return', 'file true', 'crypto 8'],
        [
          ['submit', 'entry:return'],
          ['entry:return', 'file true'],
          ['entry:return', 'crypto 8'],
        ],
      )
    if (program.trace === 'decoder') {
      const observation = JSON.parse(result.stdout)
      expect(observation.first).toBe('book:')
      expect(observation.decoded).toBe('book:🦉\n')
      expect(observation.wrong).not.toBe(observation.decoded)
    }
  },
)
test.each(Object.entries(foundationFragments))(
  'classified incomplete exercise %s',
  (id, reason) => {
    expect(reason.length).toBeGreaterThan(20)
    expect(publishedCode(id)).toContain('TODO')
  },
)
test('same published queue source runs in ESM entry context; nested tick is not globally first', () => {
  expect(
    runPublishedFiles({
      files: { 'queue.mjs': 'scheduling-example' },
      entry: 'queue.mjs',
    }).stdout,
  ).toBe('sync\nend\npromise\nmicrotask\ntick\ntick-from-promise')
  const lines = runPublishedFiles({
    files: { 'nested.cjs': 'nested-microtask-example' },
    entry: 'nested.cjs',
  }).stdout.split('\n')
  expect(() =>
    assertTrace(
      lines,
      ['sync', 'reaction', 'microtask', 'tick'],
      [['tick', 'microtask']],
    ),
  ).toThrow(/tick must precede microtask/)
})
test.each(['worker-threads-example', 'worker-threads-practice-solution'])(
  'published %s owns early exit, deadline and a result followed by a retained handle',
  (id) => {
    const program = foundationPrograms[id]
    runPublishedFiles({
      files: program.files,
      entry: program.entry,
      fixtures: {
        'empty-worker.mjs': '',
        'held-worker.mjs':
          "import {parentPort} from 'node:worker_threads';parentPort.once('message',()=>{parentPort.postMessage({sum:1});setInterval(()=>{},60000)})",
        'silent-worker.mjs': 'setInterval(()=>{},60000)',
      },
      append: `
import assert from 'node:assert/strict';
await assert.rejects(runJob([],new URL('./empty-worker.mjs',import.meta.url)),/exit before result/);
assert.deepEqual(await runJob([],new URL('./held-worker.mjs',import.meta.url)),{sum:1});
await assert.rejects(runJob([],new URL('./silent-worker.mjs',import.meta.url)),/worker deadline/);
`,
    })
  },
)
test('child failure rejects even if stdout contains a partial parseable result', () => {
  const result = runPublishedFiles({
    files: processFiles,
    entry: 'report-parent.mjs',
    overrides: {
      'isolated-child-file':
        publishedCode('isolated-child-file') + '\nprocess.exitCode=1;',
    },
    exit: 1,
  })
  expect(result.stderr).toContain('child failed')
  expect(result.stdout).not.toContain('parent')
})
test('pipeline source/destination failures destroy both owned streams', () => {
  runPublishedFiles({
    files: pipelineFiles,
    entry: 'pipeline.mjs',
    append: `
import assert from 'node:assert/strict';
for(const mode of ['source','sink']) { const streams=makeStreams(mode); await assert.rejects(pipeline(streams.source,streams.sink),new RegExp(mode+' failed')); assert.equal(streams.source.destroyed,true);assert.equal(streams.sink.destroyed,true); }
`,
  })
})
test('listener cleanup corruption is detected independently of the authored explanation', () => {
  expect(() =>
    runPublishedFiles({
      files: { 'subscribe.mjs': 'events-and-cleanup-practice-solution' },
      entry: 'subscribe.mjs',
      append: subscribeCheck,
      overrides: {
        'events-and-cleanup-practice-solution': publishedCode(
          'events-and-cleanup-practice-solution',
        ).replace("bus.off('book', listener);", ''),
      },
    }),
  ).toThrow()
})
test('retrying a false write duplicates accepted data and fails the reference producer contract', () => {
  expect(() =>
    runPublishedFiles({
      files: {
        'drain.mjs': 'drain-helper-file',
        'write-all.mjs': 'manual-backpressure-practice-solution',
      },
      entry: 'write-all.mjs',
      append: writeCheck,
      overrides: {
        'manual-backpressure-practice-solution': publishedCode(
          'manual-backpressure-practice-solution',
        ).replace(
          'if (!sink.write(chunk))',
          'sink.write(chunk); if (!sink.write(chunk))',
        ),
      },
    }),
  ).toThrow()
})
test('retention counts catch removal of only one ownership path, without asserting GC timing', () => {
  const source = publishedCode('retained-references-example')
  for (const mutation of [
    'cache.delete(request.id);',
    "bus.off('book', listener);",
  ]) {
    const result = runPublishedFiles({
      files: { 'retention.mjs': 'retained-references-example' },
      entry: 'retention.mjs',
      overrides: {
        'retained-references-example': source.replace(mutation, ''),
      },
    })
    expect(result.stdout).not.toBe('owned 1 1\nafter 0 0 0')
  }
})
test('natural-exit fixtures have no harness IPC; unsettled top-level await has a distinct exit contract', () => {
  const result = runPublishedFiles({
    files: { 'pending.mjs': 'handles-and-exit-example' },
    entry: 'pending.mjs',
    overrides: { 'handles-and-exit-example': 'await new Promise(()=>{});' },
    exit: 13,
  })
  expect(result.stdout).toBe('')
})
test('native HTTP consumes complete bytes before decoding/responding and bounds retained input', () => {
  runPublishedFiles({
    files: { 'http.mjs': 'raw-http-example' },
    entry: 'http.mjs',
    append: `
import assert from 'node:assert/strict';const server=makeServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
try {const response=await fetch(base,{method:'POST',body:'é'});assert.equal(response.headers.get('content-type'),'application/json');assert.deepEqual(await response.json(),{method:'POST',bytes:2,body:'é'});assert.equal((await fetch(base,{method:'POST',body:'x'.repeat(2048)})).status,413);}finally{server.closeAllConnections();await new Promise(r=>server.close(r))}
`,
  })
})

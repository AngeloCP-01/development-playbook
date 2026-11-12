/** Test-only ownership manifest. File names map to literal displayed block IDs. */
export type FoundationCase = {
  files: Record<string, string>
  entry: string
  output?: string
  append?: string
  exit?: number
  error?: string
  trace?: 'timers' | 'allocation' | 'decoder'
}
export const foundationPrograms: Record<string, FoundationCase> = {}
function single(
  id: string,
  file: string,
  output?: string,
  extra: Partial<FoundationCase> = {},
) {
  foundationPrograms[id] = {
    files: { [file]: id },
    entry: file,
    output,
    ...extra,
  }
}
function group(files: Record<string, string>, entry: string, output: string) {
  for (const id of Object.values(files))
    foundationPrograms[id] = { files, entry, output }
}
single('node-runtime-example', 'layers.cjs', 'start book\nend\nfile true')
single(
  'node-runtime-sync-example',
  'sync-layers.cjs',
  'start book\nfile true\nend',
)
single(
  'loop-and-pool-example',
  'cpu.mjs',
  'cpu:start\ncpu:end 499500\ncaller:return\nheartbeat',
)
single(
  'parallel-work-example',
  'ordering.mjs',
  'dependent start:index,done:index,start:index:book,done:index:book\nindependent start:book,start:author,done:book,done:author',
)
single(
  'event-loop-phases-example',
  'walkthrough.cjs',
  'start\nend\nfile\ntick\npromise\nmicrotask\nimmediate\ntimer',
)
single('timers-and-immediates-example', 'timers-entry.cjs', undefined, {
  trace: 'timers',
})
single('finite-ticks-example', 'finite-ticks.cjs', 'tick1\ntick2\ntick3\nyield')
single(
  'scheduling-example',
  'queue.cjs',
  'sync\nend\ntick\npromise\nmicrotask\ntick-from-promise',
)
single(
  'nested-microtask-example',
  'nested.cjs',
  'sync\nreaction\nmicrotask\ntick',
)
group(
  {
    'read-text.mjs': 'callbacks-to-await-example',
    'read-demo.mjs': 'callbacks-consumer-example',
  },
  'read-demo.mjs',
  'callback book\npromise book\nawait book',
)
single('promise-control-example', 'release.mjs', 'offline released')
single('detached-owned-example', 'detached.mjs', 'returned\nowned late')
single(
  'events-and-cleanup-example',
  'dispatch.mjs',
  'on:1,once:1,after:emit 0\ndeferred 1',
)
single('io-and-worker-pool-example', 'allocation.cjs', undefined, {
  trace: 'allocation',
})
export const workerFiles = {
  'sum-worker.mjs': 'sum-worker-file',
  'worker-main.mjs': 'worker-threads-example',
}
group(workerFiles, 'worker-main.mjs', 'worker 6')
export const processFiles = {
  'report-child.cjs': 'isolated-child-file',
  'report-parent.mjs': 'process-isolation-example',
}
group(processFiles, 'report-parent.mjs', 'child 2 parent 1')
single('buffers-and-encoding-example', 'bytes.mjs', 'units 2 bytes 4\nZB A')
single('incremental-decoding-example', 'decode.mjs', undefined, {
  trace: 'decoder',
})
single(
  'paths-and-files-example',
  'files.mjs',
  'path string\nread one\ncallback ENOENT\npromise ENOENT\ncleaned',
)
export const drainFiles = {
  'drain.mjs': 'drain-helper-file',
  'controlled-write.mjs': 'manual-backpressure-example',
}
group(
  drainFiles,
  'controlled-write.mjs',
  'accepted A false\nrelease\ndrain\naccepted AB',
)
export const pipelineFiles = {
  'pipeline-streams.mjs': 'pipeline-streams-file',
  'pipeline.mjs': 'stream-backpressure-example',
}
group(pipelineFiles, 'pipeline.mjs', 'book-list')
foundationPrograms['pipeline-abort-example'] = {
  files: {
    'pipeline-streams.mjs': 'pipeline-streams-file',
    'abort-pipeline.mjs': 'pipeline-abort-example',
  },
  entry: 'abort-pipeline.mjs',
  output: 'AbortError true true',
}
single('handles-and-exit-example', 'pending.mjs', 'done')
single('referenced-timer-example', 'referenced.cjs', 'done\ntimer')
single('unref-timer-example', 'unreferenced.cjs', 'done')
single('unref-held-example', 'held.cjs', 'waiting\nunref-fired')
single('retained-references-example', 'retention.mjs', 'owned 1 1\nafter 0 0 0')
single(
  'node-error-channels-example',
  'owned-errors.mjs',
  'throw sync\ncallback later\npromise rejected\nemitter reported',
)
single('fatal-callback-example', 'fatal-callback.cjs', '', {
  exit: 1,
  error: 'late callback throw',
})
single('fatal-emitter-example', 'fatal-emitter.cjs', '', {
  exit: 1,
  error: 'unowned emitter',
})

const assertImport = "\nimport assert from 'node:assert/strict';\n"
single('parallel-work-practice-solution', 'map-limit.mjs', '', {
  append:
    assertImport +
    `
let active=0,max=0;const results=await mapLimit([3,1,2],2,async value=>{active++;max=Math.max(max,active);await new Promise(setImmediate);active--;return value*2});
assert.deepEqual(results,[6,2,4]);assert.equal(max,2);assert.equal(active,0);
assert.deepEqual(await mapLimit([],2,async x=>x),[]);await assert.rejects(mapLimit([],0,async x=>x),/positive limit/);
await assert.rejects(mapLimit([0,1],2,async value=>{active++;try{await new Promise(setImmediate);if(value===0)throw new Error('job failed');return value}finally{active--}}),/job failed/);assert.equal(active,0);
`,
})
single('callbacks-to-await-practice-solution', 'from-callback.mjs', '', {
  append:
    assertImport +
    `
assert.equal(await fromCallback((path,done)=>setImmediate(()=>done(null,0)),'ok'),0);
await assert.rejects(fromCallback((path,done)=>setImmediate(()=>done(new Error('missing'))),'missing'),/missing/);
await assert.rejects(fromCallback(()=>{throw new Error('sync failure')},'x'),/sync failure/);
`,
})
export const subscribeCheck =
  assertImport +
  `
import { EventEmitter } from 'node:events';
const bus=new EventEmitter(),seen=[],other=[];bus.on('book',book=>other.push(book.id));
const cleanup=subscribe(bus,'u1',id=>seen.push(id));assert.equal(bus.listenerCount('book'),2);
bus.emit('book',{id:'b1',ownerId:'u1'});bus.emit('book',{id:'b2',ownerId:'u2'});assert.deepEqual(seen,['b1']);
cleanup();cleanup();assert.equal(bus.listenerCount('book'),1);bus.emit('book',{id:'b3',ownerId:'u1'});assert.deepEqual(seen,['b1']);assert.deepEqual(other,['b1','b2','b3']);
`
single('events-and-cleanup-practice-solution', 'subscribe.mjs', '', {
  append: subscribeCheck,
})
export const decoderCheck =
  assertImport +
  `
const text='book:🦉'+String.fromCharCode(10)+'next'+String.fromCharCode(10), bytes=Buffer.from(text);
for(let cut=0;cut<=bytes.length;cut++)assert.deepEqual(decodeLines([bytes.subarray(0,cut),bytes.subarray(cut)]),['book:🦉','next']);
assert.deepEqual(decodeLines([...bytes].map(b=>Buffer.from([b]))),['book:🦉','next']);
assert.throws(()=>decodeLines([Buffer.from('unfinished')]),/truncated/);assert.throws(()=>decodeLines([Buffer.from('abcdef'+String.fromCharCode(10))],3),/too long/);assert.throws(()=>decodeLines([],0),/positive/);
`
single('incremental-decoding-practice-solution', 'decode-lines.mjs', '', {
  append: decoderCheck,
})
export const writeCheck =
  assertImport +
  `
import { Writable } from 'node:stream';
const seen=[];const sink=new Writable({highWaterMark:1,write(chunk,encoding,done){seen.push(chunk.toString());setImmediate(done)}});
await writeAll(sink,['A','B','C']);assert.deepEqual(seen,['A','B','C']);assert.equal(sink.writableFinished,true);
for(const event of ['drain','error','close'])assert.equal(sink.listenerCount(event),0,event);
for(const mode of ['error','close']) { const broken=new Writable({highWaterMark:1,write(chunk,encoding,done){setImmediate(()=>mode==='error'?done(new Error('sink failed')):this.destroy())}}); await assert.rejects(writeAll(broken,['A','B']),mode==='error'?/sink failed/:/closed|premature/i);assert.equal(broken.destroyed,true); for(const event of ['drain','error','close'])assert.equal(broken.listenerCount(event),0,event); }
`
foundationPrograms['manual-backpressure-practice-solution'] = {
  files: {
    'drain.mjs': 'drain-helper-file',
    'write-all.mjs': 'manual-backpressure-practice-solution',
  },
  entry: 'write-all.mjs',
  output: '',
  append: writeCheck,
}
foundationPrograms['worker-threads-practice-solution'] = {
  files: {
    'sum-worker.mjs': 'sum-worker-file',
    'worker-repair.mjs': 'worker-threads-practice-solution',
  },
  entry: 'worker-repair.mjs',
  output: '',
  append:
    assertImport +
    `
assert.deepEqual(await runJob([3,-1,2]),{sum:4});await assert.rejects(runJob([NaN]),/bounded integers/);
`,
}
export const foundationFragments: Record<string, string> = {
  'parallel-work-practice-starter':
    'Incomplete interface: the activity asks the reader to implement bounded work.',
  'callbacks-to-await-practice-starter':
    'Incomplete adapter interface; executable solution is checked separately.',
  'events-and-cleanup-practice-starter':
    'Incomplete subscription interface; executable cleanup solution is checked separately.',
  'worker-threads-practice-starter':
    'Incomplete Worker parent interface; displayed worker prerequisite and repaired parent execute.',
  'incremental-decoding-practice-starter':
    'Incomplete decoding/framing interface; executable solution owns the algorithm.',
  'manual-backpressure-practice-starter':
    'Incomplete producer interface; displayed helper and repaired producer execute.',
}

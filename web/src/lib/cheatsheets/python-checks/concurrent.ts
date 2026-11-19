import type { PublishedCase } from '../python-published-cases'
const boundedChecks = String.raw`import asyncio
from bounded import map_bounded

async def check():
    baseline = asyncio.all_tasks()
    ready, release = asyncio.Event(), asyncio.Event()
    active = peak = produced = 0
    state = {}
    def source():
        nonlocal produced
        for value in range(50):
            produced += 1
            if not release.is_set():
                assert produced <= 5, "producer outran fixed worker/queue budget"
            yield value
    async def work(value):
        nonlocal active, peak
        active += 1
        peak = max(peak, active)
        if active == 2:
            ready.set()
        try:
            await release.wait()
            return value * 2
        finally:
            active -= 1
    owner = asyncio.create_task(map_bounded(source(), work, state=state))
    await ready.wait()
    assert state["workers"] == 2 and active == 2 and produced <= 5
    assert len(asyncio.all_tasks() - baseline) == 4, "owner, producer, two workers only"
    release.set()
    assert await owner == [n * 2 for n in range(50)]
    assert peak == 2 and active == 0 and state["max_queued"] <= 2
    assert await map_bounded([], work) == []
    for kwargs in [{"workers": 0}, {"capacity": 0}, {"workers": True}]:
        try:
            await map_bounded([], work, **kwargs)
        except ValueError:
            pass
        else:
            raise AssertionError("invalid capacity accepted")
    started = asyncio.Event()
    closed = []
    async def fail(value):
        if value == 0:
            await started.wait()
            raise ValueError("failure")
        try:
            started.set()
            await asyncio.Event().wait()
        finally:
            closed.append(value)
    try:
        await map_bounded(range(100), fail, capacity=1)
    except* ValueError:
        pass
    assert closed == [1]
    assert asyncio.all_tasks() == baseline, "failed group leaked tasks"
    ready = asyncio.Event()
    closed.clear()
    entered = 0
    async def held(value):
        nonlocal entered
        entered += 1
        if entered == 2:
            ready.set()
        try:
            await asyncio.Event().wait()
        finally:
            closed.append(value)
    owner = asyncio.create_task(map_bounded(range(100), held, capacity=1))
    await ready.wait()
    owner.cancel()
    try:
        await owner
    except asyncio.CancelledError:
        pass
    assert sorted(closed) == [0, 1]
    assert asyncio.all_tasks() == baseline

asyncio.run(check())`

const reportChecks = (
  module: string,
) => String.raw`from ${module} import summarize
from report import display
from pathlib import Path
from tempfile import TemporaryDirectory

class ObservedPath:
    def __init__(self, path):
        self.path = path
    def open(self, **options):
        self.handle = self.path.open(**options)
        return self.handle

with TemporaryDirectory() as directory:
    path = Path(directory) / "books.jsonl"
    for raw, expected in [("", {}), ("\n \n", {}), ('{"title":" River ","count":2}\n{"title":"river","count":3}\n{"title":"Hill","count":0}\n', {"river": 5, "hill": 0})]:
        path.write_text(raw, encoding="utf-8")
        source = ObservedPath(path)
        assert summarize(source) == expected
        assert source.handle.closed
    assert display({"river": 5, "hill": 0}) == "hill: 0\nriver: 5"
    assert display({}) == ""
    for bad in ["{", "[]", "{}", '{"title":" ","count":2}', '{"title":"River","count":true}', '{"title":"River","count":-1}', '{"title":"River","count":"2"}', "x" * 1025]:
        path.write_text('{"title":"River","count":1}\n' + bad, encoding="utf-8")
        source = ObservedPath(path)
        try:
            summarize(source)
        except ValueError as error:
            assert "line 2:" in str(error)
            assert source.handle.closed
            if len(bad) <= 1024:
                assert error.__cause__ is not None
        else:
            raise AssertionError("invalid record accepted")
    path.write_bytes(b"\xff")
    source = ObservedPath(path)
    try:
        summarize(source)
    except UnicodeDecodeError:
        assert source.handle.closed
    else:
        raise AssertionError("invalid encoding accepted")`

export const concurrentCases: PublishedCase[] = [
  {
    name: 'coroutine-and-task partial order',
    files: { 'main.py': 'coroutine-and-task-example' },
    entry: 'main.py',
    stdout:
      "created []\nwaiting ['start'] False\njoined ['start', 'finish'] 2\n",
  },
  {
    name: 'taskgroups sibling cancellation and cleanup',
    files: { 'main.py': 'taskgroups-and-cancellation-example' },
    entry: 'main.py',
    stdout: "['sibling:start', 'sibling:closed', 'owner:caught']\nTrue True\n",
  },
  {
    name: 'bounded workers admission failure and external cancellation',
    files: { 'bounded.py': 'bounded-async-work-example' },
    entry: 'bounded.py',
    checks: { 'check.py': boundedChecks },
    checkEntry: 'check.py',
    stdout: '',
    variants: [
      {
        checkEntry: undefined,
        checks: undefined,
        stdout: "[0, 2, 4, 6]\n{'workers': 2, 'max_queued': 2}\n",
      },
    ],
  },
  {
    name: 'thread outlives cancelled wrapper and stops cooperatively',
    files: { 'main.py': 'concurrency-and-parallelism-example' },
    entry: 'main.py',
    stdout: 'wrapper cancelled False\nthread stopped True\n',
  },
  {
    name: 'deterministic lost update and lock repair',
    files: { 'main.py': 'shared-state-and-locks-example' },
    entry: 'main.py',
    stdout: 'lost 1\nlocked 2\n',
  },
  {
    name: 'spawn isolation failure and process cleanup',
    files: {
      'process_main.py': 'process-boundaries-example',
      'process_work.py': 'process-boundaries-worker',
    },
    entry: 'process_main.py',
    stdout: 'result 29\nfailure negative input\nparent [2, 3]\nchildren 0\n',
  },
  {
    name: 'unittest actual displayed boundary tests',
    files: { 'main.py': 'unit-and-boundary-tests-example' },
    entry: 'main.py',
    stdout: '',
    stderr: /Ran 3 tests in [\d.]+s\s+OK/,
  },
  {
    name: 'diagnostic measurements without a speed assertion',
    files: { 'main.py': 'debug-and-measure-example' },
    entry: 'main.py',
    stdout: 'measured 3 True\nprofiled True\n',
  },
  {
    name: 'report entry and all boundary contracts',
    files: {
      'report.py': 'interview-capstone-example',
      'report_record.py': 'interview-capstone-validator',
      'books.jsonl': 'interview-capstone-input',
    },
    entry: 'report.py',
    args: ['books.jsonl'],
    stdout: 'hill: 0\nriver: 5\n',
    variants: [
      {
        checks: { 'check.py': reportChecks('report') },
        checkEntry: 'check.py',
        args: [],
        stdout: '',
      },
    ],
  },
  {
    name: 'cancel-join direct repair',
    files: { 'repair.py': 'taskgroups-and-cancellation-practice-solution' },
    entry: 'repair.py',
    stdout: '',
    variants: [
      {
        checks: {
          'check.py': String.raw`import asyncio
from repair import cancel_join, demo
async def check():
    await demo()
    async def broken():
        raise ValueError("child failure")
    child = asyncio.create_task(broken())
    try:
        await child
    except ValueError:
        pass
    try:
        await cancel_join(child)
    except ValueError as error:
        assert str(error) == "child failure"
    else:
        raise AssertionError("non-cancellation failure swallowed")
asyncio.run(check())`,
        },
        checkEntry: 'check.py',
        stdout: '',
      },
    ],
  },
  {
    name: 'locked counter direct repair',
    files: { 'repair.py': 'shared-state-and-locks-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'report direct repair',
    files: {
      'repair.py': 'interview-capstone-practice-solution',
      'report_record.py': 'interview-capstone-validator',
      'report.py': 'interview-capstone-example',
    },
    owns: ['interview-capstone-practice-solution'],
    entry: 'repair.py',
    checks: { 'check.py': reportChecks('repair') },
    checkEntry: 'check.py',
    stdout: '',
  },
]
export const concurrentFragments = [
  {
    id: 'taskgroups-and-cancellation-practice-starter',
    reason: 'Incomplete cancellation-owner interface.',
  },
  {
    id: 'shared-state-and-locks-practice-starter',
    reason: 'Incomplete locked-counter interface.',
  },
  {
    id: 'interview-capstone-practice-starter',
    reason: 'Incomplete streaming report interface.',
  },
]

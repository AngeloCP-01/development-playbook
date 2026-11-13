# Python study reference

Proposed 2026-11-13. The user requested assessment and design for Python with the
same goal as the completed Node.js & Express reference. The teaching goal is
selected; the topic structure and verification choices below are coordinator
proposals, awaiting design approval. This document does not authorize implementation.

## Reader outcome

The reader can explain a small Python program, trace its state, implement and
repair it, test failure cases and defend a changed constraint in an interview.
Teach fundamentals before terminology and interview questions. Use the Node
[depth design](2026-11-10-node-fundamentals-depth-design.md) as the quality bar,
not as a Python curriculum: Python needs its own binding, iteration, resource and
execution models. Keep representative interview practice distinct from employer
frequency rankings or a promise of interview success.

Scope checklist: inspect the placeholder and existing study contracts; consult
primary sources; choose teaching units and practice; specify actual-code and
page acceptance; record the implementation handoff after design selection.
Sources and their version limits live in [one research record](../../../reference/python-source-research.md).

## Approaches

A short syntax lookup would be easy to scan but would not supply the requested
reasoning or practice. A broad tutorial with a browser interpreter would require
new runtime/product behavior and distract from the current reader task.

Recommend a substantial, selective study sheet using existing StudySheet,
TeachingBlock and SheetActivity support. This follows the approach the user
referenced. Keep explanations local to each topic, with one small book-report
program providing continuity where it helps. Use separate, clearly introduced
examples when that story would obscure the mechanism. The coordinator recommends
this approach; no new runtime, interaction or complete-course requirement is inferred.

## Product and version boundaries

- Fill `/reference/python` in Languages. Keep the Python title and existing slug;
  introduce no numbered stage or stage tether. Python remains a reference.
- Compose structured data in `web/src/lib/cheatsheets/python.ts` and topic-family
  modules under `python/`. Remove only Python from `planned.ts` and register the
  new module in `index.ts`. Existing routing already handles study sheets.
- Web and generated `reference/cheatsheets.md` share that data. Expected totals:
  **29/31** references drawn, **18/18** stages; Java and Spring Boot remain empty.
  Other thirty generated sheet bodies must remain unchanged.
- Use current paragraphs, code, tables and interview teaching blocks, topic
  disclosures and independently hidden/revealed/re-collapsed solutions. No browser
  execution, scoring, persistent progress, service, package dependency or new
  renderer is proposed. Existing plain code rendering supports Python; do not
  send Python through the TypeScript-only highlighter or expand highlighting here.
- Target Python **3.12+ language/API compatibility**, with conventional GIL-enabled
  CPython as the execution baseline. Label implementation/build/platform details
  explicitly. Python 3.12 is security-supported according to the official version
  table checked on 2026-11-13; that does not make the local **3.12.7** a current patch.
  Implementation must provision a maintained patch for release evidence, record
  its exact executable/version and test the actual snippets there.
- Validate published examples on maintained 3.12 and current stable 3.15 runtimes
  in a focused CI matrix. Recheck support/patches at implementation. Do not silently
  require APIs introduced after 3.12. Free-threaded CPython is a labelled comparison,
  not a required runtime or a claim about every installation.
- Standard library only. No Django, Flask, FastAPI, NumPy, pandas, database,
  deployment service or complete Python DSA catalogue. Existing JavaScript DSA
  remains a companion for algorithm selection, with its language clearly identified.

## Teaching contract

Every substantive topic connects:

1. A concrete question, needed prerequisites and a plain mental model.
2. A small original worked program with imports, input and file/run context shown.
3. Intermediate state and reasons: bindings, container contents, iterator position,
   stack/error path, resource ownership or task state, whichever explains the result.
4. A contrast that changes one condition, then a mistake and explained repair.
5. A substantive interview answer and a separate transfer activity with solution
   reasoning. The exercise should require using the model, not recalling its label.

Define each unfamiliar term before the trace uses it. Do not use one generic
paragraph as the explanation for several different outcomes. Setup helpers may
not hide the copying, iteration, scheduling or cleanup mechanism being taught.
Visible panel orientation states what the reader will do and links prerequisites.
Teach basic Python syntax here; JavaScript knowledge is helpful but not required.

Give every topic one exclusively owned activity. At least ten activities must
require writing or repairing code, with executable, explained reference solutions.
Include alias/copy isolation, shared-default repair, closure binding, a lazy
pipeline, dataclass state isolation, exception cleanup, file decoding/record
validation, counting/grouping, async ownership/cancellation and the report capstone.
The remaining activities may ask for traces, counterexamples or justified choices.
The initial count is a coordinator acceptance choice, not a user quota or ceiling.

## Proposed sections

Initial composition: **14 panels / 45 topics / 45 owned activities**. Each topic
gets enough connected examples to teach its mechanism. Split at measured seams
rather than deleting explanations or forcing the count.

| Panel hash | Topic IDs | Required teaching and contrast |
| --- | --- | --- |
| `runtime-and-syntax` | `execution-basics`, `values-and-expressions`, `control-flow` | Python language versus CPython; script/REPL and traceback; indentation, literals, assignment, calls/return, expressions and operators; truthiness versus missing values, short circuiting, if/for/while, range, break/continue and loop-else. Trace a small input-to-report program. |
| `names-and-objects` | `binding-and-identity`, `mutation-and-copying`, `lifetime-and-resources` | Names refer to objects; argument binding and rebinding versus mutation; is versus equality and None; nested aliases, shallow copy and selective/deep copy; tuple contents and immutability; reachability versus explicit resource cleanup. No address/interning/GC-timing oracle. |
| `collections` | `sequences-and-slicing`, `mappings-and-sets`, `hash-and-equality`, `collection-costs` | Lists/tuples, slicing/unpacking and mutation; dict insertion order versus set order; missing keys, key views and mutation during iteration; hashability/equality contract including mutable members of tuples; qualified cost comparisons with size/collision assumptions. |
| `text-and-numbers` | `unicode-and-bytes`, `text-parsing`, `numeric-boundaries` | str/code points versus encoded bytes and grapheme caveat; explicit encode/decode/error policies; split/join/strip, formatted strings and bounded parsing; integer division/modulo including negative operands, integer growth, floating approximation/isclose and Decimal from strings. |
| `functions-and-scope` | `arguments-and-binding`, `defaults-and-state`, `lexical-scope`, `closures-and-decorators` | Positional/keyword arguments, / and *, variadics, unpacking and return; defaults evaluated at definition, None versus falsey values; local/enclosing/global/builtins and UnboundLocalError; closure late binding, explicit capture/factory repair, decorator expansion and functools.wraps. |
| `iteration-and-generators` | `iterable-and-iterator`, `lazy-pipelines`, `comprehensions-and-loop-tools` | iter/next/StopIteration; consumption and independent traversals; yield suspension/resumption and lifetime; eager list versus generator with actual consumption trace; comprehensions, enumerate, zip length assumptions, any/all short circuiting and readable alternatives. |
| `classes-and-protocols` | `instances-and-methods`, `inheritance-and-composition`, `protocols-and-special-methods`, `dataclasses-and-typing` | Class versus instance attributes, self and bound methods; initialization, property/classmethod/staticmethod; composition and a small super/MRO walkthrough; __repr__/__eq__/__hash__/__iter__, duck typing and NotImplemented; dataclass default_factory/frozen limits; annotations and Protocol do not validate untrusted runtime values. |
| `errors-and-cleanup` | `exception-flow`, `context-managers`, `validation-boundaries` | Raise/catch propagation, specific exceptions, else/finally and chained causes; cleanup on success/error/return; with enter/exit and suppression, contextmanager yield; explicit boundary validation, avoid broad swallowing and assertions as user-input checks. |
| `files-and-data` | `text-files-and-paths`, `json-and-records`, `streaming-report` | pathlib, text/binary open, encoding/newlines and with; JSON decoding versus shape/type/domain validation, empty/malformed files; bounded line-by-line report pipeline and ownership when a lazy producer outlives a closed file. No untrusted pickle or eval. |
| `modules-and-environments` | `imports-and-main`, `package-layout`, `environments-and-dependencies` | Module namespace/cache and import side effects; __name__/main guard, script versus -m, explicit two-file imports and cycle symptom; packages, relative imports and shadowing; interpreter/venv/python -m pip, dependency declarations versus reproducible resolution and supported interpreter choices. |
| `standard-library` | `counting-and-grouping`, `queues-and-heaps`, `ordering-and-search` | Counter/defaultdict with missing-key consequences; deque FIFO versus list front removal, min-heap invariant and portable 3.12 top-k; stable sorted/key versus in-place sort, bisect search versus insertion cost and comparison assumptions. Teach selection with data states rather than a helper inventory. |
| `asyncio` | `coroutine-and-task`, `taskgroups-and-cancellation`, `bounded-async-work` | Calling async def creates a coroutine; await versus scheduled task, suspension and blocking; TaskGroup ownership, sibling failure/ExceptionGroup, cancellation/finally and propagation; fixed worker count/bounded queue, backpressure and partial-order traces. Semaphore-only fan-out does not bound allocated tasks. |
| `threads-and-processes` | `concurrency-and-parallelism`, `shared-state-and-locks`, `process-boundaries` | Async tasks versus OS threads/processes, I/O versus Python CPU work, conventional GIL and free-threaded-build caveats; deterministic lost update and lock repair; explicit spawn context, top-level picklable worker/main guard, serialization and separate state, bounded executor lifecycle. No claimed speedup from tiny timings. |
| `testing-and-capstone` | `unit-and-boundary-tests`, `debug-and-measure`, `interview-capstone` | unittest/assertions and temp fixtures; arrange/action/result, invalid/empty/duplicate cases, limited mocking and cleanup; traceback/debugger/logging, timeit/profile and qualified complexity; implement/repair/test the book report, then change input, memory or concurrency constraints and explain the choice. |

## Teaching specimen: a shallow copy still shares a child

This original draft freezes the expected depth, not a second maintained lesson
source. It has not been executed in this design phase. Implementation must test
the published version. Sources: Python execution/data model and copy documentation
in the source record.

Question: **Why did adding a tag to the copied report change the original?**
Explain names, dictionaries and lists before showing this program as `copy_report.py`:

```python
original = {"title": "River", "tags": ["draft"]}
alias = original
copied = original.copy()
copied["title"] = "Hill"
copied["tags"].append("reviewed")
print(original["title"], original["tags"])
print(alias is original, copied is original)
```

Reasoned output: `River ['draft', 'reviewed']`, then `True False`.

| Operation | Outer dictionary | Child list | Why it matters |
| --- | --- | --- | --- |
| alias assignment | alias and original name the same dictionary | Its tags field refers to one list | Assignment makes another binding; it makes no copy. |
| copy() | copied names a new dictionary | Both dictionaries still refer to the tags list | Only the outer container was copied. |
| replace copied title | Only the new dictionary's title entry changes | No list change | Replacing an entry differs from changing the object stored there. |
| append through copied | Outer dictionaries stay distinct | The shared list changes | Looking through original reaches that same changed list. |

Change only the append to `copied["tags"] = ["reviewed"]`: explain why the
original list now stays unchanged. Then isolate the child intentionally:

```python
original = {"title": "River", "tags": ["draft"]}
isolated = {**original, "tags": original["tags"].copy()}
isolated["tags"].append("reviewed")
assert original["tags"] == ["draft"]
assert isolated["tags"] == ["draft", "reviewed"]
```

Explain the limit: this copies the tags list; if its elements were mutable
records, their children could still be shared. Introduce deepcopy with an
appropriate nested fixture and its ownership limits rather than prescribing it
for every object. Interview answer must distinguish binding, outer-container
copy and nested mutation. Transfer task: two independent report requests each
need a fresh tags list; repair shared state and prove isolation, then change
the schema to contain nested tag records and reconsider the repair.

## Published-example and runtime verification

A new language runtime is the consequential part of this implementation. Write
a compact plan after design approval; use behavioral TDD for the harness/coverage
contract and any changed shared behavior. No application code is part of this assessment.

- Collect actual teaching code, activity starters and solutions by stable IDs.
  A test-only manifest classifies every block: executable example/solution,
  intentional failure, setup command/config or explicit interface fragment. A
  missing/unclassified block must fail. Do not maintain alternate solved programs
  that could pass while the displayed examples are broken.
- The harness writes displayed multi-file groups to isolated temporary folders
  and executes an explicitly selected Python executable using argument arrays.
  Assert imports/input/setup, exit status, stdout where promised, stderr and
  observable state. Bound each child and clean descendants/temp resources on
  failure. Keep file/network access local and fixture-owned; no pip/network install
  while tests execute. Provision interpreters separately, never silently skip.
- Deliberate failures must fail for the stated reason. Traces check permitted
  partial orders when order is not promised. Use events, queues and handshakes
  instead of timing, GC collection, set order, memory addresses, hash seed or
  thread-scheduler luck as correctness evidence. Process examples run as files
  with explicit spawn and guarded entry, not pasted into an interactive REPL.
- Async failure tests must observe cancellation/cleanup and no abandoned work;
  bounded-work examples must prove their capacity contract. Classify cancellation
  of asyncio wrappers separately from termination of an already-running thread.
- Check code repairs with invalid/empty/nested inputs, shared-state isolation,
  iterator exhaustion, file cleanup after failure and cancellation paths. Use
  a selective wrong-copy, eager-generator or omitted-cleanup mutation when needed
  to establish that a consequential oracle can detect its intended regression.
- Prefer a narrow Python example job in `.github/workflows/ci.yml` with explicit
  maintained 3.12/3.15 setup, rather than rerunning the entire app suite per Python
  version. The compact plan must settle the harness command/env interface and
  runtime provisioning using current official action/runtime docs. Keep normal
  pnpm test meaningful locally: selected Python missing or incompatible is an
  actionable failure, not green skipped coverage. No main deployment change.

## Page and teaching acceptance

Preserve shared navigation/history, reveal/reset behavior, generated Markdown and
existing pages. Data invariants must establish exclusive ownership/stable IDs and
source/manifest coverage; meaningful PythonSheet render tests must independently
observe a binding/copy trace, lazy-consumption explanation, cleanup reasoning and
async ownership, with solutions hidden until revealed. Literal counts alone do
not prove that the page teaches these mechanisms.

Extend the existing audit/dev-console discovery and disclosure completeness
assertions for Python; keep Express/DSA behavior intact. Add focused checks for
all Python hashes/topics/solutions and back/reset transitions. Inspect affected
states in both themes, with keyboard access and representative 320/768/1440px
widths. Default and one-topic-open panels with solutions closed must meet the
existing four-screen budget at 1024x768. Measure names/objects, closures,
generators and async lessons early; split rather than cut reasoning. Use the
existing shared components/tokens; no visual redesign is proposed.

Run the final web gate once on the completed application tree: format, lint,
generated-route typecheck, tests (including actual Python), production build and
production audit, plus one dev-console sweep. State exact runtimes, commands,
results, commit/tree and limits. This research branch needs only content/link and
ledger checks, not another full web gate.

One independent final **GPT-6.1 Sol / High** review examines the actual source,
rendered page and example evidence. It must assess whether the reader can:

1. Trace aliasing and repair a nested-copy/shared-default bug.
2. Explain a closure's value after a loop and choose a capture strategy.
3. Predict consumption of an iterator twice and repair a reusable report pipeline.
4. Find the cleanup boundary when parsing or iteration fails.
5. Explain why annotations do not validate decoded JSON.
6. Contrast a coroutine object, awaited coroutine and owned concurrent task;
   repair cancellation or blocking without an unsupported scheduling claim.
7. Choose threads/processes/async for a changed workload and state build/platform limits.
8. Implement and test a small report from empty, malformed and duplicate records.

A source/page review is not a learner study. Return live names/objects and async
lessons for the user's depth feedback before recommending integration.

## Handoff and deferred scope

Starting application: **c768af4**, pushed develop. Assessment branch:
`docs/2026-11-13-python-study-assessment`. Research/design/coordination recommendation:
**GPT-6.1 Sol / High**. After design selection and a compact plan, use a fresh
user-selected **GPT-6.1 Sol / Medium** implementation session on
`feat/python-study-sheet`; return branch/commit, actual diff/checks, unresolved
issues and session reference to this coordinating conversation.

Defer implementation until the design is selected. Java/Spring Boot, broader
JavaScript/Node revisions, backend frameworks, scientific libraries, browser
execution, scoring/progress, new highlighting, images and universal interview
coverage remain separate. Merge approval is a separate user decision; main
promotion remains the user's. Keep user servers and unrelated scratch intact.

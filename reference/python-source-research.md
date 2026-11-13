# Python study reference: source research

Research date: 2026-11-13. Status: source assessment and teaching proposals. Reader
task: explain Python fundamentals, trace a small program, diagnose a failure, and
transfer the mechanism to a different problem.

User direction: match the depth goal of the Node/Express reference through mental
models, worked examples, intermediate traces, contrasts, repairs, substantive interview
explanations, and transfer activities. The lesson groupings below are coordinator
proposals, not additional user requirements or an interview-frequency ranking. No app
implementation, runtime upgrade, copied exercise, image, or executable verification is
included.

## Scope and evidence contract

- Checklist: verify support; read primary sources; identify mechanisms and
  misconceptions; propose original teaching examples; check links and prose.
- Proposed baseline: standard-library-only **Python 3.12+ fundamentals**. Local runtime
  inventory reports **Python 3.12.7**; no lesson examples were run here. Record the
  actual patch, implementation, platform, and build when examples run.
- The opened PSF developer-guide table lists **3.15 and 3.14 in bugfix support**,
  **3.13, 3.12, and 3.11 in security support**, and **3.10 as end-of-life** since
  2026-10-01. Its main branch targets 3.16. The opened downloads page lists **3.15.2**,
  dated 2026-10-25, and labels 3.16 a future pre-release. These are observed page
  claims, not a forecast based on the session date. [V1, V2]
- Versioned pages opened here identify **3.12.16** or **3.14.10**. A documentation patch
  label does not describe the coordinator's installed interpreter. Most core mechanisms
  below predate 3.12; verify published examples on maintained 3.12 and current stable
  3.15. Local 3.12.7 is inventory evidence only.
- Explicit version boundaries: free threading starts with an optional CPython 3.13
  build; process startup defaults changed in 3.14; task-creation options and annotation
  evaluation vary by release. Do not backport current-documentation signatures wholesale
  into a 3.12 lesson. [P2, P18, P22, P23]
- Every source below was actually opened on **2026-11-13**. Python documentation is
  maintained by Python contributors under the Python Software Foundation (PSF);
  packaging sources are maintained by the Python Packaging Authority (PyPA). Sources
  establish semantics, not interview prevalence or learning gains.

## Source register

| ID | Primary source, organization, version/context | Finding supported |
| --- | --- | --- |
| V1 | [Status of Python versions](https://devguide.python.org/versions/), PSF developer guide, living table | Supported branches, maintenance phases, scheduled release caveats. |
| V2 | [Python downloads](https://www.python.org/downloads/), PSF, observed release listing | Listed releases and dates; confirms observed 3.15 availability. |
| P1 | [Data model](https://docs.python.org/3.14/reference/datamodel.html), PSF, 3.14 | Identity/type/value, mutability, equality/hash contract, special methods; CPython details distinguished from language rules. |
| P2 | [Execution model](https://docs.python.org/3.14/reference/executionmodel.html), PSF, 3.14 | Name binding, local/free/global scope, UnboundLocalError; annotation scopes require version care. |
| P3 | [Copy operations](https://docs.python.org/3.14/library/copy.html), PSF, 3.14 | Assignment binds; shallow copies share children; deep copy uses memoization and may copy too much. |
| P4 | [Built-in types](https://docs.python.org/3.14/library/stdtypes.html), PSF, 3.14 | Truthiness, operand-returning Boolean operations, sequence/mapping/set semantics, insertion order. |
| P5 | [Control flow and functions](https://docs.python.org/3.14/tutorial/controlflow.html), PSF, 3.14 | Loop/range behavior, default evaluation, argument forms, positional-only and keyword-only parameters. |
| P6 | [Classes tutorial](https://docs.python.org/3.14/tutorial/classes.html), PSF, 3.14 | Namespaces, bound methods, class versus instance attributes, iterator/generator mechanisms. |
| P7 | [Compound statements](https://docs.python.org/3.14/reference/compound_stmts.html), PSF, 3.14 | Decorator application, with protocol, exception clauses and cleanup flow. |
| P8 | [Programming FAQ](https://docs.python.org/3.14/faq/programming.html), PSF, 3.14 | Late-bound loop closures, scope errors, shared mutable defaults. |
| P9 | [functools](https://docs.python.org/3.14/library/functools.html), PSF, 3.14 | wraps metadata, cache limits and hashable arguments; coherent caches can compute a result more than once. |
| P10 | [dataclasses](https://docs.python.org/3.14/library/dataclasses.html), PSF, 3.14 | Generated methods, default_factory, frozen limits, equality/hash configuration; annotations do not validate values. |
| P11 | [typing](https://docs.python.org/3.14/library/typing.html), PSF, 3.14 | Hints are not runtime enforcement; Protocol and runtime_checkable have different responsibilities. |
| P12 | [Errors and exceptions](https://docs.python.org/3.14/tutorial/errors.html), PSF, 3.14 | Matching handlers, else/finally, chaining, traceback interpretation. |
| P13 | [Input and output](https://docs.python.org/3.14/tutorial/inputoutput.html), PSF, 3.14 | Text/binary files, encoding, iteration and resource closure. |
| P14 | [contextlib](https://docs.python.org/3.14/library/contextlib.html), PSF, 3.14 | contextmanager lifecycle, re-raising errors, deterministic cleanup with closing/aclosing. |
| P15 | [Import system](https://docs.python.org/3.14/reference/import.html), PSF, 3.14 | Search plus binding, sys.modules caching, partially initialized modules and import side effects. |
| P16 | [venv](https://docs.python.org/3.14/library/venv.html), PSF, 3.14 | Interpreter/package isolation, disposable environments, activation optional, environments generally nonportable. |
| P17 | [Coroutines and tasks](https://docs.python.org/3.12/library/asyncio-task.html), PSF, 3.12 | Coroutine versus task, cooperative scheduling, TaskGroup, cancellation, timeout and to_thread. |
| P18 | [Coroutines and tasks](https://docs.python.org/3.14/library/asyncio-task.html), PSF, 3.14 | Cross-version task API differences and cleanup/cancellation cautions. |
| P19 | [threading](https://docs.python.org/3.14/library/threading.html), PSF, 3.14 | Shared-memory threads, synchronization, GIL-qualified CPU parallelism. |
| P20 | [collections](https://docs.python.org/3.14/library/collections.html), PSF, 3.14 | Counter, defaultdict, deque; explicit deque/list-endpoint complexity comparison. |
| P21 | [Data structures tutorial](https://docs.python.org/3.14/tutorial/datastructures.html), PSF, 3.14 | Comprehensions, unpacking, mutation methods, queue choice, traversal idioms. |
| P22 | [Free-threading HOWTO](https://docs.python.org/3.14/howto/free-threading-python.html), PSF, 3.14 | Optional build, actual GIL state, extension compatibility, explicit synchronization. |
| P23 | [multiprocessing](https://docs.python.org/3.14/library/multiprocessing.html), PSF, 3.14 | Process isolation/serialization, importable entry points, platform/start-method changes. |
| P24 | [Expressions](https://docs.python.org/3.12/reference/expressions.html), PSF, 3.12 | Evaluation, generator creation/resumption, yield and close lifecycle. |
| P25 | [Glossary](https://docs.python.org/3.12/glossary.html), PSF, 3.12 | Hashable, iterable, iterator, generator and annotation definitions. |
| P26 | [Introduction](https://docs.python.org/3.12/tutorial/introduction.html), PSF, 3.12 | Numeric division, strings/slicing, lists and interpreter examples. |
| P27 | [Floating-point limitations](https://docs.python.org/3.12/tutorial/floatingpoint.html), PSF, 3.12 | Binary approximation, display versus stored value, isclose and alternative number models. |
| P28 | [Sorting techniques](https://docs.python.org/3.12/howto/sorting.html), Andrew Dalke/Raymond Hettinger, PSF, 3.12 | Stable sorting, key functions, in-place sort versus new sorted list. |
| P29 | [heapq](https://docs.python.org/3.12/library/heapq.html), PSF, 3.12 | Min-heap invariant, priority-queue tie breakers, heap versus globally sorted sequence. |
| P30 | [bisect](https://docs.python.org/3.12/library/bisect.html), PSF, 3.12 | Insertion position, left/right ties, logarithmic search versus linear insertion. |
| P31 | [json](https://docs.python.org/3.12/library/json.html), PSF, 3.12 | Serialization boundaries, key coercion, decoder errors and resource limits. |
| P32 | [unittest](https://docs.python.org/3.12/library/unittest.html), PSF, 3.12 | TestCase assertions, exceptions, fixtures/cleanup, IsolatedAsyncioTestCase. |
| P33 | [Design FAQ](https://docs.python.org/3.12/faq/design.html), PSF, 3.12 | CPython dictionary hash-table mechanism; fast lookup explanation is implementation context. |
| P34 | [concurrent.futures](https://docs.python.org/3.12/library/concurrent.futures.html), PSF, 3.12 | A running Future cannot be cancelled; thread/process executor lifecycles. |
| K1 | [Installing packages](https://packaging.python.org/en/latest/tutorials/installing-packages/), PyPA, living guide | Interpreter-associated installation, package installation versus import, virtual environments. |
| K2 | [Writing pyproject.toml](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/), PyPA, living guide | Build backend requirements, project metadata/dependencies, dependency groups, tool configuration. |
| K3 | [Distribution versus import package](https://packaging.python.org/en/latest/discussions/distribution-package-vs-import-package/), PyPA, living guide | Distribution names and import names have no enforced one-to-one correspondence. |

## Teaching mechanisms and original example proposals

All snippets, expected states, repairs, interview prompts and activities below are
**original proposals, not executed examples**. Outcomes are reasoned from the cited
sources. They need runtime verification before becoming published answer keys. A
finished lesson should expose the trace before the explanation, then require the reader
to apply the mechanism to a changed input.

### 1. Syntax, control flow, text and numbers

Teach indentation and expression evaluation before compact idioms. Trace a three-record
loop with a rejected record, including the value of each condition and which statement
runs next. Contrast continue, break and a loop's else clause; do not describe loop else
as equivalent to an if else. [P5, P7, P26]

- Worked example: normalize three labels with strip and casefold, reject an empty
  result, then build a new output list. Show input, normalized text and branch.
- Contrast `value or fallback` with `fallback if value is None else value` when zero is
  meaningful. Trace short-circuit evaluation and the returned operand. [P4]
- Repair: replace a floating-point equality check for a measurement with a tolerance
  chosen for the domain. Explain why rounding the display does not repair stored
  approximation; use exact integer minor units for a separate explicitly bounded money
  example. Neither strategy fits every domain. [P27]
- Transfer: change positive division inputs to a negative input; explain `/`, floor
  division and remainder rather than memorize one output. [P26]

### 2. Names, identity, equality, mutation and copying

Use an object graph: names and container slots point to objects. Teach assignment,
parameter binding and return using the same graph. `is` tests identity; `==` uses
equality behavior. Avoid identity puzzles based on cached literals. [P1, P2]

```python
draft = {"tags": ["backend"]}
alias = draft
snapshot = draft.copy()
snapshot["tags"].append("python")
snapshot["owner"] = "Mira"
```

Trace three names, two dictionaries and one shared list. Adding owner changes only
snapshot; appending changes the shared tags. Contrast rebinding alias with mutating
draft. Repair by copying the nested field whose ownership should be independent; discuss
deep copy when recursive copying matches the contract. Deep copy preserves internal
sharing through its memo and is not a universal resource clone. [P3] Transfer to a tuple
holding a mutable list. [P1]

Interview explanation proposal: describe why a function can mutate the caller's list
while rebinding its parameter leaves the caller's name unchanged. Require a diagram and
a counterexample, not an unsupported pass-by-value/reference label.

### 3. Built-in collections, hashing, ordering and cost

Choose a list for ordered items, a mapping for keys, and a set for uniqueness.
Hashability requires a stable hash and compatible equality; a tuple can be unhashable
when it contains a list, and a mutable user instance can be hashable. Dictionary
insertion order is guaranteed; set iteration is not a sorting contract. Replacing an
existing key preserves its position. [P4, P25]

- Worked example: deduplicate labels while retaining first appearance. Trace both the
  seen membership structure and output sequence after each item.
- Repair `labels = labels.sort()` by choosing an in-place mutation or a new sorted
  result deliberately. Show equal-key stability with two records. [P21, P28]
- Contrast dictionary membership with scanning its values. Explain hash-table lookup
  using CPython context, with key hashing/equality costs and collisions; do not state
  that every dictionary operation has guaranteed constant cost. [P33]
- Transfer to an unhashable nested record and define a deliberate immutable key. Require
  the learner to explain what information that key discards. [P25]

### 4. Functions, defaults, scope and closures

Make definition time, call time and later invocation separate trace columns. Use `def
collect(label, bucket=None)` to discuss per-call allocation, then contrast an
intentionally shared cache. Defaults evaluate when the definition executes; the repair
allocates only when the sentinel indicates omission. If None is a valid supplied value,
use a dedicated sentinel. [P5, P8]

- Binding exercise: `def export(rows, /, *, limit=10)` with valid and invalid calls;
  distinguish collected `*args`/`**kwargs` from unpacking at a call. [P5]
- Closure example: callbacks created for three category labels all read one later
  binding. Repair using a factory or a default capturing the current object; capturing a
  mutable object still does not copy that object. [P8, P3]
- Scope repair: a function reads a name and later assigns it, producing an unbound-local
  failure. Prefer explicit input/return when appropriate; explain what global and
  nonlocal change before using either. [P2]
- Interview explanation: connect shared defaults and late-bound closures through their
  different evaluation times, then transfer to a timestamp default. [P5, P8]

### 5. Iterables, iterators, generators and decorators

Trace `iter(source)`, successive `next` calls, exhaustion and a second traversal. A
reusable iterable can produce fresh iterators; a generator object is an iterator whose
frame resumes at yield. Calling a generator function creates that object without running
its body. [P6, P24, P25]

- Worked example: lazily parse four sensor lines, request one result, then consume the
  remainder. Show cursor, suspended statement and parsed values.
- Repair two passes over one exhausted generator by choosing materialization or a
  factory according to memory and repeatability needs. A lazy pipeline still retains
  whatever its stages buffer and whatever the consumer stores.
- Resource contrast: yielding from inside with keeps the resource open while suspended.
  Early exit needs explicit ownership/closing; a plain break is not a universal
  generator-close operation. [P13, P14, P24]
- Decorator example: trace `report = audit(report)` at definition time, then wrapper
  entry, delegated result and wrapper exit at call time. Repair a wrapper missing its
  return and use wraps for metadata. Explain stacking order with two wrappers; do not
  assume a synchronous wrapper handles async work. [P7, P9]

### 6. Classes, data protocols, dataclasses and typing

Show one class object, two instances and their separate attribute mappings. Contrast a
shared class-level collection with per-instance state created in initialization;
demonstrate the explicit self in a bound-method call. [P6]

- Protocol example: make a small object iterable and trace the consumer's calls. Teach
  `__repr__`, `__len__`, `__iter__`, equality and hashing as behavioral contracts rather
  than a list of spellings. Keep descriptor/metaclass internals outside the first
  teaching pass. [P1, P6]
- Dataclass example: two reading batches receive separate list fields through
  default_factory. Trace generated initialization and compare two instances. Frozen
  blocks ordinary field assignment; it does not recursively freeze a list field or
  guarantee useful hashability. [P10]
- Typing contrast: a function's `count: int` annotation and a dataclass field annotation
  do not validate incoming JSON. Add explicit shape/value validation at the boundary;
  use Protocol to express a static capability contract. runtime_checkable checks
  presence, not full signature correctness. [P10, P11]
- Interview explanation: distinguish duck typing, structural static typing, nominal
  inheritance and runtime validation using the same tiny consumer. Transfer by supplying
  an object with the right method name but wrong behavior.

### 7. Exceptions, with, files and JSON

Trace successful parsing, malformed text, missing file and cleanup as separate paths.
Catch the specific recoverable failure near its policy decision; retain causal
information with chaining when translating an error. Explain else and finally from the
control-flow trace. [P12]

- Context-manager example: acquire a file, parse within with, then fail in the body.
  Trace enter, body failure and exit. A truthy exit result can suppress an exception; a
  with statement alone does not promise rollback. [P7, P14]
- File contrast: text decoding with an explicit encoding versus raw bytes; streaming
  lines versus reading everything. Do not rely on garbage collection for timely closure.
  [P1, P13]
- JSON repair: decode a syntactically valid record with a negative count or absent
  label. Separate decoding from domain validation; include wrong top-level shapes and
  parse errors. JSON round trips can change tuples to lists and non-string mapping keys
  to strings. Bound untrusted input size. [P31]
- Transfer: explain the different caller policies for absent optional input, corrupt
  input and permission failure; avoid broad catch-and-return-empty logic.

### 8. Imports, environments and packaging

Trace import as search, module creation/execution/cache and local name binding. Contrast
importing a module then reading its attribute with importing one name then rebinding the
module's attribute. Show why top-level work runs on first initialization and cycles can
expose partial state. [P15]

- Diagnosis proposal: the installer uses one interpreter while execution uses another.
  Inspect interpreter identity and its package context before changing sys.path; use
  interpreter-associated pip invocation. Activation adjusts command lookup and is
  optional when the environment interpreter is explicit. [P16, K1]
- Packaging explanation: distinguish import package, installable distribution, source
  tree, environment and built artifact. Names need not match. [K3]
- Repair a pyproject that puts runtime requirements in build-system requires. Explain
  project dependencies, build requirements and development groups as separate purposes.
  Metadata/ranges alone do not demonstrate a reproduced environment; do not invent a
  repository lock-tool policy. [K2]

### 9. Standard-library problem solving

Use one dispatch scenario to compare tools: Counter counts categories, deque holds
arrival order, a heap selects minimum priority, and bisect finds insertion positions in
an already sorted sequence. These solve different invariants. Trace each intermediate
structure with four original input records. [P20, P29, P30]

- Cost contrast: deque endpoints are approximately O(1); list pop(0) moves O(n)
  elements. Middle deque indexing is O(n), so it is not a general faster list. Bisect
  search is O(log n), but list insertion remains O(n). [P20, P30]
- Heap repair: add a unique increasing tie-break field so equal priorities do not
  require comparing unrelated payloads. A heap is not globally sorted; use its invariant
  to explain successive pops. Use the documented 3.12 min-heap API for the baseline
  example. [P29]
- Transfer: select the structure after changing requirements to ordered display,
  repeated priority removal, bounded recent history or exact membership.

### 10. Asyncio, cancellation, threads, processes and the GIL

Use a lifecycle trace with created coroutine, scheduled task, waiting, resumed,
finished/failed/cancelled. Sequential awaits and scheduled independent tasks express
different overlap. Cooperative scheduling can switch when awaiting work that suspends;
an await expression need not always suspend. Blocking work in a coroutine occupies the
loop's thread. Avoid universal print-order claims. [P17]

- Worked example: two simulated independent reads inside TaskGroup; trace work ownership
  through the group's exit. Contrast gather's default first-error propagation with
  TaskGroup's sibling cancellation and exit wait. [P17]
- Repair: cancellation is a request delivered through CancelledError at a later
  opportunity. Perform cleanup in finally and normally propagate cancellation. It
  subclasses BaseException. A timeout or task cancellation does not prove an external
  side effect was reversed. [P18]
- Thread contrast: to_thread can keep blocking I/O off the event loop; cancelling its
  await does not establish that running thread work stopped. Threads share memory and
  require synchronization for compound invariants. [P17, P19, P34]
- GIL explanation: qualify ordinary CPython versus other implementations and free-
  threaded builds. GIL-enabled execution restricts Python-code CPU parallelism; native
  code may release it. Free-threaded capability, runtime GIL state and extension
  compatibility are separate facts. Neither mode removes races. [P19, P22]
- Process contrast: separate memory, startup and serialization costs; top-level
  importable workers and guarded entry points. In 3.14 fork is no longer the default
  anywhere; platform/start-method rules need explicit testing. [P23]
- Transfer: choose a model for many waiting operations, legacy blocking I/O and CPU-
  heavy pure-Python work; explain resource bounds and failure ownership.

### 11. Tests and transfer assessment

Propose unittest cases for normal results, empty input, invalid records, aliasing and
cleanup after failure. Use assertRaises and observable state, fresh fixtures and cleanup
hooks; IsolatedAsyncioTestCase supports coroutine tests. [P32] For concurrency examples,
coordinate with explicit events/barriers rather than assert wall-clock speed or one
scheduler order. This is a teaching proposal, not a claim that any example or test
already passes.

Capstone proposal: a local JSON-lines reading summarizer with pure validation, streaming
iteration, category counts, deterministic display and specific errors. Then change one
requirement: repeat traversal, independent batch state, or parallel CPU analysis.
Require the learner to explain the changed design before editing. Avoid an unrelated
framework dependency that hides Python mechanisms.

## Delivery limits and handoff

The coordinator should select lesson boundaries and interview explanations; the
groupings here are source-backed material, not a fixed topic ceiling. Before publishing,
run every selected snippet and repair on the stated runtime, record actual
output/errors, verify version-specific behavior and check that each activity tests a
mechanism rather than literal recall. Confirm chosen complexity claims against their
implementation and assumptions; no benchmarks or universal collection-operation table
were established here.
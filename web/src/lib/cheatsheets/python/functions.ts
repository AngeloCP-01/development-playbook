import { family } from './lesson'
export const functions = family(
  'functions-and-scope',
  'Functions and scope',
  'Prerequisites: Runtime and syntax (#runtime-and-syntax) and Names and objects (#names-and-objects). Separate definition time, call time and later invocation. Predict argument binding before following defaults, scope and closures.',
  [
    {
      id: 'arguments-and-binding',
      title: 'Bind a call to an explicit interface',
      summary:
        'Use positional-only, keyword-only and collected arguments intentionally.',
      model:
        'In a definition, / ends positional-only parameters and * starts keyword-only parameters. *args collects extra positional values into a tuple; **kwargs collects extra named values into a dictionary. At a call, *sequence and **mapping instead unpack supplied values. These forms have opposite roles. Return can produce a tuple which the caller unpacks. Binding errors such as a duplicate argument or missing keyword-only argument raise TypeError before the body runs.',
      code: 'def export(rows, /, *tags, limit=2, **options):\n    return rows[:limit], tags, options\n\nrows = ["River", "Hill", "Lake"]\nselected, tags, options = export(rows, *["review"], **{"limit": 1, "format": "text"})\nprint(selected, tags, options)\ntry:\n    export(rows=rows)\nexcept TypeError:\n    print("positional rows required")\n\ndef count(rows, /, *, limit):\n    return len(rows[:limit])\nprint(count(rows, limit=0))',
      trace: {
        label: 'Collected arguments versus call unpacking',
        columns: ['Site', 'Binding', 'Result'],
        rows: [
          [
            'export call',
            'rows positional; tags=("review",); limit=1',
            'options contains format:text.',
          ],
          [
            'return tuple',
            'Caller unpacks three values',
            '["River"], ("review",), {"format":"text"}',
          ],
          [
            'export(rows=rows)',
            'rows positional-only parameter remains unbound',
            'TypeError before export body.',
          ],
          ['count limit=0', 'Required keyword supplied', 'Zero rows selected.'],
        ],
      },
      contrast:
        'Keyword-only parameters make optional policy readable at the call site. Positional-only parameters let an implementation rename internal parameters without exposing them as keyword names. Do not add *args/**kwargs to hide a poorly specified interface; accepting an option is different from validating or using it. A duplicate explicit keyword and unpacked keyword fails binding rather than silently choosing one.',
      question: 'What does * mean in a function interface versus a call?',
      answer:
        'In a definition it either gathers positional arguments or separates keyword-only parameters. In a call it expands a sequence of arguments. ** similarly gathers or expands named arguments. Trace the resulting parameter bindings before reasoning about the function body.',
      practice: {
        title: 'Make a limit explicit',
        prompt:
          'Design summarize(rows, …) so rows is positional-only and limit must be named. Give one valid call and one rejected call.',
        answer:
          'def summarize(rows, /, *, limit): ...; summarize(rows, limit=2) is valid; summarize(rows, 2) raises TypeError.',
        explanation:
          'The signature expresses the contract before implementation. Validation must still reject invalid limit types or negative limits if the domain requires that.',
      },
    },
    {
      id: 'defaults-and-state',
      title: 'Allocate per-call state at call time',
      summary:
        'A default expression runs once when def executes, not once per call.',
      model:
        'A function object stores its default argument objects when the definition executes. Omitting an argument reuses that stored object. A mutable list default therefore shares state across calls. None is a convenient omission sentinel when it is not meaningful input; test is None so a deliberately supplied empty list is retained. If None is legitimate input, use a unique object sentinel. The allocation belongs inside the function when each omitted call needs fresh state.',
      code: 'def shared(label, bucket=[]):\n    bucket.append(label)\n    return bucket\n\nfirst = shared("River")\nsecond = shared("Hill")\nprint(first, second, first is second)\n\ndef collect(label, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(label)\n    return bucket\n\na = collect("River")\nb = collect("Hill")\nprovided = []\nprint(a, b, a is b)\nprint(collect("Lake", provided) is provided, provided)',
      trace: {
        label: 'Definition time versus two calls',
        columns: ['Point', 'Default / local state', 'Visible effect'],
        rows: [
          [
            'def shared',
            'One default list allocated',
            'No label appended yet.',
          ],
          [
            'two shared calls',
            'Both omit bucket and reuse it',
            'Both results show River and Hill.',
          ],
          [
            'two collect calls',
            'Each omission enters the None branch',
            'a=[River], b=[Hill]; distinct lists.',
          ],
          [
            'provided=[]',
            'Argument is not None',
            'Caller’s list receives Lake intentionally.',
          ],
        ],
      },
      contrast:
        'bucket = bucket or [] discards a supplied empty list and breaks intentional caller ownership. A timestamp default such as now() also freezes at definition time; a call-time default needs explicit computation inside. Sharing can be deliberate for a cache, but then expose and test its lifetime, invalidation and concurrency policy instead of relying on an accidental list default.',
      question:
        'Why do mutable defaults and late-bound closures fail differently?',
      answer:
        'A default is evaluated when def executes, then reused for omissions. A closure reads an enclosing binding when its body later runs. Both involve time and references, but one stores an object early and the other performs a later name lookup. Copying or capturing must follow the intended ownership contract.',
      practice: {
        title: 'Repair a request-local accumulator',
        prompt:
          'Implement collect(label, bucket=None). Two omitted calls must be independent, while an explicitly supplied empty list must be mutated and returned.',
        starter:
          'def collect(label, bucket=None):\n    # TODO: preserve supplied empty containers\n    pass',
        solution:
          'def collect(label, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(label)\n    return bucket\n\na = collect("River")\nb = collect("Hill")\nprovided = []\nassert a == ["River"] and b == ["Hill"]\nassert a is not b\nassert collect("Lake", provided) is provided\nassert provided == ["Lake"]',
        answer:
          'Allocate only when bucket is None. Reuse caller-supplied containers intentionally.',
        explanation:
          'Two calls detect default sharing; the empty supplied list detects a falsey fallback that would otherwise look correct.',
      },
    },
    {
      id: 'lexical-scope',
      title: 'Find the local binding before the failing read',
      summary:
        'An assignment anywhere in the function makes that name local unless declared otherwise.',
      model:
        'Ordinary name lookup searches local, enclosing function, module global and built-in scopes. Python determines local bindings for a function from its code, not by waiting to see which statement executes first. Assigning count inside revise makes count local throughout revise. Reading it before its local assignment raises UnboundLocalError, a NameError subclass. global redirects binding to the module; nonlocal redirects it to an existing enclosing function binding. Prefer explicit input/result when that makes ownership clearer.',
      code: 'count = 10\ndef broken():\n    count = count + 1\n    return count\n\ntry:\n    broken()\nexcept UnboundLocalError:\n    print("local read before binding")\nprint(count)\n\ndef increment(value):\n    return value + 1\nprint(increment(count), count)\n\ndef counter():\n    value = 0\n    def step():\n        nonlocal value\n        value += 1\n        return value\n    return step\nstep = counter()\nprint(step(), step())',
      trace: {
        label: 'Lexical binding decisions',
        columns: ['Function', 'Lookup target', 'Result'],
        rows: [
          [
            'broken',
            'Local count, not module count',
            'Read occurs before local assignment; error.',
          ],
          ['module after broken', 'Global count remains bound', '10'],
          [
            'increment(count)',
            'value local to call',
            'Returns 11; global count still 10.',
          ],
          [
            'counter step twice',
            'One enclosing value via nonlocal',
            '1 then 2; retained closure state.',
          ],
        ],
      },
      contrast:
        'Adding global count would make broken modify module state, but introduces hidden coupling between callers. nonlocal is appropriate when the closure intentionally owns evolving state; it does not create a missing enclosing variable. Mutating an enclosing list via append needs no rebinding declaration because the operation changes an object instead of assigning the name.',
      question: 'Why does Python not fall back to the global count?',
      answer:
        'The assignment classifies count as local in this function. At the read, that local binding has no value yet, so lookup fails with UnboundLocalError. Repair the ownership model: pass and return a value, or explicitly declare shared scope when that is intended and tested.',
      practice: {
        title: 'Remove a hidden global dependency',
        prompt:
          'A module count is changed by many request functions. Repair increment so tests can supply a starting value, and explain how nonlocal differs from global.',
        answer:
          'Use increment(value) returning value + 1 and assign the result at the owner. nonlocal targets an enclosing function binding; global targets the module.',
        explanation:
          'Explicit inputs make each call independent. Scope declarations can support intentional shared state but do not provide synchronization or validation.',
      },
    },
    {
      id: 'closures-and-decorators',
      title: 'Separate late lookup from explicit capture',
      summary:
        'A closure retains bindings; a default can capture a current object without copying it.',
      model:
        'A closure is a function that can use bindings from an enclosing function after that outer call returns. Loop iterations usually rebind one loop name, so callbacks read its final value when invoked later. A default argument can capture the current object at function creation. Capturing a mutable object retains a reference, not a snapshot. A decorator is a callable applied at definition time: @audit above report is equivalent to report = audit(report). wraps copies metadata and exposes the wrapped function; the wrapper must still return its delegated result.',
      code: 'from functools import wraps\n\ndef callbacks():\n    late = []\n    captured = []\n    for name in ["River", "Hill"]:\n        late.append(lambda: name)\n        captured.append(lambda name=name: name)\n    return late, captured\nlate, captured = callbacks()\nprint([f() for f in late], [f() for f in captured])\nstate = []\nkeep = lambda state=state: state\nstate.append("changed")\nprint(keep())\n\ndef audit(fn):\n    @wraps(fn)\n    def wrapped(*args, **kwargs):\n        print("enter")\n        return fn(*args, **kwargs)\n    return wrapped\n\n@audit\ndef report(title):\n    return title.upper()\nprint(report("River"), report.__name__)',
      trace: {
        label: 'Creation, rebinding and later calls',
        columns: ['Time', 'Retained object / binding', 'Outcome'],
        rows: [
          [
            'Loop builds late callbacks',
            'Both refer to one name binding',
            'After loop both read Hill.',
          ],
          [
            'Default capture',
            'Each default holds the current string',
            'River then Hill.',
          ],
          [
            'Mutable default capture',
            'keep holds state’s list reference',
            'Later append is visible.',
          ],
          [
            'Decorator definition / call',
            'report becomes wrapped; fn retains original',
            'enter, then RIVER; metadata name report.',
          ],
        ],
      },
      contrast:
        'A factory can give each callback a fresh enclosing binding instead of using a default. Neither method automatically copies nested data. Removing return from wrapped loses the result even with wraps. With @outer above @inner, decoration is outer(inner(fn)); call behavior follows the wrappers’ own bodies. A synchronous wrapper does not automatically await an async function or own its task lifetime.',
      question: 'What exactly did the closure capture?',
      answer:
        'For the late callbacks it retains access to the enclosing name binding, so later invocation reads its final object. For default capture it stores the object evaluated at creation. Immutable strings make that look like a value snapshot; mutating a captured list shows the retained-reference limit. A factory or explicit copying must match the intended semantics.',
      practice: {
        title: 'Build independent callbacks and preserve returns',
        prompt:
          'Implement make_readers(records) so later nested label mutations do not affect callbacks. Repair the audit wrapper so it returns the delegated value and retains metadata.',
        starter:
          'def make_readers(records):\n    # TODO: one independent nested snapshot per callback\n    pass\n\ndef audit(fn):\n    # TODO: preserve return and metadata\n    pass',
        solution:
          'from copy import deepcopy\nfrom functools import wraps\n\ndef make_readers(records):\n    return [lambda record=deepcopy(record): record for record in records]\n\ndef audit(fn):\n    @wraps(fn)\n    def wrapped(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapped\n\nsource = [{"labels": ["River"]}, {"labels": ["Hill"]}]\nreaders = make_readers(source)\nsource[0]["labels"].append("changed")\nassert [read()["labels"] for read in readers] == [["River"], ["Hill"]]\n@audit\ndef double(value):\n    return value * 2\nassert double(3) == 6 and double.__name__ == "double"',
        answer:
          'Capture a fresh deep-copied record as each default and return the wrapped call result. wraps handles metadata, not return propagation.',
        explanation:
          'The nested mutation proves snapshot isolation. The wrapper’s value test catches a missing return that metadata checks alone cannot detect.',
        followUp:
          'If callers may mutate the value returned by a reader, does this promise a fresh snapshot per read or only one private snapshot per callback?',
      },
    },
  ],
)

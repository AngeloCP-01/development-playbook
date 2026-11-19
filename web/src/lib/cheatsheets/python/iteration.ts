import { family } from './lesson'
export const iteration = family(
  'iteration-and-generators',
  'Iteration and generators',
  'Prerequisites: Collections (#collections) and Functions and scope (#functions-and-scope). Trace one item request at a time. Decide whether two report passes should retain values or create fresh traversals; resource ownership is developed in Files and data (#files-and-data).',
  [
    {
      id: 'iterable-and-iterator',
      title: 'Track the cursor through exhaustion',
      summary:
        'A reusable iterable can create fresh iterators; one iterator is one advancing traversal.',
      model:
        'An iterable can supply an iterator through iter(value). An iterator supplies successive items through next(iterator) and raises StopIteration when finished. for hides that protocol and stops on StopIteration. A list is reusable because iter(list) creates a fresh cursor. An iterator’s iter returns itself; asking it to iterate again does not rewind it. next(iterator, default) supplies a fallback instead of raising on exhaustion.',
      code: 'values = [2, 4, 6]\ncursor = iter(values)\nprint(next(cursor))\nprint(list(cursor))\nprint(list(cursor))\nprint(next(cursor, "done"))\nprint(list(values), list(values))\nprint(iter(cursor) is cursor)',
      trace: {
        label: 'One advancing cursor',
        columns: ['Request', 'Cursor position', 'Returned values'],
        rows: [
          ['iter(values)', 'Before first item', 'No item consumed.'],
          ['next(cursor)', 'After 2', '2'],
          ['list(cursor)', 'Exhausted after 6', '[4, 6]'],
          ['list(cursor) again', 'Still exhausted', '[]; no rewind.'],
          ['iter(values) again', 'Fresh cursor', 'Can visit 2, 4, 6 again.'],
        ],
      },
      contrast:
        'Materializing list(cursor) once stores only its remaining items and lets that resulting list be traversed repeatedly. A factory that calls iter(values) or reopens a source avoids keeping every parsed result, but the underlying source may change or have side effects. Choose repeatability and memory semantics explicitly; calling iter on the same exhausted generator does not repair it.',
      question: 'Why did my second report pass see zero records?',
      answer:
        'Both passes shared one advancing iterator. The first consumed it to exhaustion, leaving no items for the second. Materialize once if memory permits, or supply a factory that creates a fresh traversal. A factory also needs a source-consistency policy if the input can change between passes.',
      practice: {
        title: 'Make two report passes repeatable',
        prompt:
          'Implement two_pass(factory): sum one traversal, then count a second fresh traversal. Test an empty source and [2,4,6]. Explain why two_pass(lambda: cursor) is still broken.',
        starter:
          'def two_pass(factory):\n    # TODO: request independent traversals\n    pass',
        solution:
          'def two_pass(factory):\n    total = sum(factory())\n    count = sum(1 for _ in factory())\n    return total, count\n\nassert two_pass(lambda: iter([2, 4, 6])) == (12, 3)\nassert two_pass(lambda: iter([])) == (0, 0)',
        answer:
          'Call the factory separately for each pass. It must return a fresh traversal rather than one shared cursor.',
        explanation:
          'The factory interface separates creation from consumption. Returning the same exhausted iterator merely renames the bug.',
        followUp:
          'If input can change between passes, would one materialized snapshot better match the contract?',
      },
    },
    {
      id: 'lazy-pipelines',
      title: 'Resume a generator at the demand boundary',
      summary:
        'Calling a generator function creates an iterator; next starts or resumes its body.',
      model:
        'A function containing yield is a generator function. Calling it creates a generator object without executing its body. next resumes its frame until the next yield; local state survives suspension. A generator expression similarly delays its element computation until consumption, though its outer iterable expression is evaluated at creation. Laziness changes when errors and side effects happen; it does not guarantee bounded memory if a stage or consumer buffers all values.',
      code: 'def parse(lines):\n    for line in lines:\n        print("parse", line)\n        yield int(line)\n\nvalues = parse(["2", "4", "6"])\nprint("created")\nprint("first", next(values))\nprint("rest", list(values))\nprint("again", list(values))\n\neager = [int(line) for line in ["2", "4"]]\nprint("eager", eager)',
      trace: {
        label: 'Demand controls parsing',
        columns: ['Caller action', 'Producer frame', 'Visible output'],
        rows: [
          [
            'parse(...)',
            'Created; body has not run',
            'created precedes every parse line.',
          ],
          [
            'next(values)',
            'Loop reads "2" and suspends at yield',
            'parse 2, then first 2',
          ],
          [
            'list(values)',
            'Resumes after yield, reads remaining lines',
            'parse 4, parse 6, then rest [4, 6]',
          ],
          ['second list(values)', 'Exhausted', 'again []'],
        ],
      },
      contrast:
        'Replacing the generator with a list comprehension parses all lines immediately, including a bad late line the caller never intended to request. A lazy producer can keep a file open while suspended; break alone does not promise to close it. The consumer must own a context or explicitly close the generator, as the streaming lesson shows. Iteration itself is synchronous here; yield is not an asyncio scheduling operation.',
      question:
        'Where will an invalid third line fail if the caller only asks for one result?',
      answer:
        'It will not be parsed yet in this generator. The failure occurs when demand reaches that line. An eager comprehension fails while building the list. The difference affects error timing, resource lifetime and which inputs a partial consumer actually inspects.',
      practice: {
        title: 'Keep parsing demand-driven',
        prompt:
          'Implement integers(lines) lazily. next on ["2", "bad"] must return 2 without failing; the next request must raise ValueError. Explain where to validate the entire file if all-or-nothing acceptance is required.',
        starter:
          'def integers(lines):\n    # TODO: yield one conversion per requested line\n    pass',
        solution:
          'def integers(lines):\n    for line in lines:\n        yield int(line)\n\nvalues = integers(["2", "bad"])\nassert next(values) == 2\ntry:\n    next(values)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("second conversion must fail")',
        answer:
          'Yield conversions inside the loop. Complete validation requires complete traversal before publishing an all-or-nothing result.',
        explanation:
          'The test distinguishes a lazy generator from an eagerly computed list wrapped in iter. Success of one requested item does not certify unseen input.',
      },
    },
    {
      id: 'comprehensions-and-loop-tools',
      title: 'Keep compact traversal honest about consumption',
      summary:
        'enumerate, zip and short-circuit consumers expose different traversal contracts.',
      model:
        'A list comprehension constructs a new list from an iterable and optional filter. A generator expression supplies results lazily. enumerate pairs an increasing index with each item. zip pairs items from multiple inputs and normally stops at the shortest; strict=True rejects unequal lengths. any stops at the first truthy result; all stops at the first falsey result. Empty any is False; empty all is True. Side effects inside predicates can expose which items were inspected.',
      code: 'titles = ["River", "", "Hill"]\nprint([(i, title.upper()) for i, title in enumerate(titles, start=1) if title])\nseen = []\ndef valid(value):\n    seen.append(value)\n    return value > 0\nprint(all(valid(n) for n in [1, 0, 2]), seen)\nprint(any([]), all([]))\nprint(list(zip(["River", "Hill"], [2])))\ntry:\n    list(zip(["River", "Hill"], [2], strict=True))\nexcept ValueError:\n    print("length mismatch")',
      trace: {
        label: 'Compact forms still have stopping rules',
        columns: ['Consumer', 'Inspected state', 'Result'],
        rows: [
          [
            'enumerate then filter',
            'Indices assigned before blank is removed',
            '[(1, RIVER), (3, HILL)]',
          ],
          ['all generator', '1 then 0; 2 never tested', 'False; seen=[1,0]'],
          ['empty consumers', 'No predicate runs', 'any=False; all=True'],
          [
            'zip default / strict',
            'Shortest stops / mismatch rejected',
            'One pair / ValueError',
          ],
        ],
      },
      contrast:
        'all([valid(n) for n in values]) builds the entire list before all can short circuit. zip without strict may silently drop an unmatched record, which is wrong when lengths must agree. For complex validation with line numbers and error policies, a normal loop is often clearer than a nested comprehension. Readability and consumption behavior both matter.',
      question: 'Can all validate every item for side effects?',
      answer:
        'Not when fed a lazy iterable and a false result occurs early. It answers a Boolean question and stops when that answer is known. Use an explicit full traversal to collect every validation error. Also decide whether an empty collection is valid; all’s mathematical empty result does not settle your domain policy.',
      practice: {
        title: 'Find every invalid row',
        prompt:
          'You need all invalid indices, including after the first failure. Replace an all-based validator and reject unequal title/count inputs.',
        answer:
          'Collect indices in an explicit loop or list comprehension, and pair inputs with zip(..., strict=True). Handle the mismatch as a separate validation error.',
        explanation:
          'A Boolean aggregate cannot report all errors after short circuiting. Strict zip makes the length precondition executable.',
      },
    },
  ],
)

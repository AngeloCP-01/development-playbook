import { family } from './lesson'
export const runtime = family(
  'runtime-and-syntax',
  'Runtime and syntax',
  'Start here without JavaScript prerequisites. Read assignment, calls and indentation before tracing the report. Python is the language; CPython is one implementation. All worked .py files use standard-library Python 3.12+; fixtures and multi-file layouts are labelled. Later panels link back to the mechanisms they need.',
  [
    {
      id: 'execution-basics',
      title: 'Follow a script through calls and returns',
      summary:
        'Separate a function definition from the call that runs its body.',
      model:
        'Save this as execution-basics.py and run python3 execution-basics.py from its directory. A script executes top-level statements in order. def creates a function; its indented body runs when called. Parameters are local names bound to the supplied objects. return passes a result to the caller; reaching the end returns None. print writes a representation for a person. CPython compiles Python to internal bytecode and executes it; that implementation detail does not change the language meaning.',
      code: 'def label(title):\n    cleaned = title.strip()\n    return cleaned.upper()\n\nraw = "  River  "\nresult = label(raw)\nprint(result)\nprint(raw)',
      trace: {
        label: 'Call and return boundary',
        columns: ['Statement', 'State', 'Reason'],
        rows: [
          [
            'def label',
            'label refers to a function',
            'The body has not cleaned any input yet.',
          ],
          [
            'label(raw)',
            'title names "  River  "; cleaned is "River"',
            'strip returns a new string.',
          ],
          [
            'return / print',
            'RIVER then the original padded title',
            'Returning does not rebind raw in the caller.',
          ],
        ],
      },
      contrast:
        'Change return cleaned.upper() to print(cleaned.upper()). The inner print still displays RIVER, but result becomes None and the outer print displays None. Indentation defines the body: moving return outside the function is a SyntaxError. For an exception, read the traceback from the final exception type/message back through the listed calls; the listed frames show the failing call path.',
      question:
        'What runs when a function is defined, and what runs when it is called?',
      answer:
        'The definition creates and binds a callable object; later calls bind arguments and execute the body. The caller resumes with the returned object. Printing is an observable side effect, so replacing return with print changes both the result and output contract. A REPL also displays expression results, which can hide a missing explicit print in a script.',
      practice: {
        title: 'Return a reusable label',
        prompt:
          'A formatter prints its result and a caller stores None. Repair the interface and explain how a nested call would appear in a traceback.',
        answer:
          'Return the formatted string, and let the entry script print it. A traceback contains the caller and failing callee frames, ending in the exception type and message.',
        explanation:
          'Keeping the value separate from presentation lets tests compare it and lets another function reuse it. A successful print alone does not prove the return contract.',
      },
    },
    {
      id: 'values-and-expressions',
      title: 'Keep zero distinct from missing',
      summary:
        'Trace truthiness, short circuiting and operand results before choosing a fallback.',
      model:
        'An expression produces a value: 2 + 3 produces an integer; a comparison produces a Boolean. Assignment binds the name on the left to the evaluated object. None represents absence by convention. False, numeric zero and empty containers are falsey; they still may be valid supplied values. and/or short circuit and return an operand, rather than always returning True or False. Use is None for the absence sentinel.',
      code: 'def limit(value):\n    return 10 if value is None else value\n\nfor value in [None, 0, 3]:\n    print(value, value or 10, limit(value))\n\ndef read():\n    print("read")\n    return 4\n\nprint(False and read())\nprint("ready" or read())',
      trace: {
        label: 'Fallback and evaluation decisions',
        columns: ['Input', 'or fallback', 'Explicit absence'],
        rows: [
          ['None', '10', '10'],
          ['0', '10', '0; zero was supplied'],
          ['3', '3', '3'],
          [
            'False and read()',
            'False; no read output',
            'Right operand was skipped.',
          ],
          [
            '"ready" or read()',
            'ready; no read output',
            'First truthy operand is returned.',
          ],
        ],
      },
      contrast:
        'Replacing the None test with if not value merges absence with an intentional zero. Conversely, checking only None does not validate a negative limit or a wrong type: missing-value policy and domain validation are separate. Parentheses can clarify precedence when comparisons and Boolean operators mix; avoid compact conditions whose evaluation order you cannot explain.',
      question: 'Why is value or default a bug in a pagination limit?',
      answer:
        'It is a bug when zero has a domain meaning, because or uses truthiness and discards it. Test the chosen sentinel explicitly and validate the retained value separately. If None itself is meaningful data, choose a unique sentinel object for omission instead.',
      practice: {
        title: 'Preserve a disabled threshold',
        prompt:
          'A configuration threshold accepts 0 to disable an alert and None for the default. Predict both fallback forms for 0, then write the correct expression.',
        answer:
          'default if threshold is None else threshold preserves zero. threshold or default replaces it.',
        explanation:
          'The condition expresses absence directly; it does not conflate an empty value with a missing one.',
      },
    },
    {
      id: 'control-flow',
      title: 'Distinguish rejection, stopping and exhaustion',
      summary:
        'Trace indentation, for/range, continue, break and a loop’s else.',
      model:
        'if chooses a branch; for requests items from an iterable; while repeats while its condition is truthy. A colon starts a suite whose indentation defines membership. range(3) supplies 0, 1, 2: its stop is excluded. continue skips the remaining body for this item. break exits the nearest loop. A loop else runs when the loop finishes without break, including an empty traversal; it is not paired with the body’s if.',
      code: 'titles = [" River ", " ", "Hill"]\nreport = []\nfor raw in titles:\n    title = raw.strip()\n    if not title:\n        continue\n    report.append(title)\nelse:\n    print("exhausted")\nprint(report)\n\nfor index in range(3):\n    if index == 1:\n        break\nelse:\n    print("not reached")\nprint(index)\n\nremaining = 2\nwhile remaining > 0:\n    remaining -= 1\nprint(remaining)',
      trace: {
        label: 'Rejected input still permits exhaustion',
        columns: ['raw / phase', 'Action', 'report / state'],
        rows: [
          ['" River "', 'strip, accept, append', '["River"]'],
          ['" "', 'empty title; continue', '["River"] unchanged'],
          [
            '"Hill"',
            'append, then exhaust',
            '["River", "Hill"]; else prints exhausted',
          ],
          ['range reaches 1', 'break', 'No loop else; index remains 1.'],
          ['while', '2 → 1 → 0', 'Condition becomes false.'],
        ],
      },
      contrast:
        'Change continue to break: Hill is never inspected and exhausted is not printed. With titles = [], else still runs because no break occurred. A while loop whose body never changes its condition can run forever; identify which state must advance before using it for input processing.',
      question:
        'How would you search for an invalid record and report success only if none exists?',
      answer:
        'Break when an invalid record is found; put the success path in the loop else. The else means no early break, not that every body if was false. For a more involved policy, an explicit found flag or a separate function returning a result may be clearer.',
      practice: {
        title: 'Change the rejection policy',
        prompt:
          'The input is [" ", "River"]. First skip invalid titles, then change the requirement to stop at the first invalid title. Give the report and whether else runs in each version.',
        answer:
          'continue yields ["River"] and runs else. break yields [] and skips else.',
        explanation:
          'continue advances to another item; break ends traversal. Empty input still exhausts, which is a separate case to test.',
      },
    },
  ],
)

import { family } from './lesson'
export const errors = family(
  'errors-and-cleanup',
  'Errors and cleanup',
  'Prerequisites: Functions and scope (#functions-and-scope), Classes and protocols (#classes-and-protocols). Follow success and failure paths separately. Put recovery policy at the boundary that can decide it, and cleanup at the boundary that owns the resource.',
  [
    {
      id: 'exception-flow',
      title: 'Trace propagation, translation and finally',
      summary:
        'Specific handlers recover deliberately; chained errors retain the original cause.',
      model:
        'raise interrupts ordinary execution and searches outward for a matching except handler. A handler for ValueError also catches its subclasses. else runs only if the try suite finishes without an exception; keep it small so unrelated errors do not get mislabeled. finally runs as control leaves the construct, including return and exceptions. raise NewError(...) from error translates a boundary failure while preserving its cause. Avoid returning from finally: it can replace a pending result or suppress a failure.',
      code: 'def parse(raw):\n    try:\n        value = int(raw)\n    except ValueError as error:\n        raise ValueError("invalid count") from error\n    else:\n        print("converted", value)\n        return value\n    finally:\n        print("leave parse")\n\nprint("value", parse("2"))\ntry:\n    parse("bad")\nexcept ValueError as error:\n    print(str(error), type(error.__cause__).__name__)',
      trace: {
        label: 'Specific error paths',
        columns: ['Input', 'Path', 'Observable result'],
        rows: [
          [
            '"2"',
            'try succeeds → else → finally → caller',
            'converted 2; leave parse; value 2',
          ],
          [
            '"bad"',
            'int raises → except translates → finally → caller handler',
            'leave parse; invalid count ValueError',
          ],
          [
            'Unrelated TypeError',
            'No ValueError handler matches',
            'finally still runs; TypeError propagates.',
          ],
        ],
      },
      contrast:
        'A broad except Exception: return 0 would turn invalid input and programmer defects into a plausible count. Catch only failures the boundary can handle. Bare raise in a handler preserves the active exception; raise from creates an explicit causal relationship. Assertions can be disabled with optimization, so do not use assert to validate untrusted input; use explicit exceptions.',
      question: 'Where should a parser catch an exception?',
      answer:
        'At a boundary with a defined recovery or translation policy. The parser may translate a low-level conversion failure into a domain error with its cause, while a caller chooses whether to reject a record or stop the report. Cleanup belongs in finally or with so it does not depend on which handler matches.',
      practice: {
        title: 'Preserve an invalid-count cause',
        prompt:
          'Repair a function that catches everything and returns zero. Invalid integer text should become ValueError("invalid count") with the conversion error as cause; a wrong input type must still propagate TypeError.',
        answer:
          'Catch ValueError around int only and raise the domain ValueError from the caught exception. Do not catch TypeError unless the boundary explicitly handles it.',
        explanation:
          'Zero is valid data, so silently returning it would erase the difference between a count and a rejected record. Chaining preserves diagnostics without exposing them as user-facing success.',
      },
    },
    {
      id: 'context-managers',
      title: 'Give cleanup a defined exit boundary',
      summary:
        'with invokes the exit protocol even when the body raises or returns.',
      model:
        'A context manager implements entry/exit behavior for a with block. contextlib.contextmanager lets a generator define it: code before yield acquires and supplies the resource; execution after yield runs when the body exits. The body’s exception is thrown back at yield. Put unconditional cleanup in finally and let failures propagate unless suppression is an intentional policy. This in-memory file makes closed state observable without collection timing.',
      code: 'from contextlib import contextmanager\nfrom io import StringIO\n\n@contextmanager\ndef opened(text):\n    handle = StringIO(text)\n    try:\n        yield handle\n    finally:\n        handle.close()\n        print("closed", handle.closed)\n\nwith opened("2") as good:\n    print(int(good.read()))\ntry:\n    with opened("bad") as bad:\n        int(bad.read())\nexcept ValueError:\n    print("rejected", bad.closed)',
      trace: {
        label: 'Cleanup across success and failure',
        columns: ['Path', 'Body state', 'Exit boundary'],
        rows: [
          [
            'Success',
            'Reads 2 and prints it',
            'finally closes the handle before normal continuation.',
          ],
          [
            'Conversion failure',
            'ValueError leaves body',
            'finally closes the handle before propagation.',
          ],
          [
            'Caller catches',
            'bad still refers to object',
            'rejected True proves closed resource.',
          ],
        ],
      },
      contrast:
        'A truthy __exit__ result suppresses an exception; a contextmanager generator that catches the body error and finishes without re-raising also suppresses it. with does not promise rollback or successful validation. Move a return inside the with body and cleanup still runs. Keep cleanup code small: a new exception in cleanup can obscure the original failure, although Python retains exception context.',
      question: 'How can a context manager accidentally hide a parser failure?',
      answer:
        'Its exit method may return a truthy value, or a contextmanager generator may swallow the exception injected at yield. The caller then continues as if the body succeeded. Put closure in finally and re-raise body errors unless a documented suppression policy applies.',
      practice: {
        title: 'Close on failure without swallowing it',
        prompt:
          'Implement managed(text) as a context manager yielding StringIO. Verify closure after a successful read, a ValueError in the body and an early return. The caller must observe the ValueError.',
        starter:
          'from contextlib import contextmanager\n\n@contextmanager\ndef managed(text):\n    # TODO: acquire, yield and close without suppression\n    pass',
        solution:
          'from contextlib import contextmanager\nfrom io import StringIO\n\n@contextmanager\ndef managed(text):\n    handle = StringIO(text)\n    try:\n        yield handle\n    finally:\n        handle.close()\n\nwith managed("ok") as good:\n    assert good.read() == "ok"\nassert good.closed\ntry:\n    with managed("bad") as bad:\n        raise ValueError("body")\nexcept ValueError as error:\n    assert str(error) == "body" and bad.closed\nelse:\n    raise AssertionError("body failure was swallowed")\n\ndef early():\n    with managed("early") as handle:\n        return handle\nassert early().closed',
        answer:
          'Use try/finally around yield, closing unconditionally and leaving propagation intact.',
        explanation:
          'The caller’s handler proves the body error survived. Checking closed alone would miss an exit method that hides failures.',
      },
    },
    {
      id: 'validation-boundaries',
      title: 'Validate shape, exact type and domain',
      summary:
        'Annotations and decoding do not establish that external values are acceptable.',
      model:
        'A boundary receives data from outside your trusted model. Validation checks what that model needs: container shape, required fields, types and value restrictions. A JSON Boolean becomes Python bool, which is a subclass of int; isinstance(value, int) accepts True. If counts must be integers excluding booleans, type(value) is int expresses that choice. Reject invalid values with explicit exceptions. Keep permissive conversion separate from a strict data contract.',
      code: 'def validate_count(record):\n    if not isinstance(record, dict):\n        raise ValueError("object required")\n    count = record.get("count")\n    if type(count) is not int or count < 0:\n        raise ValueError("nonnegative integer count required")\n    return count\n\nfor record in [{"count": 0}, {"count": True}, {"count": -1}, {}, []]:\n    try:\n        print("accepted", validate_count(record))\n    except ValueError as error:\n        print("rejected", error)',
      trace: {
        label: 'Boundary decisions before computation',
        columns: ['Decoded value', 'Validation', 'Outcome'],
        rows: [
          ['{"count":0}', 'Exact int and nonnegative', 'accepted 0'],
          [
            '{"count":True}',
            'bool excluded by exact-type contract',
            'rejected',
          ],
          ['{"count":-1}', 'Type correct; domain wrong', 'rejected'],
          [
            '{} / []',
            'Missing count / wrong shape',
            'rejected before arithmetic',
          ],
        ],
      },
      contrast:
        'int("2") is conversion, not proof that the caller sent an integer. Coercion can be useful in a documented text parser but surprising for a JSON API. A count: int annotation alone accepts runtime strings until some later operation fails. Validate once at the boundary and keep downstream code’s preconditions explicit. Bound input size before parsing when untrusted data can exhaust resources.',
      question: 'Why reject True as a count if Python treats it as an integer?',
      answer:
        'The domain distinguishes an affirmative flag from a measured count. Python’s inheritance relationship does not decide that policy. Use exact type checks when appropriate, then check nonnegativity and other constraints. A schema or annotation is useful only to the extent its runtime validator actually enforces those rules.',
      practice: {
        title: 'Test the boundary, not the annotation',
        prompt:
          'Name cases that distinguish decoding, shape, type and domain errors in a book-count record. Include a valid falsey value.',
        answer:
          'Malformed JSON, a decoded list, a missing count, a Boolean or string count, a negative integer, and valid zero.',
        explanation:
          'Each case crosses a different boundary. Testing only a happy dictionary and one negative value can miss bool coercion and missing fields.',
      },
    },
  ],
)

import { family } from './lesson'
export const files = family(
  'files-and-data',
  'Files and data',
  'Prerequisites: Iteration and generators (#iteration-and-generators), Errors and cleanup (#errors-and-cleanup). Use local fixture files, explicit UTF-8 and owned with boundaries. Distinguish decoding a document from accepting a domain record.',
  [
    {
      id: 'text-files-and-paths',
      title: 'Own a path and its decoding policy',
      summary:
        'Path names locate resources; a with-owned text handle decodes bytes and closes at exit.',
      model:
        'pathlib.Path represents a filesystem path, not an open file. Relative paths resolve from the process working directory. open in text mode decodes bytes using an explicit encoding and can translate newlines; binary mode returns bytes unchanged. TemporaryDirectory owns a fixture directory here. The inner with owns the file handle, including when UTF-8 decoding fails. Keep file-system errors distinct from decoding and domain errors.',
      code: 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as directory:\n    path = Path(directory) / "books.txt"\n    path.write_bytes("café\\r\\nHill\\n".encode("utf-8"))\n    with path.open(encoding="utf-8") as handle:\n        print([line.rstrip("\\n") for line in handle])\n    print(handle.closed, path.read_bytes().endswith(b"\\n"))\n    path.write_bytes(b"\\xff")\n    try:\n        with path.open(encoding="utf-8") as broken:\n            broken.read()\n    except UnicodeDecodeError:\n        print("decode rejected", broken.closed)',
      trace: {
        label: 'Bytes, text and resource ownership',
        columns: ['Boundary', 'State', 'Result'],
        rows: [
          [
            'write_bytes',
            'UTF-8 plus CRLF/LF bytes stored',
            'Raw bytes remain unchanged.',
          ],
          [
            'text iteration',
            'Decoder plus universal newline handling',
            '[café, Hill] after stripping newline.',
          ],
          [
            'with exit',
            'handle.closed is True',
            'Path still exists until directory owner exits.',
          ],
          [
            'bad UTF-8 read',
            'Decode error inside with',
            'broken closes before caller catches it.',
          ],
        ],
      },
      contrast:
        'Path.read_text is convenient for small bounded files and owns its internal handle, but materializes all text. For large files, iterate inside with and retain only needed state. A path does not certify existence or authorization, and a relative path is not relative to the source file unless you construct that base explicitly. Choose newline preservation deliberately for formats where exact bytes matter.',
      question:
        'Why specify an encoding even if a file reads correctly on my machine?',
      answer:
        'A default encoding depends on environment and runtime configuration. Explicit UTF-8 states a portable interchange contract and produces a clear decode failure for invalid bytes. Binary processing is appropriate when the format is bytes, while text parsing should begin after decoding succeeds.',
      practice: {
        title: 'Preserve the failure boundary',
        prompt:
          'A file is missing, a second has invalid UTF-8 and a third has a negative count. Which layer should report each error? Should all become an empty report?',
        answer:
          'File opening reports FileNotFoundError, text decoding reports UnicodeDecodeError, and record validation reports a domain ValueError. Do not turn them all into an empty successful report.',
        explanation:
          'Empty input is legitimate data and deserves its own result. Catching every failure as empty would conceal deployment, encoding and domain defects.',
      },
    },
    {
      id: 'json-and-records',
      title: 'Decode JSON, then validate the record',
      summary:
        'Syntax success can still produce the wrong shape, type or domain value.',
      model:
        'json.loads converts JSON text into Python dictionaries, lists, strings, numbers, booleans and None. Invalid syntax raises JSONDecodeError. A syntactically valid document may still be a list or have invalid fields. This format requires an object with a nonblank title and a nonnegative integer count excluding bool; extra fields are ignored by this deliberately narrow reader. Input-size limits belong before loads. Never use eval or untrusted pickle to decode this interchange format.',
      code: 'import json\n\ndef decode_record(text):\n    value = json.loads(text)\n    if not isinstance(value, dict):\n        raise ValueError("object required")\n    title, count = value.get("title"), value.get("count")\n    if not isinstance(title, str) or not title.strip():\n        raise ValueError("nonblank title required")\n    if type(count) is not int or count < 0:\n        raise ValueError("nonnegative integer required")\n    return {"title": title.strip(), "count": count}\n\nprint(decode_record(\'{"title":" River ","count":0}\'))\nfor text in ["{", "[]", \'{"title":"River","count":true}\']:\n    try:\n        decode_record(text)\n    except json.JSONDecodeError:\n        print("syntax")\n    except ValueError:\n        print("domain")',
      trace: {
        label: 'Two acceptance boundaries',
        columns: ['Input', 'Decoder result', 'Policy result'],
        rows: [
          ['{', 'JSONDecodeError', 'No record exists to validate.'],
          ['[]', 'Python list', 'Reject wrong top-level shape.'],
          ['count:true', 'Python bool', 'Reject exact count type.'],
          [
            'River with count:0',
            'Python dict with int zero',
            'Accept normalized title and zero.',
          ],
        ],
      },
      contrast:
        'Catching JSONDecodeError before ValueError matters because it is a ValueError subclass. A dataclass constructor would not automatically add these checks. JSON round trips may change tuple to list and numeric dictionary keys to strings; it is an interchange format, not an identity-preserving object clone. Choose an explicit duplicate-record policy later in the report rather than confusing it with duplicate JSON member names.',
      question: 'What did successful JSON decoding prove?',
      answer:
        'Only that the parser produced a Python value from acceptable syntax under its decoding rules. It did not prove shape, field types or domain validity. Apply a small explicit validator before constructing trusted records, and reject oversized input before parsing when needed.',
      practice: {
        title: 'Repair record acceptance',
        prompt:
          'Implement record(text) using the displayed format. Accept zero and strip a title. Reject malformed JSON, wrong shape, blank or missing title, Boolean/string/negative counts.',
        starter:
          'def record(text):\n    # TODO: decode and validate without coercing counts\n    pass',
        solution:
          'import json\n\ndef record(text):\n    value = json.loads(text)\n    if not isinstance(value, dict):\n        raise ValueError("object required")\n    title, count = value.get("title"), value.get("count")\n    if not isinstance(title, str) or not title.strip():\n        raise ValueError("title required")\n    if type(count) is not int or count < 0:\n        raise ValueError("count required")\n    return {"title": title.strip(), "count": count}\n\nassert record(\'{"title":" River ","count":0}\') == {"title": "River", "count": 0}',
        answer:
          'Decode first, then check each domain condition explicitly. Keep JSONDecodeError distinguishable from domain ValueError at a caller boundary.',
        explanation:
          'A valid zero prevents an overly broad truthiness check from passing unnoticed. No annotation or constructor can substitute for these explicit checks.',
      },
    },
    {
      id: 'streaming-report',
      title: 'Keep the source open while a lazy reader needs it',
      summary:
        'A suspended file generator retains its handle; early termination requires an explicit close boundary.',
      model:
        'A generator yielding inside with pauses before leaving that block. The file remains open between yielded records until exhaustion, error or explicit generator close resumes cleanup. A plain break in a caller does not universally close the generator. contextlib.closing gives the consumer an explicit generator-close boundary. This reader limits each line request to 129 characters and accepts at most 128, so one unbounded line cannot defeat the streaming memory contract. It emits nonblank integer lines for this small format.',
      code: 'from contextlib import closing\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\n\ndef counts(path, state):\n    with path.open(encoding="utf-8") as handle:\n        state["handle"] = handle\n        while True:\n            line = handle.readline(129)\n            if not line:\n                return\n            if len(line) > 128:\n                raise ValueError("line too long")\n            if line.strip():\n                yield int(line)\n\nwith TemporaryDirectory() as directory:\n    path = Path(directory) / "counts.txt"\n    path.write_text("2\\n4\\n", encoding="utf-8")\n    state = {}\n    with closing(counts(path, state)) as values:\n        print(next(values), state["handle"].closed)\n    print(state["handle"].closed)\n    print(sum(counts(path, state)), state["handle"].closed)',
      trace: {
        label: 'Suspended producer owns an open file',
        columns: ['Demand / boundary', 'Generator state', 'File state'],
        rows: [
          ['First next', 'Suspended at yield of 2', 'Open; prints 2 False.'],
          [
            'closing exit',
            'close injects GeneratorExit; with exits',
            'Closed before consumer continues.',
          ],
          [
            'Full sum',
            'Consumes 2,4 then EOF',
            '6; closed on normal exhaustion.',
          ],
          [
            'Bad integer / long line',
            'Exception leaves generator’s with',
            'Closed before failure propagates.',
          ],
        ],
      },
      contrast:
        'Returning a generator expression from inside a with that has already exited gives the caller a closed source. Reading the entire file into a list avoids that lifetime bug but changes memory and eager-validation behavior. Streaming bounds temporary record storage, not a grouping map with arbitrarily many distinct keys; capstone makes that limit explicit. Closing after an early break does not validate unseen records.',
      question: 'Who owns cleanup if only the first record is consumed?',
      answer:
        'The consumer must enter an explicit close boundary around the generator or own the file directly and pass its handle to a lazy parser. The generator’s with only exits when execution leaves it. Relying on reference counting after break is a runtime accident, not a portable ownership contract.',
      practice: {
        title: 'Repair early-exit file cleanup',
        prompt:
          'Implement first_count(path). Read the first nonblank integer within with, reject a line over 128 characters and return None for empty input. Prove closure on normal return and conversion failure.',
        starter:
          'def first_count(path):\n    # TODO: own the handle even on early return\n    pass',
        solution:
          'def first_count(path):\n    with path.open(encoding="utf-8") as handle:\n        while True:\n            line = handle.readline(129)\n            if not line:\n                return None\n            if len(line) > 128:\n                raise ValueError("line too long")\n            if line.strip():\n                return int(line)',
        answer:
          'Let first_count own the with block directly. Every return and raised conversion error leaves that scope and closes the handle.',
        explanation:
          'A first-item API need not return a lazy object. The verification uses an observable handle and a real temporary file, including the error path.',
        followUp:
          'If you return an iterator instead, which caller must own its close boundary?',
      },
    },
  ],
)

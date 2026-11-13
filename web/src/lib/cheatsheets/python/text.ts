import { family } from './lesson'
export const text = family(
  'text-and-numbers',
  'Text and numbers',
  'Prerequisite: Runtime and syntax (#runtime-and-syntax). Distinguish decoded text from bytes, parse a bounded format and choose numeric rules from the domain. These examples use explicit encodings and hand-checkable values.',
  [
    {
      id: 'unicode-and-bytes',
      title: 'Decode bytes at an explicit boundary',
      summary:
        'A str indexes Unicode code points; encoded bytes have a different length.',
      model:
        'str represents Unicode text; bytes represents octets. encode turns text into bytes using an encoding; decode interprets bytes as text. UTF-8 uses variable numbers of bytes per code point. A displayed character may combine several code points, so len(str) is not generally a count of grapheme clusters. Keep bytes intact until the decoding boundary, and choose an error policy rather than silently deleting invalid input.',
      code: 'text = "café"\nraw = text.encode("utf-8")\nprint(len(text), len(raw), raw.decode("utf-8"))\ncombined = "e\\u0301"\nprint(len(combined))\ntry:\n    raw[-1:].decode("utf-8")\nexcept UnicodeDecodeError:\n    print("incomplete UTF-8")\nprint(b"bad\\xff".decode("utf-8", errors="replace"))',
      trace: {
        label: 'Text and byte boundaries',
        columns: ['Value', 'Length / result', 'Reason'],
        rows: [
          ['café', '4 code points, 5 UTF-8 bytes', 'é uses two bytes.'],
          [
            'e plus combining accent',
            '2 code points',
            'One visual cluster need not be one indexed element.',
          ],
          [
            'Last UTF-8 byte alone',
            'UnicodeDecodeError',
            'It is a continuation byte, not a complete character.',
          ],
          [
            'errors="replace"',
            'bad�',
            'The invalid byte is visibly replaced; information is lost.',
          ],
        ],
      },
      contrast:
        'Using errors="ignore" can erase evidence and merge distinct malformed values. Strict decoding fails at the boundary; replacement can be suitable for display with an explicit loss policy. Streaming byte chunks may split a character, requiring an incremental decoder; iterating an already-open UTF-8 text file lets its decoder handle those boundaries.',
      question: 'Can I truncate user text by slicing its UTF-8 bytes?',
      answer:
        'An arbitrary byte slice can cut a multi-byte code point and fail decoding. Decode valid input first, then decide whether your limit counts bytes, code points or user-visible grapheme clusters. Those are different contracts, and the standard str slice does not implement grapheme segmentation.',
      practice: {
        title: 'Reject malformed encoded records',
        prompt:
          'A UTF-8 label includes b"\\xff". Choose strict versus replace for an identifier and for a diagnostic preview, and explain the effect of ignore.',
        answer:
          'Reject malformed identifiers with strict decoding. A diagnostic preview may use replacement if labelled as lossy. ignore deletes the byte and can hide the defect.',
        explanation:
          'Encoding policy belongs at the bytes/text boundary. A successful decode with data loss does not establish a valid domain identifier.',
      },
    },
    {
      id: 'text-parsing',
      title: 'Parse a small format without hiding its grammar',
      summary:
        'Bound splitting, preserve field policy and format the validated result.',
      model:
        'strip removes characters at the ends, not a substring in the middle. split separates text; maxsplit bounds the number of splits. join builds text from an iterable of strings with a separator. An f-string evaluates expressions inside braces and applies an optional format specification. This lesson accepts title:count with one separator and a nonnegative integer; it is not a CSV parser or a general escaping grammar.',
      code: 'def parse(line):\n    title, count_text = line.strip().split(":", 1)\n    title = title.strip()\n    count = int(count_text)\n    if not title or count < 0:\n        raise ValueError("title and nonnegative count required")\n    return title, count\n\ntitle, count = parse(" River : 2 ")\nprint(f"{title}: {count:03d}")\nprint(" / ".join([title, "ready"]))\nfor bad in ["River", ":2", "River:-1", "River:2:3"]:\n    try:\n        parse(bad)\n    except ValueError:\n        print("invalid", bad)',
      trace: {
        label: 'A format has separate parsing and policy steps',
        columns: ['Stage', 'State', 'Boundary'],
        rows: [
          [
            'split once',
            '["River ", " 2"]',
            'Unpacking needs exactly two fields.',
          ],
          ['int', 'count = 2', 'Invalid integer text raises ValueError.'],
          [
            'domain check',
            'title = River; count = 2',
            'Nonempty title and nonnegative count.',
          ],
          ['format', 'River: 002', 'Display width does not validate input.'],
        ],
      },
      contrast:
        'A second colon remains in count_text because maxsplit is one; int then rejects it. If titles may contain colons or quoting, define a different format and use a suitable parser. str.strip("prefix") removes any of those characters at either end; use removeprefix for an exact prefix. Formatting a number with a width does not cap its magnitude.',
      question: 'Why not just split and trust the result?',
      answer:
        'Syntactic separation, numeric conversion and domain validation are distinct checks. Each can fail for a different reason. A bounded split expresses this tiny grammar, while explicit checks make errors predictable. A richer grammar needs an actual parser and input-size limits.',
      practice: {
        title: 'Keep zero, reject a missing title',
        prompt:
          'Implement parse_count(text) for title:count. Accept zero, reject negative counts, missing fields and blank titles. Do not use eval.',
        starter:
          'def parse_count(text):\n    # TODO: split, convert and validate\n    pass',
        solution:
          'def parse_count(text):\n    title, raw = text.strip().split(":", 1)\n    count = int(raw)\n    title = title.strip()\n    if not title or count < 0:\n        raise ValueError("invalid record")\n    return title, count\n\nassert parse_count("River:0") == ("River", 0)',
        answer:
          'Split once, unpack, convert using int and apply the domain checks. Count zero survives.',
        explanation:
          'The conversion errors and explicit domain rejection are ValueError paths. No executable interpretation of input is needed.',
      },
    },
    {
      id: 'numeric-boundaries',
      title: 'Choose division and comparison deliberately',
      summary:
        'Floor division, growing integers and floating approximation answer different questions.',
      model:
        'Python integers have arbitrary precision limited by resources, so arithmetic cost and storage grow with magnitude. / performs true division; // floors toward negative infinity; % supplies a remainder satisfying a == (a // b) * b + a % b for these integer operands. A float usually uses binary floating point, where many decimal fractions are approximations. math.isclose compares with chosen relative/absolute tolerances; Decimal from strings can express decimal arithmetic without first importing a float approximation.',
      code: 'from math import isclose\nfrom decimal import Decimal\n\nprint(-7 // 3, -7 % 3, -7 / 3)\nprint((-7 // 3) * 3 + (-7 % 3))\nprint(10 ** 30 + 1 > 10 ** 30)\nprint(0.1 + 0.2 == 0.3)\nprint(isclose(0.1 + 0.2, 0.3, rel_tol=1e-12, abs_tol=1e-12))\nprint(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))',
      trace: {
        label: 'Arithmetic contracts at the boundary',
        columns: ['Expression', 'Result', 'Why'],
        rows: [
          [
            '-7 // 3, -7 % 3',
            '-3, 2',
            'Floor is below -2; the identity reconstructs -7.',
          ],
          [
            '10**30 + 1',
            'Distinct larger integer',
            'No fixed 64-bit overflow here.',
          ],
          ['0.1 + 0.2 == 0.3', 'False', 'Binary approximations differ.'],
          [
            'isclose / Decimal strings',
            'True / True',
            'Tolerance and decimal representation are distinct policies.',
          ],
        ],
      },
      contrast:
        'int(-7 / 3) truncates toward zero and gives -2; it is not integer floor division and also passes through floating point. Rounding display text does not change stored arithmetic. Money in bounded integer minor units, Decimal with a rounding policy, and measured floats with tolerances solve different problems. Near zero, an absolute tolerance may matter when a relative tolerance alone cannot help.',
      question: 'Should every floating comparison use a fixed epsilon?',
      answer:
        'No. Choose tolerances from the units, scale and acceptable error of the domain, often with both relative and absolute terms. Exact discrete counts should use integers. Decimal is useful for decimal rules, but precision and rounding still need a policy; constructing it from a float retains that float’s approximation.',
      practice: {
        title: 'Change the sign and scale',
        prompt:
          'Predict -8 // 3 and -8 % 3. Then choose a representation for item counts, money rounded to cents and sensor measurements near zero.',
        answer:
          '-3 and 1. Use integer counts, integer minor units or Decimal with explicit monetary rounding, and floats with domain tolerances for measurements.',
        explanation:
          'Floor division and truncation diverge for negative nonmultiples. Representation must match what counts as an acceptable error.',
      },
    },
  ],
)

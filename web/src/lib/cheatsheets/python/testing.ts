import { family } from './lesson'
const combined = family(
  'testing-and-capstone',
  'Testing and capstone',
  'Prerequisites: Files and data (#files-and-data), Standard library (#standard-library), Asyncio (#asyncio) and Threads and processes (#threads-and-processes). Test observable boundaries, then implement the complete local JSON-lines report. The capstone deliberately uses no framework, network or hidden helper.',
  [
    {
      id: 'unit-and-boundary-tests',
      title: 'Write tests that distinguish the failure paths',
      summary:
        'Arrange fresh input, exercise the real function and assert values plus intended exceptions.',
      model:
        'unittest discovers TestCase methods whose names start with test. assertEqual compares an observed result with an independently chosen expectation; assertRaises establishes an intended failure type. A fresh fixture prevents accidental state sharing between tests. addCleanup and context managers own fixture resources even when assertions fail. Prefer running real small parsers and local files to mocking their core behavior. For async code, IsolatedAsyncioTestCase provides an isolated loop for async test methods; events make ordering assertions deterministic.',
      code: 'import unittest\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\n\ndef count(text):\n    value = int(text)\n    if value < 0:\n        raise ValueError("negative count")\n    return value\n\nclass CountTests(unittest.TestCase):\n    def test_zero(self):\n        self.assertEqual(count("0"), 0)\n    def test_failures(self):\n        for bad in ["", "bad", "-1"]:\n            with self.subTest(bad=bad):\n                with self.assertRaises(ValueError):\n                    count(bad)\n    def test_file(self):\n        temporary = TemporaryDirectory()\n        self.addCleanup(temporary.cleanup)\n        path = Path(temporary.name) / "count.txt"\n        path.write_text("2", encoding="utf-8")\n        self.assertEqual(count(path.read_text(encoding="utf-8")), 2)\n\nif __name__ == "__main__":\n    unittest.main()',
      trace: {
        label: 'What each test can catch',
        columns: ['Case', 'Independent expectation', 'Break it detects'],
        rows: [
          ['Zero', '0, not a fallback', 'Falsey-value replacement.'],
          [
            'Blank / bad / negative',
            'ValueError',
            'Missing conversion or domain rejection.',
          ],
          [
            'Temporary local file',
            '2 after decoding',
            'Wrong fixture/path/read boundary.',
          ],
          [
            'Cleanup registration',
            'Temporary directory removed even on assertion failure',
            'Fixture lifetime independent of test success.',
          ],
        ],
      },
      contrast:
        'A test that computes expected output by calling the same production helper can agree with its own bug. Checking only “did not throw” misses wrong results; checking only any nonzero exit misses the reason for failure. Add cases around the contract: empty inputs, duplicates, nested sharing, late iterator failure and cancellation cleanup. Use a targeted mutation when uncertain whether an oracle can catch its intended defect.',
      question: 'What makes a regression test meaningful?',
      answer:
        'It distinguishes a real broken behavior from the intended result, using a controlled fixture and independently chosen expectation. Observe it fail for the defect, then pass after the repair. For cleanup or concurrency, assert completion/state at defined ownership boundaries instead of relying on elapsed speed or scheduler order.',
      practice: {
        title: 'Find a weak test’s blind spot',
        prompt:
          'A test only asserts summarize(path) returns a dict. Name a plausible wrong implementation that passes, and replace that check with normal, empty, malformed and duplicate fixtures.',
        answer:
          'Returning {} for every input passes. Assert exact aggregate counts for normal/duplicate data, {} only for empty input, and the specified error with line context for malformed records.',
        explanation:
          'The result type is a useful invariant but cannot prove computation or rejection behavior. The capstone’s actual-code checks exercise those paths.',
      },
    },
    {
      id: 'debug-and-measure',
      title: 'Diagnose the mechanism before optimizing',
      summary:
        'Use traceback state and qualified measurements to separate wrong results from expensive work.',
      model:
        'A traceback identifies the active call chain at failure; inspect the final exception and the inputs at the first boundary you own. breakpoint() enters a debugger in an interactive run, while logging can record bounded diagnostic context without pausing. timeit repeats a small operation for timing; cProfile attributes calls and time. Instrumentation changes cost and tiny inputs do not establish production throughput. Complexity analysis describes growth under assumptions; measurements describe one workload/runtime/build.',
      code: 'import cProfile\nimport pstats\nfrom timeit import repeat\n\ndef aggregate(values):\n    total = 0\n    for value in values:\n        total += value\n    return total\n\nvalues = list(range(100))\nassert aggregate(values) == 4950\nmeasurements = repeat(lambda: aggregate(values), number=10, repeat=3)\nprofiler = cProfile.Profile()\nprofiler.runcall(aggregate, values)\nstats = pstats.Stats(profiler)\nprint("measured", len(measurements), all(t >= 0 for t in measurements))\nprint("profiled", stats.total_calls > 0)',
      trace: {
        label: 'Correctness evidence and cost evidence',
        columns: ['Step', 'Evidence', 'Limit'],
        rows: [
          ['Hand-derived sum', '4950', 'Establishes this result, not scaling.'],
          [
            'Three timing samples',
            'Elapsed costs for ten calls per sample',
            'No fixed speed claim or pass threshold.',
          ],
          [
            'Profile',
            'Observed call attribution',
            'Profiler overhead affects time.',
          ],
          [
            'Changed workload',
            'Requires new representative measurement',
            'Do not extrapolate tiny timing to all inputs.',
          ],
        ],
      },
      contrast:
        'Optimizing an invalid parser can make wrong results faster. First reproduce a failing input and protect its behavior; then measure the cost under realistic sizes. Avoid logging full untrusted records or sensitive data when a line number and error kind suffice. If a measured hotspot is blocking a loop thread, the repair might be capacity or work placement rather than a micro-optimization.',
      question: 'How would you investigate a slow report without guessing?',
      answer:
        'Establish a correct reproducible input and runtime, separate I/O waiting from CPU and retained-memory costs, then profile representative workloads. Compare alternatives with construction and cleanup included. Report sample sizes/build/input and limits; do not treat one fast local run as a universal performance guarantee.',
      practice: {
        title: 'Change one variable in a performance investigation',
        prompt:
          'A report grows from 100 to a million records and slows sharply. Which inputs and measurements distinguish repeated rescanning, distinct-key growth and slow I/O?',
        answer:
          'Vary total records and distinct-key count separately, profile call counts/CPU, observe retained data and measure I/O independently. Include parsing and index construction in the workload when the real request pays for them.',
        explanation:
          'The three hypotheses predict different cost changes. A controlled comparison narrows the mechanism before choosing an index, streaming rewrite or worker model.',
      },
    },
    {
      id: 'interview-capstone',
      title: 'Build and defend a validated streaming report',
      summary:
        'Own decoding, validation, duplicate aggregation, deterministic display and retained-memory limits.',
      filename:
        'report.py — beside report_record.py; run python3 report.py books.jsonl',
      model:
        'The input is UTF-8 JSON lines: each nonblank line contains an object with title and count, using the earlier Files and data contract. Blank lines are ignored; duplicate normalized titles add counts, including zero. The file owner streams lines limited to 1024 decoded characters including the newline, rejecting a longer line before parsing it. The validator below is a complete companion file. A Counter retains one total per distinct normalized title; sorted display makes output deterministic. Any invalid record fails the report with a line number and chained cause; no partial result is returned.',
      code: 'import json\nimport sys\nfrom collections import Counter\nfrom pathlib import Path\nfrom report_record import validate\n\ndef summarize(path):\n    totals = Counter()\n    with path.open(encoding="utf-8") as handle:\n        line_number = 0\n        while True:\n            line = handle.readline(1025)\n            if not line:\n                return dict(totals)\n            line_number += 1\n            if len(line) > 1024:\n                raise ValueError(f"line {line_number}: too long")\n            if not line.strip():\n                continue\n            try:\n                title, count = validate(json.loads(line))\n            except ValueError as error:\n                raise ValueError(f"line {line_number}: invalid record") from error\n            totals[title] += count\n\ndef display(totals):\n    return "\\n".join(f"{title}: {totals[title]}" for title in sorted(totals))\n\nif __name__ == "__main__":\n    output = display(summarize(Path(sys.argv[1])))\n    if output:\n        print(output)',
      extra: [
        {
          id: 'interview-capstone-validator',
          kind: 'code',
          label: 'report_record.py — complete boundary validator',
          code: 'def validate(value):\n    if not isinstance(value, dict):\n        raise ValueError("object required")\n    title, count = value.get("title"), value.get("count")\n    if not isinstance(title, str) or not title.strip():\n        raise ValueError("title required")\n    if type(count) is not int or count < 0:\n        raise ValueError("count required")\n    return title.strip().casefold(), count',
        },
      ],
      trace: {
        label: 'Report state across input boundaries',
        columns: ['Input / phase', 'Intermediate totals', 'Outcome'],
        rows: [
          [
            'River:2 then Hill:0 records',
            '{river:2, hill:0}',
            'Zero is accepted and retained.',
          ],
          [
            'river:3 duplicate',
            '{river:5, hill:0}',
            'Normalized identity aggregates counts.',
          ],
          ['EOF', 'Owner exits with', 'Display: hill: 0 then river: 5.'],
          [
            'Malformed third record',
            'Earlier internal totals discarded',
            'Line 3 error; with closes; no result returned.',
          ],
          ['Empty / blank file', '{}', 'Empty display; no fabricated record.'],
        ],
      },
      contrast:
        'Streaming avoids retaining all source records but the number of distinct titles remains unbounded. If distinct-key memory must be fixed, use a bounded external aggregation strategy or reject beyond an explicit capacity; a lazy generator alone cannot solve it. If the work becomes CPU-heavy, consider bounded process submission with importable workers and an owner for errors. File output would need a separate commit/replace policy to provide all-or-nothing publication; this function only returns on success.',
      question:
        'How would you defend this report under changed input, memory and concurrency requirements?',
      answer:
        'Start with the boundary contracts: UTF-8, line size, record validation, normalized duplicate identity, failure policy and deterministic output. Test normal/empty/invalid/duplicate input and closure. Memory grows with distinct titles; change that design for a strict memory bound. Concurrency is useful only for a measured workload and must include admission, ordering, cancellation and resource ownership.',
      practice: {
        title: 'Implement and test the report',
        prompt:
          'Reimplement summarize(path) with the visible validator: accept blank/empty input and zero, aggregate duplicate normalized titles, reject oversized or malformed/domain-invalid lines with line context, and close on failure. Use display for deterministic output. Then change the requirement to fixed memory.',
        starter:
          'def summarize(path):\n    # TODO: own the file, validate each bounded line, aggregate duplicates\n    pass',
        solution:
          'import json\nfrom collections import Counter\nfrom report_record import validate\n\ndef summarize(path):\n    totals = Counter()\n    with path.open(encoding="utf-8") as handle:\n        number = 0\n        while True:\n            line = handle.readline(1025)\n            if not line:\n                return dict(totals)\n            number += 1\n            if len(line) > 1024:\n                raise ValueError(f"line {number}: too long")\n            if not line.strip():\n                continue\n            try:\n                title, count = validate(json.loads(line))\n            except ValueError as error:\n                raise ValueError(f"line {number}: invalid record") from error\n            totals[title] += count',
        answer:
          'One with-owned traversal performs explicit decoding/validation and aggregation, returning only after EOF. Counts grow only by validated nonnegative integers.',
        explanation:
          'Tests must observe exact aggregates, errors and cleanup for the actual solution. The retained map is O(distinct titles); fixed-memory acceptance requires changing storage or capacity, not merely replacing the loop with a generator.',
        followUp:
          'If two passes must observe the same input, how will you obtain a stable snapshot or detect that the source changed?',
      },
    },
  ],
)

// Measured split: the complete capstone exceeded the four-screen budget when
// combined with the testing rows. Preserve all code/reasoning in its own panel.
const section = combined.sections[0]
export const testing = {
  sections: [
    {
      ...section,
      title: 'Testing and diagnosis',
      study: { ...section.study!, label: 'Testing and diagnosis' },
      rows: section.rows.slice(0, 2),
    },
    {
      title: 'Report capstone',
      study: {
        id: 'report-capstone',
        label: 'Report capstone',
        hint: 'Implement, test and defend the changed constraints.',
      },
      introduction: [
        {
          id: 'report-capstone-orientation',
          kind: 'paragraph' as const,
          text: 'Prerequisites: Files and data (#files-and-data), Standard library (#standard-library), Testing and diagnosis (#testing-and-capstone). Use the complete local files below to implement and test a JSON-lines report, then explain its memory and concurrency limits.',
        },
      ],
      rows: section.rows.slice(2),
    },
  ],
  activities: combined.activities,
}

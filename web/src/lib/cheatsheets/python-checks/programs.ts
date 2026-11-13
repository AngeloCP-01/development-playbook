import type { PublishedCase } from '../python-published-cases'
export const programCases: PublishedCase[] = [
  {
    name: 'iterable-and-iterator',
    files: { 'main.py': 'iterable-and-iterator-example' },
    entry: 'main.py',
    stdout: '2\n[4, 6]\n[]\ndone\n[2, 4, 6] [2, 4, 6]\nTrue\n',
  },
  {
    name: 'lazy-pipelines',
    files: { 'main.py': 'lazy-pipelines-example' },
    entry: 'main.py',
    stdout:
      'created\nparse 2\nfirst 2\nparse 4\nparse 6\nrest [4, 6]\nagain []\neager [2, 4]\n',
  },
  {
    name: 'comprehensions-and-loop-tools',
    files: { 'main.py': 'comprehensions-and-loop-tools-example' },
    entry: 'main.py',
    stdout:
      "[(1, 'RIVER'), (3, 'HILL')]\nFalse [1, 0]\nFalse True\n[('River', 2)]\nlength mismatch\n",
  },
  {
    name: 'instances-and-methods',
    files: { 'main.py': 'instances-and-methods-example' },
    entry: 'main.py',
    stdout: "['River', 'Hill'] [] 2 books\n",
  },
  {
    name: 'inheritance-and-composition',
    files: { 'main.py': 'inheritance-and-composition-example' },
    entry: 'main.py',
    stdout:
      "['Left', 'Right', 'Base']\n['Report', 'Left', 'Right', 'Base', 'object']\nRIVER\n",
  },
  {
    name: 'protocols-and-special-methods',
    files: { 'main.py': 'protocols-and-special-methods-example' },
    entry: 'main.py',
    stdout:
      "['River', 'Hill'] ['River', 'Hill'] 2\nTrue True 1\nTitles(('River', 'Hill')) True\n",
  },
  {
    name: 'dataclasses-and-typing',
    files: { 'main.py': 'dataclasses-and-typing-example' },
    entry: 'main.py',
    stdout: "True False\n['read'] []\nfield frozen\n42\n",
  },
  {
    name: 'exception-flow',
    files: { 'main.py': 'exception-flow-example' },
    entry: 'main.py',
    stdout:
      'converted 2\nleave parse\nvalue 2\nleave parse\ninvalid count ValueError\n',
  },
  {
    name: 'context-managers',
    files: { 'main.py': 'context-managers-example' },
    entry: 'main.py',
    stdout: '2\nclosed True\nclosed True\nrejected True\n',
  },
  {
    name: 'validation-boundaries',
    files: { 'main.py': 'validation-boundaries-example' },
    entry: 'main.py',
    stdout:
      'accepted 0\nrejected nonnegative integer count required\nrejected nonnegative integer count required\nrejected nonnegative integer count required\nrejected object required\n',
  },
  {
    name: 'text-files-and-paths',
    files: { 'main.py': 'text-files-and-paths-example' },
    entry: 'main.py',
    stdout: "['café', 'Hill']\nTrue True\ndecode rejected True\n",
  },
  {
    name: 'json-and-records',
    files: { 'main.py': 'json-and-records-example' },
    entry: 'main.py',
    stdout: "{'title': 'River', 'count': 0}\nsyntax\ndomain\ndomain\n",
  },
  {
    name: 'streaming-report and failure closure',
    files: { 'stream.py': 'streaming-report-example' },
    entry: 'stream.py',
    checks: {
      'check.py':
        'from pathlib import Path\nfrom tempfile import TemporaryDirectory\nfrom contextlib import closing\nfrom stream import counts\nwith TemporaryDirectory() as d:\n    path = Path(d) / "input"\n    for bad in ["bad\\n", "9" * 129]:\n        path.write_text(bad, encoding="utf-8")\n        state = {}\n        try:\n            list(counts(path, state))\n        except ValueError:\n            assert state["handle"].closed\n        else:\n            raise AssertionError("bad input accepted")\n    path.write_text("2\\n4\\n", encoding="utf-8")\n    state = {}\n    with closing(counts(path, state)) as values:\n        assert next(values) == 2 and not state["handle"].closed\n    assert state["handle"].closed',
    },
    checkEntry: 'check.py',
    stdout: '2 False\nTrue\n6 True\n',
  },
  {
    name: 'imports-and-main',
    files: {
      'main.py': 'imports-and-main-example',
      'catalog.py': 'imports-and-main-catalog',
    },
    entry: 'main.py',
    stdout: 'catalog loaded\nTrue River Hill\nentry\n',
  },
  {
    name: 'package-layout module context',
    files: {
      'books/main.py': 'package-layout-example',
      'books/__init__.py': 'package-layout-init',
      'books/model.py': 'package-layout-model-file',
    },
    entry: 'books/main.py',
    module: 'books.main',
    stdout: 'River\n',
  },
  {
    name: 'package-layout deliberate cycle',
    files: {
      'cycle_a.py': 'package-layout-cycle-a',
      'cycle_b.py': 'package-layout-cycle-b',
    },
    entry: 'cycle_a.py',
    exit: 1,
    stderr:
      /ImportError: cannot import name 'label' from (?:partially initialized module )?'cycle_b'/,
  },
  {
    name: 'environments-and-dependencies',
    files: { 'main.py': 'environments-and-dependencies-example' },
    entry: 'main.py',
    contains: ['CPython\nsupported True\n', 'executable '],
  },
  {
    name: 'counting-and-grouping',
    files: { 'main.py': 'counting-and-grouping-example' },
    entry: 'main.py',
    stdout:
      "{'River': 2, 'Hill': 1} {'River': [0, 2], 'Hill': [1]}\n0 False\nNone False\n[] True\n0 True\n",
  },
  {
    name: 'queues-and-heaps',
    files: { 'main.py': 'queues-and-heaps-example' },
    entry: 'main.py',
    stdout: "River ['Hill', 'Lake']\nRiver\n['River', 'Lake', 'Hill']\n",
  },
  {
    name: 'ordering-and-search',
    files: { 'main.py': 'ordering-and-search-example' },
    entry: 'main.py',
    stdout:
      "[('Hill', 1), ('River', 2), ('Lake', 2)]\n[('River', 2), ('Hill', 1), ('Lake', 2)]\n1 3\n0 4\n[1, 2, 2, 2, 4]\n",
  },
  {
    name: 'two-pass repair',
    files: { 'repair.py': 'iterable-and-iterator-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'lazy parser repair',
    files: { 'repair.py': 'lazy-pipelines-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'dataclass repair',
    files: { 'repair.py': 'dataclasses-and-typing-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'cleanup repair',
    files: { 'repair.py': 'context-managers-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'JSON repair malformed shape type and domain',
    files: { 'repair.py': 'json-and-records-practice-solution' },
    entry: 'repair.py',
    checks: {
      'check.py':
        'from repair import record\nfor bad in ["", "{", "[]", "null", "{}", \'{"title":" ","count":1}\', \'{"title":42,"count":1}\', \'{"title":"River","count":true}\', \'{"title":"River","count":"2"}\', \'{"title":"River","count":-1}\']:\n    try:\n        record(bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(bad)',
    },
    checkEntry: 'check.py',
    stdout: '',
  },
  {
    name: 'first-count direct repair closure',
    files: { 'repair.py': 'streaming-report-practice-solution' },
    entry: 'repair.py',
    checks: {
      'check.py':
        'from repair import first_count\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nclass ObservedPath:\n    def __init__(self, path):\n        self.path = path\n    def open(self, **options):\n        self.handle = self.path.open(**options)\n        return self.handle\nwith TemporaryDirectory() as d:\n    path = Path(d) / "input"\n    for text, expected in [("", None), ("\\n2\\n4\\n", 2)]:\n        path.write_text(text, encoding="utf-8")\n        observed = ObservedPath(path)\n        assert first_count(observed) == expected\n        assert observed.handle.closed\n    for text in ["bad\\n", "9" * 129]:\n        path.write_text(text, encoding="utf-8")\n        observed = ObservedPath(path)\n        try:\n            first_count(observed)\n        except ValueError:\n            assert observed.handle.closed\n        else:\n            raise AssertionError(text)',
    },
    checkEntry: 'check.py',
    stdout: '',
  },
  {
    name: 'acyclic module repair',
    files: {
      'entry.py': 'package-layout-practice-solution',
      'formatter.py': 'package-layout-formatter',
      'common.py': 'package-layout-common',
    },
    entry: 'entry.py',
    stdout: 'RIVER\n',
  },
  {
    name: 'frequency repair',
    files: { 'repair.py': 'counting-and-grouping-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
]
export const programFragments = [
  {
    id: 'iterable-and-iterator-practice-starter',
    reason: 'Incomplete two-pass factory interface.',
  },
  {
    id: 'lazy-pipelines-practice-starter',
    reason: 'Incomplete demand-driven parser interface.',
  },
  {
    id: 'dataclasses-and-typing-practice-starter',
    reason: 'Dataclass exercise instruction rather than a finished program.',
  },
  {
    id: 'context-managers-practice-starter',
    reason: 'Incomplete context-manager interface.',
  },
  {
    id: 'json-and-records-practice-starter',
    reason: 'Incomplete domain-validation interface.',
  },
  {
    id: 'streaming-report-practice-starter',
    reason: 'Incomplete first-item file-owner interface.',
  },
  {
    id: 'counting-and-grouping-practice-starter',
    reason: 'Incomplete streaming count interface.',
  },
  {
    id: 'environments-and-dependencies-commands',
    reason:
      'Environment provisioning commands; install separately, never during example tests.',
  },
]

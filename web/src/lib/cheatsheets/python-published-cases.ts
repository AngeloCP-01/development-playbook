import type { PythonCase } from './python-published-checks'
export type PublishedCase = Omit<PythonCase, 'sheet'> & {
  name: string
  stdout?: string
  contains?: string[]
}
// Explicit IDs: adding a block cannot silently add a passing case.
export const pythonCases: PublishedCase[] = [
  {
    name: 'execution-basics',
    files: { 'main.py': 'execution-basics-example' },
    entry: 'main.py',
    stdout: 'RIVER\n  River  \n',
  },
  {
    name: 'values-and-expressions',
    files: { 'main.py': 'values-and-expressions-example' },
    entry: 'main.py',
    stdout: 'None 10 10\n0 10 0\n3 3 3\nFalse\nready\n',
  },
  {
    name: 'control-flow',
    files: { 'main.py': 'control-flow-example' },
    entry: 'main.py',
    stdout: "exhausted\n['River', 'Hill']\n1\n0\n",
  },
  {
    name: 'binding-and-identity',
    files: { 'main.py': 'binding-and-identity-example' },
    entry: 'main.py',
    stdout:
      "['draft', 'reviewed'] ['local']\nTrue True False\n['draft', 'reviewed', 'approved']\n",
  },
  {
    name: 'mutation-and-copying',
    files: { 'main.py': 'mutation-and-copying-example' },
    entry: 'main.py',
    stdout: "River ['draft', 'reviewed']\nTrue False\n['draft'] ['reviewed']\n",
  },
  {
    name: 'lifetime-and-resources',
    files: { 'main.py': 'lifetime-and-resources-example' },
    entry: 'main.py',
    stdout: "River False\nTrue\n['draft']\n",
  },
  {
    name: 'sequences-and-slicing',
    files: { 'main.py': 'sequences-and-slicing-example' },
    entry: 'main.py',
    stdout:
      "[['River'], ['Hill', 'read'], ['Lake']]\n['River'] 2\n[4, 2, 0]\n[1, 2, 3] None\n",
  },
  {
    name: 'mappings-and-sets',
    files: { 'main.py': 'mappings-and-sets-example' },
    entry: 'main.py',
    stdout:
      "['river', 'hill']\n['river', 'hill', 'lake'] 0 False\n{'river': 3, 'hill': 2}\n",
  },
  {
    name: 'hash-and-equality',
    files: { 'main.py': 'hash-and-equality-example' },
    entry: 'main.py',
    stdout: 'True True\n1 boolean\n2\nunhashable child\n',
  },
  {
    name: 'collection-costs',
    files: { 'main.py': 'collection-costs-example' },
    entry: 'main.py',
    stdout: "3 2\n['River', 'Hill', 'Lake'] ['River', 'Hill', 'Sea']\n",
  },
  {
    name: 'unicode-and-bytes',
    files: { 'main.py': 'unicode-and-bytes-example' },
    entry: 'main.py',
    stdout: '4 5 café\n2\nincomplete UTF-8\nbad�\n',
  },
  {
    name: 'text-parsing',
    files: { 'main.py': 'text-parsing-example' },
    entry: 'main.py',
    stdout:
      'River: 002\nRiver / ready\ninvalid River\ninvalid :2\ninvalid River:-1\ninvalid River:2:3\n',
  },
  {
    name: 'numeric-boundaries',
    files: { 'main.py': 'numeric-boundaries-example' },
    entry: 'main.py',
    stdout: '-3 2 -2.3333333333333335\n-7\nTrue\nFalse\nTrue\nTrue\n',
  },
  {
    name: 'arguments-and-binding',
    files: { 'main.py': 'arguments-and-binding-example' },
    entry: 'main.py',
    stdout:
      "['River'] ('review',) {'format': 'text'}\npositional rows required\n0\n",
  },
  {
    name: 'defaults-and-state',
    files: { 'main.py': 'defaults-and-state-example' },
    entry: 'main.py',
    stdout:
      "['River', 'Hill'] ['River', 'Hill'] True\n['River'] ['Hill'] False\nTrue ['Lake']\n",
  },
  {
    name: 'lexical-scope',
    files: { 'main.py': 'lexical-scope-example' },
    entry: 'main.py',
    stdout: 'local read before binding\n10\n11 10\n1 2\n',
  },
  {
    name: 'closures-and-decorators',
    files: { 'main.py': 'closures-and-decorators-example' },
    entry: 'main.py',
    stdout:
      "['Hill', 'Hill'] ['River', 'Hill']\n['changed']\nenter\nRIVER report\n",
  },
  {
    name: 'nested copy repair',
    files: { 'repair.py': 'mutation-and-copying-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'normalized deduplication repair',
    files: { 'repair.py': 'mappings-and-sets-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'text parser repair rejects invalid values',
    files: { 'repair.py': 'text-parsing-practice-solution' },
    entry: 'repair.py',
    checks: {
      'check.py':
        'from repair import parse_count\nfor bad in ["", "River", ":2", "River:-1", "River:x", "River:2:3"]:\n    try:\n        parse_count(bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(bad)\nassert parse_count("Hill:2") == ("Hill", 2)',
    },
    checkEntry: 'check.py',
    stdout: '',
  },
  {
    name: 'default state repair',
    files: { 'repair.py': 'defaults-and-state-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
  {
    name: 'closure snapshot and decorator return repair',
    files: { 'repair.py': 'closures-and-decorators-practice-solution' },
    entry: 'repair.py',
    stdout: '',
  },
]
export const pythonFragments: { id: string; reason: string }[] = [
  {
    id: 'mutation-and-copying-practice-starter',
    reason:
      'Incomplete function interface; nested-copy implementation is the exercise.',
  },
  {
    id: 'mappings-and-sets-practice-starter',
    reason: 'Incomplete normalization/deduplication interface.',
  },
  {
    id: 'text-parsing-practice-starter',
    reason: 'Incomplete parser interface.',
  },
  {
    id: 'defaults-and-state-practice-starter',
    reason: 'Incomplete per-call state interface.',
  },
  {
    id: 'closures-and-decorators-practice-starter',
    reason: 'Incomplete callback and wrapper interfaces.',
  },
]

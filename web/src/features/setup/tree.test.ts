import { expect, test } from 'vitest'
import { DOC, section } from './doc-source'
import { SRC_TREE, type TreeNode } from './tree'

const STRUCTURE = section('2. Set the folder structure')

/** The one fenced block in §2 — the `src/` tree itself. */
const BLOCK = (() => {
  const m = /```\n([\s\S]*?)```/.exec(STRUCTURE)
  if (!m)
    throw new Error('no fenced tree block in "2. Set the folder structure"')
  return m[1]
})()

/** The doc's own lines, comments stripped, in the order it prints them. */
const DOC_TOKENS = BLOCK.split('\n')
  .filter((line) => line.trim().length > 0)
  .map((line) => line.replace(/\s*#.*$/, '').trim())

function flatten(node: TreeNode): TreeNode[] {
  return [node, ...(node.children ?? []).flatMap(flatten)]
}

const NODES = flatten(SRC_TREE)

/** A node's own segment: its path minus its deepest ancestor's path. */
function label(node: TreeNode): string {
  const parent = NODES.filter(
    (p) => p !== node && node.path.startsWith(p.path),
  ).sort((a, b) => b.path.length - a.path.length)[0]
  return parent ? node.path.slice(parent.path.length) : node.path
}

// Counted from the doc's own code block rather than from the plan. Stage 03
// shipped two modules specified against numbers that were stale when read.
test('the tree carries exactly the entries the doc prints, no more and no fewer', () => {
  expect(NODES).toHaveLength(DOC_TOKENS.length)
})

test('the entries are the doc entries, in the doc order, since the inspector reads top to bottom', () => {
  expect(NODES.map(label)).toEqual(DOC_TOKENS)
})

// §2's paragraph and the entry criteria agree: the database answer is the only
// thing in the tree that is a decision rather than a default.
test('db is the only conditional folder, because an empty db/ is a placeholder that looks like a decision', () => {
  const conditional = NODES.filter((n) => n.conditional)
  expect(conditional.map((n) => n.path)).toEqual(['src/db/'])
})

test('the doc still says db is the one conditional folder, so a doc rewrite fails here first', () => {
  expect(STRUCTURE).toContain(
    '`src/db/` is the one folder in that tree that is conditional.',
  )
})

test('the entry criteria is still where that conditional comes from', () => {
  expect(DOC).toContain(
    '- [ ] You have decided whether this needs a database *now* (if unsure, it does not)',
  )
})

test('paths are unique, because two schema.ts files exist and the inspector keys on path', () => {
  const paths = NODES.map((n) => n.path)
  expect(new Set(paths).size).toBe(paths.length)
})

test('directories end in a slash and files do not, since kind and path must not disagree', () => {
  for (const node of NODES) {
    expect(node.path.endsWith('/'), `${node.path} kind=${node.kind}`).toBe(
      node.kind === 'dir',
    )
  }
})

test('every node carries a note, because an inspector with nothing to inspect is a picture of a tree', () => {
  for (const node of NODES) {
    expect(node.note.trim().length, node.path).toBeGreaterThan(20)
  }
})

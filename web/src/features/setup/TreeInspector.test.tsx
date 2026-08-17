import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TreeInspector } from './TreeInspector'
import { SRC_TREE, type TreeNode } from './tree'

function flatten(node: TreeNode): TreeNode[] {
  return [node, ...(node.children ?? []).flatMap(flatten)]
}

const NODES = flatten(SRC_TREE)

/** The leading run of a note, up to the first inline-code backtick. */
function plainRun(text: string): string {
  return text.split('`')[0].trim()
}

// §2 says `src/db/` is the one conditional folder in the tree, and the whole
// point of saying so is that a reader should not create it. A component that
// rendered the node like every other one would leave that entirely to the note
// nobody has clicked yet, while `tree.test.ts` stayed green on the `conditional`
// flag it never showed.
test('marks src/db/ as conditional in the rendered tree, not only in the data', () => {
  const { container } = render(<TreeInspector />)
  const marked = container.querySelectorAll('[data-conditional="true"]')
  expect(marked).toHaveLength(1)
  expect(marked[0].textContent).toContain('db')
})

// A node absent from the list is a note the reader cannot reach, and the
// nesting is three levels deep — a renderer that walked only the top level
// would look complete and drop nine nodes.
test('renders every node in the tree as its own control, since a node with no control is a note nobody can open', () => {
  render(<TreeInspector />)
  for (const node of NODES) {
    expect(
      screen.getByRole('button', { name: node.path }),
      `${node.path} is not selectable`,
    ).toBeDefined()
  }
  expect(screen.getAllByRole('button')).toHaveLength(NODES.length)
})

// The click-node inspector's contract: the panel shows the selected node's own
// note. A panel wired to a fixed node, or to the tree's root, passes a render
// smoke test and teaches one thing fourteen times.
test('shows the selected node’s own note, since a detail panel that ignores the selection is a list with decoration', () => {
  render(<TreeInspector />)
  const db = NODES.find((n) => n.path === 'src/db/')!
  const features = NODES.find((n) => n.path === 'src/features/')!

  fireEvent.click(screen.getByRole('button', { name: features.path }))
  expect(screen.getByTestId('tree-note').textContent).toContain(
    plainRun(features.note),
  )

  fireEvent.click(screen.getByRole('button', { name: db.path }))
  const panel = screen.getByTestId('tree-note')
  expect(panel.textContent).toContain(plainRun(db.note))
  expect(panel.textContent).not.toContain(plainRun(features.note))
})

// `kind` is the only thing that separates `src/db/migrations/` from a file, and
// the trailing slash is a convention the reader has to already know. The panel
// says which it is in words.
test('names the selected node as a folder or a file from its kind, since a trailing slash is a convention not a label', () => {
  render(<TreeInspector />)
  const file = NODES.find((n) => n.kind === 'file')!
  const dir = NODES.find((n) => n.kind === 'dir' && n !== SRC_TREE)!

  // `getByText` matches an element whose whole text is the word, so a note that
  // happens to contain "file" cannot satisfy this.
  fireEvent.click(screen.getByRole('button', { name: file.path }))
  expect(
    within(screen.getByTestId('tree-note')).getByText('File'),
  ).toBeDefined()

  fireEvent.click(screen.getByRole('button', { name: dir.path }))
  expect(
    within(screen.getByTestId('tree-note')).getByText('Folder'),
  ).toBeDefined()
})

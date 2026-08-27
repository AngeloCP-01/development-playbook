/**
 * Three tests and the evidence offered that each one bites. The reader judges
 * whether the evidence actually proves anything.
 *
 * All three are this repository's, from
 * `docs/learnings/stage-implementation-101.md`. Two are the documented ways a
 * teeth check lies while looking exactly like a pass; the third is what a real
 * one looks like. They are in that order because recognising the lie is the
 * skill — a reader shown the good one first reads the other two as obviously
 * broken, which they were not to the people who wrote them.
 */
export type Case = {
  id: string
  title: string
  /** The test as written. */
  code: string
  /** What was offered as proof that it bites. */
  evidence: string
  proven: boolean
  verdict: string
}

export const CASES: Case[] = [
  {
    id: 'same-source',
    title: 'A render test over a data-driven badge',
    code: `const gate = GATES.find((g) => g.id === 'browser')!
render(<GateRow gate={gate} />)
expect(screen.getByTestId('catches').getAttribute('data-catches'))
  .toBe(String(gate.catchesIt))`,
    evidence:
      'The author flipped `catchesIt` to `false` in the data module, reran, and the test failed. Restored, and it passed again.',
    proven: false,
    verdict:
      'Both sides of the assertion come off the same row, so flipping the data moved the expectation along with the render and the test could not tell the difference. It failed for a reason that had nothing to do with the component — and it would stay green if the component ignored `catchesIt` entirely, which is the bug it was written to prevent. The fix is a literal: exactly one gate catches this, and it is the browser.',
  },
  {
    id: 'stray-mutation',
    title: 'A test over a type-role class name',
    code: `render(<TitleBlock stage={stage} />)
expect(screen.getByText('Testing').className).toContain('t-display')`,
    evidence:
      'The author ran `perl -0pi -e \'s/className="t-data"/className="x"/\'` against the component, reran, and reported the test failed as expected.',
    proven: false,
    verdict:
      'Without `/g`, that substitution replaces the first occurrence in the slurped file — which was a mention inside a docblock, not the JSX. The mutation never landed on the code the test covers, so nothing was proven either way, and the run said what the author expected it to say. Confirm the mutation is actually in the file, with a diff, before trusting what the run reports.',
  },
  {
    id: 'literal',
    title: 'A test over which gate catches a warning',
    code: `render(<GateTable gates={GATES} />)
const caught = screen.getAllByRole('row')
  .filter((r) => r.getAttribute('data-catches') === 'true')
expect(caught).toHaveLength(1)
expect(caught[0].textContent).toContain('Browser')`,
    evidence:
      'The author deleted the `data-catches` attribute from the row component, confirmed the deletion with `git diff`, reran, and this test failed while the twelve others in the file passed. Restored, reran, all thirteen green.',
    proven: true,
    verdict:
      'The expectation is a literal the data cannot move: exactly one row, and it is the browser. The mutation was confirmed in the file rather than assumed, and only the test under examination failed — a mutation that takes down half the suite tells you the suite is coupled, not that this test bites.',
  },
]

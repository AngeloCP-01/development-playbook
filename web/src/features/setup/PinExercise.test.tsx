import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { PinExercise } from './PinExercise'
import { PIN_RULE, PIN_TARGETS } from './pins'

function row(container: HTMLElement, id: string): HTMLElement {
  const el = container.querySelector<HTMLElement>(`[data-pin="${id}"]`)
  expect(el, `no row rendered for the ${id} environment`).not.toBeNull()
  return el!
}

// The exercise only teaches anything if the wrong pairing can be chosen. An
// implementation that offered each environment only its own answer plus filler
// would satisfy every data test in `pins.test.ts` and score 3/3 for a reader who
// clicked at random.
test('offers every file as a choice for every environment, so the mis-pairing is available to make', () => {
  render(<PinExercise />)
  for (const t of PIN_TARGETS) {
    expect(screen.getAllByRole('radio', { name: t.reads })).toHaveLength(
      PIN_TARGETS.length,
    )
  }
})

// TD-28 in one click: the reader who believes `.nvmrc` reaches production has
// made the mistake the doc used to instruct. The verdict and the reason both
// have to come from the target's own data, not from a message written once in
// the component.
test('scores the host paired with .nvmrc as a mis-pairing and gives that target’s own reason, since that is the defect TD-28 was opened for', () => {
  const { container } = render(<PinExercise />)
  const host = PIN_TARGETS.find((t) => t.id === 'host')!
  const local = PIN_TARGETS.find((t) => t.id === 'local')!

  const hostRow = row(container, 'host')
  fireEvent.click(within(hostRow).getByRole('radio', { name: local.reads }))

  expect(within(hostRow).getByText('Mis-paired')).toBeDefined()

  // The file the host actually reads, written out rather than derived. Both
  // sides of an assertion reading `target.reads` move together, so it cannot
  // tell a component that reads the data from one that ignores it — and this is
  // the one pairing in the stage that has already been wrong in print.
  const answer = within(hostRow).getByRole('radio', {
    name: 'package.json → engines.node',
  })
  expect(answer.textContent).toContain('The answer')
  // Sliced at the first backtick: the data quotes code inline with markdown
  // backticks and the component renders those as <code>, so only the leading
  // plain run survives as one text node.
  expect(hostRow.textContent).toContain(host.why.split('`')[0].trim())
})

// A tally of answers given is not a tally of answers right, and the second is
// the only one worth showing.
test('counts only correct pairings in the score, since a reader who answered all three wrongly has not scored three', () => {
  const { container } = render(<PinExercise />)
  const local = PIN_TARGETS.find((t) => t.id === 'local')!
  const ci = PIN_TARGETS.find((t) => t.id === 'ci')!
  const host = PIN_TARGETS.find((t) => t.id === 'host')!

  fireEvent.click(
    within(row(container, 'local')).getByRole('radio', { name: local.reads }),
  )
  fireEvent.click(
    within(row(container, 'ci')).getByRole('radio', { name: ci.reads }),
  )
  fireEvent.click(
    within(row(container, 'host')).getByRole('radio', { name: local.reads }),
  )

  expect(host.reads).not.toBe(local.reads)
  expect(
    screen.getByText(`2/${PIN_TARGETS.length} paired correctly`),
  ).toBeDefined()
})

// The generalisation is worth more than any of the three pairings, which is why
// it is quoted character-for-character in `pins.ts`. Handing it over before the
// reader has committed turns the exercise into a caption.
test('holds the rule back until every environment is paired, since a generalisation given first is one the reader reads instead of deriving', () => {
  const { container } = render(<PinExercise />)
  expect(screen.queryByText(PIN_RULE)).toBeNull()

  for (const t of PIN_TARGETS) {
    fireEvent.click(
      within(row(container, t.id)).getByRole('radio', { name: t.reads }),
    )
  }

  expect(screen.getByText(PIN_RULE)).toBeDefined()
})

// Guess-then-reveal only scores a guess. Once the verdict is on screen the
// reader knows the answer, so a second attempt scores hindsight.
test('locks a pairing once it is made, since changing an answer after the verdict scores hindsight', () => {
  const { container } = render(<PinExercise />)
  const local = PIN_TARGETS.find((t) => t.id === 'local')!
  const host = PIN_TARGETS.find((t) => t.id === 'host')!

  const localRow = row(container, 'local')
  fireEvent.click(within(localRow).getByRole('radio', { name: host.reads }))

  const correct = within(localRow).getByRole<HTMLButtonElement>('radio', {
    name: local.reads,
  })
  expect(correct.disabled).toBe(true)
})

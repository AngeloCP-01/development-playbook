import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TeethCheck } from './TeethCheck'
import { CASES } from './teeth'

const rowFor = (title: string) =>
  screen.getByRole('radiogroup', { name: new RegExp(title) })

test('renders one row per case', () => {
  render(<TeethCheck />)
  expect(screen.getAllByRole('radiogroup')).toHaveLength(CASES.length)
})

/**
 * Literal, not `String(c.proven)`. The whole subject of this component is a
 * test that reads both sides off one source, and shipping one here would be a
 * poor joke.
 */
test('the perl mutation case is not proven, and saying so scores', () => {
  render(<TeethCheck />)
  fireEvent.click(
    within(rowFor('A test over a type-role class name')).getByRole('radio', {
      name: 'Not proven',
    }),
  )
  expect(screen.getByText('1/1 right')).toBeDefined()
})

test('the literal-assertion case is proven, and saying it is not scores zero', () => {
  render(<TeethCheck />)
  fireEvent.click(
    within(rowFor('A test over which gate catches a warning')).getByRole(
      'radio',
      {
        name: 'Not proven',
      },
    ),
  )
  expect(screen.getByText('0/1 right')).toBeDefined()
})

/**
 * The needle is a literal typed out here, not a slice of `CASES[0].verdict`
 * — this component is the canonical "don't read both sides off one source"
 * example in this codebase, and a derived needle here would teach the wrong
 * habit by resemblance even though nothing here is hollow (it gates on
 * presence/absence, not on a value the data could move to match itself).
 * The query is also scoped to this one case's row, not the whole document,
 * so a false pass can't hide behind some other row already showing text
 * that happens to match.
 */
test('the verdict is hidden until the reader commits', () => {
  render(<TeethCheck />)
  const c = CASES.find((c) => c.id === 'same-source')!
  const verdictPhrase = /exactly one gate catches this, and it is the browser/
  const row = rowFor(c.title).closest('li') as HTMLElement

  expect(within(row).queryByText(verdictPhrase)).toBeNull()
  fireEvent.click(within(row).getByRole('radio', { name: 'Not proven' }))
  expect(within(row).getByText(verdictPhrase)).toBeDefined()
})

test('each code block is reachable by keyboard, since code does not reflow', () => {
  render(<TeethCheck />)
  const blocks = document.querySelectorAll('[data-teeth-code]')
  expect(blocks).toHaveLength(CASES.length)
  for (const b of blocks) expect(b.getAttribute('tabindex')).toBe('0')
})

test('a committed row locks', () => {
  render(<TeethCheck />)
  const c = CASES[0]
  fireEvent.click(
    within(rowFor(c.title)).getByRole('radio', { name: 'Proven' }),
  )
  const radios = within(rowFor(c.title)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
})

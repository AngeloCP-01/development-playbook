import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ClientTrap } from './ClientTrap'
import { CLIENT_FAILURE, GATES } from './client-trap'

const BROWSER = GATES.find((g) => g.catchesIt)!
const SILENT = GATES.filter((g) => !g.catchesIt)

/** The leading run of a `why`, up to the first inline-code backtick. */
function plainRun(text: string): string {
  return text.split('`')[0].trim()
}

// The verdict on each gate is read off `catchesIt`, never written out. A
// component that hardcoded four greens and one red would render identically
// today and lie the moment the data moved — which is exactly what a data-only
// test in `client-trap.test.ts` cannot see.
test('shows every gate as passing except the browser, which is the whole shape of the failure', () => {
  const { container } = render(<ClientTrap />)
  for (const g of GATES) {
    expect(
      screen.getByTestId(`gate-${g.id}`).getAttribute('data-catches'),
    ).toBe(String(g.catchesIt))
  }

  // Pinned as literals, not derived. The loop above reads `catchesIt` on both
  // sides, so it holds whatever the data says and would follow a second gate
  // being marked as catching without noticing. "Exactly one, and it is the
  // browser" is the claim §5 makes, so the render test states it.
  expect(container.querySelectorAll('[data-catches="true"]')).toHaveLength(1)
  expect(screen.getByTestId('gate-browser').getAttribute('data-catches')).toBe(
    'true',
  )
})

// Guess-then-reveal: a verdict on screen before the reader has committed makes
// the counter-intuitive answer a fact to read rather than one to be wrong about.
test('reveals no verdict and no reason until the reader has committed, since an answer nobody guessed teaches nothing', () => {
  render(<ClientTrap />)
  expect(screen.queryByText('Catches it')).toBeNull()
  expect(screen.queryByText('Stays green')).toBeNull()
  expect(screen.queryByText(new RegExp(plainRun(BROWSER.why)))).toBeNull()
})

// The claim the panel is making, stated per gate and derived per gate. Four of
// the five stay green because of something specific to each — the `why` fields
// are five different reasons, not one repeated — so every one of them has to
// come from its own row.
test('labels each gate from its own catchesIt once committed, so four stay green and the browser is the one that catches it', () => {
  render(<ClientTrap />)
  fireEvent.click(screen.getByRole('radio', { name: BROWSER.label }))

  for (const g of GATES) {
    const row = screen.getByTestId(`gate-${g.id}`)
    expect(
      within(row).getByText(g.catchesIt ? 'Catches it' : 'Stays green'),
      `${g.id} is not labelled from its own data`,
    ).toBeDefined()
    expect(row.textContent).toContain(plainRun(g.why))
  }
})

// Committing is what makes it a guess. A reader who can move their answer after
// seeing the verdict has scored nothing.
test('locks the guess once it is made, since a second answer after the reveal is not a guess', () => {
  render(<ClientTrap />)
  fireEvent.click(screen.getByRole('radio', { name: SILENT[0].label }))

  const another = screen.getByRole<HTMLButtonElement>('radio', {
    name: BROWSER.label,
  })
  expect(another.disabled).toBe(true)
})

// The section's own claim is that the failure *shape* is the part worth
// knowing — build green, HTML correct, dead on hydration. Scoring the guess and
// stopping there would drop the lesson and keep the quiz.
test('reveals the failure shape after the guess, since which gate catches it is the setup and not the point', () => {
  // The run between the second and third inline-code spans: build green, HTML
  // correct, dead on hydration. Sliced from the data so it cannot go stale.
  const shape = CLIENT_FAILURE.split('`')[2]

  render(<ClientTrap />)
  expect(document.body.textContent).not.toContain(shape)

  fireEvent.click(screen.getByRole('radio', { name: BROWSER.label }))
  expect(document.body.textContent).toContain(shape)
})

import { fireEvent, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AuthorizationDrill } from './AuthorizationDrill'

function safeButton(c: HTMLElement, id: string) {
  return c.querySelector<HTMLButtonElement>(`[data-answer="${id}-safe"]`)!
}
function unsafeButton(c: HTMLElement, id: string) {
  return c.querySelector<HTMLButtonElement>(`[data-answer="${id}-unsafe"]`)!
}
function verdict(c: HTMLElement, id: string) {
  return c.querySelector(`[data-verdict="${id}"]`)
}

test('renders one row per snippet', () => {
  const { container } = render(<AuthorizationDrill />)
  expect(container.querySelectorAll('[data-snippet]')).toHaveLength(6)
})

/** The whole point of the pattern: no verdict before a commitment. */
test('no verdict is visible before the reader answers', () => {
  const { container } = render(<AuthorizationDrill />)
  expect(container.querySelectorAll('[data-verdict]')).toHaveLength(0)
})

test("answering one row reveals only that row's verdict", () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(safeButton(container, 'list-scoped'))
  expect(verdict(container, 'list-scoped')).not.toBeNull()
  expect(verdict(container, 'detail-unscoped')).toBeNull()
})

/**
 * The literal, not `String(snippet.safe)`. Reading both sides off the same row
 * moves the expectation with the data and proves nothing —
 * `stage-implementation-101.md` names this hole.
 */
test('marking the check-then-write snippet safe is wrong', () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(safeButton(container, 'action-check-then-write'))
  expect(
    verdict(container, 'action-check-then-write')!.getAttribute('data-correct'),
  ).toBe('false')
})

test('marking the scoped list query safe is right', () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(safeButton(container, 'list-scoped'))
  expect(verdict(container, 'list-scoped')!.getAttribute('data-correct')).toBe(
    'true',
  )
})

test('the verdict text is shown, not only the right/wrong flag', () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(unsafeButton(container, 'detail-unscoped'))
  expect(verdict(container, 'detail-unscoped')!.textContent).toContain(
    'The row was already loaded',
  )
})

test('an answer locks, so a reader cannot re-answer into a better score', () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(safeButton(container, 'list-scoped'))
  expect(unsafeButton(container, 'list-scoped').disabled).toBe(true)
  expect(safeButton(container, 'list-scoped').disabled).toBe(true)
})

test('the score counts correct answers across the set', () => {
  const { container } = render(<AuthorizationDrill />)
  const score = () =>
    container.querySelector('[data-score]')!.getAttribute('data-score')

  expect(score()).toBe('0/0')
  fireEvent.click(safeButton(container, 'list-scoped')) // correct
  expect(score()).toBe('1/1')
  fireEvent.click(safeButton(container, 'detail-unscoped')) // wrong
  expect(score()).toBe('1/2')
})

test('the running score is announced, since it changes in place', () => {
  const { container } = render(<AuthorizationDrill />)
  expect(
    container.querySelector('[data-score]')!.getAttribute('aria-live'),
  ).toBe('polite')
})

test('the answer buttons are real radios, not divs with an onclick', () => {
  const { container } = render(<AuthorizationDrill />)
  const group = container.querySelector(
    '[data-snippet="list-scoped"] [role="radiogroup"]',
  )
  expect(group).not.toBeNull()
  expect(safeButton(container, 'list-scoped').getAttribute('role')).toBe(
    'radio',
  )
  expect(
    safeButton(container, 'list-scoped').getAttribute('aria-checked'),
  ).toBe('false')
})

/**
 * M1 (final whole-branch review): the previous test above only ever sampled
 * the unanswered state, where `aria-checked` is `'false'` on every button —
 * exactly what a component hardcoding `aria-checked={false}` would also
 * produce. `AuthorizationDrill.tsx` derives it as `done && chose === true` /
 * `done && chose === false`; a regression to a hardcoded `false` would leave
 * the chosen radio never announcing its selection to a screen-reader user,
 * and the suite above would stay green throughout. Asserting after an
 * answer — on both the button that was chosen and the one that was not — is
 * what a hardcoded `false` cannot pass.
 *
 * Both rows: the derivation branches on `snippet.safe`, so a row where
 * "safe" is the correct choice and one where "unsafe" is are covered
 * separately rather than assuming the wiring is identical either way.
 */
test('the chosen radio reports checked and the other does not, once answered (safe row)', () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(safeButton(container, 'list-scoped'))
  expect(
    safeButton(container, 'list-scoped').getAttribute('aria-checked'),
  ).toBe('true')
  expect(
    unsafeButton(container, 'list-scoped').getAttribute('aria-checked'),
  ).toBe('false')
})

test('the chosen radio reports checked and the other does not, once answered (unsafe row)', () => {
  const { container } = render(<AuthorizationDrill />)
  fireEvent.click(unsafeButton(container, 'detail-unscoped'))
  expect(
    unsafeButton(container, 'detail-unscoped').getAttribute('aria-checked'),
  ).toBe('true')
  expect(
    safeButton(container, 'detail-unscoped').getAttribute('aria-checked'),
  ).toBe('false')
})

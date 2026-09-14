// web/src/features/observability/Drill.test.tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Drill } from './Drill'
import { OPTIONS, QUESTION, ROWS, SUBTITLE } from './scrubber'

const mount = () =>
  render(
    <Drill
      idPrefix="test-scrubber"
      question={QUESTION}
      subtitle={SUBTITLE}
      options={OPTIONS}
      rows={ROWS}
    />,
  )

// Every row offers the same options, so an unscoped getByRole('radio')
// matches many. Each row is reached by its prompt, which is the radiogroup's
// accessible name (backticks stripped).
const rowFor = (prompt: string) =>
  screen.getByRole('radiogroup', {
    name: new RegExp(
      prompt
        .replace(/`/g, '')
        .split(' ')
        .slice(0, 5)
        .join(' ')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ),
  })

const pick = (prompt: string, label: string) =>
  fireEvent.click(within(rowFor(prompt)).getByRole('radio', { name: label }))

const AUTH = "The request's `Authorization: Bearer …` header."
const LOG =
  'A `logger.warn` line whose message includes the same connection string.'

test('renders one radiogroup per row, from the data', () => {
  mount()
  expect(screen.getAllByRole('radiogroup')).toHaveLength(ROWS.length)
})

test('every row offers every option', () => {
  mount()
  for (const r of ROWS) {
    expect(within(rowFor(r.prompt)).getAllByRole('radio')).toHaveLength(
      OPTIONS.length,
    )
  }
})

test('the question and subtitle render', () => {
  mount()
  expect(screen.getByText(/scrub this before it leaves/)).toBeDefined()
  expect(screen.getByText(/covers three surfaces/)).toBeDefined()
})

// Literals on both sides, never `ROWS[i].answer` — a test that reads the
// answer off the row it scores cannot see a component scoring the wrong field.
test('the authorization header scored as scrubbed is right', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  expect(screen.getByText('1/1 right')).toBeDefined()
})

test('the log line scored as scrubbed is wrong', () => {
  mount()
  pick(LOG, 'Scrubbed')
  expect(screen.getByText('0/1 right')).toBeDefined()
})

test('the why is hidden until the reader commits', () => {
  mount()
  const row = rowFor(LOG).closest('li') as HTMLElement
  const why = /does nothing to log output/
  expect(within(row).queryByText(why)).toBeNull()
  pick(LOG, 'Reaches Sentry')
  expect(within(row).getByText(why)).toBeDefined()
})

test('a committed row locks, so a second guess cannot score hindsight', () => {
  mount()
  pick(AUTH, 'Reaches Sentry')
  expect(screen.getByText('0/1 right')).toBeDefined()
  pick(AUTH, 'Scrubbed')
  expect(screen.getByText('0/1 right')).toBeDefined()
  const radios = within(rowFor(AUTH)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
})

test('the running score is announced', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  expect(screen.getByText('1/1 right').getAttribute('aria-live')).toBe('polite')
})

test('a verdict is coloured go or danger, never brand', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  const row = rowFor(AUTH).closest('li') as HTMLElement
  const verdict = within(row).getByText('Correct')
  expect(verdict.className).toMatch(/text-go/)
  expect(verdict.className).not.toMatch(/brand/)
})

test('reset clears every answer and the score', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  fireEvent.click(screen.getByRole('button', { name: /reset/i }))
  expect(screen.queryByText(/right$/)).toBeNull()
  const radios = within(rowFor(AUTH)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(false)
})

test('panel ids derive from idPrefix, so two drills on one page cannot collide', () => {
  const { container } = mount()
  expect(container.querySelector('#test-scrubber-pino-log-line')).not.toBeNull()
})

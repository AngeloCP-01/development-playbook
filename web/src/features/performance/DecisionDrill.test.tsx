import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { DecisionDrill } from './DecisionDrill'
import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './decisions'

function answer(id: string, cases = COMPARISON_CASES) {
  const item = cases.find((row) => row.id === id)!
  fireEvent.click(
    screen.getByRole('radio', {
      name: item.options.find((row) => row.id === item.answer)!.label,
    }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  return item
}

test('wrong and right answers both reveal the rationale and the first commit stays locked', () => {
  const item = BOTTLENECK_CASES[0]
  render(<DecisionDrill title="Cart diagnosis" cases={BOTTLENECK_CASES} />)
  expect(screen.queryByText(item.why)).toBeNull()
  const wrong = item.options.find((row) => row.id !== item.answer)!
  fireEvent.click(screen.getByRole('radio', { name: wrong.label }))
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText(item.why)).toBeTruthy()
  expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
  for (const radio of screen.getAllByRole('radio'))
    expect((radio as HTMLInputElement).disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Reset decisions' }))
  expect(screen.queryByText(item.why)).toBeNull()
  fireEvent.click(
    screen.getByRole('radio', {
      name: item.options.find((row) => row.id === item.answer)!.label,
    }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText(item.why)).toBeTruthy()
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
})

test('comparison verdicts follow user evidence instead of the internal query improvement', () => {
  render(<DecisionDrill title="Compare outcomes" cases={COMPARISON_CASES} />)
  for (const [index, item] of COMPARISON_CASES.entries()) {
    const table = screen.getByRole('table', {
      name: 'Before and after evidence',
    })
    for (const row of item.comparison ?? []) {
      expect(table.textContent).toContain(row.before)
      expect(table.textContent).toContain(row.after)
    }
    answer(item.id)
    expect(screen.getByText(item.why)).toBeTruthy()
    if (index < COMPARISON_CASES.length - 1)
      fireEvent.click(screen.getByRole('button', { name: 'Next case' }))
  }
  expect(screen.getByText('4 of 4 decisions correct')).toBeTruthy()
})

test('changed answer data changes the rendered verdict, rather than a hidden id-based answer map', () => {
  const source = QUERY_CASES[0]
  const custom = {
    ...source,
    answer: source.options[1].id,
    why: 'Changed evidence requires a different experiment.',
  }
  render(<DecisionDrill title="Changed case" cases={[custom]} />)
  fireEvent.click(screen.getByRole('radio', { name: custom.options[1].label }))
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
  expect(screen.getByText(custom.why)).toBeTruthy()
})

test('two drills use independent native radio names so choosing one cannot uncheck the other', () => {
  render(
    <>
      <DecisionDrill title="First" cases={QUERY_CASES} />
      <DecisionDrill title="Second" cases={QUERY_CASES} />
    </>,
  )
  const groups = screen.getAllByRole('group', { name: QUERY_CASES[0].prompt })
  const first = within(groups[0]).getAllByRole('radio')[0] as HTMLInputElement
  const second = within(groups[1]).getAllByRole('radio')[1] as HTMLInputElement
  expect(first.type).toBe('radio')
  expect(first.name).not.toBe(second.name)
  fireEvent.click(first)
  fireEvent.click(second)
  expect(first.checked).toBe(true)
  expect(second.checked).toBe(true)
})

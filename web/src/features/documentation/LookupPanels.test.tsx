import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import {
  ChoosePanel,
  ReferencePanel,
  ChangesPanel,
  HistoryPanel,
} from './LookupPanels'
import { LookupInspector } from './LookupInspector'
import { ARTIFACTS, CHANGES, FACTS, HISTORY, NEEDS } from './lookups'
test('every selector reveals the facts belonging to its actual row', () => {
  for (const entries of [NEEDS, FACTS, CHANGES, HISTORY]) {
    const view = render(<LookupInspector title="Lookup" entries={entries} />)
    for (const entry of entries) {
      fireEvent.click(screen.getByRole('tab', { name: entry.label }))
      const panel = screen.getByRole('tabpanel', { name: entry.label })
      expect(panel.textContent).toContain(entry.summary)
      for (const fact of entry.details)
        expect(panel.textContent).toContain(fact.text)
    }
    view.unmount()
  }
})
test('changed inspector data reaches the rendered detail instead of a hard-coded default', () => {
  render(
    <LookupInspector
      title="Injected"
      entries={[
        {
          ...FACTS[0],
          details: [{ label: 'Source', text: 'Changed source sentinel' }],
        },
      ]}
    />,
  )
  expect(screen.getByRole('tabpanel').textContent).toContain(
    'Changed source sentinel',
  )
})
test('answers the exact-facts document-form choice without leaving its first panel', () => {
  render(<ReferencePanel />)
  expect(
    screen.getByText(
      /reference.*exact names, types, allowed values and defaults/i,
    ),
  ).toBeTruthy()
  expect(screen.getByText(/tutorials guide a learning exercise/i)).toBeTruthy()
  expect(
    screen.getByText(/explanations cover concepts and reasons/i),
  ).toBeTruthy()
})
test('the reference distinguishes an unset setting from an omitted optional response', () => {
  render(<ReferencePanel />)
  expect(screen.getByText('integer 1–365')).toBeTruthy()
  expect(screen.getByText('30 when unset')).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: 'waitlistPosition' }))
  expect(screen.getByText('positive integer')).toBeTruthy()
  expect(screen.getByText('omitted when not waitlisted')).toBeTruthy()
  expect(screen.getByText(/absent, null and empty/)).toBeTruthy()
  expect(screen.getByText(/books or cancels/)).toBeTruthy()
  expect(screen.getByText(/reads\/writes/)).toBeTruthy()
})
test('the six change chains include actual enforcement and source checks rather than a generation guarantee', () => {
  expect(CHANGES.map((row) => row.id)).toEqual([
    'configuration',
    'response',
    'values',
    'boundary',
    'procedure',
    'failure',
  ])
  render(<ChangesPanel />)
  fireEvent.click(
    screen.getByRole('button', { name: 'Does configuration enforce itself?' }),
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'What does automation establish?' }),
  )
  expect(
    screen.getByText(/only if the application actually invokes it/),
  ).toBeTruthy()
  expect(screen.getByText(/Generation follows its input/)).toBeTruthy()
  expect(screen.getByText(/When working alone, you are the owner/)).toBeTruthy()
})
test('artifact choices remain optional and release material distinguishes its audiences', () => {
  render(<ChoosePanel />)
  expect(NEEDS.map((row) => row.id)).toEqual([
    'tutorial',
    'how-to',
    'reference',
    'explanation',
  ])
  expect(NEEDS.map((row) => row.summary.split(':')[0])).toEqual([
    'Tutorial',
    'How-to guide',
    'Reference',
    'Explanation',
  ])
  expect(ARTIFACTS.map((row) => row.id)).toEqual([
    'readme',
    'architecture',
    'adr',
    'conventions',
    'troubleshooting',
    'changelog',
    'release-notes',
  ])
  for (const row of ARTIFACTS) {
    fireEvent.click(screen.getByRole('button', { name: row.label }))
    expect(screen.getByText(row.summary)).toBeTruthy()
  }
  expect(screen.getByText(/not a raw commit dump/)).toBeTruthy()
  expect(screen.getByText(/not a nine-document mandate/)).toBeTruthy()
})
test('history distinguishes preservation from current instructions and points to the actual commit guidance', () => {
  render(<HistoryPanel />)
  fireEvent.click(screen.getByRole('tab', { name: 'Current instructions' }))
  expect(screen.getByText(/correct, redirect or retire/i)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Commit context' }))
  expect(screen.getByText(/a clear subject can be enough/)).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Stage 05 commit guidance' })
      .getAttribute('href'),
  ).toBe('/stages/05-development#commits')
})

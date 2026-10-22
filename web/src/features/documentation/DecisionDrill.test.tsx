import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { DecisionDrill } from './DecisionDrill'
import { DocumentationSession } from './DocumentationSession'
import { COMMENT_CASES, EVIDENCE_CASES, type DecisionCase } from './practice'
const customCase: DecisionCase = {
  id: 'custom',
  prompt: 'Which supplied constraint matters?',
  excerpt: 'A supplied example has a bounded output.',
  options: [
    { id: 'bounded', text: 'Respect the supplied bound' },
    { id: 'unbounded', text: 'Assume unlimited output' },
  ],
  answer: 'bounded',
  rationale: 'The supplied bound must remain discoverable to callers.',
}
function Mount({ cases = COMMENT_CASES }: { cases?: typeof COMMENT_CASES }) {
  const [show, setShow] = useState(true)
  return (
    <DocumentationSession>
      <button onClick={() => setShow((v) => !v)}>Switch stage panel</button>
      {show && <DecisionDrill setId="test" title="Practice" cases={cases} />}
    </DocumentationSession>
  )
}
test('every authored case reveals reasoning after a wrong committed choice and reset removes draft and verdict', () => {
  for (const item of [...COMMENT_CASES, ...EVIDENCE_CASES, customCase]) {
    const view = render(<Mount cases={[item]} />)
    expect(screen.queryByText(item.rationale)).toBeNull()
    const wrong = item.options.find((option) => option.id !== item.answer)!
    fireEvent.click(screen.getByRole('radio', { name: wrong.text }))
    expect(screen.queryByText(item.rationale)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText(item.rationale)).toBeTruthy()
    expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
    expect(
      (screen.getByRole('radio', { name: wrong.text }) as HTMLInputElement)
        .disabled,
    ).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Reset practice' }))
    expect(screen.queryByText(item.rationale)).toBeNull()
    expect(
      (screen.getByRole('radio', { name: wrong.text }) as HTMLInputElement)
        .checked,
    ).toBe(false)
    expect(screen.queryByText('0 of 1 decisions correct')).toBeNull()
    view.unmount()
  }
})
test('committed score and an uncommitted next-case draft survive leaving the stage panel', () => {
  render(<Mount />)
  fireEvent.click(
    screen.getByRole('radio', {
      name: COMMENT_CASES[0].options.find(
        (o) => o.id === COMMENT_CASES[0].answer,
      )!.text,
    }),
  )
  fireEvent.click(screen.getByText('Check answer'))
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
  fireEvent.click(screen.getByText('Next case'))
  fireEvent.click(
    screen.getByRole('radio', { name: COMMENT_CASES[1].options[0].text }),
  )
  fireEvent.click(screen.getByText('Switch stage panel'))
  fireEvent.click(screen.getByText('Switch stage panel'))
  expect(
    (
      screen.getByRole('radio', {
        name: COMMENT_CASES[1].options[0].text,
      }) as HTMLInputElement
    ).checked,
  ).toBe(true)
  expect(screen.queryByText(COMMENT_CASES[1].rationale)).toBeNull()
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
  fireEvent.click(screen.getByText('Previous case'))
  expect(screen.getByText(COMMENT_CASES[0].rationale)).toBeTruthy()
})
test('the authored sets cover the four comment reasons and three distinct evidence levels', () => {
  expect(COMMENT_CASES.map((c) => c.id)).toEqual([
    'external',
    'deviation',
    'logic',
    'limit',
  ])
  expect(EVIDENCE_CASES.map((c) => c.answer)).toEqual([
    'read',
    'compile',
    'execute',
  ])
  expect(COMMENT_CASES[0].rationale).toContain('500-character')
  expect(EVIDENCE_CASES[2].rationale).toContain(
    'does not establish production recovery',
  )
  for (const item of [...COMMENT_CASES, ...EVIDENCE_CASES, customCase]) {
    expect(item.options.filter((o) => o.id === item.answer)).toHaveLength(1)
    expect(new Set(item.options.map((o) => o.id)).size).toBe(
      item.options.length,
    )
  }
})

test('AI drafting requires a reviewer source and privacy checks beyond the practice score', async () => {
  const { AIPanel } = await import('./PracticePanels')
  render(
    <DocumentationSession>
      <AIPanel />
    </DocumentationSession>,
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'Ground and review the draft' }),
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'Record the limits of validation' }),
  )
  expect(screen.getByText(/A named reviewer/)).toBeTruthy()
  expect(screen.getByText(/Use synthetic identifiers/)).toBeTruthy()
  expect(screen.getByText(/label missing facts/)).toBeTruthy()
})

test('comment and evidence scores and resets remain independent in the same stage session', () => {
  render(
    <DocumentationSession>
      <section aria-label="Comments practice">
        <DecisionDrill setId="comments" title="Comments" cases={[customCase]} />
      </section>
      <section aria-label="Evidence practice">
        <DecisionDrill setId="evidence" title="Evidence" cases={[customCase]} />
      </section>
    </DocumentationSession>,
  )
  const comments = within(
    screen.getByRole('region', { name: 'Comments practice' }),
  )
  const evidence = within(
    screen.getByRole('region', { name: 'Evidence practice' }),
  )
  expect(
    (
      comments.getByRole('button', {
        name: 'Check answer',
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(true)
  fireEvent.click(
    comments.getByRole('radio', { name: 'Respect the supplied bound' }),
  )
  fireEvent.click(comments.getByRole('button', { name: 'Check answer' }))
  expect(comments.getByText('1 of 1 decisions correct')).toBeTruthy()
  expect(evidence.queryByText('1 of 1 decisions correct')).toBeNull()
  fireEvent.click(
    evidence.getByRole('radio', { name: 'Respect the supplied bound' }),
  )
  fireEvent.click(evidence.getByRole('button', { name: 'Check answer' }))
  fireEvent.click(comments.getByRole('button', { name: 'Reset practice' }))
  expect(comments.queryByText(customCase.rationale)).toBeNull()
  expect(evidence.getByText(customCase.rationale)).toBeTruthy()
  expect(evidence.getByText('1 of 1 decisions correct')).toBeTruthy()
})

test('caller supplied cases drive the prompt and an empty set offers no decisions', () => {
  const view = render(
    <DocumentationSession>
      <DecisionDrill
        setId="custom"
        title="Supplied case"
        cases={[customCase]}
      />
    </DocumentationSession>,
  )
  expect(screen.getByRole('group', { name: customCase.prompt })).toBeTruthy()
  expect(screen.getByText(customCase.excerpt)).toBeTruthy()
  expect(
    (screen.getByRole('button', { name: 'Previous case' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
  expect(
    (screen.getByRole('button', { name: 'Next case' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
  view.rerender(
    <DocumentationSession>
      <DecisionDrill setId="empty" title="Empty set" cases={[]} />
    </DocumentationSession>,
  )
  expect(screen.getByText('No cases are available.')).toBeTruthy()
  expect(screen.queryByRole('radio')).toBeNull()
})

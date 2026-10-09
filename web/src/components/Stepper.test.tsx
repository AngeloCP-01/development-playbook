import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { Stepper, type Step } from './Stepper'

function LocalJudgment() {
  const [answer, setAnswer] = useState('')
  return (
    <label>
      Draft judgment
      <input
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
      />
    </label>
  )
}

test('switching steps and returning starts a fresh local judgment even when both panels resolve to the same child type', () => {
  window.history.replaceState(null, '', '/stages/test')
  const steps: Step[] = [
    {
      id: 'first',
      label: 'First judgment',
      hint: 'One decision',
      content: <LocalJudgment />,
    },
    {
      id: 'second',
      label: 'Second judgment',
      hint: 'A different decision',
      content: <LocalJudgment />,
    },
  ]
  render(<Stepper steps={steps} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Draft judgment' }), {
    target: { value: 'First committed idea' },
  })
  expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
    'First committed idea',
  )
  fireEvent.click(screen.getByRole('tab', { name: /Second judgment/ }))
  expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'Second idea' },
  })
  fireEvent.click(screen.getByRole('tab', { name: /First judgment/ }))
  expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
})

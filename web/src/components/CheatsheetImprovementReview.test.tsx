import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

function renderReview() {
  const sheet = cheatsheetBySlug('improvement-review')
  expect(sheet).toBeDefined()
  return render(<CheatsheetView sheet={sheet!} />)
}

function description(term: string) {
  const label = screen.getByText(term, { selector: 'dt span' })
  return within(label.closest('dt')!.nextElementSibling as HTMLElement)
}

test('the registered review shows how to compare a baseline with an actual outcome', () => {
  renderReview()
  expect(
    description('Task and outcome type').getByText(
      /Separate product outcomes.*from delivery\/process signals/,
    ),
  ).toBeTruthy()
  expect(
    description('Baseline and expected result').getByText(
      /population, date window, event meanings, numerator\/denominator.*comparison method and desired change/,
    ),
  ).toBeTruthy()
  expect(
    description('Actual outcome').getByText(
      /Compare observed results with the prediction.*state what remains inconclusive/,
    ),
  ).toBeTruthy()
  expect(
    description('Data quality and comparability').getByText(
      /missing events.*changed definitions or audiences.*concurrent changes/,
    ),
  ).toBeTruthy()
  expect(
    screen.getByText(
      /before\/after change alone does not establish useful or causal improvement/,
    ),
  ).toBeTruthy()
})

test('inconclusive evidence stays separate from the available decisions and urgent harm response', () => {
  renderReview()
  expect(
    screen.getByText(
      /Inconclusive is an evidence status.*temporary keep or another action without implying success/,
    ),
  ).toBeTruthy()
  expect(
    description('Keep').getByText(/temporarily with inconclusive evidence/),
  ).toBeTruthy()
  expect(
    description('Adapt').getByText(/new prediction and review method/),
  ).toBeTruthy()
  expect(description('Revert').getByText(/Verify recovery/)).toBeTruthy()
  expect(
    description('Investigate further').getByText(
      /do not force a positive conclusion/,
    ),
  ).toBeTruthy()
  expect(
    screen.getByText(
      /For any decision.*reasons.*uncertainty, an owner and the next check/,
    ),
  ).toBeTruthy()
  expect(
    description('Guardrails and recovery').getByText(
      /Route active incidents.*do not wait/,
    ),
  ).toBeTruthy()
})

test('the actual sheet links its teaching stage and all four credited text sources', () => {
  renderReview()
  expect(
    screen
      .getByRole('link', { name: /Continuous Improvement/ })
      .getAttribute('href'),
  ).toBe('/stages/18-continuous-improvement')
  const footer = within(document.querySelector('footer')!)
  const citations = [
    ['PDSA Cycle', 'https://deming.org/explore/pdsa/', /Deming Institute/],
    [
      'Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications',
      'https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/',
      /Rodden.*Hutchinson.*Fu/,
    ],
    [
      'Patterns of Trustworthy Experimentation: During-Experiment Stage',
      'https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/',
      /Machmouchi.*Gupta.*Zhang/,
    ],
    [
      'Analyse a research session',
      'https://www.gov.uk/service-manual/user-research/analyse-a-research-session',
      /User research community/,
    ],
  ] as const
  for (const [name, href, author] of citations) {
    const link = footer.getByRole('link', { name })
    expect(link.getAttribute('href')).toBe(href)
    expect(link.parentElement?.textContent).toMatch(author)
  }
  expect(document.querySelector('img')).toBeNull()
  expect(screen.queryByText('Sheet not drawn')).toBeNull()
})

import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetsForStage } from '@/lib/cheatsheets'
import { sheetSources } from '@/lib/cheatsheets/sheet-sources'
import { CheatsheetView } from './Cheatsheet'

function renderSheet() {
  const sheets = cheatsheetsForStage('17-maintenance')
  expect(sheets.map((sheet) => sheet.slug)).toEqual(['technical-debt'])
  const sheet = sheets[0]
  render(<CheatsheetView sheet={sheet} />)
  return sheet
}

test('maintenance exposes the whole debt review without opening a stage panel', () => {
  const sheet = renderSheet()
  expect(screen.queryByText('Sheet not drawn')).toBeNull()
  expect(
    screen
      .getByRole('link', { name: /Belongs to.*Maintenance/ })
      .getAttribute('href'),
  ).toBe('/stages/17-maintenance')
  for (const section of sheet.sections) {
    expect(screen.getByRole('heading', { name: section.title })).toBeTruthy()
    if (section.note) expect(screen.getByText(section.note)).toBeTruthy()
    for (const row of section.rows) {
      const term = screen.getByText(row.term!).closest('dt')!
      const definition = term.nextElementSibling as HTMLElement
      expect(within(definition).getByText(row.what)).toBeTruthy()
      if (row.when) expect(within(definition).getByText(row.when)).toBeTruthy()
    }
  }
  expect(
    screen.getByText(/not a scoring system prescribed by Fowler/),
  ).toBeTruthy()
  expect(
    screen.getByText(/Missing telemetry leaves usage unknown/),
  ).toBeTruthy()
  expect(
    screen.getByText(/cannot restore deleted production data/),
  ).toBeTruthy()
})

test('the hidden quadrant has all four cases and both axes in accessible text', () => {
  renderSheet()
  const section = screen
    .getByRole('heading', { name: 'Recognize the debt' })
    .closest('section')!
  expect(
    within(section).getByText(
      /care in the decision.*awareness of taking on debt/,
    ),
  ).toBeTruthy()
  expect(
    within(section).getByText(/does not determine repayment urgency, blame/),
  ).toBeTruthy()
  for (const [term, meaning] of [
    ['Reckless / deliberate', /knowingly skips design work/],
    ['Prudent / deliberate', /weighs the consequences.*earlier release/],
    ['Reckless / inadvertent', /lacks design knowledge.*without recognizing/],
    ['Prudent / inadvertent', /learns through building.*better design/],
  ] as const) {
    const definition = within(section).getByText(term).closest('dt')!
      .nextElementSibling as HTMLElement
    expect(within(definition).getByText(meaning)).toBeTruthy()
  }
  expect(screen.queryByRole('img')).toBeNull()
  const figure = screen.getByRole('figure')
  const image = figure.querySelector('img')!
  expect(image.getAttribute('alt')).toBe('')
  expect(image.getAttribute('aria-hidden')).toBe('true')
  expect(image.getAttribute('width')).toBe('512')
  expect(image.getAttribute('height')).toBe('384')
  expect(image.getAttribute('src')).toContain('stage-17-tech-debt-quadrant.png')
  expect(within(figure).getByText('The gathered original')).toBeTruthy()
})

test('the gathered quadrant has adjacent author credit, original link and change disclosure', () => {
  const sheet = renderSheet()
  const figure = screen.getByRole('figure')
  const footer = figure.nextElementSibling as HTMLElement
  expect(footer.tagName).toBe('FOOTER')
  expect(
    within(footer).getByText(/Martin Fowler \(2009\); unchanged illustration/),
  ).toBeTruthy()
  for (const source of sheetSources(sheet)) {
    expect(
      within(footer)
        .getByRole('link', { name: source.title })
        .getAttribute('href'),
    ).toBe(source.url)
  }
  expect(sheet.source?.image?.origin).toBeUndefined()
})

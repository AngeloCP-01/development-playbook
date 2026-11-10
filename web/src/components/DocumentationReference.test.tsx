import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetsForStage } from '@/lib/cheatsheets'
import { sheetSources } from '@/lib/cheatsheets/sheet-sources'
import { CheatsheetView } from './Cheatsheet'

test('the documentation route exposes the complete change-check card and its sources without selecting a stage panel', () => {
  const sheets = cheatsheetsForStage('10-documentation')
  expect(sheets.map((sheet) => sheet.slug)).toEqual(['documentation'])
  const sheet = sheets[0]
  render(<CheatsheetView sheet={sheet} />)

  expect(screen.queryByText('Sheet not drawn')).toBeNull()
  expect(
    screen
      .getByRole('link', { name: /Belongs to.*Documentation/ })
      .getAttribute('href'),
  ).toBe('/stages/10-documentation')
  for (const section of sheet.sections) {
    expect(screen.getByRole('heading', { name: section.title })).toBeTruthy()
    if (section.note) expect(screen.getByText(section.note)).toBeTruthy()
    for (const row of section.rows) {
      expect(screen.getByText(row.term!)).toBeTruthy()
      expect(screen.getByText(row.what)).toBeTruthy()
      if (row.when) expect(screen.getByText(row.when)).toBeTruthy()
    }
  }
  for (const source of sheetSources(sheet)) {
    expect(
      screen.getByRole('link', { name: source.title }).getAttribute('href'),
    ).toBe(source.url)
  }
})

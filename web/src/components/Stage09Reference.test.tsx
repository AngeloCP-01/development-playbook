import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { cheatsheetsForStage } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

test.each(['caching', 'scaling'])(
  'the registered %s route data renders drawn content and its stage tether',
  (slug) => {
    const sheet = cheatsheetsForStage('09-performance-optimization').find(
      (sheet) => sheet.slug === slug,
    )
    expect(sheet).toBeDefined()
    render(<CheatsheetView sheet={sheet!} />)
    expect(screen.queryByText('Sheet not drawn')).toBeNull()
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(
      0,
    )
    expect(
      screen
        .getByRole('link', { name: /Performance Optimization/ })
        .getAttribute('href'),
    ).toBe('/stages/09-performance-optimization')
    expect(screen.getByText('Sources', { exact: true })).toBeTruthy()
  },
)

import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { DecisionsPanel, ReadmePanel } from './DocumentPanels'
import { ADRS, documentMarkdown, README } from './documents'
afterEach(() => vi.unstubAllGlobals())
test('the README keeps unknown setup facts visible and copies the same outline a maintainer reads', async () => {
  const write = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText: write } })
  render(<ReadmePanel />)
  expect(
    screen.getByText(/Supported prerequisites and tool versions/).textContent,
  ).toContain('[actual prerequisites]')
  expect(
    screen.getByText(/Clone, install and startup commands/).textContent,
  ).toContain('[commands tested for this revision]')
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy README outline' }))
  })
  expect(write).toHaveBeenCalledWith(documentMarkdown(README))
  fireEvent.click(screen.getByRole('button', { name: 'Fresh-clone check' }))
  expect(screen.getByText(/without private instructions/)).toBeTruthy()
  expect(
    screen.getByText(
      /revision, prerequisites, configuration source, commands and expected result/,
    ),
  ).toBeTruthy()
})
test('the old ADR itself declares its dated current status and preserves the accepted history', async () => {
  const write = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText: write } })
  render(<DecisionsPanel />)
  const old = screen.getByRole('region', { name: ADRS.old.filename })
  expect(within(old).getByText('Status: Accepted')).toBeTruthy()
  expect(
    within(old).getByText('2026-10-20 — Current status: Superseded.'),
  ).toBeTruthy()
  expect(
    within(old).getByText(
      'The original context, date and reasoning above are preserved.',
    ),
  ).toBeTruthy()
  fireEvent.click(within(old).getByRole('button', { name: 'Read ADR 005' }))
  const current = screen.getByRole('region', {
    name: ADRS.replacement.filename,
  })
  expect(within(current).getByText('Status: Accepted')).toBeTruthy()
  expect(within(current).getByText('Date: 2026-10-20')).toBeTruthy()
  expect(
    screen.getByRole('tab', { name: 'ADR 005' }).getAttribute('aria-selected'),
  ).toBe('true')
  expect(document.activeElement).toBe(
    screen.getByRole('tab', { name: 'ADR 005' }),
  )
  await act(async () => {
    fireEvent.click(
      within(current).getByRole('button', { name: 'Copy ADR 005' }),
    )
  })
  expect(write).toHaveBeenCalledWith(documentMarkdown(ADRS.replacement))
  fireEvent.click(within(current).getByRole('button', { name: 'Read ADR 004' }))
  expect(screen.getByRole('region', { name: ADRS.old.filename })).toBeTruthy()
  expect(documentMarkdown(ADRS.old)).toContain(
    '[ADR 005](005-generated-contract-reference.md)',
  )
  expect(documentMarkdown(ADRS.replacement)).toContain(
    '[ADR 004](004-manual-field-reference.md)',
  )
})
test('the blank ADR is explicitly a template with project facts to supply rather than a copied Workshop decision', () => {
  render(<DecisionsPanel />)
  fireEvent.click(screen.getByRole('tab', { name: 'Blank template' }))
  const template = screen.getByRole('region', { name: ADRS.template.filename })
  for (const heading of [
    'Context',
    'Decision',
    'Reasoning',
    'Consequences',
    'Alternatives',
  ])
    expect(
      within(template).getByRole('heading', { name: heading }),
    ).toBeTruthy()
  expect(template.textContent).toContain('[actual date]')
  expect(template.textContent).not.toContain('Status: Accepted')
  expect(template.textContent).not.toContain('Workshop')
})

import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { PerformanceWorksheet } from './PerformanceWorksheet'
import {
  EMPTY_PERFORMANCE_SHEET,
  PERFORMANCE_KEY,
  performanceMarkdown,
  SHEET_FIELDS,
} from '@/lib/performance-sheet'

let writeText = vi.fn<(text: string) => Promise<void>>()
beforeEach(() => {
  window.localStorage.clear()
  writeText = vi
    .fn<(text: string) => Promise<void>>()
    .mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText } })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function edit(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

test('baseline and follow-up edits survive panel remounts and export the whole record from either view', async () => {
  let view = render(<PerformanceWorksheet view="baseline" />)
  edit('Outcome and observer', 'Browser click to response')
  edit('Metric and population', 'Completed p95; failures/timeouts separate')
  view.unmount()
  view = render(<PerformanceWorksheet view="followup" />)
  edit('Verdict and open gap', 'More field observations needed')
  const expected = {
    ...EMPTY_PERFORMANCE_SHEET,
    outcome: 'Browser click to response',
    metric: 'Completed p95; failures/timeouts separate',
    verdict: 'More field observations needed',
  }
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  expect(writeText).toHaveBeenLastCalledWith(performanceMarkdown(expected))
  expect(screen.getByRole('status', { name: 'Copy status' }).textContent).toBe(
    'Copied to clipboard.',
  )
  expect(JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!)).toEqual(
    expected,
  )
  view.unmount()
  render(<PerformanceWorksheet view="baseline" />)
  expect(
    (screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement)
      .value,
  ).toBe(expected.outcome)
  expect(screen.getByText('3 of 11 fields recorded')).toBeTruthy()
})

test('malformed or partial stored values never crash and a later edit keeps valid fields from the other view', () => {
  for (const raw of [
    '{broken',
    'null',
    '[]',
    '{"outcome":"Keep me","verdict":"Observe","metric":95}',
  ]) {
    window.localStorage.setItem(PERFORMANCE_KEY, raw)
    const view = render(<PerformanceWorksheet view="baseline" />)
    edit('Scope', 'Mobile; warm cache')
    const saved = JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!)
    expect(saved.scope).toBe('Mobile; warm cache')
    expect(typeof saved.metric).toBe('string')
    if (raw.includes('Keep me')) {
      expect(saved.outcome).toBe('Keep me')
      expect(saved.verdict).toBe('Observe')
    }
    view.unmount()
  }
})

test('denied reads or writes retain a mounted editable draft and export it instead of claiming it was saved', async () => {
  for (const method of ['getItem', 'setItem'] as const) {
    window.localStorage.clear()
    const denied = vi
      .spyOn(Storage.prototype, method)
      .mockImplementation(() => {
        throw new Error('Storage denied')
      })
    const view = render(<PerformanceWorksheet view="baseline" />)
    edit('Outcome and observer', 'Unsaved browser outcome')
    edit('Scope', 'Unsaved scope')
    expect(
      (screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement)
        .value,
    ).toBe('Unsaved browser outcome')
    expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
    })
    expect(writeText).toHaveBeenLastCalledWith(
      performanceMarkdown({
        ...EMPTY_PERFORMANCE_SHEET,
        outcome: 'Unsaved browser outcome',
        scope: 'Unsaved scope',
      }),
    )
    view.unmount()
    denied.mockRestore()
  }
})

test('a rejected clipboard operation offers exact manual Markdown without losing the worksheet', async () => {
  writeText.mockRejectedValue(new Error('Clipboard denied'))
  render(<PerformanceWorksheet view="followup" />)
  edit(
    'Hypothesis and alternative',
    'Repeated queries explain the controlled run',
  )
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  const manual = screen.getByLabelText('Markdown record') as HTMLTextAreaElement
  expect(manual.readOnly).toBe(true)
  expect(manual.value).toBe(
    performanceMarkdown({
      ...EMPTY_PERFORMANCE_SHEET,
      hypothesis: 'Repeated queries explain the controlled run',
    }),
  )
  expect(
    screen.getByRole('status', { name: 'Copy status' }).textContent,
  ).toMatch(/Copy is unavailable/)
  expect(
    (screen.getByLabelText('Hypothesis and alternative') as HTMLTextAreaElement)
      .value,
  ).toContain('Repeated queries')
})

test('clearing requires confirmation and resets fields from both views rather than just the visible form', () => {
  window.localStorage.setItem(
    PERFORMANCE_KEY,
    JSON.stringify({
      ...EMPTY_PERFORMANCE_SHEET,
      outcome: 'Saved outcome',
      verdict: 'Saved verdict',
    }),
  )
  render(<PerformanceWorksheet view="baseline" />)
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
  expect(window.localStorage.getItem(PERFORMANCE_KEY)).not.toBeNull()
  confirm.mockReturnValue(true)
  fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
  expect(window.localStorage.getItem(PERFORMANCE_KEY)).toBeNull()
  expect(
    (screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement)
      .value,
  ).toBe('')
  expect(screen.getByText('0 of 11 fields recorded')).toBeTruthy()
})

test('a storage event refreshes the other view and the next edit preserves that unseen field', () => {
  render(<PerformanceWorksheet view="baseline" />)
  act(() => {
    window.localStorage.setItem(
      PERFORMANCE_KEY,
      JSON.stringify({
        ...EMPTY_PERFORMANCE_SHEET,
        outcome: 'Changed in another tab',
        verdict: 'Keep follow-up',
      }),
    )
    window.dispatchEvent(new StorageEvent('storage', { key: PERFORMANCE_KEY }))
  })
  expect(
    (screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement)
      .value,
  ).toBe('Changed in another tab')
  edit('Scope', 'Same scope')
  expect(
    JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!).verdict,
  ).toBe('Keep follow-up')
  expect(SHEET_FIELDS).toHaveLength(11)
})

import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { CopyMarkdown } from './CopyMarkdown'
let write = vi.fn<(text: string) => Promise<void>>()
beforeEach(() => {
  write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText: write } })
})
afterEach(() => vi.unstubAllGlobals())
test('copies exactly the current text and stops describing old content as copied after an edit', async () => {
  const view = render(<CopyMarkdown text="First" />)
  await act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })
  expect(write).toHaveBeenCalledWith('First')
  expect(screen.getByRole('status').textContent).toContain(
    'Copied this version',
  )
  view.rerender(<CopyMarkdown text="Second" />)
  expect(screen.getByRole('status').textContent).toBe('')
})
test('denied or missing clipboard access offers current literal Markdown for manual copying', async () => {
  for (const missing of [false, true]) {
    if (missing) vi.stubGlobal('navigator', {})
    else write.mockRejectedValue(new Error('denied'))
    const view = render(<CopyMarkdown text="<script>literal</script>" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
    const manual = screen.getByLabelText(
      'Markdown record',
    ) as HTMLTextAreaElement
    expect(manual.readOnly).toBe(true)
    expect(manual.value).toBe('<script>literal</script>')
    expect(view.container.querySelector('script')).toBeNull()
    view.rerender(<CopyMarkdown text="Edited draft" />)
    expect(
      (screen.getByLabelText('Markdown record') as HTMLTextAreaElement).value,
    ).toBe('Edited draft')
    view.unmount()
  }
})
test('an older rejected operation cannot replace a newer successful copy', async () => {
  let rejectOld!: (reason: unknown) => void
  write.mockImplementationOnce(
    () =>
      new Promise<void>((_, reject) => {
        rejectOld = reject
      }),
  )
  render(<CopyMarkdown text="Current" />)
  fireEvent.click(screen.getByRole('button'))
  await act(async () => {
    fireEvent.click(screen.getByRole('button'))
  })
  await act(async () => rejectOld(new Error('old denial')))
  expect(screen.getByRole('status').textContent).toContain(
    'Copied this version',
  )
  expect(screen.queryByRole('textbox')).toBeNull()
})
test('an empty record can disable export without creating a false status', () => {
  render(<CopyMarkdown text="Empty" disabled />)
  expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  expect(screen.getByRole('status').textContent).toBe('')
})

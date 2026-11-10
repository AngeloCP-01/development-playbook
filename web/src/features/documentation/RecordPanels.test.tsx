import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DocumentationSession } from './DocumentationSession'
import { ChecklistPanel, RecordPanel } from './RecordPanels'
import {
  CHECKS,
  EMPTY_RECORD,
  FIELDS,
  RECORD_KEY,
  recordMarkdown,
  TEAM_NOTES,
} from './record'
let write = vi.fn<(text: string) => Promise<void>>()
beforeEach(() => {
  window.localStorage.clear()
  write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText: write } })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
function Harness() {
  const [view, setView] = useState<'change' | 'evidence' | 'checks'>('change')
  return (
    <DocumentationSession>
      <button onClick={() => setView('change')}>Change view</button>
      <button onClick={() => setView('evidence')}>Evidence view</button>
      <button onClick={() => setView('checks')}>Checks view</button>
      {view === 'checks' ? (
        <ChecklistPanel />
      ) : (
        <RecordPanel key={view} view={view} />
      )}
    </DocumentationSession>
  )
}
const edit = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
test('all eight fields retain literal input across views and export only the personal record', async () => {
  const view = render(<Harness />)
  const expected = { ...EMPTY_RECORD }
  for (const section of ['change', 'evidence'] as const) {
    fireEvent.click(
      screen.getByText(section === 'change' ? 'Change view' : 'Evidence view'),
    )
    for (const field of FIELDS.filter((f) => f.view === section)) {
      expected[field.id] = `${field.id}: <b>literal</b>`
      edit(field.label, expected[field.id])
    }
  }
  for (const section of ['change', 'evidence'] as const) {
    fireEvent.click(
      screen.getByText(section === 'change' ? 'Change view' : 'Evidence view'),
    )
    for (const field of FIELDS.filter((f) => f.view === section)) {
      expect(
        (screen.getByLabelText(field.label) as HTMLTextAreaElement).value,
      ).toBe(expected[field.id])
    }
  }
  expect(screen.getByText('8 of 8 fields recorded')).toBeTruthy()
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  expect(write).toHaveBeenLastCalledWith(recordMarkdown(expected))
  fireEvent.click(screen.getByText('Checks view'))
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  expect(write).toHaveBeenLastCalledWith(recordMarkdown(expected))
  expect(view.container.querySelector('b')).toBeNull()
  expect(
    screen.getByText(/Recording fields and checks does not verify/),
  ).toBeTruthy()
})
test('ten checks stay in their cadence groups and a periodic-only record exports from the other view', async () => {
  render(<Harness />)
  fireEvent.click(screen.getByText('Checks view'))
  expect(screen.getAllByRole('checkbox')).toHaveLength(10)
  expect(
    screen
      .getByRole('group', { name: 'Per-change checks' })
      .querySelectorAll('input'),
  ).toHaveLength(7)
  expect(
    screen
      .getByRole('group', { name: 'Periodic checks' })
      .querySelectorAll('input'),
  ).toHaveLength(3)
  fireEvent.click(screen.getByRole('checkbox', { name: CHECKS[9].text }))
  fireEvent.click(screen.getByText('Evidence view'))
  expect(
    (
      screen.getByRole('button', {
        name: 'Copy as Markdown',
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(false)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  expect(write).toHaveBeenLastCalledWith(
    recordMarkdown({ ...EMPTY_RECORD, checked: ['history'] }),
  )
  fireEvent.click(screen.getByText('Checks view'))
  expect(
    (screen.getByRole('checkbox', { name: CHECKS[9].text }) as HTMLInputElement)
      .checked,
  ).toBe(true)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  expect(write).toHaveBeenLastCalledWith(
    recordMarkdown({ ...EMPTY_RECORD, checked: ['history'] }),
  )
  fireEvent.click(screen.getByRole('button', { name: 'If you are not solo' }))
  for (const note of TEAM_NOTES) expect(screen.getByText(note)).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Stage 16 incident response' })
      .getAttribute('href'),
  ).toBe('/stages/16-incident-management')
})
test.each(['Change view', 'Evidence view', 'Checks view'])(
  'clear from %s confirms the whole record and keeps a failed removal retry enabled across remounts',
  (clearView) => {
    render(<Harness />)
    edit('Change and scope', 'Keep until confirmed')
    fireEvent.click(screen.getByText('Evidence view'))
    edit('Owner and reviewer', 'Me')
    fireEvent.click(screen.getByText('Checks view'))
    fireEvent.click(screen.getByRole('checkbox', { name: CHECKS[9].text }))
    fireEvent.click(screen.getByText(clearView))
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
    expect(window.localStorage.getItem(RECORD_KEY)).toContain(
      'Keep until confirmed',
    )
    confirm.mockReturnValue(true)
    const deny = vi
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })
    fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
    expect(screen.getByText(/could return after reload/)).toBeTruthy()
    fireEvent.click(
      screen.getByText(
        clearView === 'Change view' ? 'Evidence view' : 'Change view',
      ),
    )
    expect(screen.getByText('0 of 8 fields recorded')).toBeTruthy()
    expect(
      (
        screen.getByRole('button', {
          name: 'Clear whole record',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false)
    deny.mockRestore()
    fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
    expect(window.localStorage.getItem(RECORD_KEY)).toBeNull()
    fireEvent.click(screen.getByText('Checks view'))
    expect(
      screen
        .getAllByRole('checkbox')
        .some((c) => (c as HTMLInputElement).checked),
    ).toBe(false)
    fireEvent.click(screen.getByText('Change view'))
    expect(
      (screen.getByLabelText('Change and scope') as HTMLTextAreaElement).value,
    ).toBe('')
    fireEvent.click(screen.getByText('Evidence view'))
    expect(
      (screen.getByLabelText('Owner and reviewer') as HTMLTextAreaElement)
        .value,
    ).toBe('')
  },
)
test('failed storage still allows copying a draft from the other view with clipboard fallback', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota')
  })
  write.mockRejectedValue(new Error('clipboard'))
  render(<Harness />)
  edit('Change and scope', 'Unsaved input')
  fireEvent.click(screen.getByText('Checks view'))
  fireEvent.click(screen.getByRole('checkbox', { name: CHECKS[9].text }))
  fireEvent.click(screen.getByText('Evidence view'))
  edit('Observed evidence and limits', 'Unsaved observation')
  fireEvent.click(screen.getByText('Change view'))
  expect(
    (screen.getByLabelText('Change and scope') as HTMLTextAreaElement).value,
  ).toBe('Unsaved input')
  fireEvent.click(screen.getByText('Evidence view'))
  expect(
    (
      screen.getByLabelText(
        'Observed evidence and limits',
      ) as HTMLTextAreaElement
    ).value,
  ).toBe('Unsaved observation')
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' }))
  })
  expect(
    (screen.getByLabelText('Markdown record') as HTMLTextAreaElement).value,
  ).toBe(
    recordMarkdown({
      ...EMPTY_RECORD,
      change: 'Unsaved input',
      evidence: 'Unsaved observation',
      checked: ['history'],
    }),
  )
  expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
})

test('an edit immediately after storage becomes unavailable retains loaded fields and checks without a notification', () => {
  window.localStorage.setItem(
    RECORD_KEY,
    JSON.stringify({
      ...EMPTY_RECORD,
      change: 'Loaded scope',
      owner: 'Loaded owner',
      checked: ['history'],
    }),
  )
  render(<Harness />)
  expect(
    (screen.getByLabelText('Change and scope') as HTMLTextAreaElement).value,
  ).toBe('Loaded scope')
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('permission revoked without notification')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('permission revoked without notification')
  })
  edit('Change and scope', 'Edited immediately')
  expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
  fireEvent.click(screen.getByText('Evidence view'))
  expect(
    (screen.getByLabelText('Owner and reviewer') as HTMLTextAreaElement).value,
  ).toBe('Loaded owner')
  fireEvent.click(screen.getByText('Checks view'))
  expect(
    (screen.getByRole('checkbox', { name: CHECKS[9].text }) as HTMLInputElement)
      .checked,
  ).toBe(true)
  fireEvent.click(screen.getByText('Change view'))
  expect(
    (screen.getByLabelText('Change and scope') as HTMLTextAreaElement).value,
  ).toBe('Edited immediately')
})

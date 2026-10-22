import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { useState } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import {
  DocumentationSession,
  EMPTY_PRACTICE,
  useDocumentationSession,
} from './DocumentationSession'
import { EMPTY_RECORD, RECORD_KEY } from './record'

beforeEach(() => window.localStorage.clear())
afterEach(() => vi.restoreAllMocks())
function Probe() {
  const s = useDocumentationSession()
  return (
    <div>
      <input
        aria-label="change"
        value={s.record.change}
        onChange={(e) => s.setField('change', e.target.value)}
      />
      <input
        aria-label="evidence"
        value={s.record.evidence}
        onChange={(e) => s.setField('evidence', e.target.value)}
      />
      <output aria-label="record">{JSON.stringify(s.record)}</output>
      <p role="status" aria-label="saving warning">
        {s.warning}
      </p>
      <button onClick={() => s.toggleCheck('history')}>Tick history</button>
      <button onClick={s.clear}>Clear</button>
      <button
        onClick={() =>
          s.setPractice('comments', (old) => ({
            ...old,
            choices: { ...old.choices, external: 'keep' },
          }))
        }
      >
        Answer
      </button>
      <output aria-label="practice">
        {JSON.stringify(s.practices.comments ?? EMPTY_PRACTICE)}
      </output>
    </div>
  )
}
function Harness() {
  const [panel, setPanel] = useState(0)
  return (
    <DocumentationSession>
      <button onClick={() => setPanel((v) => v + 1)}>Switch panel</button>
      <Probe key={panel} />
    </DocumentationSession>
  )
}
const edit = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

test('fields checks and practice survive child remounts while only the record survives a full reload', () => {
  let view = render(<Harness />)
  edit('change', 'Changed field')
  fireEvent.click(screen.getByText('Tick history'))
  fireEvent.click(screen.getByText('Answer'))
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Changed field',
  )
  expect(screen.getByLabelText('practice').textContent).toContain('keep')
  expect(screen.getByLabelText('record').textContent).toContain('history')
  view.unmount()
  view = render(<Harness />)
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Changed field',
  )
  expect(screen.getByLabelText('practice').textContent).not.toContain('keep')
  expect(
    Object.keys(JSON.parse(window.localStorage.getItem(RECORD_KEY)!)),
  ).not.toContain('practices')
  view.unmount()
})

test('malformed and partial storage normalize before the first edit without discarding valid other-view data', () => {
  for (const raw of [
    '{bad',
    'null',
    '[]',
    '{"evidence":"Keep this","change":3,"checked":["history","unknown"],"secret":"drop"}',
  ]) {
    window.localStorage.setItem(RECORD_KEY, raw)
    const view = render(<Harness />)
    edit('change', 'New change')
    const saved = JSON.parse(window.localStorage.getItem(RECORD_KEY)!)
    expect(saved.change).toBe('New change')
    expect(saved.secret).toBeUndefined()
    if (raw.includes('Keep this')) expect(saved.evidence).toBe('Keep this')
    view.unmount()
  }
})

test('failed reads announce the problem and keep subsequent edits across panel remounts', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied')
  })
  render(<Harness />)
  expect(
    screen.getByRole('status', { name: 'saving warning' }).textContent,
  ).toContain('Saving is unavailable')
  edit('change', 'Unsaved')
  fireEvent.click(screen.getByText('Switch panel'))
  edit('evidence', 'Observed locally')
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Unsaved',
  )
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Observed locally',
  )
})

test('later read denial retains visible fields and checks through remount and editing until the complete draft can be saved', () => {
  window.localStorage.setItem(
    RECORD_KEY,
    JSON.stringify({
      ...EMPTY_RECORD,
      change: 'Already visible',
      evidence: 'Keep this',
      checked: ['history'],
    }),
  )
  render(<Harness />)
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Already visible',
  )
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Keep this',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['history'])
  const denied = vi
    .spyOn(Storage.prototype, 'getItem')
    .mockImplementation(() => {
      throw new Error('denied after load')
    })
  act(() =>
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY })),
  )
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Already visible',
  )
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Keep this',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['history'])
  expect(
    screen.getByRole('status', { name: 'saving warning' }).textContent,
  ).toContain('Saving is unavailable')
  edit('evidence', 'Edited while denied')
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Already visible',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['history'])
  denied.mockRestore()
  act(() => {
    window.localStorage.setItem(
      RECORD_KEY,
      JSON.stringify({
        ...EMPTY_RECORD,
        change: 'Other tab',
        evidence: 'External observation',
        checked: ['privacy'],
      }),
    )
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY }))
  })
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Already visible',
  )
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Edited while denied',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['history'])
  edit('change', 'Retried complete draft')
  expect(JSON.parse(window.localStorage.getItem(RECORD_KEY)!)).toMatchObject({
    change: 'Retried complete draft',
    evidence: 'Edited while denied',
    checked: ['history'],
  })
  expect(
    screen.getByRole('status', { name: 'saving warning' }).textContent,
  ).toBe('')
  act(() => {
    window.localStorage.setItem(
      RECORD_KEY,
      JSON.stringify({
        ...EMPTY_RECORD,
        change: 'Fresh external update',
        evidence: 'Fresh evidence',
        checked: ['privacy'],
      }),
    )
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY }))
  })
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Fresh external update',
  )
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Fresh evidence',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['privacy'])
})

test('read recovery without local edits accepts external changes and retains that refreshed record if reads fail again', () => {
  window.localStorage.setItem(
    RECORD_KEY,
    JSON.stringify({
      ...EMPTY_RECORD,
      change: 'First load',
      evidence: 'Initial evidence',
      checked: ['history'],
    }),
  )
  render(<Harness />)
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'First load',
  )
  let denied = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied')
  })
  act(() =>
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY })),
  )
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'First load',
  )
  denied.mockRestore()
  act(() => {
    window.localStorage.setItem(
      RECORD_KEY,
      JSON.stringify({
        ...EMPTY_RECORD,
        change: 'Recovered external record',
        evidence: 'Recovered evidence',
        checked: ['privacy'],
      }),
    )
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY }))
  })
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Recovered external record',
  )
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Recovered evidence',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['privacy'])
  expect(
    screen.getByRole('status', { name: 'saving warning' }).textContent,
  ).toBe('')
  denied = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied again')
  })
  act(() =>
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY })),
  )
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Recovered external record',
  )
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Recovered evidence',
  )
  expect(
    JSON.parse(screen.getByLabelText('record').textContent!).checked,
  ).toEqual(['privacy'])
  denied.mockRestore()
})

test('a later failed write retains the whole draft ahead of external storage updates', () => {
  render(<Harness />)
  edit('change', 'Saved first')
  const denied = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new Error('quota')
    })
  edit('evidence', 'Unsaved observation')
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Unsaved observation',
  )
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Saved first',
  )
  denied.mockRestore()
  act(() => {
    window.localStorage.setItem(
      RECORD_KEY,
      JSON.stringify({ ...EMPTY_RECORD, change: 'Other tab' }),
    )
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY }))
  })
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe(
    'Saved first',
  )
  edit('change', 'Retry saved')
  expect(JSON.parse(window.localStorage.getItem(RECORD_KEY)!).evidence).toBe(
    'Unsaved observation',
  )
  expect(
    screen.getByRole('status', { name: 'saving warning' }).textContent,
  ).toBe('')
})

test('a successful same-tab write notifies another mounted subscriber of the same key', () => {
  render(
    <>
      <DocumentationSession>
        <Probe />
      </DocumentationSession>
      <DocumentationSession>
        <Probe />
      </DocumentationSession>
    </>,
  )
  const fields = screen.getAllByLabelText('change') as HTMLInputElement[]
  fireEvent.change(fields[0], { target: { value: 'Same-tab update' } })
  expect(fields.map((field) => field.value)).toEqual([
    'Same-tab update',
    'Same-tab update',
  ])
})

test('successful storage events refresh other-view data and the next edit preserves it', () => {
  render(<Harness />)
  act(() => {
    window.localStorage.setItem(
      RECORD_KEY,
      JSON.stringify({ ...EMPTY_RECORD, evidence: 'Other tab' }),
    )
    window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY }))
  })
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe(
    'Other tab',
  )
  edit('change', 'This tab')
  expect(JSON.parse(window.localStorage.getItem(RECORD_KEY)!).evidence).toBe(
    'Other tab',
  )
})

test('clear cancellation preserves everything and confirmed clear removes the complete saved record without resetting practice', () => {
  render(<Harness />)
  edit('change', 'One')
  edit('evidence', 'Two')
  fireEvent.click(screen.getByText('Tick history'))
  fireEvent.click(screen.getByText('Answer'))
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  fireEvent.click(screen.getByText('Clear'))
  expect(window.localStorage.getItem(RECORD_KEY)).not.toBeNull()
  confirm.mockReturnValue(true)
  fireEvent.click(screen.getByText('Clear'))
  expect(confirm).toHaveBeenLastCalledWith(
    'Clear the whole documentation record, including both views and all checklist selections?',
  )
  expect(window.localStorage.getItem(RECORD_KEY)).toBeNull()
  expect(JSON.parse(screen.getByLabelText('record').textContent!)).toEqual(
    EMPTY_RECORD,
  )
  expect(screen.getByLabelText('practice').textContent).toContain('keep')
})

test('a failed clear empties the mounted draft while warning that the saved copy can return', () => {
  render(<Harness />)
  edit('change', 'Saved')
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
    throw new Error('denied')
  })
  fireEvent.click(screen.getByText('Clear'))
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('')
  expect(window.localStorage.getItem(RECORD_KEY)).toContain('Saved')
  expect(
    screen.getByRole('status', { name: 'saving warning' }).textContent,
  ).toContain('could return after reload')
})

test('server-empty markup hydrates stored data without a recovery error', async () => {
  window.localStorage.setItem(
    RECORD_KEY,
    JSON.stringify({ ...EMPTY_RECORD, change: 'Stored' }),
  )
  const node = document.createElement('div')
  document.body.append(node)
  node.innerHTML = renderToString(
    <DocumentationSession>
      <Probe />
    </DocumentationSession>,
  )
  expect((node.querySelector('input') as HTMLInputElement).value).toBe('')
  const errors: unknown[] = []
  let root!: ReturnType<typeof hydrateRoot>
  await act(async () => {
    root = hydrateRoot(
      node,
      <DocumentationSession>
        <Probe />
      </DocumentationSession>,
      { onRecoverableError: (error) => errors.push(error) },
    )
  })
  expect((node.querySelector('input') as HTMLInputElement).value).toBe('Stored')
  expect(errors).toEqual([])
  await act(async () => root.unmount())
  node.remove()
})

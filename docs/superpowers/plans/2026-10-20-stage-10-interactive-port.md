# Stage 10 Interactive Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Stage 10 interactive port with usable documentation examples, a browser-local change record and evidence-based checks.

**Architecture:** A server-composed stage passes authored panels to the existing Stepper inside one mounted client session provider. Focused client leaves handle selection, practice, copy and forms; pure models own normalization, exact teaching data and Markdown serialization. Register readiness, content and step IDs atomically after the assembled stage is tested.

**Tech Stack:** Existing Next.js 16.2.10, React 19, TypeScript, Tailwind tokens, Vitest unit/jsdom projects and Playwright. No new dependency.

**Spec:** [Approved interactive-port design](../specs/2026-10-20-stage-10-interactive-port-design.md), approved by the user's “proceed” on 2026-10-20; approval commit `3165b62`.

## Global Constraints

- Work in `/Users/angelito/personal/Development-Playbook/.worktrees/stage10-chapter`, branch `feat/stage-10-documentation`. Chapter base `c092ac7`; develop base `79f9e31`. Preserve the completed chapter branch, parent changes and parent port-3200 server.
- The app remains Next.js 16, React 19 and TypeScript with existing dependencies.
- Use `web/DESIGN.md` tokens and type roles in both whiteprint and cyanotype themes. Brand indicates attention; semantic colors indicate a verdict. Text or icons must also carry that verdict.
- One judgment per panel and at most four screens at 1024×768. The twelve initial IDs below are the approved design; measured D-52 splits retain teaching and update declarations/tests/records together.
- Workshop remains the illustrative case. Toolshare stays held out of authored examples, fixtures and drills so the port can be assessed with the same scenario.
- Reuse `useLocalStorage` as the subscription mechanism; use a stable server-empty snapshot and normalize its unknown data. Do not introduce effect-body setState for hydration.
- Use one versioned key, `playbook:documentation-change:v1`; eight string fields and ten known checklist IDs. Exercises are session-only and do not alter the personal record.
- Every new copy action handles missing/denied clipboard access. Failed storage retains an editable stage-session draft with an honest warning; it must survive panel navigation.
- The canonical Markdown and hand-authored React content remain separate by the repository's established design. No runtime Markdown parser, image publication, W-6 sheet, backend or generator installation.
- All task tests and implementation sources appear inline because AGENTS.md requires full-source task slices. This intentionally exceeds the writing-plans skill's usual compact-plan preference. These are proposed sources, not executed code or TDD evidence.
- For each task: write the test, capture actual RED for the expected reason, implement, capture GREEN, run a targeted teeth mutation and restore, then independent read-only review. Keep raw logs/diffs in `docs/superpowers/reports/2026-10-20-stage-10-port-execution.md` or its linked evidence directory. Import errors prove the missing interface initially; behavior tests must fail meaningfully once a shell exists.
- Every task gets independent review even if the user chooses inline execution. Final whole-branch review covers `79f9e31..HEAD`, retaining chapter review evidence and checking the final fix wave itself.
- Every merge needs the user's separate approval; pushes and promotion to main remain the user's.

## Review Focus

- Storage can be readable at mount and fail during a later edit: Task 2 denies writes after a saved edit and preserves both fields across panel unmounts and external updates.
- A clipboard promise can settle after a newer copy or edit: Task 3 resolves requests out of order and prevents stale success from describing the current record.
- A replaced ADR can look currently accepted even while the status legend is correct: Task 4 asserts the dated notice inside ADR 004 and follows its actual counterpart control.
- A view can render a valid but wrong inspector row: Task 5 selects every authored row and injects changed data to prove the rendered facts follow it.
- A reader can tick only a periodic check or enter HTML-like text: Tasks 1 and 7 preserve checklist-only export, literal text and whole-record clear scope without claiming verification.

---

### File map and execution order

All feature paths below are under `web/src/features/documentation/` unless fully qualified.

| Task | Files / responsibility | Dependencies |
| --- | --- | --- |
| 1 | `record.ts`, `record.test.ts`: fields, checklist, normalization, Markdown | None |
| 2 | `DocumentationSession.tsx`, its test: mounted record and practice state | 1 |
| 3 | `CopyMarkdown.tsx`, `SelectionTabs.tsx`, tests: bounded client controls | None |
| 4 | `documents.ts`, `DocumentExample.tsx`, `DocumentPanels.tsx`, tests: README/ADRs | 3 |
| 5 | `lookups.ts`, `LookupInspector.tsx`, `LookupPanels.tsx`, tests: task/fact/change/history lookups | 3 |
| 6 | `practice.ts`, `DecisionDrill.tsx`, `PracticePanels.tsx`, tests: comments and AI | 2 |
| 7 | `RecordPanels.tsx`, tests: eight fields, ten checks, team notes | 1, 2, 3 |
| 8 | `Documentation.tsx`, `steps.ts`, `closing.tsx`, stage test; shared registries; placeholder audit | 1–7 |
| 9 | Browser matrices, coverage/execution reports, readers, whole-branch review, handoff | 8 |

Run one writer at a time by default. Tasks 3/4/5 have bounded independence from
record state, but review gates and shared interfaces matter more than parallel
editing. A subagent-driven execution uses a fresh implementer per task and fresh
reviewers. Inline execution keeps the same tests and per-task reviewers.

All commands run from `web/`. New `.test.ts` files run in the unit project;
`.test.tsx` files use the existing DOM setup, including cleanup/ResizeObserver/
scrollIntoView. Do not add a global testing mock or dependency. Read installed
Next guides `01-app/01-getting-started/05-server-and-client-components.md` and
`01-app/03-api-reference/01-directives/use-client.md` before writing components.
Planning read those guides and `02-guides/testing/vitest.md`; execution should
confirm the local versions still match. Server-built children may cross a client
provider boundary; callback functions do not cross that boundary as props.

### Task 1: Define the personal record and exact completion checks

**Files:** Create `record.ts`, `record.test.ts`.

**Interfaces:** Produces `RECORD_KEY`, `FIELDS`, `CHECKS`, `EMPTY_RECORD`,
`FieldId`, `CheckId`, `DocumentationRecord`, `normalizeRecord(value: unknown)`,
`recordMarkdown(record: DocumentationRecord)`, `hasRecord(record)` and
`TEAM_NOTES`. Later tasks consume these exports without inventing extra IDs.

- [ ] **Step 1: Write `record.test.ts` in full.**

```ts
import { expect, test } from 'vitest'
import { CHECKS, EMPTY_RECORD, FIELDS, hasRecord, normalizeRecord, RECORD_KEY, recordMarkdown, TEAM_NOTES } from './record'

test('the record names its eight decisions and separates seven change checks from three periodic checks', () => {
  expect(RECORD_KEY).toBe('playbook:documentation-change:v1')
  expect(FIELDS.map(f => f.id)).toEqual(['change', 'reader', 'documents', 'source', 'check', 'evidence', 'owner', 'trigger'])
  expect(CHECKS.map(c => c.id)).toEqual(['affected', 'decisions', 'current', 'configuration', 'privacy', 'validation', 'reviewed', 'fresh-clone', 'owners', 'history'])
  expect(CHECKS.filter(c => c.periodic).map(c => c.id)).toEqual(['fresh-clone', 'owners', 'history'])
  expect(TEAM_NOTES).toHaveLength(5)
  for (const phrase of ['without coaching', 'owner and a review trigger', 'exceptions and review expectations', 'did not attend', 'runbooks and handover']) expect(TEAM_NOTES.some(note => note.includes(phrase))).toBe(true)
})

test('unknown storage keeps only known string fields and unique known checks', () => {
  for (const value of [null, [], 4, 'text', undefined]) expect(normalizeRecord(value)).toEqual(EMPTY_RECORD)
  expect(normalizeRecord({ change: 'Keep', owner: 'Me', evidence: 4, checked: ['history', 'history', 'unknown', 3], secret: 'drop' })).toEqual({ ...EMPTY_RECORD, change: 'Keep', owner: 'Me', checked: ['history'] })
  expect(normalizeRecord({ checked: 'history' }).checked).toEqual([])
  expect(normalizeRecord({ change: null }).change).toBe('')
})

test('a periodic selection alone is an exportable record and unrecorded fields remain visible', () => {
  expect(hasRecord(EMPTY_RECORD)).toBe(false)
  expect(hasRecord({ ...EMPTY_RECORD, change: '  ' })).toBe(false)
  const value = { ...EMPTY_RECORD, checked: ['history' as const] }
  expect(hasRecord(value)).toBe(true)
  const md = recordMarkdown(value)
  expect(md).toContain('## Change and scope\n\nnot recorded')
  expect(md).toContain('- [x] Historical records are labeled and linked; obsolete current procedures are corrected, redirected or retired.')
  expect(md).toContain('- [ ] Affected documentation is identified')
  expect(md.indexOf('## Change and scope')).toBeLessThan(md.indexOf('## Review trigger and follow-up'))
  expect(md.indexOf('## Per-change checks')).toBeLessThan(md.indexOf('## Periodic checks'))
  expect(md).toContain('Reader-entered claims and selections; recording them does not verify documentation.')
})

test('export preserves the reader literal text and serializes checks in teaching order', () => {
  const value = { ...EMPTY_RECORD, change: '<img src=x onerror=alert(1)>', evidence: '[unknown](javascript:alert(1))', checked: ['history', 'affected'] as const }
  const md = recordMarkdown({ ...value, checked: [...value.checked] })
  expect(md).toContain(value.change)
  expect(md).toContain(value.evidence)
  expect(md.indexOf('- [x] Affected documentation')).toBeLessThan(md.indexOf('- [x] Historical records'))
  expect(normalizeRecord(EMPTY_RECORD)).not.toBe(EMPTY_RECORD)
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/record.test.ts`; record RED.** Initially the module is absent. After creating only exports/signatures if needed, confirm the normalization/export assertions fail for their actual missing behavior.
- [ ] **Step 3: Add the complete `record.ts` source.**

```ts
export const RECORD_KEY = 'playbook:documentation-change:v1'
export const FIELDS = [
  { id: 'change', label: 'Change and scope', hint: 'What changes, in which application and revision?', view: 'change' },
  { id: 'reader', label: 'Reader and task', hint: 'Who needs this, and what must they be able to do or look up?', view: 'change' },
  { id: 'documents', label: 'Affected documents and action', hint: 'Name paths and whether to create, update, link, redirect or retire them.', view: 'change' },
  { id: 'source', label: 'Authoritative source and revision', hint: 'Identify the implementation, contract, verified procedure or decision in scope.', view: 'change' },
  { id: 'check', label: 'Check and expected result', hint: 'Name the check or command, its safe environment and the result you expect.', view: 'evidence' },
  { id: 'evidence', label: 'Observed evidence and limits', hint: 'Record what actually ran or was reviewed, revision, environment and observed result. Leave missing evidence explicit.', view: 'evidence' },
  { id: 'owner', label: 'Owner and reviewer', hint: 'Who changes and reviews this? When working alone, name yourself.', view: 'evidence' },
  { id: 'trigger', label: 'Review trigger and follow-up', hint: 'Which change or periodic check brings the document back for review?', view: 'evidence' },
] as const
export type FieldId = (typeof FIELDS)[number]['id']
export const CHECKS = [
  { id: 'affected', text: 'Affected documentation is identified from the authoritative facts, including changed options and response contracts.', periodic: false },
  { id: 'decisions', text: 'Significant decisions have a record; historical decisions retain their reasoning and link to replacements.', periodic: false },
  { id: 'current', text: 'Current instructions, references and generated outputs match the intended revision and reviewed behavior.', periodic: false },
  { id: 'configuration', text: 'Required configuration is documented; any claimed enforcement is verified against actual validation.', periodic: false },
  { id: 'privacy', text: 'Examples use safe synthetic data and contain no real credentials or private customer details.', periodic: false },
  { id: 'validation', text: 'Claimed validation names its command/check, revision, environment and observed result.', periodic: false },
  { id: 'reviewed', text: 'The change owner reviewed the material; commit context explains a reason when one needs preserving.', periodic: false },
  { id: 'fresh-clone', text: 'A fresh maintainer reaches the expected result from a fresh clone using the README.', periodic: true },
  { id: 'owners', text: 'Each current document has an owner and a review trigger.', periodic: true },
  { id: 'history', text: 'Historical records are labeled and linked; obsolete current procedures are corrected, redirected or retired.', periodic: true },
] as const
export type CheckId = (typeof CHECKS)[number]['id']
export type DocumentationRecord = Record<FieldId, string> & { checked: CheckId[] }
export const EMPTY_RECORD: DocumentationRecord = { change: '', reader: '', documents: '', source: '', check: '', evidence: '', owner: '', trigger: '', checked: [] }
export const TEAM_NOTES = [
  'Let a new maintainer try setup without coaching; their first unresolved step becomes the fix list.',
  'Give each area an owner and a review trigger; review docs in the change that affects them.',
  'Add contributor conventions when contributors need them, including exceptions and review expectations.',
  'Keep decisions accessible to people who did not attend the discussion.',
  'Link operational runbooks and handover routes; Stage 16 owns incident response.',
] as const

export function normalizeRecord(value: unknown): DocumentationRecord {
  const result: DocumentationRecord = { ...EMPTY_RECORD, checked: [] }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result
  const input = value as Record<string, unknown>
  for (const { id } of FIELDS) if (typeof input[id] === 'string') result[id] = input[id]
  if (Array.isArray(input.checked)) {
    result.checked = CHECKS.filter(c => input.checked instanceof Array && input.checked.includes(c.id)).map(c => c.id)
  }
  return result
}
export function hasRecord(record: DocumentationRecord): boolean {
  return FIELDS.some(f => record[f.id].trim().length > 0) || record.checked.length > 0
}
export function recordMarkdown(record: DocumentationRecord): string {
  return [
    '# Documentation change plan', '',
    'Reader-entered claims and selections; recording them does not verify documentation.', '',
    ...FIELDS.map(f => `## ${f.label}\n\n${record[f.id].trim() || 'not recorded'}\n`),
    ...[false, true].flatMap(periodic => [
      `## ${periodic ? 'Periodic' : 'Per-change'} checks`, '',
      ...CHECKS.filter(c => c.periodic === periodic).map(c => `- [${record.checked.includes(c.id) ? 'x' : ' '}] ${c.text}`), '',
    ]),
  ].join('\n')
}
```

- [ ] **Step 4: Run the focused test GREEN, lint and typecheck.** Preserve the output. Do not update snapshots to disguise a mismatch.
- [ ] **Step 5: Teeth check.** Temporarily make `hasRecord` ignore `checked`; run the whole `record.test.ts` file and confirm only the periodic-selection test fails for `true` versus `false`. Restore and rerun GREEN.
- [ ] **Step 6: Independent review, then commit** `feat(documentation): model a documentation change record`. Record verdict/findings and Deferred: forms, persistence and registration.

### Task 2: Preserve record and practice state across panel changes

**Files:** Create `DocumentationSession.tsx`, `DocumentationSession.test.tsx`.

**Interfaces:** Consumes Task 1. Produces `DocumentationSession({ children })`,
`useDocumentationSession()`, `PracticeRun`, `EMPTY_PRACTICE` and context methods
`setField(id, text)`, `toggleCheck(id)`, `clear()`, `setPractice(id, update)`;
context exposes `record`, `warning`, `clearFailed`, `practices`. A provider wraps
the Stepper once; never mount a provider inside each panel. Tests may mount a
second independent subscriber solely to prove the shared hook notification contract.

- [ ] **Step 1: Write `DocumentationSession.test.tsx`.**

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { useState } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DocumentationSession, EMPTY_PRACTICE, useDocumentationSession } from './DocumentationSession'
import { EMPTY_RECORD, RECORD_KEY } from './record'

beforeEach(() => window.localStorage.clear())
afterEach(() => vi.restoreAllMocks())
function Probe() {
  const s = useDocumentationSession()
  return <div>
    <input aria-label="change" value={s.record.change} onChange={e => s.setField('change', e.target.value)} />
    <input aria-label="evidence" value={s.record.evidence} onChange={e => s.setField('evidence', e.target.value)} />
    <output aria-label="record">{JSON.stringify(s.record)}</output><p role="status">{s.warning}</p>
    <button onClick={() => s.toggleCheck('history')}>Tick history</button>
    <button onClick={s.clear}>Clear</button>
    <button onClick={() => s.setPractice('comments', old => ({ ...old, choices: { ...old.choices, external: 'keep' } }))}>Answer</button>
    <output aria-label="practice">{JSON.stringify(s.practices.comments ?? EMPTY_PRACTICE)}</output>
  </div>
}
function Harness() {
  const [panel, setPanel] = useState(0)
  return <DocumentationSession><button onClick={() => setPanel(v => v + 1)}>Switch panel</button><Probe key={panel} /></DocumentationSession>
}
const edit = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

test('fields checks and practice survive child remounts while only the record survives a full reload', () => {
  let view = render(<Harness />)
  edit('change', 'Changed field')
  fireEvent.click(screen.getByText('Tick history'))
  fireEvent.click(screen.getByText('Answer'))
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('Changed field')
  expect(screen.getByLabelText('practice').textContent).toContain('keep')
  expect(screen.getByLabelText('record').textContent).toContain('history')
  view.unmount(); view = render(<Harness />)
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('Changed field')
  expect(screen.getByLabelText('practice').textContent).not.toContain('keep')
  expect(Object.keys(JSON.parse(window.localStorage.getItem(RECORD_KEY)!))).not.toContain('practices')
  view.unmount()
})

test('malformed and partial storage normalize before the first edit without discarding valid other-view data', () => {
  for (const raw of ['{bad', 'null', '[]', '{"evidence":"Keep this","change":3,"checked":["history","unknown"],"secret":"drop"}']) {
    window.localStorage.setItem(RECORD_KEY, raw)
    const view = render(<Harness />)
    edit('change', 'New change')
    const saved = JSON.parse(window.localStorage.getItem(RECORD_KEY)!)
    expect(saved.change).toBe('New change'); expect(saved.secret).toBeUndefined()
    if (raw.includes('Keep this')) expect(saved.evidence).toBe('Keep this')
    view.unmount()
  }
})

test('failed reads announce the problem and keep subsequent edits across panel remounts', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied') })
  render(<Harness />)
  expect(screen.getByRole('status').textContent).toContain('Saving is unavailable')
  edit('change', 'Unsaved'); fireEvent.click(screen.getByText('Switch panel')); edit('evidence', 'Observed locally')
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('Unsaved')
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe('Observed locally')
})

test('a later failed write retains the whole draft ahead of external storage updates', () => {
  render(<Harness />); edit('change', 'Saved first')
  const denied = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
  edit('evidence', 'Unsaved observation')
  fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe('Unsaved observation')
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('Saved first')
  denied.mockRestore()
  act(() => { window.localStorage.setItem(RECORD_KEY, JSON.stringify({ ...EMPTY_RECORD, change: 'Other tab' })); window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY })) })
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('Saved first')
  edit('change', 'Retry saved')
  expect(JSON.parse(window.localStorage.getItem(RECORD_KEY)!).evidence).toBe('Unsaved observation')
  expect(screen.getByRole('status').textContent).toBe('')
})

test('a successful same-tab write notifies another mounted subscriber of the same key', () => {
  render(<><DocumentationSession><Probe /></DocumentationSession><DocumentationSession><Probe /></DocumentationSession></>)
  const fields = screen.getAllByLabelText('change') as HTMLInputElement[]
  fireEvent.change(fields[0], { target: { value: 'Same-tab update' } })
  expect(fields.map(field => field.value)).toEqual(['Same-tab update', 'Same-tab update'])
})

test('successful storage events refresh other-view data and the next edit preserves it', () => {
  render(<Harness />)
  act(() => { window.localStorage.setItem(RECORD_KEY, JSON.stringify({ ...EMPTY_RECORD, evidence: 'Other tab' })); window.dispatchEvent(new StorageEvent('storage', { key: RECORD_KEY })) })
  expect((screen.getByLabelText('evidence') as HTMLInputElement).value).toBe('Other tab')
  edit('change', 'This tab')
  expect(JSON.parse(window.localStorage.getItem(RECORD_KEY)!).evidence).toBe('Other tab')
})

test('clear cancellation preserves everything and confirmed clear removes the complete saved record without resetting practice', () => {
  render(<Harness />); edit('change', 'One'); edit('evidence', 'Two')
  fireEvent.click(screen.getByText('Tick history')); fireEvent.click(screen.getByText('Answer'))
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  fireEvent.click(screen.getByText('Clear')); expect(window.localStorage.getItem(RECORD_KEY)).not.toBeNull()
  confirm.mockReturnValue(true); fireEvent.click(screen.getByText('Clear'))
  expect(confirm).toHaveBeenLastCalledWith('Clear the whole documentation record, including both views and all checklist selections?')
  expect(window.localStorage.getItem(RECORD_KEY)).toBeNull()
  expect(JSON.parse(screen.getByLabelText('record').textContent!)).toEqual(EMPTY_RECORD)
  expect(screen.getByLabelText('practice').textContent).toContain('keep')
})

test('a failed clear empties the mounted draft while warning that the saved copy can return', () => {
  render(<Harness />); edit('change', 'Saved')
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('denied') })
  fireEvent.click(screen.getByText('Clear')); fireEvent.click(screen.getByText('Switch panel'))
  expect((screen.getByLabelText('change') as HTMLInputElement).value).toBe('')
  expect(window.localStorage.getItem(RECORD_KEY)).toContain('Saved')
  expect(screen.getByRole('status').textContent).toContain('could return after reload')
})

test('server-empty markup hydrates stored data without a recovery error', async () => {
  window.localStorage.setItem(RECORD_KEY, JSON.stringify({ ...EMPTY_RECORD, change: 'Stored' }))
  const node = document.createElement('div'); document.body.append(node)
  node.innerHTML = renderToString(<DocumentationSession><Probe /></DocumentationSession>)
  expect((node.querySelector('input') as HTMLInputElement).value).toBe('')
  const errors: unknown[] = []
  let root!: ReturnType<typeof hydrateRoot>
  await act(async () => { root = hydrateRoot(node, <DocumentationSession><Probe /></DocumentationSession>, { onRecoverableError: error => errors.push(error) }) })
  expect((node.querySelector('input') as HTMLInputElement).value).toBe('Stored')
  expect(errors).toEqual([])
  await act(async () => root.unmount()); node.remove()
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/DocumentationSession.test.tsx`; capture RED.** Missing module first; then ensure the mounted-draft test fails if the provider merely exposes the shared hook.
- [ ] **Step 3: Add `DocumentationSession.tsx`.**

```tsx
'use client'
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { EMPTY_RECORD, normalizeRecord, RECORD_KEY, type CheckId, type DocumentationRecord, type FieldId } from './record'

export type PracticeRun = { index: number; drafts: Record<string, string>; choices: Record<string, string> }
export const EMPTY_PRACTICE: PracticeRun = { index: 0, drafts: {}, choices: {} }
type Session = {
  record: DocumentationRecord; warning: string; clearFailed: boolean
  setField: (id: FieldId, text: string) => void; toggleCheck: (id: CheckId) => void; clear: () => void
  practices: Record<string, PracticeRun>; setPractice: (id: string, update: (old: PracticeRun) => PracticeRun) => void
}
const Context = createContext<Session | null>(null)
const PROBE_EVENT = 'documentation:storage-check'
function subscribeProbe(listener: () => void) {
  window.addEventListener('storage', listener); window.addEventListener(PROBE_EVENT, listener)
  return () => { window.removeEventListener('storage', listener); window.removeEventListener(PROBE_EVENT, listener) }
}
function readable() { try { window.localStorage.getItem(RECORD_KEY); return true } catch { return false } }
const serverReadable = () => true

export function DocumentationSession({ children }: { children: ReactNode }) {
  const { value, setValue, reset } = useLocalStorage<unknown>(RECORD_KEY, EMPTY_RECORD)
  const canRead = useSyncExternalStore(subscribeProbe, readable, serverReadable)
  const [draft, setDraft] = useState<DocumentationRecord | null>(null)
  const [failure, setFailure] = useState<'save' | 'clear' | null>(null)
  const [practices, setPractices] = useState<Record<string, PracticeRun>>({})
  const record = draft ?? normalizeRecord(value)
  const warning = failure === 'clear'
    ? 'The visible record is cleared, but the saved copy could return after reload. Clearing storage is unavailable; retry or remove it in browser settings.'
    : failure === 'save' || !canRead
      ? 'Saving is unavailable. This draft stays editable across these panels; export it before leaving or reloading.' : ''
  function update(change: (old: DocumentationRecord) => DocumentationRecord) {
    let next = change(record)
    setValue((previous: unknown) => { next = change(draft ?? normalizeRecord(previous)); return next })
    let saved = false
    try { saved = window.localStorage.getItem(RECORD_KEY) === JSON.stringify(next) } catch { /* keep stage-session draft */ }
    setDraft(saved ? null : next); setFailure(saved ? null : 'save')
    window.dispatchEvent(new Event(PROBE_EVENT))
  }
  function clear() {
    if (!window.confirm('Clear the whole documentation record, including both views and all checklist selections?')) return
    reset()
    let cleared = false
    try { cleared = window.localStorage.getItem(RECORD_KEY) === null } catch { /* report uncertain removal */ }
    setDraft(cleared ? null : normalizeRecord(null)); setFailure(cleared ? null : 'clear')
    window.dispatchEvent(new Event(PROBE_EVENT))
  }
  return <Context.Provider value={{
    record, warning, clearFailed: failure === 'clear', clear,
    setField: (id, text) => update(old => ({ ...old, [id]: text })),
    toggleCheck: id => update(old => ({ ...old, checked: old.checked.includes(id) ? old.checked.filter(c => c !== id) : [...old.checked, id] })),
    practices,
    setPractice: (id, change) => setPractices(old => ({ ...old, [id]: change(old[id] ?? EMPTY_PRACTICE) })),
  }}>{children}</Context.Provider>
}
export function useDocumentationSession(): Session {
  const context = useContext(Context)
  if (!context) throw new Error('Documentation controls require DocumentationSession')
  return context
}
```

- [ ] **Step 4: Run focused GREEN, lint and typecheck.** Investigate actual lint/compiler diagnostics; do not weaken the hydration or draft assertions. Record any source correction to this plan as PLAN-AUTHORED when appropriate.
- [ ] **Step 5: Teeth check.** Replace `setDraft(saved ? null : next)` with `setDraft(saved || canRead ? null : next)`; the later-failed-write test must fail because the observation disappears. Restore, rerun the full Task 1/2 suite and record exact impact; no other behavior change is retained.
- [ ] **Step 6: Independent review and commit** `feat(documentation): retain change drafts across panels`. Deferred: actual forms and exercise UI.

### Task 3: Provide accessible selection and reliable copying

**Files:** Create `CopyMarkdown.tsx`, `CopyMarkdown.test.tsx`, `SelectionTabs.tsx`, `SelectionTabs.test.tsx`.

**Interfaces:** `CopyMarkdown({ text, label?, manualLabel?, disabled? })` is
stage-local. `SelectionTabs({ label, items })` accepts readonly
`{ id: string; label: string; content: ReactNode }[]`; a unique nonempty item
set is authored by its callers. No callback prop crosses a server boundary.

- [ ] **Step 1: Write both test files.** `CopyMarkdown.test.tsx`:

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { CopyMarkdown } from './CopyMarkdown'
let write = vi.fn<(text: string) => Promise<void>>()
beforeEach(() => { write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined); vi.stubGlobal('navigator', { clipboard: { writeText: write } }) })
afterEach(() => vi.unstubAllGlobals())
test('copies exactly the current text and stops describing old content as copied after an edit', async () => {
  const view = render(<CopyMarkdown text="First" />)
  await act(async () => { fireEvent.click(screen.getByRole('button')) })
  expect(write).toHaveBeenCalledWith('First'); expect(screen.getByRole('status').textContent).toContain('Copied this version')
  view.rerender(<CopyMarkdown text="Second" />)
  expect(screen.getByRole('status').textContent).toBe('')
})
test('denied or missing clipboard access offers current literal Markdown for manual copying', async () => {
  for (const missing of [false, true]) {
    if (missing) vi.stubGlobal('navigator', {})
    else write.mockRejectedValue(new Error('denied'))
    const view = render(<CopyMarkdown text="<script>literal</script>" />)
    await act(async () => { fireEvent.click(screen.getByRole('button')) })
    const manual = screen.getByLabelText('Markdown record') as HTMLTextAreaElement
    expect(manual.readOnly).toBe(true); expect(manual.value).toBe('<script>literal</script>')
    expect(view.container.querySelector('script')).toBeNull()
    view.rerender(<CopyMarkdown text="Edited draft" />)
    expect((screen.getByLabelText('Markdown record') as HTMLTextAreaElement).value).toBe('Edited draft')
    view.unmount()
  }
})
test('an older rejected operation cannot replace a newer successful copy', async () => {
  let rejectOld!: (reason: unknown) => void
  write.mockImplementationOnce(() => new Promise<void>((_, reject) => { rejectOld = reject }))
  render(<CopyMarkdown text="Current" />)
  fireEvent.click(screen.getByRole('button'))
  await act(async () => { fireEvent.click(screen.getByRole('button')) })
  await act(async () => rejectOld(new Error('old denial')))
  expect(screen.getByRole('status').textContent).toContain('Copied this version')
  expect(screen.queryByRole('textbox')).toBeNull()
})
test('an empty record can disable export without creating a false status', () => {
  render(<CopyMarkdown text="Empty" disabled />)
  expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  expect(screen.getByRole('status').textContent).toBe('')
})
```

`SelectionTabs.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SelectionTabs } from './SelectionTabs'
test('each choice exposes its own named panel and keyboard navigation moves both focus and content', () => {
  render(<SelectionTabs label="Document choices" items={[
    { id: 'old', label: 'Old', content: <p>Old content</p> },
    { id: 'new', label: 'New', content: <p>New content</p> },
  ]} />)
  const old = screen.getByRole('tab', { name: 'Old' }); const next = screen.getByRole('tab', { name: 'New' })
  expect(old.getAttribute('aria-controls')).not.toBe(next.getAttribute('aria-controls'))
  fireEvent.keyDown(old, { key: 'ArrowRight' })
  expect(document.activeElement).toBe(next); expect(screen.getByRole('tabpanel', { name: 'New' }).textContent).toBe('New content')
  fireEvent.keyDown(next, { key: 'Home' }); expect(document.activeElement).toBe(old)
  expect(screen.queryByText('New content')).toBeNull()
  fireEvent.keyDown(old, { key: 'End' }); expect(document.activeElement).toBe(next)
  expect(next.getAttribute('aria-selected')).toBe('true')
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/CopyMarkdown.test.tsx src/features/documentation/SelectionTabs.test.tsx`; capture RED.**
- [ ] **Step 3: Add the complete implementations.** `CopyMarkdown.tsx`:

```tsx
'use client'
import { useId, useRef, useState } from 'react'
export function CopyMarkdown({ text, label = 'Copy as Markdown', manualLabel = 'Markdown record', disabled = false }: { text: string; label?: string; manualLabel?: string; disabled?: boolean }) {
  const id = useId(); const attempt = useRef(0)
  const [result, setResult] = useState<{ text: string; manual: boolean } | null>(null)
  async function copy() {
    const sequence = ++attempt.current
    try {
      await navigator.clipboard.writeText(text)
      if (sequence === attempt.current) setResult({ text, manual: false })
    } catch {
      if (sequence === attempt.current) setResult({ text, manual: true })
    }
  }
  const message = result?.manual ? 'Copy is unavailable. Select the current Markdown below and copy it manually.' : result?.text === text ? 'Copied this version to clipboard.' : ''
  return <div className="mt-4 min-w-0">
    <button type="button" disabled={disabled} onClick={() => void copy()} className="min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle">{label}</button>
    <p role="status" aria-label={`Copy status: ${label}`} className="mt-2 text-sm text-muted">{message}</p>
    {result?.manual && <div className="mt-3"><label htmlFor={id} className="mb-2 block text-sm font-medium">{manualLabel}</label><textarea id={id} readOnly value={text} rows={6} className="w-full border border-line bg-sunken px-3 py-2 text-sm leading-relaxed text-fg focus-visible:outline-2 focus-visible:outline-brand" /></div>}
  </div>
}
```

`SelectionTabs.tsx`:

```tsx
'use client'
import { useId, useState, type ReactNode, type KeyboardEvent } from 'react'
export type SelectionItem = { id: string; label: string; content: ReactNode }
export function SelectionTabs({ label, items }: { label: string; items: readonly SelectionItem[] }) {
  const root = useId(); const [selected, setSelected] = useState(0)
  const index = selected < items.length ? selected : 0
  if (items.length === 0) return <p>No examples are available.</p>
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const next = event.key === 'ArrowRight' ? (index + 1) % items.length : event.key === 'ArrowLeft' ? (index + items.length - 1) % items.length : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null
    if (next === null) return
    event.preventDefault(); setSelected(next)
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus()
  }
  return <div className="min-w-0">
    <div role="tablist" aria-label={label} onKeyDown={keys} className="mb-4 flex flex-wrap gap-2">
      {items.map((item, i) => <button key={item.id} data-selection-id={item.id} type="button" role="tab" id={`${root}-tab-${item.id}`} aria-controls={`${root}-panel-${item.id}`} aria-selected={i === index} tabIndex={i === index ? 0 : -1} onClick={() => setSelected(i)} className={`min-h-11 min-w-0 break-words border border-line px-3 py-2 text-left text-sm ${i === index ? 'border-brand bg-brand-tint text-fg' : 'bg-raised text-muted'}`}>{item.label}</button>)}
    </div>
    <div role="tabpanel" id={`${root}-panel-${items[index].id}`} aria-labelledby={`${root}-tab-${items[index].id}`} tabIndex={0} className="min-w-0 focus-visible:outline-2 focus-visible:outline-brand">{items[index].content}</div>
  </div>
}
```

- [ ] **Step 4: Focused GREEN, lint and typecheck.** No shared copy helper or other feature is modified.
- [ ] **Step 5: Teeth check.** Remove only the sequence check in the copy rejection branch; the out-of-order test alone must fail. Restore and rerun both files. Separately force `SelectionTabs` to draw `items[0].content`; the keyboard/content test must fail, then restore.
- [ ] **Step 6: Independent review and commit** `feat(documentation): add selection and copy controls`. Deferred: document examples and personal forms.

### Task 4: Teach usable READMEs and visible decision replacement

**Files:** Create `documents.ts`, `DocumentExample.tsx`, `DocumentPanels.tsx`, `DocumentPanels.test.tsx`.

**Interfaces:** Consumes Task 3. Produces `DocumentExample({ example })`,
`ReadmePanel()`, `DecisionsPanel()`, `README`, `ADRS`, `DocExample` and
`documentMarkdown(example)`. `ADRS` has `old`, `replacement`, `template` entries.
Counterpart controls in the client DecisionsPanel select the other complete
specimen; displayed filenames never navigate to fictional repository routes.

- [ ] **Step 1: Write the complete render tests.**

```tsx
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { DecisionsPanel, ReadmePanel } from './DocumentPanels'
import { ADRS, documentMarkdown, README } from './documents'
afterEach(() => vi.unstubAllGlobals())
test('the README keeps unknown setup facts visible and copies the same outline a maintainer reads', async () => {
  const write = vi.fn().mockResolvedValue(undefined); vi.stubGlobal('navigator', { clipboard: { writeText: write } })
  render(<ReadmePanel />)
  expect(screen.getByText(/Supported prerequisites and tool versions/).textContent).toContain('[actual prerequisites]')
  expect(screen.getByText(/Clone, install and startup commands/).textContent).toContain('[commands tested for this revision]')
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy README outline' })) })
  expect(write).toHaveBeenCalledWith(documentMarkdown(README))
  fireEvent.click(screen.getByRole('button', { name: 'Fresh-clone check' }))
  expect(screen.getByText(/without private instructions/)).toBeTruthy()
  expect(screen.getByText(/revision, prerequisites, configuration source, commands and expected result/)).toBeTruthy()
})
test('the old ADR itself declares its dated current status and preserves the accepted history', async () => {
  const write = vi.fn().mockResolvedValue(undefined); vi.stubGlobal('navigator', { clipboard: { writeText: write } })
  render(<DecisionsPanel />)
  const old = screen.getByRole('region', { name: ADRS.old.filename })
  expect(within(old).getByText('Status: Accepted')).toBeTruthy()
  expect(within(old).getByText('2026-10-20 — Current status: Superseded.')).toBeTruthy()
  expect(within(old).getByText('The original context, date and reasoning above are preserved.')).toBeTruthy()
  fireEvent.click(within(old).getByRole('button', { name: 'Read ADR 005' }))
  const current = screen.getByRole('region', { name: ADRS.replacement.filename })
  expect(within(current).getByText('Status: Accepted')).toBeTruthy()
  expect(within(current).getByText('Date: 2026-10-20')).toBeTruthy()
  expect(screen.getByRole('tab', { name: 'ADR 005' }).getAttribute('aria-selected')).toBe('true')
  expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'ADR 005' }))
  await act(async () => { fireEvent.click(within(current).getByRole('button', { name: 'Copy ADR 005' })) })
  expect(write).toHaveBeenCalledWith(documentMarkdown(ADRS.replacement))
  fireEvent.click(within(current).getByRole('button', { name: 'Read ADR 004' }))
  expect(screen.getByRole('region', { name: ADRS.old.filename })).toBeTruthy()
  expect(documentMarkdown(ADRS.old)).toContain('[ADR 005](005-generated-contract-reference.md)')
  expect(documentMarkdown(ADRS.replacement)).toContain('[ADR 004](004-manual-field-reference.md)')
})
test('the blank ADR is explicitly a template with project facts to supply rather than a copied Workshop decision', () => {
  render(<DecisionsPanel />)
  fireEvent.click(screen.getByRole('tab', { name: 'Blank template' }))
  const template = screen.getByRole('region', { name: ADRS.template.filename })
  for (const heading of ['Context', 'Decision', 'Reasoning', 'Consequences', 'Alternatives']) expect(within(template).getByRole('heading', { name: heading })).toBeTruthy()
  expect(template.textContent).toContain('[actual date]')
  expect(template.textContent).not.toContain('Status: Accepted')
  expect(template.textContent).not.toContain('Workshop')
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/DocumentPanels.test.tsx`; capture RED.**
- [ ] **Step 3: Add full data and components.** `documents.ts`:

```ts
export type DocExample = {
  id: string; filename: string; title: string; meta: readonly string[]
  blocks: readonly { heading: string; paragraphs: readonly string[] }[]
  related?: { prefix: string; label: string; filename: string; target: 'old' | 'replacement' }
}
export const README: DocExample = {
  id: 'readme', filename: 'README.md outline', title: 'Project name',
  meta: ['What this does, who uses it, and the smallest useful outcome.'],
  blocks: [
    { heading: 'Running locally', paragraphs: [
      'Supported prerequisites and tool versions: [actual prerequisites].',
      'Access and safe configuration source: [how a maintainer obtains them].',
      'Clone, install and startup commands: [commands tested for this revision].',
      'Expected result and first useful check: [observable result].',
    ] },
    { heading: 'Architecture', paragraphs: ['Scope, main boundaries and external dependencies: [current view].', 'Decision records: [link to the decision log or relevant ADRs].'] },
    { heading: 'Deploying', paragraphs: ['Release and rollback procedures: [links, permissions and compatibility limits].', 'Logs and health checks: [where to look].', 'Help or responsible maintainer: [contact role or support route].'] },
  ],
}
export const ADRS: Record<'old' | 'replacement' | 'template', DocExample> = {
  old: {
    id: '004', filename: 'docs/adr/004-manual-field-reference.md', title: 'ADR 004: maintain the initial field reference by hand',
    meta: ['Date: 2026-09-01', 'Status: Accepted'],
    related: { prefix: 'Replacement', label: 'ADR 005', filename: '005-generated-contract-reference.md', target: 'replacement' },
    blocks: [
      { heading: 'Context', paragraphs: ['The initial contract is small. The team has no reference generator.'] },
      { heading: 'Decision', paragraphs: ['Maintain the initial field reference beside the contract.'] },
      { heading: 'Consequences', paragraphs: ['Every contract change requires a separate reference edit and review.'] },
      { heading: 'Supersession notice (appended)', paragraphs: ['2026-10-20 — Current status: Superseded.', 'The original context, date and reasoning above are preserved.'] },
    ],
  },
  replacement: {
    id: '005', filename: 'docs/adr/005-generated-contract-reference.md', title: 'ADR 005: generate the factual contract reference',
    meta: ['Date: 2026-10-20', 'Status: Accepted'],
    related: { prefix: 'Supersedes', label: 'ADR 004', filename: '004-manual-field-reference.md', target: 'old' },
    blocks: [
      { heading: 'Context', paragraphs: ['New settings and response fields make two edited field lists easy to disagree.'] },
      { heading: 'Decision', paragraphs: ['Generate the factual reference from the versioned contract.'] },
      { heading: 'Reasoning', paragraphs: ['Keep names, types and defaults tied to one source.'] },
      { heading: 'Consequences', paragraphs: ['We must run generation and inspect its result when the contract changes.', 'Explanations and examples still need human review.'] },
      { heading: 'Alternatives', paragraphs: ['Keep editing the field list by hand, accepting the duplicate review work.'] },
    ],
  },
  template: {
    id: 'template', filename: 'docs/adr/NNN-title.md template', title: 'ADR NNN: [significant choice]',
    meta: ['Date: [actual date]', 'Status: [Proposed, Rejected, Accepted or Superseded]'],
    blocks: [
      { heading: 'Context', paragraphs: ['[Situation, constraints and revision in scope.]'] },
      { heading: 'Decision', paragraphs: ['[The choice under consideration or adopted.]'] },
      { heading: 'Reasoning', paragraphs: ['[Why this choice fits those constraints.]'] },
      { heading: 'Consequences', paragraphs: ['[Costs, obligations and follow-up checks.]'] },
      { heading: 'Alternatives', paragraphs: ['[Options considered and reasons not chosen.]'] },
    ],
  },
}
export function documentMarkdown(example: DocExample): string {
  return [`# ${example.title}`, ...example.meta,
    ...(example.related ? [`${example.related.prefix}: [${example.related.label}](${example.related.filename})`] : []), '',
    ...example.blocks.flatMap(block => [`## ${block.heading}`, ...block.paragraphs, '']),
  ].join('\n')
}
```

`DocumentExample.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { CopyMarkdown } from './CopyMarkdown'
import { documentMarkdown, type DocExample } from './documents'
export function DocumentExample({ example, relatedControl }: { example: DocExample; relatedControl?: ReactNode }) {
  return <section aria-label={example.filename} className="min-w-0">
    <Card><p className="t-data mb-3 break-words text-sm text-muted">{example.filename}</p>
      <h3 className="t-head mb-3 text-lg">{example.title}</h3>
      {example.meta.map(line => <p key={line} className="break-words text-sm text-muted">{line}</p>)}
      {example.related && <p className="mt-2 break-words text-sm text-muted">{example.related.prefix}: {example.related.label} ({example.related.filename})</p>}
      {relatedControl}
      {example.blocks.map(block => <div key={block.heading} className="mt-4">
        <h4 className="t-ui mb-1 text-sm font-semibold">{block.heading}</h4>
        {block.paragraphs.map(line => <p key={line} className="break-words text-sm leading-relaxed text-muted">{line}</p>)}
      </div>)}
      <CopyMarkdown text={documentMarkdown(example)} label={example.id === 'readme' ? 'Copy README outline' : `Copy ${example.id === 'template' ? 'ADR template' : `ADR ${example.id}`}`} manualLabel={`${example.filename} Markdown`} />
    </Card>
  </section>
}
```

`DocumentPanels.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Prose, Section } from '@/components/ui'
import { DocumentExample } from './DocumentExample'
import { ADRS, README } from './documents'
import { SelectionTabs } from './SelectionTabs'
export function ReadmePanel() {
  return <Section title="Verify the README">
    <Prose><p>The README is the entry point. Link detailed procedures when a short section would hide conditions. The outline below has project facts you must supply and check.</p></Prose>
    <div className="mt-5"><DocumentExample example={README} /></div>
    <div className="mt-5"><RevealList idPrefix="documentation-readme" rows={[{ id: 'fresh', title: 'Fresh-clone check', body: <div><p>Try a fresh clone without private instructions. Record revision, prerequisites, configuration source, commands and expected result. The first unresolved step becomes a fix.</p><p className="mt-3">A listed command is not evidence that anyone ran it. <Link href="/stages/04-project-setup">Stage 04 owns setup</Link>; use <Link href="/stages/13-production-deployment">Stage 13 for releases</Link>, <Link href="/stages/14-post-deployment-verification">Stage 14 for recovery checks</Link> and <Link href="/stages/16-incident-management">Stage 16 for incidents</Link>.</p></div> }]} /></div>
  </Section>
}
export function DecisionsPanel() {
  const root = useRef<HTMLDivElement>(null)
  function select(target: 'old' | 'replacement') {
    const tab = root.current?.querySelector<HTMLButtonElement>(`[data-selection-id="${target}"]`)
    tab?.click(); tab?.focus()
  }
  return <Section title="Replace a decision without rewriting its history">
    <Prose><p>A significant boundary, dependency, interface or deployment choice earns an <Term id="adr">ADR</Term>. Start with one page; include the reasons and consequences. Use sequential docs/adr/NNN-title.md names without reusing a number.</p><p>These are illustrative Workshop records. Preserve the old reasoning, append a dated current-status notice, link both records and update any existing decision index.</p></Prose>
    <div ref={root} className="mt-5">
      <SelectionTabs label="Decision records" items={([
        ['old', 'ADR 004'], ['replacement', 'ADR 005'], ['template', 'Blank template'],
      ] as const).map(([id, label]) => ({ id, label, content: <div>
        <DocumentExample example={ADRS[id]} relatedControl={ADRS[id].related && <button type="button" onClick={() => select(ADRS[id].related!.target)} className="mt-3 min-h-11 border border-line px-4 text-sm">Read {ADRS[id].related!.label}</button>} />
      </div> }))} />
    </div>
    <div className="mt-5"><RevealList idPrefix="documentation-status" rows={[
      { id: 'format', title: 'Format and status', body: <div><p>Use Context, Decision, Reasoning, Consequences and Alternatives with a date. Proposed means under consideration; Rejected preserves a declined proposal&apos;s reason; Accepted means adopted; Superseded links to a later replacement.</p><p className="mt-3">Proposals can change during review. Accepted historical reasons stay. The later notice states current status, while the original acceptance remains historical.</p><p className="mt-3"><a href="https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions">Nygard&apos;s ADR guidance</a> explains small decision records. The appended notice is this playbook&apos;s preservation convention.</p></div> },
    ]} /></div>
  </Section>
}
```

- [ ] **Step 4: Focused GREEN, lint and typecheck.** The Step 1 assertions cover copying the selected replacement and exclude the status legend from its Markdown.
- [ ] **Step 5: Teeth check.** Omit only the old specimen's Supersession notice block in DocumentExample rendering; the scoped old-ADR test must fail despite the intact status legend. Restore and rerun GREEN. Copy remains sourced from the same document model.
- [ ] **Step 6: Independent review and commit** `feat(documentation): teach readme checks and adr replacement`. Deferred: reference/change inspectors and registration.

### Task 5: Make document selection and change tracing consultable

**Files:** Create `lookups.ts`, `LookupInspector.tsx`, `LookupPanels.tsx`, `LookupPanels.test.tsx`.

**Interfaces:** Consumes Task 3. Produces `LookupEntry`, arrays `NEEDS`, `ARTIFACTS`,
`FACTS`, `CHANGES`, `HISTORY`; `LookupInspector({ title, entries })` and panels
`ChoosePanel`, `ReferencePanel`, `ChangesPanel`, `HistoryPanel`.

- [ ] **Step 1: Write the render tests.**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ChoosePanel, ReferencePanel, ChangesPanel, HistoryPanel } from './LookupPanels'
import { LookupInspector } from './LookupInspector'
import { ARTIFACTS, CHANGES, FACTS, HISTORY, NEEDS } from './lookups'
test('every selector reveals the facts belonging to its actual row', () => {
  for (const entries of [NEEDS, FACTS, CHANGES, HISTORY]) {
    const view = render(<LookupInspector title="Lookup" entries={entries} />)
    for (const entry of entries) {
      fireEvent.click(screen.getByRole('tab', { name: entry.label }))
      const panel = screen.getByRole('tabpanel', { name: entry.label })
      expect(panel.textContent).toContain(entry.summary)
      for (const fact of entry.details) expect(panel.textContent).toContain(fact.text)
    }
    view.unmount()
  }
})
test('changed inspector data reaches the rendered detail instead of a hard-coded default', () => {
  render(<LookupInspector title="Injected" entries={[{ ...FACTS[0], details: [{ label: 'Source', text: 'Changed source sentinel' }] }]} />)
  expect(screen.getByRole('tabpanel').textContent).toContain('Changed source sentinel')
})
test('the reference distinguishes an unset setting from an omitted optional response', () => {
  render(<ReferencePanel />)
  expect(screen.getByText('integer 1–365')).toBeTruthy(); expect(screen.getByText('30 when unset')).toBeTruthy()
  fireEvent.click(screen.getByRole('tab', { name: 'waitlistPosition' }))
  expect(screen.getByText('positive integer')).toBeTruthy(); expect(screen.getByText('omitted when not waitlisted')).toBeTruthy()
  expect(screen.getByText(/absent, null and empty/)).toBeTruthy()
  expect(screen.getByText(/books or cancels/)).toBeTruthy(); expect(screen.getByText(/reads\/writes/)).toBeTruthy()
})
test('the six change chains include actual enforcement and source checks rather than a generation guarantee', () => {
  expect(CHANGES.map(row => row.id)).toEqual(['configuration', 'response', 'values', 'boundary', 'procedure', 'failure'])
  render(<ChangesPanel />)
  fireEvent.click(screen.getByRole('button', { name: 'Does configuration enforce itself?' }))
  fireEvent.click(screen.getByRole('button', { name: 'What does automation establish?' }))
  expect(screen.getByText(/only if the application actually invokes it/)).toBeTruthy()
  expect(screen.getByText(/Generation follows its input/)).toBeTruthy()
  expect(screen.getByText(/When working alone, you are the owner/)).toBeTruthy()
})
test('artifact choices remain optional and release material distinguishes its audiences', () => {
  render(<ChoosePanel />)
  expect(NEEDS.map(row => row.id)).toEqual(['tutorial', 'how-to', 'reference', 'explanation'])
  expect(NEEDS.map(row => row.summary.split(':')[0])).toEqual(['Tutorial', 'How-to guide', 'Reference', 'Explanation'])
  expect(ARTIFACTS.map(row => row.id)).toEqual(['readme', 'architecture', 'adr', 'conventions', 'troubleshooting', 'changelog', 'release-notes'])
  for (const row of ARTIFACTS) {
    fireEvent.click(screen.getByRole('button', { name: row.label })); expect(screen.getByText(row.summary)).toBeTruthy()
  }
  expect(screen.getByText(/not a raw commit dump/)).toBeTruthy()
  expect(screen.getByText(/not a nine-document mandate/)).toBeTruthy()
})
test('history distinguishes preservation from current instructions and points to the actual commit guidance', () => {
  render(<HistoryPanel />)
  fireEvent.click(screen.getByRole('tab', { name: 'Current instructions' }))
  expect(screen.getByText(/correct, redirect or retire/i)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Commit context' }))
  expect(screen.getByText(/a clear subject can be enough/)).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Stage 05 commit guidance' }).getAttribute('href')).toBe('/stages/05-development#commits')
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/LookupPanels.test.tsx`; capture RED.**
- [ ] **Step 3: Add `lookups.ts`.** All values remain authored illustrative facts; no app configuration is created.

```ts
export type LookupEntry = { id: string; label: string; summary: string; details: readonly { label: string; text: string }[] }
export const NEEDS: readonly LookupEntry[] = [
  { id: 'tutorial', label: 'Learn a skill', summary: 'Tutorial: learn through a guided exercise.', details: [{ label: 'Workshop example', text: 'Make a first booking in a safe sample environment.' }] },
  { id: 'how-to', label: 'Complete a task', summary: 'How-to guide: complete a known task.', details: [{ label: 'Example', text: 'Roll back a deployment using the applicable procedure.' }] },
  { id: 'reference', label: 'Look up facts', summary: 'Reference: find exact names, types, allowed values and absence behavior.', details: [{ label: 'Workshop example', text: 'Look up a setting default or an optional response field.' }] },
  { id: 'explanation', label: 'Understand a choice', summary: 'Explanation: understand a concept or reason.', details: [{ label: 'Workshop example', text: 'Understand why the factual contract reference is generated.' }] },
]
export const ARTIFACTS = [
  { id: 'readme', label: 'README / getting started', summary: 'A first working setup and a route to more detail.' },
  { id: 'architecture', label: 'Architecture overview', summary: 'Boundaries, responsibilities and relationships a reader needs.' },
  { id: 'adr', label: 'Decision record', summary: 'A significant choice and its alternatives need a lasting explanation.' },
  { id: 'conventions', label: 'Conventions / contributing', summary: 'Contributors need consistent rules, exceptions and review expectations.' },
  { id: 'troubleshooting', label: 'Troubleshooting', summary: 'A known symptom needs checks, likely causes and a safe next action.' },
  { id: 'changelog', label: 'Changelog', summary: 'Notable changes curated by version, not a raw commit dump.' },
  { id: 'release-notes', label: 'Release notes', summary: 'A particular audience needs release impact and required actions.' },
] as const
export const FACTS: readonly LookupEntry[] = [
  { id: 'setting', label: 'BOOKING_WINDOW_DAYS', summary: 'Illustrative Workshop configuration reference.', details: [
    { label: 'Shape', text: 'integer 1–365' }, { label: 'Default or absence', text: '30 when unset' }, { label: 'Source', text: 'Versioned startup configuration validator' }, { label: 'Owner / trigger', text: 'Maintainer / validator change' },
  ] },
  { id: 'response', label: 'waitlistPosition', summary: 'Illustrative Workshop response reference.', details: [
    { label: 'Shape', text: 'positive integer' }, { label: 'Default or absence', text: 'omitted when not waitlisted' }, { label: 'Source', text: 'Versioned response contract and serializer' }, { label: 'Owner / trigger', text: 'Contract owner / response change' },
  ] },
]
export const CHANGES: readonly LookupEntry[] = [
  { id: 'configuration', label: 'Configuration', summary: 'Workshop adds BOOKING_WINDOW_DAYS.', details: [
    { label: 'Source', text: 'Startup validator and its unset/invalid behavior' }, { label: 'Documents', text: 'Configuration reference, .env.example and setup guide' }, { label: 'Check', text: 'Compare integer 1–365 and default 30 with validation; test missing/invalid values.' }, { label: 'Owner / trigger', text: 'Maintainer / validator change' },
  ] },
  { id: 'response', label: 'Response contract', summary: 'Workshop adds a response field.', details: [
    { label: 'Source', text: 'Response schema and serializer behavior' }, { label: 'Documents', text: 'Generated reference and example response' }, { label: 'Check', text: 'Run generation, inspect the expected diff and verify optional-field omission.' }, { label: 'Owner / trigger', text: 'Contract owner / response change' },
  ] },
  { id: 'values', label: 'Default or allowed value', summary: 'An option changes its default or range.', details: [
    { label: 'Source', text: 'Implementation and behavioral test' }, { label: 'Documents', text: 'Existing reference and relevant how-to' }, { label: 'Check', text: 'Find old values and check new behavior, not only matching strings.' }, { label: 'Owner / trigger', text: 'Maintainer / option change' },
  ] },
  { id: 'boundary', label: 'Boundary or dependency', summary: 'A relationship in the system changes.', details: [
    { label: 'Source', text: 'Current system and decision record' }, { label: 'Documents', text: 'Architecture view, ADR and affected runbook' }, { label: 'Check', text: 'Trace affected relationships and replacement links.' }, { label: 'Owner / trigger', text: 'Area owner / boundary change' },
  ] },
  { id: 'procedure', label: 'Setup or release procedure', summary: 'Commands, access or environment change.', details: [
    { label: 'Source', text: 'Actual commands, access and environment' }, { label: 'Documents', text: 'README and linked procedures' }, { label: 'Check', text: 'Follow the documented path safely and record the result.' }, { label: 'Owner / trigger', text: 'Maintainer / procedure change' },
  ] },
  { id: 'failure', label: 'Known failure or release', summary: 'A confirmed fix or release needs useful documentation.', details: [
    { label: 'Source', text: 'Diagnosed behavior and release record' }, { label: 'Documents', text: 'Troubleshooting, changelog or release notes as needed' }, { label: 'Check', text: 'Verify the check/workaround and publish only supported impact claims.' }, { label: 'Owner / trigger', text: 'Maintainer / confirmed fix or release' },
  ] },
]
export const HISTORY: readonly LookupEntry[] = [
  { id: 'historical', label: 'Historical record', summary: 'Preserve historical ADRs and release records.', details: [{ label: 'Action', text: 'Keep the original reasons with discoverable replacement or version context.' }] },
  { id: 'current', label: 'Current instructions', summary: 'Correct, redirect or retire obsolete current procedures.', details: [{ label: 'Action', text: 'Do not leave a stale setup guide looking current. Link the replacement where readers expect it.' }] },
]
```

`LookupInspector.tsx`:

```tsx
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { SelectionTabs } from './SelectionTabs'
import type { LookupEntry } from './lookups'
export function LookupInspector({ title, entries }: { title: string; entries: readonly LookupEntry[] }) {
  return <Card><h3 className="t-head mb-4 text-lg">{title}</h3>
    <SelectionTabs label={title} items={entries.map(entry => ({ id: entry.id, label: entry.label, content: <div>
      <p className="mb-4 text-sm text-muted">{entry.summary}</p>
      <dl className="space-y-3">{entry.details.map(fact => <div key={fact.label} className="min-w-0">
        <dt className="t-label mb-1 text-subtle">{fact.label}</dt><dd className="break-words text-sm leading-relaxed text-muted"><InlineCode text={fact.text} /></dd>
      </div>)}</dl>
    </div> }))} />
  </Card>
}
```

`LookupPanels.tsx`:

```tsx
import Link from 'next/link'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { Prose, Section } from '@/components/ui'
import { ARTIFACTS, CHANGES, FACTS, HISTORY, NEEDS } from './lookups'
import { LookupInspector } from './LookupInspector'
export function ChoosePanel() {
  return <Section title="Choose the document for the reader's task">
    <Prose><p>Documentation runs continuously, a little with each change. Start with the smallest set that answers a real reader&apos;s question: a README, significant decisions and configuration facts the application actually needs.</p></Prose>
    <div className="mt-5"><LookupInspector title="What does the reader need?" entries={NEEDS} /></div>
    <p className="my-4 text-sm text-muted"><a href="https://diataxis.fr/start-here/">Diátaxis distinguishes four reader needs</a>; it does not require four folders.</p>
    <RevealList idPrefix="documentation-artifacts" rows={ARTIFACTS.map(row => ({ id: row.id, title: row.label, body: <p>{row.summary}</p> }))} />
    <Prose><p>A small patch may need only one entry. <a href="https://keepachangelog.com/en/1.1.0/">Keep a Changelog</a> explains curated history; <a href="https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases">GitHub releases</a> provides audience-facing release material. The gathered template menu is not a nine-document mandate.</p></Prose>
  </Section>
}
export function ReferencePanel() {
  return <Section title="State exact facts and current boundaries">
    <Prose><p>A useful view names its scope, components, relationships, owner and review trigger. Link decisions for reasons; <Link href="/stages/03-architecture">Stage 03 owns architecture design</Link>.</p></Prose>
    <Figure n={1} caption="Illustrative Workshop scope: one application and its booking store. No payment or email dependency is implied.">
      <div className="flex flex-wrap items-center gap-3 border border-line bg-sunken p-4 text-sm text-fg"><span>Attendee</span><span>→ books or cancels →</span><span>Workshop app</span><span>→ reads/writes →</span><span>Booking store</span></div>
    </Figure>
    <p className="mb-4 text-sm text-muted">The maintainer reviews this view when a boundary or dependency changes. <a href="https://c4model.com/diagrams/checklist">C4&apos;s review checklist</a> helps check readability.</p>
    <LookupInspector title="Illustrative Workshop reference" entries={FACTS} />
    <Prose><p>Record the applicable version and authoritative source. Treat absent, null and empty as distinct possibilities; document the behavior your actual contract defines. Generation follows its input and does not establish that the source is correct.</p></Prose>
  </Section>
}
export function ChangesPanel() {
  return <Section title="Trace the change to documents and checks">
    <Prose><p>When working alone, you are the owner. Give each living document a review trigger. Select the change to trace its source, affected documents and check.</p></Prose>
    <div className="mt-5"><LookupInspector title="Change-to-document check" entries={CHANGES} /></div>
    <div className="mt-5"><RevealList idPrefix="documentation-drift" rows={[
      { id: 'validator', title: 'Does configuration enforce itself?', body: <p>.env.example lists configuration. A validator enforces accepted values only if the application actually invokes it. This static playbook needs no environment variables; Workshop is illustrative. Use safe placeholders, never real credentials.</p> },
      { id: 'automation', title: 'What does automation establish?', body: <p>Types check some shapes. Tests check the behavior their assertions cover. Generation follows its input. Inspect the source and expected diff; choose the check for the claim you need to trust. <a href="https://www.writethedocs.org/guide/docs-as-code/">Docs as code</a> adds version control, review and automation. <Link href="/stages/06-testing">Stage 06 owns test design</Link>.</p> },
    ]} /></div>
  </Section>
}
export function HistoryPanel() {
  return <Section title="Keep historical reasons and current instructions usable">
    <LookupInspector title="What kind of document is this?" entries={HISTORY} />
    <p className="my-4 text-sm text-muted">Skip obvious comments and duplicated inventories nobody will maintain. Current structure and exact facts still earn their cost when they answer real questions.</p>
    <RevealList idPrefix="documentation-history" rows={[{ id: 'commits', title: 'Commit context', body: <div><p>Use a body when a reason, constraint or rejected alternative matters later; a clear subject can be enough for a small self-explanatory change. History preserves mistakes and superseded intent too. Keep current instructions where readers expect them.</p><p className="mt-3"><Link href="/stages/05-development#commits">Stage 05 commit guidance</Link></p></div> }]} />
  </Section>
}
```

- [ ] **Step 4: Run focused GREEN, lint and typecheck.** Confirm all six chains and both facts remain reachable through keyboard tabs. The Step 1 tests independently pin the four forms, six change IDs and factual values.
- [ ] **Step 5: Teeth check.** Change only LookupInspector's detail renderer to a fixed first-row fact; the injected-data test must fail. Restore and rerun the file. Distinguish any additional failures instead of claiming a one-test result without running them.
- [ ] **Step 6: Independent review and commit** `feat(documentation): add document and change inspectors`. Deferred: drills, forms and stage registration.

### Task 6: Practise comment judgments and evidence classification

**Files:** Create `practice.ts`, `DecisionDrill.tsx`, `PracticePanels.tsx`, `DecisionDrill.test.tsx`.

**Interfaces:** Consumes Task 2's `PracticeRun` and context. Produces immutable
`COMMENT_CASES`, `EVIDENCE_CASES`, `DecisionCase`, `DecisionDrill({ setId, title,
cases })`, `CommentsPanel()` and `AIPanel()`. Known set IDs are `comments` and
`evidence`; committed choices/drafts/index live in the mounted provider.

- [ ] **Step 1: Write full `DecisionDrill.test.tsx`.**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { DecisionDrill } from './DecisionDrill'
import { DocumentationSession } from './DocumentationSession'
import { COMMENT_CASES, EVIDENCE_CASES } from './practice'
function Mount({ cases = COMMENT_CASES }: { cases?: typeof COMMENT_CASES }) {
  const [show, setShow] = useState(true)
  return <DocumentationSession><button onClick={() => setShow(v => !v)}>Switch stage panel</button>{show && <DecisionDrill setId="test" title="Practice" cases={cases} />}</DocumentationSession>
}
test('every authored case reveals reasoning after a wrong committed choice and reset removes draft and verdict', () => {
  for (const item of [...COMMENT_CASES, ...EVIDENCE_CASES]) {
    const view = render(<Mount cases={[item]} />)
    expect(screen.queryByText(item.rationale)).toBeNull()
    const wrong = item.options.find(option => option.id !== item.answer)!
    fireEvent.click(screen.getByRole('radio', { name: wrong.text }))
    expect(screen.queryByText(item.rationale)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText(item.rationale)).toBeTruthy()
    expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
    expect((screen.getByRole('radio', { name: wrong.text }) as HTMLInputElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Reset practice' }))
    expect(screen.queryByText(item.rationale)).toBeNull()
    expect((screen.getByRole('radio', { name: wrong.text }) as HTMLInputElement).checked).toBe(false)
    expect(screen.queryByText('0 of 1 decisions correct')).toBeNull()
    view.unmount()
  }
})
test('committed score and an uncommitted next-case draft survive leaving the stage panel', () => {
  render(<Mount />)
  fireEvent.click(screen.getByRole('radio', { name: COMMENT_CASES[0].options.find(o => o.id === COMMENT_CASES[0].answer)!.text }))
  fireEvent.click(screen.getByText('Check answer')); expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
  fireEvent.click(screen.getByText('Next case'))
  fireEvent.click(screen.getByRole('radio', { name: COMMENT_CASES[1].options[0].text }))
  fireEvent.click(screen.getByText('Switch stage panel')); fireEvent.click(screen.getByText('Switch stage panel'))
  expect((screen.getByRole('radio', { name: COMMENT_CASES[1].options[0].text }) as HTMLInputElement).checked).toBe(true)
  expect(screen.queryByText(COMMENT_CASES[1].rationale)).toBeNull()
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
  fireEvent.click(screen.getByText('Previous case')); expect(screen.getByText(COMMENT_CASES[0].rationale)).toBeTruthy()
})
test('the authored sets cover the four comment reasons and three distinct evidence levels', () => {
  expect(COMMENT_CASES.map(c => c.id)).toEqual(['external', 'deviation', 'logic', 'limit'])
  expect(EVIDENCE_CASES.map(c => c.answer)).toEqual(['read', 'compile', 'execute'])
  expect(COMMENT_CASES[0].rationale).toContain('500-character')
  expect(EVIDENCE_CASES[2].rationale).toContain('does not establish production recovery')
  for (const item of [...COMMENT_CASES, ...EVIDENCE_CASES]) {
    expect(item.options.filter(o => o.id === item.answer)).toHaveLength(1)
    expect(new Set(item.options.map(o => o.id)).size).toBe(item.options.length)
  }
})

test('AI drafting requires a reviewer source and privacy checks beyond the practice score', async () => {
  const { AIPanel } = await import('./PracticePanels')
  render(<DocumentationSession><AIPanel /></DocumentationSession>)
  fireEvent.click(screen.getByRole('button', { name: 'Ground and review the draft' }))
  fireEvent.click(screen.getByRole('button', { name: 'Record the limits of validation' }))
  expect(screen.getByText(/A named reviewer/)).toBeTruthy()
  expect(screen.getByText(/Use synthetic identifiers/)).toBeTruthy()
  expect(screen.getByText(/label missing facts/)).toBeTruthy()
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/DecisionDrill.test.tsx`; capture RED.**
- [ ] **Step 3: Add complete authored cases and UI.** `practice.ts`:

```ts
export type DecisionCase = { id: string; prompt: string; excerpt: string; options: readonly { id: string; text: string }[]; answer: string; rationale: string }
export const COMMENT_CASES: readonly DecisionCase[] = [
  { id: 'external', prompt: 'Which explanation is supported by the comment?', excerpt: '// Keep the larger record in our external store and put only its ID in\n// metadata, whose value limit is 500 characters.', options: [
    { id: 'constraint', text: 'The external ID avoids storing a larger value in metadata.' },
    { id: 'outage', text: 'A particular past outage proved that Stripe silently truncates values.' },
  ], answer: 'constraint', rationale: 'Stripe documents a 500-character metadata value limit and recommends an external record ID for larger data. The comment explains that outside constraint. It supplies no evidence of silent truncation, an incident or a retry diagnosis.' },
  { id: 'deviation', prompt: 'Why preserve two forms of the title?', excerpt: '// Preserve the entered title for display. Apply normalization only\n// to the separate lookup key.', options: [
    { id: 'separate-key', text: 'The lookup key and displayed title serve different purposes.' },
    { id: 'restatement', text: 'The comment just repeats the variable assignment.' },
  ], answer: 'separate-key', rationale: 'This explains a deliberate deviation: normalization serves lookup while the original input serves display. Rename unclear code when a good name carries the meaning; retain a comment for intent a name cannot capture.' },
  { id: 'logic', prompt: 'Which condition must a later change preserve?', excerpt: "// This example's date interval includes both endpoints; account for\n// that when converting it to a half-open range.", options: [
    { id: 'exclusive', text: 'The last day is already excluded.' },
    { id: 'inclusive', text: 'Both endpoints are included in this illustrative interval.' },
  ], answer: 'inclusive', rationale: 'The comment explains tricky interval logic and its conversion constraint. It does not establish the date semantics of an unrelated application.' },
  { id: 'limit', prompt: 'What does the caller need to learn?', excerpt: '// This illustrative export handles at most 1000 rows. Expose that cap\n// to callers and revisit it before accepting larger exports.', options: [
    { id: 'unlimited', text: 'The export accepts arbitrary sizes.' },
    { id: 'cap', text: 'The example has a 1000-row cap that must be exposed and revisited.' },
  ], answer: 'cap', rationale: 'A known limitation belongs where callers can discover it. This is an illustrative limit, not a measured property of the playbook.' },
]
const evidenceOptions = [ { id: 'read', text: 'Read: compared with an identified source' }, { id: 'compile', text: 'Compile: passed the stated compiler checks' }, { id: 'execute', text: 'Execute: ran with an observed result' } ] as const
export const EVIDENCE_CASES: readonly DecisionCase[] = [
  { id: 'read', prompt: 'What does this hypothetical review establish?', excerpt: 'The reviewer compared the draft with the identified contract revision. No example was compiled or command run.', options: evidenceOptions, answer: 'read', rationale: 'Read evidence establishes comparison with an identified source. It does not establish compilation or execution.' },
  { id: 'compile', prompt: 'What does this hypothetical compiler report establish?', excerpt: 'A named synthetic example passed tsc --noEmit at the recorded revision. No runtime behavior was exercised.', options: evidenceOptions, answer: 'compile', rationale: 'Compile evidence establishes the stated compiler/type checks for that example. It does not establish a successful procedure or production behavior.' },
  { id: 'execute', prompt: 'What does this hypothetical isolated run establish?', excerpt: 'Command: node check-example.mjs. Revision: illustrative-r1. Environment: isolated synthetic fixture. Observed result: expected sample output, exit 0.', options: evidenceOptions, answer: 'execute', rationale: 'Execute evidence names a command, revision, environment and observed result. This isolated example does not establish production recovery; record its limits.' },
]
```

`DecisionDrill.tsx`:

```tsx
'use client'
import { useId } from 'react'
import { Card } from '@/components/ui'
import { EMPTY_PRACTICE, useDocumentationSession } from './DocumentationSession'
import type { DecisionCase } from './practice'
export function DecisionDrill({ setId, title, cases }: { setId: string; title: string; cases: readonly DecisionCase[] }) {
  const root = useId(); const { practices, setPractice } = useDocumentationSession()
  const run = practices[setId] ?? EMPTY_PRACTICE
  const item = cases[run.index]
  if (!item) return <p>No cases are available.</p>
  const committed = Object.hasOwn(run.choices, item.id)
  const choice = committed ? run.choices[item.id] : run.drafts[item.id]
  const answered = cases.filter(c => Object.hasOwn(run.choices, c.id)).length
  const correct = cases.filter(c => run.choices[c.id] === c.answer).length
  const validDraft = item.options.some(o => o.id === run.drafts[item.id])
  return <Card><p className="t-label mb-2 text-brand">Illustrative practice</p><h3 className="t-head mb-3 text-lg">{title}</h3>
    <p className="t-data mb-3 text-sm text-muted">Case {run.index + 1} of {cases.length}</p>
    <p aria-live="polite" className="mb-3 text-sm text-muted">{answered ? `${correct} of ${answered} decisions correct` : ''}</p>
    <pre className="mb-4 whitespace-pre-wrap break-words border border-line bg-sunken p-3 text-sm leading-relaxed text-fg">{item.excerpt}</pre>
    <fieldset disabled={committed} className="min-w-0 space-y-2"><legend className="mb-3 text-sm font-medium">{item.prompt}</legend>
      {item.options.map(option => <label key={option.id} className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand">
        <input type="radio" name={`${root}-${item.id}`} checked={choice === option.id} onChange={() => setPractice(setId, old => ({ ...old, drafts: { ...old.drafts, [item.id]: option.id } }))} disabled={committed} className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        <span aria-hidden className="mt-1 size-4 shrink-0 rounded-full border border-line peer-checked:border-brand peer-checked:bg-brand" /><span className="min-w-0 break-words">{option.text}</span>
      </label>)}
    </fieldset>
    <button type="button" disabled={committed || !validDraft} onClick={() => setPractice(setId, old => ({ ...old, choices: { ...old.choices, [item.id]: old.drafts[item.id] } }))} className="mt-4 min-h-11 border border-line px-4 text-sm disabled:text-subtle">Check answer</button>
    {committed && <div role="status" className="mt-4 border border-line bg-sunken p-4"><p className={`mb-2 text-sm font-semibold ${choice === item.answer ? 'text-go' : 'text-danger'}`}>{choice === item.answer ? 'Correct' : 'Reconsider'}</p><p className="text-sm leading-relaxed text-muted">{item.rationale}</p></div>}
    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" disabled={run.index === 0} onClick={() => setPractice(setId, old => ({ ...old, index: old.index - 1 }))} className="min-h-11 border border-line px-3 text-sm disabled:text-subtle">Previous case</button>
      <button type="button" disabled={run.index === cases.length - 1} onClick={() => setPractice(setId, old => ({ ...old, index: old.index + 1 }))} className="min-h-11 border border-line px-3 text-sm disabled:text-subtle">Next case</button>
      <button type="button" onClick={() => setPractice(setId, () => ({ index: 0, drafts: {}, choices: {} }))} className="min-h-11 border border-line px-3 text-sm">Reset practice</button>
    </div>
  </Card>
}
```

`PracticePanels.tsx`:

```tsx
import Link from 'next/link'
import { RevealList } from '@/components/RevealList'
import { Prose, Section } from '@/components/ui'
import { DecisionDrill } from './DecisionDrill'
import { COMMENT_CASES, EVIDENCE_CASES } from './practice'
export function CommentsPanel() {
  return <Section title="Explain the exception in a comment">
    <Prose><p>Implementation comments explain intent or constraints a reader cannot recover from code. Module documentation may describe purpose, use and behavior too. Rename unclear code when a good name carries the meaning.</p><p>The four comment specimens are illustrative patterns, not runnable implementations. <a href="https://google.github.io/eng-practices/review/reviewer/looking-for.html#comments">Google&apos;s review guidance</a> makes the distinction. <a href="https://docs.stripe.com/metadata#data">Stripe&apos;s metadata source</a> supports its value limit; an attempt count alone cannot diagnose a delivery failure.</p></Prose>
    <div className="mt-5"><DecisionDrill setId="comments" title="What does the comment explain?" cases={COMMENT_CASES} /></div>
  </Section>
}
export function AIPanel() {
  return <Section title="AI in documentation">
    <Prose><p>Give an assistant the source and version in scope. It can map affected documents, draft structure, compare an example with a schema and suggest lookup headings. Ask it to label missing facts rather than complete a plausible guess.</p></Prose>
    <div className="mt-5"><DecisionDrill setId="evidence" title="Which evidence do you actually have?" cases={EVIDENCE_CASES} /></div>
    <div className="mt-5"><RevealList idPrefix="documentation-ai" rows={[
      { id: 'review', title: 'Ground and review the draft', body: <div><p>A named reviewer compares the draft with the relevant diff, contract, code, verified procedure or approved notes. Use synthetic identifiers; remove real credentials, contact details and private payloads.</p><p className="mt-3">Permissions, limits, defaults, provider behavior, incident outcomes and release promises need a traceable source. Template infrastructure and test claims must be replaced with project facts.</p></div> },
      { id: 'limits', title: 'Record the limits of validation', body: <p>Read, Compile and Execute establish different things. For execution, record the command, revision, environment and observed result. An assistant needs the same evidence as anyone else. A successful isolated example does not establish production recovery; <Link href="/stages/14-post-deployment-verification">Stage 14 owns production verification</Link>.</p> },
    ]} /></div>
  </Section>
}
```

- [ ] **Step 4: Focused GREEN, lint and typecheck.** Open both AI rows and retain the named-reviewer, missing-facts and synthetic-data render assertions written in Step 1.

- [ ] **Step 5: Teeth check.** Change the feedback condition from `committed` to `committed && choice === item.answer`; wrong-answer tests must fail with missing rationale. Restore and rerun the file. Score is not a completion/verification badge.
- [ ] **Step 6: Independent review and commit** `feat(documentation): practise comment and evidence judgments`. Deferred: personal forms and registration.

### Task 7: Expose the change record and checks through two compact views

**Files:** Create `RecordPanels.tsx`, `RecordPanels.test.tsx`.

**Interfaces:** Consumes Tasks 1/2/3. Produces `RecordPanel({ view: 'change' |
'evidence' })` and `ChecklistPanel()`. Export and clear operate on the whole
record from either form or checklist; checklist-only records remain exportable.
A failed clear leaves a retry enabled even when the visible draft is empty.

- [ ] **Step 1: Write full render tests.**

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { DocumentationSession } from './DocumentationSession'
import { ChecklistPanel, RecordPanel } from './RecordPanels'
import { CHECKS, EMPTY_RECORD, FIELDS, RECORD_KEY, recordMarkdown, TEAM_NOTES } from './record'
let write = vi.fn<(text: string) => Promise<void>>()
beforeEach(() => { window.localStorage.clear(); write = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined); vi.stubGlobal('navigator', { clipboard: { writeText: write } }) })
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })
function Harness() {
  const [view, setView] = useState<'change' | 'evidence' | 'checks'>('change')
  return <DocumentationSession><button onClick={() => setView('change')}>Change view</button><button onClick={() => setView('evidence')}>Evidence view</button><button onClick={() => setView('checks')}>Checks view</button>{view === 'checks' ? <ChecklistPanel /> : <RecordPanel view={view} />}</DocumentationSession>
}
const edit = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
test('all eight fields retain literal input across views and export only the personal record', async () => {
  const view = render(<Harness />)
  const expected = { ...EMPTY_RECORD }
  for (const section of ['change', 'evidence'] as const) {
    fireEvent.click(screen.getByText(section === 'change' ? 'Change view' : 'Evidence view'))
    for (const field of FIELDS.filter(f => f.view === section)) { expected[field.id] = `${field.id}: <b>literal</b>`; edit(field.label, expected[field.id]) }
  }
  expect(screen.getByText('8 of 8 fields recorded')).toBeTruthy()
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' })) })
  expect(write).toHaveBeenLastCalledWith(recordMarkdown(expected))
  expect(view.container.querySelector('b')).toBeNull()
  expect(screen.getByText(/Recording fields and checks does not verify/)).toBeTruthy()
})
test('ten checks stay in their cadence groups and a periodic-only record exports from the other view', async () => {
  render(<Harness />); fireEvent.click(screen.getByText('Checks view'))
  expect(screen.getAllByRole('checkbox')).toHaveLength(10)
  expect(screen.getByRole('group', { name: 'Per-change checks' }).querySelectorAll('input')).toHaveLength(7)
  expect(screen.getByRole('group', { name: 'Periodic checks' }).querySelectorAll('input')).toHaveLength(3)
  fireEvent.click(screen.getByRole('checkbox', { name: CHECKS[9].text }))
  fireEvent.click(screen.getByText('Evidence view'))
  expect((screen.getByRole('button', { name: 'Copy as Markdown' }) as HTMLButtonElement).disabled).toBe(false)
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' })) })
  expect(write).toHaveBeenLastCalledWith(recordMarkdown({ ...EMPTY_RECORD, checked: ['history'] }))
  fireEvent.click(screen.getByText('Checks view')); fireEvent.click(screen.getByRole('button', { name: 'If you are not solo' }))
  for (const note of TEAM_NOTES) expect(screen.getByText(note)).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Stage 16 incident response' }).getAttribute('href')).toBe('/stages/16-incident-management')
})
test('clear from either view confirms and resets all fields and selections while failed removal can be retried', () => {
  render(<Harness />); edit('Change and scope', 'Keep until confirmed')
  fireEvent.click(screen.getByText('Evidence view')); edit('Owner and reviewer', 'Me')
  fireEvent.click(screen.getByText('Checks view')); fireEvent.click(screen.getByRole('checkbox', { name: CHECKS[9].text }))
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' })); expect(window.localStorage.getItem(RECORD_KEY)).toContain('Keep until confirmed')
  confirm.mockReturnValue(true)
  const deny = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
  fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
  expect(screen.getByText(/could return after reload/)).toBeTruthy()
  expect((screen.getByRole('button', { name: 'Clear whole record' }) as HTMLButtonElement).disabled).toBe(false)
  deny.mockRestore(); fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
  expect(window.localStorage.getItem(RECORD_KEY)).toBeNull()
  expect(screen.getAllByRole('checkbox').some(c => (c as HTMLInputElement).checked)).toBe(false)
  fireEvent.click(screen.getByText('Change view')); expect((screen.getByLabelText('Change and scope') as HTMLTextAreaElement).value).toBe('')
  fireEvent.click(screen.getByText('Evidence view')); expect((screen.getByLabelText('Owner and reviewer') as HTMLTextAreaElement).value).toBe('')
})
test('failed storage still allows copying a draft from the other view with clipboard fallback', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') }); write.mockRejectedValue(new Error('clipboard'))
  render(<Harness />); edit('Change and scope', 'Unsaved input')
  fireEvent.click(screen.getByText('Evidence view'))
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' })) })
  expect((screen.getByLabelText('Markdown record') as HTMLTextAreaElement).value).toContain('Unsaved input')
  expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
})
```

- [ ] **Step 2: Run `pnpm test src/features/documentation/RecordPanels.test.tsx`; capture RED.**
- [ ] **Step 3: Add full `RecordPanels.tsx`.**

```tsx
'use client'
import Link from 'next/link'
import { useId } from 'react'
import { TeamNotes } from '@/components/TeamNotes'
import { Card, Section } from '@/components/ui'
import { CopyMarkdown } from './CopyMarkdown'
import { useDocumentationSession } from './DocumentationSession'
import { CHECKS, FIELDS, hasRecord, recordMarkdown, TEAM_NOTES } from './record'
function RecordActions() {
  const { record, warning, clear, clearFailed } = useDocumentationSession()
  const filled = FIELDS.filter(f => record[f.id].trim()).length
  const present = hasRecord(record)
  return <div className="mt-5">
    <p aria-live="polite" className="t-data text-sm text-muted">{filled} of 8 fields recorded</p>
    <p className="mt-2 text-sm text-muted">Recording fields and checks does not verify documentation. Documentation remains continuous work.</p>
    <p aria-live="polite" className="mt-2 text-sm text-warn">{warning}</p>
    <CopyMarkdown text={recordMarkdown(record)} disabled={!present} />
    <button type="button" disabled={!present && !clearFailed} onClick={clear} className="mt-3 min-h-11 border border-line px-4 text-sm disabled:text-subtle">Clear whole record</button>
  </div>
}
export function RecordPanel({ view }: { view: 'change' | 'evidence' }) {
  const root = useId(); const { record, setField } = useDocumentationSession()
  return <Section title={view === 'change' ? 'Plan your documentation change' : 'Plan the check and record evidence'}><Card>
    <p className="mb-4 text-sm text-muted">Your application only. No example answers are inserted. Saved in this browser when storage is available; export the whole record from either view.</p>
    <div className="space-y-5">{FIELDS.filter(f => f.view === view).map(field => <div key={field.id}>
      <label htmlFor={`${root}-${field.id}`} className="block text-sm font-medium">{field.label}</label>
      <p id={`${root}-${field.id}-hint`} className="my-2 text-sm text-muted">{field.hint}</p>
      <textarea id={`${root}-${field.id}`} aria-describedby={`${root}-${field.id}-hint`} value={record[field.id]} rows={2} onChange={e => setField(field.id, e.target.value)} className="w-full resize-y border border-line bg-sunken px-3 py-2 text-[15px] leading-6 text-fg focus-visible:outline-2 focus-visible:outline-brand" />
    </div>)}</div><RecordActions />
  </Card></Section>
}
export function ChecklistPanel() {
  const { record, toggleCheck } = useDocumentationSession()
  return <Section title="Review this change and keep periodic checks visible"><Card>
    <p className="mb-4 text-sm text-muted">These are self-recorded selections. Periodic checks have their own cadence; they do not certify this stage as finished.</p>
    {[false, true].map(periodic => <fieldset key={String(periodic)} className="mb-5 min-w-0"><legend className="t-head mb-3 text-lg">{periodic ? 'Periodic' : 'Per-change'} checks</legend>
      <div className="space-y-2">{CHECKS.filter(c => c.periodic === periodic).map(check => <label key={check.id} className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand">
        <input type="checkbox" checked={record.checked.includes(check.id)} onChange={() => toggleCheck(check.id)} className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        <span aria-hidden className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand" /><span className="min-w-0 break-words">{check.text}</span>
      </label>)}</div>
    </fieldset>)}
    <RecordActions />
    <div className="mt-6"><TeamNotes><ul className="space-y-3">{TEAM_NOTES.map(note => <li key={note}>{note}</li>)}</ul><p className="mt-3"><Link href="/stages/16-incident-management">Stage 16 incident response</Link></p></TeamNotes></div>
  </Card></Section>
}
```

- [ ] **Step 4: Focused GREEN, lint and typecheck.** Scope assertions to the visible panel; a second simultaneous form must not be used to hide a remount failure.
- [ ] **Step 5: Teeth check.** Temporarily set RecordActions' `filled` count to `0`; the all-eight-fields test must fail because the visible count stays zero despite the populated model. Restore and rerun the whole file. The separate export assertions still verify full-record and checklist-only serialization.
- [ ] **Step 6: Independent review and commit** `feat(documentation): add change plan and completion checks`. Deferred: stage assembly/registration, browser gates and integration.

### Task 8: Assemble and register the complete stage as one unit

**Files:** Create `closing.tsx`, `steps.ts`, `Documentation.tsx`,
`Documentation.test.tsx`, `coverage.test.ts`, `web/e2e/documentation.spec.ts`. Modify
`web/src/features/stage-content.ts`, `web/src/features/step-ids.ts`,
`web/src/lib/stages.ts`, `web/src/lib/references.ts`, and
`web/e2e/audit-pages.spec.ts`.

**Interfaces:** Consumes every prior panel. Produces `Documentation()`, `STEPS`,
`STEP_IDS`/`StepId`, `COVERAGE`, `TrapsPanel()` and registration for `10-documentation`.
The exported stage entry remains synchronous. No new route, title or theme token.
The production flow spec created here is also Task 9's verification instrument.

- [ ] **Step 1: Write the complete `Documentation.test.tsx`.**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { getStage } from '@/lib/stages'
import { getReferences } from '@/lib/references'
import { STAGE_CONTENT } from '../stage-content'
import { STEP_IDS_BY_SLUG } from '../step-ids'
import { Documentation } from './Documentation'
import { STEP_IDS } from './steps'
import { TRAPS } from './closing'
afterEach(() => { window.localStorage.clear(); window.history.replaceState(null, '', '/') })
test('documentation is a continuous registered stage whose declared rail includes every approved judgment', () => {
  const ids = ['choose', 'readme', 'decisions', 'reference', 'comments', 'changes', 'history', 'ai', 'your-change', 'your-evidence', 'checklist', 'traps']
  expect([...STEP_IDS]).toEqual(ids)
  expect(STEP_IDS_BY_SLUG['10-documentation']).toEqual(ids)
  expect(getStage('10-documentation')).toMatchObject({ ready: true, cadence: 'Continuous', timing: 'Continuously, a little with every change.', blurb: 'Help the next person use the system, and preserve the reasons behind it.' })
  expect(STAGE_CONTENT['10-documentation']).toBe(Documentation)
  render(<Documentation />)
  const rail = screen.getByRole('tablist', { name: 'Stage steps' })
  expect([...rail.querySelectorAll('[role=tab]')].map(tab => tab.id)).toEqual(ids.map(id => `tab-${id}`))
  for (const id of ids) {
    fireEvent.click(document.getElementById(`tab-${id}`)!)
    expect(document.getElementById(`panel-${id}`)).toBeTruthy()
    expect(document.getElementById(`panel-${id}`)!.querySelector('button,input,textarea,[role=tablist]')).toBeTruthy()
  }
})
test('all eight traps reveal corrective action and the references add five distinct sources', () => {
  render(<Documentation />); fireEvent.click(document.getElementById('tab-traps')!)
  expect(TRAPS.map(t => t.id)).toEqual(['late', 'why-only', 'templates', 'history', 'generation', 'claims', 'privacy', 'evidence'])
  for (const trap of TRAPS) { fireEvent.click(screen.getByRole('button', { name: trap.title })); expect(screen.getByText(trap.detail)).toBeTruthy() }
  expect(getReferences('10-documentation').map(r => r.url)).toEqual([
    'https://diataxis.fr/start-here/',
    'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
    'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
    'https://c4model.com/diagrams/checklist',
    'https://www.writethedocs.org/guide/docs-as-code/',
  ])
  for (const reference of getReferences('10-documentation')) expect(screen.getByRole('link', { name: new RegExp(reference.title) }).getAttribute('href')).toBe(reference.url)
})
```

**Write `coverage.test.ts` before assembly too:**

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { CHECKS } from './record'
import { COVERAGE, STEP_IDS } from './steps'
function headings(md: string): string[] {
  let fence: { marker: string; size: number } | undefined
  const result: string[] = []
  for (const line of md.split('\n')) {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (delimiter) {
      const marker = delimiter[1][0]; const size = delimiter[1].length
      if (!fence) fence = { marker, size }
      else if (fence.marker === marker && size >= fence.size && delimiter[2].trim() === '') fence = undefined
      continue
    }
    const heading = !fence && line.match(/^#{2,3} (.+)$/)
    if (heading && heading[1] !== 'The work') result.push(heading[1])
  }
  return result
}
test('every canonical section has a real panel while specimen headings stay inside their fence', () => {
  expect(headings('## Entry criteria\n```markdown\n## Fake\n```\n### Real')).toEqual(['Entry criteria', 'Real'])
  const chapter = readFileSync(resolve(process.cwd(), '../docs/10-documentation.md'), 'utf8')
  expect(Object.keys(COVERAGE)).toEqual(headings(chapter))
  for (const ids of Object.values(COVERAGE)) {
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) expect(STEP_IDS).toContain(id)
  }
  const expectedChecks = chapter.split('## Definition of done')[1].split('## Scaling to a team')[0]
  expect(CHECKS.map(check => check.text)).toEqual([...expectedChecks.matchAll(/^- \[ \] (.+)$/gm)].map(match => match[1]))
})
```

**Write `web/e2e/documentation.spec.ts` now, before registration:**

```ts
import { expect, test } from '@playwright/test'
import { CHECKS, RECORD_KEY } from '../src/features/documentation/record'
const STAGE = '/stages/10-documentation'

test('documentation retains a literal change record across hashes history and reload in both themes', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
  const literal = '<script>window.__documentationExecuted=true</script>' + 'x'.repeat(600)
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`${STAGE}#your-change`, { waitUntil: 'networkidle' })
    await page.evaluate(({ key, theme }) => { localStorage.removeItem(key); localStorage.setItem('playbook:theme', JSON.stringify(theme)) }, { key: RECORD_KEY, theme })
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await page.getByLabel('Change and scope', { exact: true }).fill(literal)
    await page.locator('#tab-your-evidence').click()
    await page.getByLabel('Observed evidence and limits', { exact: true }).fill('Not executed; source review only')
    await page.goBack(); await expect(page.getByLabel('Change and scope', { exact: true })).toHaveValue(literal)
    await page.goForward(); await expect(page.getByLabel('Observed evidence and limits', { exact: true })).toHaveValue('Not executed; source review only')
    await page.reload({ waitUntil: 'networkidle' }); await expect(page.getByLabel('Observed evidence and limits', { exact: true })).toHaveValue('Not executed; source review only')
    await page.locator('#tab-checklist').click(); await page.getByRole('checkbox', { name: CHECKS[9].text }).check()
    await page.reload({ waitUntil: 'networkidle' }); await expect(page.getByRole('checkbox', { name: CHECKS[9].text })).toBeChecked()
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    }
    expect(await page.evaluate(() => Reflect.get(window, '__documentationExecuted'))).toBeUndefined()
    page.once('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'Clear whole record' }).click()
    expect(await page.evaluate(key => localStorage.getItem(key), RECORD_KEY)).toBeNull()
  }
  expect(errors).toEqual([])
})

test('documentation keeps an unsaved cross-panel draft and offers exact manual export when permissions fail', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(key => {
    const read = Storage.prototype.getItem; const write = Storage.prototype.setItem
    Storage.prototype.getItem = function(name) { if (name === key) throw new DOMException('denied', 'SecurityError'); return read.call(this, name) }
    Storage.prototype.setItem = function(name, value) { if (name === key) throw new DOMException('quota', 'QuotaExceededError'); return write.call(this, name, value) }
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } })
  }, RECORD_KEY)
  await page.goto(`${STAGE}#your-change`, { waitUntil: 'networkidle' })
  await page.getByLabel('Change and scope', { exact: true }).fill('Unsaved change')
  await page.locator('#tab-your-evidence').click()
  await page.getByLabel('Owner and reviewer', { exact: true }).fill('Me')
  await page.getByRole('button', { name: 'Copy as Markdown' }).click()
  await expect(page.getByLabel('Markdown record', { exact: true })).toHaveValue(/Unsaved change/)
  await expect(page.getByLabel('Markdown record', { exact: true })).toHaveValue(/Me/)
  await expect(page.getByText(/Saving is unavailable/)).toBeVisible()
  await page.locator('#tab-your-change').click(); await expect(page.getByLabel('Change and scope', { exact: true })).toHaveValue('Unsaved change')
  expect(errors).toEqual([])
})

test('documentation exposes replaced history and reasoning after a wrong keyboard answer', async ({ page }) => {
  await page.goto(`${STAGE}#decisions`, { waitUntil: 'networkidle' })
  await expect(page.getByText('2026-10-20 — Current status: Superseded.')).toBeVisible()
  await page.getByRole('button', { name: 'Read ADR 005' }).click()
  await expect(page.getByRole('region', { name: 'docs/adr/005-generated-contract-reference.md' })).toBeVisible()
  await page.getByRole('button', { name: 'Read ADR 004' }).click()
  await expect(page.getByText('2026-10-20 — Current status: Superseded.')).toBeVisible()
  await page.locator('#tab-comments').click()
  const radios = page.locator('#panel-comments').getByRole('radio')
  await radios.first().focus(); await radios.first().press('Space'); await radios.first().press('ArrowDown')
  await expect(radios.nth(1)).toBeChecked()
  expect((await radios.nth(1).boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByText('0 of 1 decisions correct')).toBeVisible()
  await expect(page.getByText(/It supplies no evidence of silent truncation/)).toBeVisible()
  await page.locator('#tab-history').click(); await page.locator('#tab-comments').click()
  await expect(page.getByText('0 of 1 decisions correct')).toBeVisible()
})
```

- [ ] **Step 2: Capture RED from the unit stage test and targeted browser spec against the current unregistered build.** Run `pnpm test src/features/documentation/Documentation.test.tsx`, then `pnpm exec playwright test e2e/documentation.spec.ts`. A production build may need the same permitted Google Fonts network access as the chapter round. Do not count a network/build-start failure as the expected UI RED; the intended browser failure is missing Stage 10 controls in the placeholder. Keep the old negative-placeholder test unchanged until registration.
- [ ] **Step 3: Add full assembly sources.** `closing.tsx`:

```tsx
import { RevealList } from '@/components/RevealList'
import { Section } from '@/components/ui'
export const TRAPS = [
  { id: 'late', title: 'Documentation waits until the end', detail: 'Record the reason and evidence with the change.' },
  { id: 'why-only', title: 'The why-only rule hides usable instructions', detail: 'Setup instructions and exact reference facts answer legitimate reader needs. Keep comment advice scoped to comments.' },
  { id: 'templates', title: 'Every template becomes mandatory', detail: 'Choose artifacts for real readers and tasks; maintain the smallest set that works.' },
  { id: 'history', title: 'Cleaning instructions deletes decision history', detail: 'Preserve the record and expose its replacement. Retire misleading current procedures separately.' },
  { id: 'generation', title: 'Generated output looks automatically correct', detail: 'Inspect the source and expected output diff; check behavior where the claim depends on behavior.' },
  { id: 'claims', title: 'Template infrastructure and test claims survive copying', detail: 'Replace sample assertions with project facts and observed evidence.' },
  { id: 'privacy', title: 'Realistic examples disclose private data', detail: 'Use synthetic data and review the result before publication.' },
  { id: 'evidence', title: 'A successful-looking draft stands in for validation', detail: 'Find the evidence behind each operational claim; record what remains unknown.' },
] as const
export function TrapsPanel() {
  return <Section title="Spot documentation traps"><RevealList idPrefix="documentation-traps" rows={TRAPS.map(trap => ({ id: trap.id, title: trap.title, body: <p>{trap.detail}</p> }))} /></Section>
}
```

`steps.ts`:

```ts
import { createElement } from 'react'
import type { Step } from '@/components/Stepper'
import { ReadmePanel, DecisionsPanel } from './DocumentPanels'
import { ChoosePanel, ReferencePanel, ChangesPanel, HistoryPanel } from './LookupPanels'
import { AIPanel, CommentsPanel } from './PracticePanels'
import { RecordPanel, ChecklistPanel } from './RecordPanels'
import { TrapsPanel } from './closing'
export const STEP_IDS = ['choose', 'readme', 'decisions', 'reference', 'comments', 'changes', 'history', 'ai', 'your-change', 'your-evidence', 'checklist', 'traps'] as const
export type StepId = (typeof STEP_IDS)[number]
export const STEPS: (Step & { id: StepId })[] = [
  { id: 'choose', label: 'Choose a document', hint: 'Start from a reader and a task', content: createElement(ChoosePanel) },
  { id: 'readme', label: 'Verify the README', hint: 'Check setup from a fresh clone', content: createElement(ReadmePanel) },
  { id: 'decisions', label: 'Replace a decision', hint: 'Preserve history and expose current status', content: createElement(DecisionsPanel) },
  { id: 'reference', label: 'State exact facts', hint: 'Name sources, versions and absence behavior', content: createElement(ReferencePanel) },
  { id: 'comments', label: 'Explain the exception', hint: 'Practise the four useful comment patterns', content: createElement(CommentsPanel) },
  { id: 'changes', label: 'Trace the change', hint: 'Connect facts to documents and checks', content: createElement(ChangesPanel) },
  { id: 'history', label: 'Keep history usable', hint: 'Preserve records and repair current instructions', content: createElement(HistoryPanel) },
  { id: 'ai', label: 'Check the evidence', hint: 'Ground AI drafts and qualify validation', content: createElement(AIPanel) },
  { id: 'your-change', label: 'Plan your change', hint: 'Record your reader, documents and source', content: createElement(RecordPanel, { view: 'change' }) },
  { id: 'your-evidence', label: 'Plan the check', hint: 'Record checks, evidence, ownership and triggers', content: createElement(RecordPanel, { view: 'evidence' }) },
  { id: 'checklist', label: 'Review this change', hint: 'Separate per-change and periodic checks', content: createElement(ChecklistPanel) },
  { id: 'traps', label: 'Spot the trap', hint: 'Recognize assumptions that need correction', content: createElement(TrapsPanel) },
]
```


Append this complete export to `steps.ts`; headings are the canonical citation
unit, not line numbers or names invented by the port:

```ts
export const COVERAGE: Record<string, readonly StepId[]> = {
  'Entry criteria': ['choose'],
  'Choose the document for the reader’s task': ['choose'],
  'Keep the README usable': ['readme'],
  'Record decisions and supersede them visibly': ['decisions'],
  'Keep architecture and contract references current': ['reference'],
  'Write comments for non-obvious reasons': ['comments'],
  'Update and verify documentation with the change': ['changes', 'your-change', 'your-evidence'],
  'Choose what to omit or archive': ['history'],
  'Commit messages preserve change context': ['history'],
  'AI in documentation': ['ai'],
  'Artifacts': ['choose', 'readme', 'decisions', 'reference', 'comments'],
  'Definition of done': ['checklist'],
  'Scaling to a team': ['checklist'],
  'Traps': ['traps'],
}
```

`Documentation.tsx`:

```tsx
import { References } from '@/components/References'
import { Stepper } from '@/components/Stepper'
import { DocumentationSession } from './DocumentationSession'
import { STEPS } from './steps'
export function Documentation() {
  return <><DocumentationSession><Stepper steps={STEPS} /></DocumentationSession><div className="mt-12"><References slug="10-documentation" /></div></>
}
```

Apply these exact additions to existing files, preserving every other entry:

```ts
// stage-content.ts: import and map member
import { Documentation } from './documentation/Documentation'
// In STAGE_CONTENT:
'10-documentation': Documentation,

// step-ids.ts: import and map member
import { STEP_IDS as DOCUMENTATION } from './documentation/steps'
// In STEP_IDS_BY_SLUG:
'10-documentation': DOCUMENTATION,

// stages.ts, Stage 10 only:
blurb: 'Help the next person use the system, and preserve the reasons behind it.',
ready: true,
```

Add this complete entry to `REFERENCES` in `web/src/lib/references.ts`:

```ts
'10-documentation': [
  { title: 'Diátaxis', source: 'Diátaxis', url: 'https://diataxis.fr/start-here/', adds: 'The four reader needs and how to separate guidance that serves incompatible tasks.' },
  { title: 'About READMEs', source: 'GitHub Docs', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes', adds: 'Repository entry-point guidance for purpose, getting started, help and maintainers.' },
  { title: 'Documenting Architecture Decisions', source: 'Michael Nygard · Cognitect', url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions', adds: 'The original rationale for small decision records and preserving superseded decisions.' },
  { title: 'C4 diagram review checklist', source: 'C4 model', url: 'https://c4model.com/diagrams/checklist', adds: 'Specific review questions for scope, notation, elements and labeled relationships.' },
  { title: 'Docs as code', source: 'Write the Docs', url: 'https://www.writethedocs.org/guide/docs-as-code/', adds: 'How version control, review and automation support a documentation workflow.' },
],
```

In `web/e2e/audit-pages.spec.ts` change only the negative-placeholder fixture
and its explanatory comment: `readStepIds(page, '10-documentation')` becomes
`readStepIds(page, '17-maintenance')`, confirmed at `stages.ts:188`. Update the
comment to name Stage 17 and retain the
`rejects.toThrow(/renders no steps/)` assertion. Do not remove the negative guard.

- [ ] **Step 4: Run the complete feature test folder plus shared guards:** `pnpm test src/features/documentation src/features/rails.test.tsx src/lib/stages.test.ts src/lib/references.test.ts src/lib/stage-metadata.test.ts`. Then lint, typecheck, full tests and targeted browser GREEN. The placeholder fixture remains Stage 17 while it is unready.
- [ ] **Step 5: Teeth check.** Remove only TRAPS' detail from the rendered row body; the trap-render test must fail while the underlying array remains correct. Restore and rerun. Separately remove one actual step object without changing STEP_IDS; the rendered-rail guard must fail. Record actual failure counts and restore the exact reviewed source.
- [ ] **Step 6: Independent review and commit** `feat(documentation): register the interactive stage`. The feature tree now has 16 ready stages; develop remains 15/18. Deferred: final browser matrices/readers/whole-branch review, integration and W-6 publication.

### Task 9: Verify the whole port and preserve a reviewable handoff

**Files:** Create `docs/superpowers/reports/2026-10-20-stage-10-port-execution.md`
(if not already created by execution),
`docs/superpowers/reports/2026-10-20-stage-10-port-reader-rerun.md` and
`docs/stage-10-status.md`. Update `docs/task.md`, `docs/tracker.md`, `KICKOFF.md`
only from verified results. Retain the Task 8 browser spec in the application gate.

**Interfaces:** Consumes the built registered stage and all task evidence.
Produces chapter-heading coverage (declared in Task 8 COVERAGE and expanded with evidence), exact RED/GREEN/teeth logs, live UI matrices,
reader reports with finding dispositions, final review and explicit branch state.
This task changes records/verification; no product behavior is assumed missing.
Any fix first gets its own failing regression test and independent review.

- [ ] **Step 1: Create the heading coverage table in `docs/stage-10-status.md`.**
Use the approved spec's twelve-row matrix, with columns for actual implementation
file, panel ID, interaction and proving test/browser observation. Account for all
nine teaching subsections plus Entry criteria, Artifacts, Definition of done,
Scaling to a team and eight Traps. No cell is satisfied solely by the research
appendix or a future W-6 sheet. Record deliberate hand-port duplication.
- [ ] **Step 2: Run the gate below and archive raw output.** Record commit/tree,
production/development build identity, ports and tool versions. The parent server
on 3200 remains untouched. If Fonts access or a browser launch requires sandbox
escalation, use the approved scope and preserve the failed attempt; a startup
failure is not evidence of a product bug or a passing UI check.
- [ ] **Step 3: Run and record the expanded-state matrix.** At 320/390/768/1024/
1440/1920/2560 and both themes, visit all twelve panels, select every lookup row,
all three ADR specimens, every wrong/right practice verdict, every reveal, team
notes, filled forms, storage warnings and manual-copy text. Check overflow,
keyboard focus and semantic names, all distinct text/background contrast pairs,
44px targets below lg and D-52 at 1024×768. Shared sweeps cover selectable tabs
and disclosures; focused browser checks cover radio feedback, draft warnings and
manual textareas they do not discover automatically. Record which states were
actually measured, screenshots/geometry/contrast evidence and any limitations.
If D-52 fails, split at the observed seam, preserve existing deep links, update
STEP_IDS/steps/tests/coverage and recheck every affected panel. Do not increase an
exception ceiling to make the new stage pass.
- [ ] **Step 4: Check curated and inline source destinations against the accepted
primary pages.** Preserve URLs and date/results in execution evidence. Review
links to Stage 03/04/05/06/13/14/16 against actual web IDs. Stage 05's commit step
was confirmed as `commits` during planning; retain an observed browser check.
- [ ] **Step 5: Dispatch two fresh read-only cold readers, allowed by the
repository's required independent-reader process.** Both receive the exact
Toolshare scenario and five questions from
`docs/superpowers/reports/2026-10-20-stage-10-correction-rerun.md`, verbatim. One
builds the required artifacts from the port; the other records navigation and
scores each question HIT/PARTIAL/MISFILED/MISS. Give only the running Stage 10 URL
and public interactions, not source code, chapter answers or private coaching.
For a browser-controlled reader follow the available browser skill and use
separate browser contexts; if tools cannot isolate contexts, run them sequentially.
Keep literal prompts, outputs, artifacts, source restrictions and finding IDs.
No access failure counts as a clean reader report.
- [ ] **Step 6: Resolve confirmed findings with provenance.** Recheck claims
against the actual port and canonical chapter; distinguish introduced defects,
pre-existing issues and plan-authored omissions. Reject disproved findings with
evidence. A substantive teaching gap returns to scoped chapter correction before
it is ported. Reuse the same case/questions on fixes; do not train the authored
example to Toolshare. Run a fresh regression test, teeth check and relevant
browser checks over the final fix wave itself.
- [ ] **Step 7: Request final whole-branch review of `79f9e31..HEAD`.** Use the
requesting-code-review skill; include approved spec/plan, coverage, task reviews,
chapter evidence and actual current results. Severity/IDs/provenance and a Ready
to merge / Ready with fixes verdict are required. Resolve blockers through the
receiving-code-review process and independently verify fixes. No unfinished or
failed reviewer turn counts as approval.
- [ ] **Step 8: Humanizer review authored prose and update records.** The
execution report retains raw terminal output, source mutations/restorations,
reader findings and review dispositions. Record Deferred: W-6 companion and
publication, W-6.4, five language sheets, stages 17/18, unrelated repairs,
integration and deployment. Name feature-tree versus develop counts explicitly.
Use writing-for-agents for KICKOFF; point to evidence rather than repeating the
entire history. Preserve a hash-checked archive before any optional scratch
cleanup; never delete the only raw evidence.
- [ ] **Step 9: Commit evidence and handoff separately** with `docs(plan)` /
`docs(tracker)` scopes as appropriate. Verify clean tree, exact commits off
`79f9e31`, tests/build and review state. Invoke finishing-a-development-branch
only when implementation/review are complete. Ask before any merge; do not push,
merge to main, delete the parent branch/worktree or deploy on this authority.

## Verification (after all tasks)

Run from `web/`, sequentially where builds share `.next`:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:dev-console
```

Expected: each command exits 0; the feature tree's new tests and 16 ready stages
are included, the production sweep observes every declared rail, no horizontal
overflow/contrast/touch/console/panel-weight failures, and the dev sweep has zero
React validation warnings. Record actual totals, not predicted counts. The
production check of the deployed site is not this gate. The shared audit may need
a measured runtime budget review if additional panels exceed its present 120s;
prove that cause before changing any timeout, and keep coverage intact.

After any final application fix, rebuild and rerun the affected browser checks
before claiming the earlier all-green audit covers it. After records-only edits,
run tracker-ledger guards, real local Markdown destinations and authored whitespace;
explain that application-tree identity preserves earlier UI evidence. Confirm
all internal source citations use chapter headings where appropriate (D-42).

## Plan self-review and execution handoff

The controller completed these checks before offering this plan; see the
[plan self-review record](../reports/2026-10-20-stage-10-port-plan-review.md).
These checks validate the written plan, not an executed implementation:

- [x] Spec coverage: all approved behaviors map to Tasks 1–9; no prototype,
  image-publication or shared-hook repair is silently included.
- [x] Step scan: sources are complete, every consumed export exists in an earlier
  task, every claimed RED has the right reason and each task has a review gate.
- [x] Type/source consistency: parse and check the embedded source with the local
  TypeScript version using a temporary/virtual file map; inspect JSX and imports.
  This is planning validation, not an executed implementation or TDD evidence.
- [x] Review Focus: each of the five conditions has its concrete test in the
  owning task. Resolve missing or contradictory assertions before handoff.
- [x] Proportion/prose: full inline source follows AGENTS.md; remove vague
  follow-up instructions and duplicate helper bodies. Apply humanizer to prose.

**Execution choice to present:** Subagent-driven versus inline. Recommend
**subagent-driven** for this nine-task plan: record/storage, clipboard races,
ADR status and registration are separate reviewable boundaries, while repeated
fresh review helps catch a plausible-looking but incorrect teaching claim.
Tasks remain sequential at their interface gates; this is not authorization for
parallel writers or merging. Inline remains available and still gets per-task
independent reviews under AGENTS.md. The user approved this spec, not an unseen
plan; plan review and the execution-method decision are the next checkpoint.

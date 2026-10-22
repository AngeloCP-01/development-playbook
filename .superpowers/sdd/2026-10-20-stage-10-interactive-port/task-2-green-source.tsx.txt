'use client'
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import {
  EMPTY_RECORD,
  normalizeRecord,
  RECORD_KEY,
  type CheckId,
  type DocumentationRecord,
  type FieldId,
} from './record'

export type PracticeRun = {
  index: number
  drafts: Record<string, string>
  choices: Record<string, string>
}
export const EMPTY_PRACTICE: PracticeRun = { index: 0, drafts: {}, choices: {} }
type Session = {
  record: DocumentationRecord
  warning: string
  clearFailed: boolean
  setField: (id: FieldId, text: string) => void
  toggleCheck: (id: CheckId) => void
  clear: () => void
  practices: Record<string, PracticeRun>
  setPractice: (id: string, update: (old: PracticeRun) => PracticeRun) => void
}
const Context = createContext<Session | null>(null)
const PROBE_EVENT = 'documentation:storage-check'
function subscribeProbe(listener: () => void) {
  window.addEventListener('storage', listener)
  window.addEventListener(PROBE_EVENT, listener)
  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener(PROBE_EVENT, listener)
  }
}
function readable() {
  try {
    window.localStorage.getItem(RECORD_KEY)
    return true
  } catch {
    return false
  }
}
const serverReadable = () => true

export function DocumentationSession({ children }: { children: ReactNode }) {
  const { value, setValue, reset } = useLocalStorage<unknown>(
    RECORD_KEY,
    EMPTY_RECORD,
  )
  const canRead = useSyncExternalStore(subscribeProbe, readable, serverReadable)
  const [draft, setDraft] = useState<DocumentationRecord | null>(null)
  const [failure, setFailure] = useState<'save' | 'clear' | null>(null)
  const [practices, setPractices] = useState<Record<string, PracticeRun>>({})
  const record = draft ?? normalizeRecord(value)
  const warning =
    failure === 'clear'
      ? 'The visible record is cleared, but the saved copy could return after reload. Clearing storage is unavailable; retry or remove it in browser settings.'
      : failure === 'save' || !canRead
        ? 'Saving is unavailable. This draft stays editable across these panels; export it before leaving or reloading.'
        : ''
  function update(change: (old: DocumentationRecord) => DocumentationRecord) {
    let next = change(record)
    setValue((previous: unknown) => {
      next = change(draft ?? normalizeRecord(previous))
      return next
    })
    let saved = false
    try {
      saved = window.localStorage.getItem(RECORD_KEY) === JSON.stringify(next)
    } catch {
      /* keep stage-session draft */
    }
    setDraft(saved ? null : next)
    setFailure(saved ? null : 'save')
    window.dispatchEvent(new Event(PROBE_EVENT))
  }
  function clear() {
    if (
      !window.confirm(
        'Clear the whole documentation record, including both views and all checklist selections?',
      )
    )
      return
    reset()
    let cleared = false
    try {
      cleared = window.localStorage.getItem(RECORD_KEY) === null
    } catch {
      /* report uncertain removal */
    }
    setDraft(cleared ? null : normalizeRecord(null))
    setFailure(cleared ? null : 'clear')
    window.dispatchEvent(new Event(PROBE_EVENT))
  }
  return (
    <Context.Provider
      value={{
        record,
        warning,
        clearFailed: failure === 'clear',
        clear,
        setField: (id, text) => update((old) => ({ ...old, [id]: text })),
        toggleCheck: (id) =>
          update((old) => ({
            ...old,
            checked: old.checked.includes(id)
              ? old.checked.filter((c) => c !== id)
              : [...old.checked, id],
          })),
        practices,
        setPractice: (id, change) =>
          setPractices((old) => ({
            ...old,
            [id]: change(old[id] ?? EMPTY_PRACTICE),
          })),
      }}
    >
      {children}
    </Context.Provider>
  )
}
export function useDocumentationSession(): Session {
  const context = useContext(Context)
  if (!context)
    throw new Error('Documentation controls require DocumentationSession')
  return context
}

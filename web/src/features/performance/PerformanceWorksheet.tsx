'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import {
  BASELINE_FIELDS,
  EMPTY_PERFORMANCE_SHEET,
  FOLLOWUP_FIELDS,
  normalizePerformanceSheet,
  PERFORMANCE_KEY,
  performanceMarkdown,
  SHEET_FIELDS,
  type PerformanceSheet,
} from '@/lib/performance-sheet'
import { CopyText } from './CopyText'

export function PerformanceWorksheet({
  view,
}: {
  view: 'baseline' | 'followup'
}) {
  const root = useId()
  const { value, setValue, reset } = useLocalStorage<unknown>(
    PERFORMANCE_KEY,
    EMPTY_PERFORMANCE_SHEET,
  )
  const [draft, setDraft] = useState<PerformanceSheet | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const sheet = draft ?? normalizePerformanceSheet(value)
  const fields = view === 'baseline' ? BASELINE_FIELDS : FOLLOWUP_FIELDS
  const filled = SHEET_FIELDS.filter(
    ({ key }) => sheet[key].trim().length > 0,
  ).length

  const update = (key: keyof PerformanceSheet, text: string) => {
    let next = { ...sheet, [key]: text }
    setValue((previous: unknown) => {
      next = {
        ...normalizePerformanceSheet(previous),
        ...(draft ?? {}),
        [key]: text,
      }
      return next
    })
    let saved = false
    try {
      saved =
        window.localStorage.getItem(PERFORMANCE_KEY) === JSON.stringify(next)
    } catch {
      /* retain the mounted draft */
    }
    setDraft(saved ? null : next)
    setUnavailable(!saved)
  }

  const clear = () => {
    if (
      !window.confirm(
        'Clear the whole performance record, including both views?',
      )
    )
      return
    reset()
    let cleared = false
    try {
      cleared = window.localStorage.getItem(PERFORMANCE_KEY) === null
    } catch {
      /* show unavailable storage */
    }
    setDraft(cleared ? null : { ...EMPTY_PERFORMANCE_SHEET })
    setUnavailable(!cleared)
  }

  return (
    <Card>
      <h3 className="t-head text-lg">
        {view === 'baseline' ? 'Your baseline record' : 'Your follow-up record'}
      </h3>
      <p className="mt-2 text-sm text-muted">
        Your application only. Example answers are never copied into these
        fields. Saved in this browser when storage is available.
      </p>
      <p aria-live="polite" className="t-data mt-3 text-sm text-subtle">
        {filled} of {SHEET_FIELDS.length} fields recorded
      </p>
      <p className="mt-2 text-sm text-muted">
        Recording fields does not verify performance or correctness.
      </p>
      <p aria-live="polite" className="mt-2 text-sm text-warn">
        {unavailable
          ? 'Saving is unavailable. This draft remains editable here; export it before leaving or reloading.'
          : ''}
      </p>
      <div className="mt-5 space-y-5">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={`${root}-${field.key}`}
              className="block text-sm font-medium"
            >
              {field.label}
            </label>
            <p
              id={`${root}-${field.key}-hint`}
              className="my-2 text-sm text-muted"
            >
              {field.hint}
            </p>
            <textarea
              id={`${root}-${field.key}`}
              aria-describedby={`${root}-${field.key}-hint`}
              value={sheet[field.key]}
              rows={2}
              onChange={(event) => update(field.key, event.target.value)}
              className="w-full resize-y border border-line bg-sunken px-3 py-2 text-[15px] leading-6 text-fg focus-visible:outline-2 focus-visible:outline-brand"
            />
          </div>
        ))}
      </div>
      <CopyText text={performanceMarkdown(sheet)} disabled={filled === 0} />
      <button
        type="button"
        disabled={filled === 0}
        onClick={clear}
        className="mt-3 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle"
      >
        Clear whole record
      </button>
    </Card>
  )
}

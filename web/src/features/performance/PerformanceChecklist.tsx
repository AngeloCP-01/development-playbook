'use client'

import { useId } from 'react'
import { Card } from '@/components/ui'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACTS, CHECKLIST_KEY, DONE, EMPTY_CHECKS, TEAM } from './checklist'

export function PerformanceChecklist() {
  const root = useId()
  const { value, setValue, reset } = useLocalStorage<unknown>(
    CHECKLIST_KEY,
    EMPTY_CHECKS,
  )
  const valid = new Set<string>(DONE.map((row) => row.id))
  const checked = new Set<string>(
    Array.isArray(value)
      ? value.filter(
          (id): id is string => typeof id === 'string' && valid.has(id),
        )
      : [],
  )
  return (
    <Card>
      <p aria-live="polite" className="t-data mb-4 text-sm text-muted">
        {checked.size} of {DONE.length} checks recorded
      </p>
      <ul className="space-y-2">
        {DONE.map((row) => (
          <li key={row.id} className="measure-full">
            <label
              htmlFor={`${root}-${row.id}`}
              className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"
            >
              <input
                id={`${root}-${row.id}`}
                type="checkbox"
                checked={checked.has(row.id)}
                onChange={() => {
                  const next = new Set(checked)
                  if (next.has(row.id)) next.delete(row.id)
                  else next.add(row.id)
                  setValue([...next])
                }}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span
                aria-hidden
                className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"
              />
              <span className="min-w-0 break-words">{row.text}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={reset}
        className="mt-4 min-h-11 border border-line px-4 text-sm"
      >
        Reset completion checks
      </button>
      <h3 className="t-head mt-6 text-lg">Keep these artifacts</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
        {ARTIFACTS.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <div className="mt-6">
        <TeamNotes>
          <ul className="space-y-4">
            {TEAM.map((row) => (
              <li key={row.id}>
                <h4 className="text-sm font-medium">{row.title}</h4>
                <p className="mt-1 text-sm text-muted">{row.detail}</p>
              </li>
            ))}
          </ul>
        </TeamNotes>
      </div>
    </Card>
  )
}

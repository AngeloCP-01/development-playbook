'use client'

import { useId } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'

const KEY = 'incident-management-checklist'
const EMPTY: string[] = []

const RECOVERY = [
  {
    id: 'operation',
    text: 'The affected customer operation meets its recovery criteria',
  },
  {
    id: 'delayed',
    text: 'Delayed work and uncertain side effects are accounted for; limitations disclosed',
  },
  {
    id: 'window',
    text: 'Stability was observed for the documented service-specific window',
  },
  { id: 'update', text: 'Affected users received the recovery update' },
]

const FOLLOWUP = [
  {
    id: 'explanation',
    text: 'Evidence supports the explanation; unresolved questions have owners and dispositions',
  },
  {
    id: 'corrections',
    text: 'Permanent corrections are verified, or remaining risk has an owner and decision',
  },
  {
    id: 'postmortem',
    text: 'Major or critical postmortem includes detection gaps and a consistent impact timeline',
  },
  {
    id: 'actions',
    text: 'Actions have owners, dates and completion evidence; overdue work is reviewed',
  },
  {
    id: 'runbook',
    text: 'Runbook and rehearsal reflect what the incident taught',
  },
]

export function IncidentChecklist() {
  const {
    value: checked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(KEY, EMPTY)
  const idBase = useId()
  const toggle = (id: string) =>
    setValue((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  return (
    <div className="space-y-4">
      {[
        { title: 'Service recovery', items: RECOVERY },
        { title: 'Follow-up closure', items: FOLLOWUP },
      ].map((group) => (
        <Card key={group.title} className="p-0">
          <div className="border-b border-line px-5 py-3">
            <h3 className="t-head text-lg">{group.title}</h3>
          </div>
          <ul className="divide-y divide-line">
            {group.items.map((item) => (
              <li key={item.id}>
                <label
                  htmlFor={`${idBase}-${item.id}`}
                  className="flex min-h-11 cursor-pointer items-start gap-3 px-5 py-3 text-sm text-muted hover:bg-sunken lg:min-h-9"
                >
                  <input
                    id={`${idBase}-${item.id}`}
                    type="checkbox"
                    checked={checked.includes(item.id)}
                    onChange={() => toggle(item.id)}
                    className="mt-1 size-4 shrink-0 accent-go"
                  />
                  <span className="min-w-0">{item.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
      ))}
      <p
        className="flex items-center gap-2 text-sm text-subtle"
        aria-live="polite"
      >
        <Check className="size-4 text-go" aria-hidden />
        {checked.length} of 9 checks recorded in this browser
      </p>
      <button
        type="button"
        disabled={checked.length === 0}
        onClick={() => {
          if (window.confirm('Start a new incident and clear all nine checks?'))
            reset()
        }}
        className="flex min-h-11 items-center gap-2 border border-line px-4 text-sm text-muted hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-50 lg:min-h-9"
      >
        <RotateCcw className="size-4" aria-hidden />
        Start new incident · clear checks
      </button>
      <TeamNotes>
        <p>
          Assign coordination, technical work and communication explicitly. One
          person can hold several roles until help arrives. Agree coverage and
          escalation before promising on-call availability; handoff needs
          acceptance.
        </p>
      </TeamNotes>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui'

const EVENTS = [
  {
    time: '10:05 UTC',
    situation:
      'Reminder sends time out while the web UI stays healthy. Ana has no confirmed delivery result.',
    choices: [
      {
        id: 'declare',
        label: 'Declare the incident and check worker impact',
        safe: true,
        why: 'Reminders are still delayed. Record the unknowns and confirm impact without sending duplicates.',
      },
      {
        id: 'wait',
        label: 'Wait because the homepage is healthy',
        safe: false,
        why: 'Reminders are still delayed. A working homepage cannot prove the worker completed customer operations.',
      },
    ],
    update:
      'Investigating: reminders are delayed. Cause and recovery time are unknown. Next update: 10:15.',
  },
  {
    time: '10:15 UTC',
    situation:
      'The provider reports degradation. Some sends timed out with no acknowledgment.',
    choices: [
      {
        id: 'pause',
        label: 'Pause dispatch and reconcile uncertain sends',
        safe: true,
        why: 'Nudge has a tested pause that preserves queued jobs. Hold uncertain results until the provider lookup establishes their outcome.',
      },
      {
        id: 'retry',
        label: 'Retry every timed-out send',
        safe: false,
        why: 'A timeout can hide an accepted send. Blind retries could deliver duplicate reminders.',
      },
    ],
    update:
      'Dispatch is paused while uncertain sends are checked. The provider’s role is not confirmed. Next update: 10:25.',
  },
  {
    time: '10:25 UTC',
    situation:
      'The provider reports recovery, but queued reminders and uncertain results remain.',
    choices: [
      {
        id: 'monitor',
        label: 'Reconcile work and keep monitoring',
        safe: true,
        why: 'Delayed work remains. Resume only confirmed-unsent eligible records, then observe the real operation.',
      },
      {
        id: 'resolve',
        label: 'Resolve now because the provider is green',
        safe: false,
        why: 'Delayed work remains. Provider status cannot prove Nudge customers received their reminders.',
      },
    ],
    update:
      'Monitoring: only reconciled eligible reminders resume. Recovery time remains unknown. Next update: 10:40.',
  },
  {
    time: '10:40 UTC',
    situation:
      'The affected set is accounted for and normal dispatch has been observed for ten minutes. The provider cause is still unknown.',
    choices: [
      {
        id: 'publish',
        label: 'Publish recovery and keep follow-up open',
        safe: true,
        why: 'The customer operation has met its recovery criteria. The unknown provider cause belongs to owned follow-up.',
      },
      {
        id: 'wait-cause',
        label: 'Wait to update customers until root cause is known',
        safe: false,
        why: 'Customers need the observed recovery status now. Do not invent a cause or hold the update for one.',
      },
    ],
    update:
      'Resolved: normal dispatch was observed from 10:30 to 10:40; affected records are accounted for. Follow-up remains open.',
  },
] as const

export function NudgeRehearsal() {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<string | null>(null)
  const [safeCount, setSafeCount] = useState(0)
  const event = EVENTS[index]

  if (!event) {
    return (
      <Card>
        <p className="t-head text-lg">Rehearsal complete</p>
        <p className="mt-2 text-sm text-muted">
          {safeCount} of {EVENTS.length} safe decisions. Review any missed
          consequence before using a real runbook.
        </p>
        <button
          type="button"
          onClick={() => {
            setIndex(0)
            setChoice(null)
            setSafeCount(0)
          }}
          className="mt-4 flex min-h-11 items-center gap-2 border border-line px-4 text-sm hover:bg-sunken lg:min-h-9"
        >
          <RotateCcw className="size-4" aria-hidden />
          Rehearse again
        </button>
      </Card>
    )
  }

  const picked = event.choices.find((option) => option.id === choice)
  const safeChoice = event.choices.find((option) => option.safe)
  const next = EVENTS[index + 1]

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <span className="t-label text-brand">Nudge · {event.time}</span>
        <span className="t-data text-subtle">
          Decision {index + 1} / {EVENTS.length}
        </span>
      </div>
      <p className="mb-4 text-sm leading-6 text-muted">{event.situation}</p>
      <div
        role="radiogroup"
        aria-label={`Decision at ${event.time}`}
        className="grid gap-2 sm:grid-cols-2"
      >
        {event.choices.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={choice === option.id}
            disabled={choice !== null}
            onClick={() => {
              if (choice !== null) return
              setChoice(option.id)
              if (option.safe) setSafeCount((count) => count + 1)
            }}
            className="min-h-11 border border-line bg-sunken px-4 py-3 text-left text-sm font-medium hover:border-line-strong disabled:cursor-not-allowed lg:min-h-9"
          >
            {option.label}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {picked && (
          <div className="mt-5 space-y-3 border-t border-line pt-4">
            <p
              className={`flex items-center gap-2 text-sm font-medium ${picked.safe ? 'text-go' : 'text-danger'}`}
            >
              {picked.safe ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <X className="size-4" aria-hidden />
              )}
              {picked.safe ? 'Safe decision' : 'Unsafe decision'}
            </p>
            <p className="text-sm leading-6 text-muted">{picked.why}</p>
            {!picked.safe && (
              <p className="text-sm leading-6 text-muted">
                Correct course: {safeChoice?.label}. The simulation continues
                after that action, not after the unsafe choice.
              </p>
            )}
            <blockquote className="border-l-2 border-brand bg-sunken px-4 py-3 text-sm leading-6 text-fg">
              {picked.safe
                ? 'Customer update: '
                : 'Model customer update after correction: '}
              {event.update}
            </blockquote>
            <button
              type="button"
              onClick={() => {
                setIndex(index + 1)
                setChoice(null)
              }}
              className="min-h-11 border border-line px-4 text-sm font-medium hover:bg-sunken lg:min-h-9"
            >
              {next
                ? `Continue to ${next.time.replace(' UTC', '')}`
                : 'Finish rehearsal'}
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { SLICES } from './scoring'

/**
 * Source: docs/02-planning.md, "Estimate for sequencing, not for promises".
 *
 * Structure copied from `discovery/SeverityScorer.tsx`: `role="radiogroup"`,
 * `role="radio"`, `aria-checked`, an `aria-live` verdict panel, a dashed empty
 * state before anything is picked.
 *
 * Only two tones are used, deliberately. Large is not a failure sitting next
 * to two successes — it is a signal the work is not yet understood, so it
 * gets `warn` rather than `danger`. `brand` is never used here: it marks
 * attention, and size carries meaning instead.
 *
 * The examples under Small and Medium are pulled live from `SLICES` — the
 * same plan the reader just sequenced in the step above. Large has none to
 * show, and that absence is the point: every slice in this plan was already
 * broken down before it reached the list.
 */

type SizeKey = 'S' | 'M' | 'L'

type Level = {
  key: SizeKey
  label: string
  test: string
  verdict: string
  detail: string
  tone: 'ok' | 'warn'
}

const LEVELS: Level[] = [
  {
    key: 'S',
    label: 'Small',
    test: 'A day or less.',
    verdict: 'Schedule it as written',
    detail:
      'Small enough that the estimate is worth trusting. Nothing here needs to be broken down before it goes on the list.',
    tone: 'ok',
  },
  {
    key: 'M',
    label: 'Medium',
    test: 'A few days.',
    verdict: 'Schedule it as written',
    detail:
      'Still small enough to reason about end to end in one sitting. If it starts slipping past a few days once you are inside it, that is new information — split it then, rather than protecting an estimate that no longer holds.',
    tone: 'ok',
  },
  {
    key: 'L',
    label: 'Large',
    test: 'A week or more.',
    verdict: 'Break it down before you schedule it',
    detail:
      'Large almost always means "not yet decomposed." A task you cannot decompose is a task you do not understand well enough to start — so the size itself is the instruction: split it, and estimate the pieces instead.',
    tone: 'warn',
  },
]

const TONE_CLASS = {
  ok: {
    chip: 'border-go text-go',
    active: 'bg-go-tint border-go',
    text: 'text-go',
  },
  warn: {
    chip: 'border-warn text-warn',
    active: 'bg-warn-tint border-warn',
    text: 'text-warn',
  },
} as const

export function SizeScorer() {
  const [selected, setSelected] = useState<SizeKey | null>(null)
  const level = LEVELS.find((l) => l.key === selected)
  const examples = level ? SLICES.filter((s) => s.size === level.key) : []

  return (
    <Card>
      <p className="mb-1 text-sm font-medium">How big does the task feel?</p>
      <p className="mb-4 text-sm text-subtle">
        Pick comparatively, not in hours — you are sequencing, not promising.
      </p>

      <div
        role="radiogroup"
        aria-label="Task size"
        className="grid gap-2 sm:grid-cols-3"
      >
        {LEVELS.map((l) => {
          const active = selected === l.key
          const tone = TONE_CLASS[l.tone]
          return (
            <button
              key={l.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(active ? null : l.key)}
              className={[
                'min-h-11 min-w-0 border px-3 py-2.5 text-left transition-colors duration-150',
                active
                  ? tone.active
                  : 'border-line bg-sunken hover:border-line-strong',
              ].join(' ')}
            >
              <span
                className={`block text-sm font-semibold ${active ? tone.text : 'text-fg'}`}
              >
                {l.label}
              </span>
              <span className="mt-0.5 block break-words text-xs leading-5 text-subtle">
                {l.test}
              </span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        {level ? (
          <div className={`border ${TONE_CLASS[level.tone].active} p-4`}>
            <p
              className={`mb-1.5 text-sm font-semibold ${TONE_CLASS[level.tone].text}`}
            >
              {level.verdict}
            </p>
            <p className="measure text-sm leading-6 text-muted">
              {level.detail}
            </p>

            <div className="mt-3.5 border-t border-line pt-3.5">
              {examples.length > 0 ? (
                <>
                  <p className="t-label mb-2 text-subtle">
                    {level.label} in this stage&rsquo;s own plan
                  </p>
                  <ul className="space-y-1">
                    {examples.map((s) => (
                      <li key={s.id} className="break-words text-sm text-muted">
                        {s.label}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted">
                  Nothing in this plan is Large — by the time the slices above
                  reached the list, everything Large had already been broken
                  down. That is the ladder in the next figure, run before the
                  plan existed.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-line p-4">
            <p className="text-sm text-subtle">
              Pick a size to see what it means for scheduling.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

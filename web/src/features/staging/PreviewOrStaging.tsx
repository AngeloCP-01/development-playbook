'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { SCENARIOS, CHOICES, type Answer } from './scenarios'

export function PreviewOrStaging() {
  const [picks, setPicks] = useState<Record<string, Answer>>({})

  function commit(scenarioId: string, answer: Answer) {
    setPicks((prev) =>
      scenarioId in prev ? prev : { ...prev, [scenarioId]: answer },
    )
  }

  const answered = Object.keys(picks).length
  const correct = SCENARIOS.filter((s) => picks[s.id] === s.answer).length

  return (
    <Card>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            Preview deployment or staging environment?
          </p>
          {answered > 0 && (
            <p className="t-label shrink-0" aria-live="polite">
              {`${correct}/${answered} right`}
            </p>
          )}
        </div>

        <ul className="space-y-8">
          {SCENARIOS.map((s) => {
            const done = s.id in picks
            const picked = picks[s.id]
            const right = picked === s.answer

            return (
              <li key={s.id} className="space-y-3">
                <p className="text-sm font-medium">{s.situation}</p>

                <div
                  role="radiogroup"
                  aria-label={s.situation}
                  className="flex flex-wrap gap-2"
                >
                  {CHOICES.map((c) => {
                    const selected = picked === c.id
                    return (
                      <button
                        key={c.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(s.id, c.id)}
                        className={[
                          'inline-flex min-h-11 items-center rounded-md border px-3 py-1.5 text-sm transition-colors lg:min-h-9',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          selected
                            ? right
                              ? 'border-go bg-go/10 text-go'
                              : 'border-danger bg-danger/10 text-danger'
                            : done
                              ? 'cursor-default border-line/40 text-faint opacity-60'
                              : 'border-line hover:border-brand hover:text-brand',
                        ].join(' ')}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>

                {done && (
                  <div
                    aria-live="polite"
                    className="flex items-start gap-2 text-sm"
                  >
                    {right ? (
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-go"
                        aria-hidden
                      />
                    ) : (
                      <X
                        className="mt-0.5 size-4 shrink-0 text-danger"
                        aria-hidden
                      />
                    )}
                    <p>
                      {!right && (
                        <span className="font-medium text-go">
                          {CHOICES.find((c) => c.id === s.answer)!.label}.{' '}
                        </span>
                      )}
                      {s.reasoning}
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}

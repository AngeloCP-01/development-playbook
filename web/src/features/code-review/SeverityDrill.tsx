'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { COMMENTS, SEVERITIES, type Severity } from './severity-drill'

export function SeverityDrill() {
  const [choices, setChoices] = useState<Record<string, Severity>>({})

  function commit(commentId: string, severity: Severity) {
    setChoices((prev) =>
      commentId in prev ? prev : { ...prev, [commentId]: severity },
    )
  }

  const answered = Object.keys(choices).length
  const correct = COMMENTS.filter((c) => choices[c.id] === c.severity).length

  return (
    <Card>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            Classify each review comment by severity
          </p>
          <p className="t-label shrink-0" aria-live="polite">
            {`${correct}/${answered} right`}
          </p>
        </div>

        <ul className="space-y-8">
          {COMMENTS.map((c) => {
            const done = c.id in choices
            const picked = choices[c.id]
            const right = picked === c.severity

            return (
              <li key={c.id} className="space-y-3">
                <p className="italic text-subtle">
                  <InlineCode text={`“${c.comment}”`} />
                </p>

                <div
                  role="radiogroup"
                  aria-label={c.comment}
                  className="flex flex-wrap gap-2"
                >
                  {SEVERITIES.map((s) => {
                    const selected = picked === s.id
                    return (
                      <button
                        key={s.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(c.id, s.id)}
                        className={[
                          'rounded-md border px-3 py-1.5 text-sm transition-colors',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          selected
                            ? right
                              ? 'border-go bg-go/10 text-go'
                              : 'border-danger bg-danger/10 text-danger'
                            : done
                              ? 'cursor-default border-rule/40 text-faint opacity-60'
                              : 'border-rule hover:border-brand hover:text-brand',
                        ].join(' ')}
                      >
                        {s.label}
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
                          {SEVERITIES.find((s) => s.id === c.severity)!.label}
                          .{' '}
                        </span>
                      )}
                      <InlineCode text={c.explanation} />
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

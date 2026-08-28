'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TECHNIQUES, BIASES, type BiasId } from './self-review'

export function SelfReviewMatch() {
  const [choices, setChoices] = useState<Record<string, BiasId>>({})

  function commit(techniqueId: string, biasId: BiasId) {
    setChoices((prev) =>
      techniqueId in prev ? prev : { ...prev, [techniqueId]: biasId },
    )
  }

  const answered = Object.keys(choices).length
  const correct = TECHNIQUES.filter((t) => choices[t.id] === t.bias).length

  return (
    <Card>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            Match each technique to the cognitive bias it defeats
          </p>
          <p className="t-label shrink-0" aria-live="polite">
            {`${correct}/${answered} right`}
          </p>
        </div>

        <ul className="space-y-8">
          {TECHNIQUES.map((t) => {
            const done = t.id in choices
            const picked = choices[t.id]
            const right = picked === t.bias

            return (
              <li key={t.id} className="space-y-3">
                <p className="font-semibold">
                  <InlineCode text={t.title} />
                </p>
                <p className="text-subtle text-sm">
                  <InlineCode text={t.detail} />
                </p>

                <div
                  role="radiogroup"
                  aria-label={t.title}
                  className="flex flex-wrap gap-2"
                >
                  {BIASES.map((b) => {
                    const selected = picked === b.id
                    return (
                      <button
                        key={b.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(t.id, b.id)}
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
                        {b.label}
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
                          {BIASES.find((b) => b.id === t.bias)!.label}.{' '}
                        </span>
                      )}
                      <InlineCode text={t.explanation} />
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

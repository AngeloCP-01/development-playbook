'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { SNIPPETS, CATEGORIES, type Category } from './review-drill'

export function ReviewDrill() {
  const [choices, setChoices] = useState<Record<string, Category>>({})

  function commit(snippetId: string, categoryId: Category) {
    setChoices((prev) =>
      snippetId in prev ? prev : { ...prev, [snippetId]: categoryId },
    )
  }

  const answered = Object.keys(choices).length
  const correct = SNIPPETS.filter((s) => choices[s.id] === s.answer).length

  return (
    <Card>
      <div className="space-y-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            What is the issue in each snippet?
          </p>
          <p className="t-label shrink-0" aria-live="polite">
            {`${correct}/${answered} right`}
          </p>
        </div>

        <ol className="space-y-10">
          {SNIPPETS.map((s) => {
            const done = s.id in choices
            const picked = choices[s.id]
            const right = picked === s.answer

            return (
              <li key={s.id} className="space-y-3">
                <p className="font-semibold">{s.label}</p>
                <pre className="overflow-x-auto rounded-md border border-rule bg-surface-sunken p-4 text-sm">
                  <code>{s.code}</code>
                </pre>

                <div
                  role="radiogroup"
                  aria-label={s.label}
                  className="flex flex-wrap gap-2"
                >
                  {CATEGORIES.map((c) => {
                    const selected = picked === c.id
                    return (
                      <button
                        key={c.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(s.id, c.id)}
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
                          {CATEGORIES.find((c) => c.id === s.answer)!.label}
                          .{' '}
                        </span>
                      )}
                      <InlineCode text={s.explanation} />
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { CUT_FEATURES, scoreCut } from './scoring'

/**
 * Source: docs/02-planning.md, "Cut to the core".
 *
 * Eight candidate features for the invoice tracker. For each, the reader
 * guesses Core or Cut before the verdict shows — the same "does the
 * definition of done fail without this?" test the doc applies at :55-56.
 */

export function CutTable() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const answer = (id: string, guess: boolean) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: guess }))

  const { answered, correct } = scoreCut(answers)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Core or cut?</p>
          <p className="text-sm text-subtle">
            For each feature: does the done statement fail without it?
          </p>
        </div>
        {answered > 0 && (
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className="font-mono text-sm tabular-nums text-muted"
            >
              {correct}/{answered} right
            </span>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-2.5">
        {CUT_FEATURES.map((feature) => {
          const guess = answers[feature.id]
          const done = feature.id in answers
          const right = done && guess === feature.core

          return (
            <li key={feature.id} className="border border-line bg-sunken p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                  {feature.label}
                </p>

                {!done && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => answer(feature.id, false)}
                      className="min-h-11 border border-line bg-raised px-3.5 text-sm font-medium transition-colors duration-150 hover:border-line-strong"
                    >
                      Cut
                    </button>
                    <button
                      type="button"
                      onClick={() => answer(feature.id, true)}
                      className="min-h-11 border border-line bg-raised px-3.5 text-sm font-medium transition-colors duration-150 hover:border-go hover:text-go"
                    >
                      Core
                    </button>
                  </div>
                )}
              </div>

              {done && (
                <div className="mt-3 border-t border-line pt-3">
                  <p
                    className={[
                      'mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                      feature.core ? 'text-go' : 'text-muted',
                    ].join(' ')}
                  >
                    {feature.core ? (
                      <Check className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <X className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {feature.core ? 'Core' : 'Cut'}
                    <span className="font-normal normal-case tracking-normal text-subtle">
                      — you said {guess ? 'core' : 'cut'}
                      {right ? ', correct' : ''}
                    </span>
                  </p>
                  <p className="measure text-sm leading-6 text-muted">
                    {feature.why}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="info" title="The default answer is no">
          Every feature is permanent: it needs maintenance, tests,
          documentation, and it constrains every change after it. Features are
          easy to add and genuinely hard to remove — so the default answer to
          any feature is no.
        </Callout>
      </div>
    </Card>
  )
}

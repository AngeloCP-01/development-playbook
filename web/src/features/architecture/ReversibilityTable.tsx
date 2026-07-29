'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { DECISIONS, REVERSIBILITY_TEST, scoreReversibility } from './scoring'

/**
 * Source: docs/03-architecture.md, "Sort decisions by reversibility".
 *
 * Six decisions from the invoice tracker. For each, the reader judges cheap
 * or expensive to undo before the verdict shows — the guess is the lesson
 * this stage opens on. Modelled on `CutTable` (planning) for the
 * guess-then-reveal shape and locked scoring, with one upgrade the brief
 * calls for: the pair of choices is `role="radio"` inside
 * `role="radiogroup"` rather than two plain buttons.
 *
 * A row's radio pair stays on screen after commit — disabled, with the
 * chosen one marked `aria-checked` — instead of vanishing, so the record of
 * what was picked survives next to the verdict.
 *
 * The `arguable` marker is nested entirely inside the `done` branch below.
 * It cannot render before a row is committed, because there is no path to it
 * that does not pass through that branch — showing it earlier would flag
 * which two rows deserve the most thought, which is exactly the judgment
 * this exercise is testing.
 */

const OPTIONS = [
  { value: false, label: 'Cheap to undo' },
  { value: true, label: 'Expensive to undo' },
] as const

export function ReversibilityTable() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const commit = (id: string, guess: boolean) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: guess }))

  const { answered, correct } = scoreReversibility(answers)

  return (
    <Card>
      <div className="mb-5 border border-line bg-sunken p-4">
        <p className="t-label mb-3 text-subtle">
          The test, applied three times
        </p>
        <ol className="space-y-2.5">
          {REVERSIBILITY_TEST.map((q, i) => (
            <li key={q.id} className="flex gap-3">
              <span
                className="t-data shrink-0 pt-0.5 text-[11px] text-brand"
                aria-hidden
              >
                {`0${i + 1}`}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">
                  {q.question}
                </span>
                <span className="mt-0.5 block text-sm leading-6 text-muted">
                  {q.note}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Cheap or expensive to undo?</p>
          <p className="text-sm text-subtle">
            Judge each decision before its verdict shows.
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
        {DECISIONS.map((decision) => {
          const guess = answers[decision.id]
          const done = decision.id in answers
          const right = done && guess === decision.expensive

          return (
            <li key={decision.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                {decision.label}
              </p>

              <div
                role="radiogroup"
                aria-label={`Is "${decision.label}" cheap or expensive to undo?`}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {OPTIONS.map((opt) => {
                  const checked = done && guess === opt.value
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(decision.id, opt.value)}
                      className={[
                        'min-h-11 min-w-0 border px-3 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                        checked
                          ? 'border-brand bg-brand-tint text-fg'
                          : done
                            ? 'cursor-not-allowed border-line bg-raised text-subtle opacity-60'
                            : 'border-line bg-raised text-muted hover:border-line-strong',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>

              <div aria-live="polite">
                {done && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p
                      className={[
                        'mb-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                        right ? 'text-go' : 'text-danger',
                      ].join(' ')}
                    >
                      {right ? (
                        <Check className="size-3.5 shrink-0" aria-hidden />
                      ) : (
                        <X className="size-3.5 shrink-0" aria-hidden />
                      )}
                      {right ? 'Correct' : 'Not quite'}
                      <span className="font-normal normal-case tracking-normal text-subtle">
                        — {decision.expensive ? 'expensive' : 'cheap'} to undo
                      </span>
                      {decision.arguable && (
                        <span className="border border-line px-1.5 py-0.5 font-normal normal-case tracking-normal text-subtle">
                          arguable
                        </span>
                      )}
                    </p>
                    <p className="text-sm leading-6 text-muted">
                      {decision.undo}
                    </p>
                    <p className="measure mt-1.5 text-sm leading-6 text-muted">
                      {decision.why}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="info" title="Spend your thinking on the expensive list">
          Component library, folder names, which logging call you make — all
          reversible in an afternoon. The data model, the auth strategy, and
          anything writing to a store other things read are not. Deliberating
          over the cheap list is a comfortable way to avoid the hard part.
        </Callout>
      </div>
    </Card>
  )
}

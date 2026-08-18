'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import {
  CONCURRENCY_CASES,
  MECHANISMS,
  scoreConcurrency,
  type MechanismId,
} from './concurrency'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * Guess-then-reveal, in the shape `SplitTrigger` and `ReversibilityTable`
 * established: commit before the verdict shows, `role="radio"` inside a
 * per-case `role="radiogroup"`, the committed answer stays on screen disabled
 * rather than vanishing, the running score is `aria-live="polite"`, and the
 * reasoning shows whichever way the reader answered.
 *
 * Four mechanisms are offered against three cases, and the spare one is
 * `SERIALIZABLE`. That is deliberate: the doc's point is not that a stricter
 * isolation level is a poor choice here, it is that reaching for it feels like
 * having handled the problem. An exercise where every option is right about
 * something cannot catch that.
 *
 * The third case is the one to get wrong. A reader who has just met optimistic
 * locking answers "version column" and is told why two different rows are a
 * different problem.
 */

export function LockingChoice() {
  const [answers, setAnswers] = useState<Record<string, MechanismId>>({})

  const commit = (id: string, guess: MechanismId) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: guess }))

  const { answered, correct } = scoreConcurrency(answers)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            What protects this, and what does not?
          </p>
          <p className="text-sm text-subtle">
            Three races. Pick the mechanism that actually stops each one.
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
        {CONCURRENCY_CASES.map((c) => {
          const guess = answers[c.id]
          const done = c.id in answers
          const right = done && guess === c.answer
          const answerLabel = MECHANISMS.find((m) => m.id === c.answer)?.label

          return (
            <li key={c.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] leading-6 text-fg">
                {c.scenario}
              </p>

              <div
                role="radiogroup"
                aria-label={`What protects this? ${c.scenario}`}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {MECHANISMS.map((m) => {
                  const checked = done && guess === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(c.id, m.id)}
                      className={[
                        'min-h-11 min-w-0 border px-3 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                        checked
                          ? 'border-brand bg-brand-tint text-fg'
                          : done
                            ? 'cursor-not-allowed border-line bg-raised text-subtle'
                            : 'border-line bg-raised text-muted hover:border-line-strong',
                      ].join(' ')}
                    >
                      {m.label}
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
                        — {answerLabel}
                      </span>
                    </p>
                    <p className="measure mt-1.5 text-sm leading-6 text-muted">
                      {c.why}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout
          kind="info"
          title="Locks and constraints answer different questions"
        >
          A lock protects a row against concurrent writes to that row. Any rule
          phrased &ldquo;at most one X per Y&rdquo; is about two rows that never
          touch each other, and no lock can see it. That one needs a constraint,
          which is why the partial unique index came before this step rather
          than after it.
        </Callout>
      </div>
    </Card>
  )
}

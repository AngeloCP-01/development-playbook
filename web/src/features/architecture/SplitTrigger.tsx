'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { SPLIT_CANDIDATES, scoreSplit } from './scoring'

/**
 * Source: docs/03-architecture.md:116-123 and :233-235, the four real
 * triggers for splitting a service out and the two non-reasons that sound
 * like engineering judgment.
 *
 * Same guess-then-reveal shape as `ReversibilityTable`: commit before the
 * verdict shows, `role="radio"` inside a per-row `role="radiogroup"`, the
 * committed pair stays on screen disabled rather than vanishing, and the
 * running score is `aria-live="polite"`. Built second in this stage
 * specifically to match the first rather than invent a variant.
 */

const OPTIONS = [
  { value: true, label: 'A reason to split' },
  { value: false, label: 'Not a reason' },
] as const

export function SplitTrigger() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const commit = (id: string, guess: boolean) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: guess }))

  const { answered, correct } = scoreSplit(answers)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            Is this a reason to split a service out?
          </p>
          <p className="text-sm text-subtle">
            Judge each before its verdict shows.
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
        {SPLIT_CANDIDATES.map((candidate) => {
          const guess = answers[candidate.id]
          const done = candidate.id in answers
          const right = done && guess === candidate.valid

          return (
            <li key={candidate.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                {candidate.label}
              </p>

              <div
                role="radiogroup"
                aria-label={`Is "${candidate.label}" a reason to split a service out?`}
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
                      onClick={() => commit(candidate.id, opt.value)}
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
                        —{' '}
                        {candidate.valid
                          ? 'a real reason to split'
                          : 'not a reason to split'}
                      </span>
                    </p>
                    <p className="measure mt-1.5 text-sm leading-6 text-muted">
                      {candidate.why}
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
          title="Distribution solves problems you do not have yet"
        >
          Four of these are forced by something outside your judgment — a
          platform limit, a runtime, a measurement, someone else&rsquo;s
          compliance rule. The other two are predictions about scale you have
          not hit, and the network failures and distributed debugging they buy
          you arrive today either way.
        </Callout>
      </div>
    </Card>
  )
}

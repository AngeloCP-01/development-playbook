'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { EXPAND_CONTRACT_STEPS } from './evolve'

/**
 * Source: docs/03-architecture.md, "Evolve the schema safely".
 *
 * Guess-then-reveal, in the multi-select shape `AuthzPatterns` established on
 * this branch: `role="checkbox"` inside a `role="group"`, a commit button, and
 * nothing revealed until the reader has committed.
 *
 * The interesting fact about the sequence is not the six steps, it is which two
 * get skipped — 2 and 5, the two that look redundant because a deploy feels
 * like a moment. So the exercise asks for exactly that rather than asking the
 * reader to recite the order, and every step explains itself afterwards whether
 * or not it was picked.
 *
 * No count is enforced on the selection. Requiring "pick two" would give the
 * answer away, and a reader who would skip four steps has said something worth
 * showing them.
 */

export function ExpandContract() {
  const [draft, setDraft] = useState<number[]>([])
  const [committed, setCommitted] = useState<number[] | null>(null)

  const toggle = (n: number) =>
    setDraft((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    )

  const answer = EXPAND_CONTRACT_STEPS.filter((s) => s.commonlySkipped).map(
    (s) => s.n,
  )
  const done = committed !== null
  const right =
    done &&
    committed.length === answer.length &&
    answer.every((n) => committed.includes(n))

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            Which of these would you skip on a rename you had done before?
          </p>
          <p className="text-sm text-subtle">
            Six deploys for one column. Two of them feel redundant.
          </p>
        </div>
        {done && (
          <button
            type="button"
            onClick={() => {
              setCommitted(null)
              setDraft([])
            }}
            className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <ol
        role="group"
        aria-label="Which steps would you skip?"
        className="space-y-2"
      >
        {EXPAND_CONTRACT_STEPS.map((s) => {
          const picked = done ? committed.includes(s.n) : draft.includes(s.n)
          return (
            <li key={s.n} className="border border-line bg-sunken p-3.5">
              <div className="flex flex-wrap items-start gap-3">
                <span className="t-data shrink-0 tabular-nums text-subtle">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg">{s.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-muted">
                    {s.what}
                  </p>
                </div>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={picked}
                  disabled={done}
                  onClick={() => toggle(s.n)}
                  className={[
                    'min-h-11 shrink-0 border px-3 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                    picked
                      ? 'border-brand bg-brand-tint text-fg'
                      : done
                        ? 'cursor-not-allowed border-line bg-raised text-subtle opacity-60'
                        : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  I&rsquo;d skip it
                </button>
              </div>

              {done && (
                <div className="mt-3 border-t border-line pt-3">
                  {s.commonlySkipped && (
                    <p className="t-label mb-1.5 inline-block border border-warn px-1.5 py-0.5 text-warn">
                      One of the two
                    </p>
                  )}
                  <p className="measure text-sm leading-6 text-muted">
                    {s.ifSkipped}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {!done && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setCommitted(draft)}
            className="min-h-11 border border-brand bg-brand px-4 text-sm font-medium text-brand-fg transition-opacity duration-150 hover:opacity-90 lg:min-h-9"
          >
            Commit
          </button>
          <span className="text-sm text-subtle" aria-live="polite">
            {draft.length === 0
              ? 'Or commit having skipped none.'
              : `${draft.length} selected.`}
          </span>
        </div>
      )}

      <div aria-live="polite">
        {done && (
          <div className="mt-4">
            <p
              className={[
                'mb-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                right ? 'text-go' : 'text-danger',
              ].join(' ')}
            >
              {right ? (
                <Check className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <X className="size-3.5 shrink-0" aria-hidden />
              )}
              {right ? 'Exactly the two' : 'The two are 2 and 5'}
            </p>
            <Callout
              kind="warn"
              title="Never ship a destructive migration with the code that needs it"
            >
              If a deploy goes wrong you want the fix to be a code rollback, and
              a dropped column is not something you can roll back. Steps 2 and 5
              are the ones people skip because they feel redundant, and skipping
              them is exactly what turns a rename into an outage — between
              deploying code that reads the new column and running the migration
              that fills it, there is a window, and in production that window
              has traffic in it.
            </Callout>
          </div>
        )}
      </div>
    </Card>
  )
}

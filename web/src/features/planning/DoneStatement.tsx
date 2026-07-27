'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * Source: docs/02-planning.md, "Define done before defining work".
 *
 * Three candidate done statements. Only one is checkable — a state you could
 * point at running software and confirm. The other two feel like definitions
 * of done but are not: one names a feature list with no edge, one names a
 * feeling nobody can look up. The reader picks before any of that is said.
 */

type Candidate = {
  id: string
  text: string
  checkable: boolean
  why: string
}

const CANDIDATES: Candidate[] = [
  {
    id: 'finished',
    text: 'The invoice app is finished.',
    checkable: false,
    why: '“Finished” names a feature list, not an edge. Nothing here says what a new request falls outside of, so every request stays arguable.',
  },
  {
    id: 'happy',
    text: 'Users are happy with it.',
    checkable: false,
    why: 'A feeling, not a fact. Happiness moves with mood and cannot be checked against the running product — only guessed at, usually flatteringly.',
  },
  {
    id: 'invoice-flow',
    text: 'A freelancer can add a client, issue an invoice, and see at a glance which invoices are overdue.',
    checkable: true,
    why: 'Names a state you can hold the product up against and confirm, yes or no. That is what makes it a boundary a feature request can be judged by.',
  },
]

export function DoneStatement() {
  const [picked, setPicked] = useState<number | null>(null)

  const pick = (i: number) => setPicked((prev) => (prev === null ? i : prev))
  const done = picked !== null
  const reset = () => setPicked(null)
  const gotIt = done && CANDIDATES[picked].checkable

  return (
    <Card>
      <p className="mb-1 text-sm font-medium">
        Which of these is a definition of done?
      </p>
      <p className="mb-4 text-sm text-subtle">
        Pick before you read why. Guessing is the exercise.
      </p>

      <div
        role="radiogroup"
        aria-label="Candidate done statements"
        className="space-y-2.5"
      >
        {CANDIDATES.map((c, i) => {
          const isPicked = picked === i
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={done}
              onClick={() => pick(i)}
              className={[
                'min-h-11 w-full border px-4 py-3 text-left text-sm leading-6 transition-colors duration-150',
                done
                  ? isPicked
                    ? 'border-brand bg-brand-tint text-fg'
                    : 'border-line bg-sunken text-muted'
                  : 'border-line bg-raised hover:border-line-strong',
              ].join(' ')}
            >
              &ldquo;{c.text}&rdquo;
              {isPicked && (
                <span className="t-label ml-2 text-brand">your pick</span>
              )}
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        {done && (
          <div className="space-y-2.5">
            <p
              className={[
                'flex items-center gap-1.5 text-sm font-semibold',
                gotIt ? 'text-go' : 'text-danger',
              ].join(' ')}
            >
              {gotIt ? (
                <Check className="size-4 shrink-0" aria-hidden />
              ) : (
                <X className="size-4 shrink-0" aria-hidden />
              )}
              {gotIt
                ? 'Right — that is the checkable one'
                : 'Not that one — see which is checkable below'}
            </p>

            <ul className="space-y-2">
              {CANDIDATES.map((c) => (
                <li key={c.id} className="border border-line bg-sunken p-3.5">
                  <p
                    className={[
                      'mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                      c.checkable ? 'text-go' : 'text-danger',
                    ].join(' ')}
                  >
                    {c.checkable ? (
                      <Check className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <X className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {c.checkable ? 'Checkable' : 'Not checkable'}
                  </p>
                  <p className="measure text-sm leading-6 text-muted">
                    {c.why}
                  </p>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={reset}
              className="flex min-h-11 items-center gap-1.5 border border-line px-3 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Try again
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

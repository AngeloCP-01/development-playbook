'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { CASES } from './teeth'

/**
 * Three tests, each with the evidence someone offered that it bites. The
 * reader judges whether that evidence actually proves anything, then locks
 * in a verdict per row. Guess-then-reveal per `PATTERNS.md` — the answer
 * locks before the verdict shows, and the set is scored, because a revealed
 * answer the reader did not commit to teaches nothing.
 *
 * Structural reference: `AuthorizationDrill` (stage 04) — a binary
 * radiogroup, two `role="radio"` buttons per row, scored across the set,
 * locked on commit. This drill asks "proven" / "not proven" instead of
 * "safe" / "unsafe".
 *
 * Each row's code block gets its own `overflow-x-auto` container with
 * `tabIndex={0}` and `data-teeth-code`: code does not reflow the way prose
 * does, and a keyboard user without a trackpad still has to be able to reach
 * the scroll.
 */
export function TeethCheck() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const commit = (id: string, saidProven: boolean) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: saidProven }))

  const answeredIds = Object.keys(answers)
  const correctCount = answeredIds.filter((id) => {
    const c = CASES.find((c) => c.id === id)
    return c !== undefined && answers[id] === c.proven
  }).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Does the evidence prove it?</p>
          <p className="text-sm text-subtle">
            Three tests, each with the evidence its author offered that it
            bites. Commit before the verdict shows.
          </p>
        </div>
        <span
          aria-live="polite"
          className="font-mono text-sm tabular-nums text-muted"
        >
          {correctCount}/{answeredIds.length} right
        </span>
      </div>

      <ul className="space-y-3">
        {CASES.map((c) => {
          const done = c.id in answers
          const saidProven = answers[c.id]
          const correct = done && saidProven === c.proven

          return (
            <li
              key={c.id}
              data-case={c.id}
              className="border border-line bg-sunken p-4"
            >
              <p className="mb-2 text-[15px] font-medium leading-6 text-fg">
                {c.title}
              </p>

              <div
                className="overflow-x-auto border border-line bg-raised p-3"
                tabIndex={0}
                data-teeth-code
              >
                <pre className="t-data whitespace-pre text-[13px] leading-6">
                  {c.code}
                </pre>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted">
                <span className="t-label text-subtle">
                  What the author reported:{' '}
                </span>
                {c.evidence}
              </p>

              <div
                role="radiogroup"
                aria-label={`${c.title}: does this evidence prove the test bites?`}
                className="mt-3 grid grid-cols-2 gap-2"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={done && saidProven === true}
                  disabled={done}
                  onClick={() => commit(c.id, true)}
                  className={[
                    'min-h-11 border px-3 py-2 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                    done && saidProven === true
                      ? 'border-brand bg-brand-tint text-fg'
                      : done
                        ? 'cursor-not-allowed border-line bg-raised text-subtle'
                        : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  Proven
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={done && saidProven === false}
                  disabled={done}
                  onClick={() => commit(c.id, false)}
                  className={[
                    'min-h-11 border px-3 py-2 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                    done && saidProven === false
                      ? 'border-brand bg-brand-tint text-fg'
                      : done
                        ? 'cursor-not-allowed border-line bg-raised text-subtle'
                        : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  Not proven
                </button>
              </div>

              <div aria-live="polite">
                {done && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p
                      className={[
                        'mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                        correct ? 'text-go' : 'text-danger',
                      ].join(' ')}
                    >
                      {correct ? (
                        <Check className="size-3.5 shrink-0" aria-hidden />
                      ) : (
                        <X className="size-3.5 shrink-0" aria-hidden />
                      )}
                      {correct ? 'Right' : 'Not quite'}
                    </p>
                    <p className="text-sm leading-6 text-muted">{c.verdict}</p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="warn" title="Two of these three read as passes">
          That is what makes the teeth check worth doing rather than assuming: a
          test that has never been red and a test that cannot be red produce the
          same terminal output, and the only difference is whether anyone
          looked.
        </Callout>
      </div>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { CHANGES, OPTIONS } from './triage'

/**
 * The stage's central exercise: six changes, sorted by the doc's own question —
 * "if this breaks, how will I find out?"
 *
 * Guess-then-reveal per `PATTERNS.md`: the answer locks before the verdict
 * shows, and the set is scored, because a revealed answer the reader did not
 * commit to teaches nothing.
 *
 * Structural reference: `DeployBlockers` (stage 04), which this clones one
 * subject over. Two differences. The option set is module-level rather than
 * per-row, because every change offers all four tiers. And two of the six
 * correct answers are "nothing" — so `go` marks a correct refusal exactly as it
 * marks a correct test, and nothing nudges the reader toward writing one.
 *
 * `brand` is never a verdict here. It means attention; `go` and `danger` carry
 * the meaning.
 */
function plain(text: string): string {
  return text.replace(/`/g, '')
}

export function TriageDrill() {
  const [choices, setChoices] = useState<Record<string, string>>({})

  // Two locks, and `disabled` on the buttons is the one that holds in
  // practice — a teeth check confirmed the render test stays green with this
  // guard alone. `commit`'s guard is here for the paths that do not go
  // through a pointer press on an enabled button, since scoring a second
  // guess scores hindsight.
  const commit = (id: string, optionId: string) =>
    setChoices((prev) => (id in prev ? prev : { ...prev, [id]: optionId }))

  const answered = Object.keys(choices).length
  const correct = CHANGES.filter((c) => choices[c.id] === c.answer).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            What does this change need — and at which layer?
          </p>
          <p className="text-sm text-subtle">
            Every change below offers the same four tiers. Commit before the
            verdict shows.
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
              onClick={() => setChoices({})}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-2.5">
        {CHANGES.map((c) => {
          const choice = choices[c.id]
          const done = c.id in choices
          const right = done && choice === c.answer
          const tier = OPTIONS.find((o) => o.id === c.answer)

          return (
            <li key={c.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                <InlineCode text={c.change} />
              </p>

              <div
                role="radiogroup"
                aria-label={plain(c.change)}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {OPTIONS.map((opt) => {
                  const checked = done && choice === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(c.id, opt.id)}
                      className={[
                        'min-h-11 min-w-0 break-words border px-3 py-2 text-left text-sm font-medium transition-colors duration-150',
                        checked
                          ? 'border-brand bg-brand-tint text-fg'
                          : done
                            ? 'cursor-not-allowed border-line bg-raised text-subtle'
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
                      {tier && (
                        <span className="font-normal normal-case tracking-normal text-subtle">
                          — needs &ldquo;{tier.label}&rdquo;
                        </span>
                      )}
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      <InlineCode text={c.explanation} />
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="warn" title="Two of these six need no test at all">
          That is the point of asking the question rather than counting
          coverage: a percentage target is satisfied by whatever is easiest to
          test, and the two changes here that need nothing are also the two
          easiest to write a test for.
        </Callout>
      </div>
    </Card>
  )
}

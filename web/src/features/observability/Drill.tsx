// web/src/features/observability/Drill.tsx
'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Guess-then-reveal, parameterised. Stage 06's `TriageDrill` with the
 * question, options and rows lifted to props, because this stage carries
 * four of them (alert triage, log level, silence, scrubber) and one
 * component with four datasets beats four copies of one component.
 *
 * Per `PATTERNS.md`: the answer locks before the verdict shows, and the set
 * is scored, because a revealed answer the reader did not commit to teaches
 * nothing. The options grid is two columns up to five options, so the
 * five-level log drill and the two-option drills share one layout.
 *
 * `brand` is never a verdict here. It means attention; `go` and `danger`
 * carry the meaning.
 */
function plain(text: string): string {
  return text.replace(/`/g, '')
}

export function Drill({
  idPrefix,
  question,
  subtitle,
  options,
  rows,
}: {
  idPrefix: string
  question: string
  subtitle: string
  options: DrillOption[]
  rows: DrillRow[]
}) {
  const [choices, setChoices] = useState<Record<string, string>>({})

  // Two locks, and `disabled` on the buttons is the one that holds in
  // practice — stage 06's teeth check confirmed the render test stays green
  // with this guard alone. `commit`'s guard is here for the paths that do not
  // go through a pointer press on an enabled button, since scoring a second
  // guess scores hindsight.
  const commit = (id: string, optionId: string) =>
    setChoices((prev) => (id in prev ? prev : { ...prev, [id]: optionId }))

  const answered = Object.keys(choices).length
  const correct = rows.filter((r) => choices[r.id] === r.answer).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            <InlineCode text={question} />
          </p>
          <p className="text-sm text-subtle">
            <InlineCode text={subtitle} />
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
        {rows.map((r) => {
          const choice = choices[r.id]
          const done = r.id in choices
          const right = done && choice === r.answer
          const expected = options.find((o) => o.id === r.answer)

          return (
            <li
              key={r.id}
              id={`${idPrefix}-${r.id}`}
              className="border border-line bg-sunken p-4"
            >
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                <InlineCode text={r.prompt} />
              </p>

              <div
                role="radiogroup"
                aria-label={plain(r.prompt)}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {options.map((opt) => {
                  const checked = done && choice === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(r.id, opt.id)}
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
                      {!right && expected && (
                        <span className="font-normal normal-case tracking-normal text-subtle">
                          — it is &ldquo;{expected.label}&rdquo;
                        </span>
                      )}
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      <InlineCode text={r.why} />
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

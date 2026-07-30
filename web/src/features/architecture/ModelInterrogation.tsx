'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { INTERROGATIONS, judgeInterrogation } from './scoring'

/**
 * Source: docs/03-architecture.md, "Model the domain first", the five questions the doc puts to the
 * invoice domain once it has been written down as nouns.
 *
 * The guess-then-reveal shape is `QuestionLab` (discovery) by way of
 * `ReversibilityTable` in this same stage: the pair of options is
 * `role="radio"` inside `role="radiogroup"`, the answer locks on selection,
 * and the committed pair stays on screen disabled so the record of what was
 * picked sits next to the verdict.
 *
 * The `why` renders whichever way the reader answered. `judgeInterrogation`
 * returns it unconditionally and a test in `scoring.test.ts` holds it to that;
 * gating it on `correct` here would quietly undo that, and would leave the
 * reasoning visible only to the readers who already had it.
 *
 * Nothing here persists. This exercise is about the doc's domain, which has
 * defensible answers worth scoring — the reader's own domain is the worksheet
 * below, and that one is free text precisely because it cannot be scored.
 */

export function ModelInterrogation() {
  const [choices, setChoices] = useState<Record<string, string>>({})

  const commit = (id: string, optionId: string) =>
    setChoices((prev) => (id in prev ? prev : { ...prev, [id]: optionId }))

  const answered = Object.keys(choices).length
  const correct = Object.entries(choices).filter(
    ([id, choice]) => judgeInterrogation(id, choice).correct,
  ).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Interrogate the model</p>
          <p className="text-sm text-subtle">
            Five questions that surface design errors while they are still
            cheap. Commit before the reasoning shows.
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
        {INTERROGATIONS.map((q) => {
          const choice = choices[q.id]
          const done = q.id in choices
          const verdict = done ? judgeInterrogation(q.id, choice) : null
          const defensible = q.options.find((o) => o.id === q.answer)

          return (
            <li key={q.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                {q.question}
              </p>

              <div
                role="radiogroup"
                aria-label={q.question}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {q.options.map((opt) => {
                  const checked = done && choice === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(q.id, opt.id)}
                      className={[
                        'min-h-11 min-w-0 break-words border px-3 py-2 text-left text-sm font-medium transition-colors duration-150',
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
                {verdict && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p
                      className={[
                        'mb-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                        verdict.correct ? 'text-go' : 'text-danger',
                      ].join(' ')}
                    >
                      {verdict.correct ? (
                        <Check className="size-3.5 shrink-0" aria-hidden />
                      ) : (
                        <X className="size-3.5 shrink-0" aria-hidden />
                      )}
                      {verdict.correct ? 'Correct' : 'Not quite'}
                      {defensible && (
                        <span className="font-normal normal-case tracking-normal text-subtle">
                          — the defensible answer is &ldquo;{defensible.label}
                          &rdquo;
                        </span>
                      )}
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      {verdict.why}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="info" title="Then encode the answers as constraints">
          Every answer above is a rule about data, and application code is a
          weak place to keep one: it has bugs, scripts bypass it, and it races
          with itself. A <code className="t-data text-[13px]">CHECK</code>, a{' '}
          <code className="t-data text-[13px]">UNIQUE</code>, an{' '}
          <code className="t-data text-[13px]">ON DELETE RESTRICT</code> — the
          database is the last line that actually holds.
        </Callout>
      </div>
    </Card>
  )
}

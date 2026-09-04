'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { SNIPPETS } from './snippets'

/**
 * The stage's central exercise: six snippets, both verbs (reads and writes),
 * marked safe or unsafe one row at a time. Guess-then-reveal per
 * `PATTERNS.md` — the answer locks before the verdict shows, and the whole
 * set is scored, because a revealed answer the reader did not commit to
 * teaches nothing.
 *
 * Structural reference: `DeployBlockers` (stage 04) for the same shape one
 * level up — commit-then-lock per row, a running score, `go`/`danger` never
 * `brand`. This drill is a binary radiogroup (safe/unsafe) rather than
 * `DeployBlockers`' four-option one, so each row carries two `role="radio"`
 * buttons instead of a grid.
 *
 * Each row's code block gets its own `overflow-x-auto` container with
 * `tabIndex={0}`: `button-caller` shows two files and does not fit in a
 * viewport, and code does not reflow the way prose does — a keyboard user
 * without a trackpad still has to be able to reach the scroll.
 */
export function AuthorizationDrill() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const commit = (id: string, choseSafe: boolean) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: choseSafe }))

  const answeredIds = Object.keys(answers)
  const correctCount = answeredIds.filter((id) => {
    const snippet = SNIPPETS.find((s) => s.id === id)
    return snippet !== undefined && answers[id] === snippet.safe
  }).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Safe, or unsafe?</p>
          <p className="text-sm text-subtle">
            Six snippets, both reads and writes. Commit before the verdict
            shows.
          </p>
        </div>
        <span
          data-score={`${correctCount}/${answeredIds.length}`}
          aria-live="polite"
          className="font-mono text-sm tabular-nums text-muted"
        >
          {correctCount}/{answeredIds.length} right
        </span>
      </div>

      <ul className="space-y-3">
        {SNIPPETS.map((snippet) => {
          const done = snippet.id in answers
          const chose = answers[snippet.id]
          const correct = done && chose === snippet.safe

          return (
            <li
              key={snippet.id}
              data-snippet={snippet.id}
              className="border border-line bg-sunken p-4"
            >
              <p className="mb-2 text-[15px] font-medium leading-6 text-fg">
                {snippet.label}
              </p>

              <div
                className="overflow-x-auto border border-line bg-raised p-3"
                tabIndex={0}
              >
                <pre className="t-data whitespace-pre text-[13px] leading-6">
                  {snippet.code}
                </pre>
              </div>

              <div
                role="radiogroup"
                aria-label={`${snippet.label}: safe or unsafe?`}
                className="mt-3 grid grid-cols-2 gap-2"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={done && chose === true}
                  disabled={done}
                  data-answer={`${snippet.id}-safe`}
                  onClick={() => commit(snippet.id, true)}
                  className={[
                    'min-h-11 border px-3 py-2 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                    done && chose === true
                      ? 'border-brand bg-brand-tint text-fg'
                      : done
                        ? 'cursor-not-allowed border-line bg-raised text-subtle'
                        : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  Safe
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={done && chose === false}
                  disabled={done}
                  data-answer={`${snippet.id}-unsafe`}
                  onClick={() => commit(snippet.id, false)}
                  className={[
                    'min-h-11 border px-3 py-2 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                    done && chose === false
                      ? 'border-brand bg-brand-tint text-fg'
                      : done
                        ? 'cursor-not-allowed border-line bg-raised text-subtle'
                        : 'border-line bg-raised text-muted hover:border-line-strong',
                  ].join(' ')}
                >
                  Unsafe
                </button>
              </div>

              <div aria-live="polite">
                {done && (
                  <div
                    data-verdict={snippet.id}
                    data-correct={String(correct)}
                    role="note"
                    className="mt-3 border-t border-line pt-3"
                  >
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
                    <p className="text-sm leading-6 text-muted">
                      {snippet.verdict}
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

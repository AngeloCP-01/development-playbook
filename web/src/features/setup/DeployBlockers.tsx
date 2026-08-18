'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { BLOCKERS } from './blockers'

/**
 * Source: docs/04-project-setup.md §8, the four failures that blocked this
 * playbook's own first deploy.
 *
 * Guess-then-reveal, in the shape `ModelInterrogation` and `LockingChoice`
 * settled on rather than a second one invented here: `role="radio"` inside a
 * per-blocker `role="radiogroup"`, the answer locks on selection, the committed
 * option stays on screen disabled so the record of what was picked sits beside
 * the verdict, and the reasoning renders whichever way the reader answered.
 *
 * `ExpandContract`'s `role="group"` is the *multi-select* half of that family —
 * several boxes and a Commit button. One cause per symptom is a single choice,
 * so the group here is a `radiogroup`; that is also what the audit suite's
 * `[role=radio]` sweep already covers.
 *
 * Every blocker offers the same four causes on purpose (`blockers.ts`), so the
 * reader has to read the symptom rather than recognise the shape of the option
 * list. The score is over the whole set: a reader who arrives at `wrong-repo`
 * by elimination still had to commit to the other three first.
 */

/**
 * The same string with its code markers removed, for an `aria-label`.
 *
 * `InlineCode` handles what is seen; an accessible name is a plain string and
 * cannot hold elements, so a symptom used as a radiogroup's label would
 * otherwise be announced with its backticks read out.
 */
function plain(text: string): string {
  return text.replace(/`/g, '')
}

/**
 * A locked option keeps `text-subtle` and no opacity. Composited, the
 * `opacity-60` this used to carry measures 2.62:1 in light and 3.21:1 in dark on
 * 13px text, against a 4.5:1 requirement — found by the whole-branch review,
 * which measured the state the audit never visits because it only ever loads a
 * panel's default. These options are content the reader is meant to re-read
 * beside the verdict, not unavailable controls.
 *
 * Stage 03 carried the same pairing in seven exercises (TD-41) and they are
 * fixed too, so the idiom is gone from the repo rather than diverging here.
 */
export function DeployBlockers() {
  const [choices, setChoices] = useState<Record<string, string>>({})

  // Two locks, and `disabled` on the buttons is the one that holds in practice
  // — a teeth-check confirmed the render test stays green with this guard
  // deleted. It is here for the paths that do not go through a pointer press on
  // an enabled button, since scoring a second guess scores hindsight.
  const commit = (id: string, optionId: string) =>
    setChoices((prev) => (id in prev ? prev : { ...prev, [id]: optionId }))

  const answered = Object.keys(choices).length
  const correct = BLOCKERS.filter((b) => choices[b.id] === b.answer).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Which setting broke the deploy?</p>
          <p className="text-sm text-subtle">
            Every symptom below stopped a real first deploy, and they all offer
            the same four causes. Commit before the verdict shows.
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
        {BLOCKERS.map((b) => {
          const choice = choices[b.id]
          const done = b.id in choices
          const right = done && choice === b.answer
          const cause = b.options.find((o) => o.id === b.answer)

          return (
            <li key={b.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                <InlineCode text={b.symptom} />
              </p>

              <div
                role="radiogroup"
                aria-label={plain(b.symptom)}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {b.options.map((opt) => {
                  const checked = done && choice === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(b.id, opt.id)}
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
                      {cause && (
                        <span className="font-normal normal-case tracking-normal text-subtle">
                          — the cause is &ldquo;{cause.label}&rdquo;
                        </span>
                      )}
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      <InlineCode text={b.explanation} />
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="warn" title="One of them has no error message">
          Three of these announce themselves and mislead you about where to
          look. The fourth is a list of green builds, which is why it is the one
          to check first: a deployment log tells you a build succeeded, never
          which repository it succeeded on.
        </Callout>
      </div>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { PIN_RULE, PIN_TARGETS } from './pins'

/**
 * Source: docs/04-project-setup.md, §1 "Scaffold" — the two files that pin Node
 * and the three environments that read one, both or neither.
 *
 * Structural reference: `HorizonTriage` (planning) for the per-item radiogroup
 * with its own verdict panel underneath; `ExpandContract` (architecture) for
 * committing before the reveal.
 *
 * Every environment is offered every file, which is the whole design. TD-28 was
 * a mis-pairing — the doc told the reader to check the host against `.nvmrc`,
 * which the host does not read — so an exercise that only offered plausible
 * answers per row would let a reader score three out of three without ever
 * being able to make the mistake the section exists to prevent. The wrong
 * answer has to be one click away.
 *
 * A row locks the moment it is answered. The verdict and the reason appear
 * together, so an unlocked row would let the reader re-answer knowing the
 * answer, and the score would then measure reading rather than judgment.
 *
 * `PIN_RULE` is held back until all three are done. It is the generalisation
 * the three pairings exist to produce, and printed above them it is a caption
 * that makes the exercise redundant.
 */

/**
 * The data quotes code inline with markdown backticks, because `pins.ts` is
 * held against the doc's own prose character-for-character. Rendering it raw
 * would print the backticks, so odd-indexed splits become `<code>`.
 */

const OPTIONS = PIN_TARGETS.map((t) => t.reads)

/**
 * The corrected answer is stated inside the panel, not only marked on the
 * option, because the option markers sit under an `aria-label` and are
 * therefore invisible to a screen reader. This panel is inside the row's
 * `aria-live` region, so the sentence is what a non-sighted reader actually
 * receives.
 */
function Verdict({
  correct,
  why,
  reads,
}: {
  correct: boolean
  why: string
  reads: string
}) {
  return (
    <div
      className={[
        'mt-3 border p-3',
        correct ? 'border-go bg-go-tint' : 'border-danger bg-danger-tint',
      ].join(' ')}
    >
      <p
        className={[
          't-label mb-1.5 flex items-center gap-1.5',
          correct ? 'text-go' : 'text-danger',
        ].join(' ')}
      >
        {correct ? (
          <Check className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <X className="size-3.5 shrink-0" aria-hidden />
        )}
        {correct ? 'Paired' : 'Mis-paired'}
      </p>
      {!correct && (
        <p className="mb-1.5 min-w-0 break-words text-sm leading-6 text-fg">
          It reads <code className="t-data text-[0.9em]">{reads}</code>.
        </p>
      )}
      <p className="min-w-0 break-words text-sm leading-6 text-muted">
        <InlineCode text={why} />
      </p>
    </div>
  )
}

export function PinExercise() {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const answered = PIN_TARGETS.filter((t) => answers[t.id] !== undefined)
  const right = PIN_TARGETS.filter((t) => answers[t.id] === t.reads)
  const complete = answered.length === PIN_TARGETS.length

  return (
    <Card>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">
            Three environments run this code. Which file does each one read?
          </p>
          <p className="mt-0.5 text-sm text-subtle">
            The same three files are on offer every time. Each answer locks when
            you give it.
          </p>
        </div>
        {answered.length > 0 && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="flex min-h-11 shrink-0 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset
          </button>
        )}
      </div>

      <div role="list" className="space-y-3">
        {PIN_TARGETS.map((target) => {
          const choice = answers[target.id]
          const locked = choice !== undefined

          return (
            <div
              role="listitem"
              key={target.id}
              data-pin={target.id}
              className="border border-line bg-sunken p-4"
            >
              <p className="mb-3 min-w-0 break-words text-sm text-fg">
                {target.environment}
              </p>

              <div
                role="radiogroup"
                aria-label={`Which file does ${target.environment} read?`}
                className="grid gap-2 sm:grid-cols-3"
              >
                {OPTIONS.map((option) => {
                  const picked = choice === option
                  const isAnswer = option === target.reads
                  const tone = !locked
                    ? 'border-line bg-raised text-muted hover:border-line-strong'
                    : isAnswer
                      ? 'border-go bg-go-tint text-go'
                      : picked
                        ? 'border-danger bg-danger-tint text-danger'
                        : 'border-line bg-raised text-subtle'

                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={picked}
                      aria-label={option}
                      disabled={locked}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [target.id]: option }))
                      }
                      className={[
                        'flex min-h-11 min-w-0 flex-col items-start justify-center gap-1 border px-2.5 py-2 text-left transition-colors duration-150',
                        locked ? 'cursor-not-allowed' : '',
                        tone,
                      ].join(' ')}
                    >
                      <span className="t-data w-full break-words text-[13px] leading-5">
                        {option}
                      </span>
                      {locked && (isAnswer || picked) && (
                        <span className="t-label">
                          {isAnswer
                            ? picked
                              ? 'Your answer — correct'
                              : 'The answer'
                            : 'Your answer'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div aria-live="polite">
                {locked && (
                  <>
                    <Verdict
                      correct={choice === target.reads}
                      why={target.why}
                      reads={target.reads}
                    />
                    <p className="mt-2 text-sm leading-6 text-subtle">
                      <span className="t-label mr-2 text-subtle">
                        Usually answered
                      </span>
                      <InlineCode text={target.mistake} />
                    </p>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-subtle" aria-live="polite">
        {right.length}/{PIN_TARGETS.length} paired correctly
      </p>

      <div aria-live="polite">
        {complete && (
          <div className="mt-3 border border-line bg-raised p-4">
            <p className="t-label mb-1.5 text-brand">
              The rule that generalises
            </p>
            <p className="text-sm leading-6 text-fg">{PIN_RULE}</p>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              Two files, three environments, and no file that reaches all of
              them. The version of this that survives a new host is the
              question, not the answer.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

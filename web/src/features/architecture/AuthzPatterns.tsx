'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Callout, Card } from '@/components/ui'
import { AUTHZ_PATTERNS, AUTHZ_SCENARIOS, scoreAuthz } from './contracts'

/**
 * Source: docs/03-architecture.md, "Authentication and authorization".
 *
 * Step 07's single committed exercise, per D-49. Structurally this is
 * `ReversibilityTable` with three options instead of two: commit before the
 * verdict, the chosen option stays on screen disabled rather than vanishing,
 * and the reasoning shows whichever way it went.
 *
 * The patterns are listed above the exercise on purpose. This is not a recall
 * test — the reader has never seen these three before — it is a test of
 * matching a situation to a pattern, which is the skill the section is about.
 *
 * Two of the four answers are ownership, which is the honest ratio and also
 * the trap: a reader who notices the pattern repeating and answers ownership
 * for all four gets the manager scenario wrong, which is precisely the failure
 * the doc describes as working correctly for the person who built it.
 *
 * One scenario needs TWO patterns, because the doc's section teaches that they
 * compose — role alone is true of every manager in the company, including one
 * who manages a different team, and the partial rule does not error, it grants.
 * Those scenarios render as a checkbox group with an explicit commit, because a
 * radiogroup cannot express a conjunction and letting the first click commit
 * would make the right answer unreachable.
 */

export function AuthzPatterns() {
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [drafts, setDrafts] = useState<Record<string, string[]>>({})

  const commit = (id: string, choice: string[]) =>
    setAnswers((prev) => (id in prev ? prev : { ...prev, [id]: choice }))

  /** Toggle one pattern in a multi-answer scenario's uncommitted selection. */
  const toggleDraft = (id: string, patternId: string) =>
    setDrafts((prev) => {
      const current = prev[id] ?? []
      return {
        ...prev,
        [id]: current.includes(patternId)
          ? current.filter((p) => p !== patternId)
          : [...current, patternId],
      }
    })

  const { answered, correct } = scoreAuthz(answers)

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Which pattern applies?</p>
          <p className="text-sm text-subtle">
            Commit to each before its verdict shows.
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
              onClick={() => {
                setAnswers({})
                // Drafts too: a multi-answer scenario whose selection was never
                // committed keeps it here, and leaving it behind ticks boxes in
                // a group that has just told the reader it is unanswered.
                setDrafts({})
              }}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          </div>
        )}
      </div>

      <ul className="mb-5 space-y-2">
        {AUTHZ_PATTERNS.map((p) => (
          <li key={p.id} className="border border-line bg-sunken px-3.5 py-2.5">
            <p className="text-sm font-medium text-fg">{p.name}</p>
            <p className="mt-0.5 text-sm leading-6 text-muted">{p.question}</p>
            <p className="mt-0.5 text-sm leading-6 text-subtle">
              Holds for: {p.holdsFor}
            </p>
          </li>
        ))}
      </ul>

      <ul className="space-y-2.5">
        {AUTHZ_SCENARIOS.map((scenario) => {
          const needed = scenario.answer.length
          const multi = needed > 1
          const draft = drafts[scenario.id] ?? []
          const choice = answers[scenario.id] ?? (multi ? draft : [])
          const done = scenario.id in answers
          const right =
            done &&
            choice.length === scenario.answer.length &&
            scenario.answer.every((a) => choice.includes(a))

          return (
            <li key={scenario.id} className="border border-line bg-sunken p-4">
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                {scenario.scenario}
              </p>

              <div
                role={multi ? 'group' : 'radiogroup'}
                aria-label={
                  multi
                    ? `Select both patterns that must hold for: ${scenario.scenario}`
                    : `Which pattern applies to: ${scenario.scenario}?`
                }
                className="grid grid-cols-1 gap-2 sm:grid-cols-3"
              >
                {AUTHZ_PATTERNS.map((p) => {
                  const checked = choice.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role={multi ? 'checkbox' : 'radio'}
                      aria-checked={checked}
                      disabled={done}
                      onClick={() =>
                        multi
                          ? toggleDraft(scenario.id, p.id)
                          : commit(scenario.id, [p.id])
                      }
                      className={[
                        'min-h-11 min-w-0 border px-3 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                        checked
                          ? 'border-brand bg-brand-tint text-fg'
                          : done
                            ? 'cursor-not-allowed border-line bg-raised text-subtle'
                            : 'border-line bg-raised text-muted hover:border-line-strong',
                      ].join(' ')}
                    >
                      {p.name}
                    </button>
                  )
                })}
              </div>

              {multi && !done && (
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={draft.length !== needed}
                    onClick={() => commit(scenario.id, draft)}
                    className={[
                      'min-h-11 border px-4 text-sm font-medium transition-colors duration-150 lg:min-h-9',
                      draft.length === needed
                        ? 'border-brand bg-brand text-brand-fg hover:opacity-90'
                        : 'cursor-not-allowed border-line bg-raised text-subtle',
                    ].join(' ')}
                  >
                    Commit
                  </button>
                  <span className="text-sm text-subtle" aria-live="polite">
                    {draft.length === needed
                      ? 'Both selected.'
                      : `This one needs ${needed}. ${draft.length} selected.`}
                  </span>
                </div>
              )}

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
                        {scenario.answer
                          .map(
                            (a) =>
                              AUTHZ_PATTERNS.find((p) => p.id === a)?.name ?? a,
                          )
                          .join(' and ')}
                      </span>
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      {scenario.why}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-4">
        <Callout kind="info" title="The decision is per entity, not per system">
          A system with a shared workspace will use all three. So write it down
          per entity — getting this wrong is not an error you find later, it is
          a system that works correctly for the person who built it and leaks
          for everyone else.
        </Callout>
      </div>
    </Card>
  )
}

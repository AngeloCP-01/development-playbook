'use client'
import { useId } from 'react'
import { Card } from '@/components/ui'
import { EMPTY_PRACTICE, useDocumentationSession } from './DocumentationSession'
import type { DecisionCase } from './practice'
export function DecisionDrill({
  setId,
  title,
  cases,
}: {
  setId: string
  title: string
  cases: readonly DecisionCase[]
}) {
  const root = useId()
  const { practices, setPractice } = useDocumentationSession()
  const run = practices[setId] ?? EMPTY_PRACTICE
  const item = cases[run.index]
  if (!item) return <p>No cases are available.</p>
  const committed = Object.hasOwn(run.choices, item.id)
  const choice = committed ? run.choices[item.id] : run.drafts[item.id]
  const answered = cases.filter((c) => Object.hasOwn(run.choices, c.id)).length
  const correct = cases.filter((c) => run.choices[c.id] === c.answer).length
  const validDraft = item.options.some((o) => o.id === run.drafts[item.id])
  return (
    <Card>
      <p className="t-label mb-2 text-brand">Illustrative practice</p>
      <h3 className="t-head mb-3 text-lg">{title}</h3>
      <p className="t-data mb-3 text-sm text-muted">
        Case {run.index + 1} of {cases.length}
      </p>
      <p aria-live="polite" className="mb-3 text-sm text-muted">
        {answered ? `${correct} of ${answered} decisions correct` : ''}
      </p>
      <pre className="mb-4 whitespace-pre-wrap break-words border border-line bg-sunken p-3 text-sm leading-relaxed text-fg">
        {item.excerpt}
      </pre>
      <fieldset disabled={committed} className="min-w-0 space-y-2">
        <legend className="t-ui mb-3 text-sm font-medium">{item.prompt}</legend>
        {item.options.map((option) => (
          <label
            key={option.id}
            className="t-ui relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"
          >
            <input
              type="radio"
              name={`${root}-${item.id}`}
              checked={choice === option.id}
              onChange={() =>
                setPractice(setId, (old) => ({
                  ...old,
                  drafts: { ...old.drafts, [item.id]: option.id },
                }))
              }
              disabled={committed}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              aria-hidden
              className="mt-1 size-4 shrink-0 rounded-full border border-line peer-checked:border-brand peer-checked:bg-brand"
            />
            <span className="min-w-0 break-words">{option.text}</span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={committed || !validDraft}
        onClick={() =>
          setPractice(setId, (old) => ({
            ...old,
            choices: { ...old.choices, [item.id]: old.drafts[item.id] },
          }))
        }
        className="t-ui mt-4 min-h-11 border border-line px-4 text-sm disabled:text-subtle"
      >
        Check answer
      </button>
      {committed && (
        <div role="status" className="mt-4 border border-line bg-sunken p-4">
          <p
            className={`mb-2 text-sm font-semibold ${choice === item.answer ? 'text-go' : 'text-danger'}`}
          >
            {choice === item.answer ? 'Correct' : 'Reconsider'}
          </p>
          <p className="text-sm leading-relaxed text-muted">{item.rationale}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={run.index === 0}
          onClick={() =>
            setPractice(setId, (old) => ({ ...old, index: old.index - 1 }))
          }
          className="t-ui min-h-11 border border-line px-3 text-sm disabled:text-subtle"
        >
          Previous case
        </button>
        <button
          type="button"
          disabled={run.index === cases.length - 1}
          onClick={() =>
            setPractice(setId, (old) => ({ ...old, index: old.index + 1 }))
          }
          className="t-ui min-h-11 border border-line px-3 text-sm disabled:text-subtle"
        >
          Next case
        </button>
        <button
          type="button"
          onClick={() =>
            setPractice(setId, () => ({ index: 0, drafts: {}, choices: {} }))
          }
          className="t-ui min-h-11 border border-line px-3 text-sm"
        >
          Reset practice
        </button>
      </div>
    </Card>
  )
}

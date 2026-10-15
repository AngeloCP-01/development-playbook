'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import type { DecisionCase } from './decisions'

export function DecisionDrill({
  title,
  cases,
}: {
  title: string
  cases: readonly DecisionCase[]
}) {
  const root = useId()
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string | null>(null)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const item = cases[index]
  const answered = Object.keys(choices).length
  const correct = cases.filter((row) => choices[row.id] === row.answer).length
  const committed = item ? item.id in choices : false
  if (!item) return <p>No decision cases are available.</p>

  return (
    <Card>
      <p className="t-label mb-2 text-brand">Hypothetical exercise</p>
      <h3 className="t-head mb-3 text-lg">{title}</h3>
      <p aria-live="polite" className="t-data mb-4 text-sm text-muted">
        {answered > 0 ? `${correct} of ${answered} decisions correct` : ''}
      </p>
      {item.comparison && (
        <table className="mb-5 w-full table-fixed border-collapse text-left text-sm">
          <caption className="mb-2 text-left text-sm font-medium">
            Before and after evidence
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-1/4 p-2">
                Field
              </th>
              <th scope="col" className="p-2">
                Before
              </th>
              <th scope="col" className="p-2">
                After
              </th>
            </tr>
          </thead>
          <tbody>
            {item.comparison.map((row) => (
              <tr key={row.field} className="border-t border-line">
                <th
                  scope="row"
                  className="break-words p-2 align-top font-medium"
                >
                  {row.field}
                </th>
                <td className="break-words p-2 align-top text-muted">
                  {row.before}
                </td>
                <td className="break-words p-2 align-top text-muted">
                  {row.after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <fieldset disabled={committed} className="min-w-0 space-y-2">
        <legend className="mb-3 text-sm font-medium">{item.prompt}</legend>
        {item.options.map((option) => (
          <label
            key={option.id}
            className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"
          >
            <input
              type="radio"
              name={`${root}-${item.id}`}
              value={option.id}
              disabled={committed}
              checked={(committed ? choices[item.id] : draft) === option.id}
              onChange={() => setDraft(option.id)}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
            />
            <span
              aria-hidden
              className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand"
            />
            <span className="min-w-0 break-words">{option.label}</span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={draft === null || committed}
        onClick={() => {
          if (draft === null || committed) return
          setChoices((previous) => ({ ...previous, [item.id]: draft }))
        }}
        className="mt-4 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle"
      >
        Commit decision
      </button>
      <div aria-live="polite" className="mt-4">
        {committed && (
          <>
            <p
              className={
                choices[item.id] === item.answer
                  ? 'text-sm font-medium text-go'
                  : 'text-sm font-medium text-danger'
              }
            >
              {choices[item.id] === item.answer
                ? 'Correct'
                : 'Needs correction'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.why}
            </p>
          </>
        )}
      </div>
      {committed && index < cases.length - 1 && (
        <button
          type="button"
          onClick={() => {
            setIndex(index + 1)
            setDraft(null)
          }}
          className="mt-4 min-h-11 border border-line px-4 text-sm"
        >
          Next case
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setIndex(0)
          setDraft(null)
          setChoices({})
        }}
        className="mt-4 ml-2 min-h-11 border border-line px-4 text-sm"
      >
        Reset decisions
      </button>
    </Card>
  )
}

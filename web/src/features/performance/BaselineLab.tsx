'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import { BASELINE_PRACTICE, type BaselineField } from './baseline'

export function BaselineLab({
  fields = BASELINE_PRACTICE,
}: {
  fields?: readonly BaselineField[]
}) {
  const root = useId()
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string | null>(null)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const field = fields[index]
  const committed = field ? field.id in choices : false
  const correct = fields.filter((row) => choices[row.id] === row.answer).length
  const answered = Object.keys(choices).length
  const reset = () => {
    setIndex(0)
    setDraft(null)
    setChoices({})
  }

  return (
    <Card>
      <p className="t-label mb-3 text-brand">Hypothetical exercise</p>
      <p className="mb-4 text-sm text-muted">
        This practice uses browser checkout for a 20-item cart. It does not
        change the clock you inspected earlier or measure your application.
      </p>
      <p aria-live="polite" className="t-data mb-3 text-sm text-muted">
        {answered > 0 ? `${correct} of ${answered} choices correct` : ''}
      </p>
      {field ? (
        <>
          <fieldset disabled={committed} className="min-w-0 space-y-2">
            <legend className="mb-3 text-sm font-medium">{field.prompt}</legend>
            {field.options.map((option) => (
              <label
                key={option.id}
                className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand"
              >
                <input
                  type="radio"
                  name={`${root}-${field.id}`}
                  value={option.id}
                  disabled={committed}
                  checked={
                    (committed ? choices[field.id] : draft) === option.id
                  }
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
              setChoices((previous) => ({ ...previous, [field.id]: draft }))
            }}
            className="mt-4 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle"
          >
            Commit measurement
          </button>
          <div aria-live="polite" className="mt-4">
            {committed && (
              <p className="text-sm leading-relaxed">
                <span
                  className={
                    choices[field.id] === field.answer
                      ? 'font-medium text-go'
                      : 'font-medium text-danger'
                  }
                >
                  {choices[field.id] === field.answer
                    ? 'Correct. '
                    : 'Needs correction. '}
                </span>
                {field.why}
              </p>
            )}
          </div>
          {committed && (
            <button
              type="button"
              onClick={() => {
                setIndex(index + 1)
                setDraft(null)
              }}
              className="mt-4 min-h-11 border border-line px-4 text-sm"
            >
              {index === fields.length - 1 ? 'Inspect record' : 'Next field'}
            </button>
          )}
        </>
      ) : (
        <section aria-label="Practice baseline record">
          <h3 className="t-head mb-3 text-lg">Practice baseline record</h3>
          <dl className="space-y-4">
            {fields.map((row) => {
              const selected = row.options.find(
                (option) => option.id === choices[row.id],
              )
              const right = choices[row.id] === row.answer
              return (
                <div key={row.id} className="border-t border-line pt-3 text-sm">
                  <dt className="t-label mb-1 text-subtle">{row.label}</dt>
                  <dd>
                    <p>{selected?.label ?? 'not recorded'}</p>
                    <p className="mt-1 text-sm text-muted">
                      <span className={right ? 'text-go' : 'text-danger'}>
                        {right ? 'Correct. ' : 'Needs correction. '}
                      </span>
                      {row.why}
                    </p>
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-5 min-h-11 border border-line px-4 text-sm"
      >
        Reset practice
      </button>
    </Card>
  )
}

'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import { ORDER_REQUEST, OUTCOMES, type Outcome } from './journey'

export function OrderJourney({
  outcomes = OUTCOMES,
}: {
  outcomes?: readonly Outcome[]
}) {
  const [selected, setSelected] = useState(outcomes[0]?.id ?? '')
  const root = useId()
  const outcome = outcomes.find((row) => row.id === selected) ?? outcomes[0]
  if (!outcome) return <p>No measurement outcomes are available.</p>

  return (
    <Card>
      <p className="t-label mb-4 text-brand">Hypothetical exercise</p>
      <ol
        aria-label="Checkout request responsibilities"
        className="grid gap-2 sm:grid-cols-3"
      >
        {ORDER_REQUEST.map((name, i) => (
          <li
            key={name}
            className="measure-full border border-line bg-sunken p-3 text-sm"
          >
            <span className="t-data mr-2 text-subtle">{i + 1}</span>
            {name}
          </li>
        ))}
      </ol>
      <div className="my-4 border-l-2 border-blueprint pl-4">
        <p className="text-sm">
          Separate payment webhook → mark order paid → publish OrderPaid
        </p>
        <ul
          aria-label="Independent OrderPaid consumers"
          className="mt-3 grid gap-2 sm:grid-cols-3"
        >
          {['Inventory', 'Logistics', 'Notification'].map((name) => (
            <li
              key={name}
              className="measure-full border border-line p-3 text-sm"
            >
              <span className="t-label block text-subtle">
                OrderPaid branch
              </span>
              {name}
            </li>
          ))}
        </ul>
      </div>
      <p className="mb-3 text-sm text-muted">Choose the clock to inspect:</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {outcomes.map((row) => (
          <button
            key={row.id}
            type="button"
            aria-pressed={row.id === outcome.id}
            aria-controls={`${root}-detail`}
            onClick={() => setSelected(row.id)}
            className={`min-h-11 border px-3 py-2 text-left text-sm lg:min-h-9 ${row.id === outcome.id ? 'border-brand bg-brand-tint text-fg' : 'border-line text-muted hover:border-line-strong'}`}
          >
            {row.label}
          </button>
        ))}
      </div>
      <section
        id={`${root}-detail`}
        aria-label="Selected measurement"
        aria-live="polite"
        className="mt-5 border-t border-line pt-4"
      >
        <h3 className="t-head mb-3 text-lg">{outcome.label}</h3>
        <dl className="space-y-3 text-sm">
          {[
            ['Observer', outcome.observer],
            ['Start', outcome.start],
            ['Stop', outcome.stop],
            ['Evidence', outcome.evidence],
            ['Diagnostic intervals', outcome.diagnostic],
            ['Limit', outcome.limits],
          ].map(([label, detail]) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="t-label text-subtle">{label}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Card>
  )
}

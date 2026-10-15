'use client'

import { useState } from 'react'
import { POLICY, type Operation } from './content'

export function PolicyMatrix() {
  const [active, setActive] = useState<Operation>('read')
  const row = POLICY.find((item) => item.operation === active)!

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="Invoice operations">
        {POLICY.map((item) => (
          <button
            key={item.operation}
            type="button"
            aria-pressed={active === item.operation}
            onClick={() => setActive(item.operation)}
            className={[
              't-ui min-h-11 border px-4 py-2 text-sm capitalize',
              active === item.operation
                ? 'border-brand bg-brand-tint text-fg'
                : 'border-line bg-raised text-muted hover:text-fg',
            ].join(' ')}
          >
            {item.operation}
          </button>
        ))}
      </div>
      <div
        data-testid="policy-detail"
        className="border border-line bg-sunken p-5"
      >
        <p className="t-label mb-3 text-brand">{row.probe}</p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li>Owner: allow</li>
          <li>User B: deny</li>
          <li>Anonymous: deny</li>
          <li>Admin without grant: deny</li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          This is the invoice policy. A shared or public resource needs its own
          written rule.
        </p>
      </div>
    </div>
  )
}

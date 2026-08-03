import { Card } from '@/components/ui'
import { LOCKING_STRATEGIES } from './concurrency'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The two standard fixes for the lost update, side by side. Both work by
 * carrying something *across* the two transactions rather than tightening
 * either one, which is why they sit here rather than with the isolation levels
 * above.
 *
 * Each carries its statement verbatim, because "put a version on the row" is
 * not the lesson — `WHERE id = $1 AND version = $2` is, and so is the fact that
 * the interesting outcome is zero rows updated rather than an error.
 *
 * `min-w-0` on the card is load-bearing rather than tidiness: a grid child
 * defaults to `min-width: auto`, which stops the statement from ever scrolling
 * and pushes the whole page sideways at 320px instead. The audit caught it.
 *
 * A server component: nothing here is interactive.
 */

export function LockingStrategies() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {LOCKING_STRATEGIES.map((s) => (
        <Card key={s.id} className="flex min-w-0 flex-col gap-3">
          <div>
            <p className="text-sm font-medium text-fg">{s.name}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{s.how}</p>
          </div>

          <pre
            tabIndex={0}
            className="overflow-x-auto border border-line bg-sunken px-3 py-3 font-mono text-[12px] leading-6 text-fg"
          >
            {s.sql}
          </pre>

          <dl className="space-y-2">
            <div>
              <dt className="t-label text-go">Reach for it when</dt>
              <dd className="mt-0.5 text-sm leading-6 text-muted">
                {s.useWhen}
              </dd>
            </div>
            <div>
              <dt className="t-label text-danger">It is wrong when</dt>
              <dd className="mt-0.5 text-sm leading-6 text-muted">
                {s.wrongWhen}
              </dd>
            </div>
          </dl>

          {s.note && (
            <p className="border-t border-line pt-3 text-sm leading-6 text-muted">
              {s.note}
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}

import { Callout, Card } from '@/components/ui'
import { ISOLATION_LEVELS } from './concurrency'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * Two levels side by side, each answering the same three questions, in the
 * shape `SyncAsync` established for the doc's other two-column table. The third
 * row is the one carrying the section: what the level *cannot* see. Both
 * answers to it are the same answer, which is the point — the limit is not a
 * property of read committed that serializable fixes.
 *
 * A server component: nothing here is interactive.
 */

const ROWS = [
  { key: 'sees', label: 'It sees' },
  { key: 'cannot', label: 'It cannot relate' },
  { key: 'costs', label: 'It costs' },
] as const

export function IsolationLevels() {
  return (
    <Card>
      <div className="grid gap-3 sm:grid-cols-2">
        {ISOLATION_LEVELS.map((level) => (
          <div key={level.id} className="border border-line bg-sunken p-3.5">
            <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-fg">
              {level.name}
              {level.isDefault && (
                <span className="t-label border border-line-strong px-1.5 py-0.5 text-subtle">
                  Postgres default
                </span>
              )}
            </p>
            <dl className="mt-2 space-y-2">
              {ROWS.map((row) => (
                <div key={row.key}>
                  <dt className="t-label text-subtle">{row.label}</dt>
                  <dd className="mt-0.5 text-sm leading-6 text-muted">
                    {level[row.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Callout kind="warn" title="A person in the gap is two transactions">
          Page loads, reads a claim, thinks for a minute, clicks approve. Those
          are two separate transactions, and no isolation level in any database
          can see a relationship between them — an isolation level only relates
          a read and a write inside the same one. Setting{' '}
          <code className="t-data">SERIALIZABLE</code> and believing the next
          problem is handled is a specific and comfortable way to ship it
          anyway.
        </Callout>
      </div>
    </Card>
  )
}

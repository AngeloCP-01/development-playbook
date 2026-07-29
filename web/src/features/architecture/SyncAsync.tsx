import { Callout, Card } from '@/components/ui'
import { SYNC_ASYNC_ROWS } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * The doc's two-column table, stacked per question rather than rendered as a
 * table: a two-column comparison plus a row label is three columns at 320px,
 * and the row label is the part that cannot be dropped. Each question stacks
 * on mobile and sits side by side from `sm` up.
 *
 * The closing callout is the rule that catches people, and it is a `warn`
 * rather than an `info` because it is the one place in this step where getting
 * it wrong loses money rather than tidiness.
 *
 * A server component: nothing here is interactive.
 */

export function SyncAsync() {
  return (
    <Card>
      <ul className="space-y-3">
        {SYNC_ASYNC_ROWS.map((row) => (
          <li key={row.id} className="border border-line bg-sunken p-3.5">
            <p className="text-sm font-medium text-fg">{row.question}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <p className="t-label text-subtle">Synchronous</p>
                <p className="mt-0.5 text-sm leading-6 text-muted">
                  {row.sync}
                </p>
              </div>
              <div>
                <p className="t-label text-subtle">Asynchronous</p>
                <p className="mt-0.5 text-sm leading-6 text-muted">
                  {row.async}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Callout
          kind="warn"
          title="For anything you receive, you do not get to choose"
        >
          A payment webhook is asynchronous because somebody else decided it is.
          It will be delivered twice eventually, and the write it triggers has
          to be safe when that happens. Choose synchronous by default for work
          you initiate; reach for asynchronous when the caller genuinely should
          not wait, and accept that you have bought a failure mode you now have
          to watch.
        </Callout>
      </div>
    </Card>
  )
}

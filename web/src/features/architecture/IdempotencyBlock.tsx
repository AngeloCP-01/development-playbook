import { Callout } from '@/components/ui'
import { SchemaInspector } from './SchemaInspector'
import { PROCESSED_EVENTS_LINES } from './sketch'

/**
 * Source: docs/03-architecture.md, "Sketch the system".
 *
 * Idempotency as an annotated artifact rather than prose, because the lesson
 * is which line carries it: the composite primary key, and the ordering around
 * it. Reuses `SchemaInspector` — the pattern is identical to the invoices
 * table, only the data differs.
 *
 * The second mechanism gets equal weight rather than a footnote. "Set this to
 * that" needs no bookkeeping at all, and reaching for the table when you did
 * not need it is its own kind of over-building.
 *
 * The closing callout is the half that gets missed. Answering the sender a
 * failure on a duplicate builds a retry loop out of the mechanism meant to
 * prevent one, which is a worse outcome than not having the table.
 *
 * A server component: `SchemaInspector` carries its own 'use client'.
 */

export function IdempotencyBlock() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-fg">
          Record what you have already processed
        </p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
          The sender gives every event an id. Store it with a unique constraint
          and ignore anything you have seen before. This is the general answer,
          and the one to use when handling the event twice would do visible
          damage.
        </p>
      </div>

      <SchemaInspector
        lines={PROCESSED_EVENTS_LINES}
        title="the processed_events table"
        emptyHint="Select a line to see what it buys."
      />

      <div>
        <p className="text-sm font-medium text-fg">
          Or make the write itself repeatable
        </p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
          Setting <code className="t-data">status = &lsquo;paid&rsquo;</code> is
          already safe to run twice. Adding to a balance is not. Where you can
          phrase the change as &ldquo;set this to that&rdquo; rather than
          &ldquo;adjust this by that&rdquo;, you need no bookkeeping at all.
          Reach for this where it works and for the table where it does not.
        </p>
      </div>

      <Callout kind="warn" title="Then answer the sender success">
        A duplicate is not an error, it is the system working. Returning a
        failure means the provider retries, fails again, and keeps going — you
        have built a loop out of the mechanism meant to prevent one.
      </Callout>
    </div>
  )
}

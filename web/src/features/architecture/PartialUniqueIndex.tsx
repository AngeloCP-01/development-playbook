import { Callout } from '@/components/ui'
import { SchemaInspector } from './SchemaInspector'
import { PARTIAL_UNIQUE_LINES } from './schema-blocks'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The race comes first and the index second, deliberately. A reader shown the
 * index first reads it as syntax; a reader shown the check-then-insert race
 * first reads it as the answer to something.
 *
 * `warn` on the race, because it is a defect that passes every test you would
 * think to write and then loses to concurrency in production.
 *
 * A server component: `SchemaInspector` carries its own 'use client'.
 */

export function PartialUniqueIndex() {
  return (
    <div className="space-y-4">
      <Callout kind="warn" title="Check, then insert, is not a constraint">
        The usual approach to &ldquo;at most one approved claim per shift&rdquo;
        is to look for an existing approval and then insert. Two concurrent
        requests both pass the check, both insert, and both believe they were
        first. The stage names races as the reason constraints belong in the
        database, and then supplies only primary keys, foreign keys,
        <code className="t-data"> CHECK</code> and
        <code className="t-data"> UNIQUE</code> — none of which can express a
        rule with a condition on it.
      </Callout>

      <SchemaInspector
        lines={PARTIAL_UNIQUE_LINES}
        title="the partial unique index"
        emptyHint="Select a line to see what it buys."
      />
    </div>
  )
}

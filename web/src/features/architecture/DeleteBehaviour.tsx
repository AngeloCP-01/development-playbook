/**
 * Figure 5. Source: docs/03-architecture.md:291-293, "Cascading deletes on
 * financial data" (the trap), read together with the `ON DELETE RESTRICT`
 * schema earlier in the stage.
 *
 * Built on `Contrast` (`@/components/ui`) — its labelled two-column shape
 * already fits this content exactly, so no bespoke layout was needed. Each
 * side runs the same statement and shows its own outcome, marked with both
 * colour and a text label (`invoices deleted` / `delete refused`), so the
 * point survives for a reader who cannot see red or green.
 *
 * Static: no state, no props. `Contrast` stacks to one column below `sm`.
 */

import { Contrast } from '@/components/ui'

const STATEMENT = 'DELETE FROM users WHERE id = …'

export function DeleteBehaviour() {
  return (
    <Contrast
      badLabel="ON DELETE CASCADE"
      goodLabel="ON DELETE RESTRICT"
      bad={
        <div className="space-y-2">
          <p className="t-data break-words border border-line bg-raised px-2 py-1.5 text-xs text-muted">
            {STATEMENT}
          </p>
          <p className="text-sm leading-6 text-muted">
            The user row is gone, and every invoice referencing it goes with it
            — silently, in the same statement.
          </p>
          <p className="t-label inline-block border border-danger bg-danger-tint px-2 py-1 text-danger">
            invoices deleted
          </p>
        </div>
      }
      good={
        <div className="space-y-2">
          <p className="t-data break-words border border-line bg-raised px-2 py-1.5 text-xs text-muted">
            {STATEMENT}
          </p>
          <p className="text-sm leading-6 text-muted">
            Postgres refuses the statement while a referencing invoice still
            exists — loudly, before anything is lost.
          </p>
          <p className="t-label inline-block border border-go bg-go-tint px-2 py-1 text-go">
            delete refused
          </p>
        </div>
      }
    />
  )
}

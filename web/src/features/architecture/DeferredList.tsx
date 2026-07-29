'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * Source: docs/03-architecture.md, "Defer aggressively".
 *
 * Six of the doc's seven items. The seventh is the closing claim — "each of
 * these solves a real problem, none of them solves a problem you have yet" —
 * which reads better as the prose it already is than as a row with nothing
 * to expand, so it closes the list instead of joining it. (Decision left to
 * this task by the brief; recorded in the commit body.)
 *
 * Modelled on `ValidationLadder` (discovery) for the collapsed-row shape,
 * with one change: items open independently, tracked as a `Set` of ids,
 * rather than as an accordion with one panel open at a time. There is no
 * ordering here for a single-open panel to defend, and a reader comparing
 * two items should be able to hold both open.
 *
 * Each expanded panel carries three lines, not two: the real problem the
 * thing solves, why it is not needed yet, and — the line most writing on
 * this topic skips — what carrying it costs today, before it has paid for
 * itself once.
 */

type Item = {
  id: string
  name: string
  summary: string
  problem: string
  notYet: string
  costsToday: string
}

const ITEMS: Item[] = [
  {
    id: 'caching',
    name: 'A caching layer',
    summary: 'Postgres is fast. Add it when you have a measured problem.',
    problem:
      'Serves reads without hitting the database every time, protecting a query path that has become slow or overloaded.',
    notYet:
      'At the load a new product actually sees, a plain query answers well inside any reasonable latency budget. There is no measured problem yet for a cache to solve.',
    costsToday:
      'An invalidation strategy to design and get wrong, a second place data can disagree with itself, and a new class of bug — “why is this showing the old value” — for a problem you have not measured.',
  },
  {
    id: 'queue',
    name: 'A queue',
    summary: 'Until something genuinely exceeds request time.',
    problem:
      'Runs work that would otherwise block a request past its execution limit, or separates a slow step from the caller waiting on it.',
    notYet:
      'Until a job actually exceeds request time, synchronous is simpler to write, trace, and debug end to end — there is nothing here yet for a queue to unblock.',
    costsToday:
      'A worker to deploy and monitor, retry and idempotency logic to get right, and a second system that can fail for reasons request/response never could.',
  },
  {
    id: 'multi-tenancy',
    name: 'Multi-tenancy beyond a user_id column',
    summary: 'A user_id column and a query filter is real isolation.',
    problem:
      'Isolates each customer’s data and access so tenants never see or affect one another’s rows.',
    notYet:
      'A user_id column plus a filter on every query already provides that isolation for one customer at a time, which is the shape almost every early product actually has.',
    costsToday:
      'Every query grows a tenant clause, schema choices multiply, and the first tenant you build for fixes a shape you are then generalising from — before a second tenant has told you what it needs.',
  },
  {
    id: 'event-sourcing',
    name: 'Event sourcing',
    summary: 'Almost certainly not.',
    problem:
      'Keeps a full, append-only history of every state change, so any past state can be reconstructed exactly.',
    notYet:
      'Almost no early product has an audit or replay requirement severe enough to justify the model before it has any state worth auditing.',
    costsToday:
      'Every read now replays or projects from a log instead of running a plain query — a complexity tax paid on day one, for an audit requirement that may never arrive.',
  },
  {
    id: 'design-system',
    name: 'A design system',
    summary: 'A component library plus consistency is enough for a long time.',
    problem:
      'Gives a growing product and a growing team one visual language, enforced in code rather than kept in one person’s memory.',
    notYet:
      'A component library and a little discipline covers a solo product, or a small team, for a long time — there is no second designer’s opinion yet to reconcile.',
    costsToday:
      'Tokens, documentation, and a governance process, maintained for variations you are not yet building and a team that is not yet arguing about them.',
  },
  {
    id: 'feature-flags',
    name: 'Feature-flag infrastructure',
    summary: 'A config object is fine until it is not.',
    problem:
      'Ships code dark, rolls a change out gradually, and turns a bad release off without a redeploy.',
    notYet:
      'A config object with a boolean does the same job until you are shipping often enough, or to enough people, that a redeploy becomes the expensive part.',
    costsToday:
      'A flag service to run, flags someone has to remember to delete, and a second source of truth for what the running code is actually doing — paid before it has prevented a single incident.',
  },
]

export function DeferredList() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  return (
    <Card className="p-0">
      <ul className="divide-y divide-line">
        {ITEMS.map((item) => {
          const open = openIds.has(item.id)
          const panelId = `deferred-${item.id}`
          return (
            <li key={item.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.name}</span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {item.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <div
                  id={panelId}
                  className="space-y-3 border-t border-line bg-sunken px-5 py-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blueprint">
                      The real problem it solves
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-subtle">
                      Why it is not yours yet
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.notYet}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-warn">
                      What it costs you today
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.costsToday}
                    </p>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
        Each of these solves a real problem. None of them solves a problem you
        have yet — and each one makes every later change more expensive.
      </p>
    </Card>
  )
}

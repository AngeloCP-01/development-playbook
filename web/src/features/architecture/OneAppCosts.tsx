/**
 * Figure 6. Source: docs/03-architecture.md, "Start with one application", "Start with one
 * application".
 *
 * Two neutral columns, not a verdict — this is a trade-off, not a good/bad
 * pair, so `go`/`danger` stay unused here. The third band is visually
 * separated (a rule, not a colour) and each item is labelled "needs a team",
 * because that qualifier is the actual argument for ever giving these costs
 * up: distribution buys something, but only for a team that has the problem.
 * `brand` marks that qualifier as the thing worth noticing, not as approval.
 *
 * Static: no state, no props. Stacks to one column below `md`.
 */

const GIVES = [
  'Everything runs in one process locally',
  'One deployment, one place to look when it breaks',
  'No network boundary between your own code',
  'Refactoring across the whole system is a rename',
]

const COSTS = [
  'Network failure modes',
  'Distributed debugging',
  'Deployment coordination',
  'Data consistency',
]

const TEAM_BENEFITS = [
  'Independent team scaling',
  'Independent deploy cadence',
  'Per-service resource scaling',
]

export function OneAppCosts() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="border border-line-strong bg-raised p-4">
          <p className="t-label mb-2 text-subtle">One application gives you</p>
          <ul className="space-y-1.5">
            {GIVES.map((g) => (
              <li key={g} className="text-sm leading-6 text-muted">
                {g}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-sunken p-4">
          <p className="t-label mb-2 text-subtle">Distribution costs</p>
          <ul className="space-y-1.5">
            {COSTS.map((c) => (
              <li key={c} className="text-sm leading-6 text-muted">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 border-t border-line-strong pt-4">
        <p className="t-label mb-2 text-subtle">
          What distribution buys, when it applies
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TEAM_BENEFITS.map((b) => (
            <li
              key={b}
              className="border border-line bg-raised px-3 py-2 text-sm text-muted"
            >
              {b}
              <span className="t-label mt-1 block text-brand">
                needs a team
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

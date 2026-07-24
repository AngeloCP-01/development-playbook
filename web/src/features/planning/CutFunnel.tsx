import { CUT_FEATURES } from './scoring'

/**
 * Figure 2. Everything imagined, filtered by the done statement, split into
 * what survives and what does not — yet.
 *
 * Static: the reader has already made the calls in `CutTable` above this
 * figure just draws the shape of the process. `brand` marks the filter step
 * for attention only; which side a feature lands on is shown by a second
 * signal (the group label) as well as colour.
 */

const NOW = CUT_FEATURES.filter((f) => f.core)
const NOT_NOW = CUT_FEATURES.filter((f) => !f.core)

export function CutFunnel() {
  return (
    <div>
      <p className="t-label mb-2 text-subtle">Everything imagined</p>
      <div className="flex flex-wrap gap-1.5">
        {CUT_FEATURES.map((f) => (
          <span
            key={f.id}
            className="min-w-0 break-words border border-line bg-sunken px-2.5 py-1.5 text-xs text-muted"
          >
            {f.label}
          </span>
        ))}
      </div>

      <div className="my-4 flex items-center gap-3" aria-hidden>
        <svg width="16" height="24" viewBox="0 0 16 24" className="shrink-0">
          <path
            d="M8 0 V18"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-line-strong"
          />
          <path
            d="M8 23 L3 16 H13 Z"
            fill="currentColor"
            className="text-line-strong"
          />
        </svg>
        <div className="min-w-0 flex-1 border border-brand bg-brand-tint px-3.5 py-2.5">
          <p className="text-sm font-medium text-fg">
            Does the done statement fail without this?
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border border-go bg-go-tint p-4">
          <p className="t-label mb-2 text-go">Now — survives the cut</p>
          <ul className="space-y-1.5">
            {NOW.map((f) => (
              <li key={f.id} className="break-words text-sm text-fg">
                {f.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-sunken p-4">
          <p className="t-label mb-2 text-subtle">Not now — the rest</p>
          <ul className="space-y-1.5">
            {NOT_NOW.map((f) => (
              <li key={f.id} className="break-words text-sm text-muted">
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

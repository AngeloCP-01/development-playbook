/**
 * Figure 1. Source: docs/03-architecture.md, "Sort decisions by reversibility".
 *
 * A two-group axis rather than a precise number line — the doc sorts into two
 * buckets, not a spectrum, so drawing individual positions would invent
 * precision the source does not have. Each item still carries its bucket as
 * text (a `t-label` suffix), never by placement or colour alone.
 *
 * The expensive end is bracketed in `brand` and reads "spend your thinking
 * here" — attention, the correct use of the accent. The end labels
 * themselves ("cheap to undo" / "expensive to undo") stay neutral, since they
 * describe position, not urgency.
 *
 * Static: no state, no props. Stacks to two labelled columns below `sm`
 * rather than compressing a row that would otherwise wrap badly at 320px.
 */

const CHEAP = [
  'Component library',
  'Folder naming',
  'Logging library',
  'Most UI decisions',
]

const EXPENSIVE = [
  'The data model',
  'Auth strategy',
  'One service or several',
  'Anything writing to a store others read',
]

export function ReversibilityAxis() {
  return (
    <div>
      <div className="hidden items-center gap-3 sm:flex">
        <span className="t-label text-subtle">Cheap to undo</span>
        <span className="h-px flex-1 bg-line-strong" aria-hidden />
        <span className="t-label text-subtle">Expensive to undo</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:mt-4 sm:grid-cols-[1fr_1fr] sm:items-start sm:gap-6">
        <div>
          <p className="t-label mb-2 text-subtle sm:hidden">Cheap to undo</p>
          <ul className="space-y-1.5">
            {CHEAP.map((item) => (
              <li
                key={item}
                className="flex min-w-0 items-center justify-between gap-2 border border-line bg-sunken px-3 py-2 text-sm text-muted"
              >
                <span className="break-words">{item}</span>
                <span className="t-label shrink-0 text-subtle">cheap</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-brand p-3">
          <p className="t-label mb-2 text-brand">Spend your thinking here</p>
          <p className="t-label mb-2 text-subtle sm:hidden">
            Expensive to undo
          </p>
          <ul className="space-y-1.5">
            {EXPENSIVE.map((item) => (
              <li
                key={item}
                className="flex min-w-0 items-center justify-between gap-2 border border-line bg-raised px-3 py-2 text-sm text-muted"
              >
                <span className="break-words">{item}</span>
                <span className="t-label shrink-0 text-subtle">expensive</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

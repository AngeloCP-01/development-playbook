/**
 * Figure 3. Source: docs/03-architecture.md, "Model the domain first", the `is_overdue` example.
 *
 * Two snapshots a week apart, then the computed alternative. The disagreeing
 * cell in row two is marked `danger` with the word "disagrees" printed next
 * to it — not a row-level verdict, the cell itself, because the entire point
 * is that one stored value has quietly gone stale while everything around it
 * looks unchanged. The computed row gets `go` and "always correct" for the
 * same reason: a reader who cannot see colour still gets the claim.
 *
 * The caption (added by the caller's `<Figure>`) carries the argument; this
 * component only shows the mechanism. Static: no state, no props.
 */

type Field = {
  label: string
  value: string
  tone?: 'go' | 'danger'
  note?: string
}

function Cell({ label, value, tone, note }: Field) {
  const toneClasses =
    tone === 'danger'
      ? 'border-danger bg-danger-tint text-danger'
      : tone === 'go'
        ? 'border-go bg-go-tint text-go'
        : 'border-line bg-raised text-fg'

  return (
    <div className={`min-w-0 border px-2.5 py-1.5 ${toneClasses}`}>
      <p className="t-label text-subtle">{label}</p>
      <p className="t-data break-words text-sm">{value}</p>
      {note && <p className="t-label mt-0.5">{note}</p>}
    </div>
  )
}

export function DriftDiagram() {
  return (
    <div className="space-y-2">
      <div>
        <p className="t-label mb-1.5 text-subtle">Day 1</p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <Cell label="due_date" value="3 Mar" />
          <Cell label="is_overdue (stored)" value="false" />
          <Cell label="now()" value="1 Mar" />
        </div>
      </div>

      <div>
        <p className="t-label mb-1.5 text-subtle">Day 8 — one week later</p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <Cell label="due_date" value="3 Mar" />
          <Cell
            label="is_overdue (stored)"
            value="false"
            tone="danger"
            note="disagrees"
          />
          <Cell label="now()" value="10 Mar — past due" />
        </div>
      </div>

      <div>
        <p className="t-label mb-1.5 text-subtle">Computed instead</p>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <Cell label="due_date" value="3 Mar" />
          <Cell
            label="is_overdue (computed)"
            value="due_date < now()"
            tone="go"
            note="always correct"
          />
          <Cell label="now()" value="10 Mar — past due" />
        </div>
      </div>
    </div>
  )
}

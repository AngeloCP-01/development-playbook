/**
 * Figure 9. Source: docs/02-planning.md, "Set the horizon".
 *
 * Three bands, drawn with decreasing certainty rather than a semantic colour
 * scale — Now is a solid, defined surface, Next is softer, Later is dashed —
 * so the figure argues its own point (sequence without commitment) instead of
 * borrowing `go`/`warn` meaning that belongs to a verdict, not a roadmap.
 *
 * Static: no state. Built from `div`s, not `p`/`li`, for the band frame — the
 * three-column layout is exactly the kind of wide content `main :is(p, li)`'s
 * 68ch cap would pinch. Only the short body sentence inside each band is a
 * `p`, which is safe: each column is already well under 68ch at any viewport.
 */

type Band = {
  label: string
  tagline: string
  body: string
  style: 'solid' | 'soft' | 'dashed'
}

const BANDS: Band[] = [
  {
    label: 'Now',
    tagline: 'The MVP',
    body: 'Whatever the cut left standing: create an invoice, mark it paid, see what is overdue.',
    style: 'solid',
  },
  {
    label: 'Next',
    tagline: 'Evidence-triggered',
    body: 'The "not now" list, in priority order — waiting on a trigger, not a date. Recurring invoices, once a client gets billed the same way three months running.',
    style: 'soft',
  },
  {
    label: 'Later',
    tagline: 'The product goal',
    body: 'Written as a paragraph, not a feature list: the thing a freelancer opens on Monday to see who owes them money, and does not open again that week.',
    style: 'dashed',
  },
]

const STYLE: Record<Band['style'], string> = {
  solid: 'border-line-strong bg-raised',
  soft: 'border-line bg-sunken',
  dashed: 'border-dashed border-line bg-transparent',
}

export function HorizonBands() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {BANDS.map((b) => (
          <div
            key={b.label}
            className={`min-w-0 border p-4 sm:p-5 ${STYLE[b.style]}`}
          >
            <p className="t-label mb-1 text-subtle">{b.label}</p>
            <p className="mb-2 text-sm font-semibold text-fg">{b.tagline}</p>
            <p className="min-w-0 break-words text-sm leading-6 text-muted">
              {b.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-subtle">
        Horizons carry the sequence without the commitment — no dates, which is
        what keeps a roadmap from turning into a promise.
      </p>
    </div>
  )
}

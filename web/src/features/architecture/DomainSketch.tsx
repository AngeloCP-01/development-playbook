/**
 * Figure 2. Source: docs/03-architecture.md, "Model the domain first".
 *
 * Nouns become boxes, relationships become labelled edges — the verb phrase
 * from the doc ("has many"), not a bare arrow, since an unlabelled arrow
 * would only say "related", not how.
 *
 * Deliberately small: this panel is the heaviest in the stage, and the
 * figure's job is orientation before the interactive builder, not the lesson
 * itself.
 *
 * Static: no state, no props. The chain runs vertically below `sm` and
 * horizontally above it — same tokens, direction swapped by CSS visibility,
 * not by logic.
 */

type Token = { kind: 'node'; label: string } | { kind: 'edge'; label: string }

const CHAIN: Token[] = [
  { kind: 'node', label: 'User' },
  { kind: 'edge', label: 'has many' },
  { kind: 'node', label: 'Client' },
  { kind: 'edge', label: 'has many' },
  { kind: 'node', label: 'Invoice' },
  { kind: 'edge', label: 'has many' },
  { kind: 'node', label: 'LineItem' },
]

const STATUSES = ['draft', 'sent', 'paid', 'overdue']

export function DomainSketch() {
  return (
    <div>
      <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1">
        {CHAIN.map((token, i) =>
          token.kind === 'node' ? (
            <span
              key={i}
              className="border border-line-strong bg-raised px-3 py-1.5 text-center text-sm font-medium text-fg"
            >
              {token.label}
            </span>
          ) : (
            <span
              key={i}
              className="flex items-center gap-1.5 py-0.5 text-subtle sm:px-1"
            >
              <span aria-hidden className="sm:hidden">
                ↓
              </span>
              <span aria-hidden className="hidden sm:inline">
                →
              </span>
              <span className="t-label whitespace-nowrap">{token.label}</span>
            </span>
          ),
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border border-line bg-sunken px-3 py-2">
        <span className="border border-line-strong bg-raised px-2 py-1 text-sm font-medium text-fg">
          Invoice
        </span>
        <span className="t-label text-subtle">has a status</span>
        <span className="flex flex-wrap gap-1">
          {STATUSES.map((s) => (
            <span
              key={s}
              className="t-data border border-line px-1.5 py-0.5 text-[11px] text-muted"
            >
              {s}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

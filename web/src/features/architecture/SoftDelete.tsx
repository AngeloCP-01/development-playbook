import { RevealList } from '@/components/RevealList'
import { Callout } from '@/components/ui'
import { FILTER_RULE, SOFT_DELETE_MECHANICS } from './soft-delete'

/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * Expand-to-reveal rather than an open list: `tenancy` measured 4.1 screens
 * with the three mechanics rendered open, and D-49 says the threshold is met
 * by disclosure rather than by cutting. Collapsed, each row names its trade,
 * which is what a reader comparing three options needs to see at once.
 *
 * The default is marked with `brand` — "you are here", the sense
 * `DeploymentStyles` uses for the row this stage teaches, not "correct". The
 * other two have cases where they win, which the rows say.
 *
 * Built on `RevealList`; state, markup and the chevron now live there. The
 * two "reach for it" / "wrong reach" blocks keep their own `t-label` markup
 * rather than becoming `RevealFacet`s — `RevealFacet`'s label is a different
 * type family (sans, not mono), and swapping it in would be a visual change
 * this migration does not make.
 */

export function SoftDelete() {
  return (
    <RevealList
      idPrefix="soft-delete"
      rows={SOFT_DELETE_MECHANICS.map((m) => ({
        id: m.id,
        title: m.name,
        badge: m.isDefault ? (
          <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
            the default
          </span>
        ) : undefined,
        summary: m.summary,
        body: (
          <>
            <p className="text-sm leading-6 text-muted">{m.what}</p>
            <div>
              <p className="t-label text-go">Reach for it when</p>
              <p className="mt-1 text-sm leading-6 text-muted">{m.useWhen}</p>
            </div>
            <div>
              <p className="t-label text-danger">It is the wrong reach when</p>
              <p className="mt-1 text-sm leading-6 text-muted">{m.wrongWhen}</p>
            </div>
          </>
        ),
      }))}
      footer={
        <div className="border-t border-line bg-raised px-5 py-4">
          <Callout
            kind="warn"
            title="The column is easy; the filter is what bites"
          >
            {FILTER_RULE}
          </Callout>
        </div>
      }
    />
  )
}

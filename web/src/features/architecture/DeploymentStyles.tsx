import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { CHOSEN_STYLE_ID, DEPLOYMENT_STYLES } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * The doc's four-column table, as expand-to-reveal. A four-column comparison
 * does not survive 320px: it either scrolls sideways, which hides the column
 * that carries the decision, or it shrinks the type below readable. Every
 * cell here is a sentence rather than a value, which is the case
 * `PATTERNS.md` names expand-to-reveal for.
 *
 * The chosen row is marked, and marked with `brand` rather than `go`. It is
 * "you are here", not "this one is correct" — the whole point of the section
 * is that a different set of characteristics picks a different row.
 */

export function DeploymentStyles() {
  return (
    <RevealList
      idPrefix="style"
      rows={DEPLOYMENT_STYLES.map((style) => ({
        id: style.id,
        title: style.name,
        badge:
          style.id === CHOSEN_STYLE_ID ? (
            <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
              what this stage teaches
            </span>
          ) : undefined,
        summary: style.summary,
        body: (
          <>
            <RevealFacet label="What it buys" tone="blueprint">
              {style.buys}
            </RevealFacet>
            <RevealFacet label="What it costs" tone="warn">
              {style.costs}
            </RevealFacet>
            <RevealFacet label="What would have to be true" tone="subtle">
              {style.trueWhen}
            </RevealFacet>
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          The microservices row is the one people adopt for the wrong reason.
          What it buys is organisational; what it costs is technical and arrives
          on day one. Alone you pay the full price for none of the return.
        </p>
      }
    />
  )
}

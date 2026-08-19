import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/05-development.md`, "### AI in development".
 *
 * Modelled on stage 04's `AIPlays`: one `RevealList` over `PLAYS`, `kind` as
 * the row badge rather than a four-way split — two of the six plays share
 * the `command` kind, so grouping would produce lopsided lists for no
 * reader benefit, and the doc names the mechanism in parentheses beside
 * each title, not as a taxonomy of its own.
 *
 * The header and closing paragraphs are both sourced from `ai-plays.ts` and
 * pinned to the doc there: `AI_PREMISE` for the section's opening (why the
 * panel exists, and the concrete list of things that fail silently) and
 * `AI_LIMIT` for its close — the same shapes stage 04's counterpart uses,
 * the same export names. Both were missing from the original Task 10 brief
 * and were briefly hand-authored inline here; a review caught the gap for
 * `AI_LIMIT` first (F1), then caught that the header was a *lossy*
 * paraphrase of `AI_PREMISE` — it kept the paragraph's first sentence and
 * silently dropped the second, the concrete failure-mode list that makes the
 * paragraph actionable (F2).
 *
 * TD-34 applies here exactly as it does in stage 04's counterpart:
 * `RevealList` hardcodes `<h3>` per row, so this component contributes no
 * heading of its own — the lead line is a `<p>` — and the rows nest under
 * `Section`'s `<h2>`.
 *
 * Titles and bodies go through `InlineCode`, since `ai-plays.ts` keeps the
 * doc's bold bullet leads and named tools verbatim, backticks included.
 */

const KIND_LABEL: Record<Play['kind'], string> = {
  skill: 'Skill',
  command: 'Saved command',
  memory: 'Memory',
  mcp: 'MCP',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="dev-ai"
        header={
          <p className="border-b border-line px-5 py-3.5 text-sm leading-6 text-muted">
            {AI_PREMISE}
          </p>
        }
        rows={PLAYS.map((play) => ({
          id: play.id,
          title: (
            <span className="font-medium">
              <InlineCode text={play.title} />
            </span>
          ),
          badge: (
            <span className="t-label shrink-0 border border-line px-1.5 py-0.5 text-subtle">
              {KIND_LABEL[play.kind]}
            </span>
          ),
          body: (
            <p className="measure text-sm leading-6 text-muted">
              <InlineCode text={play.body} />
            </p>
          ),
        }))}
      />

      <div className="border border-line bg-raised p-4 sm:p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
          <TriangleAlert className="size-4 shrink-0 text-warn" aria-hidden />
          What a green test does not prove
        </p>
        <p className="measure text-sm leading-6 text-muted">{AI_LIMIT}</p>
      </div>
    </div>
  )
}

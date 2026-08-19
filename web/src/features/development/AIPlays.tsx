import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/05-development.md`, "### AI in development".
 *
 * Modelled on stage 04's `AIPlays`: one `RevealList` over `PLAYS`, `kind` as
 * the row badge rather than a four-way split — two of the six plays share
 * the `command` kind, so grouping would produce lopsided lists for no
 * reader benefit, and the doc names the mechanism in parentheses beside
 * each title, not as a taxonomy of its own.
 *
 * The closing paragraph is `AI_LIMIT`, sourced from `ai-plays.ts` and pinned
 * to the doc there — the same shape stage 04's `AI_LIMIT` box closes on, and
 * the same export name. (This was missing from the original Task 10 brief
 * and briefly hand-authored inline here; a review caught the gap.) The
 * header line above the rows remains this component's own connective
 * prose — a light paraphrase of the doc's opening sentence, not quoted or
 * tested against it, since nothing here claims it is verbatim.
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
            The loop here runs fast enough that reading a suggestion and
            accepting it take about the same half second — which is what makes
            this the risky stage. The mistakes that survive are the ones that
            read as correct on the way past.
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

import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/05-development.md`, "### AI in development".
 *
 * Modelled on stage 04's `AIPlays`: one `RevealList` over `PLAYS`, `kind` as
 * the row badge rather than a four-way split — two of the six plays share
 * the `command` kind, so grouping would produce lopsided lists for no
 * reader benefit, and the doc names the mechanism in parentheses beside
 * each title, not as a taxonomy of its own.
 *
 * The header and closing paragraphs are this component's own prose, not
 * `ai-plays.ts` data — that module carries only `PLAYS` (D-66's "verbatim
 * where it is tested" rule applies to the plays themselves, not to framing
 * text nothing checks against the doc). They stand in for the doc's opening
 * ("the mistakes that survive are the ones that read as correct on the way
 * past") and closing ("what none of this replaces") paragraphs, the same
 * shape stage 04's `AI_LIMIT` box closes on.
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
          What none of this replaces
        </p>
        <p className="measure text-sm leading-6 text-muted">
          Reading the diff before you keep it. A green test only proves the case
          you remembered to write — a query that never scopes by owner passes
          every test that never checked for the gap, and a model has no more
          reason than you did to notice the one that is missing.
        </p>
      </div>
    </div>
  )
}

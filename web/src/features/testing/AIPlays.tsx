import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_PREMISE, PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/06-testing.md`, "### AI in testing".
 *
 * Modelled on stage 04 and stage 05's `AIPlays`: one `RevealList` over
 * `PLAYS`, `kind` as the row badge.
 *
 * `AI_PREMISE` renders whole, all three sentences, as the list's header. A
 * first pass at this premise in this branch kept the warning and the
 * closing question but dropped the middle sentence — the one whose second
 * clause makes the compounding claim ("a suite grown that way gets larger
 * without anyone's confidence growing with it"). That clause is the
 * antecedent of the section's closing "ballast" line, so a paraphrase here
 * that trims the paragraph is a different, weaker claim than the doc makes.
 * `ai-plays.ts` carries the whole paragraph as one string precisely so
 * nothing renders it in pieces; this component prints that string directly
 * rather than composing it from parts.
 *
 * TD-34 applies here as it does in the other two `AIPlays`: `RevealList`
 * hardcodes `<h3>` per row, so this component contributes no heading of its
 * own — the premise is a `<p>` — and the rows nest under `Section`'s `<h2>`.
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
    <RevealList
      idPrefix="testing-ai"
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
  )
}

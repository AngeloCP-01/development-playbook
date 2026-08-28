import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/07-code-review.md`, "### AI in code review".
 *
 * Same structural model as stage 04 and 06's `AIPlays`: one `RevealList`
 * over `PLAYS` with `AI_PREMISE` as its header, `kind` as the row badge, and
 * `AI_LIMIT` as a sibling warning box after the list rather than folded into
 * it — the premise says what AI review catches, the limit says what it must
 * never be allowed to become the whole of, and those are two different
 * claims that deserve two different slots.
 */

const KIND_LABEL: Record<Play['kind'], string> = {
  skill: 'Skill',
  command: 'Saved command',
  mcp: 'MCP',
  memory: 'Memory',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="code-review-ai"
        header={
          <p className="border-b border-line px-5 py-3.5 text-sm leading-6 text-muted">
            <InlineCode text={AI_PREMISE} />
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
          <InlineCode text={AI_LIMIT} />
        </p>
      </div>
    </div>
  )
}

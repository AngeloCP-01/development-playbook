import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

/**
 * Source: `docs/12-staging.md`, "### AI in staging".
 *
 * Same structural model as stage 04, 06 and 07's `AIPlays`: one `RevealList`
 * over `PLAYS` with `AI_PREMISE` as its header, `kind` as the row badge, and
 * `AI_LIMIT` as a sibling warning box after the list rather than folded into
 * it — the premise says what a mechanical preview pass catches, the limit
 * says what it must never be allowed to become the whole of.
 */

const KIND_LABEL: Record<Play['kind'], string> = {
  mcp: 'Browser tool',
  command: 'Saved command',
  prompt: 'Prompt',
  cli: 'CLI command',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="staging-ai"
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

      <div className="flex gap-3 rounded-md border border-warn/30 bg-warn/5 px-4 py-3">
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-warn"
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">What none of this replaces</p>
          <p className="text-sm text-muted">
            <InlineCode text={AI_LIMIT} />
          </p>
        </div>
      </div>
    </div>
  )
}

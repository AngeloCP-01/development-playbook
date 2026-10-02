import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

const KIND_LABEL: Record<Play['kind'], string> = {
  command: 'Slash command',
  prompt: 'Prompt',
  cli: 'CLI command',
  tool: 'AI tool',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="cicd-ai"
        header={
          <p className="text-sm leading-6 text-muted">
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
            <p className="text-sm leading-6 text-muted">
              <InlineCode text={play.body} />
            </p>
          ),
        }))}
      />
      <div className="flex gap-2 rounded border border-warn bg-warn-tint p-3 text-sm leading-6 text-fg">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warn" />
        <p>
          <InlineCode text={AI_LIMIT} />
        </p>
      </div>
    </div>
  )
}

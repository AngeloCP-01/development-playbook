import { useId } from 'react'
import { TriangleAlert } from 'lucide-react'
import { RevealList } from '@/components/RevealList'
import { Card, Callout } from '@/components/ui'
import { AI_MISLEADS, AI_PLAYS, AI_TOOLS, type AIEntry } from './ai-plays'

/**
 * Source: docs/03-architecture.md, "AI in architecture" (the last
 * subsection of "The work"). Where agents help in system design, and where
 * they mislead. The counterpart to stage 02's AIPlanningPlays.
 *
 * Structural model is AIPlanningPlays: an opening Callout naming the failure
 * mode, a list of collapsed claims that expand to their reasoning, a closing
 * box for what none of it replaces. The difference here is two lists, not
 * one — helps and misleads are visually separate, and misleads gets the
 * warn-tinted treatment rather than a smaller or secondary slot, because an
 * agent asked to design a system reaches for services, queues and caches by
 * default, and every one of those is on the defer list the reader went
 * through two steps earlier in this stage.
 *
 * No copyable prompt: unlike AIPlanningPlays' plays, these are not each a
 * single reusable prompt to fire off — "it invents scale" and "it reaches
 * for distribution by default" are warnings to recognise, not prompts to
 * paste. Forcing a prompt onto the misleads half for symmetry with the helps
 * half would also be exactly the kind of unequal weighting the brief
 * warns against. Where the doc does name something concretely reusable —
 * context7, claude-mem, a git worktree or sandbox — it appears as its own
 * named-tools list instead.
 *
 * The two `PlayList`s are `RevealList`s (Task 16). This waited for Task 15:
 * the row title here is 14px (`text-sm`), and `RevealList`'s title slot used
 * to be a plain string rendered at ambient body size (17px) with no size
 * hook — migrating earlier would have silently grown it 3px. `RevealRow.title`
 * now accepts a `ReactNode`, so the title is passed pre-styled
 * (`text-sm font-medium text-fg`) and renders unwrapped, taking `RevealList`'s
 * plain-string `font-medium` span out of the picture entirely. The section
 * header (label chip + heading) is not itself a row — it becomes each list's
 * `header`. Each list keeps its own open/close state (`RevealList` owns
 * that internally); the two `AIEntry` id sets never overlap, so nothing
 * observable changes from what used to be one shared `Set` between both.
 */

function PlayList({
  label,
  tone,
  heading,
  entries,
}: {
  label: string
  tone: 'go' | 'warn'
  heading: string
  entries: AIEntry[]
}) {
  const toneStyle =
    tone === 'go' ? 'bg-go-tint text-go' : 'bg-warn-tint text-warn'

  return (
    <RevealList
      idPrefix="ai-arch"
      header={
        <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
          <span
            className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneStyle}`}
          >
            {label}
          </span>
          <h3 className="text-sm font-medium text-fg">{heading}</h3>
        </div>
      }
      rows={entries.map((entry) => ({
        id: entry.id,
        title: (
          <span className="text-sm font-medium text-fg">{entry.claim}</span>
        ),
        body: (
          <>
            <p className="measure text-sm leading-6 text-muted">{entry.body}</p>
            {entry.youJudge && (
              <div className="mt-3">
                <p className="t-label text-blueprint">What you still judge</p>
                <p className="measure mt-1 text-sm leading-6 text-muted">
                  {entry.youJudge}
                </p>
              </div>
            )}
          </>
        ),
      }))}
    />
  )
}

export function AIArchitecturePlays() {
  const toolsHeadingId = useId()

  return (
    <div className="space-y-4">
      <Callout
        kind="warn"
        title="Point it at options, not at &ldquo;design my system&rdquo;"
      >
        An agent asked to design a system will give you one: services, a queue,
        a cache, an event bus, a diagram with twelve boxes. Every one of those
        is on the list you just read as something not to build. The problem is
        not that the model is careless — it is that most architecture writing on
        the internet is about systems at a scale you do not have, and that is
        what it learned from.
        <span className="mt-2 block font-medium text-fg">
          So point it at options and at checking, never at &ldquo;design my
          system.&rdquo;
        </span>
      </Callout>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <PlayList
          label="Helps"
          tone="go"
          heading="Where it earns its place"
          entries={AI_PLAYS}
        />
        <PlayList
          label="Misleads"
          tone="warn"
          heading="Where it misleads — read this half twice"
          entries={AI_MISLEADS}
        />
      </div>

      <Card className="p-0">
        <p
          id={toolsHeadingId}
          className="border-b border-line px-5 py-3.5 text-sm font-medium text-fg"
        >
          Tools worth naming
        </p>
        <ul aria-labelledby={toolsHeadingId} className="divide-y divide-line">
          {AI_TOOLS.map((tool) => (
            <li
              key={tool.name}
              className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="shrink-0 font-mono text-[13px] text-fg sm:w-44">
                {tool.name}
              </span>
              <span className="text-sm leading-6 text-muted">{tool.body}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="border border-line bg-raised p-4 sm:p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg">
          <TriangleAlert className="size-4 shrink-0 text-warn" aria-hidden />
          What none of this replaces
        </p>
        <p className="measure text-sm leading-6 text-muted">
          Knowing which decisions are expensive, and being willing to build less
          than the model offers. It has no stake in maintaining what it
          proposes.
        </p>
      </div>
    </div>
  )
}

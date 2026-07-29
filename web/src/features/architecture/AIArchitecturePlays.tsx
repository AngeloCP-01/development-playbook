'use client'

import { useId, useState } from 'react'
import { ChevronDown, TriangleAlert } from 'lucide-react'
import { Card, Callout } from '@/components/ui'

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
 */

type Entry = {
  id: string
  claim: string
  body: string
}

const HELPS: Entry[] = [
  {
    id: 'options',
    claim: 'Generate the option set, then throw most of it away',
    body: 'The expensive failure is choosing without knowing the alternatives existed. Over-generation is the one habit that helps here — ask for six ways to model this, then argue them down yourself.',
  },
  {
    id: 'reversibility',
    claim: 'Pressure-test a reversibility claim',
    body: '”This is cheap to undo” has a falsifiable answer, and the test is the one at the top of this stage. Hand it the decision and the test, and make it argue the expensive case. A model is good at enumerating consequences and bad at deciding they are acceptable.',
  },
  {
    id: 'schema-gaps',
    claim: 'Read a schema for what is missing',
    body: 'Uniqueness scope, delete behaviour, and nullability are mechanical to check and easy for a person to skim past. Paste the DDL — the CREATE TABLE statements themselves — and ask what a hostile script could write into it.',
  },
  {
    id: 'adr-draft',
    claim: "Draft the ADR's first pass",
    body: 'From your own notes, while the alternatives are still fresh. You supply the reasons; it supplies the structure.',
  },
]

const MISLEADS: Entry[] = [
  {
    id: 'distribution',
    claim: 'It reaches for distribution by default',
    body: 'Microservices, queues and caching layers turn up unprompted, because that is what the training material is about. Each one is a real solution to a problem you do not yet have.',
  },
  {
    id: 'invented-scale',
    claim: 'It invents scale',
    body: 'Ask it to design for growth and it will design for growth you cannot describe, then justify the complexity with the number it made up.',
  },
  {
    id: 'schema-advice',
    claim: 'Schema advice arrives confident and context-free',
    body: 'It does not know your compliance boundary, your budget, or that this table is financial and legally has to survive a deletion.',
  },
  {
    id: 'unsupervised-adr',
    claim: 'An unsupervised ADR is worse than no ADR',
    body: 'It reads plausibly while recording reasons you never had. That is exactly the reconstruction this stage warns about, except it arrives eight months early, in writing, and you will believe it.',
  },
]

const TOOLS: { name: string; body: string }[] = [
  {
    name: 'context7',
    body: "The provider's own documentation rather than the model's memory of it — matters most for anything touching auth.",
  },
  {
    name: 'claude-mem',
    body: 'For "did I already decide this, and write it down."',
  },
  {
    name: 'A git worktree or sandbox',
    body: 'For the throwaway spike that answers a feasibility question without polluting the repo.',
  },
]

function PlayList({
  label,
  tone,
  heading,
  entries,
  openIds,
  toggle,
}: {
  label: string
  tone: 'go' | 'warn'
  heading: string
  entries: Entry[]
  openIds: Set<string>
  toggle: (id: string) => void
}) {
  const toneStyle =
    tone === 'go' ? 'bg-go-tint text-go' : 'bg-warn-tint text-warn'

  return (
    <Card className="p-0">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <span
          className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneStyle}`}
        >
          {label}
        </span>
        <h3 className="text-sm font-medium text-fg">{heading}</h3>
      </div>

      <ul className="divide-y divide-line">
        {entries.map((entry) => {
          const open = openIds.has(entry.id)
          const panelId = `ai-arch-${entry.id}`
          return (
            <li key={entry.id}>
              <h4>
                <button
                  type="button"
                  onClick={() => toggle(entry.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1 text-sm font-medium text-fg">
                    {entry.claim}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h4>

              {open && (
                <div
                  id={panelId}
                  className="border-t border-line bg-sunken px-5 py-4"
                >
                  <p className="measure text-sm leading-6 text-muted">
                    {entry.body}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function AIArchitecturePlays() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const toolsHeadingId = useId()

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

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
          entries={HELPS}
          openIds={openIds}
          toggle={toggle}
        />
        <PlayList
          label="Misleads"
          tone="warn"
          heading="Where it misleads — read this half twice"
          entries={MISLEADS}
          openIds={openIds}
          toggle={toggle}
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
          {TOOLS.map((tool) => (
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
